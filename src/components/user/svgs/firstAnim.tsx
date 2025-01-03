// import { Player } from '@lottiefiles/react-lottie-player';
import animationData from "../../../../public/assets/Lottie/frontPageAnim.json";
import Lottie from 'lottie-react';
// Accept className as a prop
const FirstImg = () => {
  return (
    <div className={`flex justify-center items-center w-full h-auto max-w-xs sm:max-w-md lg:max-w-lg`}>
      {/* <Player
        autoplay
        loop
        src={animationData} // Reference your downloaded JSON animation here
        style={{ height: '300px', width: '300px' }}
      /> */}

<Lottie animationData={animationData} loop={true} />

    </div>
  );
};

export default FirstImg;
