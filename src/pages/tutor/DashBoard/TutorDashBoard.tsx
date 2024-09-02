import Header from "../../../components/tutor/Layout/Header";
import SideNav from '../../../components/tutor/Layout/SideNav';
import DashBoard from "../../../components/tutor/DashBoardPages/DashBoard";

const TutorHome = () => {
//DDB3FF
    return (
     
        <div className="bg-black w-full h-screen">
            <Header/>
            <div className="flex w-full">
                <SideNav prop = {'/tutor'}/> 
                <DashBoard/>
            </div>

             
            <h1 className="font-bold self-center text-center text-lg mt-20 text-slate-700"> Tutor Landing Page</h1>

        </div>
    )
}

export default TutorHome;