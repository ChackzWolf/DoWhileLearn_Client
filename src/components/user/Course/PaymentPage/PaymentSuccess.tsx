import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { orderEndpoint } from "../../../../constraints/orderEndpoints";
import Loader from "../../../common/icons/loader";
import { SiTicktick } from "react-icons/si";
import { RxCrossCircled } from "react-icons/rx";
import { ROUTES } from "../../../../routes/Routes";

const SuccessPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [orderDetails, setOrderDetails] = useState(() => {
        // Try to load from sessionStorage on initial load
        const savedDetails = sessionStorage.getItem("orderDetails");
        return savedDetails ? JSON.parse(savedDetails) : null;
    });
    const [orderStatus, setOrderStatus] = useState<boolean>();
    const [countdown, setCountdown] = useState(20); // countdown starts at 20 seconds

    useEffect(() => {
        // Only fetch details if they aren't already saved in state
        if (!orderDetails) {
            const fetchOrderDetails = async () => {
                const params = new URLSearchParams(location.search);
                const sessionId = params.get('session_id');

                if (sessionId) {
                    try {
                        const response = await axios.get(orderEndpoint.SuccessPayment, {
                            params: { sessionId },
                        });
                        console.log(response.data, 'response.data');
                        const { message, success, data } = response.data;
                        console.log(response.data, 'rr3esponse data/./.')
                        if (success) {
                            console.log(message);
                            setOrderStatus(true);
                            console.log('PAYMENT SUCCESS');
                            setOrderDetails(data);
                        } else {
                            setOrderStatus(false);
                            setOrderDetails(data);
                        }
                    } catch (error) {
                        console.log('error', error);
                    }
                }
            };
            fetchOrderDetails();
        }
    }, [location, orderDetails, orderEndpoint]);

    useEffect(() => {
        // Start countdown if payment fails and orderStatus is false
        if (orderStatus === false) {
            const intervalId = setInterval(() => {
                setCountdown((prevCount) => prevCount - 1);
            }, 1000);

            if (countdown === 0) {
                navigate(ROUTES.common.courseDetails(orderDetails.courseId));
            }

            return () => clearInterval(intervalId);
        }
    }, [orderStatus, countdown, navigate]);
    
    const continueToCourse = () => {
        navigate(ROUTES.common.courseDetails(orderDetails.courseId));
        // Remove order details from sessionStorage after navigating
        sessionStorage.removeItem("orderDetails");
    }
console.log(orderDetails, 'this is order details')
    if (!orderDetails) return <Loader/>;

    return orderStatus ? (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-t">
            <div className="flex flex-col text-center items-center gap-4 border-rounded rounded-lg bg-[#DDB3FF] p-10 shadow-lg">
                <h1 className="text-green-500 text-7xl"><SiTicktick /></h1>
                <h1 className="text-2xl font-bold">Payment Successful!</h1>
                <p>{`Order ID :  ${orderDetails?.tutorId}`}</p>
                <p>{`Amount Paid :  ${orderDetails?.price}`}</p>
                <img src={orderDetails.thumbnail} alt=""  className="h-20 w-25 rounded-lg"/>

                <button className="bg-[#7C24F0] border-rounded rounded-lg p-2 shadow-lg text-white font-semibold hover:bg-[#6211cd] transition-all" onClick={()=> {continueToCourse()}}> Continue to the course</button>
            </div>
        </div>
    )   : (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-t">
    <div className="flex flex-col text-center items-center gap-4 border-rounded rounded-lg bg-[#DDB3FF] p-10 shadow-lg">
        <h1 className="text-red-500 text-7xl"><RxCrossCircled /></h1>
        <h1 className="text-2xl font-bold">Payment failed!</h1>
        <p>{`Order ID :  ${orderDetails?.tutorId}`}</p>
        <p>{`Amount of ${orderDetails?.price} will be credited back to account if debited. in 7 buisness days.`}</p>
        <p>{`Redirecting to course page with in ${countdown} seconds.`}</p>

        <button className="bg-[#7C24F0] border-rounded rounded-lg p-2 shadow-lg text-white font-semibold hover:bg-[#6211cd] transition-all" onClick={()=> {continueToCourse()}}> Back to course page</button>
    </div>
</div>
) 
};

export default SuccessPage;
