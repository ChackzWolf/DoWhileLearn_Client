import { useState } from 'react'
import { RxDoubleArrowLeft, RxDoubleArrowRight } from 'react-icons/rx'
import CourseBadge from '../../user/Layout/CourseBadge';

function Courses({courses}:{courses:any}) {
    const itemsPerPage = 4;
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(courses.length / itemsPerPage);


    const currentCourses = courses.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      );


    const handlePageChange = (pageNumber: number) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
          setCurrentPage(pageNumber);
        }
      };

  return (


    <div>
        <div className="flex-1  rounded-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 h-auto">
                {currentCourses.map((course:any) => (
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

          {/* Pagination Controls */}
          {courses.length > itemsPerPage &&
          
          <div className="flex justify-center space-x-4 mb-16 p-5">
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
                  className={`px-4 py-2 ${
                    currentPage === pageNumber
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
  )
}

export default Courses