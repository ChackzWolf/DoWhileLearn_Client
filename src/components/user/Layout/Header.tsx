import { NavLink } from "react-router-dom";
import HeaderNav from "../../Nav/UserHeaderNav";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store/store";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUserLogout, setUserLogin } from "../../../redux/authSlice/authSlice";
import { getCookie } from "../../../utils/cookieManager";
import HeaderDropdown from "./headerComponents/DropDown";




const Header = () =>{
    const dispatch = useDispatch()
    const isLogin = useSelector((state: RootState) => state.userAuth.isLogin);

    useEffect(() => {
        // Function to check authentication status
        const checkAuth = async () => {
            try {
                const token = getCookie('token');
                const refreshToken = getCookie('refreshToken')
                console.log(token)
                if (!token || !refreshToken) {
                    console.log('token is null')
                    dispatch(setUserLogout())
                }else{
                    dispatch(setUserLogin())
                }
            } catch (error) {
                console.error('Authentication check failed:', error);
                dispatch(setUserLogout())
            }
        };

        checkAuth();
    });


   
    return (
        
          <div className="items-center w-full mx-auto p-3 px-5 shadow-xl shadow-[#7C24F0] bg-slate-50 rounded-b-lg">
                <div className="justify-between flex">
                    <div className="col-span-1">
                        <h1 className="text-2xl font-extrabold text-[#7C24F0]">DoWhile{' { Learn } '}</h1>
                        {/* <img src={logo} className="w-20" alt="GeniusGrid Logo" /> */}
                    </div>

                    



                    <div className="justify-end flex">
                        <HeaderNav />
                        {isLogin ?
                        <div>
                            <HeaderDropdown/>
                        </div>


                        : 
                        <>
                        <NavLink to='/login/user'><button className=" p-1 px-8 hover:scale-105 transition-all" > Login</button></NavLink>
                        <NavLink to='/AuthChoice'><button className="bg-[#7C24F0] text-white font-semibold rounded-lg p-1 px-3 hover:scale-105 transition-all" > Get started</button></NavLink>
                        </>
                                // <div>
                                //     <NavLink to='/register'className="">
                                //         <button className="mr-10 text-">Signup</button>
                                //     </NavLink>

                                //     <NavLink to='/login'className="">
                                //         <button className="">Login</button>
                                //     </NavLink>
                                // </div>
                        }
                    </div>    

                </div>
    
       
          </div>
        
      );
}

export default Header;