
// // import React, { useState, useEffect } from 'react';
// // import { useParams } from 'react-router-dom';
// // import axios from 'axios';

// // // Import Swiper components and styles
// // import { Swiper, SwiperSlide } from 'swiper/react';
// // import { Navigation, Pagination } from 'swiper/modules';

// // import 'swiper/css';
// // import 'swiper/css/navigation';
// // import 'swiper/css/pagination';

// // // Import icons for navigation
// // import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

// // const UserProfile = () => {
// //     const { userId } = useParams(); // Get the userId from the route parameter
// //     const [user, setUser] = useState(null); // Store user data
// //     const [loading, setLoading] = useState(true); // Track loading state
// //     const [error, setError] = useState(null); // Track errors
// //     const defaultImage = "https://via.placeholder.com/150"; // Default DP

// //     // Fetch user data based on userId
// //     useEffect(() => {
// //         const fetchUser = async () => {
// //             try {
// //                 const response = await axios.get(`http://localhost:3000/api/users/${userId}`); // Make an API call to fetch user data
// //                 setUser(response.data); // Store user data in state
// //                 setLoading(false); // Set loading to false after fetching data
// //             } catch (err) {
// //                 setError("Failed to fetch user data.");
// //                 setLoading(false); // Set loading to false if there's an error
// //             }
// //         };

// //         fetchUser();
// //     }, [userId]);

// //     if (loading) return <div>Loading...</div>; // Show loading state
// //     if (error) return <div>{error}</div>; // Show error state
// //     if (!user) return <div>No user data available.</div>; // Fallback if no user data

// //     return (
// //         <div className="max-w-4xl mx-auto p-4 mt-5">
// //             {/* Header Section */}
// //             <div className="flex lg:flex lg:items-start lg:justify-between mb-4">
// //                 {/* Profile Picture */}
// //                 <div className="mb-4 lg:mb-0 lg:mr-8">
// //                     <img
// //                         src={user.profilePicture || defaultImage}
// //                         alt={user.username}
// //                         className="w-28 h-28 lg:w-40 lg:h-40 rounded-full object-cover"
// //                     />
// //                 </div>

// //                 {/* User Info Section */}
// //                 <div className="flex flex-col lg:flex-1">
// //                     {/* Username and Edit Profile Button */}
// //                     <div className="flex items-center justify-between mb-2">
// //                         <h1 className="text-2xl lg:text-3xl lg:pl-4 font-bold">{user.username}</h1>
// //                         <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
// //                             Edit Profile
// //                         </button>
// //                     </div>

// //                     {/* User Stats (Posts, Followers, Following) */}
// //                     <div className="flex justify-between lg:justify-start lg:space-x-6 lg:mt-2 mb-2">
// //                         <div className="text-center">
// //                             <p className="font-bold">{user.posts.length}</p>
// //                             <p className="text-gray-500">Posts</p>
// //                         </div>
// //                         <div className="text-center">
// //                             <p className="font-bold">{user.followers}</p>
// //                             <p className="text-gray-500">Followers</p>
// //                         </div>
// //                         <div className="text-center">
// //                             <p className="font-bold">{user.following}</p>
// //                             <p className="text-gray-500">Following</p>
// //                         </div>
// //                     </div>

// //                     {/* Full Name */}
// //                     <div className="text-lg font-semibold">{user.fullName}</div>

// //                     {/* Bio */}
// //                     <div className="text-gray-700">{user.bio}</div>
// //                 </div>
// //             </div>

