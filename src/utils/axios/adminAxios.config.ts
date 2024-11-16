import axios from 'axios';
import { getCookie, setCookie, removeCookie } from '../cookieManager';
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

adminAxios.interceptors.request.use(  /////to add JWT token from cookie
    (config) => {
        const token = getCookie('adminAccessToken');
        console.log(token, 'token')
        if (token) {
            
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);


adminAxios.interceptors.request.use(
    async (config) => {
        let token = getCookie('adminAccessToken');
        console.log(token, 'accessToken in request');

        if (!token) {
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
                // store.dispatch(setTutorLogout())
                // Optionally, redirect to login
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

export default adminAxios;


