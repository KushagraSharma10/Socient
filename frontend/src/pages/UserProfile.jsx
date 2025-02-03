// import React, { useState, useEffect, useCallback } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';
// import { Doughnut } from 'react-chartjs-2';
// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
// import { Swiper, SwiperSlide } from "swiper/react";
// import "swiper/css";
// import "swiper/css/navigation";
// import "swiper/css/pagination";
// import { Navigation, Pagination } from "swiper/modules";



// ChartJS.register(ArcElement, Tooltip, Legend);

// const UserProfile = () => {
//     const { userId } = useParams();
//     const [user, setUser] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [isFollowing, setIsFollowing] = useState(false);
//     const [activeTab, setActiveTab] = useState('posts'); // Tracks active section: 'posts' or 'sentiment'

//     const defaultImage = "https://via.placeholder.com/150";

//     // Fetch user data based on userId
//     useEffect(() => {
//         const fetchUser = async () => {
//             try {
//                 const response = await axios.get(`http://localhost:3000/api/users/${userId}`);
//                 console.log("User API Response:", response.data); // ✅ Debugging
//                 setUser(response.data);
//                 setIsFollowing(response.data.followers.includes(userId));
//                 setLoading(false);
//             } catch (err) {
//                 setError("Failed to fetch user data: ", err);
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

//     // Hardcoded sentiment data
//     const postsSentiments = [
//         { postId: 1, sentiment: 'positive' },
//         { postId: 2, sentiment: 'positive' },
//         { postId: 3, sentiment: 'negative' },
//     ];

//     // Calculate sentiment percentages
//     const totalPosts = postsSentiments.length;
//     const sentimentCounts = postsSentiments.reduce(
//         (acc, post) => {
//             acc[post.sentiment]++;
//             return acc;
//         },
//         { positive: 0, neutral: 0, negative: 0 }
//     );

//     const positivePercentage = ((sentimentCounts.positive / totalPosts) * 100).toFixed(1);
//     const neutralPercentage = ((sentimentCounts.neutral / totalPosts) * 100).toFixed(1);
//     const negativePercentage = ((sentimentCounts.negative / totalPosts) * 100).toFixed(1);

//     const sentimentData = {
//         labels: ['Positive', 'Neutral', 'Negative'],
//         datasets: [
//             {
//                 label: 'Sentiment Analysis',
//                 data: [positivePercentage, neutralPercentage, negativePercentage],
//                 backgroundColor: ['#4caf50', '#ffeb3b', '#f44336'],
//                 hoverBackgroundColor: ['#45b745', '#ffee58', '#f6685e'],
//                 borderWidth: 1,
//             },
//         ],
//     };

//     if (loading) return <div>Loading...</div>;
//     if (error) return <div>{error}</div>;
//     if (!user) return <div>No user data available.</div>;

//     return (
//         <div className="max-w-6xl mx-auto p-6 mt-5 bg-gradient-to-br from-blue-50 via-white to-gray-100 rounded-lg shadow-lg">
//             {/* User Info Section */}
//             <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-6 mb-8">
//                 <div className="relative">
//                     <img
//                         src={user.profilePicture || defaultImage}
//                         alt={user.username}
//                         className="w-36 h-36 lg:w-48 lg:h-48 rounded-full object-cover shadow-lg"
//                     />
//                 </div>
//                 <div className="flex-1">
//                     <div className="flex items-center justify-between mb-4">
//                         <h1 className="text-3xl lg:text-4xl font-extrabold">{user.username}</h1>
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
//                     <div className="flex justify-between lg:justify-start lg:space-x-8 mb-4">
//                         <div className="text-center">
//                             <p className="text-2xl font-bold">{user.posts.length}</p>
//                             <p className="text-gray-500">Posts</p>
//                         </div>
//                         <div className="text-center">
//                             <p className="text-2xl font-bold">{user.followers.length}</p>
//                             <p className="text-gray-500">Followers</p>
//                         </div>
//                         <div className="text-center">
//                             <p className="text-2xl font-bold">{user.following.length}</p>
//                             <p className="text-gray-500">Following</p>
//                         </div>
//                     </div>
//                     <div className="text-lg font-semibold">{user.fullName}</div>
//                     <div className="text-gray-700">{user.bio}</div>
//                 </div>
//             </div>

//             {/* Toggle Buttons */}
//             <div className="flex justify-center space-x-4 mb-6">
//                 <button
//                     onClick={() => setActiveTab('posts')}
//                     className={`px-4 py-2 rounded-lg font-semibold transition ${activeTab === 'posts' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
//                         }`}
//                 >
//                     Posts
//                 </button>
//                 <button
//                     onClick={() => setActiveTab('sentiment')}
//                     className={`px-4 py-2 rounded-lg font-semibold transition ${activeTab === 'sentiment' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
//                         }`}
//                 >
//                     Sentiment
//                 </button>
//             </div>

//             {/* Sliding Transition */}
//             <div className="relative h-[70vh] overflow-hidden">
//                 <div
//                     className="absolute inset-0 flex transition-transform duration-500"
//                     style={{
//                         transform: `translateX(${activeTab === 'posts' ? '0' : '-100%'})`,
//                     }}
//                 >
//                     {/* Posts Section */}
//                     <div className="w-full flex-shrink-0 p-6">
//                         <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
//                             {user.posts.length > 0 ? (
//                                 user.posts.map((post, index) => (
//                                     <div key={index} className="relative group overflow-hidden rounded-lg shadow-lg">
//                                         {post.images.length > 1 ? (
//                                             // ✅ Swiper for multiple images
//                                             <Swiper
//                                                 navigation
//                                                 pagination={{ clickable: true }}
//                                                 modules={[Navigation, Pagination]} // 🔥 Fix: Correct module usage
//                                                 className="w-full h-full"
//                                             >
//                                                 {post.images.map((image, imgIndex) => (
//                                                     <SwiperSlide key={imgIndex}>
//                                                         <img
//                                                             src={image}
//                                                             alt={`Post ${index + 1} - Image ${imgIndex + 1}`}
//                                                             className="w-full h-full object-cover"
//                                                         />
//                                                     </SwiperSlide>
//                                                 ))}
//                                             </Swiper>
//                                         ) : (
//                                             // ✅ Single image display
//                                             <img
//                                                 src={post.images?.[0] || "https://via.placeholder.com/150"}
//                                                 alt={`Post ${index + 1}`}
//                                                 className="w-full h-full object-cover"
//                                             />
//                                         )}
//                                         <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-50 transition"></div>
//                                     </div>
//                                 ))
//                             ) : (
//                                 <p className="text-gray-500 text-center">No posts available.</p>
//                             )}
//                         </div>
//                     </div>



