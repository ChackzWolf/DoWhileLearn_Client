import {Routes, Route} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import UserHome from '../../user/UserHome';
import AuthChoice from '../../common/AuthChoice';
import CoursesListPage from '../../../pages/user/Courses/CoursesListPage';
import Header from '../../user/Layout/Header';
import CourseDetailsPage from '../../../pages/user/Courses/CourseDetailsPage';
import LandingPage from '../../user/LandingPage';
import { useEffect, useState } from 'react';
import { ScrollButton } from '../../common/ScrollUp';
import CourseListAndChat from '../../user/Chat/ChatCoursesRoute';
import { Footer } from '../../user/Layout/Footer';


const CommonRoutes = ()=>{
    const [isVisible, setIsVisible] = useState(false);

    // Show the button when the user scrolls down 100px
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
  
    // Scroll smoothly to the top when the button is clicked
    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    };
  
    // Add scroll event listener when component is mounted
    useEffect(() => {
      window.addEventListener('scroll', handleScroll);
      
      // Cleanup the event listener when the component unmounts
      return () => window.removeEventListener('scroll', handleScroll);
    }, []);
  

      
    return(  //bg-gradient-to-b from-[#7C24F0]
        <div
        
        className='bg-gradient-to-br from-purple-500 to-lavender-start via-primary to-purple-to-lavender-end h-full'
        >
            <ToastContainer/>
                <Header/>
                <Routes>
                    <Route path='/' element= {<UserHome/>}/>
                    <Route path='/home' element= {<LandingPage/>}/>
                    <Route path='/AuthChoice' element= {<AuthChoice/>}/>
                    <Route path ='/courses' element = {<CoursesListPage/>}/>
                    <Route path="/course/:id" element={<CourseDetailsPage/>} />
                </Routes>
                <CourseListAndChat/>
                <ScrollButton/>
                <Footer/>
        </div>
    )
}

export default CommonRoutes