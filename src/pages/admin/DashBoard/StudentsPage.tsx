import Header from "../../../components/admin/Layout/header";
import SideNav from '../../../components/admin/Layout/SideNav';
import Students from "../../../components/admin/DashBoardPages/Students";

const StudentsPage = () => {
//DDB3FF
    return (
     
        <div className="w-full h-screen">
            <Header/>
            <div className="flex w-full">
                <SideNav prop = {'/admin/students'}/> 
                <Students/>
            </div>

        </div>
    )
}
export default StudentsPage