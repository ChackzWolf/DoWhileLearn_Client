
import { FaCircle,FaCircleCheck, FaCircleDot } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store/store";
import { setCreateCourseStep } from "../../../redux/tutorSlice/CourseSlice/createCourseData";
import { useDispatch } from "react-redux";
// import { setCreateCourseEmpty } from "../../../redux/tutorSlice/CourseSlice/createCourseData";


const ProgressBar = () => {
  const totalSteps = 4;
  // const current = useSelector((state: RootState) => state.createCourseData.step) as number
  const current = useSelector((state: RootState) => {
    // console.log(JSON.stringify(state.createCourseData, null, 2), 'lets see');
    return state.createCourseData.step;
  }) as number;
  // dispatch(setCreateCourseEmpty());
  const dispatch = useDispatch()
  const createCourse1 = useSelector((state:RootState)=> state.createCourseData.createCourse);
  const createCourse2 = useSelector((state:RootState)=> state.createCourseData.addLessons);
  const createCourse3 = useSelector((state:RootState)=> state.createCourseData.createCourse2)

  console.log(current , 'kkkkkkkkkkkkkkkkkkkkkk')
  const progressPercentage = ((current - 1) / (totalSteps - 1)) * 100;

  // Function to render checkpoints
  const renderCheckpoints = () => {
    const checkpoints = [];

    const checkIsPassed = (index:number)=>{
      if(index === 1){
        return null !== createCourse1
      }else if(index === 2){
        return null !== createCourse2
      }else if(index === 3){
        return null !== createCourse3
      }else if (index === 4){
        return null !== createCourse1 && null !== createCourse2 && null !== createCourse3
      }
      return false
    }

    for (let i = 1; i <= totalSteps; i++) {
      const position = ((i - 1) / (totalSteps - 1)) * 100 - 1;
      const isPassed = checkIsPassed(i)
      const isCurrent = i === current;

      checkpoints.push(
        <div
          key={i}
          className="absolute top-1/2 transform -translate-y-1/2 flex items-center justify-center"
          style={{ left: `${position}%`, width: '26px', height: '26px' }}
        >
          {isPassed ? (
            <button onClick={()=>{dispatch(setCreateCourseStep(i))}}>
            <FaCircleCheck
              size={26}
              className="text-[#7C24F0] bg-white bg-gradient-to-br from-white via-white to-[#7C24F0] rounded-full p-0.5"
            />
            </button>
          ) : isCurrent ? (
            <FaCircleDot
              size={26}
              className="text-[#7C24F0] bg-white bg-gradient-to-br from-white via-white to-[#7C24F0] rounded-full p-0.5"
              style={{ fill: '#7C24F0' }}
            />
          ) : (
            <FaCircle
              size={26}
              className="bg-gray-300 text-gray-300 rounded-full "
            />
          )}
        </div>
      );
    }
    return checkpoints;
  };

  return (
    <div className="relative bg-gray-300 rounded-full h-2 mx-32 mt-5">
      <div
        className="bg-[#7C24F0] h-full rounded-full"
        style={{ width: `${progressPercentage}%` }}
      ></div>
      {renderCheckpoints()}
    </div>
  );
};

export default ProgressBar;
