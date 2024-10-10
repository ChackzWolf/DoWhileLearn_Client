import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { getCookie, removeCookie, setCookie } from '../cookieManager';  // Your cookie utility
import { getRoleFromToken } from '../jwtUtils';
import axios from 'axios';

export const TutorPrivateRoute = ({ children, roles }: { children: JSX.Element; roles: string[] }) => {
  const [loading, setLoading] = useState(true); // To show a loading state while fetching the token
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuthentication = async () => {
      let token = getCookie('tutorAccessToken'); // Fetch the JWT from cookies
      if (!token) {
        // If access token is null, attempt to refresh token
        try {
          const response = await axios.post(`${import.meta.env.VITE_API_GATEWAY_BASE_URL_AUTH}/tutor-refresh-token`, {}, { withCredentials: true });
          const newToken = response.data.accessToken;
          const refreshToken = response.data.refreshToken;
          console.log(response.data, 'response form refreshing')
          // Set new access token in cookies
          setCookie('tutorAccessToken', newToken, 0.01);
          setCookie('tutorRefreshToken', refreshToken, 10);
          token = newToken; // Set token to the new one
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          removeCookie('tutorAccessToken');
          removeCookie('tutorRefreshToken');
          removeCookie('tutorId');
          window.location.href = '/login/tutor';
          return;
        }
      }

      try {
        const userRole = getRoleFromToken(token);
        if (roles.includes(userRole)) {
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
