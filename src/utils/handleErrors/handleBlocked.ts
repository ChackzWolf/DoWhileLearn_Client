import { AxiosError } from "axios";
import { ROUTES } from "../../routes/Routes";


export const handleBlockedUser = (error: unknown) => {
    const axiosError = error as AxiosError;

    if (axiosError.response) {
    
        if (axiosError.response.status === 403) {
            // Redirect to the login page if blocked
            window.location.href = `http://localhost:5173${ROUTES.user.signin}?message=blocked`;
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
            window.location.href = `http://localhost:5173${ROUTES.tutor.signin}?message=blocked`;
            return true; // Indicate that redirection occurred
        }
    }
    return false; // No redirection
};