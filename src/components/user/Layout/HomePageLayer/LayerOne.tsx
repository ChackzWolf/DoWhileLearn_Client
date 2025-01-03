import FirstImg from "../../svgs/firstAnim"; // Use PascalCase for component names

function LayerOne() {
  return (
    <div className="w-full min-h-screen sm:h-96 flex flex-col sm:flex-row bg-gradient-to-b from-[#DDB3FF] overflow-hidden">
      {/* Text Section */}
      <div className="w-full sm:w-1/2 h-full flex justify-center items-center text-center p-8 sm:p-0">
        <div className="m-4 sm:m-24 md:m-23 lg:m-32">
          <h1 className="text-[#7C24F0] text-lg sm:text-xl lg:text-2xl font-bold mb-4">Never-Ending Loop.</h1>
          <p className="text-sm sm:text-base lg:text-lg">
          At Do While Learn, every lesson is a step toward mastery. Explore limitless opportunities, grow your skills, and embrace the developer's journey—because learning never ends.
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
