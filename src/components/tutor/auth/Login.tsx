import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from 'yup';
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { getCookie, setCookie } from "../../../utils/cookieManager";
import { setTutorLogin } from "../../../redux/authSlice/authSlice";
import { useDispatch } from "react-redux";
import { useState } from "react";
import EyeCheckbox from "../../common/icons/eyeToggleButton/eyeToggleButton";
import { tutorEndpoint } from "../../../constraints/tutorEndpoint";

function LoginModal() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [message, setMessage] = useState('')
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


    const handleSubmit = async(value : typeof initialValue , {setSubmitting} : {setSubmitting: (isSubmitting: boolean) =>  void} ) => {
        try {
            const response = await axios.post(tutorEndpoint.loginTutor, value);
            console.log(response.data)
            const {success, accessToken, refreshToken ,status ,message,_id} = response.data;
            console.log(status)
            if(success){
                
                setCookie('tutroAccessToken', accessToken, 0.01);
                console.log("setCookie")
                setCookie('tutorRefreshToken', refreshToken, 7);
                console.log("setRefreshCookie");
                setCookie('tutorId',_id, 7)
                dispatch(setTutorLogin())
                navigate('/tutor');
            }else{
                setMessage(message);
            }
            
        } catch (error:any) {
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
        }
  
    }

    return (
        <>
            <div className="flex h-screen">
                

                <div className="w-1/2  bg-purple-700"> 

                </div>



                <div className="bg-[#FCF6FF] p-16 shadow-lg w-1/2 rouder-lg justify-center">

                    <h2 className="text-3xl mb-5 mt-20 text-center font-bold">Tutor Login</h2>

                    <h1 className="text-red-800 text-center">{message}</h1>
                    <Formik initialValues={initialValue} validationSchema={validationSchema} onSubmit={handleSubmit}>

                    {({isSubmitting})=>(


                        <Form>
                            <div className="justify-center mb-20 px-28">


                                <p className="text-base mb-2 font-normal">Email</p>
                                <div className="mb-4  fex-col items-center">
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
                                    <p className="text-base mb-2 font-normal justify-end text-sky-700">Forgot ?</p>
                                </div>

                                <div className="justify-center mb-6 ">
                                <div className="relative w-full h-10 flex items-center right-1 rounded-lg ">
                                    <Field
                                        type={showPassword ? 'name': 'password'}
                                        name="password"
                                        className="w-full h-10 p-2 px-4 shadow-lg rounded-lg transition-all ease-in-out delay-100 duration-100 focus-visible:outline-none hover:border-4 hover:border-[#DDB3FF] focus:border-[#DDB3FF] focus:border-4"
                                        placeholder="Enter your password here."
                                    />
                                    <EyeCheckbox  onClick={togglePasswordVisibility} />
                                    </div>
                                    <ErrorMessage name="password" component="div" className="w-4/5 text-red-500 text-xs mt-1" />
                                </div>


                                <div className="justify-center mb-6 ">
                                    <button
                                        type="submit"
                                        className="w-full px-4 py-3 mb-4 text-white shadow-lg rounded-lg font-PlusJakartaSans font-semibold bg-gradient-to-r bg-[#7C24F0] transition-all ease-in-out delay-50 duration-500         "
                                        disabled={isSubmitting}
                                    >

                                        Login
                                        {/* {isSubmitting ? 'Submitting...' : 'Continue'} */}
                                    </button>

                                    <button
                                        type="submit"
                                        className="w-full px-4 py-3 mb-4 rounded-lg shadow-lg font-PlusJakartaSans font-semibold bg-gradient-to-r bg-[#DDB3FF] transition-all ease-in-out delay-50 duration-500         "
                                
                                    >

                                        Login with Google
                                        {/* {isSubmitting ? 'Submitting...' : 'Continue'} */}
                                    </button>


                                    <div className="flex w-full">
                                        <h1>Don't have an account?  </h1>
                                        <NavLink to="/register/tutor" className="pl-2 text-sky-700">
                                             Signup
                                        </NavLink>
                                    </div>
                                    <div className="flex w-full">
                                        <h1>Are you a student?  </h1>
                                        <NavLink to="/register/user" className="pl-2 text-sky-700">
                                             Login
                                        </NavLink>
                                    </div>

                                </div>

                            </div>
                        </Form>

                    )}
                    </Formik>
                </div>

            </div>
        </>
    )
}

export default LoginModal