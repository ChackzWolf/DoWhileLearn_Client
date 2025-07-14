import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import '@vime/core/themes/default.css';
import { MdSkipNext, MdSkipPrevious, MdPlayArrow, MdPause } from 'react-icons/md';
import { useCourse } from '../PurchasedCourseDetails/CourseContext';
import { getCookie } from '../../../../utils/cookieManager';
import { useParams } from 'react-router-dom';
import userAxios from '../../../../utils/axios/userAxios.config';
import { userEndpoint } from '../../../../constraints/userEndpoints';
import { debounce } from 'lodash';

type Props = {
  courseName?:string;
  tutorName? :string;
  videoUrl: string;
  subtitleUrl?: string;
  lessonLength?: number | null;
  currentLessonIndex?: number | null;
  setCurrentLessonIndex?: (num: number) => void | null;
  onProgress?: (progress: number) => void;
  onEnded?: () => void;
  autoAdvance?: boolean;
};

const VideoPlayer: React.FC<Props> = ({
  courseName,
  tutorName,
  videoUrl,
  subtitleUrl,
  currentLessonIndex = null,
  lessonLength = null,
  setCurrentLessonIndex = null,
  onProgress,
  onEnded,
  autoAdvance = false,
}) => {
  const userId = getCookie('userId')
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const { id } = useParams<{ id: string }>();
  const [qualityLevels, setQualityLevels] = useState<any[]>([]);
  const [currentQuality, setCurrentQuality] = useState<number>(-1); // -1 means auto
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [savedTime, setSavedTime] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { setCurrentLesson ,selectedVideoDetails, setCourseStatus} = useCourse();
  const [hasMarkedComplete, setHasMarkedComplete] = useState(false);



  // Load video and HLS setup
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Clean up previous HLS instance
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    // Check for saved progress
    const savedProgress = localStorage.getItem(`video-progress-${videoUrl}`);
    if (savedProgress) {
      setSavedTime(parseFloat(savedProgress));
    } else {
      setSavedTime(null);
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Native HLS support (Safari)
      video.src = videoUrl;
    } else if (Hls.isSupported()) {
      const hls = new Hls({
        maxMaxBufferLength: 60, // Improve buffering for longer playback
      });
      hlsRef.current = hls;
      
      hls.loadSource(videoUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setQualityLevels(hls.levels);
      });

      hls.on(Hls.Events.LEVEL_SWITCHED, (_event, data) => {
        setCurrentQuality(data.level);
      });

      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              // Try to recover network error
              console.log('Network error detected, trying to recover...');
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.log('Media error detected, trying to recover...');
              hls.recoverMediaError();
              break;
            default:
              // Cannot recover, destroy and recreate
              hls.destroy();
              initHls();
              break;
          }
        }
      });
    } else {
      console.error('HLS is not supported in this browser.');
    }

    // Initialize event listeners
    video.addEventListener('loadedmetadata', handleMetadataLoaded);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('play', () => setIsPlaying(true));
    video.addEventListener('pause', () => setIsPlaying(false));
    video.addEventListener('ended', handleVideoEnded);

    // Clean up
    return () => {
      video.removeEventListener('loadedmetadata', handleMetadataLoaded);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('play', () => setIsPlaying(true));
      video.removeEventListener('pause', () => setIsPlaying(false));
      video.removeEventListener('ended', handleVideoEnded);
      
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
    };
  }, [videoUrl]);

  // Handle saved time (resume playback)
  useEffect(() => {
    const video = videoRef.current;
    if (video && savedTime !== null && savedTime > 0) {
      // Only restore if we haven't watched > 95% of the video
      if (savedTime < (duration * 0.95) || duration === 0) {
        video.currentTime = savedTime;
        setSavedTime(null);
      }
    }
  }, [savedTime, duration]);

  // Helper function to initialize HLS
  const initHls = () => {
    if (!Hls.isSupported() || !videoRef.current) return;
    
    const hls = new Hls();
    hlsRef.current = hls;
    hls.loadSource(videoUrl);
    hls.attachMedia(videoRef.current);
  };

  const handleMetadataLoaded = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const currentTime = videoRef.current.currentTime;
      const progress = (currentTime / videoRef.current.duration) * 100;
      if (progress >= 95 && !hasMarkedComplete && lessonLength != null) {
        setHasMarkedComplete(true);
        debouncedMarkComplete()
      }
      setCurrentTime(currentTime);

      
      // Save progress every 5 seconds
      if (Math.floor(currentTime) % 5 === 0) {
        localStorage.setItem(`video-progress-${videoUrl}`, currentTime.toString());
      }
      
      // Call onProgress callback if provided
      if (onProgress) {
        const progress = (currentTime / duration) * 100;
        onProgress(progress);
      }
    }
  };

  const debouncedMarkComplete = debounce(async() => {


    const data = {
      userId,
      courseId: id,
      courseName,
      tutorName,
      totalLessons:lessonLength,
      moduleIndex: selectedVideoDetails?.moduleIndex || 0,
      lessonIndex: selectedVideoDetails?.lessonIndex || 0,
      
    }

    console.log(' updating completed lesson', data)
    const response = await userAxios.post(userEndpoint.updateCompletedLesson, data)
    setCourseStatus(response.data.data);
    setHasMarkedComplete(false)


  }, 3000); // 1 second delay



  const handleVideoEnded = () => {
    // Clear saved progress when video completes
    localStorage.removeItem(`video-progress-${videoUrl}`);
    
    if (onEnded) {
      onEnded();
    }
    
    // Auto-advance to next lesson if enabled
    if (autoAdvance && setCurrentLessonIndex && currentLessonIndex !== null && lessonLength !== null) {
      if (currentLessonIndex < lessonLength - 1) {
        setCurrentLessonIndex(currentLessonIndex + 1);
      }
    }
  };

  const handleQualityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedQuality = parseInt(event.target.value, 10);
    if (hlsRef.current) {
      hlsRef.current.currentLevel = selectedQuality;
      setCurrentQuality(selectedQuality);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  const handleVideoSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekTime = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  const goToNextLesson = () => {
    if (setCurrentLessonIndex && currentLessonIndex !== null && lessonLength !== null) {
      if (currentLessonIndex < lessonLength - 1) {
        setCurrentLesson(currentLessonIndex + 1)
        setCurrentLessonIndex(currentLessonIndex + 1);
      }
    }
  };

  const goToPreviousLesson = () => {
    if (setCurrentLessonIndex && currentLessonIndex !== null) {
      if (currentLessonIndex > 0) {
        setCurrentLesson(currentLessonIndex - 1)
        setCurrentLessonIndex(currentLessonIndex - 1);
      }
    }
  };


  // console.log(selectedVideoDetails, 'selected video details')
  return (
    <div 
      ref={containerRef}
      className={`relative w-full ${!isFullscreen ? 'pt-[56.25%]' : 'h-screen'}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <video
        ref={videoRef}
        className="absolute top-0 left-0 w-full h-full"
        poster="/media/poster.png"
        preload="metadata"
        playsInline
        autoPlay
      >
        {subtitleUrl && (
          <track
            default
            kind="subtitles"
            src={subtitleUrl}
            srcLang="en"
            label="English"
          />
        )}
      </video>
      
      {/* Custom controls that show on hover */}
      <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
        {/* Progress bar */}
        <div className="flex items-center mb-2">
          <span className="text-white text-sm mr-2">{formatTime(currentTime)}</span>
          <input
            type="range"
            min="0"
            max={duration || 100}
            value={currentTime}
            onChange={handleVideoSeek}
            className="w-full h-1 bg-gray-500 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, white ${(currentTime / duration) * 100}%, gray ${(currentTime / duration) * 100}%)`,
            }}
          />
          <span className="text-white text-sm ml-2">{formatTime(duration)}</span>
        </div>
        
        {/* Control buttons */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            {/* Play/Pause button */}
            <button
              onClick={togglePlay}
              className="text-white text-2xl hover:text-gray-300 focus:outline-none"
            >
              {isPlaying ? <MdPause /> : <MdPlayArrow />}
            </button>
            
            {/* Navigation buttons */}
            {setCurrentLessonIndex !== null && currentLessonIndex !== null && lessonLength !== null && (
              <div className="flex space-x-2">
                <button
                  onClick={goToPreviousLesson}
                  disabled={currentLessonIndex === 0}
                  className="transition-all px-2 py-1 text-white rounded-full disabled:opacity-50 text-xl hover:bg-gray-700/50"
                >
                  <MdSkipPrevious />
                </button>
                <button
                  onClick={goToNextLesson}
                  disabled={currentLessonIndex === lessonLength - 1}
                  className="transition-all px-2 py-1 text-white rounded-full disabled:opacity-50 text-xl hover:bg-gray-700/50"
                >
                  <MdSkipNext />
                </button>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Quality selector */}
            {qualityLevels.length > 0 && (
              <select
                onChange={handleQualityChange}
                value={currentQuality}
                className="bg-black/50 text-white text-sm p-1 rounded border border-gray-600 appearance-none"
              >
                <option value="-1">Auto</option>
                {qualityLevels.map((level, index) => (
                  <option key={index} value={index}>
                    {level.height}p
                  </option>
                ))}
              </select>
            )}
            
            {/* Fullscreen button */}
            <button
              onClick={toggleFullscreen}
              className="text-white hover:text-gray-300 focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {isFullscreen ? (
                  <>
                    <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
                  </>
                ) : (
                  <>
                    <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;