// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useTheme } from '../utils/ThemeOfSite';
// import gsap from 'gsap';

// const decodeJWT = (token) => {
//     try {
//         const base64Url = token.split('.')[1];
//         const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
//         const jsonPayload = decodeURIComponent(
//             atob(base64)
//                 .split('')
//                 .map((c) => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`)
//                 .join('')
//         );
//         return JSON.parse(jsonPayload);
//     } catch (error) {
//         console.error("Invalid JWT:", error);
//         return null;
//     }
// };

// const Notification = () => {
//     const { isDarkMode } = useTheme();
//     const [notifications, setNotifications] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         const fetchNotifications = async () => {
//             try {
//                 const token = localStorage.getItem("token");
//                 if (!token) {
//                     console.error("No token found in localStorage");
//                     throw new Error("User is not authenticated.");
//                 }

//                 const decodedToken = decodeJWT(token);
//                 if (!decodedToken || !decodedToken.id) {
//                     throw new Error("Invalid or malformed token.");
//                 }

//                 const userId = decodedToken.id;

//                 // Fetch notifications from the API
//                 const response = await axios.get(`http://localhost:3000/api/users/notifications/${userId}`, {
//                     headers: { Authorization: `Bearer ${token}` },
//                 });

//                 setNotifications(response.data.notifications);
//             } catch (err) {
//                 console.error("Error fetching notifications:", err.response?.data || err.message);
//                 setError(err.response?.data?.message || "An error occurred.");
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchNotifications();
//     }, []);


//     useEffect(() => {
//         gsap.fromTo(
//             ".notification-item",
//             { opacity: 0, y: 50 },
//             { opacity: 1, y: 0, duration: 0.6, stagger: 0.1 }
//         );
//     }, [notifications]);

//     const handleAcceptRequest = async (notificationId, senderId) => {
//         try {
//             const token = localStorage.getItem("token");
//             const response = await axios.put(
//                 `http://localhost:3000/api/users/${senderId}/accept-follow`,
//                 {},
//                 { headers: { Authorization: `Bearer ${token}` } }
//             );
    
//             if (response.status === 200) {
//                 // ✅ Remove the accepted request from the UI
//                 setNotifications((prevNotifications) =>
//                     prevNotifications.filter((notification) => notification._id !== notificationId)
//                 );
//             }
//         } catch (error) {
//             console.error("Error accepting follow request:", error);
//         }
//     };
    


//     const handleRejectRequest = async (notificationId, senderId) => {
//         try {
//             const token = localStorage.getItem("token");
//             await axios.put(
//                 `http://localhost:3000/api/users/${senderId}/reject-follow`,
//                 {},
//                 { headers: { Authorization: `Bearer ${token}` } }
//             );
    
//             // ✅ Remove the rejected request from UI
//             setNotifications(prevNotifications =>
//                 prevNotifications.filter(notification => notification._id !== notificationId)
//             );
//         } catch (error) {
//             console.error("Error rejecting follow request:", error);
//         }
//     };
    

//     return (
//         <div
//             className={`min-h-screen flex flex-col items-center p-6 transition-all duration-300 ${
//                 isDarkMode ? "bg-zinc-900 text-gray-200" : "bg-gradient-to-br from-gray-100 via-blue-50 to-gray-200 text-gray-900"
//             }`}
//         >
//             <div
//                 className={`w-full max-w-4xl shadow-lg rounded-xl p-8 transition-all duration-300 ${
//                     isDarkMode ? "bg-zinc-800" : "bg-white"
//                 }`}
//             >
//                 <h2
//                     className={`text-4xl font-medium tracking-wide mb-6 pb-4 border-b-2 ${
//                         isDarkMode ? "text-gray-100 border-zinc-700" : "text-gray-900 border-gray-200"
//                     }`}
//                 >
//                     Notifications
//                 </h2>

//                 {loading ? (
//                     <div className="flex justify-center items-center py-10">
//                         <div
//                             className={`loader ease-linear rounded-full border-8 border-t-8 h-16 w-16 ${
//                                 isDarkMode ? "border-gray-600" : "border-gray-300"
//                             }`}
//                         ></div>
//                     </div>
//                 ) : error ? (
//                     <p className="text-red-500 text-center">{error}</p>
//                 ) : (
//                     <ul className="space-y-6">
//                         {notifications.length === 0 ? (
//                             <p className="text-center italic text-gray-400">
//                                 You have no new notifications.
//                             </p>
//                         ) : (
//                             notifications.map((notification) => (
//                                 <li
//                                     key={notification._id}
//                                     className={`notification-item flex items-center justify-between border rounded-lg shadow-md p-6 hover:bg-opacity-90 transition-all duration-300 ${
//                                         isDarkMode
//                                             ? "bg-zinc-700 border-zinc-600 hover:bg-zinc-700"
//                                             : "bg-gray-50 border-gray-200 hover:bg-gray-100"
//                                     }`}
//                                 >
//                                     <div className="flex items-center">
//                                         <img
//                                             src={notification.sender.profilePicture || 'https://via.placeholder.com/50'}z
//                                             alt={notification.sender.username}
//                                             className="w-14 h-14 rounded-full object-cover mr-6 shadow-lg"
//                                         />
//                                         <div>
//                                             <p className="text-lg">
//                                                 <span
//                                                     className={`font-bold ${
//                                                         isDarkMode ? "text-blue-300" : "text-blue-600"
//                                                     }`}
//                                                 >
//                                                     {notification.sender.username}
//                                                 </span>{' '}
//                                                 {notification.message}
//                                             </p>
//                                             <span className="text-sm text-gray-500">
//                                                 {new Date(notification.createdAt).toLocaleDateString()} at{' '}
//                                                 {new Date(notification.createdAt).toLocaleTimeString()}
//                                             </span>
//                                         </div>
//                                     </div>

