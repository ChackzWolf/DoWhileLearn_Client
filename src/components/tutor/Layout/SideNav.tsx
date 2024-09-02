import { NavLink } from "react-router-dom"
import { data, content } from "../data/navData"
function SideNav({prop}:{prop:string}) {

  return (
    <div className="justify-start h-screen w-2/12 bg-white rounded-md">

        <div className={prop == '/tutor'?
         "justify-center flex bg-[#7C24F0] p-2 text-center text-white text-sm font-semibold w-full rounded-lg":
         "justify-center flex bg-white p-2 text-center text-sm font-semibold w-full rounded-lg"
       }>
            <NavLink key='/tutor' to='/tutor'> DashBoard </NavLink>
        </div>

        <div className="mt-7">
            <h1 className="text-xs m-3 text-slate-600"> Data </h1>
            {
                data.map((links)=>(
                    <div className={prop == links.path ?
                        "justify-center flex bg-[#7C24F0] p-2 text-white text-center text-sm font-semibold w-full rounded-lg":
                        "justify-center flex  p-2 text-center text-sm font-semibold w-full rounded-lg"
                        }>
                        <NavLink key={links.path} to={links.path}>{links.name}</NavLink>
                    </div>
                ))
            }

        </div>
        <div className="mt-7">
            <h1 className="text-xs m-3 text-slate-600"> Content </h1>
            {
                content.map((links)=>(
                    <div className={prop == links.path ?
                        "justify-center flex bg-[#7C24F0] p-2 text-white text-center text-sm font-semibold w-full rounded-lg":
                        "justify-center flex  p-2 text-center text-sm font-semibold w-full rounded-lg"
                        }>
                        <NavLink key={links.path} to={links.path}>{links.name}</NavLink>
                    </div>
                ))
            }

        </div>
    </div>
  )
}

export default SideNav