import axios from 'axios';
import { getCookie, setCookie, removeCookie } from './cookieManager';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_GATEWAY_BASE_URL,
    timeout: 10000,
});

// Request interceptor to add JWT token from cookie
apiClient.interceptors.request.use(
    (config) => {
        const token = getCookie('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh and errors
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            // Try to refresh the token
            try {
                const response = await axios.post(`${import.meta.env.VITE_API_GATEWAY_BASE_URL}/refresh-token`, {}, { withCredentials: true });
                const newToken = response.data.accessToken;

                // Set new access token
                setCookie('token', newToken, 0.01);
                // Retry the original request with the new token
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return axios.request(originalRequest);
            } catch (refreshError) {
                // Handle refresh token failure
                console.error('Token refresh failed:', refreshError);
                removeCookie('token');
                removeCookie('refreshToken');
                window.location.href = '/login'; // Redirect to login page
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;
