export const userEndpoint = {
    register: `${import.meta.env.VITE_API_GATEWAY_BASE_URL}/register`,
    verifyOTP: `${import.meta.env.VITE_API_GATEWAY_BASE_URL}/verifyOTP`,
    resendOTP: `${import.meta.env.VITE_API_GATEWAY_BASE_URL}/resendOTP`,
    loginUser: `${import.meta.env.VITE_API_GATEWAY_BASE_URL}/login`,
    
} 