import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import UserRoutes from '../src/components/routes/userRouter/UserRouters';
import TutorRoutes from './components/routes/tutorRouter/tutorRouters';
import AdminRoutes from './components/routes/adminRouter/AdminRouters';
import {UserPrivateRoute} from './utils/user/PrivateRouter';
import {TutorPrivateRoute} from './utils/tutor/PrivateRouter';
import { AdminPrivateRoute } from './utils/admin/PrivateRoute';
import {AdminAuthRoute} from './utils/admin/AuthRoute'
import { TutorAuthRoute } from './utils/tutor/AuthRouter';
import { UserAuthRoute } from './utils/user/AuthRouter';
import LoginUser from './components/user/auth/Login';
import RegisterUser from './components/user/auth/register';
import LoginTutor from './components/tutor/auth/Login';
import RegisterTutor from './components/tutor/auth/register';
import AuthChoice from './components/common/AuthChoice';
import UserHome from './components/user/UserHome';
import AdminLoginPage from './pages/admin/auth/AdminLoginPage';
import CourseDetailsPage from './pages/user/Courses/CourseDetailsPage';
import CoursesListPage from './pages/user/Courses/CoursesListPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserAuthRoutes from './components/routes/userRouter/AuthRouters';
import ResetPasswordOTP from './components/common/ResetPasswordOTP';
import ResetPassword from './components/common/ResetPassword';
import VerifyEmail from './components/common/EmailVerification';
import RegistrationPage from './pages/tutor/Registration/RegistrationFirstPage';
import OTPInput from './components/tutor/Supporters/otpInput';
import OtpVarification from './components/tutor/auth/OtpVarification';


function App() {

  return (
    <>
      <div className='App'>
        <Router>
          <Routes>
          {/* // page for common */}
          <Route path='/' element= {<UserHome/>}/>
          <Route path='/AuthChoice' element= {<AuthChoice/>}/>
          <Route path ='/courses' element = {<CoursesListPage/>}/>
          <Route path="/course/:id" element={<CourseDetailsPage/>} />
          

          {/* User auth */}
          <Route path = '/login/user' element = {<LoginUser/>}/>
          <Route path = '/register/user' element ={<RegisterUser/>}/>
          <Route path = '/login/user/forgot-password' element= {<VerifyEmail role='USER'/>}/>
          <Route path = '/login/user/forgot-password/otp' element={<ResetPasswordOTP role='USER'/>}/>
          <Route path = '/login/user/forgot-password/otp/reset-password' element={<ResetPassword role='USER'/>}/>
          {/* <UserAuthRoute>
              <UserAuthRoutes/>
          </UserAuthRoute> */}


           {/* Tutor Auth */}
          <Route path='/login/tutor' element = {<LoginTutor/>}/>
          <Route path='/register/tutor' element ={<RegisterTutor/>}/>
          <Route path = '/register/tutor/otp' element={<OtpVarification/>}/>
          <Route path = '/login/tutor/forgot-password' element= {<VerifyEmail role='TUTOR'/>}/>
          <Route path = '/login/tutor/forgot-password/otp' element={<ResetPasswordOTP role='TUTOR'/>}/>
          <Route path = '/login/tutor/forgot-password/otp/reset-password' element={<ResetPassword role='TUTOR'/>}/>
          <Route path = '/register/tutor/completion/step-one' element={<RegistrationPage/>}/>

          

          {/* Admin Auth */}
          <Route path = '/login/admin' element= {<AdminLoginPage/>}/>
          <Route path = '/login/admin/forgot-password' element= {<VerifyEmail role='ADMIN'/>}/>
          <Route path = '/login/admin/forgot-password/otp' element={<ResetPasswordOTP role='ADMIN'/>}/>
          <Route path = '/login/admin/forgot-password/otp/reset-password' element={<ResetPassword role='ADMIN'/>}/>
          
          {/* // <Route path="/unauthorized" element={<UnauthorizedPage />} /> */}

          {/* Tutor-only route */}
          <Route
            path="/tutor/*"
            element={
              <TutorPrivateRoute roles={['TUTOR']}>
                <TutorRoutes />
              </TutorPrivateRoute>
            }
          /> 

          <Route 
            path="/user/*"
            element={
              <UserPrivateRoute roles={['USER']}>
                <UserRoutes />
              </UserPrivateRoute>
            }
          />

          <Route
            path="/admin/*" 
            element={
              <AdminPrivateRoute roles={['ADMIN']}>
                <AdminRoutes/>
              </AdminPrivateRoute>
            }
          />

          </Routes>
        </Router>
        <ToastContainer />
      </div>
    </>
  )
}

export default App
