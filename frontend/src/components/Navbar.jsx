import React, { memo } from 'react';
import { FaHome, FaMoon, FaPlus, FaSun } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Navbar = memo(({ user, handleLogout, handleOpenModal, isDarkMode, toggleDarkMode }) => {
    return (
        <div className={`w-[15vw] min-h-screen fixed left-0 top-0 z-10 flex flex-col items-start justify-start p-5 border-r ${isDarkMode ? 'bg-black border-gray-700' : 'bg-white border-gray-200'} transition-all duration-500`}>
            <Link to="/" className="text-2xl font-bold mb-8">Socient</Link>
            <div className="flex flex-col space-y-6 mt-5">
                <Link to="/home" className="flex items-center gap-4 text-lg">
                    <FaHome />
                    <span>Home</span>
                </Link>
                <Link to="/profile" className="flex items-center gap-2 text-lg">
                    <img
                        src={user?.profilePicture || "https://via.placeholder.com/150"}
                        alt="Profile"
                        className="w-8 h-8 rounded-full"
                    />
                    <span>Profile</span>
                </Link>
                <div className='flex items-center gap-2'>
                    <FaPlus onClick={handleOpenModal} className="text-lg cursor-pointer" />
                    <span>Create Post</span>
                </div>

                {/* Dark Mode Toggle */}
                <button onClick={toggleDarkMode} className="flex items-center gap-3 mt-8 text-xl">
                    {isDarkMode ? <FaSun className="text-yellow-500" /> : <FaMoon className="text-black" />}
                </button>

                <button onClick={handleLogout} className="text-md bg-red-500 text-white px-4 py-2 rounded-lg mt-8">
                    Logout
                </button>
            </div>
        </div>
    );
});

export default Navbar;
