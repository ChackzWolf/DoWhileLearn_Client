import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { data, content } from "../data/navData";
import { FaBars, FaTimes } from "react-icons/fa";
import { RxDashboard } from "react-icons/rx";
import { ROUTES } from "../../../routes/Routes";

function SideNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState(ROUTES.tutor.dashBoard);
  const location = useLocation();
  const navigate = useNavigate();
  console.log(location, 'this is loc')

  useEffect(()=>setCurrentPath(location.pathname))
  const toggleNav = () => {
    setIsOpen(!isOpen);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <>
      {/* Hamburger Icon for Mobile */}
      <div className="md:hidden pl-4 pt-4">
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
        className={`fixed top-0 left-0 h-full bg-accent p-6 transition-transform duration-300 z-50 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:sticky  fixed`}
      >
        <div className="sticky h-full">
          {/* Close Icon for Mobile */}
          <div className="lg:hidden flex justify-end mb-4">
            <FaTimes onClick={toggleNav} className="text-2xl cursor-pointer" />
          </div>

          {/* Main Content */}
          <div
            className={
              currentPath === "/tutor"
                ? "flex transition-all bg-[#7C24F0] text-white text-sm font-semibold w-full rounded-lg "
                : "flex transition-all bg-accent hover:bg-[#7c24f018]  text-sm font-semibold w-full rounded-lg "
            }
          >
            <button
              key="/tutor"
              onClick={() => {
                setIsOpen(false)
                handleNavigate(ROUTES.tutor.dashBoard)
              }}
              className="flex items-center h-full w-full p-2 "
            >
              <RxDashboard className="m-2" />
              DashBoard
            </button>
          </div>

          <div className="mt-7">
            <h1 className="text-xs m-3 text-slate-600">Data</h1>
            {data.map((links) => (
              <div
                key={links.path}
                className={
                  currentPath === links.path
                    ? "flex transition-all bg-[#7C24F0]  text-white text-center text-sm font-semibold w-full rounded-lg"
                    : "flex transition-all hover:bg-[#7c24f018] text-center text-sm font-semibold w-full rounded-lg"
                }
              >
                <button
                  onClick={() => {
                    setIsOpen(false)
                    handleNavigate(links.path)
                  }}
                  className="flex items-center w-full h-full p-2"
                >
                  {<links.icon className="mx-3 my-1 text-xl" />}
                  {links.name}
                </button>
              </div>
            ))}
          </div>

          <div className="mt-7">
            <h1 className="text-xs m-3 text-slate-600">Content</h1>
            {content.map((links) => (
              <div
                key={links.path}
                className={
                  currentPath === links.path
                    ? "flex transition-all bg-[#7C24F0] text-white text-center text-sm font-semibold w-full rounded-lg"
                    : "flex transition-all hover:bg-[#7c24f018] text-center text-sm font-semibold w-full rounded-lg"
                }
              >
                <button
                  onClick={() => {
                    setIsOpen(false);
                    handleNavigate(links.path)}}
                  className="flex items-center w-full h-full p-2"
                >
                  {<links.icon className="mx-3 my-1 text-xl" />}
                  {links.name}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default SideNav;
