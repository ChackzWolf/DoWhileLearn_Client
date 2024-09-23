import Modules from "./CourseDetails/Modules";
import {
  CreateCourseState,
  ICreateCourse1,
  ICreateCourse2,
} from "../../../components/Interfaces/CourseInterface/ICreateCourse";
import {
  setCreateCourseEmpty,
  toPrev,
} from "../../../redux/tutorSlice/CourseSlice/createCourseData";

import { courseEndpoint } from "../../../constraints/courseEndpoints";

import { useDispatch } from "react-redux";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // You can skip this if you're not using default styles
import { useEffect, useState } from "react";
import Loader from "../../../components/common/icons/loader";
import { useNavigate, useParams } from "react-router-dom";
import { getCookie } from "../../../utils/cookieManager";
import { IoCheckmarkDoneOutline } from "react-icons/io5";

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

function OverView() {
  const [isLoading, setIsLoading] = useState(false);
  const [courseData, setCourseData] = useState<ICreateCourse1 | null>(null);
  // const courseData = useSelector((state: RootState) => state.createCourseData.createCourse);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [benefits_prerequisites, setbenefits_prerequisites] = useState<ICreateCourse2 | null>(null);
  // const benifits_prerequisites = useSelector((state: RootState) => state.createCourseData.createCourse2);

  const [modules, setModules] = useState<CreateCourseState>(initialModulesState);
  // const modules :CreateCourseState | null = useSelector((state:RootState) => state.createCourseData.addLessons);

  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (id) {
      const fetchCourseDetails = async () => {
        try {
          setIsLoading(true);

          console.log();
          const response = await axios.get(courseEndpoint.fetchCourseDetails, {
            params: { id },
          });
          console.log(response.data, "course ");

          const theCourseData: ICreateCourse1 = {
            thumbnail: response.data.thumbnail,
            courseTitle: response.data.courseTitle,
            courseDescription: response.data.courseDescription,
            coursePrice: response.data.coursePrice,
            discountPrice: response.data.discountPrice,
            courseCategory: response.data.courseCategory,
            courseLevel: response.data.courseLevel,
            demoURL: response.data.demoURL,
            courseId: response.data._id
          };

          setCourseData(theCourseData);

          const courseDetails: ICreateCourse2 = {
            prerequisites: response.data.benefits_prerequisites.prerequisites,
            benefits: response.data.benefits_prerequisites.benefits,
          };
          setbenefits_prerequisites(courseDetails);
          const createCourseState: CreateCourseState = {
            Modules: response.data.Modules.map((module: Module) => ({
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
          setModules(createCourseState);

          console.log(courseData);

          setIsLoading(false);
        } catch (error) {
          console.error("Error fetching course details:", error);
          setIsLoading(false);
        }
      };

      fetchCourseDetails();
    }
  }, [id, dispatch]);

  console.log(modules, "kkkkkkkkkkkkkkkkkkkkk");






  const handleSubmit = async () => {
    try {
      setIsLoading(true);

      dispatch(setEditCourse(courseData));
      dispatch(setEditCourse2(benefits_prerequisites));
      dispatch(setEditLesson(modules))
      navigate('/tutor/courses/edit-course')
    } catch (err) {
      setIsLoading(false);
      toast.error(
        "Form submission failed! We are facing some internal error. Try again later",
        {
          position: "top-right",
          autoClose: 7000,
          className: "bg-red-500 text-white rounded-lg p-4",
          bodyClassName: "text-sm",
          progressClassName: "bg-red-200",
        }
      );
    }
  };

  return (
    <div className="w-full mx-24 m-10 gap-4">
      {isLoading ? <Loader /> : ""}

      <div className="flex h-64">
        <div className="w-1/2 h-64 px-10">
          <h1 className=" font-extrabold">{courseData?.courseTitle}</h1>
          <div className="relative w-full h-full md:h-40 lg:h-full rounded-md bg-gray-100 border-2 border-dashed border-gray-300 hover:bg-gray-200 cursor-pointer flex items-center justify-center m-2 self-center">
            <img
              src={courseData?.thumbnail}
              alt="Thumbnail Preview"
              className="w-full h-full object-cover rounded-md"
            />
          </div>
        </div>
        <div className="w-1/2 p-4 pt-9 h-full">
          <div className="h-5/6 mr-20">
              <h1>{courseData?.courseDescription}</h1>
          </div>
          
          {courseData?.discountPrice ? (
            <div className="bottom-0">
              <h1 className="text-gray-600 px-4 pt-7 py-2 line-through text-sm">
                Rs. {courseData.coursePrice}
              </h1>
              <h1 className=" rounded-lg px-4  font-bold">
                Rs. {courseData?.discountPrice}
              </h1>
            </div>
          ) : (
            <div className="bottom-0">
              <h1 className=" rounded-lg px-4 py-4 pt-9 font-bold ">
                Rs. {courseData?.coursePrice}
              </h1>
            </div>

          )}
        </div>
      </div>
      <div className="flex m-10 mt-16">
        <div className="w-1/2 h-28">
        <h1 className="flex text-center items-center gap-2 text-sm pb-3"><IoCheckmarkDoneOutline/> {courseData?.courseLevel} level</h1>
          <h1 className="font-semibold py-2">What will you get from this course?</h1>
          <ul>
            {benefits_prerequisites?.benefits.map((benifits) => (
              <li className="flex text-center items-center gap-2 text-sm px-2 pb-1"><IoCheckmarkDoneOutline/>     {benifits}</li>
            ))}
          </ul>
          <h1 className="font-semibold py-2">
            What are the prerequisitest for starting this course?
          </h1>
          <ul>
            {benefits_prerequisites?.prerequisites.map((prerequisites) => (
              <li className="flex text-center items-center gap-2 text-sm px-2 pb-1"><IoCheckmarkDoneOutline/> {prerequisites}</li>
            ))}
          </ul>
        </div>
        <Modules modules={modules} />
      </div>
      <div className="flex justify-between mx-20">
        <button
          className="py-2 px-8 bg-[#7C24F0] text-white font-semibold rounded-md hover:bg-[#6211cd] transition"
          onClick={() => {
            dispatch(toPrev());
          }}
        >
          {" "}
          previous
        </button>
        <button
          className=" right-0 bg-[#7C24F0] px-5 py-2 rounded-lg text-white font-bold hover:bg-[#6211cd]"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
      <ToastContainer />
    </div>
  );
}

export default OverView;
