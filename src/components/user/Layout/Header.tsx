import { NavLink } from "react-router-dom";
import HeaderNav from "../../Nav/UserHeaderNav";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store/store";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUserLogout, setUserLogin } from "../../../redux/userSlice/authSlice";
import { getCookie, removeCookie } from "../../../utils/cookieManager";




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

    const handleLogout = ()=>{
        removeCookie('token');
        removeCookie('refreshToken');
        dispatch(setUserLogout())
    }
   
    return (
        
          <div className="items-center w-full mx-auto p-3 px-5 shadow-xl">
                <div className="justify-between flex">
                    <div className="col-span-1">
                        <h1>DoWhileLearn</h1>
                        {/* <img src={logo} className="w-20" alt="GeniusGrid Logo" /> */}
                    </div>

                    



                    <div className="justify-end flex">
                        <HeaderNav/>
                        {isLogin ?

                                <div>
                                 <button onClick={handleLogout} > Logout</button>
                                </div>
                        : 
                                <div>
                                    <NavLink to='/register'className="">
                                        <button className="mx-5 text-">Signup</button>
                                    </NavLink>

                                    <NavLink to='/login'className="">
                                        <button className="">Login</button>
                                    </NavLink>
                                </div>
                        }
                    </div>    

                </div>
    
       
          </div>
        
      );
}

export default Header;