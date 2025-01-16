import { NavLink } from "react-router-dom";
import HeaderNav from "./headerComponents/Nav/UserHeaderNav";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store/store";
import HeaderDropdown from "./headerComponents/DropDown";
import { ROUTES } from "../../../routes/Routes";



const Header = () => {
    const isLogin = useSelector((state: RootState) => state.userAuth.isLogin);

 


    return (

        <div className="bg-transparent top-0 z-50 items-center w-full mx-auto p-1 ">
            <div className="justify-between flex  items-center">
                <div className="col-span-1 h-full flex items-center">
                    <h1 className="text-2xl font-extrabold text-white flex items-center  px-5">DoWhile{' { Learn } '}</h1>
                </div>



                {/* bg-white rounded-full z-[10] bg-white/40 backdrop-blur-md */}

                <div 
                    className=" relative  justify-end flex px-5  mx-8"
                >
                    <HeaderNav />
                    <div className="flex gap-5 items-center">

                    </div>

                    {isLogin ?
                        <div >
                            <HeaderDropdown />
                        </div>
                        :
                        <div
                            className="flex items-center  ">
                            <NavLink to={ROUTES.user.signin}><button className=" p-1 my-2 pr-8 hover:scale-105 transition-all font-semibold" > Login</button></NavLink>
                            <NavLink to={ROUTES.common.AuthChoice}><button className="bg-[#7C24F0] text-white font-semibold rounded-lg p-1 px-3 mr-3 hover:scale-105 transition-all" > Get started</button></NavLink>
                        </div>

                    }
                </div>

            </div>


        </div>

    );
}

export default Header;