import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from 'yup';
import { NavLink, useNavigate } from "react-router-dom";
import { userEndpoint } from "../../../constraints/userEndpoints";
import axios, { AxiosError } from "axios";
import { setCookie } from "../../../utils/cookieManager";
import { setUserLogin, setUserProfilePic } from "../../../redux/authSlice/authSlice";
import { useDispatch } from "react-redux";
import { useState,useEffect } from "react";
import EyeCheckbox from "../../common/icons/eyeToggleButton/eyeToggleButton";
import Header from "../Layout/Header";
import Loader from "../../common/icons/loader";
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { handleBlockedUser } from "../../../utils/handleErrors/handleBlocked";
import { Player } from "@lottiefiles/react-lottie-player";

function LoginModal() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [message, setMessage] = useState('')
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };
  
 

    const validationSchema = Yup.object({
        email: Yup.string().email('Invalid email address').required('Email is required'),
        password: Yup.string()
        .required('Password is required')
        .min(8, 'Password must be at least 8 characters long')
        .max(20, 'Password cannot be longer than 20 characters')
        .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
        .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .matches(/[0-9]/, 'Password must contain at least one number')
        .matches(/[@$!%*?&#]/, 'Password must contain at least one special character'),
    });
    const initialValue = {
        email: '',
        password:''
    };


    const location = useLocation();

    useEffect(() => {
      const queryParams = new URLSearchParams(location.search);
      const message = queryParams.get('message');
  
      if (message === 'blocked') {
        toast.error('You have been blocked! Please contact admin to resolve');
      }else if (message === 'passwordUpdated'){
        toast.success('Password has been updated please login.')
      }
    }, [location]);



    const handleSubmit = async(value : typeof initialValue , {setSubmitting} : {setSubmitting: (isSubmitting: boolean) =>  void} ) => {
        try {
            console.log('trig')
            setIsLoading(true)
            const response = await axios.post(userEndpoint.loginUser, value);
            console.log(response.data)
            const {success, accessToken, refreshToken, userId, message, userData} = response.data;
            console.log(response.data)
            if(success){
                console.log(accessToken,refreshToken,userId)
                
                setCookie('userId', userId, 10)
                setCookie('userAccessToken', accessToken, 0.1);
                setCookie('userRefreshToken', refreshToken, 10);

                dispatch(setUserLogin())
                console.log(userData, 'this is user data')
                if(userData.profilePicture){
                    console.log('setting profile picture to redux:', userData.profilePicture )
                    dispatch(setUserProfilePic(userData.profilePicture))
                }
                setIsLoading(false)
                navigate('/');
            }else{
                setIsLoading(false)
                setMessage(message);
            }
            
        } catch (error:any) {
            setIsLoading(false)
            if(!handleBlockedUser(error)){
                // throw new Error(`Something went wrong ! status:${status} ${error}`)
                console.log(error.response)
                setMessage(error.response.data.message);
            }
            else handleBlockedUser(error);
        }finally{
            setIsLoading(false)
            setSubmitting(false)
        }
    }

    return (
<>
    {isLoading ? <Loader /> : ""}
    <Header />

    <div className="flex flex-col md:flex-row h-screen">
        <div className="w-full md:w-1/2 bg-[#FCF6FF] flex justify-center items-center"> 
                    <Player
                    autoplay
                    loop
                    src="https://lottie.host/2c1314ab-f84b-4779-8c97-d9c8ae4be53a/u6H6TpekA6.json"
                    style={{ height: '70%', width: ' 70%'}}
                    />
                    
        </div>

        <div className="bg-[#FCF6FF] p-6 md:p-16 w-full md:w-1/2 rounded-lg flex justify-center">
            <div className="w-full max-w-md"> {/* Center the form container */}
                <h2 className="text-3xl mb-5 mt-20 text-center font-bold">Student Login</h2>
                <h1 className="text-red-800 text-center">{message}</h1>
                <Formik initialValues={initialValue} validationSchema={validationSchema} onSubmit={handleSubmit}>
                    {({ isSubmitting }) => (
                        <Form>
                            <div className="justify-center mb-20 px-4 md:px-28 lg:px-16">
                                <p className="text-base mb-2 font-normal">Email</p>
                                <div className="mb-4 flex-col items-center">
                                    <Field
                                        type="email"
                                        name="email"
                                        className="w-full h-10 p-2 px-4 shadow-lg rounded-lg transition-all ease-in-out delay-100 duration-100 focus-visible:outline-none hover:border-4 hover:border-[#DDB3FF] focus:border-[#DDB3FF] focus:border-4"
                                        placeholder=" Enter your email here."
                                    />
                                    <ErrorMessage name="email" component="div" className="w-4/5 text-red-500 text-xs mt-1" />
                                </div>
                                <div className="flex w-full justify-between">
                                    <p className="text-base mb-2 font-normal">Password</p>
                                    {/* <p className="text-base mb-2 font-normal justify-end text-sky-700">Forgot ?</p> */}
                                    <a href="/login/user/forgot-password" className="text-base mb-2 font-normal justify-end text-sky-700">Forgot ?</a>
                                </div>

                                <div className="justify-center mb-6 ">
                                    <div className="relative w-full h-10 flex items-center right-1 rounded-lg ">
                                        <Field
                                            type={showPassword ? 'text' : 'password'} // Corrected type to 'text'
                                            name="password"
                                            className="w-full h-10 p-2 px-4 shadow-lg rounded-lg transition-all ease-in-out delay-100 duration-100 focus-visible:outline-none hover:border-4 hover:border-[#DDB3FF] focus:border-[#DDB3FF] focus:border-4"
                                            placeholder="Enter your password here."
                                        />
                                        <EyeCheckbox onClick={togglePasswordVisibility} />
                                    </div>
                                    <ErrorMessage name="password" component="div" className="w-4/5 text-red-500 text-xs mt-1" />
                                </div>

                                <div className="justify-center mb-6 ">
                                    <button
                                        type="submit"
                                        className="w-full px-4 py-3 mb-4 text-white shadow-lg rounded-lg font-PlusJakartaSans font-semibold bg-gradient-to-r bg-[#7C24F0] transition-all ease-in-out delay-50 duration-500"
                                        disabled={isSubmitting}
                                    >
                                        Login
                                    </button>

                                    <button
                                        type="button" // Changed type to button for Google login
                                        className="w-full px-4 py-3 mb-4 rounded-lg shadow-lg font-PlusJakartaSans font-semibold bg-gradient-to-r bg-[#DDB3FF] transition-all ease-in-out delay-50 duration-500"
                                    >
                                        Login with Google
                                    </button>

                                    <div className="flex w-full">
                                        <h1>Don't have an account? </h1>
                                        <NavLink to="/register/user" className="pl-2 text-sky-700">
                                            Signup
                                        </NavLink>
                                    </div>
                                </div>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    </div>
</>
    )
}

export default LoginModal