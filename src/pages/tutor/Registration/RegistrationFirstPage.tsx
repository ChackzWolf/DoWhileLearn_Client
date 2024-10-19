import Header from "../../../components/tutor/Layout/Header";
import SideNav from "../../../components/tutor/Layout/SideNav";
import CreateCourse from "../../../components/tutor/DashBoardPages/CreateCourse/CreateCourse";
import CreateCourse2 from "../../../components/tutor/DashBoardPages/CreateCourse/CreateCourse2";
import AddLesson from "../../../components/tutor/DashBoardPages/CreateCourse/AddLesson";
import ProgressBar from "../../../components/tutor/Supporters/ProgressBar";
import OverView from "../../../components/tutor/DashBoardPages/CreateCourse/OverView";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store/store";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { setCreateCourseEmpty } from "../../../redux/tutorSlice/CourseSlice/createCourseData";
import Registeration1 from "../../../components/tutor/auth/TutorRegistration/Registration1";



const RegistrationPage = () => {
  // const [step, setStep] = useState<number>(4);
  const step = useSelector((state: RootState) => state.createCourseData.step) as number;
  const courseData = useSelector((state: RootState) => state.createCourseData.createCourse);
  const benifits_prerequisites = useSelector((state: RootState) => state.createCourseData.createCourse2);
  const modules = useSelector((state:RootState) => state.createCourseData.addLessons);
  console.log(courseData, '11111111111111111111111111111111111111111');
  console.log(benifits_prerequisites, '2222222222222222222222222222222222222');
  console.log(modules, '33333333333333333333333333333333333333');
  const dispatch = useDispatch()
  // useEffect(()=> {
  //   dispatch(setCreateCourseEmpty())
  // })
  //DDB3FF
  return (
    <div className="w-full h-min-screen bg-[#FCF6FF]">

      <div className="flex w-full h-full">
       
        <div className="w-full flex-col bg-[#FCF6FF] h-full">
          <div className="">
            {/* <ProgressBar  /> */}
          </div>

          {step == 1 && <Registeration1/>}
          {step == 2 && <CreateCourse2 />}
          {step == 3 && <AddLesson/>}
          {step == 4 && <OverView/>}
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;
