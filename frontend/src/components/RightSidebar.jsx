import axios from "axios";
import React, { memo, useEffect, useState } from "react";
import { Link } from "react-router-dom";

const RightSidebar = memo(
    ({
        user,
        isDarkMode,
        onFollow,
        onUnfollow,
        handleSendFollowRequest,
    }) => {
        const [suggestedUsers, setSuggestedUsers] = useState([]); // State to store suggested users
        const [loading, setLoading] = useState(true);
        const [requestedUsers, setRequestedUsers] = useState([]); // Track requested users

        // Fetch suggested users on component mount
        useEffect(() => {
            const fetchSuggestedUsers = async () => {
                try {
                    const response = await axios.get("http://localhost:3000/api/users/"); // Replace with actual route to get users
                    const allUsers = response.data;

                    // Filter out the current user and already followed users
                    const filteredUsers = allUsers
                        .filter(
                            (u) => u._id !== user._id && !user.following.includes(u._id)
                        )
                        .slice(0, 5); // Limit to 5 users

                    setSuggestedUsers(filteredUsers);
                } catch (error) {
                    console.error("Error fetching suggested users:", error);
                } finally {
                    setLoading(false);
                }
            };

            if (user) {
                fetchSuggestedUsers();
            }
        }, [user]);

        // Handle follow request and update the requested state
        const handleFollowClick = async (userId) => {
            try {
                await handleSendFollowRequest(userId);
                // Add the user to the requested list
                setRequestedUsers((prev) => [...prev, userId]);
            } catch (error) {
                console.error("Error sending follow request:", error);
            }
        };

        return (
            <div
                className={`w-[22vw] fixed right-0 top-0 z-10 hidden lg:block ml-auto p-6 ${isDarkMode ? "text-black" : "text-gray-900"
                    } transition-all duration-500`}
            >
                <div
                    className={`flex items-center p-3 shadow-sm rounded-lg mb-6 ${isDarkMode ? "text-white bg-zinc-800" : "text-gray-900"
                        } transition-all duration-500`}
                >
                    {user ? (
                        <Link
                            to={`/profile/${user._id}`}
                            className="rounded-full w-[4vw] h-[4vw] overflow-hidden"
                        >
                            <img
                                src={user.profilePicture || "https://via.placeholder.com/150"}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        </Link>
                    ) : (
                        <div className="rounded-full w-14 h-14 overflow-hidden">
                            <img
                                src="https://via.placeholder.com/150"
                                alt="No Profile"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}
                    <div className="ml-4">
                        <h3 className="font-semibold">{user?.username || "Username"}</h3>
                        <p className="text-sm text-gray-500">
                            {user?.email || "email@example.com"}
                        </p>
                    </div>
                </div>

                <div
                    className={`bg-white p-4 shadow-sm rounded-lg mb-6 ${isDarkMode ? "text-white bg-zinc-800" : "text-gray-900"
                        } transition-all duration-500`}
                >
                    <h4 className="font-semibold mb-3">Suggestions for you</h4>
                    <ul>
                        {loading ? (
                            <p>Loading suggestions...</p>
                        ) : (
                            suggestedUsers.map((suggestedUser) => (
                                <li
                                    key={suggestedUser._id}
                                    className="flex justify-between items-center mb-3"
                                >
                                    <div className="flex items-center">
                                        <img
                                            src={
                                                suggestedUser.profilePicture ||
                                                "https://via.placeholder.com/150"
                                            }
                                            alt="suggestion"
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                        <div className="ml-3">
                                            <h5 className="font-semibold">
                                                {suggestedUser.username}
                                            </h5>
                                        </div>
                                    </div>
                                    {requestedUsers.includes(suggestedUser._id) ? (
                                        <button
                                            className="px-2 py-1 rounded-md bg-zinc-900 text-gray-400 text-sm font-semibold cursor-default"
                                            disabled
                                        >
                                            Requested
                                        </button>
                                    ) : !user.following.includes(suggestedUser._id) ? (
                                        <button
                                            onClick={() => handleFollowClick(suggestedUser._id)}
                                            className="px-2 py-1 rounded-md bg-blue-500 text-white text-sm font-semibold"
                                        >
                                            Follow
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => onUnfollow(suggestedUser._id)}
                                            className="text-red-500 text-sm font-semibold"
                                        >
                                            Unfollow
                                        </button>
                                    )}
                                </li>
                            ))
                        )}
                    </ul>
                </div>
            </div>
        );
    }
);

RightSidebar.displayName = "RightSidebar"; // Add display name

export default RightSidebar;
