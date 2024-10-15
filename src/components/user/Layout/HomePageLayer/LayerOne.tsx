import FirstImg from "../../svgs/firstAnim"; // Use PascalCase for component names

function LayerOne() {
  return (
    <div className="w-full h-auto sm:h-96 flex flex-col sm:flex-row bg-gradient-to-b from-[#DDB3FF] overflow-hidden">
      {/* Text Section */}
      <div className="w-full sm:w-1/2 h-full flex justify-center items-center text-center p-8 sm:p-0">
        <div className="m-4 sm:m-24 md:m-23 lg:m-32">
          <h1 className="text-[#7C24F0] text-lg sm:text-xl lg:text-2xl font-bold mb-4">Never ending loop</h1>
          <p className="text-sm sm:text-base lg:text-lg">
            A good developer's life is a never-ending learning loop. Keep learning with us and keep growing.
          </p>
        </div>
      </div>

      {/* SVG Section */}
      <div className="w-full sm:w-1/2 h-full flex justify-center items-center overflow-hidden">
        <FirstImg />

      </div>
    </div>
  );
}

export default LayerOne;
