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
import {AnimatePresence, motion} from 'framer-motion'
import { IoMdReorder } from 'react-icons/io';


const HeaderDropdown: React.FC = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const picture = useSelector((state:RootState)=> state.userAuth.userProfilePic)
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null); // Reference to dropdown container
    const [loaded, setLoaded] = useState<boolean>(false);
    const [profilePicture, setProfilePicture]  =useState<string>('')

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
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const toWishList =() => {
        setIsOpen(false)
        navigate(ROUTES.user.wishlist)
    }
    const toProfile =()=> {
        setIsOpen(false)
        navigate(ROUTES.user.profile);
    }

    const toOrders = () => {
        setIsOpen(false)
        navigate(ROUTES.user.orders)
    }



    useEffect(() => {
        if (picture) {
            const img = new Image();
            img.src = picture;

            img.onload = () => {
                setProfilePicture(picture); // Update to actual image after preload
                setLoaded(true); // Mark as loaded
            };

            img.onerror = () => {
                console.error("Failed to load image");
                setLoaded(false); // Keep the placeholder
            };
        }
    }, [picture]);



    return ( 
        <div className="relative" ref={dropdownRef}>
            <button onClick={toggleDropdown} className="focus:outline-none flex gap-1 py-1 items-center">
                {profilePicture?            
                <div className='transition-all rounded-full hover:bg-opacity-65 p-1    hover:backdrop-blur-sm '>
                    {/* <img src={profilePicture} className='h-8 w-8 rounded-full ' />  */}

                    <img
                        src={profilePicture}
                        alt="Profile"
                        className={`flex object-cover md:h-8 lg:h-8 lg-w-8 md:w-8 w-7 h-7 rounded-full ${
                        !loaded ? "animate-pulse bg-gray-200" : ""
                        }`}
            />
                </div>
                :
                <div className='text-accent flex items-center gap-2'>
                    <FaUserCircle className="text-2xl sm:text-3xl md:text-4xl"/>
                    {/* <FaAngleDown className={`transform transition-transform duration-300 ${isOpen && 'rotate-180'}`}/> */}
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
                     className="absolute right-0 mt-2 md:w-48 lg:w-48 w-40 bg-white border rounded shadow-lg z-[100] transform opacity-100 scale-100"
                     >
                        <ul>
                            <li className="px-4 py-2 hover:bg-gray-100 hover:text-[#7C24F0] text-sm md:text-base lg:text-base cursor-pointer flex items-center gap-3" onClick={toWishList}> <FaRegHeart /> Wishlist</li>
                            <li className="px-4 py-2 hover:bg-gray-100 hover:text-[#7C24F0] text-sm md:text-base lg:text-base cursor-pointer flex items-center gap-3" onClick={toProfile}> <RiAccountBoxLine /> Profile</li>
                            <li className="px-4 py-2 hover:bg-gray-100 hover:text-[#7C24F0] text-sm md:text-base lg:text-base cursor-pointer flex items-center gap-3" onClick={toOrders}> <IoMdReorder /> Orders</li>
                            <li className="px-4 py-2 hover:bg-gray-100 hover:text-[#7C24F0] text-sm md:text-base lg:text-base cursor-pointer flex items-center gap-3" onClick={handleLogout}> <CiLogout /> Logout</li>
                        </ul>
                </motion.div>
            )}
            </AnimatePresence>
        </div>
    );
};

export default HeaderDropdown;
