import React, { useEffect, useState } from "react";
import { IoIosArrowDropdown } from "react-icons/io";
import { CreateCourseState } from "../../../Interfaces/CourseInterface/ICreateCourse";
import { GoVideo } from "react-icons/go";
import { motion, AnimatePresence } from "framer-motion";
import { FaCode } from "react-icons/fa6";
import { MdOutlineQuiz } from "react-icons/md";
import userAxios from "../../../../utils/axios/userAxios.config";
import { userEndpoint } from "../../../../constraints/userEndpoints";
import { useParams } from "react-router-dom";
import { getCookie } from "../../../../utils/cookieManager";
import { useCourse } from "./CourseContext";
import { CiBookmarkCheck } from "react-icons/ci";
import Spinner from "../../../common/icons/SpinnerSmall";


// export interface Module {
//   name: string;
//   description: string;
//   lessons: Lesson[];
// }

// export interface Lesson {
//   title: string;
//   video: string;
//   description: string;
// }



const Modules: React.FC<{
  modules: CreateCourseState 
  videoIndex: number
  onVideoSelect: (videoUrl: string) => void;
  totalLesson : (num:number)=>void;
  setVideoIndex : (num:number)=>void;
  onSelectDescription: (description:string) => void ;
  onQuizSelect:(questions:any)=>void;
  onCodeSelect:(questions:any)=>void;
}> = ({ modules, onVideoSelect, onSelectDescription, onCodeSelect,setVideoIndex,onQuizSelect, videoIndex, totalLesson }) => {
  const [openModuleIndex, setOpenModuleIndex] = useState<number | null>(0);
  const { setSelectedVideoDetails, selectedVideoDetails, currentLesson, courseStatus } = useCourse();
  const { id } = useParams<{ id: string }>();
  const userId = getCookie('userId')
  const [isLoading, setIsLoading ] = useState<number[] | null>(null)
  const toggleModule = (index: number) => {
    setOpenModuleIndex(openModuleIndex === index ? null : index);
    // setOpenLessonIndex({});
  };

  const toggleLesson = async(moduleIndex: number, lessonIndex: number, videoUrl: string, description:string, totalLessons:number) => {
    setIsLoading([moduleIndex,lessonIndex])
    try {
      

    console.log('trig toggle lesson')
    
    const data = {
      userId,
      courseId:id,
      moduleIndex: moduleIndex,
      lessonIndex: lessonIndex,
    }
    const video = {
      moduleIndex,
      lessonIndex,
      videoUrl,
      description,
    }
    setSelectedVideoDetails(video)
    const response = await userAxios.post(userEndpoint.updateCurrentLesson ,data );





    console.log(response.data, 'udpated current course.');
    onVideoSelect(videoUrl); // Pass the video URL to the parent component
    onSelectDescription(description)
    setVideoIndex(response.data.lesson  - 1)
    totalLesson(totalLessons)
  } catch (error) {
      
  }finally{
    setIsLoading(null)

  }
  };

  useEffect(()=> {
    const handleIndexChange=()=>{
      const data = getLessonVideo(modules,selectedVideoDetails?.moduleIndex || 0, videoIndex);
      if(data?.videoUrl){


        console.log('currentModuleIndex',selectedVideoDetails?.moduleIndex)
        console.log('current lesson Index',currentLesson)
        const video = {
          moduleIndex: selectedVideoDetails?.moduleIndex || 0,
          lessonIndex: currentLesson || 0,
          videoUrl: data.videoUrl,
          description: data.description,
        }
        setSelectedVideoDetails(video)
      }
    }
    handleIndexChange()
  },[currentLesson])





useEffect(()=> {
  const handleIndexChange=()=>{
    const data = getLessonVideo(modules,openModuleIndex || 0, videoIndex);
    if(data?.videoUrl){
      
      onVideoSelect(data.videoUrl); // Pass the video URL to the parent component
      onSelectDescription(data.description)
    }
  }
  handleIndexChange()
},[videoIndex])


const getLessonVideo = (
  state: CreateCourseState,
  moduleIndex: number,
  lessonIndex: number
): {videoUrl:string | null, description:string}|undefined => {
  // Ensure the Modules array exists and moduleIndex is within bounds
  if (
    state.Modules &&
    moduleIndex >= 0 &&
    moduleIndex < state.Modules.length
  ) {
    const module = state.Modules[moduleIndex];

    // Ensure the lessons array exists and lessonIndex is within bounds
    if (
      module.lessons &&
      lessonIndex >= 0 &&
      lessonIndex < module.lessons.length
    ) {
      return {
        videoUrl: module.lessons[lessonIndex].video,
        description : module.lessons[lessonIndex].description,
      };
    }
  }


  // Return undefined if indices are invalid or video is not found
  return undefined;
};

  const openCode = (question:any)=> {
    console.log('trig trig trig', question)
      onCodeSelect(question);
  }
  const openQuiz = (question:any)=>{
    console.log('trig quiz',question)
    onQuizSelect(question)
  }
  const isLessonComplete = (currentLessonIndex: number, currentModuleIndex: number) => {
    if (!courseStatus || !courseStatus.completedLessons) {
        console.error("courseStatus is undefined or has no completedLessons");
        return false;
    }
    return courseStatus.completedLessons.some(
        (lesson: any) => {
            console.log("Comparing with:", lesson);
            return lesson.module === currentModuleIndex && lesson.lesson === currentLessonIndex;
        }
    );
};
  
  console.log(courseStatus,'///////////////////// course status now //////////////////////')
  console.log(selectedVideoDetails, '/////////////////////////////// selecteed video details')
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-accent rounded-2xl p-4 top-16"
    >
      <h2 className="text-2xl font-bold mb-6 text-primary">Course Content</h2>
      <div className="space-y-4  overflow-y-auto">
        {modules?.Modules.map((module, moduleIndex) => (
          <motion.div
            key={moduleIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: moduleIndex * 0.1 }}
            className="border border-gray-200 rounded-xl overflow-hidden"
          >
            <motion.button
              whileHover={{ backgroundColor: "#f3f4f6" }}
              onClick={() => toggleModule(moduleIndex)}
              className="w-full flex justify-between items-center p-4 bg-accent"
            >
              <span className="font-medium text-gray-800 text-start">{module.name}</span>
              <motion.span
                animate={{ rotate: openModuleIndex === moduleIndex ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <IoIosArrowDropdown className="text-purple-600 text-xl" />
              </motion.span>
            </motion.button>

            <AnimatePresence>
              {openModuleIndex === moduleIndex && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-gray-50"
                >
                  <div className="p-4 space-y-2">
                    {module.lessons.map((lesson, lessonIndex) => (
                      <>
                      <motion.button
                        key={lessonIndex}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          if (typeof lesson.video === "string") {
                            toggleLesson(moduleIndex, lessonIndex, lesson.video, lesson.description, module.lessons.length);
                          }
                        }}
                        className={`w-full flex items-center justify-between gap-3 rounded-lg bg-accent ${lessonIndex === selectedVideoDetails?.lessonIndex && selectedVideoDetails.moduleIndex === moduleIndex ? "bg-purple-200":"bg-accent"} transition-colors`}
                      > 
                      
                        <div className="flex gap-3 m-3">
                          <GoVideo className="text-purple-600 text-xl flex-shrink-0" />
                          <span className="text-left text-gray-700 text-sm">
                            {lesson.title}
                          </span>
                        </div>

                        <div className="flex justify-end  mr-3">
                        {isLoading !== null && isLoading[0] === moduleIndex && isLoading[1] === lessonIndex ? <Spinner/> 
                         :  (        
                               isLessonComplete(lessonIndex+1, moduleIndex+1) && <CiBookmarkCheck className="text-2xl text-primary "/>
                            )
                        }
                       

                        </div>
                      </motion.button>
                      {lesson.questions ? lesson.questions.map((question,questionIndex)=>(
                       <motion.button
                       key={questionIndex}
                       whileHover={{ scale: 1.02 }}
                       whileTap={{ scale: 0.98 }}
                       className="w-full flex items-center gap-3 p-3 rounded-lg bg-accent hover:bg-gray-100 transition-colors"
                     >
                      
                      {question.type === 'QUIZ'? (
                            <div className="flex gap-3 w-full h-full"
                            onClick={()=>openQuiz(question)}>
                            <MdOutlineQuiz  className="text-purple-600 text-xl flex-shrink-0"/>
                            <span className="text-left text-gray-700 text-sm">
                                Quiz Challenge
                            </span>
                            </div>
                            )
                            :(
                            <div className="flex gap-3 w-full h-full"
                                  onClick={() => {
                                   
                                      openCode(question)
                                    
                                  }}>
                            <FaCode className="text-purple-600 text-xl flex-shrink-0"/>
                            <span className="text-left text-gray-700 text-sm">
                                Coding challenge
                            </span>
                            </div>
                            
                            
                            ) 
                      }
                      </motion.button>
                      )) : 'no questions'}
                      </>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
export default Modules;
