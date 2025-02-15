import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from 'yup';
import axios from "axios";
import { NavLink } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import EyeToggleButton from "../../common/icons/eyeToggleButton/eyeToggleButton";
import { tutorEndpoint } from "../../../constraints/tutorEndpoint";
import Loader from "../../common/icons/loader";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setTutorData } from "../../../redux/tutorSlice/tutorSlice";
import { ROUTES } from "../../../routes/Routes";
import OAuth from "../../common/Auth/CustomGoogleLoginButton";



function RegisterTutor() {
    
    const navigate = useNavigate();
    const location = useLocation()
    const dispatch = useDispatch()
    const [isLoading,setIsLoading] = useState(false);
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
        phoneNumber:'',
        password: '',
        confirmPassword:''
    };
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const message = queryParams.get('message');
    
        if (message === 'registrationTimeOut') {
          toast.error('Regestration session has been expired. Try registering again.');
        }else if(message === 'passwordUpdated'){
          toast.success('Your password has been updated. Please login with your new password.')
        }
      }, [location]);

      const handleSubmit = async (
        values: typeof initialValues, 
        { setSubmitting, setErrors }: { 
            setSubmitting: (isSubmitting: boolean) => void,
            setErrors: (errors: Record<string, string>) => void 
        }
    ) => {
        console.log('Submit handler called with values:', values);
        setIsLoading(true);
        
        try {
            const response = await axios.post(tutorEndpoint.register, values);
            console.log('API Response:', response);
            
            localStorage.removeItem('otpCountDown');
            
            if (response.data.success) {
                dispatch(setTutorData(response.data.tutorData));
                navigate(ROUTES.tutor.signupOTP, { state: response.data });
                console.log('Registration successful');
            } else {
                setEmailExists(true);
                setErrors({ email: 'Email already exists' });
                console.log('Registration failed:', response.data);
            }
        } catch (err) {
            console.error('Registration error:', err);
            toast.error('Registration failed. Please try again.');
            // Set form-level error
            setErrors({ submit: 'Registration failed. Please try again.' });
        } finally {
            setIsLoading(false);
            setSubmitting(false);
        }
    };



    return (
        <>
        {isLoading && <Loader/>}
        <div className="flex bg-gradient-to-br from-purple-500 to-lavender-start via-primary to-purple-to-lavender-end  h-screen">


            <div className="w-1/2">

            </div>



            <div className="w-1/2 justify-center">
                
                <h2 className="text-3xl mb-5 mt-20 text-center font-bold text-accent">Tutor Signup</h2>
                { emailExists?  <h2 className="text-center text-[#FF0000]">Email already exists.</h2> : <h1></h1>}


                <Formik initialValues={initialValues} 
                        validationSchema={validationSchema} 
                        onSubmit={handleSubmit}>
                        {({isSubmitting, errors, touched, values})=>(

                    
                    <Form noValidate>
                        <div className="justify-center mb-20 px-28">

                            <div className="flex justify-between">
                                <div className="w-1/2 mr-6">
                                    <p className="text-base mb-2 font-normal text-accent">First-name</p>
                                    <div className="mb-4 items-center">
                                        <Field
                                            type="name"
                                            name="firstName"
                                            className="w-full h-10 p-2 px-7 shadow-lg rounded-lg  transition-all ease-in-out delay-100 duration-100  focus-visible:outline-none hover:border-4 hover:border-[#DDB3FF] focus:border-[#DDB3FF] focus:border-4"
                                            placeholder=" Enter your first-name here."
                                        />
                                        <ErrorMessage name="firstName" component="div" className="w-4/5 text-red-500 text-xs mt-1" />
                                    </div>
                                </div>
                                <div className="w-1/2 ">
                                    <p className="text-base mb-2 font-normal text-accent">Last-name</p>
                                    <div className="mb-4 items-center">
                                        <Field
                                            type="name"
                                            name="lastName"
                                            className="w-full h-10 p-2 px-10 border shadow-lg rounded-lg  transition-all ease-in-out delay-100 duration-100  focus-visible:outline-none hover:border-4 hover:border-[#DDB3FF] focus:border-[#DDB3FF] focus:border-4"
                                            placeholder=" Enter your last-name here."
                                        />
                                        <ErrorMessage name="lastName" component="div" className="w-4/5 text-red-500 text-xs mt-1" />
                                    </div>
                                </div>

                            </div>
                            <div className="flex justify-between">
                                <div className="w-1/2 mr-6">
                                    <p className="text-base mb-2 font-normal text-accent">Email</p>
                                    <div className="mb-4 items-center">
                                        <Field
                                            type="email"
                                            name="email"
                                            className="w-full h-10 p-2 px-7 shadow-lg rounded-lg  transition-all ease-in-out delay-100 duration-100  focus-visible:outline-none hover:border-4 hover:border-[#DDB3FF] focus:border-[#DDB3FF] focus:border-4"
                                            placeholder=" Enter your email here."
                                        />
                                        <ErrorMessage name="email" component="div" className="w-4/5 text-red-500 text-xs mt-1" />
                                    </div>
                                </div>

                                <div className="w-1/2">
                                    <p className="text-base mb-2 font-normal text-accent">Phone</p>
                                    <div className="mb-4 items-center">
                                        <Field
                                            type="number"
                                            name="phoneNumber"
                                            className="w-full h-10 p-2 px-10 border shadow-lg rounded-lg  transition-all ease-in-out delay-100 duration-100  focus-visible:outline-none hover:border-4 hover:border-[#DDB3FF] focus:border-[#DDB3FF] focus:border-4"
                                            placeholder=" Enter your contact number here."
                                        />
                                        <ErrorMessage name="phoneNumber" component="div" className="w-4/5 text-red-500 text-xs mt-1" />

                                    </div>

                                </div>
                            </div>



                            
                            <div className="flex justify-between">
                                <div className="w-1/2 mr-5">
                                    <p className="text-base mb-2 font-normal text-accent">Create a password</p>
                                    <div className="mb-4 items-center">
                                        <div className="relative w-full h-10 flex items-center right-1">
                                            <Field
                                                type={showPassword ? "text" : "password"}
                                                name="password"
                                                className="abslolute  w-full h-10 shadow-lg p-3 rounded-lg  transition-all ease-in-out delay-100 duration-100  focus-visible:outline-none hover:border-4 hover:border-[#DDB3FF] focus:border-[#DDB3FF] focus:border-4"
                                                placeholder="Enter your password here."
                                            />
                                            <EyeToggleButton  onClick={togglePasswordVisibility} />
                                        </div>
                                        <ErrorMessage name="password" component="div" className="w-4/5 text-red-500 text-xs mt-1" />
                                    </div>
                                </div>
                                <div className="w-1/2">
                                    <p className="text-base mb-2 font-normal text-accent">Confirm password</p>
                                    <div className="mb-4 items-center">
                                        <div className="relative w-full h-10 flex items-center ">
                                        <Field
                                            type={showConfirmPassword ? "text" : "password"}
                                            name="confirmPassword"
                                            className="abslolute  w-full h-10 shadow-lg shadow-slate-300 p-3 rounded-lg  transition-all ease-in-out delay-100 duration-100  focus-visible:outline-none hover:border-4 hover:border-[#DDB3FF] focus:border-[#DDB3FF] focus:border-4"
                                            placeholder="Enter your password here."
                                        />
                                        <EyeToggleButton  onClick={toggleConfirmPasswordVisibility} />
                                        
                                         </div>
                                     

                                        <ErrorMessage name="confirmPassword" component="div" className="w-4/5 text-red-500 text-xs mt-1" />

                                    </div>
                                </div>

                            </div>


                            <div className="justify-center mb-6 ">
                            <div style={{ display: 'none' }}>
                                <pre>{JSON.stringify({ values, errors, touched }, null, 2)}</pre>
                            </div>
                                <button
                                    type="submit"
                                    className="w-full px-4 py-3 mb-4 text-accent rounded-lg font-PlusJakartaSans font-semibold  bg-[#7C24F0] transition-all ease-in-out delay-50 duration-500         "
                                    
                                >
                                    {isSubmitting? 'Creating...': 'Create account'}
                                </button>

                                <OAuth role="TUTOR"/>


                                <div className="flex w-full text-accent">
                                    <h1>Already have an account?  </h1>
                                    <NavLink to="/tutor/auth/login">
                                        <h1 className="pl-2 text-accent text-sm underline"> Login</h1>
                                    </NavLink>
                                </div>
                                <div className="flex w-full text-accent">
                                    <h1>Are you a student?  </h1>
                                    <NavLink to={ROUTES.user.signin}>
                                        <h1 className="pl-2 text-accent text-sm underline">Click here</h1>
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

export default RegisterTutor