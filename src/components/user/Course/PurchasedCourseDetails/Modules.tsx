import React, { useState } from "react";
import { IoIosArrowDropdown } from "react-icons/io";
import { CreateCourseState } from "../../../Interfaces/CourseInterface/ICreateCourse";
import { GoVideo } from "react-icons/go";
import { motion, AnimatePresence } from "framer-motion";
import { FaClipboardQuestion } from "react-icons/fa6";
import { FaCode } from "react-icons/fa6";
import { MdOutlineQuiz } from "react-icons/md";


export interface Module {
  name: string;
  description: string;
  lessons: Lesson[];
}

export interface Lesson {
  title: string;
  video: string;
  description: string;
}

const Modules: React.FC<{
   modules: CreateCourseState | null
  onVideoSelect: (videoUrl: string) => void;
  onSelectDescription: (description:string) => void ;
  onCodeSelect:(questions:any)=>void;
}> = ({ modules, onVideoSelect, onSelectDescription, onCodeSelect }) => {
  const [openModuleIndex, setOpenModuleIndex] = useState<number | null>(null);
  const [openLessonIndex, setOpenLessonIndex] = useState<{ [key: number]: number | null }>({});

  const toggleModule = (index: number) => {
    setOpenModuleIndex(openModuleIndex === index ? null : index);
    setOpenLessonIndex({});
  };

  const toggleLesson = (moduleIndex: number, lessonIndex: number, videoUrl: string, description:string) => {
    setOpenLessonIndex((prev) => ({
      ...prev,
      [moduleIndex]: prev[moduleIndex] === lessonIndex ? null : lessonIndex,
    }));
    onVideoSelect(videoUrl); // Pass the video URL to the parent component
    onSelectDescription(description)
  };


  const openCode = (question:any)=> {
    console.log('trig trig trig')
      onCodeSelect(question);
  }
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-white rounded-2xl shadow-lg p-4 sticky top-16"
    >
      <h2 className="text-2xl font-bold mb-6 text-purple-600">Course Content</h2>
      <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
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
              className="w-full flex justify-between items-center p-4 bg-white"
            >
              <span className="font-medium text-gray-800">{module.name}</span>
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
                            toggleLesson(moduleIndex, lessonIndex, lesson.video, lesson.description);
                          }
                        }}
                        className="w-full flex items-center gap-3 p-3 rounded-lg bg-white hover:bg-gray-100 transition-colors"
                      >
                        <GoVideo className="text-purple-600 text-xl flex-shrink-0" />
                        <span className="text-left text-gray-700 text-sm">
                          {lesson.title}
                        </span>
                        
                      </motion.button>
                      {lesson.questions ? lesson.questions.map((question,questionIndex)=>(
                       <motion.button
                       key={lessonIndex}
                       whileHover={{ scale: 1.02 }}
                       whileTap={{ scale: 0.98 }}
                      //  onClick={() => {
                      //    if (typeof lesson.video === "string") {
                      //      toggleLesson(moduleIndex, lessonIndex, lesson.video, lesson.description);
                      //    }
                      //  }}
                       className="w-full flex items-center gap-3 p-3 rounded-lg bg-white hover:bg-gray-100 transition-colors"
                     >
                      
                      {question.type === 'QUIZ'? (
                            <>
                            <MdOutlineQuiz  className="text-purple-600 text-xl flex-shrink-0"/>
                            <span className="text-left text-gray-700 text-sm">
                                Quiz Challenge
                            </span>
                            </>
                            )
                            :(
                            <div className="flex gap-3"
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
