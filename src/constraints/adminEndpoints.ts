const API_GATEWAY_BASE_URL = 'http://localhost:5000/admin'
export const adminEndpoint = {
    verifyOTP: `${import.meta.env.VITE_API_GATEWAY_BASE_URL_ADMIN}/verifyOTP`,
    resendOTP: `${import.meta.env.VITE_API_GATEWAY_BASE_URL_ADMIN}/resendOTP`,
    login: `${import.meta.env.VITE_API_GATEWAY_BASE_URL_ADMIN}/login`
}