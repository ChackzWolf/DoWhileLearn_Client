import React, { useState } from 'react';
import { FaUserCircle } from 'react-icons/fa'; // Import an icon from react-icons (or use an image)
import { removeCookie } from '../../../../src/utils/cookieManager';
import { useNavigate } from 'react-router-dom';

const HeaderDropdown: React.FC = () => {
    const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false);
    
    const handleLogout = () => {
      removeCookie('accessToken');
      removeCookie('refreshToken');
      removeCookie('userId');
      console.log(3)
      navigate('/login/admin') 
    }

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="">
      <button onClick={toggleDropdown} className="focus:outline-none">
        {/* You can replace the FaUserCircle with an img tag if you're using a custom image */}
        <FaUserCircle size={30} />
      </button>
      {isOpen && (
        <div className={`absolute  right-0 mt-2 w-48 bg-white border rounded shadow-lg z-50 transition-all duration-1000 transform ${
            isOpen ? 'right-1 opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
          }`}>
          <ul>

            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={handleLogout}>Logout</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default HeaderDropdown;
