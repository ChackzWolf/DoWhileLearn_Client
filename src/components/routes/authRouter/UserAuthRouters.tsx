import { Routes, Route } from 'react-router-dom';
import PublicRoute from './publicRoute';
import RegisterUser from '../../user/auth/register';
import LoginUser from '../../user/auth/Login';
import { getCookie } from '../../../utils/cookieManager';
import VerifyEmail from '../../common/EmailVerification';
import ResetPassword from '../../common/ResetPassword';
import ResetPasswordOTP from '../../common/ResetPasswordOTP';
import OtpVarification from '../../user/auth/OtpVarification';

const UserAuthRoutes = () => {
  const isAuthenticated = !!getCookie('userId'); // Replace with your logic
console.log(isAuthenticated, ' is authenticated')
  return (
    <Routes>
    <Route
      path="login"
      element={
        <PublicRoute isAuthenticated={isAuthenticated} redirectPath="/">
          <LoginUser />
        </PublicRoute>
      }
    />
    <Route
      path="register"
      element={
        <PublicRoute isAuthenticated={isAuthenticated} redirectPath="/">
          <RegisterUser />
        </PublicRoute>
      }
    />
    <Route 
      path='/register/otp' 
      element = {
        <PublicRoute isAuthenticated={isAuthenticated} redirectPath="/">
          <OtpVarification/>
        </PublicRoute>
      }
    />
    <Route
      path = "forgot-password"
      element={
        <PublicRoute isAuthenticated={isAuthenticated} redirectPath="/">
          <VerifyEmail role="USER" />
        </PublicRoute>
      }
    />
    <Route
      path = "forgot-password/reset"
      element={
        <PublicRoute isAuthenticated={isAuthenticated} redirectPath="/">
          <ResetPassword role="USER" />
        </PublicRoute>
      }
    />

    <Route
      path="forgot-password/otp"
      element={
        <PublicRoute isAuthenticated={isAuthenticated} redirectPath="/">
          <ResetPasswordOTP role='USER'/>
        </PublicRoute>
      }
    />

  </Routes>
  );
};

export default UserAuthRoutes;
