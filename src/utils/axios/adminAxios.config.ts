import axios from 'axios';
import { getCookie, setCookie, removeCookie } from '../cookieManager';
import { decodeJwt, isTokenExpired } from '../jwtUtils';
import { store } from 'emoji-mart';
import { setTutorLogout } from '../../redux/authSlice/authSlice';
// import store from '../../redux/store/store';
// import { setTutorLogout } from '../../redux/authSlice/authSlice';

const adminAxios = axios.create({
    baseURL: import.meta.env.VITE_API_GATEWAY_BASE_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json"
    },
    withCredentials:true,
});

// adminAxios.interceptors.request.use(  /////to add JWT token from cookie
//     (config) => {
//         const token = getCookie('adminAccessToken');
//         console.log(token, 'token')
//         if (token) {
            
//             config.headers.Authorization = `Bearer ${token}`;
//         }
//         return config;
//     },
//     (error) => Promise.reject(error)
// );




adminAxios.interceptors.request.use(
    async (config) => {
        let token = getCookie('adminAccessToken');
        console.log(token, 'accessToken in request');

        if (!token || isTokenExpired(token)) {
            // If access token is null, attempt to refresh token
            try {
                console.log('trig refresh token')
                const response = await axios.post(`${import.meta.env.VITE_API_GATEWAY_BASE_URL_AUTH}/admin-refresh-token`, {}, { withCredentials: true });
                const newToken = response.data.accessToken;
                const refreshToken = response.data.refreshToken;

                console.log(newToken, 'new token is here ')
                
                // Set new access token in cookies
                setCookie('adminAccessToken', newToken, 0.01);
                setCookie('adminRefreshToken', refreshToken, 10);
                // Set token to the new one
                token = newToken;
            } catch (refreshError) {
                console.error('Token refresh failed:', refreshError);
                removeCookie('adminAccessToken');
                removeCookie('adminRefreshToken');
                removeCookie('adminId');
                store.dispatch(setTutorLogout())
                window.location.href = '/login/admin';
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


adminAxios.interceptors.response.use(
    (response) => response, // Simply return the response if it's successful
    async (error) => {
        if (error.response && error.response.status === 401 && error.response.data.message === 'jwt expired') {
            // Handle expired token
            console.log('Token expired, attempting refresh...');
            try {
                // Try refreshing the token here
                const refreshResponse = await axios.post(
                    `${import.meta.env.VITE_API_GATEWAY_BASE_URL_AUTH}/admin-refresh-token`,
                    {},
                    { withCredentials: true }
                );
                const newAccessToken = refreshResponse.data.accessToken;
                const newRefreshToken = refreshResponse.data.refreshToken;

                // Update the cookies with new tokens
                setCookie('adminAccessToken', newAccessToken, 0.01);
                setCookie('adminRefreshToken', newRefreshToken, 10);

                // Retry the original request with new token
                error.config.headers['Authorization'] = `Bearer ${newAccessToken}`;
                return adminAxios(error.config);
            } catch (refreshError) {
                console.error('Token refresh failed:', refreshError);
                removeCookie('adminAccessToken');
                removeCookie('adminRefreshToken');
                removeCookie('adminId');
                window.location.href = '/login/admin';  // Redirect to login if refresh fails
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default adminAxios;


