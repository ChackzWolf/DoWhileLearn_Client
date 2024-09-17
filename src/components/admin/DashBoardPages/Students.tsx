import { useEffect, useState } from "react"
import { adminEndpoint } from "../../../constraints/adminEndpoints";
import axios from "axios";
function Students() {
  const [students, setStudents] = useState<[]>([]);


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
  return (
    <div className="w-full h-screen bg-white">
      <ul>
        
        <li>
        </li>
        
      </ul>
    </div>
  )
}

export default Students