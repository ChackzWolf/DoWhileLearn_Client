import { useEffect, useState } from "react"
import { adminEndpoint } from "../../../constraints/adminEndpoints";
import axios from "axios";


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
  return (
    <div className="w-full h-screen bg-white p-8">
      <table className="w-full border-collapse border border-gray-300 rounded-lg overflow-hidden m-2">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2 bg-gray-100 ">Name</th>
            <th className="border border-gray-300 p-2 bg-gray-100">Email</th>
            <th className="border border-gray-300 p-2 bg-gray-100">Action</th>
          </tr>
        </thead>
        <tbody>
          {tutors?.map((tutor, index) => (
            <tr key={index} className="text-center">
              <td className="border border-gray-300 p-2">{tutor.firstName} {tutor.lastName}</td>
              <td className="border border-gray-300 p-2">{tutor.email}</td>
              <button className={tutor.isblocked? "bg-green-500 rounded-lg px-4 m-2 py-1 text-white":"bg-red-600 rounded-lg px-6 m-2 py-1 text-white"} onClick={()=>handleToggleBlock(tutor._id)}>{tutor.isblocked?"Unblock":"Block"}</button>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Tutors