// //             {/* Posts Section */}
// //             <div className="mt-6">
// //                 <h2 className="text-xl font-bold mb-4">Posts</h2>
// //                 <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
// //                     {user.posts.map((post, index) => (
// //                         <div key={index} className="w-full h-[20vw] bg-gray-100">
// //                             {post.images.length > 1 ? (
// //                                 <Swiper
// //                                     spaceBetween={1}
// //                                     slidesPerView={1}
// //                                     navigation={{
// //                                         nextEl: `.next-${index}`,
// //                                         prevEl: `.prev-${index}`,
// //                                     }}
// //                                     pagination={{ clickable: true }}
// //                                     modules={[Navigation, Pagination]}
// //                                     className="relative w-full h-full"
// //                                 >
// //                                     {post.images.map((image, imgIndex) => (
// //                                         <SwiperSlide key={imgIndex}>
// //                                             <img
// //                                                 src={image}
// //                                                 alt={`Post ${index + 1} - Image ${imgIndex + 1}`}
// //                                                 className="w-full h-full object-cover rounded-md"
// //                                             />
// //                                         </SwiperSlide>
// //                                     ))}
// //                                     {/* Custom Navigation Buttons */}
// //                                     <div className={`prev-${index} absolute top-1/2 left-1 transform -translate-y-1/2 cursor-pointer z-10`}>
// //                                         <FaChevronLeft className="text-white text-xl" />
// //                                     </div>
// //                                     <div className={`next-${index} absolute top-1/2 right-1 transform -translate-y-1/2 cursor-pointer z-10`}>
// //                                         <FaChevronRight className="text-white text-xl" />
// //                                     </div>
// //                                 </Swiper>
// //                             ) : (
// //                                 <img
// //                                     src={post.images[0]}
// //                                     alt={`Post ${index + 1}`}
// //                                     className="w-full h-full object-cover rounded-md"
// //                                 />
// //                             )}
// //                         </div>
// //                     ))}
// //                 </div>
// //             </div>
// //         </div>
// //     );
// // };

// // export default UserProfile;


// import React, { useState, useEffect, useCallback } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';
// import { Swiper, SwiperSlide } from 'swiper/react';
// import { Navigation, Pagination } from 'swiper/modules';
// import 'swiper/css';
// import 'swiper/css/navigation';
// import 'swiper/css/pagination';
// import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
// import RightSidebar from '../components/RightSidebar';

// const UserProfile = () => {
//     const { userId } = useParams();
//     const [user, setUser] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const defaultImage = "https://via.placeholder.com/150";
//     const [isFollowing, setIsFollowing] = useState(false);

//     // Fetch user data based on userId
//     useEffect(() => {
//         const fetchUser = async () => {
//             try {
//                 const response = await axios.get(`http://localhost:3000/api/users/${userId}`);
//                 setUser(response.data);
//                 setIsFollowing(response.data.followers.includes(userId));
//                 setLoading(false);
//             } catch (err) {
//                 setError("Failed to fetch user data.");
//                 setLoading(false);
//             }
//         };
//         fetchUser();
//     }, [userId]);

//     const handleFollow = useCallback(async () => {
//         try {
//             const token = localStorage.getItem('token');
//             await axios.put(`http://localhost:3000/api/users/${userId}/follow`, {}, {
//                 headers: { Authorization: `Bearer ${token}` }
//             });
//             setUser(prevUser => ({
//                 ...prevUser,
//                 followers: [...prevUser.followers, userId]
//             }));
//             setIsFollowing(true);
//         } catch (error) {
//             console.error('Error following user:', error);
//         }
//     }, [userId]);

//     const handleUnfollow = useCallback(async () => {
//         try {
//             const token = localStorage.getItem('token');
//             await axios.put(`http://localhost:3000/api/users/${userId}/unfollow`, {}, {
//                 headers: { Authorization: `Bearer ${token}` }
//             });
//             setUser(prevUser => ({
//                 ...prevUser,
//                 followers: prevUser.followers.filter(id => id !== userId)
//             }));
//             setIsFollowing(false);
//         } catch (error) {
//             console.error('Error unfollowing user:', error);
//         }
//     }, [userId]);

//     if (loading) return <div>Loading...</div>;
//     if (error) return <div>{error}</div>;
//     if (!user) return <div>No user data available.</div>;

