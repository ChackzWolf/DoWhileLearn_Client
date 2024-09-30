import { Navigate } from 'react-router-dom';
import { getCookie } from '../cookieManager';  // Your cookie utility
import { getRoleFromToken } from '../jwtUtils';



export const UserPrivateRoute = ({ children, roles }: { children: JSX.Element; roles: string[] }) => {
    const token = getCookie('accessToken');  // Fetch the JWT from cookies
    
    if (!token) {
      console.log('no access token')
      // No token found, redirect to login
      // return <Navigate to="/login/user" />;
    }
  
    try {
      // Decode the token to extract the role and expiry information
      const userRole = getRoleFromToken()
      console.log('userRole', userRole)
  
      // Check if the token is expired
      // const currentTime = Date.now() / 1000;  // Convert to seconds
      // if (decodedToken.exp < currentTime) {
      //   // Token has expired, redirect to login
      //   return <Navigate to="/login" />;
      // }
  
      // Check if the user's role is allowed to access the route
      if (!roles.includes(userRole)) {
        console.log('role deosnt includes.')
        // User's role is not authorized, redirect to an unauthorized page
        return <Navigate to="/unauthorized" />;
      }
  
      // If everything is valid, allow access to the route
      return children;
    } catch (error) {
      console.error('Error decoding token or token is invalid', error);
      console.log('error occured')
      // return <Navigate to="login/user" />;  // Invalid token, redirect to login
    }
  };








