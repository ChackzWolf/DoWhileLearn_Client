
import { FaCircle,FaCircleCheck, FaCircleDot } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store/store";
import { setEditCourseStep } from "../../../redux/tutorSlice/CourseSlice/editCourseData";
import { useDispatch } from "react-redux";
import { motion } from 'framer-motion';

const EditProgressBar = () => {
  const totalSteps = 4;
  const current = useSelector((state: RootState) => state.editCourseData.step);
  const dispatch = useDispatch()
  const editCourse1 = useSelector((state:RootState)=> state.editCourseData.editCourse)
  const editCourse2 = useSelector((state:RootState)=> state.editCourseData.editLessons)
  const editCourse3 = useSelector((state:RootState)=> state.editCourseData.editCourse2)
  console.log(current , 'kkkkkkkkkkkkkkkkkkkkkk')
  const progressPercentage = ((current - 1) / (totalSteps - 1)) * 100;



  
  // Function to render checkpoints
  const renderCheckpoints = () => {
    const checkpoints = [];
    for (let i = 1; i <= totalSteps; i++) {


      const checkIsPassed = (index:number)=>{
        if(index === 1){
          return null !== editCourse1
        }else if(index === 2){
          return null !== editCourse3
        }else if(index === 3){
          return null !== editCourse2
        }else if (index === 4){
          return null !== editCourse3 && null !== editCourse2 && null !== editCourse1
        }
        return false
      }


      const position = ((i - 1) / (totalSteps - 1)) * 100 - 1;
      const isPassed = checkIsPassed(i)
      const isCurrent = i === current;

      checkpoints.push(
        <div
          key={i}
          className="absolute top-1/2 transform -translate-y-1/2 flex items-center justify-center"
          style={{ left: `${position}%`, width: '26px', height: '26px' }}
        >
          {isCurrent ? (
            <FaCircleDot
              size={26}
              className="text-[#7C24F0] bg-white bg-gradient-to-br from-white via-white to-[#7C24F0] rounded-full p-0.5"
              style={{ fill: '#7C24F0' }}
            />
          ) :isPassed ? (
            <button onClick={()=>{dispatch(setEditCourseStep(i))}}>
              <FaCircleCheck
                size={26}
                className="transition-all text-[#7C24F0] bg-white bg-gradient-to-br from-white via-white to-[#7C24F0] hover:scale-110 rounded-full p-0.5"
              />
            </button>

          ) :  (
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
      <motion.div
        initial={{ opacity: 0,x:130, scale: 0 }}  
        animate={{ opacity: 1, x:0, scale: 1 }} 
        exit={{ opacity: 0, x:230, scale: 0 }}   
        transition={{    
          duration: 0.6, // Extremely fast duration (50ms)   
          ease: 'easeOut',      
        }}
        className="bg-[#7C24F0] h-full rounded-full"
        style={{ width: `${progressPercentage}%` }}
      ></motion.div>
      {renderCheckpoints()}
    </div>
  );
};

export default EditProgressBar;
