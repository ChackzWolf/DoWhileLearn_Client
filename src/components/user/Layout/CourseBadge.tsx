import React from 'react';
import { useNavigate } from 'react-router-dom';

interface CourseBadgeProps {
  _id:string;
  title: string;
  description: string;
  rating: number;
  price: string;
  discountPrice?: string;
  imageSrc?: string;
  color?: string;
}

const CourseBadge: React.FC<CourseBadgeProps> = ({
  _id,
  title,
  description,
  rating,
  price,
  discountPrice,
  imageSrc,
  color = 'bg-gray-100', // default color
}) => {
  const navigate = useNavigate()

  console.log(_id,'hello htis is')
  const handleCourseSelect = (_id:string) => {
    navigate(`/course/${_id}`)
  }
  return (
    <div
      className={`flex flex-col items-start mx-2 p-4 bg-white rounded-lg shadow-md border ${color} w-64 h-80 overflow-hidden`} // Fixed width and height
      onClick={()=>handleCourseSelect(_id)}
    >
      <div className="flex-shrink-0 w-full h-32 mb-2">
        {imageSrc && (
          <img
            src={imageSrc}
            alt={title}
            className="w-full h-full object-cover rounded-lg" // Ensure the image covers the div
          />
        )}
      </div>
      <div className='w-full'>
            <h2 className="text-md font-bold text-gray-800" >{title}</h2>
            <p className="text-xs font-medium text-gray-500  line-clamp-3 mt-1"  >{description}</p>
      </div>
      <div className="flex justify-between w-full mt-auto">
        <div className="flex flex-col mr-4">
          {discountPrice ? (
            <>
              <span className="text-sm font-semibold text-gray-600 line-through">
                {price}
              </span>
              <span className="text-lg font-bold text-red-500">
                {discountPrice}
              </span>
            </>
          ) : (
            <span className="text-lg font-semibold text-gray-900">
              {price}
            </span>
          )}
        </div>
        <div className="flex items-center mt-2">
          <span className="text-yellow-400 text-xs">
            {'⭐'.repeat(rating)} {/* Display stars based on rating */}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CourseBadge;
