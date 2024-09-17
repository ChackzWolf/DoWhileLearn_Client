import {Routes, Route} from 'react-router-dom';
import TutorDashBoard from '../../../pages/tutor/DashBoard/TutorDashBoard'
import UsersPage from '../../../pages/tutor/DashBoard/UsersPage';
import PayoutsPage from '../../../pages/tutor/DashBoard/PayoutPage';
import CreateCoursePage from '../../../pages/tutor/Course/CreateCourse/CreateCoursePage';
const TutorRoutes = ()=>{
    return(

        <Routes>
            <Route path= '/' element={<TutorDashBoard/>}/>
            <Route path= '/users' element={<UsersPage/>}/>
            <Route path= '/payouts' element={<PayoutsPage/>}/>
            <Route path= '/createCourse' element={<CreateCoursePage/>}/>

        </Routes>
    )
}

export default TutorRoutes