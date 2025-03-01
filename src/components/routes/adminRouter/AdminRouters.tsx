import {Routes, Route} from 'react-router-dom';
import AdminDashBoardPage from '../../../pages/admin/DashBoard/AdminDashBoardPage';
import StudentsPage from '../../../pages/admin/DashBoard/StudentsPage';
import TutorsPage from '../../../pages/admin/DashBoard/TutorsPage';
import StudentDetailsPage from '../../../pages/admin/DashBoard/StudentsDetailsPage/StudentDetailsPage';
import TutorDetailsPage from '../../../pages/admin/DashBoard/TutorDetailsPage/TutorDetailsPage';
import CoursesPage from '../../../pages/admin/DashBoard/CoursesPage';
import PayoutsPage from '../../../pages/admin/DashBoard/PayoutsPage';
import { ToastContainer } from 'react-toastify';
import Header from '../../admin/Layout/header';
import SideNav from '../../admin/Layout/SideNav';
import CourseDetailsPage from '../../../pages/user/Courses/CourseDetailsPage';


const AdminRoutes = ()=>{
    return(
        <div className='h-full min-h-screen bg-accent max-w-screen'>
            <div className='h-full md:w-2/12'>
                <ToastContainer/>
            </div>
            <Header/>
            <div className='flex h-full w-full bg-accent overflow-hidden ${credentialVisible ? "bg-black bg-opacity-50" : "opacity-0 hidden"}`'>
                <SideNav/>
                <div className='h-full md:w-10/12 w-full md:pr-8'>
                <Routes>
                    <Route path ='/' element = {<AdminDashBoardPage/>}/>
                    <Route path = '/students' element = {<StudentsPage/>}/>
                    <Route path = '/tutors' element = {<TutorsPage/>}/>
                    <Route path = '/payouts' element = {<PayoutsPage/>}/>
                    <Route path = '/courses' element = {<CoursesPage/>}/>
                    <Route path = '/student/details/:id' element = {<StudentDetailsPage/>}/>
                    <Route path = '/tutor/details/:id' element = {<TutorDetailsPage/>}/>
                    <Route path = '/course/details/:id' element = {<CourseDetailsPage/>}/>
                </Routes>
                </div>
            </div>


        </div>
    )
}

export default AdminRoutes