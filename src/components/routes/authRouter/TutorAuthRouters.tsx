import { Route, Routes } from "react-router-dom";
import { getCookie } from "../../../utils/cookieManager";
import PublicRoute from "./publicRoute";
// import LoginModal from "../../tutor/auth/Login";
// import RegisterUser from "../../tutor/auth/register";
import VerifyEmail from "../../common/EmailVerification";
import ResetPassword from "../../common/ResetPassword";
import ResetPasswordOTP from "../../common/ResetPasswordOTP";
import OtpVarification from "../../tutor/auth/OtpVarification";
import LoginUser from "../../user/auth/Login";
import RegisterUser from "../../user/auth/register";


const TutorAuthRoutes = () => {
  const isAuthenticated = !!getCookie('tutorId'); // Replace with your logic
  console.log(isAuthenticated, ' is authenticated')
  return (
    <Routes>
    <Route
      path="login"
      element={
        <PublicRoute isAuthenticated={isAuthenticated} redirectPath="/tutor">
          <LoginUser />
        </PublicRoute>
      }
    />
    <Route
      path="register"
      element={
        <PublicRoute isAuthenticated={isAuthenticated} redirectPath="/tutor">
          <RegisterUser />
        </PublicRoute>
      }
    />

    <Route path = '/register/otp' 
      element={
        <PublicRoute isAuthenticated={isAuthenticated} redirectPath="/tutor">
          <OtpVarification/>
        </PublicRoute>
      }/>
    <Route
      path="forgot-password"
      element={
        <PublicRoute isAuthenticated={isAuthenticated} redirectPath="/tutor">
          <VerifyEmail role="TUTOR" />
        </PublicRoute>
      }
    />
    <Route
      path="forgot-password/reset"
      element={
        <PublicRoute isAuthenticated={isAuthenticated} redirectPath="/tutor">
          <ResetPassword role="TUTOR" />
        </PublicRoute>
      }
    />
    <Route
      path="forgot-password/otp"
      element={
        <PublicRoute isAuthenticated={isAuthenticated} redirectPath="/tutor">
          <ResetPasswordOTP role='TUTOR'/>
        </PublicRoute>
      }
    />
  </Routes>
  );
};

export default TutorAuthRoutes;