//                     {/* Sentiment Section */}
//                     <div className="w-full flex-shrink-0 flex flex-col justify-center items-center p-6">
//                         <div className="max-w-md mx-auto">
//                             <Doughnut data={sentimentData} />
//                         </div>
//                         <p className="mt-4 text-center text-gray-700 text-lg">
//                             This user's posts have an overall sentiment of{' '}
//                             <span className={`font-bold ${positivePercentage > 50 ? 'text-green-600' : 'text-red-600'}`}>
//                                 {positivePercentage}% Positive
//                             </span>.
//                         </p>
//                         <p className="mt-2 text-gray-600 text-center">
//                             Breakdown: {positivePercentage}% Positive, {neutralPercentage}% Neutral, {negativePercentage}% Negative.
//                         </p>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default UserProfile;


// import React, { useState, useEffect, useCallback } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';
// import { Doughnut } from 'react-chartjs-2';
// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
// import { Swiper, SwiperSlide } from "swiper/react";
// import { motion } from "framer-motion";
// import { FiUser, FiPlus, FiUsers, FiImage, FiHeart } from "react-icons/fi";
// import "swiper/css";
// import "swiper/css/navigation";
// import "swiper/css/pagination";
// import { Navigation, Pagination } from "swiper/modules";


// ChartJS.register(ArcElement, Tooltip, Legend);

// const UserProfile = () => {
//     const { userId } = useParams();
//     const [user, setUser] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [isFollowing, setIsFollowing] = useState(false);
//     const [activeTab, setActiveTab] = useState('posts'); // Tracks active section: 'posts' or 'sentiment'

//     const defaultImage = "https://via.placeholder.com/150";

//     // Fetch user data based on userId
//     useEffect(() => {
//         const fetchUser = async () => {
//             try {
//                 const response = await axios.get(`http://localhost:3000/api/users/${userId}`);
//                 console.log("User API Response:", response.data); // ✅ Debugging
//                 setUser(response.data);
//                 setIsFollowing(response.data.followers.includes(userId));
//                 setLoading(false);
//             } catch (err) {
//                 setError("Failed to fetch user data: ", err);
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

//     // Hardcoded sentiment data
//     const postsSentiments = [
//         { postId: 1, sentiment: 'positive' },
//         { postId: 2, sentiment: 'positive' },
//         { postId: 3, sentiment: 'negative' },
//     ];

//     // Calculate sentiment percentages
//     const totalPosts = postsSentiments.length;
//     const sentimentCounts = postsSentiments.reduce(
//         (acc, post) => {
//             acc[post.sentiment]++;
//             return acc;
//         },
//         { positive: 0, neutral: 0, negative: 0 }
//     );

//     const positivePercentage = ((sentimentCounts.positive / totalPosts) * 100).toFixed(1);
//     const neutralPercentage = ((sentimentCounts.neutral / totalPosts) * 100).toFixed(1);
//     const negativePercentage = ((sentimentCounts.negative / totalPosts) * 100).toFixed(1);

//     // Enhanced sentiment data visualization
//     const sentimentData = {
//         labels: ['Positive', 'Neutral', 'Negative'],
//         datasets: [{
//             data: [positivePercentage, neutralPercentage, negativePercentage],
//             backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
//             borderColor: 'transparent',
//             hoverOffset: 20,
//             cutout: '75%',
//             hoverBackgroundColor: ['#34d399', '#fbbf24', '#f87171']
//         }]
//     };

//     const chartOptions = {
//         plugins: {
//             legend: {
//                 position: 'bottom',
//                 labels: {
//                     color: '#fff',
//                     font: {
//                         size: 14
//                     }
//                 }
//             },
//             tooltip: {
//                 enabled: true,
//                 bodyColor: '#fff',
//                 titleColor: '#fff',
//                 backgroundColor: 'rgba(0,0,0,0.9)',
//                 borderColor: 'rgba(255,255,255,0.1)',
//                 borderWidth: 1
//             }
//         }
//     };



//     // ... [Keep loading/error handling the same] ...

//     return (
//         <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800"
//         >
//             <style>
//                 {`
//                 .swiper-button-next, .swiper-button-prev {
//                     color: #fff !important;
//                     background: rgba(255,255,255,0.1);
//                     padding: 16px;
//                     border-radius: 50%;
//                     backdrop-filter: blur(4px);
//                 }
//                 .swiper-pagination-bullet {
//                     background: #fff !important;
//                     opacity: 0.5;
//                 }
//                 .swiper-pagination-bullet-active {
//                     opacity: 1 !important;
//                 }
//                 `}
//             </style>

//             <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//                 {/* Profile Header */}
//                 <motion.div
//                     initial={{ y: 20, opacity: 0 }}
//                     animate={{ y: 0, opacity: 1 }}
//                     className="bg-gray-800 rounded-3xl shadow-2xl p-6 mb-8 border border-gray-700"
//                 >
//                     <div className="flex flex-col lg:flex-row items-center gap-8">
//                         <div className="relative group">
//                             <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-emerald-400 rounded-full blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
//                             <img
//                                 src={user.profilePicture || defaultImage}
//                                 alt={user.username}
//                                 className="w-32 h-32 lg:w-40 lg:h-40 rounded-full object-cover border-4 border-gray-800 shadow-2xl relative hover:border-emerald-400 transition-all"
//                             />
//                         </div>

//                         <div className="flex-1 space-y-4">
//                             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//                                 <div>
//                                     <h1 className="text-3xl font-bold text-white">{user.username}</h1>
//                                     <p className="text-lg text-emerald-400">{user.fullName}</p>
//                                 </div>
//                                 <motion.button
//                                     whileHover={{ scale: 1.05 }}
//                                     whileTap={{ scale: 0.95 }}
//                                     onClick={isFollowing ? handleUnfollow : handleFollow}
//                                     className={`px-6 py-3 rounded-xl font-semibold transition-all shadow-lg ${
//                                         isFollowing
//                                             ? 'bg-gradient-to-br from-red-500 to-red-600 hover:shadow-red-500/30'
//                                             : 'bg-gradient-to-br from-blue-500 to-emerald-500 hover:shadow-emerald-500/30'
//                                     }`}
//                                 >
//                                     {isFollowing ? 'Unfollow' : 'Follow'}
//                                 </motion.button>
//                             </div>

//                             <p className="text-gray-300 leading-relaxed">{user.bio}</p>

