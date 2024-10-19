import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from 'yup';
import axios from "axios";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import EyeToggleButton from "../../common/icons/eyeToggleButton/eyeToggleButton";
import { tutorEndpoint } from "../../../constraints/tutorEndpoint";



function RegisterUser() {
    
    const navigate = useNavigate();
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
        phoneNumber: Yup.string()
            .required('Phone number is required')
            .matches(/^[6-9][0-9]{9}$/, 'Enter a valid number.'),
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
        try{

            const response = await axios.post(tutorEndpoint.register, value);
            console.log('register data send succesfully');
            localStorage.removeItem('otpCountDown');
            if(response.data.success){
                navigate('/tutor/otp',{state: response.data});
                console.log('success' , response.data)
            }else{
                console.log(response.data)
                setEmailExists(true)
                console.log('failed')
            }
        }catch(err){
            console.log(err, "registeration error ");

        }finally {
            setSubmitting(false);
        }
    }





    return (
        <>

        <div className="flex h-screen">


            <div className="w-1/2 bg-purple-700">

            </div>



            <div className="bg-[#FCF6FF] p- shadow-lg w-1/2 justify-center">
                
                <h2 className="text-3xl mb-5 mt-20 text-center font-bold">Tutor Signup</h2>
                { emailExists?  <h2 className="text-center text-[#FF0000]">Email already exists.</h2> : <h1></h1>}


                <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                    {({isSubmitting})=>(

                    
                    <Form>
                        <div className="justify-center mb-20 px-28">

                            <div className="flex justify-between">
                                <div className="w-1/2 mr-6">
                                    <p className="text-base mb-2 font-normal">First-name</p>
                                    <div className="mb-4 items-center">
                                        <Field
                                            type="name"
                                            name="firstName"
                                            className="w-full h-10 p-2 px-7 shadow-lg rounded-lg bg-gradient-to-r transition-all ease-in-out delay-100 duration-100  focus-visible:outline-none hover:border-4 hover:border-[#DDB3FF] focus:border-[#DDB3FF] focus:border-4"
                                            placeholder=" Enter your first-name here."
                                        />
                                        <ErrorMessage name="firstName" component="div" className="w-4/5 text-red-500 text-xs mt-1" />
                                    </div>
                                </div>
                                <div className="w-1/2 ">
                                    <p className="text-base mb-2 font-normal">Last-name</p>
                                    <div className="mb-4 items-center">
                                        <Field
                                            type="name"
                                            name="lastName"
                                            className="w-full h-10 p-2 px-10 border shadow-lg rounded-lg bg-gradient-to-r transition-all ease-in-out delay-100 duration-100  focus-visible:outline-none hover:border-4 hover:border-[#DDB3FF] focus:border-[#DDB3FF] focus:border-4"
                                            placeholder=" Enter your last-name here."
                                        />
                                        <ErrorMessage name="lastName" component="div" className="w-4/5 text-red-500 text-xs mt-1" />
                                    </div>
                                </div>

                            </div>
                            <div className="flex justify-between">
                                <div className="w-1/2 mr-6">
                                    <p className="text-base mb-2 font-normal">Email</p>
                                    <div className="mb-4 items-center">
                                        <Field
                                            type="email"
                                            name="email"
                                            className="w-full h-10 p-2 px-7 shadow-lg rounded-lg bg-gradient-to-r transition-all ease-in-out delay-100 duration-100  focus-visible:outline-none hover:border-4 hover:border-[#DDB3FF] focus:border-[#DDB3FF] focus:border-4"
                                            placeholder=" Enter your email here."
                                        />
                                        <ErrorMessage name="email" component="div" className="w-4/5 text-red-500 text-xs mt-1" />
                                    </div>
                                </div>

                                <div className="w-1/2">
                                    <p className="text-base mb-2 font-normal">Phone</p>
                                    <div className="mb-4 items-center">
                                        <Field
                                            type="number"
                                            name="number"
                                            className="w-full h-10 p-2 px-10 border shadow-lg rounded-lg bg-gradient-to-r transition-all ease-in-out delay-100 duration-100  focus-visible:outline-none hover:border-4 hover:border-[#DDB3FF] focus:border-[#DDB3FF] focus:border-4"
                                            placeholder=" Enter your contact number here."
                                        />
                                        <ErrorMessage name="email" component="div" className="w-4/5 text-red-500 text-xs mt-1" />
                                    </div>

                                </div>
                            </div>



                            
                            <div className="flex justify-between">
                                <div className="w-1/2 mr-5">
                                    <p className="text-base mb-2 font-normal">Create a password</p>
                                    <div className="mb-4 items-center">
                                        <div className="relative w-full h-10 flex items-center right-1">
                                            <Field
                                                type={showPassword ? "text" : "password"}
                                                name="password"
                                                className="abslolute  w-full h-10 shadow-lg p-3 rounded-lg bg-gradient-to-r transition-all ease-in-out delay-100 duration-100  focus-visible:outline-none hover:border-4 hover:border-[#DDB3FF] focus:border-[#DDB3FF] focus:border-4"
                                                placeholder="Enter your password here."
                                            />
                                            <EyeToggleButton  onClick={togglePasswordVisibility} />
                                        </div>
                                        <ErrorMessage name="password" component="div" className="w-4/5 text-red-500 text-xs mt-1" />
                                    </div>
                                </div>
                                <div className="w-1/2">
                                    <p className="text-base mb-2 font-normal">Confirm password</p>
                                    <div className="mb-4 items-center">
                                        <div className="relative w-full h-10 flex items-center ">
                                        <Field
                                            type={showConfirmPassword ? "text" : "password"}
                                            name="confirmPassword"
                                            className="abslolute  w-full h-10 shadow-lg shadow-slate-300 p-3 rounded-lg bg-gradient-to-r transition-all ease-in-out delay-100 duration-100  focus-visible:outline-none hover:border-4 hover:border-[#DDB3FF] focus:border-[#DDB3FF] focus:border-4"
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
                                    className="w-full px-4 py-3 mb-4 text-white rounded-lg font-PlusJakartaSans font-semibold bg-gradient-to-r bg-[#7C24F0] transition-all ease-in-out delay-50 duration-500         "
                                    
                                >
                                    {isSubmitting? 'Creating...': 'Create account'}
                                </button>

                                <button
                                    type="submit"
                                    className="w-full px-4 py-3 mb-4 rounded-lg font-PlusJakartaSans font-semibold bg-gradient-to-r bg-[#DDB3FF] transition-all ease-in-out delay-50 duration-500         "
                                    
                                >
                                    Signup with Google
                                </button>


                                <div className="flex w-full">
                                    <h1>Already have an account?  </h1>
                                    <NavLink to="/login/tutor">
                                        <h1 className="pl-2 text-sky-700"> Login</h1>
                                    </NavLink>
                                </div>
                                <div className="flex w-full">
                                    <h1>Are you a student?  </h1>
                                    <NavLink to="/register/user">
                                        <h1 className="pl-2 text-sky-700"> Click here</h1>
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

export default RegisterUser