const API_GATEWAY_BASE_URL = 'http://localhost:5000'
    
export const userEndpoint = {
    register: `${API_GATEWAY_BASE_URL}/register`,
    verifyOTP: `${API_GATEWAY_BASE_URL}/verifyOTP`,
    resendOTP: `${API_GATEWAY_BASE_URL}/resendOTP`
}