import { useEffect, useState } from "react"
import { tutorEndpoint } from "../../../constraints/tutorEndpoint";
import { getCookie } from "../../../utils/cookieManager";
import { useNavigate } from "react-router-dom";
import tutorAxios from "../../../utils/axios/tutorAxios.config";
import { handleBlockedTutor } from "../../../utils/handleErrors/handleBlocked";
import axios from "axios";
import Loader from "../../common/icons/loader";
import { RxDoubleArrowLeft, RxDoubleArrowRight } from "react-icons/rx";


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
  const itemsPerPage = 12;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(courses.length / itemsPerPage);

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


      // Get the courses for the current page
  const currentCourses = courses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };


    const handleOnClick = (id: string) => {
      navigate(`/tutor/courses/${id}`);
    };

  console.log(courses,'courses form outside')
  return !isLoading ? (
    
    <div className="w-full h-screen bg-white p-8">
            <h1 className="text-3xl font-semibold m-5 mx-10">Courses</h1>

      <div className="mx-10 flex flex-col justify-between h-full">
      
      {courses.length !== 0 ? (
        
      <table className="w-full border-collapse border border-gray-300 rounded-lg overflow-hidden m-2">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2 bg-gray-100 "></th>
            <th className="border border-gray-300 p-2 bg-gray-100 ">Course title</th>
            <th className="border border-gray-300 p-2 bg-gray-100">Course level</th>
            <th className="border border-gray-300 p-2 bg-gray-100">Course price</th>
            <th className="border border-gray-300 p-2 bg-gray-100">Discount price</th>
            <th className="border border-gray-300 p-2 bg-gray-100">Action</th>
          </tr>
        </thead>
        
        <tbody>
          {currentCourses.map((course, index) => (
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
      </table>):(
          <div className="w-full flex justify-center items-center mt-16">
            <h1 className="text-center w-full text-4xl font-semibold">You have no courses yet.</h1>
          </div>
        )}
            {currentCourses.length !== 0 && (
                <div className="flex justify-center space-x-4 m-6 mb-36">
                      <button
                        disabled={currentPage === 1}
                        onClick={() => handlePageChange(currentPage - 1)}
                        className="px-4 py-2 rounded"
                      >
                        <RxDoubleArrowLeft className="text-2xl hover:scale-110 transition-all text-[#7C24F0]" />
                      </button>

                      {/* Display page numbers */}
                      { Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                        <button
                          key={pageNumber}
                          onClick={() => handlePageChange(pageNumber)}
                          className={`px-4 py-2 ${
                            currentPage === pageNumber ? "bg-[#7C24F0] text-white rounded-full" : "bg-white hover:bg-[#DDB3FF] duration-300 transition-all rounded-full"
                          } rounded`}
                        >
                          {pageNumber}
                        </button>
                      ))}

                      <button
                        disabled={currentPage === totalPages}
                        onClick={() => handlePageChange(currentPage + 1)}
                        className="px-4 py-2 rounded"
                      >
                        <RxDoubleArrowRight className="text-2xl hover:scale-110 transition-all text-[#7C24F0]" />
                      </button>
                  </div>)}
      </div>
    </div>
  ): <><Loader/></>
}

export default Course