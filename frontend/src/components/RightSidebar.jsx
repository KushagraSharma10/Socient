// import axios from "axios";
// import React, { memo, useEffect, useState } from "react";
// import { Link } from "react-router-dom";

// const RightSidebar = memo(
//     ({
//         user,
//         isDarkMode,
//         onFollow,
//         onUnfollow,
//         handleSendFollowRequest,
//     }) => {
//         const [suggestedUsers, setSuggestedUsers] = useState([]); // State to store suggested users
//         const [loading, setLoading] = useState(true);
//         const [requestedUsers, setRequestedUsers] = useState([]); // Track requested users

//         // Fetch suggested users on component mount
//         useEffect(() => {
//             const fetchSuggestedUsers = async () => {
//                 try {
//                     const response = await axios.get("http://localhost:3000/api/users/"); // Replace with actual route to get users
//                     const allUsers = response.data;

//                     // Filter out the current user and already followed users
//                     const filteredUsers = allUsers
//                         .filter(
//                             (u) => u._id !== user._id && !user.following.includes(u._id)
//                         )
//                         .slice(0, 5); // Limit to 5 users

//                     setSuggestedUsers(filteredUsers);
//                 } catch (error) {
//                     console.error("Error fetching suggested users:", error);
//                 } finally {
//                     setLoading(false);
//                 }
//             };

//             if (user) {
//                 fetchSuggestedUsers();
//             }
//         }, [user]);

//         // Handle follow request and update the requested state
//         const handleFollowClick = async (userId) => {
//             try {
//                 if (requestedUsers.includes(userId)) {
//                     console.log("Request already sent.");
//                     return;
//                 }

//                 await handleSendFollowRequest(userId);

//                 // ✅ Add the user to the requested list
//                 setRequestedUsers(prev => [...prev, userId]);
//             } catch (error) {
//                 console.error("Error sending follow request:", error);
//             }
//         };


//         return (
//             <div
//                 className={`w-[22vw] fixed right-0 top-0 z-10 hidden lg:block ml-auto p-6 ${isDarkMode ? "text-black" : "text-gray-900"
//                     } transition-all duration-500`}
//             >
//                 <div
//                     className={`flex items-center p-3 shadow-sm rounded-lg mb-6 ${isDarkMode ? "text-white bg-zinc-800" : "text-gray-900"
//                         } transition-all duration-500`}
//                 >
//                     {user ? (
//                         <Link
//                             to={`/profile/${user._id}`}
//                             className="rounded-full w-[4vw] h-[4vw] overflow-hidden"
//                         >
//                             <img
//                                 src={user.profilePicture || "https://via.placeholder.com/150"}
//                                 alt="Profile"
//                                 className="w-full h-full object-cover"
//                             />
//                         </Link>
//                     ) : (
//                         <div className="rounded-full w-14 h-14 overflow-hidden">
//                             <img
//                                 src="https://via.placeholder.com/150"
//                                 alt="No Profile"
//                                 className="w-full h-full object-cover"
//                             />
//                         </div>
//                     )}
//                     <div className="ml-4">
//                         <h3 className="font-semibold">{user?.username || "Username"}</h3>
//                         <p className="text-sm text-gray-500">
//                             {user?.email || "email@example.com"}
//                         </p>
//                     </div>
//                 </div>

//                 <div
//                     className={`bg-white p-4 shadow-sm rounded-lg mb-6 ${isDarkMode ? "text-white bg-zinc-800" : "text-gray-900"
//                         } transition-all duration-500`}
//                 >
//                     <h4 className="font-semibold mb-3">Suggestions for you</h4>
//                     <ul>
//                         {loading ? (
//                             <p>Loading suggestions...</p>
//                         ) : (
//                             suggestedUsers.map((suggestedUser) => (
//                                 <li
//                                     key={suggestedUser._id}
//                                     className="flex justify-between items-center mb-3"
//                                 >
//                                     <div className="flex items-center">
//                                         <img
//                                             src={
//                                                 suggestedUser.profilePicture ||
//                                                 "https://via.placeholder.com/150"
//                                             }
//                                             alt="suggestion"
//                                             className="w-10 h-10 rounded-full object-cover"
//                                         />
//                                         <div className="ml-3">
//                                             <h5 className="font-semibold">
//                                                 {suggestedUser.username}
//                                             </h5>
//                                         </div>
//                                     </div>
//                                     {requestedUsers.includes(suggestedUser._id) ? (
//                                         <button
//                                             className="px-2 py-1 rounded-md bg-zinc-900 text-gray-400 text-sm font-semibold cursor-default"
//                                             disabled
//                                         >
//                                             Requested
//                                         </button>
//                                     ) : !user.following.includes(suggestedUser._id) ? (
//                                         <button
//                                             onClick={() => handleFollowClick(suggestedUser._id)}
//                                             className="px-2 py-1 rounded-md bg-blue-500 text-white text-sm font-semibold"
//                                         >
//                                             Follow
//                                         </button>
//                                     ) : (
//                                         <button
//                                             onClick={() => onUnfollow(suggestedUser._id)}
//                                             className="text-red-500 text-sm font-semibold"
//                                         >
//                                             Unfollow
//                                         </button>
//                                     )}
//                                 </li>
//                             ))
//                         )}
//                     </ul>
//                 </div>
//             </div>
//         );
//     }
// );