//                                     {notification.type === 'requested' ? (
//                                         <div className="flex space-x-2">
//                                             <button
//                                                 onClick={() => handleAcceptRequest(notification._id, notification.sender._id)}
//                                                 className="px-4 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition"
//                                             >
//                                                 Accept
//                                             </button>
//                                             <button
//                                                 onClick={() => handleRejectRequest(notification._id, notification.sender._id)}
//                                                 className="px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition"
//                                             >
//                                                 Reject
//                                             </button>
//                                         </div>
//                                     ) : (
//                                         <span
//                                             className={`px-3 py-1 text-xs font-semibold rounded-lg shadow-md ${
//                                                 notification.type === 'follow'
//                                                     ? "bg-blue-100 text-blue-600"
//                                                     : "bg-green-100 text-green-600"
//                                             }`}
//                                         >
//                                             {notification.type === 'follow' ? 'Follow' : 'Message'}
//                                         </span>
//                                     )}
//                                 </li>
//                             ))
//                         )}
//                     </ul>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default Notification;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTheme } from '../utils/ThemeOfSite';
import { motion } from "framer-motion";
import { FaCheck, FaTimes, FaArrowLeft } from "react-icons/fa";

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
    const navigate = useNavigate();
    const { isDarkMode } = useTheme();
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

    const handleAcceptRequest = async (notificationId, senderId) => {
        try {
            const token = localStorage.getItem("token");
            await axios.put(
                `http://localhost:3000/api/users/${senderId}/accept-follow`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setNotifications(prevNotifications =>
                prevNotifications.filter(notification => notification._id !== notificationId)
            );
        } catch (error) {
            console.error("Error accepting follow request:", error);
        }
    };

    const handleRejectRequest = async (notificationId, senderId) => {
        try {
            const token = localStorage.getItem("token");
            await axios.put(
                `http://localhost:3000/api/users/${senderId}/reject-follow`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setNotifications(prevNotifications =>
                prevNotifications.filter(notification => notification._id !== notificationId)
            );
        } catch (error) {
            console.error("Error rejecting follow request:", error);
        }
    };

    return (
        <div
            className={`min-h-screen flex flex-col items-center px-4 py-6 transition-all duration-300 ${
                isDarkMode ? "bg-zinc-900 text-zinc-100" : "bg-slate-50 text-zinc-900"
            }`}
        >
            {/* Back Button */}
            <div className="w-full max-w-md sm:max-w-lg lg:max-w-2xl flex items-center mb-4">
                <button 
                    onClick={() => navigate(-1)} 
                    className="flex items-center gap-2 px-4 py-2 rounded-lg shadow-md transition-all text-sm font-medium bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-zinc-700 dark:text-white dark:hover:bg-zinc-600"
                >
                    <FaArrowLeft className="w-4 h-4" /> Back
                </button>
            </div>

            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className={`w-full max-w-md sm:max-w-lg lg:max-w-2xl rounded-2xl p-6 ${
                    isDarkMode 
                        ? "bg-zinc-800 shadow-zinc-900/50" 
                        : "bg-white shadow-lg"
                }`}
            >
                <h2 className={`text-2xl font-bold mb-6 text-center ${
                    isDarkMode ? "text-emerald-400" : "text-emerald-600"
                }`}>
                    Notifications
                </h2>

                {loading ? (
                    <div className="flex justify-center items-center py-10">
                        <div className={`animate-spin rounded-full h-12 w-12 border-b-4 ${
                            isDarkMode ? "border-emerald-400" : "border-emerald-600"
                        }`}></div>
                    </div>
                ) : error ? (
                    <p className="text-red-400 text-center">{error}</p>
                ) : notifications.length === 0 ? (
                    <p className={`text-center italic ${
                        isDarkMode ? "text-zinc-400" : "text-zinc-500"
                    }`}>
                        No new notifications
                    </p>
                ) : (
                    <div className="space-y-4">
                        {notifications.map((notification) => (
                            <motion.div
                                key={notification._id}
                                className={`group rounded-xl p-4 flex flex-col sm:flex-row items-center gap-4 transition-all ${
                                    isDarkMode 
                                        ? "bg-zinc-700/30 hover:bg-zinc-700/50 border border-zinc-700/50" 
                                        : "bg-white hover:bg-slate-50 border border-slate-100"
                                }`}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <img
                                    src={notification.sender.profilePicture || 'https://via.placeholder.com/50'}
                                    alt={notification.sender.username}
                                    className={`w-14 h-14 rounded-full object-cover shadow-lg ${
                                        isDarkMode ? "ring-2 ring-emerald-400/50" : "ring-2 ring-emerald-600/30"
                                    }`}
                                />

                                <div className="flex-1 text-center sm:text-left space-y-1">
                                    <p className="text-sm sm:text-base leading-snug">
                                        <span className={`font-semibold ${
                                            isDarkMode ? "text-emerald-300" : "text-emerald-600"
                                        }`}>
                                            {notification.sender.username}
                                        </span>{' '}
                                        {notification.message}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default Notification;
