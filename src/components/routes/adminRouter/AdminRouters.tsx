import {Routes, Route} from 'react-router-dom';
import AdminDashBoardPage from '../../../pages/admin/DashBoard/AdminDashBoardPage';
import StudentsPage from '../../../pages/admin/DashBoard/StudentsPage';
import TutorsPage from '../../../pages/admin/DashBoard/TutorsPage';
import CourseDetailsPage from '../../../pages/tutor/Course/CourseDetailsPage';
import StudentDetailsPage from '../../../pages/admin/DashBoard/StudentsDetailsPage/StudentDetailsPage';
import TutorDetailsPage from '../../../pages/admin/DashBoard/TutorDetailsPage/TutorDetailsPage';
import CoursesPage from '../../../pages/admin/DashBoard/CoursesPage';
import PayoutsPage from '../../../pages/admin/DashBoard/PayoutsPage';
import { ToastContainer } from 'react-toastify';
import Header from '../../admin/Layout/header';
import SideNav from '../../admin/Layout/SideNav';


const AdminRoutes = ()=>{
    return(
        <div className='h-full bg-accent'>
        <ToastContainer/>
        <Header/>
            <div className='flex h-full w-full'>
                <SideNav/>
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
    )
}

export default AdminRoutes