// RightSidebar.displayName = "RightSidebar"; // Add display name

// export default RightSidebar;


// import axios from "axios";
// import React, { memo, useEffect, useState } from "react";
// import { Link } from "react-router-dom";

// const RightSidebar = memo(
//     ({ user, isDarkMode, handleSendFollowRequest }) => {
//         const [suggestedUsers, setSuggestedUsers] = useState([]); // State to store suggested users
//         const [loading, setLoading] = useState(true);
//         const [requestedUsers, setRequestedUsers] = useState(new Set()); // Track requested users

//         // Fetch suggested users and follow requests on mount
//         useEffect(() => {
//             const fetchSuggestedUsers = async () => {
//                 try {
//                     const token = localStorage.getItem("token");
//                     if (!token || !user) return;

//                     // Fetch all users
//                     const usersResponse = await axios.get("http://localhost:3000/api/users/", {
//                         headers: { Authorization: `Bearer ${token}` },
//                     });

//                     // ✅ Fetch logged-in user's SENT follow requests (NEW CODE)
//                     const sentRequestsResponse = await axios.get(
//                         `http://localhost:3000/api/users/${user._id}/sent-requests`, // Ensure this endpoint exists
//                         { headers: { Authorization: `Bearer ${token}` } }
//                     );
//                     const sentRequests = sentRequestsResponse.data || [];

//                     // Filter suggested users (exclude self, followed, and already requested)
//                     const filteredUsers = usersResponse.data.filter(
//                         (u) =>
//                             u._id !== user._id &&
//                             !user.following.includes(u._id) &&
//                             !sentRequests.includes(u._id) // ✅ Exclude users with pending requests
//                     );

//                     setSuggestedUsers(filteredUsers.slice(0, 5)); // Limit to 5 users
//                     setRequestedUsers(new Set(sentRequests)); // ✅ Initialize requested state
//                 } catch (error) {
//                     console.error("Error fetching data:", error);
//                 } finally {
//                     setLoading(false);
//                 }
//             };

//             fetchSuggestedUsers();
//         }, [user]);


//         // Handle follow request and update UI immediately
//         const handleFollowClick = async (userId) => {
//             try {
//                 if (requestedUsers.has(userId)) {
//                     console.log("Request already sent.");
//                     return;
//                 }

//                 await handleSendFollowRequest(userId);

//                 // ✅ Update UI immediately (no need to wait for refresh)
//                 setRequestedUsers((prev) => new Set([...prev, userId]));
//             } catch (error) {
//                 console.error("Error sending follow request:", error);
//             }
//         };


//         return (
//             <div
//                 className={`w-[22vw] fixed right-0 top-0 z-10 hidden lg:block ml-auto p-6 ${isDarkMode ? "text-black" : "text-gray-900"
//                     } transition-all duration-500`}
//             >
//                 <div
//                     className={`flex items-center p-3 shadow-sm rounded-lg mb-6 ${isDarkMode ? "text-white bg-zinc-800" : "text-gray-900"
//                         } transition-all duration-500`}
//                 >
//                     {user ? (
//                         <Link
//                             to={`/profile/${user._id}`}
//                             className="rounded-full w-[4vw] h-[4vw] overflow-hidden"
//                         >
//                             <img
//                                 src={user.profilePicture || "https://via.placeholder.com/150"}
//                                 alt="Profile"
//                                 className="w-full h-full object-cover"
//                             />
//                         </Link>
//                     ) : (
//                         <div className="rounded-full w-14 h-14 overflow-hidden">
//                             <img
//                                 src="https://via.placeholder.com/150"
//                                 alt="No Profile"
//                                 className="w-full h-full object-cover"
//                             />
//                         </div>
//                     )}
//                     <div className="ml-4">
//                         <h3 className="font-semibold">{user?.username || "Username"}</h3>
//                         <p className="text-sm text-gray-500">{user?.email || "email@example.com"}</p>
//                     </div>
//                 </div>

