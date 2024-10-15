import {Routes, Route} from 'react-router-dom';

import OtpVarification from '../../user/auth/OtpVarification';
import LoginUser from '../../user/auth/Login';
import RegisterUser from '../../user/auth/register';


const UserAuthRoutes = ()=>{
    return(
        
        <Routes>
              <Route path='/login/user' element={<LoginUser/>}/>
              <Route path='/register/user' element={<RegisterUser/>}/>
              <Route path='/register/user/otp' element = {<OtpVarification/>}/>
        </Routes>
    )
}

export default UserAuthRoutes