//     return (
//         <div className="max-w-4xl mx-auto p-4 mt-5">
//             <div className="flex lg:flex lg:items-start lg:justify-between mb-4">
//                 <div className="mb-4 lg:mb-0 lg:mr-8">
//                     <img
//                         src={user.profilePicture || defaultImage}
//                         alt={user.username}
//                         className="w-28 h-28 lg:w-40 lg:h-40 rounded-full object-cover"
//                     />
//                 </div>

//                 {/* User Info Section */}
//                 <div className="flex flex-col lg:flex-1">
//                     <div className="flex items-center justify-between mb-2">
//                         <h1 className="text-2xl lg:text-3xl lg:pl-4 font-bold">{user.username}</h1>
//                         {isFollowing ? (
//                             <button
//                                 onClick={handleUnfollow}
//                                 className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
//                             >
//                                 Unfollow
//                             </button>
//                         ) : (
//                             <button
//                                 onClick={handleFollow}
//                                 className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
//                             >
//                                 Follow
//                             </button>
//                         )}
//                     </div>

//                     {/* User Stats (Posts, Followers, Following) */}
//                     <div className="flex justify-between lg:justify-start lg:space-x-6 lg:mt-2 mb-2">
//                         <div className="text-center">
//                             <p className="font-bold">{user.posts.length}</p>
//                             <p className="text-gray-500">Posts</p>
//                         </div>
//                         <div className="text-center">
//                             <p className="font-bold">{user.followers.length}</p>
//                             <p className="text-gray-500">Followers</p>
//                         </div>
//                         <div className="text-center">
//                             <p className="font-bold">{user.following.length}</p>
//                             <p className="text-gray-500">Following</p>
//                         </div>
//                     </div>

//                     <div className="text-lg font-semibold">{user.fullName}</div>
//                     <div className="text-gray-700">{user.bio}</div>
//                 </div>
//             </div>

//             <div className="mt-6">
//                 <h2 className="text-xl font-bold mb-4">Posts</h2>
//                 <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
//                     {user.posts.map((post, index) => (
//                         <div key={index} className="w-full h-[20vw] bg-gray-100">
//                             {post.images.length > 1 ? (
//                                 <Swiper
//                                     spaceBetween={1}
//                                     slidesPerView={1}
//                                     navigation={{
//                                         nextEl: `.next-${index}`,
//                                         prevEl: `.prev-${index}`,
//                                     }}
//                                     pagination={{ clickable: true }}
//                                     modules={[Navigation, Pagination]}
//                                     className="relative w-full h-full"
//                                 >
//                                     {post.images.map((image, imgIndex) => (
//                                         <SwiperSlide key={imgIndex}>
//                                             <img
//                                                 src={image}
//                                                 alt={`Post ${index + 1} - Image ${imgIndex + 1}`}
//                                                 className="w-full h-full object-cover rounded-md"
//                                             />
//                                         </SwiperSlide>
//                                     ))}
//                                     <div className={`prev-${index} absolute top-1/2 left-1 transform -translate-y-1/2 cursor-pointer z-10`}>
//                                         <FaChevronLeft className="text-white text-xl" />
//                                     </div>
//                                     <div className={`next-${index} absolute top-1/2 right-1 transform -translate-y-1/2 cursor-pointer z-10`}>
//                                         <FaChevronRight className="text-white text-xl" />
//                                     </div>
//                                 </Swiper>
//                             ) : (
//                                 <img
//                                     src={post.images[0]}
//                                     alt={`Post ${index + 1}`}
//                                     className="w-full h-full object-cover rounded-md"
//                                 />
//                             )}
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default UserProfile;


// import React, { useState, useEffect, useCallback } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';
// import { Swiper, SwiperSlide } from 'swiper/react';
// import { Navigation, Pagination } from 'swiper/modules';
// import 'swiper/css';
// import 'swiper/css/navigation';
// import 'swiper/css/pagination';
// import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

