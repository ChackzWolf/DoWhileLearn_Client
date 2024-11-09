import { useEffect, useState } from "react";
import Header from "./Layout/Header";
import LayerOne from "./Layout/HomePageLayer/LayerOne";
import axios from "axios";
import { courseEndpoint } from "../../constraints/courseEndpoints";
import LayerCourseList from "./Layout/HomePageLayer/LayerCourseList";



const UserHome= () => {
    const [courses, setCourses] = useState<[]>([]);

    useEffect(() => {
        const fetchCourses = async () => {
          try {
            const response = await axios.get(courseEndpoint.fetchCourseData);
            setCourses(response.data.courses); // Access the 'courses' property from the response
          } catch (error) {
            console.error("Error fetching course data:", error);
          }
        };
    
        fetchCourses();
      }, []);
    console.log(courses, 'this is courses')
    return (
        <div className=" w-full h-screen">
            <Header/>

            <LayerOne/>
            
            <LayerCourseList/>
            <h1 className="font-bold self-center text-center text-lg mt-20 text-slate-700">Landing Page</h1>
        </div>
    )
}

export default UserHome;
