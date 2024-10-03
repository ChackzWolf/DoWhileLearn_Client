// CourseDetailSkeleton.tsx
import React from "react";

const CourseDetailSkeleton: React.FC = () => {
  return (
    <div className="flex justify-between w-full gap-4 px-24 mt-16 p-5">
      <div className="p-16 w-3/4 animate-pulse">
        <div className="flex flex-col mb-4">
          <div className="h-10 bg-gray-300 rounded w-3/4 mb-2"></div>
          <div className="h-6 bg-gray-300 rounded w-1/2"></div>
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2 text-sm pb-3 p-2">
            <div className="h-4 bg-gray-300 rounded w-1/4"></div>
          </div>
          <div className="w-full flex justify-between p-5">
            <div className="w-1/2">
              <h1 className="font-semibold py-2 bg-gray-300 h-6 rounded w-2/3"></h1>
              <ul>
                {Array.from({ length: 3 }).map((_, index) => (
                  <li
                    key={index}
                    className="flex text-center items-center gap-2 text-sm px-2 pb-1"
                  >
                    <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="w-1/2">
              <h1 className="font-semibold py-2 bg-gray-300 h-6 rounded w-2/3"></h1>
              <ul>
                {Array.from({ length: 3 }).map((_, index) => (
                  <li
                    key={index}
                    className="flex text-center items-center gap-2 text-sm px-2 pb-1"
                  >
                    <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="h-10 bg-gray-300 rounded w-1/4 mb-4"></div>
        </div>
      </div>
      <div className="w-1/3 h-64 sticky top-36">
        <div className="relative w-full h-full md:h-40 lg:h-full rounded-md bg-gray-100 border-2 border-dashed border-gray-300 hover:bg-gray-200 cursor-pointer flex items-center justify-center m-2 self-center">
          <div className="h-full w-full bg-gray-300 animate-pulse rounded-md"></div>
        </div>

        <div className="h-full px-5">
          <div className="flex gap-2 pb-3">
            <div className="h-6 bg-gray-300 rounded w-1/4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/4"></div>
          </div>
          <div className="flex w-full gap-3">
            <button className="bg-gray-300 rounded-lg w-1/3 h-8"></button>
            <button className="bg-gray-300 rounded-lg w-10 h-8"></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailSkeleton;
