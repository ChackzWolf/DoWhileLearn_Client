import Header from "../../../components/tutor/Layout/Header";
import SideNav from '../../../components/tutor/Layout/SideNav';
import Users from "../../../components/tutor/DashBoardPages/Users";

const UsersPage = () => {
//DDB3FF
    return (
     
        <div className=" w-full h-screen">
            <Header/>
            <div className="flex w-full justify-between">
                <SideNav prop={'/tutor/users'}/> 
                <Users/>
            </div>

        </div>
    )
}

export default UsersPage;