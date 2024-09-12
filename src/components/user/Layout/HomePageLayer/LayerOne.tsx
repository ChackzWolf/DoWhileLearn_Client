import FirstImg from "../../svgs/firstAnim"; // Use PascalCase for component names

function LayerOne() {
  return (
    <div className="w-full h-96 flex  bg-[#DDB3FF] ">
    <div className="w-1/2 h-full flex justify-center items-center text-center">
        <div className="m-48">
            <h1 className="text-[#7C24F0] text-lg font-bold">Never ending loop</h1>
            <h1>A good developer's life is a never-ending learning loop. Keep learning with us and keep growing</h1>
        </div>
    </div>
    <div className="w-1/2 h-full flex justify-center items-center">  
        <FirstImg/> {/* Use the component like this */}
    </div>
</div>
  )
}

export default LayerOne