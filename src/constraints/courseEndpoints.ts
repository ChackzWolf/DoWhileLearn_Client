export const courseEndpoint = {
    uploadVideo: `${import.meta.env.VITE_API_GATEWAY_BASE_URL_COURSE}/upload`,
    uploadImage: `${import.meta.env.VITE_API_GATEWAY_BASE_URL_COURSE}/imageUpload`,
    submitCourse: `${import.meta.env.VITE_API_GATEWAY_BASE_URL_COURSE}/submitCourse`,
    editCourse: `${import.meta.env.VITE_API_GATEWAY_BASE_URL_COURSE}/editCourse`,
    fetchCourseData: `${import.meta.env.VITE_API_GATEWAY_BASE_URL_COURSE}/fetchCourse`,
    fetchCourseDetails: `${import.meta.env.VITE_API_GATEWAY_BASE_URL_COURSE}/fetchCourseDetails`,
}