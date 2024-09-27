import { Navigate } from 'react-router-dom';
import { getCookie } from '../cookieManager';  // Your cookie utility
import { getRoleFromToken } from '../jwtUtils';



export const UserPrivateRoute = ({ children, roles }: { children: JSX.Element; roles: string[] }) => {
    const token = getCookie('accessToken');  // Fetch the JWT from cookies
    
    if (!token) {
      // No token found, redirect to login
      return <Navigate to="/login/user" />;
    }
  
    try {
      // Decode the token to extract the role and expiry information
      const userRole = getRoleFromToken()
  
      // Check if the token is expired
      // const currentTime = Date.now() / 1000;  // Convert to seconds
      // if (decodedToken.exp < currentTime) {
      //   // Token has expired, redirect to login
      //   return <Navigate to="/login" />;
      // }
  
      // Check if the user's role is allowed to access the route
      if (!roles.includes(userRole)) {
        // User's role is not authorized, redirect to an unauthorized page
        return <Navigate to="/unauthorized" />;
      }
  
      // If everything is valid, allow access to the route
      return children;
    } catch (error) {
      console.error('Error decoding token or token is invalid', error);
      return <Navigate to="user/login" />;  // Invalid token, redirect to login
    }
  };


  export const TutorPrivateRoute = ({ children, roles }: { children: JSX.Element; roles: string[] }) => {
    const token = getCookie('accessToken');  // Fetch the JWT from cookies
    console.log(token, 'triggered')
    if (!token) {
        console.log('no token')
      // No token found, redirect to login
      return <Navigate to="/login/tutor" />;
    }
  
    try {
      // Decode the token to extract the role and expiry information
      const userRole = getRoleFromToken()
      console.log('ROle: ' , userRole)
      // Check if the token is expired
      // const currentTime = Date.now() / 1000;  // Convert to seconds
      // if (decodedToken.exp < currentTime) {
      //   // Token has expired, redirect to login
      //   return <Navigate to="/login" />;
      // }
  
      // Check if the user's role is allowed to access the route
      if (!roles.includes(userRole)) {
        console.log('roles doesnt match (unautherized)',)
        // User's role is not authorized, redirect to an unauthorized page
        return <Navigate to="/unauthorized" />;
      }
  
      // If everything is valid, allow access to the route
      return children;
    } catch (error) {
      console.error('Error decoding token or token is invalid', error);
      return <Navigate to="tutor/login" />;  // Invalid token, redirect to login
    }
  };