// const UserProfile = () => {
//     const { userId } = useParams();
//     const [user, setUser] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const defaultImage = "https://via.placeholder.com/150";
//     const [isFollowing, setIsFollowing] = useState(false);

//     // Fetch user data based on userId
//     useEffect(() => {
//         const fetchUser = async () => {
//             try {
//                 const response = await axios.get(`http://localhost:3000/api/users/${userId}`);
//                 setUser(response.data);
//                 setIsFollowing(response.data.followers.includes(userId));
//                 setLoading(false);
//             } catch (err) {
//                 setError("Failed to fetch user data.");
//                 setLoading(false);
//             }
//         };
//         fetchUser();
//     }, [userId]);

//     const handleFollow = useCallback(async () => {
//         try {
//             const token = localStorage.getItem('token');
//             await axios.put(`http://localhost:3000/api/users/${userId}/follow`, {}, {
//                 headers: { Authorization: `Bearer ${token}` }
//             });
//             setUser(prevUser => ({
//                 ...prevUser,
//                 followers: [...prevUser.followers, userId]
//             }));
//             setIsFollowing(true);
//         } catch (error) {
//             console.error('Error following user:', error);
//         }
//     }, [userId]);

//     const handleUnfollow = useCallback(async () => {
//         try {
//             const token = localStorage.getItem('token');
//             await axios.put(`http://localhost:3000/api/users/${userId}/unfollow`, {}, {
//                 headers: { Authorization: `Bearer ${token}` }
//             });
//             setUser(prevUser => ({
//                 ...prevUser,
//                 followers: prevUser.followers.filter(id => id !== userId)
//             }));
//             setIsFollowing(false);
//         } catch (error) {
//             console.error('Error unfollowing user:', error);
//         }
//     }, [userId]);

//     if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
//     if (error) return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
//     if (!user) return <div className="flex justify-center items-center h-screen">No user data available.</div>;

//     return (
//         <div className="max-w-6xl mx-auto p-6 mt-6 bg-gradient-to-br from-blue-50 via-white to-gray-100 rounded-lg shadow-lg">
//             <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-6 mb-8">
//                 <div className="relative">
//                     <img
//                         src={user.profilePicture || defaultImage}
//                         alt={user.username}
//                         className="w-36 h-36 lg:w-48 lg:h-48 rounded-full object-cover shadow-lg"
//                     />
//                     <div className="absolute bottom-2 right-2 bg-green-500 w-6 h-6 rounded-full border-2 border-white"></div>
//                 </div>

//                 {/* User Info Section */}
//                 <div className="flex-1 lg:ml-8">
//                     <div className="flex items-center justify-between mb-4">
//                         <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-800">{user.username}</h1>
//                         {isFollowing ? (
//                             <button
//                                 onClick={handleUnfollow}
//                                 className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
//                             >
//                                 Unfollow
//                             </button>
//                         ) : (
//                             <button
//                                 onClick={handleFollow}
//                                 className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
//                             >
//                                 Follow
//                             </button>
//                         )}
//                     </div>

//                     {/* User Stats */}
//                     <div className="flex justify-between lg:justify-start lg:space-x-8 mb-4">
//                         <div className="text-center">
//                             <p className="text-2xl font-bold text-gray-700">{user.posts.length}</p>
//                             <p className="text-gray-500">Posts</p>
//                         </div>
//                         <div className="text-center">
//                             <p className="text-2xl font-bold text-gray-700">{user.followers.length}</p>
//                             <p className="text-gray-500">Followers</p>
//                         </div>
//                         <div className="text-center">
//                             <p className="text-2xl font-bold text-gray-700">{user.following.length}</p>
//                             <p className="text-gray-500">Following</p>
//                         </div>
//                     </div>

//                     <div className="text-lg font-semibold text-gray-800">{user.fullName}</div>
//                     <div className="text-gray-600">{user.bio}</div>
//                 </div>
//             </div>

