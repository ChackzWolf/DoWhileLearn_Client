import axios from 'axios';
import { getCookie, setCookie, removeCookie } from '../cookieManager';
import { isTokenExpired } from '../jwtUtils';
import { setTutorLogout } from '../../redux/authSlice/authSlice';
import store from '../../redux/store/store';

const adminAxios = axios.create({
    baseURL: import.meta.env.VITE_API_GATEWAY_BASE_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json"
    },
    withCredentials:true,
});


adminAxios.interceptors.request.use(
    async (config) => {
        let accessToken = getCookie('adminAccessToken');
        let refreshToken = getCookie('adminRefreshToken');

        if (!accessToken || isTokenExpired(accessToken)) {
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
                accessToken = newToken;
            } catch (refreshError) {
                console.error('Token refresh failed:', refreshError);
                removeCookie('adminAccessToken');
                removeCookie('adminRefreshToken');
                removeCookie('adminId');
                store.dispatch(setTutorLogout())
                window.location.href = '/admin/auth/login';
                return Promise.reject(refreshError);
            }
        }


        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`; // Send access token
        }
        if (refreshToken) {
            config.headers['X-Refresh-Token'] = refreshToken;
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
                window.location.href = '/admin/auth/login';  // Redirect to login if refresh fails
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default adminAxios;


