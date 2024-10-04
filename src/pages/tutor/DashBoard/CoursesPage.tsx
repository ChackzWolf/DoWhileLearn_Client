import Header from "../../../components/tutor/Layout/Header";
import SideNav from '../../../components/tutor/Layout/SideNav';
import Course from "../../../components/tutor/DashBoardPages/Course";

const PayoutsPage = () => {
//DDB3FF
    return (
     
        <div className="w-full h-screen">
            <Header/>
            <div className="flex w-full">
                <SideNav prop={'/tutor/courses'}/> 
                <Course/>
            </div>
        </div>
    )
}

export default PayoutsPage;