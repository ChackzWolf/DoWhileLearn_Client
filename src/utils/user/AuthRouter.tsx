import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { getCookie } from '../cookieManager';
import { Loader } from 'lucide-react';

export const UserAuthRoute = ({ children }: { children: JSX.Element;  }) => {
  const [loading, setLoading] = useState(true); // To show a loading state while fetching the token
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuthentication = async () => {
      let refreshToken = getCookie('userRefreshToken'); // Fetch the JWT from cookies
      let accessToken = getCookie('userAccessToken')
      
        try {
            if (!accessToken && !refreshToken) {
              console.log( 'no access or refresh token for user')
              setIsAuthenticated(true); // User is authenticated
            } else {
              console.log('there is access token and user token')
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
  },[]);

  if (loading) {
    return <Loader/>; // Render a loading spinner or message
  }

  if (!isAuthenticated) {
    return <Navigate to="/user" />; // Redirect to unauthorized page if role doesn't match
  }

  return children; // Render children if authenticated
};
