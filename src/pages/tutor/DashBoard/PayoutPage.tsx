import Payouts from "../../../components/tutor/DashBoardPages/Payouts";
import Header from "../../../components/tutor/Layout/Header";
import SideNav from '../../../components/tutor/Layout/SideNav';

const PayoutsPage = () => {
//DDB3FF
    return (
     
        <div className="w-full h-screen">
            <Header/>
            <div className="flex w-full">
                <SideNav prop = {'/tutor/payouts'}/> 
                <Payouts/>
            </div>

        </div>
    )
}

export default PayoutsPage;