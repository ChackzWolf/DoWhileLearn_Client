import HeaderNav from "../../Nav/UserHeaderNav";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setTutorLogout, setTutorLogin } from "../../../redux/authSlice/authSlice";
import { getCookie } from "../../../utils/cookieManager";
import { useNavigate } from "react-router-dom";
import HeaderDropdown from "../Supporters/HeaderDropDown";




const Header = () =>{
    const dispatch = useDispatch()
    const navigate = useNavigate()
    // const isLogin = useSelector((state: RootState) => state.userAuth.isTutorLogin);

    useEffect(() => {
        // Function to check authentication status
        const checkAuth = async () => {
            try {
                const token = getCookie('token');
                const refreshToken = getCookie('refreshToken')
                console.log(token)
                if (!token || !refreshToken) {
                    console.log('token is null')
                    dispatch(setTutorLogout())
                    navigate('/tutor/login')
                }else{
                    dispatch(setTutorLogin())
                }
            } catch (error) {
                console.error('Authentication check failed:', error);
                dispatch(setTutorLogout())
                navigate('/tutor/login')
            }
        };

        // checkAuth();
    });


   
    return (
        
          <div className="items-center w-full mx-auto p-3 px-5 shadow-xl shadow-[#7C24F0] bg-slate-50 rounded-b-lg">
                <div className="justify-between flex">
                    <div className="col-span-1 flex">
                        <h1 className="text-2xl font-extrabold text-[#7C24F0]">DoWhile{' { Learn } '}</h1>
                        <h1 className="text-[#7C24F0] font-bold m-2">Tutor</h1>
                        {/* <img src={logo} className="w-20" alt="GeniusGrid Logo" /> */}
                    </div>

                    



                    <div className="justify-end flex">
                        <HeaderNav />
                        
                        <div>
                            <HeaderDropdown/>
                        </div>


                        : 



                    </div>    

                </div>
    
       
          </div>
        
      );
}

export default Header;