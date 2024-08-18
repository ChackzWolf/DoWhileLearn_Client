import userEndpoints from "../../../constraints/endpoints/userEndpoints";
import { NavLink } from "react-router-dom"



const Header = () =>{
    return (
        <>
          <div className="items-center w-full mx-auto p-3 px-5 shadow-sm">
            <div className="grid grid-cols-3">
              <div className="col-span-1">
                <h1>DoWhileLearn</h1>
                {/* <img src={logo} className="w-20" alt="GeniusGrid Logo" /> */}
              </div>
    
              <div className="col-span-1 flex justify-center items-center font-mono">
                {/* Desktop Navigation */}
    
                <ul className="hidden md:flex">
                  <NavLink
                    to={userEndpoints.home}
                    className={( isActive ) =>
                      `p-3 hover:font-medium font-poppins m-1 cursor-pointer hover:text-black ${isActive ? 'text-blue-500 font-bold' : ''}`
                    }
                  >
                    Home
                  </NavLink>

                  <NavLink
                    to={userEndpoints.home}
                    className={( isActive ) =>
                      `p-3 hover:font-medium font-poppins m-1 cursor-pointer hover:text-black ${isActive ? 'text-blue-500 font-bold' : ''}`
                    }
                  >
                    Signin
                  </NavLink>


                  <NavLink
                    to={userEndpoints.home}
                    className={( isActive ) =>
                      `p-3 hover:font-medium font-poppins m-1 cursor-pointer hover:text-black ${isActive ? 'text-blue-500 font-bold' : ''}`
                    }
                  >
                    Signup
                  </NavLink>
         
                 

                </ul>
              </div>    
        
            </div>
    
       
          </div>
        </>
      );
}

export default Header;