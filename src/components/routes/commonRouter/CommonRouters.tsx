import {Routes, Route} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import UserHome from '../../user/UserHome';
import AuthChoice from '../../common/AuthChoice';
import CoursesListPage from '../../../pages/user/Courses/CoursesListPage';
import Header from '../../user/Layout/Header';
import CourseDetailsPage from '../../../pages/user/Courses/CourseDetailsPage';
import { ScrollButton } from '../../common/ScrollUp';
import CourseListAndChat from '../../user/Chat/ChatCoursesRoute';
import { Footer } from '../../user/Layout/Footer';


const CommonRoutes = ()=>{
    return( 
        <div
        className='bg-gradient-to-br from-purple-500 to-lavender-start via-primary to-purple-to-lavender-end h-full'
        >
            <ToastContainer/>
                <Header/>
                <div className='min-h-screen'>

                
                <Routes>
                    <Route path='/' element= {<UserHome/>}/>
                    <Route path='/AuthChoice' element= {<AuthChoice/>}/>
                    <Route path ='/courses' element = {<CoursesListPage/>}/>
                    <Route path="/course/:id" element={<CourseDetailsPage/>}/>
                </Routes>
                </div>
                <CourseListAndChat/>
                <ScrollButton/>
                <Footer/>
        </div>
    )
}
 
export default CommonRoutes