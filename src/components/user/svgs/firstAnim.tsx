import animationData from "../../../../public/assets/Lottie/anim2.json";
import Lottie from 'lottie-react';

const FirstImg = () => {
  return (
    <div className="flex justify-center items-center w-full md:h-auto lg:h-auto h-80">
      <Lottie 
        animationData={animationData} 
        loop={true} 
        style={{ height: '800px', width: '1400px' }} // Adjust height and width here
      />
    </div>
  );
};

export default FirstImg;
