import React, { useState, useEffect, useRef } from 'react';
import { FaUserCircle } from 'react-icons/fa'; // Import an icon from react-icons (or use an image)
import { useDispatch } from 'react-redux';
import { setUserLogout } from '../../../../redux/authSlice/authSlice';
import { removeCookie } from '../../../../utils/cookieManager';
import { useNavigate } from 'react-router-dom';

const HeaderDropdown: React.FC = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null); // Reference to dropdown container

    // Handle logout logic
    const handleLogout = () => {
        removeCookie('token');
        removeCookie('refreshToken');
        removeCookie('userId');
        dispatch(setUserLogout());
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

    const toCart =() => {
        navigate('/user/cart')
    }
    return (
        <div className="relative" ref={dropdownRef}>
            <button onClick={toggleDropdown} className="focus:outline-none">
                {/* You can replace the FaUserCircle with an img tag if you're using a custom image */}
                <FaUserCircle size={30} />
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-50 transition-all duration-1000 transform opacity-100 scale-100">
                    <ul>
                        <li className="px-4 py-2 hover:bg-gray-100 hover:text-[#7C24F0] cursor-pointer" onClick={toCart}>My cart</li>
                        <li className="px-4 py-2 hover:bg-gray-100 hover:text-[#7C24F0] cursor-pointer" onClick={handleLogout}>
                            Logout
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default HeaderDropdown;
