import {Routes, Route} from 'react-router-dom';
import UserHome from "../../user/UserHome";
import OtpVarification from '../../user/auth/OtpVarification';
import AuthChoice from '../../common/AuthChoice';
import PaymentSuccessPage from '../../../pages/user/PaymentStatus/PaymentSuccessPage';
import CartPage from '../../../pages/user/Cart/CartPage';
import ProfilePage from '../../../pages/user/Profile/ProfilePage';
import TutorDetailsPage from '../../../pages/user/TutorDetailsPage/TutorDetailsPage';

const UserRoutes = ()=>{
    return(
        
        <Routes>
            <Route path ='/' element = {<UserHome/>}/>
            <Route path = '/profile' element = {<ProfilePage/>}/>
            <Route path ='/AuthChoice' element = {<AuthChoice/>}/>
            <Route path = '/otp' element = {<OtpVarification/>}/>
            <Route path = '/payment/success' element = {<PaymentSuccessPage/>}/>
            <Route path = '/cart' element = {<CartPage/>}/>
            <Route path = '/tutor/profile/:id' element= {<TutorDetailsPage />} />
        </Routes>
        
    )
}

export default UserRoutes