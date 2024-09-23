import React, { useState } from "react";
import { CreateCourseState } from "../../../Interfaces/CourseInterface/ICreateCourse"

// // Define the interface for questions if needed
// interface Questions {
//   // Define properties for questions
//   questionText: string;
//   options: string[];
//   correctOption: string;
// }

// // Use the provided interface for the state
// interface CreateCourseState {
//   Modules: Array<{
//     name: string;
//     description: string;
//     lessons: Array<{
//       title: string;
//       video: File | null | string;
//       description: string;
//       questions?: Questions;
//     }>;
//   }>;
// }

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
  return (
    <div className="w-1/2 h-1/2 p-4 overflow-auto">
      {modules?.Modules.map((module, moduleIndex) => (
        <div key={moduleIndex} className="mb-4 border p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-2">{module.name}</h2>
          <p className="mb-4">{module.description}</p>
          {module.lessons.map((lesson, lessonIndex) => (
            <LessonAccordion key={lessonIndex} lesson={lesson} />
          ))}
        </div>
      ))}
    </div>
  );
};

const LessonAccordion: React.FC<{ lesson: CreateCourseState['Modules'][number]['lessons'][number] }> = ({ lesson }) => {
    const [isOpen, setIsOpen] = useState(false);
  
    return (
      <div className="mb-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full text-left font-medium bg-gray-200 hover:bg-gray-300 p-2 rounded-md"
        >
          {`${lesson.title}`}
        </button>
        {isOpen && (
          <div className="mt-2 p-2 border rounded-md bg-gray-50 flex justify-between">
            <div className="w-1/2">
            <p className="mb-2">{lesson.description}</p>
            </div>
            
            <div className="w-1/3">
                    {typeof lesson.video === 'string' ? (
                      <video className="w-full" controls>
                        <source src={lesson.video} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    ) : lesson.video instanceof File ? (
                      <p>File type videos are not supported for previewing in this example.</p>
                    ) : (
                      <p>No video available</p>
                    )}
            </div>

           {/* Render questions if they exist */}



            
          </div>
        )}
        
      </div>

    );
  };
  

export default Modules;
