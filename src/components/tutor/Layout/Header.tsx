// import { useEffect } from "react";
// import { useDispatch } from "react-redux";
// import { setTutorLogout, setTutorLogin } from "../../../redux/authSlice/authSlice";
// import { getCookie } from "../../../utils/cookieManager";
// import { useNavigate } from "react-router-dom";
import HeaderDropdown from "../Supporters/HeaderDropDown";




const Header = () =>{

   
    return (
        
          <div className="items-center w-full mx-auto p-3 px-5  bg-slate-50 rounded-b-lg">
                <div className="justify-between flex">
                    <a href="/tutor">
                    <div className="col-span-1 flex gap-2">
                        <img src="/logos/brainPurple.svg" alt="Brain Bright Icon" className="h-8 w-auto mt-1" />
                        <h1 className="text-2xl font-extrabold text-[#7C24F0]">DoWhile{' { Learn } '}</h1>
                        <h1 className="text-[#7C24F0] font-bold my-2">Tutor</h1>
                    </div>
                    </a>
                    <div className="justify-end flex">
                        <div>
                            <HeaderDropdown/>
                        </div>
                    </div>    
                </div>
          </div>
        
      );
}

export default Header;