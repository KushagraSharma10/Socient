import React, { memo, useEffect, useRef } from 'react';
import { FaHome, FaMoon, FaPlus, FaSun } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';

const Navbar = memo(({ user, handleLogout, handleOpenModal, isDarkMode, toggleDarkMode }) => {
    const navLinksRef = useRef([]);
    const addToRefs = (el) => {
        if (el && !navLinksRef.current.includes(el)) {
            navLinksRef.current.push(el);
        }
    };

    useEffect(() => {
        navLinksRef.current.forEach((link, index) => {
            gsap.fromTo(link, { opacity: 0, x: -20 }, { opacity: 1, x: 0, delay: index * 0.1, duration: 0.5 });
            gsap.to(link, {
                scale: 1.1,
                duration: 0.2,
                ease: "power1.inOut",
                paused: true,
                yoyo: true,
                repeat: 1,
                onHover: true,
            });
        });
    }, []);

    return (
        <div className={`w-[15vw] min-h-screen fixed left-0 top-0 z-10 flex flex-col items-start justify-start p-5 border-r ${isDarkMode ? 'bg-black border-gray-700' : 'bg-white border-gray-200'} transition-all duration-500`}>
            <Link to="/" className="text-2xl font-bold mb-8 hover:text-blue-500 transition-colors duration-300">Socient</Link>
            <div className="flex flex-col space-y-6 mt-5">
                <Link to="/home" className="flex items-center gap-4 text-lg hover:text-blue-500 transition-colors duration-300" ref={addToRefs}>
                    <FaHome />
                    <span>Home</span>
                </Link>
                <Link to="/profile" className="flex items-center gap-2 text-lg hover:text-blue-500 transition-colors duration-300" ref={addToRefs}>
                    <img
                        src={user?.profilePicture || "https://via.placeholder.com/150"}
                        alt="Profile"
                        className="w-8 h-8 rounded-full"
                    />
                    <span>Profile</span>
                </Link>
                <div className='flex items-center gap-2 cursor-pointer hover:text-blue-500 transition-colors duration-300' ref={addToRefs} onClick={handleOpenModal}>
                    <FaPlus className="text-lg" />
                    <span>Create Post</span>
                </div>

                {/* Dark Mode Toggle */}
                <button onClick={toggleDarkMode} className="flex items-center gap-3 mt-8 text-xl hover:text-blue-500 transition-colors duration-300" ref={addToRefs}>
                    {isDarkMode ? <FaSun className="text-yellow-500" /> : <FaMoon className="text-black" />}
                </button>

                <button onClick={handleLogout} className="text-md bg-red-500 text-white px-4 py-2 rounded-lg mt-8 hover:bg-red-600 transition-colors duration-300" ref={addToRefs}>
                    Logout
                </button>
            </div>
        </div>
    );
});

export default Navbar;
