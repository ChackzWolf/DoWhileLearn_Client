import Header from "../../../../components/tutor/Layout/Header";
import SideNav from "../../../../components/tutor/Layout/SideNav";
import EditProgressBar from "../../../../components/tutor/Supporters/EditProgressBar";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store/store";
import EditCourse from '../../../../components/tutor/DashBoardPages/EditCourse/EditCourse';
import EditCourse2 from '../../../../components/tutor/DashBoardPages/EditCourse/EditCourse2';
import EditModule from '../../../../components/tutor/DashBoardPages/EditCourse/EditModules';
import EditOverView from '../../../../components/tutor/DashBoardPages/EditCourse/EditedOverView';




const EditCoursePage = () => {
  const step = useSelector((state: RootState) => state.editCourseData.step) as number;
  // const courseData = useSelector((state: RootState) => state.editCourseData.editCourse);
  // const benifits_prerequisites = useSelector((state: RootState) => state.editCourseData.editCourse2);
  // const modules = useSelector((state:RootState) => state.editCourseData.editLessons);
  // console.log(courseData, '11111111111111111111111111111111111111111');
  // console.log(benifits_prerequisites, '2222222222222222222222222222222222222');
  // console.log(modules, '33333333333333333333333333333333333333');


  //DDB3FF
  return (
    <div className="w-full h-screen">
      <Header />
      <div className="flex w-full h-full">
        <SideNav prop={"/tutor/courses"} />
        <div className="w-full flex-col">
          <div className="">
            <EditProgressBar  />
          </div>
          {step == 1 && <EditCourse />}
          {step == 2 && <EditCourse2 />}
          {step == 3 && <EditModule/>}
          {step == 4 && <EditOverView/>}
        </div>
      </div>
    </div>
  );
};

export default EditCoursePage;
