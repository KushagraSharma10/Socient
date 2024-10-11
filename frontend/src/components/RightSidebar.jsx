import React, { memo } from 'react';
import { Link } from 'react-router-dom';

const RightSidebar = memo(({ user, isDarkMode }) => {
    return (
        <div className={`w-[22vw] p-2 fixed right-0 top-0 z-10 hidden lg:block ml-auto p-6 ${isDarkMode ? 'text-black' : ' text-gray-900'} transition-all duration-500`}>
            <div className={`flex items-center p-4 shadow-sm rounded-lg mb-6 ${isDarkMode ? 'text-white bg-zinc-800 ' : ' text-gray-900'} transition-all duration-500`}>
                <Link to="/profile" className="rounded-full w-14 h-14 overflow-hidden">
                    <img src={user?.profilePicture || "https://via.placeholder.com/150"} alt="Profile" className="w-full h-full object-cover" />
                </Link>
                <div className="ml-4">
                    <h3 className="font-semibold">{user?.username || 'Username'}</h3>
                    <p className="text-sm text-gray-500">{user?.email || 'email@example.com'}</p>
                </div>
            </div>

            <div className={`bg-white p-4 shadow-sm rounded-lg mb-6 ${isDarkMode ? 'text-white bg-zinc-800 ' : ' text-gray-900'} transition-all duration-500`}>
                <h4 className="font-semibold mb-3">Suggestions for you</h4>
                <ul>
                    <li className="flex justify-between items-center mb-3">
                        <div className="flex items-center">
                            <img src="https://via.placeholder.com/40" alt="suggestion" className="w-10 h-10 rounded-full object-cover" />
                            <div className="ml-3">
                                <h5 className="font-semibold">suggested_user</h5>
                                <p className="text-sm text-gray-500">Follows you</p>
                            </div>
                        </div>
                        <button className="text-blue-500 text-sm font-semibold">Follow</button>
                    </li>
                </ul>
            </div>

            <div className="text-sm text-gray-500">
                <p className="mb-2">About &middot; Help &middot; Press &middot; API &middot; Jobs &middot; Privacy &middot; Terms &middot; Locations</p>
            </div>
        </div>
    );
});

export default RightSidebar;
