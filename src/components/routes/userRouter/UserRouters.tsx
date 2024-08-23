import {Routes, Route} from 'react-router-dom';
import UserHome from "../../user/UserHome";
import UserRegister from "../../user/auth/register";
import UserLogin from "../../user/auth/Login";
import OtpVarification from '../../user/auth/OtpVarification';


const UserRoutes = ()=>{
    return(
        
        <Routes>
            <Route path ='/' element = {<UserHome/>}/>
            <Route path = '/register' element = {<UserRegister/>}/>
            <Route path = '/login' element = {<UserLogin/>}/>
            <Route path = '/otp' element = {<OtpVarification/>}/>
        </Routes>
    )
}

export default UserRoutes