import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { getCookie } from '../cookieManager';  // Your cookie utility
import { getRoleFromToken } from '../jwtUtils';
import Loader from '../../components/common/icons/loader';

export const AdminAuthRoute = ({ children, roles }: { children: JSX.Element; roles: string[] }) => {
  const [loading, setLoading] = useState(true); // To show a loading state while fetching the token
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuthentication = async () => {
      let refreshToken = getCookie('adminRefreshToken'); // Fetch the JWT from cookies
      let accessToken = getCookie('adminAccessToken')
      
      if (!accessToken && !refreshToken) {
        // If access token is null, attempt to refresh token
        try {
            const adminRole = getRoleFromToken(accessToken);
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
      }
    };

    checkAuthentication();
  }, [roles]);

  if (loading) {
    return <Loader/>; // Render a loading spinner or message
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/" />; // Redirect to unauthorized page if role doesn't match
  }

  return children; // Render children if authenticated
};
