import axios from 'axios';
import { getCookie, setCookie, removeCookie } from '../cookieManager';
import { isTokenExpired } from '../jwtUtils';
// import store from '../../redux/store/store';
// import { setTutorLogout } from '../../redux/authSlice/authSlice';

const tutorAxios = axios.create({
    baseURL: import.meta.env.VITE_API_GATEWAY_BASE_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json"
    },
    withCredentials:true,
});

tutorAxios.interceptors.request.use(  /////to add JWT token from cookie
    (config) => {
        const token = getCookie('tutorAccessToken');
        console.log(token, 'token')
        if (token) {
            
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);


tutorAxios.interceptors.request.use(
    async (config) => {
        let token = getCookie('tutorAccessToken');
        console.log(token, 'accessToken in request');

        if (!token || isTokenExpired(token)) {
            // If access token is null, attempt to refresh token
            try {
                console.log('trig refresh token')
                const response = await axios.post(`${import.meta.env.VITE_API_GATEWAY_BASE_URL_AUTH}/tutor-refresh-token`, {}, { withCredentials: true });
                const newToken = response.data.accessToken;
                const refreshToken = response.data.refreshToken;

                console.log(newToken, 'new token is here ')
                
                // Set new access token in cookies
                setCookie('tutorAccessToken', newToken, 0.01);
                setCookie('tutorRefreshToken', refreshToken, 10);
                // Set token to the new one
                token = newToken;
            } catch (refreshError) {
                console.error('Token refresh failed:', refreshError);
                removeCookie('tutorAccessToken');
                removeCookie('tutorRefreshToken');
                removeCookie('tutorId');
                console.log(2)
                // store.dispatch(setTutorLogout())
                // Optionally, redirect to login
                window.location.href = '';
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


tutorAxios.interceptors.response.use(
    response => response,
    async error => {


        // Handle 403 Forbidden (user blocked)
        if (error.response.status === 403) {
            console.log('tutor is blocked. Redirecting to login or blocked page.');
            removeCookie('tutorAccessToken');
            removeCookie('tutorRefreshToken');
            removeCookie('tutorId');
            console.log(1)
            // Redirect to login or blocked user page
            window.location.href = '?message=blocked'; // Change this to your actual login or blocked route

            return Promise.reject(error);
        }

        return Promise.reject(error);
    }
);

export default tutorAxios;


