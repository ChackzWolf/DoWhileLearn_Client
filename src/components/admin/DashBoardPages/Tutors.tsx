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
  const [tutors, setTutors] = useState<IUser[]>([]);


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
          const tutors = await axios.get(adminEndpoint.fetchTutorData);
          setTutors(tutors.data.tutors); // Access the 'courses' property from the response
        }
    }

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
        {tutors?.map((tutor, index) => (
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
</div>

  )
}

export default Tutors