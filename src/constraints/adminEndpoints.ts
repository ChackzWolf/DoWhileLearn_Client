export const adminEndpoint = {
    verifyOTP: `${import.meta.env.VITE_API_GATEWAY_BASE_URL_ADMIN}/verifyOTP`,
    resendOTP: `${import.meta.env.VITE_API_GATEWAY_BASE_URL_ADMIN}/resendOTP`,
    login: `${import.meta.env.VITE_API_GATEWAY_BASE_URL_ADMIN}/login`,
    fetchStudentData: `${import.meta.env.VITE_API_GATEWAY_BASE_URL_ADMIN}/fetchStudentData`,
    toggleBlockStudent: `${import.meta.env.VITE_API_GATEWAY_BASE_URL_ADMIN}/toggleBlockStudent`,
    toggleBlockTutor: `${import.meta.env.VITE_API_GATEWAY_BASE_URL_ADMIN}/toggleBlockTutor`,
    fetchTutorData: `${import.meta.env.VITE_API_GATEWAY_BASE_URL_ADMIN}/fetchTutorData`,
    sendOtpToEmail:`${import.meta.env.VITE_API_GATEWAY_BASE_URL_ADMIN}/sendOtpToEmail`,
    resendOtpToEmail: `${import.meta.env.VITE_API_GATEWAY_BASE_URL_ADMIN}/resendOtpToEmail`,
    resetPasswordOTP: `${import.meta.env.VITE_API_GATEWAY_BASE_URL_ADMIN}/resetPasswordOTP`,
    updatePassword: `${import.meta.env.VITE_API_GATEWAY_BASE_URL_ADMIN}/updatePassword`,
}