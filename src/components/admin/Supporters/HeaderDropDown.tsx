import React, { useEffect, useRef, useState } from 'react';
import { FaUserCircle } from 'react-icons/fa'; // Import an icon from react-icons (or use an image)
import { removeCookie } from '../../../../src/utils/cookieManager';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../routes/Routes';

const HeaderDropdown: React.FC = () => {
    const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null); // Ref for the dropdown

    const handleLogout = () => {
      removeCookie('adminAccessToken');
      removeCookie('adminRefreshToken');
      removeCookie('adminId');
      navigate(ROUTES.admin.signin);
      setIsOpen(false);
    }

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setIsOpen(false);
      }
  };
    useEffect(() => {
    if (isOpen) {
        document.addEventListener('click', handleClickOutside);
    } else {
        document.removeEventListener('click', handleClickOutside);
    }

    return () => {
        document.removeEventListener('click', handleClickOutside);
    };
}, [isOpen]);

  // const handleNavigate = (path:string)=> {
  //   navigate(path);
  //   setIsOpen(false)
  // }
  
  return (
    <div className="" ref={dropdownRef}>
      <button onClick={toggleDropdown} className="focus:outline-none">
        {/* You can replace the FaUserCircle with an img tag if you're using a custom image */}
        <FaUserCircle size={30} />
      </button>
      {isOpen && (
        <div className={`absolute  right-0 mt-2 w-48 bg-white border rounded shadow-lg z-50 transition-all duration-1000 transform ${
            isOpen ? 'right-1 opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
          }`}>
                          <button  onClick={handleLogout} className="transition-all rounded-b-lg text-left px-4 py-2 hover:bg-[#7c24f04a] cursor-pointer block w-full h-full">Logout</button>

        </div>
      )}
    </div>
  );
};

export default HeaderDropdown;
