// CourseBadgeSkeleton.tsx
import React from "react";

const CourseBadgeSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col p-4 bg-gray-200 rounded-lg shadow animate-pulse w-64 md:w-52 xl:w-64 h-80 overflow-hidden cursor-pointer hover:scale-105 transition-all`">
      <div className="h-32 bg-gray-300 rounded-md mb-2"></div>
      <div className="h-6 bg-gray-300 rounded w-full mb-1"></div>
      <div className="h-4 bg-gray-300 rounded w-3/4 mb-1"></div>
      <div className="h-4 bg-gray-300 rounded w-1/2 mb-1"></div>
      <div className="h-4 bg-gray-300 rounded w-2/3"></div>
    </div>
  );
};

export default CourseBadgeSkeleton;
