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


            <h1 className="font-bold self-center text-center text-lg mt-20 text-slate-700"> Tutor Landing Page</h1>

        </div>
    )
}

export default UsersPage;