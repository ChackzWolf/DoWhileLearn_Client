

export const tutorEndpoint = {
    register: `${import.meta.env.VITE_GATEWAY_BASE_URL_TUTOR}/register`,
    verifyOTP: `${import.meta.env.VITE_GATEWAY_BASE_URL_TUTOR}/verifyOTP`,
    resendOTP: `${import.meta.env.VITE_GATEWAY_BASE_URL_TUTOR}/resendOTP`,
    loginTutor: `${import.meta.env.VITE_GATEWAY_BASE_URL_TUTOR}/login`,
    fetchTutorCourse: `${import.meta.env.VITE_GATEWAY_BASE_URL_TUTOR}/fetchTutroCourse`,
    sendOtpToEmail:`${import.meta.env.VITE_GATEWAY_BASE_URL_TUTOR}/sendOtpToEmail`,
    resetPasswordOTP: `${import.meta.env.VITE_GATEWAY_BASE_URL_TUTOR}/resetPasswordOTP`,
    updatePassword: `${import.meta.env.VITE_GATEWAY_BASE_URL_TUTOR}/updatePassword`,
    uploadImage: `${import.meta.env.VITE_GATEWAY_BASE_URL_TUTOR}/uploadImage`,
    uploadPDF: `${import.meta.env.VITE_GATEWAY_BASE_URL_TUTOR}/uploadPDF`,
    registerDetails: `${import.meta.env.VITE_GATEWAY_BASE_URL_TUTOR}/registerDetails`,
} 