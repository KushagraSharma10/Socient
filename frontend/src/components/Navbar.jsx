// import React, { memo, useEffect, useRef } from 'react';
// import { FaHome, FaMoon, FaPlus, FaSun, FaBell, FaEnvelope, FaFacebookMessenger } from 'react-icons/fa';
// import { Link } from 'react-router-dom';
// import { gsap } from 'gsap';

// const Navbar = memo(({ user, handleLogout, handleOpenModal, isDarkMode, toggleDarkMode }) => {
//     const navLinksRef = useRef([]);
//     const addToRefs = (el) => {
//         if (el && !navLinksRef.current.includes(el)) {
//             navLinksRef.current.push(el);
//         }
//     };

//     useEffect(() => {
//         navLinksRef.current.forEach((link, index) => {
//             gsap.fromTo(link, { opacity: 0, x: -20 }, { opacity: 1, x: 0, delay: index * 0.1, duration: 0.5 });
//             gsap.to(link, {
//                 scale: 1.1,
//                 duration: 0.2,
//                 ease: "power1.inOut",
//                 paused: true,
//                 yoyo: true,
//                 repeat: 1,
//                 onHover: true,
//             });
//         });
//     }, []);

//     return (
//         <div className={`w-[15vw] min-h-screen fixed left-0 top-0 z-10 flex flex-col items-start justify-start p-5 border-r ${isDarkMode ? 'bg-black border-gray-700' : 'bg-white border-gray-200'} transition-all duration-500`}>
//             <Link to="/" className="text-2xl font-bold mb-8 hover:text-blue-500 transition-colors duration-300">Socient</Link>
//             <div className="flex flex-col space-y-6 mt-5">
//                 <Link to="/home" className="flex items-center gap-4 text-lg hover:text-blue-500 transition-colors duration-300" ref={addToRefs}>
//                     <FaHome />
//                     <span>Home</span>
//                 </Link>
//                 <Link to="/profile" className="flex items-center gap-2 text-lg hover:text-blue-500 transition-colors duration-300" ref={addToRefs}>
//                     <img
//                         src={user?.profilePicture || "https://via.placeholder.com/150"}
//                         alt="Profile"
//                         className="w-8 h-8 rounded-full"
//                     />
//                     <span>Profile</span>
//                 </Link>
//                 <Link to="/notifications" className="flex items-center gap-2 text-lg hover:text-blue-500 transition-colors duration-300" ref={addToRefs}>
//                     <FaBell className={`text-lg ${isDarkMode ? 'text-white' : 'text-black'}`} />
//                     <span>Notifications</span>
//                 </Link>
//                 <Link to="/messanger" className="flex items-center gap-2 text-lg hover:text-blue-500 transition-colors duration-300" ref={addToRefs}>
//                     <FaFacebookMessenger className="text-lg" />
//                     <span>Messages</span>
//                 </Link>
//                 <div className='flex items-center gap-2 cursor-pointer hover:text-blue-500 transition-colors duration-300' ref={addToRefs} onClick={handleOpenModal}>
//                     <FaPlus className="text-lg" />
//                     <span>Create Post</span>
//                 </div>

//                 {/* Dark Mode Toggle */}
//                 <button onClick={toggleDarkMode} className="flex items-center gap-3 mt-8 text-xl hover:text-blue-500 transition-colors duration-300" ref={addToRefs}>
//                     {isDarkMode ? <FaSun className="text-yellow-500" /> : <FaMoon className="text-black" />}
//                 </button>

//                 <button onClick={handleLogout} className="text-sm bg-red-500 px-2 py-3 text-white rounded-lg mt-8 hover:bg-red-600 transition-colors duration-300" ref={addToRefs}>
//                     Logout
//                 </button>
//             </div>
//         </div>
//     );
// });

// Navbar.displayName = "Navbar";

// export default Navbar;


