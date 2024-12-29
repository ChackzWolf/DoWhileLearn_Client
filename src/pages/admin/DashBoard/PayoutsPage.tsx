import Payouts from "../../../components/admin/DashBoardPages/Payouts";
import SideNav from "../../../components/admin/Layout/SideNav";
import Header from "../../../components/admin/Layout/header";


const PayoutsPage = () => {
//DDB3FF
    return (
     
        <div className="w-full h-screen">
            <Header/>
            <div className="flex w-full">
                <SideNav prop = {'/admin/payouts'}/> 
                <Payouts/>
            </div>

        </div>
    )
}

export default PayoutsPage;