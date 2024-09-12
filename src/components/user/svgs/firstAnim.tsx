import { Player } from '@lottiefiles/react-lottie-player';
import animationData from "./Animation - 1724910394577.json"


const firstImg = () => {
    return (
      <div className="flex justify-center items-center h-screen">
        <Player
          autoplay
          loop
          src={animationData} // Reference your downloaded JSON animation here
          style={{ height: '300px', width: '300px' }}
        />
      </div>
    );
  };
  
  export default firstImg;
