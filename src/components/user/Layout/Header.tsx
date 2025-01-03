import { NavLink } from "react-router-dom";
import HeaderNav from "./headerComponents/Nav/UserHeaderNav";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store/store";
import HeaderDropdown from "./headerComponents/DropDown";
import { ROUTES } from "../../../routes/Routes";



const Header = () =>{
    const isLogin = useSelector((state: RootState) => state.userAuth.isLogin);



   
    return (
        
          <div className="sticky top-0 z-50 bg-opacity-30 backdrop-blur-md items-center w-full mx-auto p-1 px-5 shadow-xl shadow-[#7C24F0] rounded-b-lg">
                <div className="justify-between flex  items-center">
                    <div className="col-span-1 h-full flex items-center">
                        <h1 className="text-2xl font-extrabold text-[#7C24F0] flex items-center ">DoWhile{' { Learn } '}</h1>
                        {/* <img src={logo} className="w-20" alt="GeniusGrid Logo" /> */}
                    </div>

                    



                    <div className="justify-end flex">
                        <HeaderNav />
                        <div className="flex gap-5 items-center">
           
                    </div>
                
                    {isLogin ?
                        <div>
                            <HeaderDropdown/>
                        </div>
                     : 
                    <div>
                        <NavLink to={ROUTES.user.signin}><button className=" p-1 my-2 px-8 hover:scale-105 transition-all" > Login</button></NavLink>
                        <NavLink to={ROUTES.common.AuthChoice}><button className="bg-[#7C24F0] text-white font-semibold rounded-lg p-1 px-3 hover:scale-105 transition-all" > Get started</button></NavLink>
                    </div>

                    }
                    </div>    

                </div>
    
       
          </div>
        
      );
}

export default Header;