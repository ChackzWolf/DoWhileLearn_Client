import axios from 'axios';
import { getCookie, setCookie, removeCookie } from '../cookieManager';
import store from '../../redux/store/store';
import { setUserLogout } from '../../redux/authSlice/authSlice';
import { ROUTES } from '../../routes/Routes';
import { isTokenExpired } from '../jwtUtils';

const userAxios = axios.create({
    baseURL: import.meta.env.VITE_API_GATEWAY_BASE_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json"
            },
    withCredentials:true,
});

userAxios.interceptors.request.use(  /////to add JWT token from cookie
    (config) => {
        const token = getCookie('userAccessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);




userAxios.interceptors.request.use(
    async (config) => {
        let accessToken = getCookie('userAccessToken');
        let userId = getCookie('userId');
        if (!accessToken || isTokenExpired(accessToken)) {
            // If access token is null, attempt to refresh token
            try {
                const userRefreshToken = getCookie('userRefreshToken');

                console.log(userRefreshToken,' this is user referxhtoken')
                const response = await axios.post(`${import.meta.env.VITE_API_GATEWAY_BASE_URL_AUTH}/user-refresh-token`, {userRefreshToken}, { withCredentials: true });
                const newToken = response.data.accessToken;
                const refreshToken = response.data.refreshToken;

                console.log(newToken, 'new token is here ')
                
                // Set new access token in cookies
                setCookie('userAccessToken', newToken, 0.01);
                setCookie('userRefreshToken', refreshToken, 10);
                // Set token to the new one
                accessToken = newToken;
            } catch (refreshError) {
                console.error('Token refresh failed:', refreshError);
                removeCookie('userAccessToken');
                removeCookie('userRefreshToken');
                removeCookie('userId');
                store.dispatch(setUserLogout())
                window.location.href = ROUTES.user.signin
                return Promise.reject(refreshError);
            }
        }


        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`; // Send access token
        }
        if (userId) {
            config.headers['X-User-Id'] = userId; // Send tutorId separately
        }

        return config;
    },
    (error) => Promise.reject(error)
);

export default userAxios;


userAxios.interceptors.response.use(
    response => response,
    async error => {
        // Handle 403 Forbidden (user blocked)
        if (error.response.status === 403) {
            console.log('User is blocked. Redirecting to login or blocked page.');
            removeCookie('userAccessToken');
            removeCookie('userRefreshToken');
            removeCookie('userId');
            store.dispatch(setUserLogout())
            // Redirect to login or blocked user page
            window.location.href = `${ROUTES.user.signin}?message=blocked`; // Change this to your actual login or blocked route

            return Promise.reject(error);
        }

        return Promise.reject(error);
    }
);