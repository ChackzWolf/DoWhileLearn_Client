import { RootState } from "../../../../redux/store/store"
import { useSelector } from "react-redux"
import Modules from "../CreateCourse/OverView/Modules";
import { CreateCourseState } from "../../../../components/Interfaces/TutorInterfaces/ICreateCourse";
import { setCreateCourseEmpty, toPrev } from "../../../../redux/tutorSlice/CourseSlice/createCourseData";
import { useDispatch } from "react-redux";
import axios from "axios";
import { courseEndpoint } from "../../../../constraints/courseEndpoints";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // You can skip this if you're not using default styles
import { useEffect, useState } from "react";
import Loader from "../../../common/icons/loader";
import { useNavigate, useParams } from "react-router-dom";
import { getCookie } from "../../../../utils/cookieManager";

export interface Course {
    _id: string;
    courseCategory: string;
    courseDescription: string;
    courseLevel: string;
    coursePrice: string;
    courseTitle: string;
    demoURL: string;
    discountPrice: string;
    thumbnail: string;
    benefits_prerequisites: BenefitsPrerequisites;
    Modules: Module[];
  }
  
  export interface BenefitsPrerequisites {
    benefits: string[];
    prerequisites: string[];
  }
  
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

function OverView() {

const { id } = useParams<{ id: string }>(); 
const [isLoading, setIsLoading] = useState(false);
const courseData = useSelector((state: RootState) => state.createCourseData.createCourse);
const dispatch = useDispatch()
const navigate = useNavigate()
const benifits_prerequisites = useSelector((state: RootState) => state.createCourseData.createCourse2);
const modules :CreateCourseState | null = courseDetails?.Modules

const [courseDetails, setCourseDetails] = useState<Course|null>(null);

useEffect(() => {
    if (id) {
      const fetchCourseDetails = async () => {
        try {
          setIsLoading(true);

          console.log()
          const response = await axios.get(courseEndpoint.fetchCourseDetails, {
            params: { id },
          });
          console.log(response.data, 'course ')
          setCourseDetails(response.data);
          console.log(courseDetails, 'state')
          setIsLoading(false);
        } catch (error) {
          console.error("Error fetching course details:", error);
          setIsLoading(false);
        }
      };

      fetchCourseDetails();
    }
  }, [id, dispatch])
  console.log(courseDetails, 'state')
const handleSubmit = async() => {
    try{
        setIsLoading(true)
        const data = {
          tutorId: getCookie('userId'),
          ...courseData,  // Spread the courseData object
          benefits_prerequisites: {
            ...benifits_prerequisites  // Include benefits and prerequisites
          },
          // Access the `Modules` array inside the `modules` object and spread it
          Modules: modules && modules.Modules ? [...modules.Modules] : [],  // Safely access and spread the array
        };
        console.log('started')
        const response = await axios.post(courseEndpoint.submitCourse, data)
        console.log(response.data)
     
            if (response.data.success) {
                console.log('success')
                toast.success('Form submitted successfully!', {
                  position: 'top-right',
                  autoClose: 5000, // Auto close after 3 seconds
                  className: 'bg-green-500 text-white rounded-lg p-4',
                  bodyClassName: 'text-sm',
                  progressClassName: 'bg-green-200',
                });
                setIsLoading(false)
                dispatch(setCreateCourseEmpty())
                navigate('/tutor/courses')
              } else {     
                console.log('failed')
                toast.error('Form submission failed!', {
                  position: 'top-right',
                  autoClose: 7000,
                  className: 'bg-red-500 text-white rounded-lg p-4',
                  bodyClassName: 'text-sm',
                  progressClassName: 'bg-red-200',
                });
                setIsLoading(false)
              } 
    }catch(err){
            setIsLoading(false)
            toast.error('Form submission failed! We are facing some internal error. Try again later', {
                position: 'top-right',
                autoClose: 7000,
                className: 'bg-red-500 text-white rounded-lg p-4',
                bodyClassName: 'text-sm',
                progressClassName: 'bg-red-200',
              });
    }
    
          
    
  };


  return (

    <div className="">

        {isLoading? <Loader /> : ""}
        
        <div className="flex m-10 ">
            <div className="w-1/2 h-45 contai">
                <h1 className=" ">
                {courseDetails?.courseTitle}
                </h1>
                <div className="relative w-full h-48 md:h-40 lg:h-48 rounded-md bg-gray-100 border-2 border-dashed border-gray-300 hover:bg-gray-200 cursor-pointer flex items-center justify-center">
               
                        <img
                          src={courseDetails?.thumbnail}
                          alt="Thumbnail Preview"
                          className="w-full h-full object-cover rounded-md"
                        />
                  
                </div>
            </div>
            <div className="w-1/2 h-28 m-10 justify-between">
                <h1>{courseData?.courseDescription}</h1>
                {courseData?.discountPrice ?
                <div className="bottom-0">
                    <h1 className="text-gray-600 line-through">Rs. {courseDetails?.coursePrice}</h1>
                    <button className="bg-[#7C24F0] rounded-lg px-4 py-2 font-bold text-white hover:bg-[#6211cd] bottom-0">Rs. {courseDetails?.discountPrice}</button>
                </div>
                    :
                    <button className="bg-[#7C24F0] rounded-lg px-4 py-2 font-bold text-white hover:bg-[#6211cd] bottom-0">Rs. {courseDetails?.coursePrice}</button>
                }
            </div>
        </div>
        <div className="flex mx-10">
            <div className="w-1/2 h-28">
                <h1 className="font-bold">What will you get from this course?</h1>
                <ul>
                    { 
                        courseDetails?.benefits_prerequisites?.benefits.map((benifits) => (
                            <li>- {benifits}</li>
                        ))
                    }
                </ul>
                <h1 className="font-bold">What are the prerequisitest for starting this course?</h1> 
                <ul>
                    {
                        courseDetails?.benefits_prerequisites?.prerequisites.map((prerequisites) => (
                            <li>- {prerequisites}</li>
                        ))
                    }
                </ul>           
            </div>
                <Modules modules={modules}/>
        </div>
        <div className="flex justify-between mx-20">
        <button className='py-2 px-8 bg-[#7C24F0] text-white font-semibold rounded-md hover:bg-[#6211cd] transition' onClick={()=>{dispatch(toPrev())}}> previous</button>
        <button className=" right-0 bg-[#7C24F0] px-5 py-2 rounded-lg text-white font-bold hover:bg-[#6211cd]" onClick={handleSubmit}>Submit</button>
        </div>
        <ToastContainer />
    </div>
  )
}

export default OverView