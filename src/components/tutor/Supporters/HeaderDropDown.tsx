import React, { useEffect, useRef, useState } from 'react';
import { FaAngleDown, FaUserCircle } from 'react-icons/fa'; // Import an icon from react-icons (or use an image)
import { removeCookie } from '../../../../src/utils/cookieManager';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setTutorDataEmpty } from '../../../redux/tutorSlice/tutorSlice';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store/store';
import { ROUTES } from '../../../routes/Routes';
import { AnimatePresence, motion } from 'framer-motion';
const HeaderDropdown: React.FC = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null); // Ref for the dropdown
  const profilePicture = useSelector((state:RootState)=> state.userAuth.tutorProfilePic)
    
    const handleLogout = () => {
      dispatch(setTutorDataEmpty())
      removeCookie('tutorAccessToken');
      removeCookie('tutorRefreshToken');
      removeCookie('tutorId');
      navigate(ROUTES.tutor.signin); 
    }
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setIsOpen(false);
      }
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
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

  const handleNavigate = (path:string)=> {
    navigate(path);
    setIsOpen(false)
  }
  return (
    <div className="" ref={dropdownRef}>
      <button onClick={toggleDropdown} className="focus:outline-none flex items-center hover:text-[#7C24F0] text-lg gap-2">
        {profilePicture ?
        <>
        <FaAngleDown className={`transform transition-transform duration-300 ${isOpen && 'rotate-180'}`}/>
        <img src={profilePicture} className='h-10 w-10 rounded-full' />
        </>
        :
        <>
        <FaAngleDown className={`transform transition-transform duration-300 ${isOpen && 'rotate-180'}`}/>
        <FaUserCircle size={36} />
        </>
        }
      </button>
      <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -60,x:60, scale: 0 }}  
          animate={{ opacity: 1, y:0,x:0, scale: 1 }}  
          exit={{ opacity: 0, y: -60,x:60, scale: 0 }}  
          transition={{    
              duration: 0.03,
            ease: 'easeOut',      
          }}
         className={`absolute  right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50 transition-all duration-1000 transform ${
            isOpen ? 'right-1 opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
          }`}>
              <button key="/tutor" onClick={()=> handleNavigate(ROUTES.tutor.profile)} className={`transition-all rounded-t-lg text-left px-4 py-2 ${location.pathname === ROUTES.tutor.profile ? 'bg-[#7C24F0] text-white' : 'hover:bg-[#7c24f04a] '} cursor-pointer block w-full h-full"`}>Profile</button>
              <button  onClick={handleLogout} className="transition-all rounded-b-lg text-left px-4 py-2 hover:bg-[#7c24f04a] cursor-pointer block w-full h-full">Logout</button>
        </motion.div>
      )}
        </AnimatePresence>
    </div>
  );
};

export default HeaderDropdown;