//                             <div className="flex justify-center lg:justify-start gap-8">
//                                 {[
//                                     { count: user.posts.length, icon: FiImage, label: 'Posts' },
//                                     { count: user.followers.length, icon: FiUsers, label: 'Followers' },
//                                     { count: user.following.length, icon: FiUser, label: 'Following' },
//                                 ].map((stat, idx) => (
//                                     <div key={idx} className="text-center group">
//                                         <div className="text-2xl font-bold text-emerald-400">{stat.count}</div>
//                                         <div className="text-gray-400 flex items-center gap-1 transition-colors group-hover:text-white">
//                                             <stat.icon className="w-4 h-4" />
//                                             {stat.label}
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>
//                     </div>
//                 </motion.div>

//                 {/* Navigation Tabs */}
//                 <div className="flex justify-center mb-8">
//                     <div className="bg-gray-800 p-2 rounded-2xl shadow-lg flex gap-2 border border-gray-700">
//                         {['posts', 'sentiment'].map((tab) => (
//                             <motion.button
//                                 key={tab}
//                                 whileHover={{ scale: 1.05 }}
//                                 onClick={() => setActiveTab(tab)}
//                                 className={`px-6 py-3 rounded-xl font-medium transition-all ${
//                                     activeTab === tab
//                                         ? 'bg-gradient-to-br from-blue-500 to-emerald-500 text-white shadow-lg shadow-emerald-500/20'
//                                         : 'text-gray-400 hover:bg-gray-700 hover:text-white'
//                                 }`}
//                             >
//                                 {tab.charAt(0).toUpperCase() + tab.slice(1)}
//                             </motion.button>
//                         ))}
//                     </div>
//                 </div>

//                 {/* Content Sections */}
//                 <motion.div
//                     key={activeTab}
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.3 }}
//                 >
//                     {activeTab === 'posts' ? (
//                         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//                             {user.posts.length > 0 ? (
//                                 user.posts.map((post, index) => (
//                                     <motion.div
//                                         key={index}
//                                         whileHover={{ scale: 1.02 }}
//                                         className="group relative overflow-hidden rounded-2xl shadow-xl bg-gray-800 border border-gray-700"
//                                     >
//                                         <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>

//                                         {post.images.length > 1 ? (
//                                             <Swiper
//                                                 navigation
//                                                 pagination={{ clickable: true }}
//                                                 modules={[Navigation, Pagination]}
//                                                 className="h-64"
//                                             >
//                                                 {post.images.map((image, imgIndex) => (
//                                                     <SwiperSlide key={imgIndex}>
//                                                         <img
//                                                             src={image}
//                                                             alt={`Post ${index + 1}`}
//                                                             className="w-full h-full object-cover transition-transform group-hover:scale-105"
//                                                         />
//                                                     </SwiperSlide>
//                                                 ))}
//                                             </Swiper>
//                                         ) : (
//                                             <img
//                                                 src={post.images?.[0] || defaultImage}
//                                                 alt={`Post ${index + 1}`}
//                                                 className="w-full h-64 object-cover transition-transform group-hover:scale-105"
//                                             />
//                                         )}

//                                         <div className="absolute bottom-0 left-0 right-0 p-4 z-20 text-white">
//                                             <div className="flex items-center gap-2 text-emerald-400">
//                                                 <FiHeart className="w-5 h-5" />
//                                                 <span>{post.likes || 0} Likes</span>
//                                             </div>
//                                         </div>
//                                     </motion.div>
//                                 ))
//                             ) : (
//                                 <div className="col-span-full text-center py-12 text-gray-400">
//                                     <FiImage className="w-16 h-16 mx-auto mb-4 text-gray-600" />
//                                     No posts yet
//                                 </div>
//                             )}
//                         </div>
//                     ) : (
//                         <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-2xl mx-auto border border-gray-700">
//                             <div className="flex flex-col lg:flex-row items-center gap-8">
//                                 <div className="w-48 h-48 relative">
//                                     <Doughnut
//                                         data={sentimentData}
//                                         options={chartOptions}
//                                     />
//                                 </div>

//                                 <div className="space-y-4 flex-1">
//                                     <h3 className="text-2xl font-bold text-white">Sentiment Analysis</h3>
//                                     <div className="space-y-3">
//                                         {[
//                                             { label: 'Positive', value: positivePercentage, color: '#10b981' },
//                                             { label: 'Neutral', value: neutralPercentage, color: '#f59e0b' },
//                                             { label: 'Negative', value: negativePercentage, color: '#ef4444' },
//                                         ].map((item, idx) => (
//                                             <div key={idx} className="flex items-center gap-3">
//                                                 <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
//                                                 <div className="flex-1">
//                                                     <div className="flex justify-between text-white">
//                                                         <span>{item.label}</span>
//                                                         <span className="font-semibold">{item.value}%</span>
//                                                     </div>
//                                                     <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
//                                                         <motion.div
//                                                             initial={{ width: 0 }}
//                                                             animate={{ width: `${item.value}%` }}
//                                                             transition={{ duration: 0.8 }}
//                                                             className="h-full rounded-full relative"
//                                                             style={{ backgroundColor: item.color }}
//                                                         >
//                                                             <div className="absolute inset-0 bg-current opacity-20 animate-pulse"></div>
//                                                         </motion.div>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         ))}
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     )}
//                 </motion.div>
//             </div>
//         </motion.div>
//     );
// };

// export default UserProfile;

// import React, { useState, useEffect, useCallback } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';
// import { Doughnut } from 'react-chartjs-2';
// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
// import { Swiper, SwiperSlide } from "swiper/react";
// import { motion, AnimatePresence } from "framer-motion";
// import { FiUser, FiPlus, FiUsers, FiImage, FiHeart, FiX, FiMessageCircle } from "react-icons/fi";
// import "swiper/css";
// import "swiper/css/navigation";
// import "swiper/css/pagination";
// import { Navigation, Pagination } from "swiper/modules";

// ChartJS.register(ArcElement, Tooltip, Legend);

// const UserProfile = () => {
//     const { userId } = useParams();
//     const [user, setUser] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [isFollowing, setIsFollowing] = useState(false);
//     const [activeTab, setActiveTab] = useState('posts');
//     const [followList, setFollowList] = useState(null);
//     const [listType, setListType] = useState(null);
//     const [listLoading, setListLoading] = useState(false);
//     const [sentimentStats, setSentimentStats] = useState({
//         positive: 0,
//         neutral: 0,
//         negative: 0
//     });


//     const defaultImage = "https://via.placeholder.com/150";

