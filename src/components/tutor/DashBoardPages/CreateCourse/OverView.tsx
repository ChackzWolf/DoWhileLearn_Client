import { RootState } from "../../../../redux/store/store"
import { useSelector } from "react-redux"
import Modules from "./OverView/Modules";
import { CreateCourseState } from "../../../../components/Interfaces/TutorInterfaces/ICreateCourse";
import { toPrev } from "../../../../redux/tutorSlice/CourseSlice/createCourseData";
import { useDispatch } from "react-redux";


function OverView() {
const courseData = useSelector((state: RootState) => state.createCourseData.createCourse);
const dispatch = useDispatch()
const benifits_prerequisites = useSelector((state: RootState) => state.createCourseData.createCourse2);
const modules :CreateCourseState | null = useSelector((state:RootState) => state.createCourseData.addLessons);
console.log(courseData, '11111111111111111111111111111111111111111');
console.log(benifits_prerequisites, '2222222222222222222222222222222222222');
console.log(modules, '33333333333333333333333333333333333333');

  return (
    <div>
        <div className="flex m-10 ">
            <div className="w-1/2 h-28">
                <h1 className=" ">
                {courseData?.courseTitle}
                </h1>
                <div className="bg-slate-500 w-full h-full ">

                </div>
            </div>
            <div className="w-1/2 h-28 m-10 justify-between">
                <h1>{courseData?.courseDescription}</h1>
                {courseData?.discountPrice ?
                <div className="bottom-0">
                    <h1 className="text-gray-600 line-through">Rs. {courseData.coursePrice}</h1>
                    <button className="bg-[#7C24F0] rounded-lg px-4 py-2 font-bold text-white hover:bg-[#6211cd] bottom-0">Rs. {courseData?.discountPrice}</button>
                </div>
                    :
                    <button className="bg-[#7C24F0] rounded-lg px-4 py-2 font-bold text-white hover:bg-[#6211cd] bottom-0">Rs. {courseData?.coursePrice}</button>
                }
            </div>
        </div>
        <div className="flex mx-10">
            <div className="w-1/2 h-28">
                <h1 className="font-bold">What will you get from this course?</h1>
                <ul>
                    {
                        benifits_prerequisites?.benefits.map((benifits) => (
                            <li>- {benifits}</li>
                        ))
                    }
                </ul>
                <h1 className="font-bold">What are the prerequisitest for starting this course?</h1> 
                <ul>
                    {
                        benifits_prerequisites?.prerequisites.map((prerequisites) => (
                            <li>- {prerequisites}</li>
                        ))
                    }
                </ul>           
            </div>
                <Modules modules={modules} />
           
        </div>
        <div className="flex justify-between mx-20">
        <button className='py-2 px-8 bg-[#7C24F0] text-white font-semibold rounded-md hover:bg-[#6211cd] transition' onClick={()=>{dispatch(toPrev())}}> previous</button>
        <button className=" right-0 bg-[#7C24F0] px-5 py-2 rounded-lg text-white font-bold hover:bg-[#6211cd]">List course</button>
        </div>
        
    </div>
  )
}

export default OverView