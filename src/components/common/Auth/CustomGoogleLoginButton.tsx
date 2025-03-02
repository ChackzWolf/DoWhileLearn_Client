import { GoogleAuthProvider, UserCredential, getAuth, signInWithPopup } from 'firebase/auth'
import { app } from '../../../firebase';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { IoLogoGoogle } from "react-icons/io";
import { toast } from 'react-toastify';
import { userEndpoint } from "../../../constraints/userEndpoints";
import { useState } from 'react'
import { setCookie } from '../../../utils/cookieManager';
import { setTutorLogin, setTutorProfilePic, setUserLogin, setUserProfilePic } from '../../../redux/authSlice/authSlice';
import axios from 'axios';
import { ROUTES } from '../../../routes/Routes';
import Spinner from '../icons/Spinner';
import { tutorEndpoint } from '../../../constraints/tutorEndpoint';
import { setTutorData } from '../../../redux/tutorSlice/tutorSlice';


const OAuth = ({ role }: { role: string }) => {
    const auth = getAuth(app)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [message, setMessage] = useState('')
    const [isLoading, setIsLoading] = useState(false);

    const handleGoogleClick = async () => {
        try {
            const provider = new GoogleAuthProvider();
            provider.setCustomParameters({ prompt: "select_account" });
            const resultsFromGoogle: UserCredential = await signInWithPopup(auth, provider);
            console.log(resultsFromGoogle, 'ljlkjl');

            if (resultsFromGoogle) {
                const user = resultsFromGoogle.user;
                const displayName = user.displayName || '';
                const email = user.email || '';
                const photoUrl = user.photoURL || '';
                const [firstName, lastName] = displayName.split(' ');

                if (role === 'USER') {
                    const response = await axios.post(userEndpoint.googleAuth, { firstName, lastName, email, photoUrl });
                    const { success, accessToken, refreshToken, userId, message, userData } = response.data;
                    console.log(response.data)
                    if (success) {
                        console.log(accessToken, refreshToken, userId)
                        setCookie('userId', userId, 10)
                        setCookie('userAccessToken', accessToken, 0.1);
                        setCookie('userRefreshToken', refreshToken, 10);
                        dispatch(setUserLogin())
                        console.log(userData, 'this is user data')
                        if (userData.profilePicture) {
                            console.log('setting profile picture to redux:', userData.profilePicture)
                            dispatch(setUserProfilePic(userData.profilePicture))
                        }
                        setIsLoading(false)
                        navigate(ROUTES.common.landingPage);
                    } else {
                        setIsLoading(false)
                        setMessage(message);
                    }
                } else {
                    const response = await axios.post(tutorEndpoint.googleAuth, { firstName, lastName, email, photoUrl });
                    console.log(response.data, 'data form tutorservice');
                    const success = response.data;
                    if(success){
                        const {type,tutorId, tutorData, accessToken,refreshToken} = response.data;
                        const data = {
                            _id: tutorId,
                            firstName: tutorData.firstName,
                            lastName: tutorData.lastName,
                            email: tutorData.email,
                            bio: tutorData.bio,
                            expertise: tutorData.expertise,
                            qualifications: tutorData.qualifications,
                            profilePicture: tutorData.profilePicture,
                            cv: tutorData.cv,
                            isblocked: tutorData.isblocked,
                          };
                          console.log(data,'data')
                          console.log('type', type)
                          dispatch(setTutorData(data));
                          dispatch(setTutorLogin())
                          dispatch(setTutorProfilePic(tutorData.profilePicture))
                          setCookie('tutorAccessToken', accessToken, 0.01);
                          setCookie('tutorRefreshToken', refreshToken, 7);
                          setCookie('tutorId',tutorId,7)
                          
                        if(type === 'SIGN_UP'){
                            console.log('sighnup')
                            navigate(ROUTES.tutor.completeRegisteration);
                        }else{
                            console.log('signin')
                            // navigate(ROUTES.tutor.dashBoard);
                        }
                    } 
                }
            }

        } catch (error: any) {
            if (error.code === 'auth/popup-closed-by-user') {
                console.error('The popup was closed before completing the sign-in. Please try again.');
            } else {
                toast.error('An error occurred during sign-in. Please try again.');
                console.error('Error during sign-in:', error);
            }
        }finally{
            setIsLoading(false)
        }
    }
    return (
        <>
            <button onClick={handleGoogleClick} type='button' className='transition-all flex justify-center items-center gap-3 bg-[#f3e9ff] text-primary py-2 px-4 rounded-lg hover:bg-[#f3e9ff] shadow-md w-full h-full  hover:shadow-xl'>
                <IoLogoGoogle size={26} />
                {isLoading ? <Spinner /> : "Sign In with Google"}
            </button>
            {message && (<h1 className=' text-sm text-red-500'>message</h1>)}
        </>
    )
}

export default OAuth