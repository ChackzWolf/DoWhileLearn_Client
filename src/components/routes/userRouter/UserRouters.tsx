import {Routes, Route} from 'react-router-dom';
import UserHome from "../../user/UserHome";
import UserRegister from "../../user/auth/register";
import UserLogin from "../../user/auth/Login";
import OtpVarification from '../../user/auth/OtpVarification';
import AuthChoice from '../../common/AuthChoice';
import PaymentSuccessPage from '../../../pages/user/PaymentStatus/PaymentSuccessPage';
import CartPage from '../../../pages/user/Cart/CartPage';

const UserRoutes = ()=>{
    return(
        
        <Routes>
            <Route path ='/' element = {<UserHome/>}/>
            <Route path ='/AuthChoice' element = {<AuthChoice/>}/>
            <Route path = '/register' element = {<UserRegister/>}/>
            <Route path = '/login' element = {<UserLogin/>}/>
            <Route path = '/otp' element = {<OtpVarification/>}/>
            <Route path = '/payment/success' element = {<PaymentSuccessPage/>}/>
            <Route path = '/cart' element = {<CartPage/>}/>
        </Routes>
        
    )
}

export default UserRoutes