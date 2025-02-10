import { NavLink, useNavigate } from "react-router-dom";
import HeaderNav from "./headerComponents/Nav/UserHeaderNav";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store/store";
import HeaderDropdown from "./headerComponents/DropDown";
import { ROUTES } from "../../../routes/Routes";



const Header = () => {
    const isLogin = useSelector((state: RootState) => state.userAuth.isLogin);
    const navigate = useNavigate()
 


    return (

        <div className="bg-transparent top-0 z-50 items-center w-full mx-auto p-1 ">
            <div className="justify-between flex  items-center">
                <button className="col-span-1 h-6 w-auto flex items-center justify-center md:gap-4 lg:gap-4 gap-2 md:mx-4 lg:mx-4 mx-1" onClick={()=>navigate('/')}>
                    <img src="/logos/brainWhite.svg" alt="Brain Bright Icon" className="h-8 w-auto mt-2" />
                    <h1 className="flex md:text-2xl lg:2xl font-extrabold text-accent">DoWhile{' { Learn } '}</h1>
                </button>



                {/* bg-white rounded-full z-[10] bg-white/40 backdrop-blur-md */}

                <div 
                    className=" relative  justify-end flex md:px-5 lg:px-5  md:mx-8 lg:mx-8"
                >
                    <HeaderNav />

                    {isLogin ?
                        <div >
                            <HeaderDropdown />
                        </div>
                        :
                        <div
                            className="flex items-center  ">
                            <NavLink to={ROUTES.user.signin}><button className="hidden sm:block md:p-1 my-2 md:pr-8 text-accent hover:scale-105 transition-all font-semibold" > Login</button></NavLink>
                            <NavLink to={ROUTES.common.AuthChoice}><button className="bg-accent  text-primary font-semibold md:text-base text-xs rounded-lg p-1 md:px-3 md:mr-3 hover:scale-105 transition-all" > Get started</button></NavLink>
                        </div>

                    }
                </div>

            </div>


        </div>

    );
}

export default Header;