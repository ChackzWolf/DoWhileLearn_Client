import React, { useState } from "react";
import { CreateCourseState } from "../../../Interfaces/CourseInterface/ICreateCourse";
import { IoIosArrowDropdown } from "react-icons/io";

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

const Modules: React.FC<{ modules: CreateCourseState | null }> = ({ modules }) => {
  const [openModuleIndex, setOpenModuleIndex] = useState<number | null>(null); // Track which module is open
  const [openLessonIndex, setOpenLessonIndex] = useState<{ [key: number]: number | null }>({}); // Track which lesson is open

  const toggleModule = (index: number) => {
    setOpenModuleIndex(openModuleIndex === index ? null : index); // Toggle module
    setOpenLessonIndex({}); // Close all lessons when a module is collapsed
  };

  const toggleLesson = (moduleIndex: number, lessonIndex: number) => {
    setOpenLessonIndex((prev) => ({
      ...prev,
      [moduleIndex]: prev[moduleIndex] === lessonIndex ? null : lessonIndex,
    }));
  };

  return (
    <div className="h-1/2 w-full p-4 overflow-auto">
      {modules?.Modules.map((module, moduleIndex) => (
        <div key={moduleIndex} className="mb-4 border rounded-lg shadow-md">
          <button
            onClick={() => toggleModule(moduleIndex)}
            className="w-full flex justify-between items-center text-left text-xl font-bold bg-gray-200 hover:bg-gray-300 p-2 px-6 rounded-md"
          >
            {module.name}
            <span
              className={`transform transition-transform duration-300 mx-2 text-2xl ${
                openModuleIndex === moduleIndex ? "rotate-180" : ""
              }`}
            >
              <IoIosArrowDropdown />
            </span>
          </button>

          {/* Transition for module collapse */}
          <div
            className={`transition-all duration-500 ease-in-out overflow-hidden ${
              openModuleIndex === moduleIndex ? "max-h-screen" : "max-h-0"
            }`}
          >
            <div className="mt-2 px-4">
              <p className="mb-4">{module.description}</p>
              {module.lessons.map((lesson, lessonIndex) => (
                <LessonAccordion
                  key={lessonIndex}
                  lesson={lesson}
                  isOpen={openLessonIndex[moduleIndex] === lessonIndex}
                  onToggle={() => toggleLesson(moduleIndex, lessonIndex)}
                />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const LessonAccordion: React.FC<{
  lesson: CreateCourseState["Modules"][number]["lessons"][number];
  isOpen: boolean;
  onToggle: () => void;
}> = ({ lesson, isOpen, onToggle }) => {
  return (
    <div className="mb-2">
      <button
        onClick={onToggle}
        className="w-full text-left font-medium bg-gray-200 hover:bg-gray-300 p-2 rounded-md "
      >
        {`${lesson.title}`}
      </button>

      {/* Transition for lesson collapse */}
      <div
        className={`transition-all duration-500 ease-in-out overflow-hidden ${
          isOpen ? "max-h-screen" : "max-h-0"
        }`}
      >
        {isOpen && (
          <div className="mt-2 p-2 border rounded-md bg-gray-50 flex justify-between">
            <div className="w-1/2">
              <p className="mb-2">{lesson.description}</p>
            </div>

            {/* Uncomment this if you want to add video preview */}
            {/* <div className="w-1/3">
              {typeof lesson.video === "string" ? (
                <video className="w-full" controls>
                  <source src={lesson.video} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <p>No video available</p>
              )}
            </div> */}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modules;
