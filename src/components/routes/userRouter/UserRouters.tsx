import {Routes, Route} from 'react-router-dom';
import UserHome from "../../user/UserHome";
import UserRegister from "../../user/auth/register";
import UserLogin from "../../user/auth/Login";


const UserRoutes = ()=>{
    return(
        
        <Routes>
            
            <Route path ='/' element = {<UserHome/>}/>
            <Route path = '/register' element = {<UserRegister/>}/>
            <Route path = '/login' element = {<UserLogin/>}/>
        </Routes>
    )
}

export default UserRoutes