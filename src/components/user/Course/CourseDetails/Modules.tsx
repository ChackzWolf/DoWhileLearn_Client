import React, { useState } from "react";
import { CreateCourseState } from "../../../Interfaces/CourseInterface/ICreateCourse";
import { IoIosArrowDropdown } from "react-icons/io";
import { FiPlay, FiBook, FiClock } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

export interface Module {
  name: string;
  description: string;
  lessons: Lesson[];
}

export interface Lesson {
  title: string;
  video: string |File|null;
  description: string;
  question?:any;
}
const Modules: React.FC<{ modules: CreateCourseState | null }> = ({ modules }) => {
  const [openModuleIndex, setOpenModuleIndex] = useState<number | null>(null);
  const [openLessonIndex, setOpenLessonIndex] = useState<{ [key: number]: number | null }>({});

  const toggleModule = (index: number) => {
    setOpenModuleIndex(openModuleIndex === index ? null : index);
    setOpenLessonIndex({});
  };

  
  const toggleLesson = (moduleIndex: number, lessonIndex: number) => {
    setOpenLessonIndex((prev) => ({
      ...prev,
      [moduleIndex]: prev[moduleIndex] === lessonIndex ? null : lessonIndex,
    }));
  };

  return (
    <div className="space-y-4 p-4">
      {modules?.Modules.map((module, moduleIndex) => (
        <motion.div
          key={moduleIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: moduleIndex * 0.1 }}
          className="border border-gray-200 rounded-lg overflow-hidden bg-white"
        >
          <button
            onClick={() => toggleModule(moduleIndex)}
            className="w-full transition-colors duration-200 hover:bg-gray-50"
          >
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-600 font-semibold">
                  {moduleIndex + 1}
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900">{module.name}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                    <span className="flex items-center">
                      <FiBook className="mr-1" />
                      {module.lessons.length} lessons
                    </span>
                    <span className="flex items-center">
                      <FiClock className="mr-1" />
                      {/* Assuming 15min per lesson */}
                      {module.lessons.length * 15} mins
                    </span>
                  </div>
                </div>
              </div>
              <motion.div
                animate={{ rotate: openModuleIndex === moduleIndex ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <IoIosArrowDropdown className="text-2xl text-gray-400" />
              </motion.div>
            </div>
          </button>

          <AnimatePresence>
            {openModuleIndex === moduleIndex && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="border-t border-gray-100"
              >
                <div className="p-4 bg-gray-50">
                  <p className="text-sm text-gray-600 mb-4">{module.description}</p>
                  <div className="space-y-3">
                    {module.lessons.map((lesson, lessonIndex) => (
                      <LessonAccordion
                        key={lessonIndex}
                        index={lessonIndex + 1}
                        lesson={lesson}
                        isOpen={openLessonIndex[moduleIndex] === lessonIndex}
                        onToggle={() => toggleLesson(moduleIndex, lessonIndex)}
                        moduleIndex={moduleIndex}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
};

const LessonAccordion: React.FC<{
  index: number;
  lesson: Lesson;
  isOpen: boolean;
  onToggle: () => void;
  moduleIndex: number;
}> = ({ index, lesson, isOpen, onToggle, moduleIndex }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white rounded-lg shadow-sm"
    >
      <button
        onClick={onToggle}
        className="w-full p-3 text-left transition-colors duration-200 hover:bg-gray-50 rounded-lg flex items-center justify-between group"
      >
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-100 text-purple-600 text-sm">
            {index}
          </div>
          <div>
            <h4 className="font-medium text-gray-900 group-hover:text-purple-600 transition-colors">
              {lesson.title}
            </h4>
            <div className="flex items-center text-xs text-gray-500 mt-1">
              <FiPlay className="mr-1" />
              <span>15 mins</span>
            </div>
          </div>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <IoIosArrowDropdown className="text-xl text-gray-400 group-hover:text-purple-600 transition-colors" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4 text-sm text-gray-600 bg-gray-50 rounded-b-lg">
              <p>{lesson.description}</p>
              {/* {lesson.video && (
                <div className="mt-3 flex items-center text-purple-600 text-sm">
                  <FiPlay className="mr-2" />
                  <span>Preview available</span>
                </div>
              )} */}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Modules;