//             <div className="mt-8">
//                 <h2 className="text-2xl font-bold text-gray-800 mb-4">Posts</h2>
//                 <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
//                     {user.posts.map((post, index) => (
//                         <div key={index} className="relative group overflow-hidden rounded-lg shadow-lg">
//                             {post.images.length > 1 ? (
//                                 <Swiper
//                                     spaceBetween={1}
//                                     slidesPerView={1}
//                                     navigation={{
//                                         nextEl: `.next-${index}`,
//                                         prevEl: `.prev-${index}`,
//                                     }}
//                                     pagination={{ clickable: true }}
//                                     modules={[Navigation, Pagination]}
//                                     className="relative w-full h-full"
//                                 >
//                                     {post.images.map((image, imgIndex) => (
//                                         <SwiperSlide key={imgIndex}>
//                                             <img
//                                                 src={image}
//                                                 alt={`Post ${index + 1} - Image ${imgIndex + 1}`}
//                                                 className="w-full h-full object-cover"
//                                             />
//                                         </SwiperSlide>
//                                     ))}
//                                     <div className={`prev-${index} absolute top-1/2 left-2 transform -translate-y-1/2 cursor-pointer z-10 opacity-0 group-hover:opacity-100 transition`}>
//                                         <FaChevronLeft className="text-white text-xl" />
//                                     </div>
//                                     <div className={`next-${index} absolute top-1/2 right-2 transform -translate-y-1/2 cursor-pointer z-10 opacity-0 group-hover:opacity-100 transition`}>
//                                         <FaChevronRight className="text-white text-xl" />
//                                     </div>
//                                 </Swiper>
//                             ) : (
//                                 <img
//                                     src={post.images[0]}
//                                     alt={`Post ${index + 1}`}
//                                     className="w-full h-full object-cover"
//                                 />
//                             )}
//                             <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-50 transition"></div>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default UserProfile;


