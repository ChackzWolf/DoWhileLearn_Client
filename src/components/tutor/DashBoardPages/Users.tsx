import { useEffect, useState } from "react"
import axios from "axios";
import { tutorEndpoint } from "../../../constraints/tutorEndpoint";
import { getCookie } from "../../../utils/cookieManager";
import { useNavigate } from "react-router-dom";


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


function Students() {
  const navigate = useNavigate()
  const [courses, setCourses] = useState<Course[]>([]);


  useEffect(() => {
      const fetchCourses = async () => {
        try {
          const tutorId:string | null = await getCookie('userId')
          if(tutorId){
            const response = await axios.get(tutorEndpoint.fetchTutorCourse, {params: { tutorId } });
            setCourses(response.data.courses); // Access the 'courses' property from the response
          }

        } catch (error) {
          console.error("Error fetching course data:", error);
        }
      };
  
      fetchCourses();
    }, []);

    const handleOnClick = (id: string) => {
      navigate(`/tutor/courses/${id}`);
    };

  console.log(courses)
  return (
    <div className="w-full h-screen bg-white p-8">
      <div className="mx-10">
      <table className="w-full border-collapse border border-gray-300 rounded-lg overflow-hidden m-2">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2 bg-gray-100 "></th>
            <th className="border border-gray-300 p-2 bg-gray-100 ">Course title</th>
            <th className="border border-gray-300 p-2 bg-gray-100">Course level</th>
            <th className="border border-gray-300 p-2 bg-gray-100">Course price</th>
            <th className="border border-gray-300 p-2 bg-gray-100">Earnings</th>
            <th className="border border-gray-300 p-2 bg-gray-100">Action</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course, index) => (
            <tr key={index} className="text-center">
              <div className="flex items-center justify-center rounded-lg">
              <img src={course.thumbnail} alt="" className="w-10 rounded-md mt-4" />
              </div>
              
              <td className="border border-gray-300 p-2">{course?.courseTitle}</td>
            <td className="border border-gray-300 p-2">{course?.courseLevel}</td>
            <td className="border border-gray-300 p-2">{course?.coursePrice}</td>
            <td className="border border-gray-300 p-2">{course?.discountPrice}</td>
              <button className= "bg-[#7C24F0] hover:bg-[#6211cd] transition-all rounded-lg px-4 m-2 py-1 text-white" onClick={()=>handleOnClick(course?._id)}> Detail veiw</button>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  )
}

export default Students