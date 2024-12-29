import { useEffect, useState } from "react"
import { adminEndpoint } from "../../../constraints/adminEndpoints";
import axios from "axios";
import { ListShadowLoader } from "./Shadoloader/ListShadowLoader";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { RxDoubleArrowLeft, RxDoubleArrowRight } from "react-icons/rx";


interface IUser{
  _id:string;
  firstName:string;
  lastName:string;
  email: string;
  password: string;
  isblocked: boolean;
  purchasedCourses: string[];
  cart:string[]; 
  wishlist:string[]; 
  profilePicture:string;
}
function Students() {
  const navigate = useNavigate();
  const itemsPerPage = 12;
  const [students, setStudents] = useState<IUser[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(students.length / itemsPerPage);

  useEffect(() => {
      const fetchCourses = async () => {
        try {
          const response = await axios.get(adminEndpoint.fetchStudentData);
          setStudents(response.data.students); // Access the 'courses' property from the response
        } catch (error) {
          console.error("Error fetching course data:", error);
        }
      };
  
      fetchCourses();
    }, []);

    const handleToggleBlock = async (studentId:string) => {
        const response = await axios.post(adminEndpoint.toggleBlockStudent, {userId:studentId})
        if(response.status = 202){
          setStudents((prevStudents) =>
          prevStudents.map((student) =>
            student._id === studentId
              ? { ...student, isblocked: !student.isblocked } // Toggle the isblocked value
              : student
          )
        );
        }
    }

  // Get the courses for the current page
  const currentStudents = students.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const handlePageChange = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  console.log(students)
  if (students.length == 0) return <ListShadowLoader/>
  else return (
    
<div className="w-full min-h-screen bg-white p-4 md:p-8">
            <h1 className="m-4 md:m-6 font-bold text-xl md:text-3xl">Students List</h1>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300 rounded-lg overflow-hidden">
                <thead>
                  <tr>
                  <th className="border border-gray-300 p-2 bg-gray-100 text-xs md:text-sm">
                      
                    </th>
                    <th className="border border-gray-300 p-2 bg-gray-100 text-xs md:text-sm">
                      Name
                    </th>
                    <th className="border border-gray-300 p-2 bg-gray-100 text-xs md:text-sm">
                      Email
                    </th>
                    <th className="border border-gray-300 p-2 bg-gray-100 text-xs md:text-sm">
                      Enrolled Courses
                    </th>
                    <th className="border border-gray-300 p-2 bg-gray-100 text-xs md:text-sm">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {currentStudents.map((student, index) => (
                    <tr key={index} className="text-center text-xs md:text-sm">
                      <td className="border border-gray-300 p-2 whitespace-nowrap">
                        <div className="h-10 w-10 rounded-full contain-content">
                          {student.profilePicture ? 
                           <img src={student.profilePicture} alt="" className="w-10  rounded-full"/>
                           :
                           <FaUserCircle size={37} />
                          }
                        </div>

                      </td>
                      <td className="border border-gray-300 p-2 whitespace-nowrap">
                        {student.firstName} {student.lastName}
                      </td>
                      <td className="border border-gray-300 p-2 whitespace-nowrap">
                        {student.email}
                      </td>
                      <td className="border border-gray-300 p-2">
                        {student.purchasedCourses.length}
                      </td>
                      <td className="border border-gray-300 p-2">
                        <>
                        <button className="bg-[#7C24F0] text-white rounded-lg px-3 md:px-6 m-1 md:m-2 py-1" onClick={()=> navigate(`/admin/student/details/${student._id}`)}>
                          Details
                        </button>
                        <button
                          className={`${
                            student.isblocked
                              ? "bg-green-500"
                              : "bg-red-600"
                          } rounded-lg px-3 md:px-6 m-1 md:m-2 py-1 text-white`}
                          onClick={() => handleToggleBlock(student._id)}
                        >
                          {student.isblocked ? "Unblock" : "Block"}
                        </button>
                        </>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

              {/* Pagination Controls */}
        {students.length > itemsPerPage &&
        
        <div className="flex justify-center space-x-4 mb-16 p-5">
        <button
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
          className="px-4 py-2 rounded"
        >
          <RxDoubleArrowLeft className="text-2xl hover:scale-110 transition-all text-[#7C24F0]" />
        </button>

        {/* Display page numbers */}
        {Array.from({ length: totalPages }, (_, index) => index + 1).map(
            (pageNumber) => (
              <button
                key={pageNumber}
                onClick={() => handlePageChange(pageNumber)}
                className={`px-4 py-2 ${
                  currentPage === pageNumber
                    ? "bg-[#7C24F0] text-white rounded-full"
                    : "bg-white hover:bg-[#DDB3FF] duration-300 transition-all rounded-full"
                } rounded`}
              >
                {pageNumber}
              </button>
            )
        )}

        <button
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
          className="px-4 py-2 rounded"
        >
          <RxDoubleArrowRight className="text-2xl hover:scale-110 transition-all text-[#7C24F0]" />
        </button>
    </div>

        }

</div>
  )
}

export default Students