import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from 'yup';
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { setCookie } from "../../../utils/cookieManager";
import { setTutorLogin, setTutorProfilePic } from "../../../redux/authSlice/authSlice";
import { useState, useEffect } from "react";
import EyeCheckbox from "../../common/icons/eyeToggleButton/eyeToggleButton";
import { tutorEndpoint } from "../../../constraints/tutorEndpoint";
import { handleBlockedTutor } from "../../../utils/handleErrors/handleBlocked";
import { toast } from 'react-toastify';
import Loader from "../../common/icons/loader";
import { Player } from "@lottiefiles/react-lottie-player";
import { setTutorData } from "../../../redux/tutorSlice/tutorSlice";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../redux/store/store";
import { ROUTES } from "../../../routes/Routes";
import OAuth from "../../common/Auth/CustomGoogleLoginButton";
import Header from "../../user/Layout/Header";
import { motion } from 'framer-motion';

function LoginModal() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [message, setMessage] = useState('')
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false)
    const [credentialVisible, setCredentialVisible] = useState(false);
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    const location = useLocation();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const message = queryParams.get('message');

        if (message === 'blocked') {
            toast.error('You have been blocked! Please contact admin to resolve the issue.');
        } else if (message === 'passwordUpdated') {
            toast.success('Your password has been updated. Please login with your new password.')
        }
    }, [location]);

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
        password: ''
    };


    const handleSubmit = async (value: typeof initialValue, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
        try {
            setIsLoading(true)
            const response = await axios.post(tutorEndpoint.loginTutor, value, { withCredentials: true });
            console.log(response.data, 'Response')
            const success = response.data.success;
            if (success) {
                const { accessToken, refreshToken, status, tutorId, tutorData } = response.data;
                console.log(status)
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
                dispatch(setTutorData(data));

                //   console.log("Tutor after dispatch:", useSelector((state: RootState) => state.tutorData));

                console.log(data, 'data')

                console.log(tutorData)
                setCookie('tutorAccessToken', accessToken, 0.01);
                console.log("setCookie")
                setCookie('tutorRefreshToken', refreshToken, 7);
                console.log("setRefreshCookie");
                setCookie('tutorId', tutorId, 7)
                dispatch(setTutorData(data))
                dispatch(setTutorLogin())
                dispatch(setTutorProfilePic(tutorData.profilePicture))
                navigate(ROUTES.tutor.dashBoard);
            } else {
                console.log(response.data.message, 'reached eher')
                setMessage(response.data.message);
            }
        } catch (error: any) {
            // Catch and handle the error
            if (handleBlockedTutor(error)) {
                console.log('unhandled error')
                // Network or unexpected error
                handleBlockedTutor(error)
            }
            else if (error.response) {
                // Server-side error, extract message and status
                const { status, data } = error.response;
                console.log('unhandled')
                throw new Error(`Login failed! Status: ${status}, Message: ${data.message || error.message}`);
            } else throw new Error(`Something went wrong: ${error.message}`);
        } finally {
            // Reset the form submitting state
            setSubmitting(false);
            setIsLoading(false)
        }

    }

    // dispatch(setTutorDataEmpty())
    const tutor = useSelector((state: RootState) => state.tutorData.tutorData); useEffect(() => {
        console.log("Tutor after dispatch:", tutor);
    }, [tutor]);
    console.log(tutor, "dta form redux")
    console.log(credentialVisible, "credentialVisible")
    return (
        <div className="bg-gradient-to-br from-purple-900 to-lavender-start via-primary to-purple-to-lavender-end min-h-screen min-w-screen flex flex-col overflow-hidden">
            {isLoading && <Loader />}

            <div
 
                className={`fixed inset-0 flex justify-center items-center z-40 transition-opacity duration-300 ${credentialVisible ? "bg-black bg-opacity-50" : "opacity-0 hidden"
                    }`}
            >
                <motion.div 
                    initial={{ opacity: 0, y: -150 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.15 }}
                    className="bg-white p-5 rounded-lg shadow-lg z-50">


                    <div className="flex flex-col items-center gap-3">
                        <h1 className="text-3xl font-bold text-primary">Credential</h1>
                        <p className="text-lg text-primary">Email: emil@gmail.com</p>
                        <p className="text-lg text-primary">Password: Jacks@123</p>
                        <button className="p-2 bg-primary text-white rounded" onClick={(_e) => {
                            // e.stopPropagation(); // Prevent click from closing modal
                            setCredentialVisible(false);
                        }}>
                            Close
                        </button>
                    </div>

                </motion.div>
            </div>

            <Header />

            <div className="flex flex-col md:flex-row h-screen justify-center items-center">
                <motion.div
                    initial={{ opacity: 0, x: -150 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.15 }}
                    className="w-full md:w-1/2 flex md:mb-10 justify-center items-center">
                    <Player
                        autoplay
                        loop
                        src="https://lottie.host/192e27ba-19d6-4ae4-b946-9c846d281dcd/qPihaW7Eqq.json"
                        style={{ height: '90%', width: ' 90%' }}
                    />

                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 150 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.15 }}
                    className="px-8 md:p-16 w-full lg:w-1/2 rounded-lg flex flex-col justify-center">

                    <h2 className="text-3xl mb-5 mt-10 text-center font-bold text-accent">Tutor Login</h2>

                    <h1 className="text-red-800 text-center">{message}</h1>
                    <Formik initialValues={initialValue} validationSchema={validationSchema} onSubmit={handleSubmit}>

                        {({ isSubmitting }) => (
                            <Form>
                                <div className="justify-center mb-20 px-4 md:px-28">
                                    <p className="text-base mb-2 font-normal text-accent">Email</p>
                                    <div className="mb-4 flex-col items-center">
                                        <Field
                                            type="email"
                                            name="email"
                                            className="w-full h-10 p-2 px-4 shadow-lg rounded-lg transition-all ease-in-out delay-100 duration-100 focus-visible:outline-none hover:border-4 hover:border-[#DDB3FF] focus:border-[#DDB3FF] focus:border-4"
                                            placeholder=" Enter your email here."
                                        />
                                        <ErrorMessage name="email" component="div" className="w-4/5 text-red-500 text-xs mt-1" />
                                    </div>
                                    <div className="flex w-full justify-between items-center">
                                        <p className="text-base mb-2 font-normal text-accent">Password</p>
                                        <a href="/tutor/auth/forgot-password" className="mb-2 font-normal justify-end text-xs underline text-accent">Forgot ?</a>
                                    </div>

                                    <div className="justify-center mb-6 ">
                                        <div className="relative w-full h-10 flex items-center right-1 rounded-lg ">
                                            <Field
                                                type={showPassword ? 'text' : 'password'}
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
                                            className="w-full px-4 py-3 mb-4 text-white shadow-lg hover:shadow-2xl rounded-lg font-PlusJakartaSans font-semibold  bg-primary transition-all ease-in-out delay-50 duration-500"
                                            disabled={isSubmitting}
                                        >
                                            Login
                                        </button>
                                        <OAuth role="TUTOR" />
                                        <div className="flex w-full text-accent justify-between">
                                            <div className="flex w-auto text-accent">
                                                <h1>Don't have an account?</h1>
                                                <NavLink to={ROUTES.tutor.signup} className="pl-2 text-accent hover:underline">
                                                    Signup
                                                </NavLink>
                                            </div>
                                            <button className=" transition-all md:block hidden text-sm text-lavender hover:text-accent underline " onClick={() => { setCredentialVisible(true) }}>Don't click here</button>
                                        </div>

                                        <div className="flex w-full text-accent">
                                            <h1>Are you a student?  </h1>
                                            <NavLink to={ROUTES.user.signup} className="pl-2 text-accent hover:underline">
                                                Login
                                            </NavLink>
                                            
                                        </div>
                                        <button className=" transition-all md:hidden text-sm text-lavender hover:text-accent underline " onClick={() => { setCredentialVisible(true) }}>Don't click here</button>

                                    </div>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </motion.div>
            </div>
            
        </div>
    )
}

export default LoginModal