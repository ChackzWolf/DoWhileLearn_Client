import Tutors from '../../../components/admin/DashBoardPages/Tutors'
import Header from "../../../components/admin/Layout/header";
import SideNav from '../../../components/admin/Layout/SideNav';

function TutorsPage() {
  return (
    <div className="bg-black w-full h-screen">
    <Header/>
    <div className="flex w-full">
        <SideNav prop = {'/admin'}/> 
        <Tutors/>
    </div>

</div>

  )
}

export default TutorsPage