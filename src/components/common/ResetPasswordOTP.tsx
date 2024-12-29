import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { userEndpoint } from "../../constraints/userEndpoints";
import { setCookie } from "../../utils/cookieManager";
import { tutorEndpoint } from "../../constraints/tutorEndpoint";
import { adminEndpoint } from "../../constraints/adminEndpoints";
import Loader from "./icons/loader";
interface OTPInputProps {
  role: string;
}

const ResetPasswordOTP: React.FC<OTPInputProps> = ({ role }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false)
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [otpCount, setOtpCount] = useState<number>(60);
  const [message, setMessage] = useState<string>("");
  const {email,otpId} = location.state;
  console.log(email,otpId, 'email and otp')

  const [otpCountDown, setOtpCountDown] = useState<number>(() => {
    const savedCount = localStorage.getItem("otpCountDown");
    return savedCount ? parseInt(savedCount) : 60;
  });

  // This effect handles the countdown
  useEffect(() => {
    if (otpCountDown > 0) {
      const timerId = setTimeout(() => {
        setOtpCountDown((prev) => prev - 1);
      }, 1000);

      return () => clearTimeout(timerId);
    } else {
      // localStorage.removeItem('otpCountDown');
    }
  }, [otpCountDown]);

  // This effect updates localStorage whenever otpCountDown changes
  useEffect(() => {
    if (otpCountDown > -1) {
      localStorage.setItem("otpCountDown", otpCountDown.toString());
    }
  }, [otpCountDown]);

  const handleChange = (value: string, index: number) => {
    if (value.length === 1 && /^\d$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      setOtpCount((prevCount) => prevCount + 1);
      console.log(otpCount);
      if (index < otp.length - 1) {
        (
          document.getElementById(`otp-input-${index + 1}`) as HTMLInputElement
        ).focus();
      }
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace") {
      if (otp[index] === "") {
        if (index > 0) {
          (
            document.getElementById(
              `otp-input-${index - 1}`
            ) as HTMLInputElement
          ).focus();
        }
      } else {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
        setOtpCount(index);
      }
    }
  };
  const handleSubmit = async () => {
    setIsLoading(true)
    const otpValue = otp.join("");
    if (otpValue.length === 4) {
      const data = {
        email: email,
        enteredOTP: otpValue,
        role: role,
      };

      if (role === "USER") {
        const response = await axios.post(userEndpoint.resetPasswordOTP, data);
        console.log(response);
        const { success, message, userId } = response.data;
        if (!success) {
          setIsLoading(false)
          setMessage(message);
          return
        }
        
        setCookie("userId", userId, 0.1);
        navigate("/login/user/forgot-password/otp/reset-password");
        setIsLoading(false)
      } else if (role === "TUTOR") {
        const response = await axios.post(tutorEndpoint.resetPasswordOTP, data);
        console.log(response);
        const { success, message, tutorId ,tutorData} = response.data;
        if (!success) {
          setIsLoading(false)
          setMessage(message);
          return
        }

        setCookie("tutorId", tutorId, 0.1);
        navigate("/login/tutor/forgot-password/otp/reset-password");
        setIsLoading(false)
      } else if (role === "ADMIN") {
        const response = await axios.post(adminEndpoint.resetPasswordOTP, data);
        console.log(response);
        const { success, message, adminId } = response.data;
        if (!success) {
          setIsLoading(false)
          setMessage(message);
          return
        }
        setIsLoading(false)
        setCookie("adminId", adminId, 0.1);
        navigate("/login/admin/forgot-password/otp/reset-password");
      }

      console.log("Entered OTP:", otpValue);
    } else {
      console.log("invalid OTP");
      setMessage("Invalid OTP")
      setIsLoading(false)
    }
  };

  const handleResend = async () => {
    setIsLoading(true)
    const data = {
      email,
      otpId
    };
    if(role === "TUTOR"){
      const response = await axios.post(tutorEndpoint.resendOtpToEmail, data);
      console.log(response, 'response for resent otp')
      const {message, success} = response.data;
      setMessage(message);
      if(success){
          setOtpCountDown(100);
      }else{
        console.log(message,'not success')
        setMessage(message)
      }
      setIsLoading(false)
    }else if (role === 'USER'){
      const response = await axios.post(userEndpoint.resendOtpToEmail, data);
      console.log(response, 'response for resent otp')
      const {message, success} = response.data;
      setMessage(message);
      if(success){
          setIsLoading(false)
          setOtpCountDown(100);
      }else{
        setIsLoading(false)
        setMessage(message);
        console.log(message,'not success')
      }
    }else if(role==='ADMIN'){

      console.log(data, 'data')
      const response = await axios.post(adminEndpoint.resendOtpToEmail, data);
      console.log(response, 'response for resent otp')
      const {message, success} = response.data;
      setMessage(message);
      if(success){
          setIsLoading(false)
          setOtpCountDown(100);
      }else{
        setIsLoading(false)
        setMessage(message);
        console.log(message,'not success')
      }
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-400 flex items-center justify-center">
      {isLoading && <Loader/>}
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto">
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-4">
          OTP Verification
        </h2>
        <p className="text-gray-600 text-center mb-1">
          An OTP has send to {email}
        </p>
        <p className="text-gray-600 text-center mb-6">
          Enter the OTP sent to your email
        </p>
        {otpCountDown == 0 ? (
          <p className="text-[#7C24F0] text-center text-xs">
            OTP time out try resend otp again.
          </p>
        ) : (
          <p className="text-[#7C24F0] text-center text-xs">{message}</p>
        )}
        <div className="flex justify-center space-x-4">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-input-${index}`}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-12 h-12 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7C24F0] text-2xl"
            />
          ))}
        </div>
        <div className="text-center mb-6">
          {otpCountDown > 0 ? (
            <h1 className="text-xs">{otpCountDown}</h1>
          ) : (
            <button
              className="hover:text-[#7C24F0] text-xs"
              onClick={handleResend}
            >
              {" "}
              ResendOTP{" "}
            </button>
          )}
        </div>
        <button
          onClick={handleSubmit}
          className={`w-full py-2 rounded-lg transition-colors duration-300 ${
            otpCount < 4 || otpCountDown == 0
              ? "bg-gray-400 text-gray-200 cursor-not-allowed"
              : "bg-[#7C24F0] text-white hover:bg-[#7434c7]"
          }`}
          disabled={otpCount < 4 || otpCountDown < 1}
        >
          Verify OTP
        </button>
      </div>
    </div>
  );
};

export default ResetPasswordOTP;
