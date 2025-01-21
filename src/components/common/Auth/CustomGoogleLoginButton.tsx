import { CredentialResponse, useGoogleLogin } from "@react-oauth/google";
import { userEndpoint } from "../../../constraints/userEndpoints";
import axios from "axios";
import { setCookie } from "../../../utils/cookieManager";
import { setUserLogin, setUserProfilePic } from "../../../redux/authSlice/authSlice";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../routes/Routes";
import { toast } from "react-toastify";
import { FaGoogle } from "react-icons/fa6";


const CustomGoogleLoginButton = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [isLoading , setIsLoading] = useState(false);

    const login = useGoogleLogin({
        onSuccess: async (response: any) => {  // Just change this line to use 'any' temporarily
            setIsLoading(true);
            await handleGoogleLogin(response);
        },
        onError: () => {
            toast.error("Google login failed");
            setIsLoading(false);
        },
    });

  const handleGoogleLogin = async (CredentialResponse: CredentialResponse) => {
    const { credential } = CredentialResponse;
    console.log(credential, 'credential')
    try {
      const response = await axios.post(userEndpoint.googleLogin, {
        credential,
      });
      const {success, accessToken, refreshToken, userId, userData} = response.data;
      if (success) {
        setCookie('userAccessToken', JSON.stringify(accessToken),0.1);

        setCookie('userRefreshToken', JSON.stringify(refreshToken),10);


        
        setCookie('userId', userId, 10)
        
        console.log('Login result: id', userId);


        dispatch(setUserLogin())
        console.log(userData, 'this is user data')
        if(userData.profilePicture){
            console.log('setting profile picture to redux:', userData.profilePicture )
            dispatch(setUserProfilePic(userData.profilePicture))
        }
        setIsLoading(false)
        navigate(ROUTES.common.landingPage);
      } else{
        setIsLoading(false)
    }

    } catch (error) {
      toast.error("Google login failed");
      console.log(error, "Error in Google login");
    }
  };


  return (
    <button
      onClick={() => login()}
      className="flex justify-center items-center gap-3 bg-[#f3e9ff] text-primary py-2 px-4 rounded-lg hover:bg-[#f3e9ff] shadow-md w-full h-full"
    >
      <FaGoogle  size={24}/>
      Sign in with Google
    </button>
  );
};

export default CustomGoogleLoginButton;
