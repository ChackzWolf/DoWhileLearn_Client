import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom";
import { handleBlockedTutor } from "../../../utils/handleErrors/handleBlocked";
import { courseEndpoint } from "../../../constraints/courseEndpoints";
import { ROUTES } from "../../../routes/Routes";
import adminAxios from "../../../utils/axios/adminAxios.config";
import SearchBar from "../../common/Layouts/SearchBar";
import Table from "../../common/Layouts/FilteredTable";
import { ListShadowLoader } from "../../common/Skeleton/FilteredTableSkeleton";


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
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  useEffect(() => {
      const fetchCourses = async () => {
        try {
          setIsLoading(true)
          console.log('trig')
          const filters = {
            search: searchQuery || null,
          };
          
            console.log(filters,'filters')
            const response = await adminAxios.get(courseEndpoint.fetchCourseData, {params: filters});

            console.log(response,'fetched course')
            setCourses(response.data.courses);
          

        } catch (error) {
          if(!handleBlockedTutor(error)) console.error("Error fetching course data:", error);
          else handleBlockedTutor(error)
        }finally{
          setIsLoading(false)
        }
      };
  
      fetchCourses();
    }, [searchQuery]);
    
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
        <button className= "bg-[#7C24F0] hover:bg-[#6211cd] transition-all rounded-lg px-4 m-2 py-1 text-white" onClick={()=>handleOnClick(row._id)}> Detail veiw</button>
      )
    }
  ]
  const handleOnClick = (id: string) => {
    navigate(ROUTES.user.courseDetails(id));
  };

  return (
    <div className = "flex flex-col  mx-10 w-auto overflow-auto h-full bg-accent">
        <div className="flex justify-between items-center my-5 mx-10">
        <h1 className="text-3xl font-bold  ">Courses</h1> 
      <SearchBar path={'/admin/courses'}/>
    </div>
    {!isLoading ? <Table columns={columns} data={courses} title={'Courses'}/> :  <ListShadowLoader/>}
  </div>
  )
}

export default Course