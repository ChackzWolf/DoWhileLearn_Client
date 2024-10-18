import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from 'yup';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import EyeToggleButton from "./icons/eyeToggleButton/eyeToggleButton";
import { getCookie, removeCookie } from "../../utils/cookieManager";
import { userEndpoint } from "../../constraints/userEndpoints";
import { tutorEndpoint } from "../../constraints/tutorEndpoint";
import { adminEndpoint } from "../../constraints/adminEndpoints";


interface ResetPasswordProps{
    role:string;
}
const ResetPassword:React.FC<ResetPasswordProps> = ({role}) =>{
    
    const navigate = useNavigate();
    const [message,setMessage] = useState('')
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
        password: '',
        confirmPassword:''
    };


    const handleSubmit = async (value: typeof initialValues, {setSubmitting}: { setSubmitting: (isSubmiting: boolean)=> void} ) => {
        try{
            if(role==='USER'){
                const userId = getCookie('userId');
                const data = {
                    userId:userId,
                    password:value.password,
                }
                console.log(data,'data from handle submit');
                const response = await axios.post(userEndpoint.updatePassword, data)
                const {message,success} = response.data;
                if(!success){
                    setMessage(message)
                    return;
                }
                removeCookie('userId');
                navigate(`/login/user?message=passwordUpdated`)
            }else if(role === 'TUTOR'){
                const tutorId = getCookie('tutorId');
                const data = {
                    tutorId:tutorId,
                    password:value.password,
                }
                console.log(data,'data from handle submit');
                const response = await axios.post(tutorEndpoint.updatePassword, data)
                const {message,success} = response.data;
                if(!success){
                    setMessage(message)
                    return;
                }
                removeCookie('tutorId');
                navigate(`/login/tutor?message=passwordUpdated`)
            }else if(role === 'ADMIN'){
                const adminId = getCookie('adminId');
                const data = {
                    adminId:adminId,
                    password:value.password,
                }
                console.log(data,'data from handle submit');
                const response = await axios.post(adminEndpoint.updatePassword, data)
                const {message,success} = response.data;
                console.log(response.data,'data')
                if(!success){
                    setMessage(message)
                    return;
                }
                removeCookie('adminId');
                navigate(`/login/admin?message=passwordUpdated`)
            }


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
                
                <h2 className="text-3xl mb-5 mt-20 text-center font-bold">Create new password</h2>
                { message?  <h2 className="text-center text-[#FF0000]">{message}</h2> : <h1></h1>}


                <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                    {({isSubmitting})=>(

                    
                    <Form>
                        <div className="flex flex-col justify-center mb-20 px-28 h-full">
                            
                            <div className="flex flex-col justify-between items-center h-full">
                                <div className="w-full">
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
                                <div className="w-full">
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
                                    {isSubmitting? 'Creating...': 'Create password'}
                                </button>

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

export default ResetPassword