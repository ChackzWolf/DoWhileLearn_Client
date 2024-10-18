export const authEndpoint = {
    clearUserCookies: `${import.meta.env.VITE_API_GATEWAY_BASE_URL_AUTH}/clearUserCookies`,
    uploadImage: `${import.meta.env.VITE_API_GATEWAY_BASE_URL_AUTH}/clearTutroCookes`,
    sendOtpToEmail:`${import.meta.env.VITE_API_GATEWAY_BASE_URL_AUTH}/sendOtpToEmail`,
    resetPasswordOTP: `${import.meta.env.VITE_API_GATEWAY_BASE_URL_AUTH}/resetPasswordOTP`,
    updatePassword: `${import.meta.env.VITE_API_GATEWAY_BASE_URL_AUTH}/updatePassword`,
}