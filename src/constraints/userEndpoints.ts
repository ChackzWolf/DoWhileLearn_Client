export const userEndpoint = {
    register: `${import.meta.env.VITE_API_GATEWAY_BASE_URL}/register`,
    verifyOTP: `${import.meta.env.VITE_API_GATEWAY_BASE_URL}/verifyOTP`,
    resendOTP: `${import.meta.env.VITE_API_GATEWAY_BASE_URL}/resendOTP`,
    loginUser: `${import.meta.env.VITE_API_GATEWAY_BASE_URL}/login`,
    addToCart: `${import.meta.env.VITE_API_GATEWAY_BASE_URL}/addToCart`,
    makePayment: `${import.meta.env.VITE_API_GATEWAY_BASE_URL}/makePayment`,
    paymentSuccess: `${import.meta.env.VITE_API_GATEWAY_BASE_URL}/paymentSuccess`,
    getCartItems: `${import.meta.env.VITE_API_GATEWAY_BASE_URL}/getCartItems`
} 