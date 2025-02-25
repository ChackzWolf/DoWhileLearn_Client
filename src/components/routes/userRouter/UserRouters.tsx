import {Routes, Route} from 'react-router-dom';
import OtpVarification from '../../user/auth/OtpVarification';
import AuthChoice from '../../common/AuthChoice';
import PaymentSuccessPage from '../../../pages/user/PaymentStatus/PaymentSuccessPage';
import WishListPage from '../../../pages/user/Cart/WishListPage';
import ProfilePage from '../../../pages/user/Profile/ProfilePage';
import TutorDetailsPage from '../../../pages/user/TutorDetailsPage/TutorDetailsPage';
import Header from '../../user/Layout/Header';
import { Footer } from '../../user/Layout/Footer';
import { CertificatesPage } from '../../../pages/user/Profile/CertificatesPage';
import { OrdersPage } from '../../../pages/user/Profile/UserOrdersPage';

const UserRoutes = ()=>{
    return(
        <div className='bg-gradient-to-br from-purple-500 to-lavender-start via-primary to-purple-to-lavender-end h-full'>
            <Header/>
            <Routes>
                <Route path = '/profile' element = {<ProfilePage/>}/>
                <Route path = '/certificates' element = {<CertificatesPage/>}/>
                <Route path = '/orders' element = {<OrdersPage/>}/>
                <Route path ='/AuthChoice' element = {<AuthChoice/>}/>
                <Route path = '/otp' element = {<OtpVarification/>}/>
                <Route path = '/payment/success' element = {<PaymentSuccessPage/>}/>
                <Route path = '/wishlist' element = {<WishListPage/>}/>
                <Route path = '/tutor/profile/:id' element= {<TutorDetailsPage/>} />
            </Routes>
            <Footer/>
        </div>
    )
}

export default UserRoutes