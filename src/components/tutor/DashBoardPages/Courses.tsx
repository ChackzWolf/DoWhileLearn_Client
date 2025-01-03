import { useEffect, useState } from "react"
import { tutorEndpoint } from "../../../constraints/tutorEndpoint";
import { getCookie } from "../../../utils/cookieManager";
import { useNavigate } from "react-router-dom";
import tutorAxios from "../../../utils/axios/tutorAxios.config";
import { handleBlockedTutor } from "../../../utils/handleErrors/handleBlocked";
import axios from "axios";
import Loader from "../../common/icons/loader";
import { RxDoubleArrowLeft, RxDoubleArrowRight } from "react-icons/rx";
import { ROUTES } from "../../../routes/Routes";
import DashBoardLoader from "../../common/icons/DashboardLoader";
import Table from "../../common/Layouts/Table";
import { ListShadowLoader } from "../../admin/DashBoardPages/Shadoloader/ListShadowLoader";


export interface ResponseFetchCourseList {
  courses: Course[];
}
export interface Course {
  _id:string,
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


function Course() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [courses, setCourses] = useState<Course[] >([]);

  const columns = [
    {
      header: '',
      type: 'image',
      key: 'thumbnail',
    },
    {
      header: 'Course title',
      type: 'text',
      key:'courseTitle',
    },
    {
      header: 'Course level',
      type: 'text',
      key: 'courseLevel',
    },
    {
      header: 'Course price',
      type: 'text',
      key: 'coursePrice',
    },
    {
      header:'Discount price',
      type: 'text',
      key: 'discountPrice',
    },
    {
      header: 'Action',
      type: 'button',
      key: '_id',
      render:(row:any)=> (
        <button className= "bg-[#7C24F0] hover:bg-[#6211cd] transition-all rounded-lg px-4 m-2 py-1 text-white" onClick={()=>navigate(ROUTES.tutor.courseDetails(row._id))}> Detail veiw</button>
      )
    }
  ]

  useEffect(() => {
      const fetchCourses = async () => {
        try {
          setIsLoading(true)
          console.log('trig')
          const tutorId:string | null = await getCookie('tutorId')
          if(tutorId){
            const response = await tutorAxios.get(tutorEndpoint.fetchTutorCourse, {params: { tutorId }, withCredentials:true });
            console.log(response,'fetched course')
            setCourses(response.data.courses);
          }

        } catch (error) {
          if(!handleBlockedTutor(error)) console.error("Error fetching course data:", error);
          else handleBlockedTutor(error)
        }finally{
          setIsLoading(false)
        }
      };
  
      fetchCourses();
    }, []);
  console.log(courses,'courses form outside')
  return !isLoading ? <Table columns={columns} data={courses} title={'Courses'}/> : <ListShadowLoader/>
}

export default Course