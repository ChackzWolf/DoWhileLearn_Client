import React, { useState } from 'react';
import { userEndpoint } from '../constraints/userEndpoints';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface OTPInputProps{
    tempId:string;
    email:string
}


const OTPInput: React.FC<OTPInputProps> = ({tempId,email}) => {


    const navigate = useNavigate()
  const [otp, setOtp] = useState(['', '', '', '']);
  const [otpCount, setOtpCount] = useState<number>(0)

  const handleChange = (value: string, index: number) => {
    if (value.length === 1 && /^\d$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      setOtpCount(prevCount => prevCount + 1);
        console.log(otpCount)
      if (index < otp.length - 1) {
        (document.getElementById(`otp-input-${index + 1}`) as HTMLInputElement).focus();
      }
    }
  };
  

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      if (otp[index] === '') {
        if (index > 0) {
          (document.getElementById(`otp-input-${index - 1}`) as HTMLInputElement).focus();
        }
      } else {
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
        setOtpCount(index)
      }
    }
  };

  const handleSubmit = async() => {
    const otpValue = otp.join('');
    if(otpValue.length === 4){
        const data = {
            enteredOTP : otpValue,
            email,
            tempId
        }

        const response =await axios.post(userEndpoint.verifyOTP, data); 
        if(response.data.success){

            console.log('sucess', response.data);

            // Example of storing the token in localStorage
            localStorage.setItem('token', response.data.token);

            // Example of setting the token in an Authorization header for API requests
            fetch('your-api-endpoint', {
                headers: {
                    'Authorization': `Bearer ${response.data.token}`
                }
            });
            // navigate('/');
        }else{
            console.log('failed response')
        }

        console.log('Entered OTP:', otpValue);
        // Add your OTP verification logic here
    }else{
        console.log('invalid OTP')
    }

  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800 text-center mb-4">OTP Verification</h2>
      <p className="text-gray-600 text-center mb-1">An OTP has send to {email}</p>
      <p className="text-gray-600 text-center mb-6">Enter the OTP sent to your email</p>
      <div className="flex justify-center space-x-4 mb-6">
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
      <button
  onClick={handleSubmit}
  className={`w-full py-2 rounded-lg transition-colors duration-300 ${
    otpCount < 4
      ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
      : 'bg-[#7C24F0] text-white hover:bg-[#7434c7]'
  }`}
  disabled={otpCount < 4}
>
  Verify OTP
</button>
    </div>
  );
};

export default OTPInput;
