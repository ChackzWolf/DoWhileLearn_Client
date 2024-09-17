import Header from "../../../components/admin/Layout/header";
import SideNav from '../../../components/admin/Layout/SideNav';
import DashBoard from "../../../components/admin/DashBoardPages/DashBoard";
import Students from "../../../components/admin/DashBoardPages/Students";

const StudentsPage = () => {
//DDB3FF
    return (
     
        <div className="bg-black w-full h-screen">
            <Header/>
            <div className="flex w-full">
                <SideNav prop = {'/admin'}/> 
                <Students/>
            </div>

        </div>
    )
}
export default StudentsPage