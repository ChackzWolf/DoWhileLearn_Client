import axios from 'axios';
import { getCookie, setCookie, removeCookie } from '../cookieManager';
import store from '../../redux/store/store';
import { setTutorLogout } from '../../redux/authSlice/authSlice';

const userAxios = axios.create({
    baseURL: import.meta.env.VITE_API_GATEWAY_BASE_URL,
    timeout: 10000,
});

userAxios.interceptors.request.use(  /////to add JWT token from cookie
    (config) => {
        const token = getCookie('userAccessToken');
        console.log(token, 'token')
        if (token) {
            
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);


userAxios.interceptors.request.use(
    async (config) => {
        let token = getCookie('userAccessToken');
        console.log(token, 'accessToken in request');

        if (!token) {
            // If access token is null, attempt to refresh token
            try {
                console.log('trig refresh token')
                const response = await axios.post(`${import.meta.env.VITE_API_GATEWAY_BASE_URL_AUTH}/user-refresh-token`, {}, { withCredentials: true });
                const newToken = response.data.accessToken;
                const refreshToken = response.data.refreshToken;

                console.log(newToken, 'new token is here ')
                
                // Set new access token in cookies
                setCookie('userAccessToken', newToken, 0.01);
                setCookie('userRefreshToken', refreshToken, 10);
                // Set token to the new one
                token = newToken;
            } catch (refreshError) {
                console.error('Token refresh failed:', refreshError);
                removeCookie('userAccessToken');
                removeCookie('userRefreshToken');
                removeCookie('userId');
                store.dispatch(setTutorLogout())
                // Optionally, redirect to login
                window.location.href = '/login/user';
                return Promise.reject(refreshError);
            }
        }

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

export default userAxios;





// apiClient.interceptors.response.use(// Response interceptor to handle token refreshes and errorrerer
//     (response) => response,
//     async (error) => {
//         console.log('error it was')
//         const originalRequest = error.config;

//         if (error.response && (error.response.status === 401 || error.response.status === 403)) {
//             try {    // Trying to refresh the token
               
//                 const response = await axios.post(`${import.meta.env.VITE_API_GATEWAY_BASE_URL_AUTH}/refresh-token`, {}, { withCredentials: true });
//                 const newToken = response.data.accessToken;

//                 // Set new access token
//                 setCookie('accessToken', newToken, 0.01);
//                 // Retry the original request with the new token
//                 originalRequest.headers.Authorization = `Bearer ${newToken}`;
//                 return axios.request(originalRequest);
//             } catch (refreshError) {
//                 // failure
//                 console.error('Token refresh failed:', refreshError);
//                 removeCookie('accessToken');
//                 removeCookie('refreshToken');
//                // window.location.href = '/login';
//             }
//         }
//         return Promise.reject(error);
//     }
// );

