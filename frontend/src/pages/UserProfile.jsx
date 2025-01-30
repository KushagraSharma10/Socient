import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";



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
                console.log("User API Response:", response.data); // ✅ Debugging
                setUser(response.data);
                setIsFollowing(response.data.followers.includes(userId));
                setLoading(false);
            } catch (err) {
                setError("Failed to fetch user data: ", err);
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
                    className={`px-4 py-2 rounded-lg font-semibold transition ${activeTab === 'posts' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                        }`}
                >
                    Posts
                </button>
                <button
                    onClick={() => setActiveTab('sentiment')}
                    className={`px-4 py-2 rounded-lg font-semibold transition ${activeTab === 'sentiment' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
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
                            {user.posts.length > 0 ? (
                                user.posts.map((post, index) => (
                                    <div key={index} className="relative group overflow-hidden rounded-lg shadow-lg">
                                        {post.images.length > 1 ? (
                                            // ✅ Swiper for multiple images
                                            <Swiper
                                                navigation
                                                pagination={{ clickable: true }}
                                                modules={[Navigation, Pagination]} // 🔥 Fix: Correct module usage
                                                className="w-full h-full"
                                            >
                                                {post.images.map((image, imgIndex) => (
                                                    <SwiperSlide key={imgIndex}>
                                                        <img
                                                            src={image}
                                                            alt={`Post ${index + 1} - Image ${imgIndex + 1}`}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </SwiperSlide>
                                                ))}
                                            </Swiper>
                                        ) : (
                                            // ✅ Single image display
                                            <img
                                                src={post.images?.[0] || "https://via.placeholder.com/150"}
                                                alt={`Post ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        )}
                                        <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-50 transition"></div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 text-center">No posts available.</p>
                            )}
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
