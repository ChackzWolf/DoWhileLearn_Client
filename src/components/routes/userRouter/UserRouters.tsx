import {Routes, Route} from 'react-router-dom';
import OtpVarification from '../../user/auth/OtpVarification';
import AuthChoice from '../../common/AuthChoice';
import PaymentSuccessPage from '../../../pages/user/PaymentStatus/PaymentSuccessPage';
import CartPage from '../../../pages/user/Cart/CartPage';
import ProfilePage from '../../../pages/user/Profile/ProfilePage';
import TutorDetailsPage from '../../../pages/user/TutorDetailsPage/TutorDetailsPage';
import Header from '../../user/Layout/Header';

const UserRoutes = ()=>{
    return(
        <>
            <Header/>
            <Routes>
                <Route path = '/profile' element = {<ProfilePage/>}/>
                <Route path ='/AuthChoice' element = {<AuthChoice/>}/>
                <Route path = '/otp' element = {<OtpVarification/>}/>
                <Route path = '/payment/success' element = {<PaymentSuccessPage/>}/>
                <Route path = '/cart' element = {<CartPage/>}/>
                <Route path = '/tutor/profile/:id' element= {<TutorDetailsPage/>} />
            </Routes>
        </>
    )
}

export default UserRoutes