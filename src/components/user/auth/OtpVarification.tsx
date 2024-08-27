
import { useLocation } from 'react-router-dom'
import OTPInput from '../../common/otpInput';

function OtpVarification() {
    const location = useLocation();
    const {email,tempId} = location.state;




    return (
      <div className=' flex items-center justify-center bg-[#7C24F0] w-screen h-screen'>
        <OTPInput tempId={tempId} email ={email}/>
      </div>
    )
}

export default OtpVarification