//     // Fetch main user data
//     useEffect(() => {
//         const fetchUser = async () => {
//             try {
//                 const response = await axios.get(`http://localhost:3000/api/users/${userId}`);
//                 setUser(response.data);
//                 setIsFollowing(response.data.followers.includes(userId));
//                 setLoading(false);
//             } catch (err) {
//                 setError("Failed to fetch user data");
//                 setLoading(false);
//             }
//         };
//         fetchUser();
//     }, [userId]);

// useEffect(() => {
//     const fetchSentimentStats = async () => {
//         try {
//             const token = localStorage.getItem('token'); // Get the stored token
//             const response = await axios.get(`http://localhost:3000/api/users/user/${userId}/sentiment-stats`, {
//                 headers: { Authorization: `Bearer ${token}` }, // Send token in request
//             });
//             setSentimentStats(response.data);
//         } catch (error) {
//             console.error("Error fetching sentiment stats:", error);
//         }
//     };

//     fetchSentimentStats();
// }, [userId]);

//     // Fetch followers/following list
//     const fetchFollowList = async (type) => {
//         setListLoading(true);
//         try {
//             const token = localStorage.getItem('token'); // Get the token
//             const response = await axios.get(
//                 `http://localhost:3000/api/users/followers-following/${userId}?type=${type}`,
//                 {
//                     headers: {
//                         Authorization: `Bearer ${token}` // Add authorization header
//                     }
//                 }
//             );
//             setFollowList(response.data[type]);
//             setListType(type);
//         } catch (error) {
//             console.error('Error fetching list:', error);
//             setFollowList(null);
//         }
//         setListLoading(false);
//     };

//     // Follow/Unfollow handlers
//     const handleFollow = useCallback(async () => {
//         try {
//             const token = localStorage.getItem('token');
//             await axios.put(`http://localhost:3000/api/users/${userId}/follow`, {}, {
//                 headers: { Authorization: `Bearer ${token}` }
//             });
//             setUser(prev => ({
//                 ...prev,
//                 followers: [...prev.followers, userId]
//             }));
//             setIsFollowing(true);
//         } catch (error) {
//             console.error('Follow error:', error);
//         }
//     }, [userId]);

//     const handleUnfollow = useCallback(async () => {
//         try {
//             const token = localStorage.getItem('token');
//             await axios.put(`http://localhost:3000/api/users/${userId}/unfollow`, {}, {
//                 headers: { Authorization: `Bearer ${token}` }
//             });
//             setUser(prev => ({
//                 ...prev,
//                 followers: prev.followers.filter(id => id !== userId)
//             }));
//             setIsFollowing(false);
//         } catch (error) {
//             console.error('Unfollow error:', error);
//         }
//     }, [userId]);

//     const sentimentData = {
//         labels: ['Positive', 'Neutral', 'Negative'],
//         datasets: [{
//             data: [
//                 sentimentStats.positive,
//                 sentimentStats.neutral,
//                 sentimentStats.negative
//             ],
//             backgroundColor: ['#00ff88', '#ffd700', '#ff0000'],
//             borderColor: 'transparent',
//             hoverOffset: 20,
//             cutout: '75%',
//         }]
//     };

//     const chartOptions = {
//         plugins: {
//             legend: {
//                 position: 'bottom',
//                 labels: { color: '#fff', font: { size: 14, family: 'Inter' }, padding: 20 }
//             },
//             tooltip: {
//                 bodyColor: '#fff',
//                 titleColor: '#00ff88',
//                 backgroundColor: 'rgba(0,0,0,0.9)',
//                 borderColor: '#00ff88',
//             },
//             layout: {
//                 padding: {
//                     bottom: 20, // Add padding at the bottom to prevent cutoff
//                 },
//             },
//             responsive: true,
//             //   maintainAspectRatio: false,
//         }
//     };

//     // Loading state
//     if (loading) {
//         return (
//             <div className="min-h-screen bg-black flex items-center justify-center">
//                 <div className="animate-pulse text-cyan-400 text-xl">Loading...</div>
//             </div>
//         );
//     }

//     // Error state
//     if (error) {
//         return (
//             <div className="min-h-screen bg-black flex items-center justify-center">
//                 <div className="text-red-500 text-xl">{error}</div>
//             </div>
//         );
//     }

//     return (
//         <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800"
//         >
//             <style>{`
//                 .swiper-button-next, .swiper-button-prev {
//                     color: #10b981 !important;
//                     background: rgba(16,185,129,0.1);
//                     padding: 16px;
//                     border-radius: 50%;
//                 }
//                 .swiper-pagination-bullet { background: #10b981 !important; opacity: 0.5; }
//                 .swiper-pagination-bullet-active { opacity: 1 !important; }
//             `}</style>

//             {/* Follow List Modal */}
//             <AnimatePresence>
//                 {followList !== null && (
//                     <motion.div
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         exit={{ opacity: 0 }}
//                         className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center"
//                         onClick={() => setFollowList(null)}
//                     >
//                         <motion.div
//                             initial={{ y: 50, opacity: 0 }}
//                             animate={{ y: 0, opacity: 1 }}
//                             exit={{ y: 50, opacity: 0 }}
//                             className="bg-gray-800 rounded-2xl p-6 w-full max-w-md border border-gray-700"
//                             onClick={(e) => e.stopPropagation()}
//                         >
//                             <div className="flex justify-between items-center mb-4">
//                                 <h3 className="text-xl font-bold text-white capitalize">
//                                     {listType} ({followList.length})
//                                 </h3>
//                                 <button
//                                     onClick={() => setFollowList(null)}
//                                     className="text-gray-400 hover:text-white p-2"
//                                 >
//                                     <FiX size={24} />
//                                 </button>
//                             </div>

//                             {listLoading ? (
//                                 <div className="text-center py-4">
//                                     <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-400 mx-auto" />
//                                 </div>
//                             ) : (
//                                 <div className="space-y-4 max-h-96 overflow-y-auto">
//                                     {followList.length === 0 ? (
//                                         <div className="text-center py-4 text-gray-400">
//                                             No {listType} found
//                                         </div>
//                                     ) : (
//                                         followList.map((user) => (
//                                             <div
//                                                 key={user.id}
//                                                 className="flex items-center gap-4 p-3 hover:bg-gray-700/50 rounded-xl transition-colors"
//                                             >
//                                                 <img
//                                                     src={user.profilePicture || defaultImage}
//                                                     alt={user.name}
//                                                     className="w-12 h-12 rounded-full object-cover border border-gray-600"
//                                                 />
//                                                 <span className="text-white font-medium">
//                                                     {user.name}
//                                                 </span>
//                                             </div>
//                                         ))
//                                     )}
//                                 </div>
//                             )}
//                         </motion.div>
//                     </motion.div>
//                 )}
//             </AnimatePresence>

