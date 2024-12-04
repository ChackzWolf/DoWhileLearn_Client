import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import '@vime/core/themes/default.css';

type Props = {
  videoUrl: string;
  subtitleUrl?: string;
};

const VideoPlayer: React.FC<Props> = ({ videoUrl, subtitleUrl }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [qualityLevels, setQualityLevels] = useState<any[]>([]);
  const [currentQuality, setCurrentQuality] = useState<number>(-1); // -1 means auto
  const [isHovered, setIsHovered] = useState<boolean>(false);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        // This will work in Safari, where HLS is natively supported
        video.src = videoUrl;
      } else if (Hls.isSupported()) {
        // This will work in other browsers with hls.js
        const hls = new Hls();
        hls.loadSource(videoUrl);
        hls.attachMedia(video);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          setQualityLevels(hls.levels);
        });

        hls.on(Hls.Events.LEVEL_SWITCHED, (_event, data) => {
          setCurrentQuality(data.level);
        });

        video.addEventListener('qualitychange', (event: any) => {
          const selectedQuality = event.detail.quality;
          if (selectedQuality === -1) {
            hls.currentLevel = -1; // auto
          } else {
            hls.currentLevel = selectedQuality;
          }
        });
      } else {
        console.error('HLS is not supported in this browser.');
      }
    }
  }, [videoUrl]);

  const handleQualityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedQuality = parseInt(event.target.value, 10);
    const qualityChangeEvent = new CustomEvent('qualitychange', {
      detail: { quality: selectedQuality },
    });
    videoRef.current?.dispatchEvent(qualityChangeEvent);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div 
      className="relative w-full pt-[56.25%]" 
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <video
        ref={videoRef}
        controls
        className="absolute top-0 left-0 w-full h-full"
        poster="/media/poster.png"
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
      
      {((isHovered && window.innerWidth > 768) || window.innerWidth <= 768) && qualityLevels.length > 0 && (
        <div className="absolute top-1 right-2 z-10 ">
          <select
            onChange={handleQualityChange}
            value={currentQuality}
            className="bg-gray-800 text-white p-0.5 font-semibold  rounded-lg border border-gray-600 appearance-none opacity-50"
          >
            <option value="-1">Auto</option>
            {qualityLevels.map((level, index) => (
              <option key={index} value={index}>
                {level.height}p
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
