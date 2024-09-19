import Header from "../../../components/tutor/Layout/Header";
import SideNav from '../../../components/tutor/Layout/SideNav';
import CourseDetails from '../../../components/tutor/DashBoardPages/Course/CourseDetails'

function CourseDetailsPage() {
  return (
    <div className="w-full h-screen">
    <Header/>
    <div className="flex w-full">
        <SideNav prop={'/tutor/courses'}/> 
        <CourseDetails/>
    </div>

     
    <h1 className="font-bold self-center text-center text-lg mt-20 text-slate-700"> Tutor Landing Page</h1>

</div>
    
  )
}

export default CourseDetailsPage