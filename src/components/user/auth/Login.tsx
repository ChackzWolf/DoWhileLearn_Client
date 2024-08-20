import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from 'yup';
import { NavLink } from "react-router-dom";
import Header from "../Layout/Header"

function LoginModal() {

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
    const initialEmail = {
        email: '',
        password:''
    };

    return (
        <>
            <Header/>
            <div className="flex h-screen">
                

                <div className="w-1/2  bg-purple-700"> 

                </div>



                <div className="bg-[#FCF6FF] p-16 shadow-lg w-1/2 rouder-lg justify-center">

                    <h2 className="text-3xl mb-5 mt-20 text-center font-bold">Login to your account</h2>


                    <Formik initialValues={initialEmail} validationSchema={validationSchema} onSubmit={()=>{}}>

                    {({isSubmitting})=>(


                        <Form>
                            <div className="justify-center mb-20 px-28">


                                <p className="text-base mb-4 font-normal">Email</p>
                                <div className="mb-4  fex-col items-center">
                                    <Field
                                        type="email"
                                        name="email"
                                        className="w-full h-10 p-2 px-4 border border-gray-500 rounded-lg bg-gradient-to-r transition-all ease-in-out delay-100 duration-100  focus-visible:outline-none hover:border-4 hover:border-[#DDB3FF] focus:border-[#DDB3FF] focus:border-4"
                                        placeholder=" Enter your email here."
                                    />
                                    <ErrorMessage name="email" component="div" className="w-4/5 text-red-500 text-xs mt-1" />
                                </div>
                                <div className="flex w-full justify-between">
                                    <p className="text-base mb-4 font-normal">Password</p>
                                    <p className="text-base mb-4 font-normal justify-end text-sky-700">Forgot ?</p>
                                </div>

                                <div className="justify-center mb-6 ">
                                    <Field
                                        type="password"
                                        name="password"
                                        className="w-full h-10 p-2 px-4 border border-gray-500 rounded-lg bg-gradient-to-r transition-all ease-in-out delay-100 duration-100  focus-visible:outline-none hover:border-4 hover:border-[#DDB3FF] focus:border-[#DDB3FF] focus:border-4"
                                        placeholder="Enter your password here."
                                    />
                                    <ErrorMessage name="password" component="div" className="w-4/5 text-red-500 text-xs mt-1" />
                                </div>


                                <div className="justify-center mb-6 ">
                                    <button
                                        type="submit"
                                        className="w-full px-4 py-3 mb-4 text-white rounded-lg font-PlusJakartaSans font-semibold bg-gradient-to-r bg-[#7C24F0] transition-all ease-in-out delay-50 duration-500         "
                                        disabled={isSubmitting}
                                    >

                                        Login now
                                        {/* {isSubmitting ? 'Submitting...' : 'Continue'} */}
                                    </button>

                                    <button
                                        type="submit"
                                        className="w-full px-4 py-3 mb-4 rounded-lg font-PlusJakartaSans font-semibold bg-gradient-to-r bg-[#DDB3FF] transition-all ease-in-out delay-50 duration-500         "
                                
                                    >

                                        Login with Google
                                        {/* {isSubmitting ? 'Submitting...' : 'Continue'} */}
                                    </button>


                                    <div className="flex w-full">
                                        <h1>Don't have an account?  </h1>
                                        <NavLink to="/register">
                                            <a className="pl-2 text-sky-700"> Signup</a>
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