//             {/* Main Profile Content */}
//             <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//                 {/* Profile Header */}
//                 <motion.div
//                     className="bg-gray-800 rounded-3xl shadow-2xl p-6 mb-8 border border-gray-700 relative"
//                     style={{
//                         background: 'linear-gradient(145deg, rgba(16,185,129,0.05) 0%, rgba(31,41,55,0.5) 100%)'
//                     }}
//                 >
//                     <div className="flex flex-col lg:flex-row items-center gap-8">
//                         {/* Profile Image */}
//                         <div className="relative group">
//                             <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl opacity-40 group-hover:opacity-60 transition-opacity" />
//                             <img
//                                 src={user?.profilePicture || defaultImage}
//                                 alt={user?.username}
//                                 className="w-32 h-32 lg:w-40 lg:h-40 rounded-full object-cover border-4 border-gray-800 shadow-2xl relative hover:border-emerald-400 transition-all"
//                             />
//                         </div>

//                         {/* User Info & Actions */}
//                         <div className="flex-1 space-y-4">
//                             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//                                 <div>
//                                     <h1 className="text-3xl font-bold text-white">{user?.username}</h1>
//                                     <p className="text-lg text-emerald-400">{user?.fullName}</p>
//                                 </div>
//                                 <motion.button
//                                     onClick={isFollowing ? handleUnfollow : handleFollow}
//                                     className={`px-6 py-3 rounded-xl font-semibold transition-all shadow-lg ${isFollowing
//                                         ? 'bg-gradient-to-br from-red-500/90 to-red-600/90 hover:shadow-red-500/30'
//                                         : 'bg-gradient-to-br from-emerald-500/90 to-green-500/90 hover:shadow-emerald-500/30'
//                                         }`}
//                                 >
//                                     {isFollowing ? 'Unfollow' : 'Follow'}
//                                 </motion.button>
//                             </div>

//                             <p className="text-gray-300 leading-relaxed">{user?.bio}</p>

//                             {/* Stats Section */}
//                             <div className="flex justify-center lg:justify-start gap-8">
//                                 {[
//                                     { count: user?.posts?.length || 0, icon: FiImage, label: 'Posts' },
//                                     {
//                                         count: user?.followers?.length || 0,
//                                         icon: FiUsers,
//                                         label: 'Followers',
//                                         onClick: () => fetchFollowList('followers')
//                                     },
//                                     {
//                                         count: user?.following?.length || 0,
//                                         icon: FiUser,
//                                         label: 'Following',
//                                         onClick: () => fetchFollowList('following')
//                                     },
//                                 ].map((stat, idx) => (
//                                     <button
//                                         key={idx}
//                                         onClick={stat.onClick || (() => { })}
//                                         className={`text-center group ${stat.onClick ? 'cursor-pointer hover:scale-105 transition-transform' : ''}`}
//                                     >
//                                         <div className="text-2xl font-bold text-emerald-400">{stat.count}</div>
//                                         <div className={`text-gray-400 flex items-center gap-1 ${stat.onClick ? 'transition-colors group-hover:text-emerald-300' : ''}`}>
//                                             <stat.icon className="w-4 h-4" />
//                                             {stat.label}
//                                         </div>
//                                     </button>
//                                 ))}
//                             </div>
//                         </div>
//                     </div>

//                     {/* Sentiment Analysis Section */}
//                     {user?.posts?.length > 0 && (
//                         <div className="mt-6 p-4 bg-gray-900/50 rounded-2xl border border-gray-700">
//                             <h3 className="text-xl font-semibold text-white mb-4">Post Sentiment Analysis</h3>

//                             {/* Sentiment Stats */}
//                             <div className="flex justify-between items-center">
//                                 {/* In the sentiment tab section, replace the map function with: */}
//                                 {[
//                                     { label: 'Positive', value: sentimentStats.positive, color: '#10b981' },
//                                     { label: 'Neutral', value: sentimentStats.neutral, color: '#f59e0b' },
//                                     { label: 'Negative', value: sentimentStats.negative, color: '#ef4444' },
//                                 ].map((item, idx) => (
//                                     <div key={idx} className="flex items-center gap-3">
//                                         <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
//                                         <div className="flex-1">
//                                             <div className="flex justify-between text-white">
//                                                 <span>{item.label}</span>
//                                                 <span className="font-semibold">{item.value}%</span>
//                                             </div>
//                                             <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
//                                                 <motion.div
//                                                     initial={{ width: 0 }}
//                                                     animate={{ width: `${item.value}%` }}
//                                                     style={{ backgroundColor: item.color }}
//                                                     className="h-full rounded-full relative"
//                                                     transition={{ duration: 0.8 }}
//                                                 />
//                                             </div>
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>
//                     )}
//                 </motion.div>


//                 {/* Navigation Tabs */}
//                 <div className="flex justify-center mb-8">
//                     <div className="bg-gray-800 p-2 rounded-2xl shadow-lg flex gap-2 border border-gray-700">
//                         {['posts', 'sentiment'].map((tab) => (
//                             <motion.button
//                                 key={tab}
//                                 onClick={() => setActiveTab(tab)}
//                                 className={`px-6 py-3 rounded-xl font-medium transition-all ${activeTab === tab
//                                     ? 'bg-gradient-to-br from-emerald-500/80 to-green-500/80 text-white shadow-lg shadow-emerald-500/20'
//                                     : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'
//                                     }`}
//                             >
//                                 {tab.charAt(0).toUpperCase() + tab.slice(1)}
//                             </motion.button>
//                         ))}
//                     </div>
//                 </div>

//                 {/* Content Sections */}
//                 {activeTab === 'posts' ? (
//                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//                         {user?.posts?.length > 0 ? (
//                             user.posts.map((post, index) => (
//                                 <motion.div
//                                     key={index}
//                                     className="group relative overflow-hidden rounded-2xl bg-gray-800 border border-gray-700"
//                                 >
//                                     {/* Post Images */}
//                                     {post.images.length > 1 ? (
//                                         <Swiper
//                                             navigation
//                                             pagination={{ clickable: true }}
//                                             modules={[Navigation, Pagination]}
//                                             className="h-64"
//                                         >
//                                             {post.images.map((image, imgIndex) => (
//                                                 <SwiperSlide key={imgIndex}>
//                                                     <img
//                                                         src={image}
//                                                         alt={`Post ${index + 1}`}
//                                                         className="w-full h-full object-cover transition-transform group-hover:scale-105"
//                                                     />
//                                                 </SwiperSlide>
//                                             ))}
//                                         </Swiper>
//                                     ) : (
//                                         <img
//                                             src={post.images?.[0] || defaultImage}
//                                             alt={`Post ${index + 1}`}
//                                             className="w-full h-64 object-cover transition-transform group-hover:scale-105"
//                                         />
//                                     )}

