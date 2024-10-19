import { useEffect, useState } from "react"
import { adminEndpoint } from "../../../constraints/adminEndpoints";
import axios from "axios";
import { ListShadowLoader } from "./Shadoloader/ListShadowLoader";


interface IUser{
  _id:string;
  firstName:string;
  lastName:string;
  email: string;
  password: string;
  isblocked: boolean;
}
function Tutors() {
  const itemsPerPage = 12;
  const [tutors, setTutors] = useState<IUser[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(tutors.length / itemsPerPage);

  useEffect(() => {
      const fetchCourses = async () => {
        try {
          const response = await axios.get(adminEndpoint.fetchTutorData);
          setTutors(response.data.tutors); // Access the 'courses' property from the response
        } catch (error) {
          console.error("Error fetching course data:", error);
        }
      };
  
      fetchCourses();
    }, []);

    const handleToggleBlock = async (tutorId:string) => {
        const response = await axios.post(adminEndpoint.toggleBlockTutor, {tutorId})
        if(response.status = 202){

          setTutors((prevTutors) =>
          prevTutors.map((tutor) =>
          tutor._id === tutorId
              ? { ...tutor, isblocked: !tutor.isblocked } // Toggle the isblocked value
              : tutor
          )
        );
        }
    }

  // Get the courses for the current page
  const currentTutors = tutors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const handlePageChange = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  console.log(tutors)
  if(tutors.length == 0) return <ListShadowLoader/>
  else return (
<div className="w-full min-h-screen bg-white p-4 md:p-8">
  <h1 className="m-4 md:m-6 font-bold text-xl md:text-3xl">Tutors List</h1>

  <div className="overflow-x-auto">
    <table className="w-full border-collapse border border-gray-300 rounded-lg overflow-hidden">
      <thead>
        <tr>
          <th className="border border-gray-300 p-2 bg-gray-100 text-xs md:text-sm">
            Name
          </th>
          <th className="border border-gray-300 p-2 bg-gray-100 text-xs md:text-sm">
            Email
          </th>
          <th className="border border-gray-300 p-2 bg-gray-100 text-xs md:text-sm">
            Action
          </th>
        </tr>
      </thead>

      <tbody>
        {currentTutors?.map((tutor, index) => (
          <tr key={index} className="text-center text-xs md:text-sm">
            <td className="border border-gray-300 p-2 whitespace-nowrap">
              {tutor.firstName} {tutor.lastName}
            </td>
            <td className="border border-gray-300 p-2 whitespace-nowrap">
              {tutor.email}
            </td>
            <td className="border border-gray-300 p-2">
              <button
                className={`${
                  tutor.isblocked
                    ? "bg-green-500"
                    : "bg-red-600"
                } rounded-lg px-3 md:px-6 m-1 md:m-2 py-1 text-white`}
                onClick={() => handleToggleBlock(tutor._id)}
              >
                {tutor.isblocked ? "Unblock" : "Block"}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
            {/* Pagination Controls */}
            <div className="flex justify-center space-x-4 mt-6">
            <button
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
              className="px-4 py-2 bg-[#DDB3FF] rounded"
            >
              Previous
            </button>

            {/* Display page numbers */}
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
              <button
                key={pageNumber}
                onClick={() => handlePageChange(pageNumber)}
                className={`px-4 py-2 ${
                  currentPage === pageNumber ? "bg-[#7C24F0] text-white" : "bg-gray-200"
                } rounded`}
              >
                {pageNumber}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
              className="px-4 py-2 bg-[#DDB3FF] rounded"
            >
              Next
            </button>
          </div>
</div>

  )
}

export default Tutors