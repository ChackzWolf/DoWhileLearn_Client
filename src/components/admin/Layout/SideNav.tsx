import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { data, content } from "../Data/navData";
import { FaBars, FaTimes } from "react-icons/fa";
import { RxDashboard } from "react-icons/rx";
import { ROUTES } from "../../../routes/Routes";

function SideNav() {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const toggleNav = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Hamburger Icon for Mobile */}
      <div className="lg:hidden pt-4 pl-4">
        <FaBars onClick={toggleNav} className="text-2xl cursor-pointer" />
      </div>

      {/* Overlay for mobile when side nav is open */}
      <div
        className={`fixed inset-0 bg-black opacity-50 z-40 lg:hidden transition-opacity duration-300 ${
          isOpen ? "block" : "hidden"
        }`}
        onClick={toggleNav}
      ></div>

      {/* SideNav */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white p-6 transition-transform duration-300 z-50 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:relative lg:w-1/5`} 
      >
        {/* Close Icon for Mobile */}
        <div className="lg:hidden flex justify-end mb-4">
          <FaTimes onClick={toggleNav} className="text-2xl cursor-pointer" />
        </div>

        {/* Main Content */}
        <div
          className={
            location.pathname === "/admin"
              ? "transition-all flex bg-[#7C24F0] text-white text-sm font-semibold w-full rounded-lg"
              : "transition-all flex bg-white  hover:bg-[#7c24f018] text-sm font-semibold w-full rounded-lg"
          }
        >
          <button key="/admin" onClick={()=> {
            setIsOpen(false)
            navigate(ROUTES.admin.dashBoard)
          }} className="flex items-center h-full w-full p-2">
            <RxDashboard className="m-2" />
            Dashboard
          </button>
        </div>

        {/* Data Section */}
        <div className="mt-7">
          <h1 className="text-xs m-3 text-slate-600">Data</h1>
          {data.map((links) => (
            <div
              key={links.path}
              className={
                location.pathname === links.path
                  ? "transition-all flex bg-[#7C24F0] text-white text-center text-sm font-semibold w-full rounded-lg"
                  : "transition-all flex   hover:bg-[#7c24f018] text-center text-sm font-semibold w-full rounded-lg"
              }
            >
              <button onClick={()=> {
                setIsOpen(false)
                navigate(links.path)
              }} className="flex items-center w-full h-full p-2">
                {<links.icon className="mx-3 my-1 text-xl" />}
                {links.name}
              </button>
            </div>
          ))}
        </div>

        {/* Content Section */}
        <div className="mt-7">
          <h1 className="text-xs m-3 text-slate-600">Content</h1>
          {content.map((links) => (
            <div
              key={links.path}
              className={
                location.pathname === links.path
                  ? "transition-all flex bg-[#7C24F0] text-white text-center text-sm font-semibold w-full rounded-lg"
                  : "transition-all flex  hover:bg-[#7c24f018] text-center text-sm font-semibold w-full rounded-lg"
              }
            >
              <button onClick={()=>{
                setIsOpen(false)
                navigate(links.path)
                }} className="flex items-center w-full h-full p-2">
                {<links.icon className="mx-3 my-1 text-xl" />}
                  {links.name}
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default SideNav;
