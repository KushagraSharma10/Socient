// import React, { useState, useEffect } from 'react';

// const Notification = () => {
//   const [darkMode, setDarkMode] = useState(false);

//   // Check for user's dark mode preference on initial load
//   useEffect(() => {
//     const isDarkMode = localStorage.getItem('darkMode') === 'true';
//     setDarkMode(isDarkMode);
//     if (isDarkMode) {
//       document.documentElement.classList.add('dark');
//     }
//   }, []);

//   // Toggle dark mode and save preference to localStorage
//   const toggleDarkMode = () => {
//     setDarkMode((prev) => {
//       const newDarkMode = !prev;
//       if (newDarkMode) {
//         document.documentElement.classList.add('dark');
//       } else {
//         document.documentElement.classList.remove('dark');
//       }
//       localStorage.setItem('darkMode', newDarkMode);
//       return newDarkMode;
//     });
//   };

//   const notifications = [
//     {
//       id: 1,
//       type: 'Like',
//       user: 'John Doe',
//       message: 'liked your photo',
//       time: '5 minutes ago',
//       avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
//     },
//     {
//       id: 2,
//       type: 'Comment',
//       user: 'Jane Smith',
//       message: 'commented on your post',
//       time: '10 minutes ago',
//       avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
//     },
//     {
//       id: 3,
//       type: 'Mention',
//       user: 'Sarah Lee',
//       message: 'mentioned you in a story',
//       time: '15 minutes ago',
//       avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
//     },
//   ];

//   return (
//     <div className={`flex h-screen ${darkMode ? 'bg-gray-900' : 'bg-white'} transition-colors duration-300`}>
//       {/* Sidebar */}
//       <div className={`w-1/5 p-6 shadow-lg flex flex-col items-start border-r ${darkMode ? 'bg-zinc-900 text-white' : 'bg-white text-gray-800'} transition-colors duration-300`}>
//         <h2 className="text-2xl font-semibold mb-6">Notifications</h2>
//         <ul className="w-full space-y-4">
//           <li className="text-lg cursor-pointer hover:text-blue-600">All</li>
//           <li className="text-lg cursor-pointer hover:text-blue-600">Mentions</li>
//           <li className="text-lg cursor-pointer hover:text-blue-600">Likes</li>
//           <li className="text-lg cursor-pointer hover:text-blue-600">Comments</li>
//         </ul>
//         {/* Dark Mode Toggle */}
//         <button
//           onClick={toggleDarkMode}
//           className="mt-auto text-sm px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none"
//         >
//           {darkMode ? 'Light Mode' : 'Dark Mode'}
//         </button>
//       </div>

//       {/* Notification List */}
//       <div className={`w-4/5 p-6 overflow-y-auto ${darkMode ? 'bg-zinc-900' : 'bg-white'} transition-colors duration-300`}>
//         <h1 className={`text-3xl font-semibold mb-8 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Recent Notifications</h1>

//         {/* Notification Items */}
//         {notifications.map((notification) => (
//           <div
//             key={notification.id}
//             className={`flex items-center justify-between p-4 mb-4 rounded-lg shadow-md hover:bg-gray-50 ${darkMode ? 'bg-zinc-800 text-white' : 'bg-white text-gray-800'} transition-colors duration-300`}
//           >
//             <div className="flex items-center space-x-4">
//               <img
//                 src={notification.avatar}
//                 alt="Avatar"
//                 className="w-12 h-12 rounded-full"
//               />
//               <div>
//                 <p className="font-semibold">{notification.user}</p>
//                 <p className="text-sm">{notification.message}</p>
//               </div>
//             </div>
//             <p className="text-sm">{notification.time}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Notification;
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const decodeJWT = (token) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`)
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error("Invalid JWT:", error);
        return null;
    }
};

const Notification = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    console.error("No token found in localStorage");
                    throw new Error("User is not authenticated.");
                }

                const decodedToken = decodeJWT(token);
                if (!decodedToken || !decodedToken.id) {
                    throw new Error("Invalid or malformed token.");
                }

                const userId = decodedToken.id;

                // Fetch notifications from the API
                const response = await axios.get(`http://localhost:3000/api/users/notifications/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setNotifications(response.data.notifications);
            } catch (err) {
                console.error("Error fetching notifications:", err.response?.data || err.message);
                setError(err.response?.data?.message || "An error occurred.");
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
            <div className="w-full max-w-3xl bg-white shadow-md rounded-lg p-6">
                <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-2">
                    Notifications
                </h2>

                {loading ? (
                    <div className="flex justify-center items-center py-10">
                        <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16"></div>
                    </div>
                ) : error ? (
                    <p className="text-red-500 text-center">{error}</p>
                ) : (
                    <ul className="space-y-4">
                        {notifications.length === 0 ? (
                            <p className="text-gray-500 text-center">No new notifications</p>
                        ) : (
                            notifications.map((notification) => (
                                <li
                                    key={notification._id}
                                    className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-md shadow-sm p-4 hover:shadow-md transition-shadow duration-300"
                                >
                                    <div className="flex items-center">
                                        <img
                                            src={notification.sender.profilePicture || 'https://via.placeholder.com/50'}
                                            alt={notification.sender.username}
                                            className="w-12 h-12 rounded-full object-cover mr-4"
                                        />
                                        <div>
                                            <p className="text-gray-700">
                                                <span className="font-semibold text-blue-600">{notification.sender.username}</span>{' '}
                                                {notification.type === 'follow' ? 'started following you' : notification.message}
                                            </p>
                                            <span className="text-sm text-gray-500">
                                                {new Date(notification.createdAt).toLocaleDateString()} at{' '}
                                                {new Date(notification.createdAt).toLocaleTimeString()}
                                            </span>
                                        </div>
                                    </div>
                                </li>
                            ))
                        )}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default Notification;
