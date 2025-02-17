import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from 'yup';
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { setCookie } from "../../../utils/cookieManager";
import { useState, useEffect } from "react";
import EyeCheckbox from "../../common/icons/eyeToggleButton/eyeToggleButton";
import { adminEndpoint } from "../../../constraints/adminEndpoints";
import Loader from "../../common/icons/loader";
import { toast } from 'react-toastify';
import { ROUTES } from "../../../routes/Routes";
import { motion } from 'framer-motion';


function LoginAdmin() {
    const navigate = useNavigate()
    const [message, setMessage] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false);
    const [credentialVisible, setCredentialVisible] = useState(false);
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
        password: ''
    };
    const location = useLocation();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const message = queryParams.get('message');

        if (message === 'passwordUpdated') {
            toast.success('Your password has been updated. Please login with your new password.')
        }
    }, [location]);

    const handleSubmit = async (value: typeof initialValue, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
        try {
            setIsLoading(true)
            const response = await axios.post(adminEndpoint.login, value);
            console.log(response.data)
            const { success, accessToken, refreshToken, status, message, _id } = response.data;
            console.log(status)
            if (success) {

                setCookie("adminAccessToken", accessToken, 0.15)
                console.log("setCookie")
                setCookie('adminRefreshToken', refreshToken, 7);
                console.log("setRefreshCookie");
                setCookie('adminId', _id, 7);

                navigate(ROUTES.admin.dashBoard);
            } else {
                setMessage(message);
            }

        } catch (error: any) {
            // Catch and handle the error
            if (error.response) {
                // Server-side error, extract message and status
                const { status, data } = error.response;
                throw new Error(`Login failed! Status: ${status}, Message: ${data.message || error.message}`);
            } else {
                // Network or unexpected error
                throw new Error(`Something went wrong: ${error.message}`);
            }
        } finally {
            // Reset the form submitting state
            setSubmitting(false);
            setIsLoading(false)
        }

    }

    return (
        <>
            {isLoading && <Loader />}
            <div className="flex flex-col md:flex-row min-h-screen h-full">
                <div
                    className={`fixed inset-0 flex justify-center items-center z-40 transition-opacity duration-300 ${credentialVisible ? "bg-black bg-opacity-50" : "opacity-0 hidden"}`}
                >
                    <motion.div
                        initial={{ opacity: 0, y: -150 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.15 }}
                        className="bg-white p-5 rounded-lg shadow-lg z-50">
                        <div className="flex flex-col items-center gap-3">
                            <h1 className="text-3xl font-bold text-primary">Credential</h1>
                            <p className="text-lg text-primary">Email: admin@gmail.com</p>
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

                <div className="bg-[#FCF6FF] p-16 shadow-lg w-full md:w-1/2 rounded-lg flex flex-col justify-center">
                    <h2 className="text-3xl mb-5 mt-20 text-center font-bold">Admin Login</h2>
                    <h1 className="text-red-800 text-center">{message}</h1>
                    <Formik initialValues={initialValue} validationSchema={validationSchema} onSubmit={handleSubmit}>
                        {({ isSubmitting }) => (
                            <Form>
                                <motion.div
                                    initial={{ opacity: 0, x: -150 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5, delay: 0.15 }}
                                    className="justify-center mb-20 px-4 sm:px-12 lg:px-28"
                                >

                                    <p className="text-base mb-2 font-normal">Email</p>
                                    <div className="mb-4 flex flex-col items-center">
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
                                        <a href="/admin/auth/forgot-password" className="text-base mb-2 font-normal justify-end text-sky-700">Forgot?</a>
                                    </div>

                                    <div className="justify-center mb-6">
                                        <div className="relative w-full h-10 flex items-center right-1 rounded-lg">
                                            <Field
                                                type={showPassword ? 'name' : 'password'}
                                                name="password"
                                                className="w-full h-10 p-2 px-4 shadow-lg rounded-lg transition-all ease-in-out delay-100 duration-100 focus-visible:outline-none hover:border-4 hover:border-[#DDB3FF] focus:border-[#DDB3FF] focus:border-4"
                                                placeholder="Enter your password here."
                                            />
                                            <EyeCheckbox onClick={togglePasswordVisibility} />
                                        </div>
                                        <ErrorMessage name="password" component="div" className="w-4/5 text-red-500 text-xs mt-1" />
                                    </div>

                                    <div className="justify-center mb-6">
                                        <button
                                            type="submit"
                                            className="w-full px-4 py-3 mb-4 text-white shadow-lg rounded-lg font-PlusJakartaSans font-semibold bg-gradient-to-r bg-[#7C24F0] transition-all ease-in-out delay-50 duration-500"
                                            disabled={isSubmitting}
                                        >
                                            Login
                                        </button>
                                        <div className="flex justify-between">
                                            <div className="flex ">
                                                <h1>Are you a student?</h1>
                                                <NavLink to={ROUTES.user.signin} className="pl-2 text-sky-700">
                                                    Login
                                                </NavLink>
                                            </div>
                                            <button className=" transition-all md:block hidden text-sm text-lavender hover:text-accent underline " onClick={() => { setCredentialVisible(true) }}>Don't click here</button>
                                        </div>
                                        <button className=" transition-all md:hidden text-sm text-lavender hover:text-accent underline " onClick={() => { setCredentialVisible(true) }}>Don't click here</button>

                                    </div>
                                </motion.div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </>
    )
}

export default LoginAdmin 