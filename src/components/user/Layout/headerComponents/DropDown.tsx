import React, { useState, useEffect, useRef } from 'react';
import { FaRegHeart, FaUserCircle } from 'react-icons/fa'; // Import an icon from react-icons (or use an image)
import { useDispatch } from 'react-redux';
import { setUserLogout } from '../../../../redux/authSlice/authSlice';
import { getCookie, removeCookie } from '../../../../utils/cookieManager';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { authEndpoint } from '../../../../constraints/authEndpoint';
import { RiAccountBoxLine } from "react-icons/ri";
import { CiLogout } from "react-icons/ci";
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store/store';
import { ROUTES } from '../../../../routes/Routes';
import { FaAngleDown } from 'react-icons/fa6';
import {AnimatePresence, motion} from 'framer-motion'


const HeaderDropdown: React.FC = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const profilePicture = useSelector((state:RootState)=> state.userAuth.userProfilePic)
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null); // Reference to dropdown container

    // Handle logout logic
    const handleLogout = async () => {
        const response = await axios.post(authEndpoint.clearUserCookies)
        if(response.data.success){
            console.log(response)
            removeCookie('userAccessToken')
            removeCookie('userRefreshToken');
            removeCookie('userId');
            dispatch(setUserLogout())
            if(!getCookie('userAccessToken') && !getCookie('userRefreshToken') && !getCookie('userId')) dispatch(setUserLogout());
            navigate(ROUTES.common.landingPage)
        }
    };

    // Toggle dropdown open/close
    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false); // Close the dropdown
            }
        };

        // Add the event listener when the dropdown is open
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        // Clean up the event listener when the component unmounts
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const toWishList =() => {
        navigate(ROUTES.user.wishlist)
    }
    const toProfile =()=> {
        navigate(ROUTES.user.profile);
    }
    return (
        <div className="relative" ref={dropdownRef}>
            <button onClick={toggleDropdown} className="focus:outline-none flex gap-1 py-1 items-center">
                {/* You can replace the FaUserCircle with an img tag if you're using a custom image */}
                {profilePicture? 
                <div className='transition-all rounded-full hover:bg-opacity-65 p-1    hover:backdrop-blur-sm '>
                    {/* <FaAngleDown className={`transform transition-transform duration-300 ${isOpen && 'rotate-180'}`}/> */}
                    <img src={profilePicture} className='h-8 w-8 rounded-full ' /> 
                    {/* <FaAngleDown className={`transform transition-transform duration-300 ${isOpen && 'rotate-180'} `}/> */}
                </div>
                :
                <div className='hover:text-[#7C24F0] flex items-center gap-2'>
                    <FaAngleDown className={`transform transition-transform duration-300 ${isOpen && 'rotate-180'}`}/>
                    <FaUserCircle size={39} />
                </div>
                }
            </button>
            <AnimatePresence>
            {isOpen && (
                <motion.div
                initial={{ opacity: 0, y: -60,x:60, scale: 0 }}  
                animate={{ opacity: 1, y:0,x:0, scale: 1 }}  
                exit={{ opacity: 0, y: -60,x:60, scale: 0 }}  
                transition={{    
                    duration: 0.06, // Extremely fast duration (50ms)   
                  ease: 'easeOut',      
                }}
                 className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-[100] transform opacity-100 scale-100"
                 >
                    <ul>
                        <li className="px-4 py-2 hover:bg-gray-100 hover:text-[#7C24F0] cursor-pointer flex items-center gap-3" onClick={toWishList}> <FaRegHeart /> Wishlist</li>
                        <li className="px-4 py-2 hover:bg-gray-100 hover:text-[#7C24F0] cursor-pointer flex items-center gap-3" onClick={toProfile}> <RiAccountBoxLine /> Profile</li>
                        <li className="px-4 py-2 hover:bg-gray-100 hover:text-[#7C24F0] cursor-pointer flex items-center gap-3" onClick={handleLogout}> <CiLogout /> Logout</li>
                    </ul>
                </motion.div>
            )}
            </AnimatePresence>
        </div>
    );
};

export default HeaderDropdown;