//                 <div
//                     className={`bg-white p-4 shadow-sm rounded-lg mb-6 ${isDarkMode ? "text-white bg-zinc-800" : "text-gray-900"
//                         } transition-all duration-500`}
//                 >
//                     <h4 className="font-semibold mb-3">Suggestions for you</h4>
//                     <ul>
//                         {loading ? (
//                             <p>Loading suggestions...</p>
//                         ) : (
//                             suggestedUsers.map((suggestedUser) => (
//                                 <li key={suggestedUser._id} className="flex justify-between items-center mb-3">
//                                     <div className="flex items-center">
//                                         <img
//                                             src={suggestedUser.profilePicture || "https://via.placeholder.com/150"}
//                                             alt="suggestion"
//                                             className="w-10 h-10 rounded-full object-cover"
//                                         />
//                                         <div className="ml-3">
//                                             <h5 className="font-semibold">{suggestedUser.username}</h5>
//                                         </div>
//                                     </div>
//                                     {
//                                         requestedUsers.has(suggestedUser._id) ? (
//                                             <button className="px-2 py-2 bg-zinc-900 rounded-lg" disabled>Requested</button>
//                                         ) : (
//                                             <button className="px-2 py-2 bg-blue-500 rounded-lg" onClick={() => handleFollowClick(suggestedUser._id)}>Follow</button>
//                                         )
//                                     }
//                                 </li>
//                             ))
//                         )}
//                     </ul>
//                 </div>
//             </div>
//         );
//     }
// );

// RightSidebar.displayName = "RightSidebar";

// export default RightSidebar;


import axios from "axios";
import React, { memo, useEffect, useState } from "react";
import { Link } from "react-router-dom";

