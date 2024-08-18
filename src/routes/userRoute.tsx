import {Routes, Route} from 'react-router-dom';
import userEndpoints from '../constraints/endpoints/userEndpoints';
import Home from '../components/user/UserHomePage';


const UserRoutes = () => {
    return(
        <Routes>
            <Route path = {userEndpoints.home} Component={Home}/>
        </Routes>
    )
}

export default UserRoutes