import Course from "../../../components/admin/DashBoardPages/Courses";
import SideNav from "../../../components/admin/Layout/SideNav";
import Header from "../../../components/admin/Layout/header";


const CoursesPage = () => {
//DDB3FF
    return (
     
        <div className="w-full h-screen">
            <Header/>
            <div className="flex w-full">
                <SideNav prop={'/tutor/courses'}/> 
                <Course/>
            </div>
        </div>
    )
}

export default CoursesPage;