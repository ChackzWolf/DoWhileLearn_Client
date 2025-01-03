import { useEffect, useState } from "react";
import LayerOne from "./Layout/HomePageLayer/LayerOne";
import axios from "axios";
import { courseEndpoint } from "../../constraints/courseEndpoints";
import LayerCourseList from "./Layout/HomePageLayer/LayerCourseList";
import ChatComponent from "./Chat/ChatCoursesRoute";

export interface Course {
  _id: string;
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
  ratingCount?:number;
  averageRating:number;
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

const UserHome= () => {
  const [latestCourses, setLatestCourses] = useState<Course[]>([]);
  const [topRatedCourses, setTopRatedCourses] = useState<Course[]>([]);
    useEffect(() => {
      const fetchCourses = async () => {
        try {
          const response = await axios.get(courseEndpoint.fetchCourseData);
    
          // Set latest courses directly from the API response
          setLatestCourses(response.data.courses);
    
          // Create a shallow copy before sorting
          const sortedCourses = [...response.data.courses].sort(
            (a: any, b: any) => b.averageRating - a.averageRating // Descending order
          );
    
          // Set top-rated courses
          setTopRatedCourses(sortedCourses);
        } catch (error) {
          console.error("Error fetching course data:", error);
        }
      };
    
      fetchCourses();
    }, []);
    return (
        <div className=" w-full h-screen">
            <LayerOne/>
            <ChatComponent/>
            <LayerCourseList courses={topRatedCourses} title={"Top rated courses"}/>
            <LayerCourseList courses={latestCourses} title={"Latest courses"}/>

            <h1 className="font-bold self-center text-center text-lg mt-20 text-slate-700">Landing Page</h1>
        </div>
    )
}

export default UserHome;
