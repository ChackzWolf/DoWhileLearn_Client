import {Routes, Route} from 'react-router-dom';
import TutorDashBoard from '../../../pages/tutor/DashBoard/TutorDashBoard'
import UsersPage from '../../../pages/tutor/DashBoard/UsersPage';
import PayoutsPage from '../../../pages/tutor/DashBoard/PayoutPage';
import CreateCoursePage from '../../../pages/tutor/Course/CreateCourse/CreateCoursePage';
import CoursesPage from '../../../pages/tutor/DashBoard/CoursesPage'
import CourseDetailsPage from '../../../pages/tutor/Course/CourseDetailsPage'
import UserDetailsPage from '../../../pages/tutor/DashBoard/UsersPage/UserDetailsPage'
import EditCoursePage from '../../../pages/tutor/Course/EditCourse/EditCoursePage';
import TutorProfilePage from '../../../pages/tutor/Profile/TutorProfilePage';
import UploadDetails from '../../tutor/DashBoardPages/UploadingStatus/UploadingStatus';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store/store';
import UploadSpinner from '../../common/icons/UploadSpinner';
import { ToastContainer } from 'react-toastify';
import Header from '../../tutor/Layout/Header';
import SideNav from '../../tutor/Layout/SideNav';
import RegistrationPage from '../../../pages/tutor/Registration/RegistrationFirstPage';


const TutorRoutes = ()=>{
    const [viewUploads, setViewUploads] = useState(false);
    const uploads = useSelector((state: RootState)=> state.uploadSlice.uploads)


    const viewUploadCallback = () => {
        setViewUploads(false)
    }
    return(
        <div className='bg-accent min-h-full'>
            <ToastContainer/>
            <Header/>
            <div className=" flex w-full h-full bg-accent">
                <div className='h-full md:w-2/12'>
                    <SideNav/>
                </div>
           
                <div className='h-full md:w-10/12 w-full md:px-5'>
                    <Routes>
                        <Route path = '/complete-registration' element={<RegistrationPage/>}/>
                        <Route path= '/' element={<TutorDashBoard/>}/>
                        <Route path= '/users' element={<UsersPage/>}/>
                        <Route path= '/payouts' element={<PayoutsPage/>}/>
                        <Route path= '/createCourse' element={<CreateCoursePage/>}/>
                        <Route path = '/courses' element = {<CoursesPage/>}/>
                        <Route path="/courses/:id" element={<CourseDetailsPage />} />
                        <Route path = "/courses/edit-course" element = {<EditCoursePage/>}/>
                        <Route path = "/complete-registration"   />
                        <Route path='/profile' element ={<TutorProfilePage/>}/>
                        <Route path= '/user/details/:id' element={<UserDetailsPage/>}/>
                    </Routes>
                </div>

            </div>

            {uploads.length > 0 && 
                (     
                    <div>
                        <button onClick={()=> setViewUploads(true)} className='fixed right-0 text-purple  bottom-0 text-4xl justify-between m-7 hover:scale-105 hover:text-purple-600'>
                            <UploadSpinner count={uploads.length}/>
                        </button>
                    </div>
                )
            }
            <UploadDetails viewUploads={viewUploads} closeUploads={viewUploadCallback} />
        </div>
    )
}

export default TutorRoutes