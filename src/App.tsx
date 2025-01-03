import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import UserRoutes from '../src/components/routes/userRouter/UserRouters';
import TutorRoutes from './components/routes/tutorRouter/tutorRouters';
import AdminRoutes from './components/routes/adminRouter/AdminRouters';
import {UserPrivateRoute} from './utils/user/PrivateRouter';
import {TutorPrivateRoute} from './utils/tutor/PrivateRouter';
import { AdminPrivateRoute } from './utils/admin/PrivateRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserAuthRoutes from './components/routes/authRouter/UserAuthRouters';
import RegistrationPage from './pages/tutor/Registration/RegistrationFirstPage';
import CommonRoutes from './components/routes/commonRouter/CommonRouters';
import TutorAuthRoutes from './components/routes/authRouter/TutorAuthRouters';
import AdminAuthRoutes from './components/routes/authRouter/AdminRoutes';


function App() {

  return (
    <>
      <div className='App'>
        <Router>
          <Routes>
            <Route path = '/*' element = {<CommonRoutes/>}/>

            {/* User auth */}
            <Route path = 'user/auth/*' element={<UserAuthRoutes/>} />
            <Route path = 'tutor/auth/*' element={<TutorAuthRoutes/>} />
            <Route path = 'admin/auth/*' element={<AdminAuthRoutes/>} />

            <Route path = '/tutor/complete-registration' element={<RegistrationPage/>}/>


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
