import Header from "../../../components/admin/Layout/header";
import SideNav from '../../../components/admin/Layout/SideNav';
import DashBoard from "../../../components/admin/DashBoardPages/DashBoard";

const AdminDashBoardPage = () => {
//DDB3FF
    return (
     
        <div className="bg-black w-full h-screen">
            <Header/>
            <div className="flex w-full">
                <SideNav prop = {'/admin'}/> 
                <DashBoard/>
            </div>

             
            <h1 className="font-bold self-center text-center text-lg mt-20 text-slate-700"> Tutor Landing Page</h1>

        </div>
    )
}

export default AdminDashBoardPage;