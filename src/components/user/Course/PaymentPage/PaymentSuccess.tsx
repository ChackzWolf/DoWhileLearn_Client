import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { orderEndpoint } from "../../../../constraints/orderEndpoints";
import Loader from "../../../common/icons/loader";
import { SiTicktick } from "react-icons/si";

const SuccessPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [orderDetails, setOrderDetails] = useState(() => {
        // Try to load from sessionStorage on initial load
        const savedDetails = sessionStorage.getItem("orderDetails");
        return savedDetails ? JSON.parse(savedDetails) : null;
    });

    useEffect(() => {
        // Only fetch details if they aren't already saved in state
        if (!orderDetails) {
            const fetchOrderDetails = async () => {
                const params = new URLSearchParams(location.search);
                const sessionId: string = params.get('session_id') as string;  // Extract session_id from URL

                if (sessionId) {
                    try {
                        // Fetch payment and order details from the backend
                        const response = await axios.get(orderEndpoint.SuccessPayment, {
                            params: { sessionId },
                        });
                        console.log(response.data, 'response.data');
                        
                        // Save to state and sessionStorage
                        setOrderDetails(response.data);
                        sessionStorage.setItem("orderDetails", JSON.stringify(response.data));
                    } catch (error) {
                        console.log('error', error);
                        // Optionally redirect on error
                        // navigate('/');
                    }
                }
            };
            fetchOrderDetails();
        }
    }, [location, orderDetails]);
    
    const continueToCourse = () => {
        navigate(`/course/${orderDetails.order.courseId}`)
        // Remove order details from sessionStorage after navigating
        sessionStorage.removeItem("orderDetails");
    }

    if (!orderDetails) return <Loader/>;

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-t">
            <div className="flex flex-col text-center items-center gap-4 border-rounded rounded-lg bg-[#DDB3FF] p-10 shadow-lg">
                <h1 className="text-green-500 text-7xl"><SiTicktick /></h1>
                <h1 className="text-2xl font-bold">Payment Successful!</h1>
                <p>{`Order ID :  ${orderDetails?.order?._id}`}</p>
                <p>{`Amount Paid :  ${orderDetails?.order?.price}`}</p>
                <p>{`Course :  ${orderDetails?.order?.title}`}</p>

                <button className="bg-[#7C24F0] border-rounded rounded-lg p-2 shadow-lg text-white font-semibold hover:bg-[#6211cd] transition-all" onClick={()=> {continueToCourse()}}> Continue to the course</button>
            </div>
        </div>
    );
};

export default SuccessPage;
