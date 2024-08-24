import axios from "axios";
import { getCookie, removeCookie } from "./cookieManager";

const apiClient = axios.create({
    baseURL: process.env.API_GATEWAY_BASE_URL, // Replace with your API URL
    timeout: 10000, // Set a timeout
});

apiClient.interceptors.request.use(// Request interceptor to add JWT token from cookie
    (config)=>{
        const token = getCookie();
        if(token){
            config.headers.Authorization = `Bearer ${token}`;

        }
        return config;
    },
    (error)=> {
        Promise.reject(error)
    }
)

apiClient.interceptors.response.use(
    (response) =>{
        return response;
    },
    (error)=>{
        // If token expired or unauthorized, remove the cookie and redirect to login
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            removeCookie();
            window.location.href = '/login'; // Redirect to login page
        }
        return Promise.reject(error);
    }
)

// apiClient.get('/protected-route')
//             .then(response => {
//                 setData(response.data);
//             })                                             I have seeen this in  useEffect() Who knows why
//             .catch(error => {
//                 console.error('Error fetching data:', error);
//             });
//     }, []);