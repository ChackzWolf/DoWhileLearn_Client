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
            if(!getCookie('userAccessToken') && !getCookie('userRefreshToken') && !getCookie('userId')) dispatch(setUserLogout());
            navigate(ROUTES.common.landingPage)
        }
    };

    // Toggle dropdown open/close
    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };
    
    // Close the dropdown when clicking outside of it
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
            <button onClick={toggleDropdown} className="focus:outline-none">
                {/* You can replace the FaUserCircle with an img tag if you're using a custom image */}
                {profilePicture? 
                    <div className='h-10 w-10 rounded-full contain-content'>
                        <img src={profilePicture} alt="" />
                    </div>
                :<FaUserCircle size={39} />}
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-50 transition-all duration-1000 transform opacity-100 scale-100">
                    <ul>
                        <li className="px-4 py-2 hover:bg-gray-100 hover:text-[#7C24F0] cursor-pointer flex items-center gap-3" onClick={toWishList}> <FaRegHeart /> Cart</li>
                        <li className="px-4 py-2 hover:bg-gray-100 hover:text-[#7C24F0] cursor-pointer flex items-center gap-3" onClick={toProfile}> <RiAccountBoxLine /> Profile</li>
                        <li className="px-4 py-2 hover:bg-gray-100 hover:text-[#7C24F0] cursor-pointer flex items-center gap-3" onClick={handleLogout}> <CiLogout /> Logout</li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default HeaderDropdown;
