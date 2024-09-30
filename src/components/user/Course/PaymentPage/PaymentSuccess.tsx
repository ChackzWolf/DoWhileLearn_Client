import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { orderEndpoint } from "../../../../constraints/orderEndpoints";

const SuccessPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [orderDetails, setOrderDetails] = useState(null);
 
    useEffect(() => {
        const fetchOrderDetails = async () => {
            const params = new URLSearchParams(location.search);
            const sessionId: string = params.get('session_id') as string;  // Extract session_id from URL

            if (sessionId) {
                try {
                    // Fetch payment and order details from the backend
                    const response = await axios.get(orderEndpoint.SuccessPayment,{
                      params: { sessionId },
                    });
                    console.log(response.data,'response . data ')
                    setOrderDetails(response.data);
                } catch (error) {
                   // navigate('/'); // Handle errors, maybe redirect or show error message
                   console.log('error',error)
                }
            }
        };
        fetchOrderDetails();
    }, [location, navigate]);

    if (!orderDetails) return <div>Processing...</div>;

    return (
        <div>
            <h1>Payment Successful!</h1>
            {/* <p>Order ID: {orderDetails.orderId}</p>
            <p>Amount Paid: ${orderDetails.amount / 100}</p>
            <p>Course: {orderDetails.courseTitle}</p> */}
            {/* Display other order details */}
        </div>
    );
};

export default SuccessPage;
