import {Routes, Route} from 'react-router-dom';
import AdminDashBoardPage from '../../../pages/admin/DashBoard/AdminDashBoardPage';
import StudentsPage from '../../../pages/admin/DashBoard/StudentsPage';


const AdminRoutes = ()=>{
    return(
        
        <Routes>
            <Route path ='/' element = {<AdminDashBoardPage/>}/>
            <Route path = '/students' element = {<StudentsPage/>}/>
        </Routes>
    )
}

export default AdminRoutes