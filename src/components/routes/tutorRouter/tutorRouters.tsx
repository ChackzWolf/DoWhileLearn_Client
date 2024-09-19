import {Routes, Route} from 'react-router-dom';
import TutorDashBoard from '../../../pages/tutor/DashBoard/TutorDashBoard'
import UsersPage from '../../../pages/tutor/DashBoard/UsersPage';
import PayoutsPage from '../../../pages/tutor/DashBoard/PayoutPage';
import CreateCoursePage from '../../../pages/tutor/Course/CreateCourse/CreateCoursePage';
import CoursesPage from '../../../pages/tutor/DashBoard/CoursesPage'
import CourseDetailsPage from '../../../pages/tutor/Course/CourseDetailsPage'
import EditCoursePage from '../../../pages/tutor/Course/EditCourse/EditCoursePage';
const TutorRoutes = ()=>{
    return(

        <Routes>
            <Route path= '/' element={<TutorDashBoard/>}/>
            <Route path= '/users' element={<UsersPage/>}/>
            <Route path= '/payouts' element={<PayoutsPage/>}/>
            <Route path= '/createCourse' element={<CreateCoursePage/>}/>
            <Route path = '/courses' element = {<CoursesPage/>}/>
            <Route path="/courses/:id" element={<CourseDetailsPage />} />
            <Route path = "/courses/edit-course" element = {<EditCoursePage/>}/>
        </Routes>
    )
}

export default TutorRoutes