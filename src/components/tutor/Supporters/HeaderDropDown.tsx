import React, { useState } from 'react';
import { FaUserCircle } from 'react-icons/fa'; // Import an icon from react-icons (or use an image)
import { removeCookie } from '../../../../src/utils/cookieManager';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setTutorDataEmpty } from '../../../redux/tutorSlice/tutorSlice';
import { NavLink } from 'react-router-dom';

const HeaderDropdown: React.FC = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
  const [isOpen, setIsOpen] = useState(false);
    
    const handleLogout = () => {
      dispatch(setTutorDataEmpty())
      removeCookie('tutorAccessToken');
      removeCookie('tutorRefreshToken');
      removeCookie('tutorId');
      navigate('/login/tutor') 
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
            <div className='w-full py-2'>
              <NavLink key="/tutor" to="/tutor/profile" className="px-4 py-2 hover:bg-gray-100 cursor-pointer block">Profile</NavLink>
            </div>

          <ul>
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={handleLogout}>Logout</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default HeaderDropdown;