//                                     {/* Likes & Comments Icons (Hidden by Default, Show on Hover) */}
//                                     <div className="absolute bottom-0 left-0 right-0 p-4 z-20 text-white 
//                 flex justify-between items-center bg-gray-900/80 rounded-b-2xl 
//                 opacity-0 group-hover:opacity-100 transition-opacity duration-300">

//                                         <div className="flex items-center gap-2 text-emerald-400">
//                                             <FiHeart className="w-5 h-5" />
//                                             <span className="text-sm">{Array.isArray(post.likes) ? post.likes.length : 0}</span>
//                                         </div>

//                                         <div className="flex items-center gap-2 text-blue-400">
//                                             <FiMessageCircle className="w-5 h-5" />
//                                             <span className="text-sm">{Array.isArray(post.comments) ? post.comments.length : 0}</span>
//                                         </div>
//                                     </div>
//                                 </motion.div>
//                             ))
//                         ) : (
//                             <div className="col-span-full text-center py-12 text-gray-400">
//                                 <FiImage className="w-16 h-16 mx-auto mb-4 text-gray-600" />
//                                 No posts yet
//                             </div>
//                         )}

//                     </div>
//                 ) : (
//                     <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-2xl mx-auto border  border-gray-700">
//                         <div className="flex flex-col lg:flex-row items-center gap-8">
//                             {/* Doughnut Chart */}
//                             <div className="w-52 h-52 chart-container relative">
//                                 <Doughnut
//                                     data={sentimentData}
//                                     options={chartOptions}
//                                 />
//                             </div>

//                             {/* Sentiment Breakdown */}
//                             <div className="space-y-4 flex-1">
//                                 <h3 className="text-2xl font-bold text-white">Sentiment Analysis</h3>
//                                 <div className="space-y-3">
//                                     {[
//                                         { label: 'Positive', value: sentimentStats.positive, color: '#10b981' },
//                                         { label: 'Neutral', value: sentimentStats.neutral, color: '#f59e0b' },
//                                         { label: 'Negative', value: sentimentStats.negative, color: '#ef4444' },
//                                     ].map((item, idx) => (
//                                         <div key={idx} className="flex items-center gap-3">
//                                             <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
//                                             <div className="flex-1">
//                                                 <div className="flex justify-between text-white">
//                                                     <span>{item.label}</span>
//                                                     <span className="font-semibold">{item.value}%</span>
//                                                 </div>
//                                                 <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
//                                                     <motion.div
//                                                         initial={{ width: 0 }}
//                                                         animate={{ width: `${item.value}%` }}
//                                                         style={{ backgroundColor: item.color }}
//                                                         className="h-full rounded-full relative"
//                                                         transition={{ duration: 0.8, type: 'spring' }}
//                                                     />
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     ))}
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </motion.div>
//     );
// };


// export default UserProfile;



import { useState, useEffect, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Swiper, SwiperSlide } from "swiper/react";
import { motion, AnimatePresence } from "framer-motion";
import { FiUser, FiPlus, FiUsers, FiImage, FiHeart, FiX, FiMessageCircle, FiSettings } from "react-icons/fi";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";

import jwtDecode from "jwt-decode"; // Add this import at the top


ChartJS.register(ArcElement, Tooltip, Legend);

