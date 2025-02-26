import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from 'yup';
import {  useNavigate } from "react-router-dom";
import { userEndpoint } from "../../constraints/userEndpoints";
import axios from "axios";
import { useState,useEffect } from "react";
import Loader from "./icons/loader";
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { handleBlockedUser } from "../../utils/handleErrors/handleBlocked";
import { Player } from "@lottiefiles/react-lottie-player";
import { tutorEndpoint } from "../../constraints/tutorEndpoint";
import { adminEndpoint } from "../../constraints/adminEndpoints";
import { ROUTES } from "../../routes/Routes";

interface VarifyEmailProp {
    role:string
}
function VerifyEmail({role}:VarifyEmailProp) {
    const navigate = useNavigate()
    const [message, setMessage] = useState('')
    const [isLoading, setIsLoading] = useState(false);
  
 

    const validationSchema = Yup.object({
        email: Yup.string().email('Invalid email address').required('Email is required'),
    });
    const initialValue = {
        email: ''
    };


    const location = useLocation();

    useEffect(() => {
      const queryParams = new URLSearchParams(location.search);
      const message = queryParams.get('message');
  
      if (message === 'blocked') {
        toast.error('You have been blocked! Please contact admin to resolve');
      }
    }, [location]);



    const handleSubmit = async(value : typeof initialValue , {setSubmitting} : {setSubmitting: (isSubmitting: boolean) =>  void} ) => {
        try {
            setIsLoading(true)
            if(role === 'USER'){
                const response = await axios.post(userEndpoint.sendOtpToEmail, value);
                console.log(response.data)
                const {message,success} = response.data;
                if(!success){
                    setMessage(message)
                    return;
                }
                navigate(ROUTES.user.forgotPasswordOTP,{state: response.data});
            }else if (role === 'TUTOR'){
                console.log('role',role)
                const response = await axios.post(tutorEndpoint.sendOtpToEmail, value);
                console.log(response.data)
                const {message,success} = response.data;
                if(!success){
                    setMessage(message)
                    return;
                }
          
                navigate(ROUTES.tutor.forgotPasswordOTP,{state: response.data});
            }else if(role === 'ADMIN'){
                const response = await axios.post(adminEndpoint.sendOtpToEmail, value);
                console.log(response.data,'response data')
                const {message,success} = response.data;
                if(!success){
                    setMessage(message)
                    return;
                }
                navigate(ROUTES.admin.forgotPasswordOTP,{state: response.data});
            }
        } catch (error) {
            setIsLoading(false)
            if(!handleBlockedUser(error)){
                throw new Error(`Something went wrong ! status:${status} ${error}`)
            }
            else handleBlockedUser(error);
        }finally{
            setIsLoading(false)
            setSubmitting(false)
        }
    }
    localStorage.removeItem('otpCountDown');
    return (
<>
    {isLoading ? <Loader /> : ""}

    <div className="flex flex-col md:flex-row h-screen bg-gradient-to-br from-purple-500 to-lavender-start via-primary to-purple-to-lavender-end ">
        <div className="w-full md:w-1/2  flex justify-center items-center"> 
                    <Player
                    autoplay
                    loop
                    src="https://lottie.host/2c1314ab-f84b-4779-8c97-d9c8ae4be53a/u6H6TpekA6.json"
                    style={{ height: '70%', width: ' 70%'}}
                    />
                    
        </div>

        <div className=" p-6 md:p-16 w-full md:w-1/2 rounded-lg flex justify-center">
            <div className="w-full max-w-md flex flex-col justify-center items-center"> {/* Center the form container */}
                <h2 className="text-3xl mb-5 mt-20 text-center font-bold text-accent">Enter email to verify</h2>
                <h1 className="text-red-500 text-center">{message}</h1>
                <Formik initialValues={initialValue} validationSchema={validationSchema} onSubmit={handleSubmit}>
                    {({ isSubmitting }) => (
                        <Form>
                            <div className="justify-center mb-20 px-4 md:px-28 lg:px-16">
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
                

                                <div className="justify-center mb-6 ">
                                    <button
                                        type="submit"
                                        className="w-full px-4 py-3 mb-4 text-white shadow-lg rounded-lg font-PlusJakartaSans font-semibold bg-primary hover:shadow-2xl transition-all ease-in-out delay-50 duration-500"
                                        disabled={isSubmitting}
                                    >
                                        Verify
                                    </button>

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

export default VerifyEmail