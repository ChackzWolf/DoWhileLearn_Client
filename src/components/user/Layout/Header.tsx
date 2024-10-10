import { NavLink } from "react-router-dom";
import HeaderNav from "./headerComponents/Nav/UserHeaderNav";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store/store";
import HeaderDropdown from "./headerComponents/DropDown";



const Header = () =>{
    const isLogin = useSelector((state: RootState) => state.userAuth.isLogin);



   
    return (
        
          <div className="items-center w-full mx-auto p-3 px-5 shadow-xl shadow-[#7C24F0] bg-slate-50 rounded-b-lg">
                <div className="justify-between flex">
                    <div className="col-span-1">
                        <h1 className="text-2xl font-extrabold text-[#7C24F0]">DoWhile{' { Learn } '}</h1>
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