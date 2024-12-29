import { useEffect, useState } from "react"
import axios from "axios";
import { tutorEndpoint } from "../../../constraints/tutorEndpoint";
import { getCookie } from "../../../utils/cookieManager";
import { useNavigate } from "react-router-dom";
import { RxDoubleArrowLeft, RxDoubleArrowRight } from "react-icons/rx";
import { FaUserCircle } from "react-icons/fa";


interface User {
  firstName:string,
  lastName:string,
  img:string,
  _id:string,
  profilePicture:string
}


function Students() {
  const navigate = useNavigate()
  const [students, setStudents] = useState<User[]>([]);
  const itemsPerPage = 12;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(students.length / itemsPerPage);


  useEffect(() => {
      const fetchCourses = async () => {
        try {
          const tutorId:string | null = await getCookie('tutorId')
          if(tutorId){
            const response = await axios.get(tutorEndpoint.FetchStudents, {params: { tutorId }, withCredentials:true });
            console.log(response.data)
            setStudents(response.data.users); // Access the 'courses' property from the response
          }

        } catch (error) {
          console.error("Error fetching course data:", error);
        }
      };
  
      fetchCourses();
    }, []);

    const handleOnClick = (id: string) => {
      navigate(`/tutor/user/details/${id}`);
    };


  // Get the courses for the current page
  const currentStudents = students.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  console.log(students)
  return (
    <div className="w-10/12 h-screen bg-white p-8">
              <h1 className="text-3xl font-semibold m-5 mx-10">Students</h1>

      <div className="mx-10 flex flex-col justify-center">
        {currentStudents.length !== 0 ?(

       
      <table className="w-full border-collapse border border-gray-300 rounded-lg overflow-hidden m-2">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2 bg-gray-100 "></th>
            <th className="border border-gray-300 p-2 bg-gray-100 ">Name</th>
            <th className="border border-gray-300 p-2 bg-gray-100">Action</th>
          </tr>
        </thead>
        <tbody>
          {currentStudents.map((student, index) => (
            <tr key={index} className="text-center">
              { student.profilePicture?
              <div className="flex justify-center items-center rounded-full contain-content w-10 h-10">
                <img src={student?.profilePicture || ''} alt=""  />
              </div>
              :
              <FaUserCircle size={39} />
              }
              <td className="border border-gray-300 p-2"> {student.firstName +" "+ student.lastName} </td>
              <button className= "bg-[#7C24F0] hover:bg-[#6211cd] transition-all rounded-lg px-4 m-2 py-1 text-white" onClick={()=>handleOnClick(student?._id)}> Detail veiw</button>
            </tr>
          ))}
        </tbody>
      </table>
            ):(
              <div className="w-full flex justify-center items-center mt-16">
                <h1 className="text-center w-full text-4xl font-semibold">You have no students yet.</h1>
              </div>
            )}

              {currentStudents.length !== 0 && (
                <div className="flex justify-center space-x-4 mb-36">
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
  )
}

export default Students