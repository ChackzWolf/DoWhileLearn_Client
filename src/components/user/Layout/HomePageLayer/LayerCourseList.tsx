import { useEffect, useState } from "react";
import CourseBadge from "../CourseBadge";

import axios from "axios";
import { courseEndpoint } from "../../../constraints/courseEndpoints";

export interface ResponseFetchCourseList {
    courses: Course[];
  }
  export interface Course {
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

const LayerCourseList= () => {
    const [courses, setCourses] = useState<Course[]>([]); // Initialize state with Course type
  
    useEffect(() => {
      const fetchCourses = async () => {
        try {
          const response = await axios.get<ResponseFetchCourseList>(courseEndpoint.fetchCourseData);
          setCourses(response.data.courses); // Access the 'courses' property from the response
        } catch (error) {
          console.error("Error fetching course data:", error);
        }
      };
  
      fetchCourses();
    }, []);
  
    return (
      <div className="flex w-full px-12">
        {courses.map((course) => (
          <CourseBadge
            key={course.courseTitle} // Use a unique identifier
            title={course.courseTitle}
            rating={4}
            price={course.coursePrice}
            discountPrice={course.discountPrice}
            imageSrc={course.thumbnail}
            color={""}
          />
        ))}
      </div>
    );
}

export default LayerCourseList;