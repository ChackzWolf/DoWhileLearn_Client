import { AxiosError } from "axios";


export const handleBlockedUser = (error: unknown) => {
    const axiosError = error as AxiosError;

    if (axiosError.response) {
    
        if (axiosError.response.status === 403) {
            // Redirect to the login page if blocked
            window.location.href = 'http://localhost:5173/login/user?message=blocked';
            return true; // Indicate that redirection occurred
        }
    }
    return false; // No redirection
};

export const handleBlockedTutor = (error: unknown) => {
    const axiosError = error as AxiosError;

    if (axiosError.response) {
        console.log('trig tutor blocked')
        if (axiosError.response.status === 403) {
            // Redirect to the login page if blocked
            window.location.href = 'http://localhost:5173/login/tutor?message=blocked';
            return true; // Indicate that redirection occurred
        }
    }
    return false; // No redirection
};