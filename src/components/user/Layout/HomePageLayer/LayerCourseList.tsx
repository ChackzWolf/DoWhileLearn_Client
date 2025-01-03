import { useEffect, useState } from "react";
import CourseBadge from "../CourseBadge";
import CourseBadgeSkeleton from "../../Course/Skeletons/CourseBadgeSkeleton"; // Import the skeleton loader
import axios from "axios";
import { courseEndpoint } from "../../../../constraints/courseEndpoints";

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

const LayerCourseList = ({courses,title}:{courses:Course[],title:string}) => {
  const [coursesToShow , setCourseToShow] = useState<Course[] | null> (null)
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  useEffect(() => {
    checkScreenSize(); // Initial check
    window.addEventListener("resize", checkScreenSize);
    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, [])

  useEffect(()=> {
    setCourseToShow(courses)
  },[courses])
let itemsToShow
  if(window.innerWidth <= 1024 && window.innerWidth > 767 ) itemsToShow = 3
  if(window.innerWidth > 752 && window.innerWidth < 900) itemsToShow = 3
  else if (isLargeScreen) itemsToShow = 5;
  else itemsToShow = 4

  const checkScreenSize = () => {
    setIsLargeScreen(window.innerWidth >= 1025); // 1024px is the lg breakpoint in Tailwind
  };

  console.log(courses, "coursess");
  console.log(itemsToShow)
  return (
<div className={`place-self-center max-w-screen-2xl my-16`}>
  <h1 className="text-2xl font-bold mx-12 m-6">
    {title}
  </h1>
  <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-${itemsToShow} lg:grid-cols-5 gap-5 px-3 md:px-10 lg:px-max-40 justify-center items-center">

  
  {coursesToShow === null
    ? // Show skeletons while loading
      Array.from({ length: itemsToShow }).map((_, index) => (
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
            rating={course.averageRating}
            price={course.coursePrice}
            discountPrice={course.discountPrice}
            imageSrc={course.thumbnail}
            color={""}
            _id={course._id}    
          />
        ))}
        </div>
</div>


  );
};

export default LayerCourseList;
