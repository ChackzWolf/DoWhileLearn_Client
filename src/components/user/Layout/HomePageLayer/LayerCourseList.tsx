import { useEffect, useState } from "react";
import CourseBadge from "../CourseBadge";
import CourseBadgeSkeleton from "../../Course/Skeletons/CourseBadgeSkeleton"; // Import the skeleton loader
import axios from "axios";
import { courseEndpoint } from "../../../../constraints/courseEndpoints";
import userAxios from "../../../../utils/axios/userAxios.config";

export interface ResponseFetchCourseList {
  courses: Course[];
}
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
  averageRating?:number;
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

const LayerCourseList = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  useEffect(() => {
    checkScreenSize(); // Initial check
    window.addEventListener("resize", checkScreenSize);


    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, [])
let itemsToShow
  if(window.innerWidth <= 1024 && window.innerWidth > 767 ) itemsToShow = 3
  if(window.innerWidth > 752 && window.innerWidth < 900) itemsToShow = 3
  else if (isLargeScreen) itemsToShow = 5;
  else itemsToShow = 4
  console.log(window.innerWidth)
    
  
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get<ResponseFetchCourseList>(courseEndpoint.fetchCourseData);
        setCourses(response.data.courses);


      } catch (error) {
        console.error("Error fetching course data:", error);
      } finally {
        setIsLoading(false); // Set loading to false after fetching
      }
    };

    fetchCourses();
  }, []);

  const checkScreenSize = () => {
    setIsLargeScreen(window.innerWidth >= 1025); // 1024px is the lg breakpoint in Tailwind
  };

  console.log(courses, "coursess");
  return (
<div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-${itemsToShow} lg:grid-cols-5 gap-5 px-3 md:px-10 lg:px-max-40 justify-items-center`}>
  {isLoading
    ? // Show skeletons while loading
      Array.from({ length: 4 }).map((_, index) => (
        <CourseBadgeSkeleton key={index} />
      ))
    : courses
        .slice() // Copy the array to avoid mutating the original
        .reverse() // Reverse the array
        .slice(0, itemsToShow) // Take the first 5 items from the reversed array
        .map((course) => (
          <CourseBadge
            key={course.courseTitle + course.coursePrice} // Use a unique key
            title={course.courseTitle}
            description={course.courseDescription}
            rating={course.averageRating || 2}
            price={course.coursePrice}
            discountPrice={course.discountPrice}
            imageSrc={course.thumbnail}
            color={""}
            _id={course._id}    
          />
        ))}
</div>


  );
};

export default LayerCourseList;
