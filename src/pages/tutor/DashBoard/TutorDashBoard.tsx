import Header from "../../../components/tutor/Layout/Header";
import SideNav from '../../../components/tutor/Layout/SideNav';
import DashBoard from "../../../components/tutor/DashBoardPages/DashBoard";

const TutorHome = () => {
//DDB3FF
    return (
     
        <div className=" w-full h-screen">
            <Header/>
            <div className="flex w-full">
                <SideNav prop = {'/tutor'}/> 
                <DashBoard/>
            </div>

             

        </div>
    )
}

export default TutorHome;