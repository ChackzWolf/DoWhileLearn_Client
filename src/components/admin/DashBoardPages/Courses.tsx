import { useEffect, useState } from "react"
import { getCookie } from "../../../utils/cookieManager";
import { useNavigate } from "react-router-dom";
import { handleBlockedTutor } from "../../../utils/handleErrors/handleBlocked";
import { courseEndpoint } from "../../../constraints/courseEndpoints";
import { ListShadowLoader } from "./Shadoloader/ListShadowLoader";
import Table from "../../common/Layouts/Table";
import { ROUTES } from "../../../routes/Routes";
import adminAxios from "../../../utils/axios/adminAxios.config";


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

  useEffect(() => {
      const fetchCourses = async () => {
        try {
          setIsLoading(true)
          console.log('trig')
          const tutorId:string | null = await getCookie('tutorId')
          if(tutorId){
            const response = await adminAxios.get(courseEndpoint.fetchCourseData);
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
      render:(id:string)=> (
        <button className= "bg-[#7C24F0] hover:bg-[#6211cd] transition-all rounded-lg px-4 m-2 py-1 text-white" onClick={()=>handleOnClick(id)}> Detail veiw</button>
      )
    }
  ]
  const handleOnClick = (id: string) => {
    navigate(ROUTES.tutor.courseDetails(id));
  };

  return isLoading ? <ListShadowLoader/> : <Table columns={columns} data = {courses} title={'Course list'}/> 
}

export default Course