// CourseDetailSkeleton.tsx
import React from "react";

const CourseDetailSkeleton: React.FC = () => {
    return (
        <div className="flex gap-5 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="w-3/4  animate-pulse ">
            <div className="relative w-full min-h-screen md:h-40 lg:h-full rounded-lg bg-purple-100 border-2 border-dashed  hover:bg-purple-100 cursor-pointer flex items-center justify-center m-2 self-center">
                    
                </div>
            </div>
            <div className="w-1/3 top-36 animate-pulse ">
                <div className="relative w-full min-h-screen md:h-40 lg:h-full rounded-lg bg-purple-100 border-2 border-dashed hover:bg-purple-100 cursor-pointer flex items-center justify-center m-2 self-center">
                 
                </div>


            </div>
        </div>
    );
};

export default CourseDetailSkeleton;
