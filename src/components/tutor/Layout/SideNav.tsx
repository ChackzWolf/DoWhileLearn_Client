import { useState } from "react";
import { NavLink } from "react-router-dom";
import { data, content } from "../data/navData";
import { FaBars, FaTimes } from "react-icons/fa";
import { RxDashboard } from "react-icons/rx";

function SideNav({ prop }: { prop: string }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleNav = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Hamburger Icon for Mobile */}
      <div className="lg:hidden p-4">
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
        } lg:translate-x-0 lg:relative lg:w-2/12`}
      >
        {/* Close Icon for Mobile */}
        <div className="lg:hidden flex justify-end mb-4">
          <FaTimes onClick={toggleNav} className="text-2xl cursor-pointer" />
        </div>

        {/* Main Content */}
        <div
          className={
            prop === "/tutor"
              ? "flex bg-[#7C24F0] p-2  text-white text-sm font-semibold w-full rounded-lg"
              : "flex bg-white p-2  text-sm font-semibold w-full rounded-lg"
          }
        >
          <NavLink key="/tutor" to="/tutor" className="flex items-center">
          <RxDashboard className="m-2" />
            DashBoard
          </NavLink>
        </div>

        <div className="mt-7">
          <h1 className="text-xs m-3 text-slate-600">Data</h1>
          {data.map((links) => (
            <div
              key={links.path}
              className={
                prop === links.path
                  ? "flex bg-[#7C24F0] p-2 text-white text-center text-sm font-semibold w-full rounded-lg"
                  : "flex p-2 text-center text-sm font-semibold w-full rounded-lg"
              }
            >
              <NavLink to={links.path} className="flex items-center">
                {<links.icon className="mx-3 my-1 text-xl"/>}
                {links.name}
            </NavLink>
            </div>
          ))}
        </div>

        <div className="mt-7">
          <h1 className="text-xs m-3 text-slate-600">Content</h1>
          {content.map((links) => (
            <div
              key={links.path}
              className={
                prop === links.path
                  ? "flex bg-[#7C24F0] p-2 text-white text-center text-sm font-semibold w-full rounded-lg"
                  : "flex p-2 text-center text-sm font-semibold w-full rounded-lg"
              }
            >
              <NavLink to={links.path} className="flex items-center">
                {<links.icon className="mx-3 my-1 text-xl"/>}
                {links.name}
                </NavLink>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default SideNav;