import axios from 'axios';
import { getCookie, setCookie, removeCookie } from './cookieManager';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_GATEWAY_BASE_URL,
    timeout: 10000,
});

apiClient.interceptors.request.use(  /////to add JWT token from cookie
    (config) => {
        const token = getCookie('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(// Response interceptor to handle token refreshes and errorrerer
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            try {    // Trying to refresh the token
               
                const response = await axios.post(`${import.meta.env.VITE_API_GATEWAY_BASE_URL}/refresh-token`, {}, { withCredentials: true });
                const newToken = response.data.accessToken;

                // Set new access token
                setCookie('token', newToken, 0.01);
                // Retry the original request with the new token
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return axios.request(originalRequest);
            } catch (refreshError) {
                // failure
                console.error('Token refresh failed:', refreshError);
                removeCookie('token');
                removeCookie('refreshToken');
               // window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;
