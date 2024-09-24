import { useEffect, useState } from "react";
import CourseBadge from "../Layout/CourseBadge";
import axios from "axios";
import { courseEndpoint } from "../../../constraints/courseEndpoints";

// Define the interfaces for the fetched course data
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

function CoursesList() {
  const itemsPerPage = 12;
  const [currentPage, setCurrentPage] = useState(1);
  const [courses, setCourses] = useState<Course[]>([]);

  // Calculate total pages based on courses length
  const totalPages = Math.ceil(courses.length / itemsPerPage);

  // Fetch courses on component mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get<ResponseFetchCourseList>(courseEndpoint.fetchCourseData);
        setCourses(response.data.courses.reverse()); // Reverse once when fetching
      } catch (error) {
        console.error("Error fetching course data:", error);
      }
    };

    fetchCourses();
  }, []);

  // Get the courses for the current page
  const currentCourses = courses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-20 h-auto m-20">
        {currentCourses.map((course) => (
          <CourseBadge
            key={course._id}
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

      {/* Pagination Controls */}
      <div className="flex justify-center space-x-4 mt-6">
        <button
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
          className="px-4 py-2 bg-gray-200 rounded"
        >
          Previous
        </button>

        {/* Display page numbers */}
        {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
          <button
            key={pageNumber}
            onClick={() => handlePageChange(pageNumber)}
            className={`px-4 py-2 ${
              currentPage === pageNumber ? "bg-blue-500 text-white" : "bg-gray-200"
            } rounded`}
          >
            {pageNumber}
          </button>
        ))}

        <button
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
          className="px-4 py-2 bg-gray-200 rounded"
        >
          Next
        </button>
      </div>
    </>
  );
}

export default CoursesList;