import React, { memo, useEffect, useRef } from 'react';
import { FaHome, FaMoon, FaPlus, FaSun, FaBell, FaFacebookMessenger, FaUser } from 'react-icons/fa';
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
            gsap.fromTo(link, 
                { opacity: 0, x: -20 }, 
                { 
                    opacity: 1, 
                    x: 0, 
                    delay: index * 0.1, 
                    duration: 0.5,
                    ease: "power2.out" 
                }
            );
        });
    }, []);

    return (
        <div className={`w-64 min-h-screen fixed left-0 top-0 z-10 flex flex-col items-start p-6 border-r backdrop-blur-lg
            ${isDarkMode 
                ? 'bg-zinc-900/95 border-zinc-700' 
                : 'bg-white/95 border-gray-200'
            } transition-all duration-300 shadow-2xl`}>

            {/* Logo */}
            <Link to="/" className="text-2xl font-bold mb-10 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                Socient
            </Link>

            {/* Navigation Items */}
            <div className="flex flex-col space-y-3 w-full">
                <Link 
                    to="/home" 
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-blue-500/10 transition-all duration-300 group"
                    ref={addToRefs}
                >
                    <FaHome className={`text-xl ${isDarkMode ? 'text-blue-400' : 'text-blue-500'} group-hover:text-blue-500`} />
                    <span className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} group-hover:text-blue-500`}>
                        Home
                    </span>
                </Link>

                <Link 
                    to="/profile" 
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-500/10 transition-all duration-300 group"
                    ref={addToRefs}
                >
                    <div className="relative">
                        <img
                            src={user?.profilePicture || "https://via.placeholder.com/150"}
                            alt="Profile"
                            className="w-10 h-10 rounded-full border-2 border-blue-400/50 object-cover"
                        />
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                    </div>
                    <div>
                        <p className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} group-hover:text-blue-500`}>
                            {user?.username || "Profile"}
                        </p>
                        <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            View profile
                        </p>
                    </div>
                </Link>

                <Link 
                    to="/notifications" 
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-blue-500/10 transition-all duration-300 group"
                    ref={addToRefs}
                >
                    <div className="relative">
                        <FaBell className={`text-xl ${isDarkMode ? 'text-purple-400' : 'text-purple-500'} group-hover:text-purple-500`} />
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-xs text-white rounded-full flex items-center justify-center">
                            3
                        </div>
                    </div>
                    <span className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} group-hover:text-purple-500`}>
                        Notifications
                    </span>
                </Link>

                <Link 
                    to="/messanger" 
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-blue-500/10 transition-all duration-300 group"
                    ref={addToRefs}
                >
                    <FaFacebookMessenger className={`text-xl ${isDarkMode ? 'text-green-400' : 'text-green-500'} group-hover:text-green-500`} />
                    <span className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} group-hover:text-green-500`}>
                        Messages
                    </span>
                </Link>

                <button 
                    onClick={handleOpenModal}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-blue-500/10 transition-all duration-300 group w-full"
                    ref={addToRefs}
                >
                    <div className="relative">
                        <div className="absolute inset-0 bg-blue-500/10 rounded-full animate-ping"></div>
                        <FaPlus className={`text-xl ${isDarkMode ? 'text-blue-400' : 'text-blue-500'} group-hover:text-blue-500`} />
                    </div>
                    <span className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} group-hover:text-blue-500`}>
                        Create Post
                    </span>
                </button>
            </div>

            {/* Bottom Section */}
            <div className="mt-auto w-full space-y-4">
                <button 
                    onClick={toggleDarkMode}
                    className="flex items-center justify-between w-full p-3 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-blue-500/10 transition-all duration-300 group"
                    ref={addToRefs}
                >
                    <span className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                        {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                    </span>
                    <div className={`p-2 rounded-full ${isDarkMode ? 'bg-yellow-400' : 'bg-blue-500'}`}>
                        {isDarkMode ? (
                            <FaSun className="text-white text-lg" />
                        ) : (
                            <FaMoon className="text-white text-lg" />
                        )}
                    </div>
                </button>

                <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 p-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-all duration-300 group"
                    ref={addToRefs}
                >
                    <div className="p-2 bg-red-500/10 rounded-full">
                        <FaUser className="text-red-500" />
                    </div>
                    <span className="font-medium">Log Out</span>
                </button>
            </div>
        </div>
    );
});

Navbar.displayName = "Navbar";
export default Navbar;