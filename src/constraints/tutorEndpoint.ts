

export const tutorEndpoint = {
    register: `${import.meta.env.VITE_GATEWAY_BASE_URL_TUTOR}/register`,
    verifyOTP: `${import.meta.env.VITE_GATEWAY_BASE_URL_TUTOR}/verifyOTP`,
    resendOTP: `${import.meta.env.VITE_GATEWAY_BASE_URL_TUTOR}/resendOTP`,
    loginTutor: `${import.meta.env.VITE_GATEWAY_BASE_URL_TUTOR}/login`,
    fetchTutorCourse: `${import.meta.env.VITE_GATEWAY_BASE_URL_TUTOR}/fetchTutroCourse`
} 