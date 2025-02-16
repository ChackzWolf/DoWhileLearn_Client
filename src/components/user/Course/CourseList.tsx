import { useEffect, useState } from "react";
import CourseBadge from "../Layout/CourseBadge";
import axios from "axios";
import { courseEndpoint } from "../../../constraints/courseEndpoints";
import { RxDoubleArrowLeft, RxDoubleArrowRight } from "react-icons/rx";
import { FaFilter, FaStar } from "react-icons/fa6";
import { motion } from 'framer-motion';
import CourseBadgeSkeleton from "./Skeletons/CourseBadgeSkeleton";
import { useSearchParams } from "react-router-dom";

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
  averageRating: number;
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
  const [loading, setLoading] = useState<boolean>(true); // State for loading
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedPrice, setSelectedPrice] = useState<string>("");
  const [selectedRating, setSelectedRating] = useState<string>("");
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  // Calculate total pages based on courses length
  const totalPages = Math.ceil(courses.length / itemsPerPage);
console.log(searchQuery, 'searchQuery')
  // Fetch courses on component mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const filters = {
          category: selectedCategory || null,
          priceOrder: selectedPrice || null,
          ratingOrder: selectedRating || null,
          search: searchQuery || null,
        };
        const response = await axios.get<ResponseFetchCourseList>(
          courseEndpoint.fetchCourseData,
          {
            params: filters,
          }
        );
        setCourses(response.data.courses.reverse()); // Reverse once when fetching
      } catch (error) {
        console.error("Error fetching course data:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchCourses();
  }, [selectedCategory, selectedPrice, selectedRating, searchQuery]);

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
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRating("");
    setSelectedPrice(e.target.value);
  };

  const handleRatingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPrice("");
    setSelectedRating(e.target.value);
  };

  const clearFilters = () => {
    setSelectedCategory("");
    setSelectedPrice("");
    setSelectedRating("");
  };;

  return (
    <>


          <div className="flex flex-col justify-self-center w-full gap-5 md:m-20 p-5  ">



            {/* Filter Options */}
            <div className="flex flex-col md:flex-row gap-10 justify-center">
            <motion.div
                  initial={{ opacity: 0, x: -100 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.15 }} 
                  className="flex flex-col gap-4 min-w-48 ">


                <div className="flex items-center justify-between md:mb-4">
                  <h2 className="md:text-xl font-semibold text-accent flex items-center gap-2">
                    <FaFilter /> Filters
                  </h2>
                </div>
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-accent mb-1">
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    name="courseCategory"
                    onChange={handleCategoryChange}
                    className="w-full h-10 rounded-md text-sm bg-gray-50 px-4 py-2 text-purple-950 border border-gray-300 shadow-sm focus:ring-2 focus:ring-[#7C24F0] cursor-pointer hover:bg-gray-100"
                  >
                    <option value="">Select Category</option>
                    <option value="JavaScript">JavaScript</option>
                    <option value="MongoDB">Database</option>
                    <option value="Devops">Devops</option>
                    <option value="Blockchain">Blockchain</option>
                    <option value="Java">Java</option>
                    <option value="Python">Python</option>
                    <option value="Fontend">Fontend</option>
                    <option value="Cybersecurity">Cybersecurity</option>
                    <option value="Tips & tricks">Tips & tricks</option>
                  </select>

                </div>

                {/* Price Filter */}
                <div>
                  <label className="block text-sm font-medium text-accent mb-1">
                    Price
                  </label>
                  <select
                    value={selectedPrice}
                    name="Price"
                    onChange={handlePriceChange}
                    className="w-full h-10 rounded-md text-sm bg-gray-50 px-4 py-2 text-purple-950 border border-gray-300 shadow-sm focus:ring-2 focus:ring-[#7C24F0] cursor-pointer"
                  >
                    <option value="">Select Price</option>
                    <option value="low">Low to High</option>
                    <option value="high">High to Low</option>
                  </select>
                </div>

                {/* Rating Filter */}
                <div>
                  <label className="block text-sm font-medium text-accent mb-1">
                    Rating
                  </label>
                  <select
                    value={selectedRating}
                    name="Rating"
                    onChange={handleRatingChange}
                    className="w-full h-10 rounded-md text-sm bg-gray-50 px-4 py-2 text-purple-950 border border-gray-300 shadow-sm focus:ring-2 focus:ring-[#7C24F0] cursor-pointer"
                  >
                    <option value="">Select Rating</option>
                    <option value="low">
                      Low to High <FaStar className="inline text-yellow-400 ml-2" />
                    </option>
                    <option value="high">
                      High to Low <FaStar className="inline text-yellow-400 ml-2" />
                    </option>
                  </select>
                </div>
                <div>
                  <button
                    onClick={clearFilters}
                    className="transition-all flex items-center gap-2 text-primary bg-accent hover:opacity-90 rounded-lg p-1 px-2 shadow-lg cursor-pointer"
                  >
                    Clear Filters
                  </button>
                </div>

              </motion.div>

              {/* Content Placeholder */}
              <div className="flex-1 rounded-lg max-w-6xl">
                {loading ?(
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 h-auto place-items-center">
                        {Array.from({ length: 12 }).map((_, index) => (
                          <motion.div
                              key={index}
                              initial={{ opacity: 0, y: 50 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.5, delay: index * 0.15 }}>
                                  <CourseBadgeSkeleton key={index} />
                          </motion.div>
                        ))}
                  </div>
                ):(

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 h-auto place-items-center">
                  {currentCourses.map((course, _index) => (

                      <CourseBadge
                        key={course._id}
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

                )}


                {/* Pagination Controls */}
                {courses.length > itemsPerPage &&

                  <div className="flex justify-center space-x-4 mb-16">
                    <button
                      disabled={currentPage === 1}
                      onClick={() => handlePageChange(currentPage - 1)}
                      className="px-4 py-2 rounded"
                    >
                      <RxDoubleArrowLeft className="text-2xl hover:scale-110 transition-all text-[#7C24F0]" />
                    </button>

                    {/* Display page numbers */}
                    {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                      (pageNumber) => (
                        <button
                          key={pageNumber}
                          onClick={() => handlePageChange(pageNumber)}
                          className={`px-4 py-2 ${currentPage === pageNumber
                              ? "bg-[#7C24F0] text-white rounded-full"
                              : "bg-white hover:bg-[#DDB3FF] duration-300 transition-all rounded-full"
                            } rounded`}
                        >
                          {pageNumber}
                        </button>
                      )
                    )}

                    <button
                      disabled={currentPage === totalPages}
                      onClick={() => handlePageChange(currentPage + 1)}
                      className="px-4 py-2 rounded"
                    >
                      <RxDoubleArrowRight className="text-2xl hover:scale-110 transition-all text-[#7C24F0]" />
                    </button>
                  </div>
                }
              </div>
            </div>
          </div>


    </>
  );
}

export default CoursesList;
