import dotenv from 'dotenv';
dotenv.config();


export const userEndpoint = {
    register: `${process.env.API_GATEWAY_BASE_URL}/register`,
    verifyOTP: `${process.env.API_GATEWAY_BASE_URL}/verifyOTP`,
    resendOTP: `${process.env.API_GATEWAY_BASE_URL}/resendOTP`
}