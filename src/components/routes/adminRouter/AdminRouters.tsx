import {Routes, Route} from 'react-router-dom';
import AdminDashBoardPage from '../../../pages/admin/DashBoard/AdminDashBoardPage';
import StudentsPage from '../../../pages/admin/DashBoard/StudentsPage';
import TutorsPage from '../../../pages/admin/DashBoard/TutorsPage';
import CourseDetailsPage from '../../../pages/tutor/Course/CourseDetailsPage';


const AdminRoutes = ()=>{
    return(
        
        <Routes>
            <Route path ='/' element = {<AdminDashBoardPage/>}/>
            <Route path = '/students' element = {<StudentsPage/>}/>
            <Route path = '/tutors' element = {<TutorsPage/>}/>
    
        </Routes>
    )
}

export default AdminRoutes