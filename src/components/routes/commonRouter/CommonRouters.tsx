import {Routes, Route} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import UserHome from '../../user/UserHome';
import AuthChoice from '../../common/AuthChoice';
import CoursesListPage from '../../../pages/user/Courses/CoursesListPage';
import Header from '../../user/Layout/Header';
import CourseDetailsPage from '../../../pages/user/Courses/CourseDetailsPage';


const CommonRoutes = ()=>{
    return(
        <>
            <ToastContainer/>
                <Header/>
                <Routes>
                    <Route path='/' element= {<UserHome/>}/>
                    <Route path='/AuthChoice' element= {<AuthChoice/>}/>
                    <Route path ='/courses' element = {<CoursesListPage/>}/>
                    <Route path="/course/:id" element={<CourseDetailsPage/>} />
                </Routes>
        </>
    )
}

export default CommonRoutes