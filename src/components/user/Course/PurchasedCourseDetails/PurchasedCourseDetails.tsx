import React, { useState } from "react";
import Modules from "./Modules"; // Import the Modules component
import { ToastContainer } from "react-toastify";
import {
  CreateCourseState,
  ICreateCourse1,
  ICreateCourse2,
} from "../../../../components/Interfaces/CourseInterface/ICreateCourse";
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import { courseEndpoint } from "../../../../constraints/courseEndpoints";

import { useDispatch } from "react-redux";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCookie } from "../../../../utils/cookieManager";
import { Module } from "module";

interface Module {
    name: string;
    description: string;
    lessons: Array<Lesson>;
  }
  
  interface Lesson {
    title: string;
    video: File | null | string;
    description: string;
    questions?: questions;
  }
  
  interface questions {
    questionText: string;
    options: string[];
    correctAnswer: string;
  }
  
  const initialModulesState: CreateCourseState = {
    Modules: [],
  };
  
  function CoursePurchasedCourseDetailsDetails() {
    const [isLoading, setIsLoading] = useState(false);
    const [courseData, setCourseData] = useState<ICreateCourse1 | null>(null);
    const [tutorId, setTutorId] = useState();
    // const courseData = useSelector((state: RootState) => state.createCourseData.createCourse);
    const dispatch = useDispatch();
    const [benefits_prerequisites, setbenefits_prerequisites] =
      useState<ICreateCourse2 | null>(null);
    // const benifits_prerequisites = useSelector((state: RootState) => state.createCourseData.createCourse2);
    const [totalLessons, setTotalLessons] = useState();
    const [modules, setModules] =
      useState<CreateCourseState>(initialModulesState);
    // const modules :CreateCourseState | null = useSelector((state:RootState) => state.createCourseData.addLessons);
  
    const { id } = useParams<{ id: string }>();
  
    useEffect(() => {
      if (id) {
        const fetchCourseDetails = async () => {
          try {
            setIsLoading(true);
            const userId = getCookie("userId");
            console.log();
            const response = await axios.get(courseEndpoint.fetchCourseDetails, {
              params: { id, userId },
            });
            setTutorId(response.data.courseData.tutorId);
  
            console.log(response.data.courseData, "course ");
  
            const theCourseData: ICreateCourse1 = {
              thumbnail: response.data.courseData.thumbnail,
              courseTitle: response.data.courseData.courseTitle,
              courseDescription: response.data.courseData.courseDescription,
              coursePrice: response.data.courseData.coursePrice,
              discountPrice: response.data.courseData.discountPrice,
              courseCategory: response.data.courseData.courseCategory,
              courseLevel: response.data.courseData.courseLevel,
              demoURL: response.data.courseData.demoURL,
              courseId: response.data.courseData._id,
            };
  
            setCourseData(theCourseData);
  
            const courseDetails: ICreateCourse2 = {
              prerequisites:
                response.data.courseData.benefits_prerequisites.prerequisites,
              benefits: response.data.courseData.benefits_prerequisites.benefits,
            };
            setbenefits_prerequisites(courseDetails);
            const createCourseState: CreateCourseState = {
              Modules: response.data.courseData.Modules.map((module: Module) => ({
                name: module.name,
                description: module.description,
                lessons: module.lessons.map((lesson) => ({
                  title: lesson.title,
                  video: lesson.video, // Video can be a File, null, or URL string
                  description: lesson.description,
                  questions: lesson.questions, // Include questions if they exist
                })),
              })),
            };
            const modulesLength = response.data.courseData.Modules.length;
            const totalLessonsCount = response.data.courseData.Modules.reduce(
              (acc: any, module: any) => {
                return acc + module.lessons.length;
              },
              0
            ); // Initialize accumulator as 0
  
            console.log(modulesLength);
            console.log(totalLessonsCount);
  
            setModules(createCourseState);
            setTotalLessons(totalLessonsCount);
            console.log(courseData, "courseData");
  
            setIsLoading(false);
          } catch (error) {
            console.error("Error fetching course details:", error);
            setIsLoading(false);
          }
        };
  
        console.log(modules, "modules");
        // const totalLessons = response.data.courseData.Modules.reduce((count,Modules) => count + Modules.Lessons.length,0)
        // const totalLessons = response.data.courseData.sections.reduce((count,section)=>count +section.lessons.length,0);
  
        fetchCourseDetails();
      }
    }, [id, dispatch]);





  const [selectedVideo, setSelectedVideo] = useState<string | null>(null); // Store selected video URL


















  return (
    <div className="flex justify-between w-full gap-4  p-5">
      <div className="p-16 w-full">
        <div className="flex justify-between">
          <div>
            <h1 className="font-extrabold text-3xl">
              {courseData?.courseTitle}
            </h1>
            <h1 className="text-lg py-3 p-2">{courseData?.courseDescription}</h1>
          </div>
        </div>

        <div className="flex justify-between">
          <div>
            {/* Render video if selected, otherwise render image */}
            {selectedVideo ? (
              <video
                src={selectedVideo}
                controls
                className="w-full h-80 object-cover rounded-md"
              >
                Your browser does not support the video tag.
              </video>
            ) : (
              <img
                src={courseData?.thumbnail}
                alt="Thumbnail Preview"
                className="w-full h-80 object-cover rounded-md"
              />
            )}

            <h1 className="flex text-center items-center gap-2 text-sm pb-3 p-2">
              <IoCheckmarkDoneOutline /> {courseData?.courseLevel} level
            </h1>

            <div className="w-full flex justify-between p-5">
              <div>
                <h1 className="font-semibold py-2">
                  What will you get from this course?
                </h1>
                <ul>
                  {benefits_prerequisites?.benefits.map((benefit:any, index:number) => (
                    <li
                      key={index}
                      className="flex text-center items-center gap-2 text-sm px-2 pb-1"
                    >
                      <IoCheckmarkDoneOutline /> {benefit}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h1 className="font-semibold py-2">
                  What are the prerequisites for starting this course?
                </h1>
                <ul>
                  {benefits_prerequisites?.prerequisites.map(
                    (prerequisite:any, index:number) => (
                      <li
                        key={index}
                        className="flex text-center items-center gap-2 text-sm px-2 pb-1"
                      >
                        <IoCheckmarkDoneOutline /> {prerequisite}
                      </li>
                    )
                  )}
                </ul>
              </div>
            </div>
          </div>

          <div className="flex flex-col w-2/5">
            {/* Pass setSelectedVideo to Modules */}
            <Modules modules={modules} onVideoSelect={setSelectedVideo} />
          </div>
        </div>

        <ToastContainer />
      </div>
    </div>
  );
};

export default CoursePurchasedCourseDetailsDetails;
