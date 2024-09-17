import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import UserRoutes from '../src/components/routes/userRouter/UserRouters';
import TutorRoutes from './components/routes/tutorRouter/tutorRouters';
import {TutorPrivateRoute, UserPrivateRoute} from './utils/tutor/PrivateRouter';
import LoginUser from './components/user/auth/Login';
import RegisterUser from './components/user/auth/register';
import LoginTutor from './components/tutor/auth/Login';
import RegisterTutor from './components/tutor/auth/register';
import AuthChoice from './components/common/AuthChoice';
import OtpVarification from './components/user/auth/OtpVarification';
import UserHome from './components/user/UserHome';
import AdminLoginPage from './pages/admin/auth/AdminLoginPage';


function App() {

  return (
    <>
      <div className='App'>
        <Router>
          <Routes>
          {/* // page for common */}
          <Route path='/*' element={<UserRoutes/>}/>
          <Route path='/AuthChoice' element= {<AuthChoice/>}/>

          {/* User auth */}
          <Route path='/login/user' element={<LoginUser/>}/>
          <Route path='/refister/user' element={<RegisterUser/>}/>
          <Route path='/register/user/otp' element = {<OtpVarification/>}/>

           {/* Tutor Auth */}
          <Route path='/login/tutor' element = {<LoginTutor/>}/>
          <Route path='/register/tutor' element ={<RegisterTutor/>}/>
          
          <Route path='/home-page' element= {<UserHome/>}/>
          

          {/* Admin Auth */}
          <Route path = '/login/admin' element= {<AdminLoginPage/>}/>
          
        
          
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
                <UserRoutes/>
              </UserPrivateRoute>
            }
          />

          </Routes>
        </Router>
      </div>
    </>
  )
}

export default App