const RightSidebar = memo(({ user, isDarkMode, handleSendFollowRequest }) => {
    const [suggestedUsers, setSuggestedUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [requestedUsers, setRequestedUsers] = useState(new Set());

    useEffect(() => {
        const fetchSuggestedUsers = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token || !user) return;

                const usersResponse = await axios.get("http://localhost:3000/api/users/", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const sentRequestsResponse = await axios.get(
                    `http://localhost:3000/api/users/${user._id}/sent-requests`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                const sentRequests = sentRequestsResponse.data || [];

                const filteredUsers = usersResponse.data.filter(
                    (u) =>
                        u._id !== user._id &&
                        !user.following.includes(u._id) &&
                        !sentRequests.includes(u._id)
                );

                setSuggestedUsers(filteredUsers.slice(0, 5));
                setRequestedUsers(new Set(sentRequests));
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSuggestedUsers();
    }, [user]);

    const handleFollowClick = async (userId) => {
        try {
            if (requestedUsers.has(userId)) return;
            
            await handleSendFollowRequest(userId);
            setRequestedUsers((prev) => new Set([...prev, userId]));
        } catch (error) {
            console.error("Error sending follow request:", error);
        }
    };

    return (
        <div className={`w-[300px] fixed right-0 top-0 h-screen hidden lg:block ml-auto p-6 ${
            isDarkMode 
                ? "bg-gradient-to-b from-gray-900 to-gray-800 border-l border-gray-700"
                : "bg-gradient-to-b from-gray-50 to-white border-l border-gray-200"
        } transition-all duration-300`}>
            {/* User Profile Card */}
            <div className={`flex items-center p-4 rounded-xl mb-8 ${
                isDarkMode ? "bg-gray-800/50" : "bg-white/50"
            } backdrop-blur-sm shadow-sm`}>
                <Link
                    to={`/profile/${user?._id}`}
                    className="flex-shrink-0 w-14 h-14 rounded-full border-2 border-purple-500 overflow-hidden shadow-lg"
                >
                    <img
                        src={user?.profilePicture || "https://via.placeholder.com/150"}
                        alt="Profile"
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                </Link>
                <div className="ml-4 flex-1 min-w-0">
                    <h3 className={`text-sm font-bold truncate ${
                        isDarkMode ? "text-white" : "text-gray-900"
                    }`}>
                        {user?.username || "Username"}
                    </h3>
                    <p className={`text-xs truncate ${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}>
                        {user?.email || "email@example.com"}
                    </p>
                </div>
            </div>

            {/* Suggestions Section */}
            <div className={`${
                isDarkMode ? "bg-gray-800" : "bg-white"
            } rounded-2xl p-4 shadow-xl`}>
                <div className="flex items-center justify-between mb-6 px-2">
                    <h4 className={`text-sm font-bold ${
                        isDarkMode ? "text-gray-200" : "text-gray-700"
                    }`}>
                        Suggestions For You
                    </h4>
                    <span className={`text-xs ${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}>
                        {suggestedUsers.length} accounts
                    </span>
                </div>

                {loading ? (
                    <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="flex items-center animate-pulse">
                                <div className={`w-10 h-10 rounded-full ${
                                    isDarkMode ? "bg-gray-700" : "bg-gray-200"
                                }`} />
                                <div className="ml-3 flex-1">
                                    <div className={`h-3 rounded-full mb-2 w-3/4 ${
                                        isDarkMode ? "bg-gray-700" : "bg-gray-200"
                                    }`} />
                                    <div className={`h-2 rounded-full w-1/2 ${
                                        isDarkMode ? "bg-gray-700" : "bg-gray-200"
                                    }`} />
                                </div>
                                <div className={`w-20 h-8 rounded-lg ${
                                    isDarkMode ? "bg-gray-700" : "bg-gray-200"
                                }`} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <ul className="space-y-4">
                        {suggestedUsers.map((suggestedUser) => (
                            <li
                                key={suggestedUser._id}
                                className="flex items-center justify-between group"
                            >
                                <Link
                                    to={`/profile/${suggestedUser._id}`}
                                    className="flex items-center flex-1 hover:bg-gray-100 dark:hover:bg-gray-700/50 p-2 rounded-xl transition-colors duration-300"
                                >
                                    <div className="relative">
                                        <img
                                            src={suggestedUser.profilePicture || "https://via.placeholder.com/150"}
                                            alt="suggestion"
                                            className="w-10 h-10 rounded-full object-cover border-2 border-transparent group-hover:border-purple-500 transition-all duration-300"
                                        />
                                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                                    </div>
                                    <div className="ml-3 flex-1 min-w-0">
                                        <h5 className={`text-sm font-semibold truncate ${
                                            isDarkMode ? "text-gray-100" : "text-gray-900"
                                        }`}>
                                            {suggestedUser.username}
                                        </h5>
                                        <p className={`text-xs truncate ${
                                            isDarkMode ? "text-gray-400" : "text-gray-500"
                                        }`}>
                                            Popular in your area
                                        </p>
                                    </div>
                                </Link>
                                <button
                                    onClick={() => handleFollowClick(suggestedUser._id)}
                                    className={`text-xs font-bold px-4 py-2 rounded-lg transition-all duration-300 ${
                                        requestedUsers.has(suggestedUser._id)
                                            ? `${
                                                isDarkMode
                                                    ? "bg-gray-700 text-gray-400 cursor-default"
                                                    : "bg-gray-200 text-gray-500 cursor-default"
                                            }`
                                            : `${
                                                isDarkMode
                                                    ? "bg-purple-600 hover:bg-purple-700 text-white"
                                                    : "bg-purple-500 hover:bg-purple-600 text-white"
                                            }`
                                    }`}
                                    disabled={requestedUsers.has(suggestedUser._id)}
                                >
                                    {requestedUsers.has(suggestedUser._id) ? "Requested" : "Follow"}
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Footer */}
            <div className={`mt-8 pt-6 border-t ${
                isDarkMode ? "border-gray-700" : "border-gray-200"
            }`}>
                <p className={`text-center text-xs ${
                    isDarkMode ? "text-gray-500" : "text-gray-400"
                }`}>
                    © 2024 SocialSphere
                    <br />
                    Connecting People Globally
                </p>
            </div>
        </div>
    );
});

RightSidebar.displayName = "RightSidebar";

export default RightSidebar;