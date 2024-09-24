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
import "react-toastify/dist/ReactToastify.css";
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

function CourseDetails() {
  const [isLoading, setIsLoading] = useState(false);
  const [courseData, setCourseData] = useState<ICreateCourse1 | null>(null);
  // const courseData = useSelector((state: RootState) => state.createCourseData.createCourse);
  const dispatch = useDispatch();
  const [benefits_prerequisites, setbenefits_prerequisites] =
    useState<ICreateCourse2 | null>(null);
  // const benifits_prerequisites = useSelector((state: RootState) => state.createCourseData.createCourse2);

  const [modules, setModules] =
    useState<CreateCourseState>(initialModulesState);
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
            courseId: response.data._id,
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

  return (
    <div className="w-full  gap-4">
      {isLoading ? <Loader /> : ""}

      <div className="w-1/3 h-64 px-10 fixed right-28">
          <div className="relative w-full h-full md:h-40 lg:h-full rounded-md bg-gray-100 border-2 border-dashed border-gray-300 hover:bg-gray-200 cursor-pointer flex items-center justify-center m-2 self-center">
            <img
              src={courseData?.thumbnail}
              alt="Thumbnail Preview"
              className="w-full h-full object-cover rounded-md"
            />
          </div>

          <div className="h-full px-5">
            {courseData?.discountPrice ? (
              <div className="bottom-0 flex gap-2 pb-3">
                <h1 className=" rounded-lg font-bold">
                  Rs. {courseData?.discountPrice}
                </h1>
                <h1 className="text-gray-600 line-through text-sm">
                  Rs. {courseData.coursePrice}
                </h1>
              </div>
            ) : (
              <div className="bottom-0">
                <h1 className=" rounded-lg font-bold ">
                  Rs. {courseData?.coursePrice}
                </h1>
              </div>
            )}

<div className=" flex w-full gap-3">
<button className=" right-0 bg-[#7C24F0] px-4 py-1 rounded-lg text-white font-semibold hover:bg-[#6211cd] transition-all ">
              Buy
          </button>
<button className=" right-0 bg-[#7C24F0] px-4 py-1 rounded-lg text-white font-semibold hover:bg-[#6211cd] transition-all">
              Add to cart
</button>
</div>
          </div>



        </div>
      <div className="p-16">
      
      <div className="flex justify-between mx-24 m-10">
        <div className="mr-20"> 
          <h1 className=" font-extrabold text-3xl">{courseData?.courseTitle}</h1>
          <h1 className=" text-lg py-3">{courseData?.courseDescription}</h1>
        </div>

      </div>
      <div className="flex flex-col px-24 mt-16">
        <div className="w-1/2 ">
          <h1 className="flex text-center items-center gap-2 text-sm pb-3">
            <IoCheckmarkDoneOutline /> {courseData?.courseLevel} level
          </h1>
          <h1 className="font-semibold py-2">
            What will you get from this course?
          </h1>
          <ul>
            {benefits_prerequisites?.benefits.map((benifits) => (
              <li className="flex text-center items-center gap-2 text-sm px-2 pb-1">
                <IoCheckmarkDoneOutline /> {benifits}
              </li>
            ))}
          </ul>
          <h1 className="font-semibold py-2">
            What are the prerequisitest for starting this course?
          </h1>
          <ul>
            {benefits_prerequisites?.prerequisites.map((prerequisites) => (
              <li className="flex text-center items-center gap-2 text-sm px-2 pb-1">
                <IoCheckmarkDoneOutline /> {prerequisites}
              </li>
            ))}
          </ul>
          
        </div>
        <Modules modules={modules} />

      </div>
      <ToastContainer />
      </div>
    </div>
  );
}

export default CourseDetails;
