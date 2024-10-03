// SkeletonLoader.tsx
import React from "react";

const CourseSkeleton: React.FC = () => {
  return (
    <div className="flex flex-wrap justify-center gap-6 px-20 h-auto m-20">
      {Array.from({ length: 12 }).map((_, index) => (
        <div
          key={index}
          className="bg-gray-300 animate-pulse rounded-md w-64 h-40"
        ></div>
      ))}
    </div>
  );
};

export default CourseSkeleton;