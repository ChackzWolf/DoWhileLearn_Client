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
  purchasedCourses: string[];
  cart:string[]; 
  wishlist:string[]; 
}
function Students() {
  const [students, setStudents] = useState<IUser[]>([]);


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
          const students = await axios.get(adminEndpoint.fetchStudentData);
          setStudents(students.data.students); // Access the 'courses' property from the response
        }
    }

  console.log(students)
  return (
    <div className="w-full h-screen bg-white p-8">
      <table className="w-full border-collapse border border-gray-300 rounded-lg overflow-hidden m-2">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2 bg-gray-100 ">Name</th>
            <th className="border border-gray-300 p-2 bg-gray-100">Email</th>
            <th className="border border-gray-300 p-2 bg-gray-100">Enrolled courses</th>
            <th className="border border-gray-300 p-2 bg-gray-100">Action</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, index) => (
            <tr key={index} className="text-center">
              <td className="border border-gray-300 p-2">{student.firstName} {student.lastName}</td>
              <td className="border border-gray-300 p-2">{student.email}</td>
              <td className="border border-gray-300 p-2">{student.purchasedCourses.length}</td>
              <button className={student.isblocked? "bg-green-500 rounded-lg px-4 m-2 py-1 text-white":"bg-red-600 rounded-lg px-6 m-2 py-1 text-white"} onClick={()=>handleToggleBlock(student._id)}>{student.isblocked?"Unblock":"Block"}</button>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Students