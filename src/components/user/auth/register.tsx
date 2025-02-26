import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from 'yup';
import { userEndpoint } from "../../../constraints/userEndpoints";
import axios from "axios";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import EyeToggleButton from "../../common/icons/eyeToggleButton/eyeToggleButton";
import Header from "../Layout/Header";
import { ROUTES } from "../../../routes/Routes";
import OAuth from "../../common/Auth/CustomGoogleLoginButton";
import {motion} from "framer-motion"
import { Player } from "@lottiefiles/react-lottie-player";
import { toast } from "react-toastify";
import Loader from "../../common/icons/loader";



function RegisterUser() {
    
    const navigate = useNavigate();
    const [isLoading, setIsLoading]
    const [emailExists,setEmailExists] = useState(false)
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };
  
    const toggleConfirmPasswordVisibility = () => {
 
        console.log('treggg')
      setShowConfirmPassword(!showConfirmPassword);
      console.log(showConfirmPassword)
    };

    const validationSchema = Yup.object({
        email: Yup.string().email('Invalid email address').required('Email is required'),

        firstName: Yup.string()
            .required('First name is required')
            .matches(/^[A-Za-z]+$/, 'First name can only contain letters')
            .min(1, 'First name must be at least 1 characters long')
            .max(50, 'First name cannot be longer than 50 characters'),
      
        lastName: Yup.string()
            .required('Last name is required')
            .matches(/^[A-Za-z]+$/, 'Last name can only contain letters')
            .min(1, 'Last name must be at least 1 characters long')
            .max(50, 'Last name cannot be longer than 50 characters'),
        password: Yup.string()
            .required('Password is required')
            .min(8, 'Password must be at least 8 characters long')
            .max(20, 'Password cannot be longer than 20 characters')
            .matches(
              /[a-z]/,
              'Password must contain at least one lowercase letter'
            )
            .matches(
              /[A-Z]/,
              'Password must contain at least one uppercase letter'
            )
            .matches(
              /[0-9]/,
              'Password must contain at least one number'
            )
            .matches(
              /[@$!%*?&#]/,
              'Password must contain at least one special character'
            ),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password'),''], 'Passwords must match')
            .required('Confirm password is required'),
    });
    const initialValues = {
        firstName:'',
        lastName:'',
        email: '',
        password: '',
        confirmPassword:''
    };


    const handleSubmit = async (value: typeof initialValues, {setSubmitting}: { setSubmitting: (isSubmiting: boolean)=> void} ) => {
        try{setIsLoading(true)

            const response = await axios.post(userEndpoint.register, value);
            console.log('register data send succesfully');
            localStorage.removeItem('otpCountDown');
            if(response.data.success){
                navigate(ROUTES.user.signupOTP,{state: response.data});
                console.log('success' , response.data)
            }else{
                console.log(response.data)
                setEmailExists(true)
                toast.error('Email already exists.')
                console.log('failed')
            }
        }catch(err){
            console.log(err, "registeration error ");

        }finally {
            setSubmitting(false);
            setIsLoading(false)
        }
    }





    return (
        <div className="bg-gradient-to-br from-purple-500 to-lavender-start via-primary to-purple-to-lavender-end min-h-screen min-w-screen flex flex-col overflow-hidden">
            <Header/>
        {isLoading && <Loader/>}
        <div className="flex flex-col md:flex-row h-full overflow-hidden">


            <motion.div
                    initial={{ opacity: 0, x: -150 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.15 }}
                 className="w-full md:w-1/2 flex justify-center items-center"> 
                    <Player
                        autoplay
                        loop
                        src="https://lottie.host/2c1314ab-f84b-4779-8c97-d9c8ae4be53a/u6H6TpekA6.json"
                        style={{ height: '70%', width: ' 70%'}}
                        />

            </motion.div>



            <motion.div
                    initial={{ opacity: 0, x: 150 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.15 }}  
                    className="md:w-1/2 justify-center">
                
                <h2 className="text-3xl mb-5 md:mt-20 text-center font-bold text-accent">Student Signup</h2>
                { emailExists?  <h2 className="text-center text-[#FF0000]">Email already exists.</h2> : <h1></h1>}


                <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                    {({isSubmitting})=>(

                    
                    <Form>
                        <div className="justify-center mb-20 md:px-28 px-10">

                            <div className="flex flex-col md:flex-row justify-between gap-6">
                                <div className="md:w-1/2 w-full">
                                    <p className="text-base mb-2 font-normal text-accent">First-name</p>
                                    <div className="mb-4 items-center">
                                        <Field
                                            type="name"
                                            name="firstName"
                                            className="w-full h-10 p-2 shadow-lg rounded-lg transition-all ease-in-out delay-100 duration-100  focus-visible:outline-none hover:border-4 hover:border-[#DDB3FF] focus:border-[#DDB3FF] focus:border-4"
                                            placeholder=" Enter your first-name here."
                                        />
                                        <ErrorMessage name="firstName" component="div" className="w-4/5 text-red-500 text-xs mt-1" />
                                    </div>
                                </div>
                                <div className="md:w-1/2 w-full">
                                    <p className="text-base mb-2 font-normal text-accent">Last-name</p>
                                    <div className="mb-4 items-center">
                                        <Field
                                            type="name"
                                            name="lastName"
                                            className="w-full h-10 p-2 border shadow-lg rounded-lg transition-all ease-in-out delay-100 duration-100  focus-visible:outline-none hover:border-4 hover:border-[#DDB3FF] focus:border-[#DDB3FF] focus:border-4"
                                            placeholder=" Enter your last-name here."
                                        />
                                        <ErrorMessage name="lastName" component="div" className="w-4/5 text-red-500 text-xs mt-1" />
                                    </div>
                                </div>

                            </div>


                            <p className="text-base mb-2 font-normal text-accent">Email</p>
                            <div className="mb-4 items-center">
                                <Field
                                    type="email"
                                    name="email"
                                    className="w-full h-10 p-2 px-4 shadow-lg rounded-lg transition-all ease-in-out delay-100 duration-100  focus-visible:outline-none hover:border-4 hover:border-[#DDB3FF] focus:border-[#DDB3FF] focus:border-4"
                                    placeholder=" Enter your email here."
                                />
                                <ErrorMessage name="email" component="div" className="w-4/5 text-red-500 text-xs mt-1" />
                            </div>


                            
                            <div className="flex flex-col md:flex-row justify-between gap-5 mb-5">
                                <div className="md:w-1/2">
                                    <p className="text-base mb-2 font-normal text-accent">Create a password</p>
                                    <div className="md:mb-4 items-center">
                                    <div className="relative w-full h-10 flex items-center right-1">
                                        <Field
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            className="abslolute  w-full h-10 shadow-lg p-3 rounded-lg transition-all ease-in-out delay-100 duration-100  focus-visible:outline-none hover:border-4 hover:border-[#DDB3FF] focus:border-[#DDB3FF] focus:border-4"
                                            placeholder="Enter your password here."
                                        />
                                        <EyeToggleButton  onClick={togglePasswordVisibility} />
                                        </div>
                                        <ErrorMessage name="password" component="div" className="w-4/5 text-red-500 text-xs mt-1" />
                                    </div>
                                </div>
                                <div className="md:w-1/2">
                                    <p className="text-base mb-2 font-normal text-accent">Confirm password</p>
                                    <div className="mb-4 items-center">
                                        <div className="relative w-full h-10 flex items-center ">
                                        <Field
                                            type={showConfirmPassword ? "text" : "password"}
                                            name="confirmPassword"
                                            className="abslolute  w-full h-10 p-3 rounded-lg transition-all ease-in-out delay-100 duration-100  focus-visible:outline-none hover:border-4 hover:border-[#DDB3FF] focus:border-[#DDB3FF] focus:border-4"
                                            placeholder="Enter your password here."
                                        />
                                        <EyeToggleButton  onClick={toggleConfirmPasswordVisibility} />
                                        
                                         </div>
                                     

                                        <ErrorMessage name="confirmPassword" component="div" className="w-4/5 text-red-500 text-xs mt-1" />

                                    </div>
                                </div>

                            </div>


                            <div className="justify-center mb-6 ">
                                <button
                                    type="submit"
                                    className="w-full px-4 py-3 mb-4 text-white rounded-lg font-PlusJakartaSans font-semibold  bg-[#7C24F0] transition-all ease-in-out delay-50 duration-500         "
                                    
                                >
                                    {isSubmitting? 'Creating...': 'Create account'}
                                </button>
<div className="flex items-center mb-5">
  <div className="flex-grow border-t border-softPeach"></div>
  <span className="px-2 text-softPeach text-sm">or</span>
  <div className="flex-grow border-t border-softPeach"></div>
</div>

                                <OAuth role="USER"/>


                                <div className="flex w-full text-accent justify-center my-5">
                                    <h1>Already have an account?  </h1>
                                    <NavLink to={ROUTES.user.signin}>
                                        <h1 className="transition-all pl-2 text-accent underline hover:underline-offset-4"> Login</h1>
                                    </NavLink>
                                </div>

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

export default RegisterUser