import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const UserProfile = () => {
    const { userId } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFollowing, setIsFollowing] = useState(false);
    const [activeTab, setActiveTab] = useState('posts'); // Tracks active section: 'posts' or 'sentiment'

    const defaultImage = "https://via.placeholder.com/150";

    // Fetch user data based on userId
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/users/${userId}`);
                setUser(response.data);
                setIsFollowing(response.data.followers.includes(userId));
                setLoading(false);
            } catch (err) {
                setError("Failed to fetch user data.");
                setLoading(false);
            }
        };
        fetchUser();
    }, [userId]);

    const handleFollow = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:3000/api/users/${userId}/follow`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUser(prevUser => ({
                ...prevUser,
                followers: [...prevUser.followers, userId]
            }));
            setIsFollowing(true);
        } catch (error) {
            console.error('Error following user:', error);
        }
    }, [userId]);

    const handleUnfollow = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:3000/api/users/${userId}/unfollow`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUser(prevUser => ({
                ...prevUser,
                followers: prevUser.followers.filter(id => id !== userId)
            }));
            setIsFollowing(false);
        } catch (error) {
            console.error('Error unfollowing user:', error);
        }
    }, [userId]);

    // Hardcoded sentiment data
    const postsSentiments = [
        { postId: 1, sentiment: 'positive' },
        { postId: 2, sentiment: 'positive' },
        { postId: 3, sentiment: 'negative' },
    ];

    // Calculate sentiment percentages
    const totalPosts = postsSentiments.length;
    const sentimentCounts = postsSentiments.reduce(
        (acc, post) => {
            acc[post.sentiment]++;
            return acc;
        },
        { positive: 0, neutral: 0, negative: 0 }
    );

    const positivePercentage = ((sentimentCounts.positive / totalPosts) * 100).toFixed(1);
    const neutralPercentage = ((sentimentCounts.neutral / totalPosts) * 100).toFixed(1);
    const negativePercentage = ((sentimentCounts.negative / totalPosts) * 100).toFixed(1);

    const sentimentData = {
        labels: ['Positive', 'Neutral', 'Negative'],
        datasets: [
            {
                label: 'Sentiment Analysis',
                data: [positivePercentage, neutralPercentage, negativePercentage],
                backgroundColor: ['#4caf50', '#ffeb3b', '#f44336'],
                hoverBackgroundColor: ['#45b745', '#ffee58', '#f6685e'],
                borderWidth: 1,
            },
        ],
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    if (!user) return <div>No user data available.</div>;

    return (
        <div className="max-w-6xl mx-auto p-6 mt-5 bg-gradient-to-br from-blue-50 via-white to-gray-100 rounded-lg shadow-lg">
            {/* User Info Section */}
            <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-6 mb-8">
                <div className="relative">
                    <img
                        src={user.profilePicture || defaultImage}
                        alt={user.username}
                        className="w-36 h-36 lg:w-48 lg:h-48 rounded-full object-cover shadow-lg"
                    />
                </div>
                <div className="flex-1">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-3xl lg:text-4xl font-extrabold">{user.username}</h1>
                        {isFollowing ? (
                            <button
                                onClick={handleUnfollow}
                                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                            >
                                Unfollow
                            </button>
                        ) : (
                            <button
                                onClick={handleFollow}
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                            >
                                Follow
                            </button>
                        )}
                    </div>
                    <div className="flex justify-between lg:justify-start lg:space-x-8 mb-4">
                        <div className="text-center">
                            <p className="text-2xl font-bold">{user.posts.length}</p>
                            <p className="text-gray-500">Posts</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold">{user.followers.length}</p>
                            <p className="text-gray-500">Followers</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold">{user.following.length}</p>
                            <p className="text-gray-500">Following</p>
                        </div>
                    </div>
                    <div className="text-lg font-semibold">{user.fullName}</div>
                    <div className="text-gray-700">{user.bio}</div>
                </div>
            </div>

            {/* Toggle Buttons */}
            <div className="flex justify-center space-x-4 mb-6">
                <button
                    onClick={() => setActiveTab('posts')}
                    className={`px-4 py-2 rounded-lg font-semibold transition ${
                        activeTab === 'posts' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                    }`}
                >
                    Posts
                </button>
                <button
                    onClick={() => setActiveTab('sentiment')}
                    className={`px-4 py-2 rounded-lg font-semibold transition ${
                        activeTab === 'sentiment' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                    }`}
                >
                    Sentiment
                </button>
            </div>

            {/* Sliding Transition */}
            <div className="relative h-[70vh] overflow-hidden">
                <div
                    className="absolute inset-0 flex transition-transform duration-500"
                    style={{
                        transform: `translateX(${activeTab === 'posts' ? '0' : '-100%'})`,
                    }}
                >
                    {/* Posts Section */}
                    <div className="w-full flex-shrink-0 p-6">
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                            {user.posts.map((post, index) => (
                                <div key={index} className="relative group overflow-hidden rounded-lg shadow-lg">
                                    <img
                                        src={post.images[0]}
                                        alt={`Post ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-50 transition"></div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Sentiment Section */}
                    <div className="w-full flex-shrink-0 flex flex-col justify-center items-center p-6">
                        <div className="max-w-md mx-auto">
                            <Doughnut data={sentimentData} />
                        </div>
                        <p className="mt-4 text-center text-gray-700 text-lg">
                            This user's posts have an overall sentiment of{' '}
                            <span className={`font-bold ${positivePercentage > 50 ? 'text-green-600' : 'text-red-600'}`}>
                                {positivePercentage}% Positive
                            </span>.
                        </p>
                        <p className="mt-2 text-gray-600 text-center">
                            Breakdown: {positivePercentage}% Positive, {neutralPercentage}% Neutral, {negativePercentage}% Negative.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
