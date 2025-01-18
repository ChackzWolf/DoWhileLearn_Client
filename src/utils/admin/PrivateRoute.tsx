import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { getCookie, removeCookie, setCookie } from '../cookieManager';  // Your cookie utility
import { getRoleFromToken } from '../jwtUtils';
import axios from 'axios';

export const AdminPrivateRoute = ({ children, roles }: { children: JSX.Element; roles: string[] }) => {
  const [loading, setLoading] = useState(true); // To show a loading state while fetching the token
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuthentication = async () => {
      let token = getCookie('adminAccessToken'); // Fetch the JWT from cookies
      if (!token) {
        // If access token is null, attempt to refresh token
        try {
          const response = await axios.post(`${import.meta.env.VITE_API_GATEWAY_BASE_URL_AUTH}/admin-refresh-token`, {}, { withCredentials: true });
          const newToken = response.data.accessToken;
          const refreshToken = response.data.refreshToken;
          console.log(response.data, 'response form refreshing')
          // Set new access token in cookies
          setCookie('adminAccessToken', newToken, 0.01);
          setCookie('adminRefreshToken', refreshToken, 10);
          token = newToken; // Set token to the new one
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          removeCookie('adminAccessToken');
          removeCookie('adminRefreshToken');
          removeCookie('adminId');
          window.location.href = '/admin/auth/login';
          return;
        }
      }

      try {
        const adminRole = getRoleFromToken(token);
        if (roles.includes(adminRole)) {
          setIsAuthenticated(true); // User is authenticated
        } else {
          setIsAuthenticated(false); // User is not authorized
        }
      } catch (error) {
        console.error('Error decoding token or token is invalid', error);
        setIsAuthenticated(false); // Invalid token or error
      } finally {
        setLoading(false); // Done checking
      }
    };

    checkAuthentication();
  }, [roles]);

  if (loading) {
    return <div>Loading...</div>; // Render a loading spinner or message
  }

  if (!isAuthenticated) {
    return <Navigate to="/unauthorized" />; // Redirect to unauthorized page if role doesn't match
  }

  return children; // Render children if authenticated
};
