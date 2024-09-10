import Header from "../../../../components/tutor/Layout/Header";
import SideNav from "../../../../components/tutor/Layout/SideNav";
import CreateCourse from "../../../../components/tutor/DashBoardPages/CreateCourse/CreateCourse";
import CreateCourse2 from "../../../../components/tutor/DashBoardPages/CreateCourse/CreateCourse2";
import AddLesson from "../../../../components/tutor/DashBoardPages/CreateCourse/AddLesson";
import ProgressBar from "../../../../components/tutor/Supporters/ProgressBar";
import OverView from "../../../../components/tutor/DashBoardPages/CreateCourse/OverView";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store/store";




const CreateCoursePage = () => {
  // const [step, setStep] = useState<number>(4);
  const step = useSelector((state: RootState) => state.createCourseData.step) as number;
  const courseData = useSelector((state: RootState) => state.createCourseData.createCourse);
  const benifits_prerequisites = useSelector((state: RootState) => state.createCourseData.createCourse2);
  const modules = useSelector((state:RootState) => state.createCourseData.addLessons);
  console.log(courseData, '11111111111111111111111111111111111111111');
  console.log(benifits_prerequisites, '2222222222222222222222222222222222222');
  console.log(modules, '33333333333333333333333333333333333333');


  //DDB3FF
  return (
    <div className="w-full h-screen">
      <Header />
      <div className="flex w-full h-full">
        <SideNav prop={"/tutor/createCourse"} />
        <div className="w-full flex-col">
          <div className="">
            <ProgressBar  />
          </div>

          {step == 1 && <CreateCourse />}
          {step == 2 && <CreateCourse2 />}
          {step == 3 && <AddLesson/>}
          {step == 4 && <OverView/>}
        </div>
      </div>
    </div>
  );
};

export default CreateCoursePage;
