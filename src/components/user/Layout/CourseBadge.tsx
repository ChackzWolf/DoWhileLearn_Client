interface CourseBadgeProps {
  title: string;
  rating: number; // Optional if not used
  price: string;
  discountPrice: string;
  imageSrc: string;
  color?: string; // Optional if not used
}
const CourseBadge : React.FC<CourseBadgeProps>= ({ title, rating, price, discountPrice, imageSrc, color }) => {
  


  return (
    <div className={`flex flex-col items-start p-4 mx-4 bg-white rounded-lg shadow-md border ${color}`}>
      {imageSrc && (
        <img
          src={imageSrc}
          alt={title}
          className="w-full h-32 object-cover rounded-lg mb-4"
        />
      )}
      <h2 className="text-md font-bold text-gray-800">{title}</h2>
      <div className="flex">

      <div className="mt-2 flex flex-col">
        {discountPrice ? (
          <>
            <span className="text-sm font-semibold text-gray-600 line-through">{price}</span>
            <span className="text-ms font-bold text-red-500">{discountPrice}</span>
          </>
        ) : (
          <span className="text-lg font-semibold text-gray-900">{price}</span>
        )}
      </div>
      <div className="flex items-center mt-6">
        <span className="text-yellow-400 text-xs">
          {"⭐".repeat(rating)} {/* Display stars based on rating */}
        </span>
        {/* <span className="ml-2 text-sm text-gray-600">{rating} / 5</span> */}
      </div>
      </div>



    </div>
  );
};

export default CourseBadge;