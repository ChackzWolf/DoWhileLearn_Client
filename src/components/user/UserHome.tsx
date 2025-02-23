import { useEffect, useState } from "react";
import LayerOne from "./Layout/HomePageLayer/LayerOne";
import axios from "axios";
import { courseEndpoint } from "../../constraints/courseEndpoints";
import LayerCourseList from "./Layout/HomePageLayer/LayerCourseList";
import ChatComponent from "./Chat/ChatCoursesRoute";
import { PopularQA } from "./Layout/HomePageLayer/PopularQA";
import { Features } from "./Layout/HomePageLayer/Features";

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
  const [latestCourses, setLatestCourses] = useState<Course[] | null>(null);
  const [topRatedCourses, setTopRatedCourses] = useState<Course[] | null>(null);
    useEffect(() => {
      const fetchCourses = async () => {

        console.log('Environment Variables:', {
          base: import.meta.env.VITE_API_GATEWAY_BASE_URL
        });
        
        try {
          const response = await axios.get(courseEndpoint.fetchCourseData);
          const highRatingOrder = await axios.get(
            courseEndpoint.fetchCourseData,
            {
              params: {ratingOrder:'high'},
            }
          );
          if (response.data) {
          setLatestCourses(response.data.courses);
          setTopRatedCourses(highRatingOrder.data.courses);
        } else {
          console.error('Invalid response format:', response.data);
        }
        } 
        catch (error) {
          console.error("Error fetching course data:", error);
        }
      };
    
      fetchCourses();
    }, []);
    return (
        <div className="w-full h-full">
            <LayerOne/>
            <ChatComponent/>
            <LayerCourseList courses={topRatedCourses} title={"Top rated courses"}/>
            <LayerCourseList courses={latestCourses} title={"Latest courses"}/>
            <Features/>
            <PopularQA/>
        </div>
    )
}

export default UserHome;