const UserProfile = () => {
    const { userId } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFollowing, setIsFollowing] = useState(false);
    const [activeTab, setActiveTab] = useState('posts');
    const [followList, setFollowList] = useState(null);
    const [listType, setListType] = useState(null);
    const [listLoading, setListLoading] = useState(false);
    const [sentimentStats, setSentimentStats] = useState({
        positive: 0,
        neutral: 0,
        negative: 0
    });

    const [followRequestStatus, setFollowRequestStatus] = useState(null); // null, 'requested', or 'following'
    const [currentUserId, setCurrentUserId] = useState(null);

    const defaultImage = "https://via.placeholder.com/150";

    // Fetch main user data
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(`http://localhost:3000/api/users/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUser(response.data);

                // Check if the logged-in user has sent a follow request
                const hasSentRequest = response.data.followRequests.some(
                    (req) => req.from.toString() === currentUserId
                );

                // Check if the logged-in user is already following
                const isFollowing = response.data.followers.includes(currentUserId);

                if (isFollowing) {
                    setFollowRequestStatus("following");
                } else if (hasSentRequest) {
                    setFollowRequestStatus("requested");
                } else {
                    setFollowRequestStatus(null);
                }

                setLoading(false);
            } catch (err) {
                setError("Failed to fetch user data");
                setLoading(false);
            }
        };
        fetchUser();
    }, [userId, currentUserId]);

    useEffect(() => {
        const fetchSentimentStats = async () => {
            try {
                const token = localStorage.getItem('token'); // Get the stored token
                const response = await axios.get(`http://localhost:3000/api/users/user/${userId}/sentiment-stats`, {
                    headers: { Authorization: `Bearer ${token}` }, // Send token in request
                });
                setSentimentStats(response.data);
            } catch (error) {
                console.error("Error fetching sentiment stats:", error);
            }
        };

        fetchSentimentStats();
    }, [userId]);


    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decodedToken = jwtDecode(token); // Direct usage now
                setCurrentUserId(decodedToken.id);
            } catch (error) {
                console.error("Error decoding token:", error);
            }
        }
    }, []);

    // Fetch followers/following list
    const fetchFollowList = async (type) => {
        setListLoading(true);
        try {
            const token = localStorage.getItem('token'); // Get the token
            const response = await axios.get(
                `http://localhost:3000/api/users/followers-following/${userId}?type=${type}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}` // Add authorization header
                    }
                }
            );
            setFollowList(response.data[type]);
            setListType(type);
        } catch (error) {
            console.error('Error fetching list:', error);
            setFollowList(null);
        }
        setListLoading(false);
    };

    // Follow/Unfollow handlers
    const handleFollow = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:3000/api/users/${userId}/follow`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUser(prev => ({
                ...prev,
                followers: [...prev.followers, userId]
            }));
            setIsFollowing(true);
        } catch (error) {
            console.error('Follow error:', error);
        }
    }, [userId]);

    const handleUnfollow = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:3000/api/users/${userId}/unfollow`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUser(prev => ({
                ...prev,
                followers: prev.followers.filter(id => id !== userId)
            }));
            setIsFollowing(false);
        } catch (error) {
            console.error('Unfollow error:', error);
        }
    }, [userId]);

    const handleFollowClick = async () => {
        if (followRequestStatus === null) {
            // Send follow request
            await handleSendFollowRequest(userId);
            setFollowRequestStatus("requested");
        } else if (followRequestStatus === "requested") {
            // Cancel follow request (optional)
            await handleRejectRequest(userId);
            setFollowRequestStatus(null);
        } else if (followRequestStatus === "following") {
            // Unfollow
            await handleUnfollow(userId);
            setFollowRequestStatus(null);
        }
    };

    const handleSendFollowRequest = async (userId) => {
        try {
            console.log("Sending follow request to:", userId); // Debug log to verify userId
            const token = localStorage.getItem('token');
            if (!token) throw new Error('Token not found');

            const response = await axios.post(
                `http://localhost:3000/api/users/${userId}/request-follow`, // Check this URL
                {}, // Empty body, if no additional data is required
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 200) {
                console.log('Follow request sent successfully:', response.data);
            }
        } catch (error) {
            console.error('Error sending follow request:', error.response || error.message);
        }
    };

    const handleRejectRequest = async (userId) => { // Changed parameter
        try {
            const token = localStorage.getItem("token");
            await axios.put(
                `http://localhost:3000/api/users/${userId}/reject-follow`, // Use userId directly
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setFollowRequestStatus(null); // Reset status
        } catch (error) {
            console.error("Error rejecting follow request:", error);
        }
    };

    const fetchFollowStatus = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`http://localhost:3000/api/users/${userId}/follow-status`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.data.isFollowing) {
                setFollowRequestStatus("following");
            } else if (response.data.hasSentRequest) {
                setFollowRequestStatus("requested");
            } else {
                setFollowRequestStatus(null);
            }
        } catch (error) {
            console.error("Error fetching follow status:", error);
        }
    };

    const sentimentData = {
        labels: ['Positive', 'Neutral', 'Negative'],
        datasets: [{
            data: [
                sentimentStats.positive,
                sentimentStats.neutral,
                sentimentStats.negative
            ],
            backgroundColor: ['#00ff88', '#ffd700', '#ff0000'],
            borderColor: 'transparent',
            hoverOffset: 20,
            cutout: '75%',
        }]
    };

    const chartOptions = {
        plugins: {
            legend: {
                position: 'bottom',
                labels: { color: '#fff', font: { size: 14, family: 'Inter' }, padding: 20 }
            },
            tooltip: {
                bodyColor: '#fff',
                titleColor: '#00ff88',
                backgroundColor: 'rgba(0,0,0,0.9)',
                borderColor: '#00ff88',
            },
            layout: {
                padding: {
                    bottom: 20, // Add padding at the bottom to prevent cutoff
                },
            },
            responsive: true,
            //   maintainAspectRatio: false,
        }
    };

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="animate-pulse text-cyan-400 text-xl">Loading...</div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-red-500 text-xl">{error}</div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800"
        >
            <style>{`
                .swiper-button-next, .swiper-button-prev {
                    color: #10b981 !important;
                    background: rgba(16,185,129,0.1);
                    padding: 16px;
                    border-radius: 50%;
                }
                .swiper-pagination-bullet { background: #10b981 !important; opacity: 0.5; }
                .swiper-pagination-bullet-active { opacity: 1 !important; }
            `}</style>

            {/* Follow List Modal */}
            <AnimatePresence>
                {followList !== null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center"
                        onClick={() => setFollowList(null)}
                    >
                        <motion.div
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 50, opacity: 0 }}
                            className="bg-gray-800 rounded-2xl p-6 w-full max-w-md border border-gray-700"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold text-white capitalize">
                                    {listType} ({followList.length})
                                </h3>
                                <button
                                    onClick={() => setFollowList(null)}
                                    className="text-gray-400 hover:text-white p-2"
                                >
                                    <FiX size={24} />
                                </button>
                            </div>

                            {listLoading ? (
                                <div className="text-center py-4">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-400 mx-auto" />
                                </div>
                            ) : (
                                <div className="space-y-4 max-h-96 overflow-y-auto">
                                    {followList.length === 0 ? (
                                        <div className="text-center py-4 text-gray-400">
                                            No {listType} found
                                        </div>
                                    ) : (
                                        followList.map((user) => (
                                            <div
                                                key={user.id}
                                                className="flex items-center gap-4 p-3 hover:bg-gray-700/50 rounded-xl transition-colors"
                                            >
                                                <img
                                                    src={user.profilePicture || defaultImage}
                                                    alt={user.name}
                                                    className="w-12 h-12 rounded-full object-cover border border-gray-600"
                                                />
                                                <span className="text-white font-medium">
                                                    {user.name}
                                                </span>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Profile Content */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Profile Header */}
                <motion.div
                    className="bg-gray-800 rounded-3xl shadow-2xl p-6 mb-8 border border-gray-700 relative"
                    style={{
                        background: 'linear-gradient(145deg, rgba(16,185,129,0.05) 0%, rgba(31,41,55,0.5) 100%)'
                    }}
                >
                    <div className="flex flex-col lg:flex-row items-center gap-8">
                        {/* Profile Image */}
                        <div className="relative group">
                            <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl opacity-40 group-hover:opacity-60 transition-opacity" />
                            <img
                                src={user?.profilePicture || defaultImage}
                                alt={user?.username}
                                className="w-32 h-32 lg:w-40 lg:h-40 rounded-full object-cover border-4 border-gray-800 shadow-2xl relative hover:border-emerald-400 transition-all"
                            />
                        </div>

                        {/* User Info & Actions */}
                        <div className="flex-1 space-y-4">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div>
                                    <h1 className="text-3xl font-bold text-white">{user?.username}</h1>
                                    <p className="text-lg text-emerald-400">{user?.fullName}</p>
                                </div>
                                {userId === currentUserId ? (
                                    <button className="px-6 py-3 rounded-xl font-semibold bg-gradient-to-br from-gray-700/90 to-gray-600/90 hover:shadow-lg transition-all flex items-center justify-center">
                                        <Link to="/edit-profile" className="...">
                                            <FiSettings /> Edit Profile
                                        </Link>
                                    </button>
                                ) : (
                                    <motion.button
                                        onClick={handleFollowClick}
                                        className={`px-6 py-3 rounded-xl font-semibold transition-all shadow-lg ${followRequestStatus === "following"
                                            ? "bg-gradient-to-br from-red-500/90 to-red-600/90 hover:shadow-red-500/30"
                                            : followRequestStatus === "requested"
                                                ? "bg-gradient-to-br from-yellow-500/90 to-yellow-600/90 hover:shadow-yellow-500/30"
                                                : "bg-gradient-to-br from-emerald-500/90 to-green-500/90 hover:shadow-emerald-500/30"
                                            }`}
                                    >
                                        {followRequestStatus === "following"
                                            ? "Following"
                                            : followRequestStatus === "requested"
                                                ? "Requested"
                                                : "Follow"}
                                    </motion.button>
                                )}
                            </div>

                            <p className="text-gray-300 leading-relaxed">{user?.bio}</p>

                            {/* Stats Section */}
                            <div className="flex justify-center lg:justify-start gap-8">
                                {[
                                    { count: user?.posts?.length || 0, icon: FiImage, label: 'Posts' },
                                    {
                                        count: user?.followers?.length || 0,
                                        icon: FiUsers,
                                        label: 'Followers',
                                        onClick: () => fetchFollowList('followers')
                                    },
                                    {
                                        count: user?.following?.length || 0,
                                        icon: FiUser,
                                        label: 'Following',
                                        onClick: () => fetchFollowList('following')
                                    },
                                ].map((stat, idx) => (
                                    <button
                                        key={idx}
                                        onClick={stat.onClick || (() => { })}
                                        className={`text-center group ${stat.onClick ? 'cursor-pointer hover:scale-105 transition-transform' : ''}`}
                                    >
                                        <div className="text-2xl font-bold text-emerald-400">{stat.count}</div>
                                        <div className={`text-gray-400 flex items-center gap-1 ${stat.onClick ? 'transition-colors group-hover:text-emerald-300' : ''}`}>
                                            <stat.icon className="w-4 h-4" />
                                            {stat.label}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sentiment Analysis Section */}
                    {user?.posts?.length > 0 && (
                        <div className="mt-6 p-4 bg-gray-900/50 rounded-2xl border border-gray-700">
                            <h3 className="text-xl font-semibold text-white mb-4">Post Sentiment Analysis</h3>

                            {/* Sentiment Stats */}
                            <div className="flex justify-between items-center">
                                {/* In the sentiment tab section, replace the map function with: */}
                                {[
                                    { label: 'Positive', value: sentimentStats.positive, color: '#10b981' },
                                    { label: 'Neutral', value: sentimentStats.neutral, color: '#f59e0b' },
                                    { label: 'Negative', value: sentimentStats.negative, color: '#ef4444' },
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-3">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                        <div className="flex-1">
                                            <div className="flex justify-between text-white">
                                                <span>{item.label}</span>
                                                <span className="font-semibold">{item.value}%</span>
                                            </div>
                                            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${item.value}%` }}
                                                    style={{ backgroundColor: item.color }}
                                                    className="h-full rounded-full relative"
                                                    transition={{ duration: 0.8 }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </motion.div>


                {/* Navigation Tabs */}
                <div className="flex justify-center mb-8">
                    <div className="bg-gray-800 p-2 rounded-2xl shadow-lg flex gap-2 border border-gray-700">
                        {['posts', 'sentiment'].map((tab) => (
                            <motion.button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 py-3 rounded-xl font-medium transition-all ${activeTab === tab
                                    ? 'bg-gradient-to-br from-emerald-500/80 to-green-500/80 text-white shadow-lg shadow-emerald-500/20'
                                    : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'
                                    }`}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </motion.button>
                        ))}
                    </div>
                </div>

                {/* Content Sections */}
                {activeTab === 'posts' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {user?.posts?.length > 0 ? (
                            user.posts.map((post, index) => (
                                <motion.div
                                    key={index}
                                    className="group relative overflow-hidden rounded-2xl bg-gray-800 border border-gray-700"
                                >
                                    {/* Post Images */}
                                    {post.images.length > 1 ? (
                                        <Swiper
                                            navigation
                                            pagination={{ clickable: true }}
                                            modules={[Navigation, Pagination]}
                                            className="h-64"
                                        >
                                            {post.images.map((image, imgIndex) => (
                                                <SwiperSlide key={imgIndex}>
                                                    <img
                                                        src={image}
                                                        alt={`Post ${index + 1}`}
                                                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                                    />
                                                </SwiperSlide>
                                            ))}
                                        </Swiper>
                                    ) : (
                                        <img
                                            src={post.images?.[0] || defaultImage}
                                            alt={`Post ${index + 1}`}
                                            className="w-full h-64 object-cover transition-transform group-hover:scale-105"
                                        />
                                    )}

                                    {/* Likes & Comments Icons (Hidden by Default, Show on Hover) */}
                                    <div className="absolute bottom-0 left-0 right-0 p-4 z-20 text-white 
                flex justify-between items-center bg-gray-900/80 rounded-b-2xl 
                opacity-0 group-hover:opacity-100 transition-opacity duration-300">

                                        <div className="flex items-center gap-2 text-emerald-400">
                                            <FiHeart className="w-5 h-5" />
                                            <span className="text-sm">{Array.isArray(post.likes) ? post.likes.length : 0}</span>
                                        </div>

                                        <div className="flex items-center gap-2 text-blue-400">
                                            <FiMessageCircle className="w-5 h-5" />
                                            <span className="text-sm">{Array.isArray(post.comments) ? post.comments.length : 0}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-12 text-gray-400">
                                <FiImage className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                                No posts yet
                            </div>
                        )}

                    </div>
                ) : (
                    <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-2xl mx-auto border  border-gray-700">
                        <div className="flex flex-col lg:flex-row items-center gap-8">
                            {/* Doughnut Chart */}
                            <div className="w-52 h-52 chart-container relative">
                                <Doughnut
                                    data={sentimentData}
                                    options={chartOptions}
                                />
                            </div>

                            {/* Sentiment Breakdown */}
                            <div className="space-y-4 flex-1">
                                <h3 className="text-2xl font-bold text-white">Sentiment Analysis</h3>
                                <div className="space-y-3">
                                    {[
                                        { label: 'Positive', value: sentimentStats.positive, color: '#10b981' },
                                        { label: 'Neutral', value: sentimentStats.neutral, color: '#f59e0b' },
                                        { label: 'Negative', value: sentimentStats.negative, color: '#ef4444' },
                                    ].map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-3">
                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                            <div className="flex-1">
                                                <div className="flex justify-between text-white">
                                                    <span>{item.label}</span>
                                                    <span className="font-semibold">{item.value}%</span>
                                                </div>
                                                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${item.value}%` }}
                                                        style={{ backgroundColor: item.color }}
                                                        className="h-full rounded-full relative"
                                                        transition={{ duration: 0.8, type: 'spring' }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default UserProfile;