import { NavLink } from "react-router-dom";
import HeaderNav from "../../Nav/UserHeaderNav";

NavLink

const Header = () =>{
    return (
        
          <div className="items-center w-full mx-auto p-3 px-5 shadow-xl">
                <div className="justify-between flex">
                    <div className="col-span-1">
                        <h1>DoWhileLearn</h1>
                        {/* <img src={logo} className="w-20" alt="GeniusGrid Logo" /> */}
                    </div>

                    



                    <div className="justify-end flex">
                        <HeaderNav/>
                        <div>
                            <NavLink to='/register'className="">
                                <button className="mx-5 text-">Signup</button>
                            </NavLink>

                            <NavLink to='/login'className="">
                                <button className="">Login</button>
                            </NavLink>
                        </div>

                    </div>    

                </div>
    
       
          </div>
        
      );
}

export default Header;