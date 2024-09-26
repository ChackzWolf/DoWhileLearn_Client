import Modules from "./CourseDetails/Modules";
import {
  CreateCourseState,
  ICreateCourse1,
  ICreateCourse2,
} from "../../../components/Interfaces/CourseInterface/ICreateCourse";
import {loadStripe} from '@stripe/stripe-js'

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
import { userEndpoint } from "../../../constraints/userEndpoints";
import { BsFillCartCheckFill,BsCart } from "react-icons/bs";
import { setIn } from "formik";

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
  const [inCart, setInCart] = useState(false)
  // const courseData = useSelector((state: RootState) => state.createCourseData.createCourse);
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
          const userId = getCookie('userId');
          console.log();
          const response = await axios.get(courseEndpoint.fetchCourseDetails, {
            params: { id,userId },
          });
          console.log(response.data.fetchedCourseData, "course ");
          setInCart(response.data.inCart);
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
            prerequisites: response.data.courseData.benefits_prerequisites.prerequisites,
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


  // const handlePayement=async (courseId:string)=>{
  //   try {
  //     const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
      
  //     const data={
  //       courseId:courseData._id,
  //       userId:user.id,
  //       tutorId:courseData.tutorId,
  //       category:courseData.category,
  //       thumbnail:courseData.thumbnail,
  //       title:courseData.title,
  //       price:courseData.price,
  //       level:courseData.level,
  //       totalLessons:totalLessons,
  //       discourtPrice:courseData.discountPrice,
       

      // }
      

  //     console.log("course Idddd",courseId,"userID",user.id);


  //     // payement API be completed
  //     const response =  await userAxios.post(userEndpoints.makepayement,data);
  //     console.log('hayyyy stripe',response.data);

  //     const  sessionId = response.data.sessionId;

  //     if(stripe && sessionId){
  //       const result = await stripe.redirectToCheckout({sessionId});

  //       if(result.error){
  //         toast.error(result.error.message)
  //       }
  //     }else{
  //       toast.error("Stripe could not be loaded or session ID is missing.")
  //     }
      

  //   } catch (error) {
  //     toast.error("Couldnt buy Course")
  //   }
  // }


  const handleAddToCart = async() => {
      const userId = getCookie('userId')
      console.log(userId,'addtocart clicked')

      if(userId && userId !== "undefined"){
        const response = await axios.post(userEndpoint.addToCart,{courseId:id,userId})
        if(response.data.inCart){
          setInCart(true)
        }else{
          setInCart(false)
        }
        console.log(response,'addto cart response')
      }else{
        console.log('else')
        navigate('/login/user')
      }
      
  }

  return (
    <div className=" flex justify-between w-full  gap-4 px-24 mt-16 p-5">
      {isLoading ? <Loader /> : ""}
      <div className="p-16 w-3/4 ">
        <div className="flex justify-between">
          <div className="">
            <h1 className=" font-extrabold text-3xl">
              {courseData?.courseTitle}
            </h1>
            <h1 className=" text-lg py-3 p-2">{courseData?.courseDescription}</h1>
          </div>
        </div>
        <div className="flex flex-col ">
        <h1 className="flex text-center items-center gap-2 text-sm pb-3 p-2">
              <IoCheckmarkDoneOutline /> {courseData?.courseLevel} level
            </h1>
          <div className="w-full flex justify-between p-5">
            <div>
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
            </div>
            <div>
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
          </div>
          <Modules modules={modules} />
        </div>
        <ToastContainer />
      </div>
      <div className="w-1/3 h-64 sticky top-36">
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
            <button className=" right-0  px-4 py-1 rounded-lg text-[#7C24F0] font-extrabold text-2xl hover:shadow-[#6211cd] transition-all" onClick = {()=>handleAddToCart()}>
              {inCart?<BsFillCartCheckFill />:<BsCart />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseDetails;
