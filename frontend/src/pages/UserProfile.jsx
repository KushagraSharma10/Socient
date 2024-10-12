
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

// Import Swiper components and styles
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Import icons for navigation
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const UserProfile = () => {
    const { userId } = useParams(); // Get the userId from the route parameter
    const [user, setUser] = useState(null); // Store user data
    const [loading, setLoading] = useState(true); // Track loading state
    const [error, setError] = useState(null); // Track errors
    const defaultImage = "https://via.placeholder.com/150"; // Default DP

    // Fetch user data based on userId
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/users/${userId}`); // Make an API call to fetch user data
                setUser(response.data); // Store user data in state
                setLoading(false); // Set loading to false after fetching data
            } catch (err) {
                setError("Failed to fetch user data.");
                setLoading(false); // Set loading to false if there's an error
            }
        };

        fetchUser();
    }, [userId]);

    if (loading) return <div>Loading...</div>; // Show loading state
    if (error) return <div>{error}</div>; // Show error state
    if (!user) return <div>No user data available.</div>; // Fallback if no user data

    return (
        <div className="max-w-4xl mx-auto p-4 mt-5">
            {/* Header Section */}
            <div className="flex lg:flex lg:items-start lg:justify-between mb-4">
                {/* Profile Picture */}
                <div className="mb-4 lg:mb-0 lg:mr-8">
                    <img
                        src={user.profilePicture || defaultImage}
                        alt={user.username}
                        className="w-28 h-28 lg:w-40 lg:h-40 rounded-full object-cover"
                    />
                </div>

                {/* User Info Section */}
                <div className="flex flex-col lg:flex-1">
                    {/* Username and Edit Profile Button */}
                    <div className="flex items-center justify-between mb-2">
                        <h1 className="text-2xl lg:text-3xl lg:pl-4 font-bold">{user.username}</h1>
                        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                            Edit Profile
                        </button>
                    </div>

                    {/* User Stats (Posts, Followers, Following) */}
                    <div className="flex justify-between lg:justify-start lg:space-x-6 lg:mt-2 mb-2">
                        <div className="text-center">
                            <p className="font-bold">{user.posts.length}</p>
                            <p className="text-gray-500">Posts</p>
                        </div>
                        <div className="text-center">
                            <p className="font-bold">{user.followers}</p>
                            <p className="text-gray-500">Followers</p>
                        </div>
                        <div className="text-center">
                            <p className="font-bold">{user.following}</p>
                            <p className="text-gray-500">Following</p>
                        </div>
                    </div>

                    {/* Full Name */}
                    <div className="text-lg font-semibold">{user.fullName}</div>

                    {/* Bio */}
                    <div className="text-gray-700">{user.bio}</div>
                </div>
            </div>

            {/* Posts Section */}
            <div className="mt-6">
                <h2 className="text-xl font-bold mb-4">Posts</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {user.posts.map((post, index) => (
                        <div key={index} className="w-full h-[20vw] bg-gray-100">
                            {post.images.length > 1 ? (
                                <Swiper
                                    spaceBetween={10}
                                    slidesPerView={1}
                                    navigation={{
                                        nextEl: `.next-${index}`,
                                        prevEl: `.prev-${index}`,
                                    }}
                                    pagination={{ clickable: true }}
                                    modules={[Navigation, Pagination]}
                                    className="relative w-full h-full"
                                >
                                    {post.images.map((image, imgIndex) => (
                                        <SwiperSlide key={imgIndex}>
                                            <img
                                                src={image}
                                                alt={`Post ${index + 1} - Image ${imgIndex + 1}`}
                                                className="w-full h-full object-cover rounded-md"
                                            />
                                        </SwiperSlide>
                                    ))}
                                    {/* Custom Navigation Buttons */}
                                    <div className={`prev-${index} absolute top-1/2 left-1 transform -translate-y-1/2 cursor-pointer z-10`}>
                                        <FaChevronLeft className="text-white text-xl" />
                                    </div>
                                    <div className={`next-${index} absolute top-1/2 right-1 transform -translate-y-1/2 cursor-pointer z-10`}>
                                        <FaChevronRight className="text-white text-xl" />
                                    </div>
                                </Swiper>
                            ) : (
                                <img
                                    src={post.images[0]}
                                    alt={`Post ${index + 1}`}
                                    className="w-full h-full object-cover rounded-md"
                                />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
