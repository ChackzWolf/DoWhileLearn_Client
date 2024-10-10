import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import UserRoutes from '../src/components/routes/userRouter/UserRouters';
import TutorRoutes from './components/routes/tutorRouter/tutorRouters';
import AdminRoutes from './components/routes/adminRouter/AdminRouters';
import {UserPrivateRoute} from './utils/user/PrivateRouter';
import {TutorPrivateRoute} from './utils/tutor/PrivateRouter';
import { AdminPrivateRoute } from './utils/admin/PrivateRoute';
import LoginUser from './components/user/auth/Login';
import RegisterUser from './components/user/auth/register';
import LoginTutor from './components/tutor/auth/Login';
import RegisterTutor from './components/tutor/auth/register';
import AuthChoice from './components/common/AuthChoice';
import OtpVarification from './components/user/auth/OtpVarification';
import UserHome from './components/user/UserHome';
import AdminLoginPage from './pages/admin/auth/AdminLoginPage';
import CourseDetailsPage from './pages/user/Courses/CourseDetailsPage';
import CoursesListPage from './pages/user/Courses/CoursesListPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


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
          <Route path='/login/user' element={<LoginUser/>}/>
          <Route path='/register/user' element={<RegisterUser/>}/>
          <Route path='/register/user/otp' element = {<OtpVarification/>}/>

           {/* Tutor Auth */}
          <Route path='/login/tutor' element = {<LoginTutor/>}/>
          <Route path='/register/tutor' element ={<RegisterTutor/>}/>
          
          

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
