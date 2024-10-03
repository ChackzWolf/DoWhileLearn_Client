import React, { useState } from "react";
import { IoIosArrowDropdown } from "react-icons/io";
import { CreateCourseState } from "../../../Interfaces/CourseInterface/ICreateCourse";
import { GoVideo } from "react-icons/go";


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
  onVideoSelect: (videoUrl: string) => void; // New prop for video selection
}> = ({ modules, onVideoSelect }) => {
  const [openModuleIndex, setOpenModuleIndex] = useState<number | null>(null);
  const [openLessonIndex, setOpenLessonIndex] = useState<{ [key: number]: number | null }>({});

  const toggleModule = (index: number) => {
    setOpenModuleIndex(openModuleIndex === index ? null : index);
    setOpenLessonIndex({});
  };

  const toggleLesson = (moduleIndex: number, lessonIndex: number, videoUrl: string) => {
    setOpenLessonIndex((prev) => ({
      ...prev,
      [moduleIndex]: prev[moduleIndex] === lessonIndex ? null : lessonIndex,
    }));
    onVideoSelect(videoUrl); // Pass the video URL to the parent component
  };

  return (
    <div className="w-full p-4 overflow-auto">
      {modules?.Modules.map((module, moduleIndex) => (
        <div key={moduleIndex} className="mb-4 border rounded-lg shadow-md">
          <button
            onClick={() => toggleModule(moduleIndex)}
            className="w-full flex justify-between items-center text-left text-base font-semibold bg-gray-200 hover:bg-gray-300 p-2 px-6 rounded-md"
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

          <div
            className={`transition-all duration-500 ease-in-out overflow-hidden ${
              openModuleIndex === moduleIndex ? "max-h-screen" : "max-h-0"
            }`}
          >
            <div className="mt-2 px-4">
              <p className="mb-4">{module.description}</p>
              {module.lessons.map((lesson, lessonIndex) => (
                <div key={lessonIndex} className="mb-2">
                  <button
                    onClick={() => {
                      if (typeof lesson.video === "string") {
                        toggleLesson(moduleIndex, lessonIndex, lesson.video);
                      } else {
                        console.log("No video available or invalid video format"); // Handle cases where video is not a string
                      }
                    }}
                    className="w-full text-left font-medium bg-gray-200 hover:bg-gray-300 p-2 rounded-md flex items-center gap-3"
                  >
                   <GoVideo className="text-[#7C24F0] text-2xl"/> {lesson.title}
                  </button>

                  <div
                    className={`transition-all duration-500 ease-in-out overflow-hidden ${
                      openLessonIndex[moduleIndex] === lessonIndex ? "max-h-screen" : "max-h-0"
                    }`}
                  >
                    {/* {openLessonIndex[moduleIndex] === lessonIndex && (
                      <div className="mt-2 p-2 border rounded-md bg-gray-50">
                        <p className="mb-2">{lesson.description}</p>
                      </div>
                    )} */}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Modules;
