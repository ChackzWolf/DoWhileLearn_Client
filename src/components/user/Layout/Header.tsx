import { NavLink } from "react-router-dom";
import HeaderNav from "../../Nav/UserHeaderNav";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store/store";
NavLink

const Header = () =>{
    const isLogin = useSelector((state: RootState) => state.userAuth.isLogin);

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