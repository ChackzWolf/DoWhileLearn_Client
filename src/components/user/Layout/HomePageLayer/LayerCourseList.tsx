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

  console.log(courses, "coursess");
  return (
    <div className="flex w-full justify-between px-20">
      {isLoading
        ? // Show skeletons while loading
          Array.from({ length: 5 }).map((_, index) => (
            <CourseBadgeSkeleton key={index} />
          ))
        : courses
            .slice() // Copy the array to avoid mutating the original
            .reverse() // Reverse the array
            .slice(0, 5) // Take the first 5 items from the reversed array
            .map((course) => (
              <CourseBadge
                key={course.courseTitle + course.coursePrice} // Use a unique key
                title={course.courseTitle}
                description={course.courseDescription}
                rating={4}
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
