import { Player } from '@lottiefiles/react-lottie-player';
import animationData from "./Animation - 1724910394577.json";

// Accept className as a prop
const FirstImg = () => {
  return (
    <div className={`flex justify-center items-center w-full h-auto max-w-xs sm:max-w-md lg:max-w-lg`}>
      <Player
        autoplay
        loop
        src={animationData} // Reference your downloaded JSON animation here
        style={{ height: '300px', width: '300px' }}
      />
    </div>
  );
};

export default FirstImg;
