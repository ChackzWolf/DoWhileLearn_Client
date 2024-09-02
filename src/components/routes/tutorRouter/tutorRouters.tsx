import {Routes, Route} from 'react-router-dom';
import TutorRegister from "../../tutor/auth/register";
import TutorLogin from "../../tutor/auth/Login";
import OtpVarification from '../../user/auth/OtpVarification';
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
            <Route path= '/payouts' element={<PayoutsPage/>}/>
            <Route path= '/createCourse' element={<CreateCoursePage/>}/>


            <Route path = '/register' element = {<TutorRegister/>}/>
            <Route path = '/login' element = {<TutorLogin/>}/>
            <Route path = '/otp' element = {<OtpVarification/>}/>
        </Routes>
    )
}

export default TutorRoutes