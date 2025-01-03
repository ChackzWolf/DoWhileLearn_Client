import { Route, Routes } from 'react-router-dom'
import PublicRoute from './publicRoute'
import { getCookie } from '../../../utils/cookieManager';
import AdminLoginPage from '../../../pages/admin/auth/AdminLoginPage';
import VerifyEmail from '../../common/EmailVerification';
import ResetPasswordOTP from '../../common/ResetPasswordOTP';
import ResetPassword from '../../common/ResetPassword';

function AdminAuthRoutes() {
    const isAuthenticated = !!getCookie('adminId'); // Replace with your logic

  return (
    <Routes>
        <Route 
            path= 'login' 
            element={
                <PublicRoute isAuthenticated={isAuthenticated} redirectPath='/admin'>
                    <AdminLoginPage/>
                </PublicRoute>
            }
        />

        <Route 
            path= 'forgot-password'
            element={
                <PublicRoute isAuthenticated={isAuthenticated} redirectPath='/admin'>
                    <VerifyEmail role={"ADMIN"}/>
                </PublicRoute>
            }/>

        <Route 
            path= 'forgot-password/otp'
            element={
                <PublicRoute isAuthenticated={isAuthenticated} redirectPath='/admin'>
                    <ResetPasswordOTP role='ADMIN'/>
                </PublicRoute>
            }
        />
        <Route 
            path= 'forgot-password/otp/reset-password'
            element={
                <PublicRoute isAuthenticated={isAuthenticated} redirectPath='/admin'>
                    <ResetPassword role='ADMIN'/>
                </PublicRoute>
            }
        />
    </Routes>

  )
}

export default AdminAuthRoutes