import { useState, useEffect, useRef, useCallback } from 'react';
import { FaBell, FaSearch, FaPlus, FaSun, FaMoon, FaHome } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';
import PostItem from '../components/PostItem'; // Keep your original PostItem component
import Post from '../components/Post'; // Keep your Post component
import RightSidebar from '../components/RightSideBar';
import Navbar from '../components/Navbar';
gsap.registerPlugin(ScrollTrigger);

function HomePage() {
    const [posts, setPosts] = useState([]);
    const [user, setUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem('isDarkMode');
        return savedTheme ? JSON.parse(savedTheme) : false;
    });
    const navigate = useNavigate();
    const postRefs = useRef([]);

    // Initialize Lenis for smooth scrolling
    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smooth: true,
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        return () => {
            lenis.destroy();
        };
    }, []);

    // Fetch the logged-in user's profile
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem('token');
                const userId = localStorage.getItem('userId');
                const response = await axios.get(`http://localhost:3000/api/users/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setUser(response.data);
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };
        fetchUser();
    }, []);

    // Fetch posts from the backend
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/posts');
                setPosts(response.data);
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };
        fetchPosts();
    }, []);

    // GSAP for animation on post items
    useEffect(() => {
        if (postRefs.current.length > 0) {
            postRefs.current.forEach((post, index) => {
                if (post) {
                    gsap.fromTo(post, {
                        opacity: 0,
                        y: 50,
                    }, {
                        opacity: 1,
                        y: 0,
                        duration: 1,
                        scrollTrigger: {
                            trigger: post,
                            start: "top bottom",
                            end: "top center",
                            scrub: true,
                        }
                    });
                }
            });
        }
    }, [posts]);

    // Keep your existing post creation logic
    const handlePostCreate = (newPost) => {
        const updatedPost = {
            ...newPost,
            userDp: user?.profilePicture,
        };
        setPosts([updatedPost, ...posts]);
    };

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    // Memoize the event handlers using useCallback to prevent unnecessary re-renders
    const handleLikeToggle = useCallback(async (id) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(`http://localhost:3000/api/posts/${id}/like`, null, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.status === 200) {
                const updatedPost = response.data.post;
                const newLikeStatus = response.data.hasLiked;
                const updatedLikeCount = response.data.likesCount;

                setPosts(prevPosts =>
                    prevPosts.map(post => {
                        if (post._id === id) {
                            return {
                                ...post,
                                likes: updatedLikeCount,
                                hasLiked: newLikeStatus
                            };
                        }
                        return post;
                    })
                );
            }
        } catch (error) {
            console.error('Error toggling like:', error);
        }
    }, [posts]);

    const handleCommentToggle = useCallback((id) => {
        setPosts(prevPosts =>
            prevPosts.map(post => {
                if (post._id === id) {
                    return { ...post, showComments: !post.showComments };
                }
                return post;
            })
        );
    }, [posts]);

    const handleCommentChange = useCallback((id, value) => {
        setPosts(prevPosts =>
            prevPosts.map(post => {
                if (post._id === id) {
                    return { ...post, commentInput: value };
                }
                return post;
            })
        );
    }, [posts]);

    const handleCommentSubmit = useCallback(async (id) => {
        const post = posts.find(post => post._id === id);

        if (!post || !post.commentInput || post.commentInput.trim() === "") return;

        const newComment = {
            content: post.commentInput,
            userDp: user?.profilePicture || "https://via.placeholder.com/50",
            userId: user?._id, // Ensure you are adding the user ID of the commenter
        };

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`http://localhost:3000/api/posts/${id}/comments`, newComment, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.status === 201) {
                const savedComment = response.data.comment;
                const overallSentiment = response.data.overallSentiment;

                setPosts(prevPosts =>
                    prevPosts.map(post => {
                        if (post._id === id) {
                            return {
                                ...post,
                                comments: [...(post.comments || []), savedComment],
                                commentInput: '',
                                overallSentiment
                            };
                        }
                        return post;
                    })
                );
            }
        } catch (error) {
            console.error('Error submitting comment:', error.response ? error.response.data : error.message);
        }
    }, [posts, user]);

    const handleLogout = async () => {
        try {
            await axios.get('http://localhost:3000/api/users/logout', { withCredentials: true });
            localStorage.removeItem('token');
            setUser(null);
            navigate('/');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    // Toggle dark mode
    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
        localStorage.setItem('isDarkMode', JSON.stringify(!isDarkMode));
    };

    return (
        <div className={`flex ${isDarkMode ? 'bg-black text-white' : 'bg-gray-100 text-gray-900'} transition-all duration-500`}>
            <Navbar user={user} handleOpenModal={handleOpenModal} handleLogout={handleLogout} isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />

            {/* Middle Post Feed */}
            <div className="flex-1 ml-[21vw] pt-8">
                <div className="container mx-auto px-4">
                    {posts.length === 0 ? (
                        <div className="text-center text-gray-500">No posts yet. Create one!</div>
                    ) : (
                        posts.map((post, index) => (
                            <div key={post._id}>
                                <PostItem post={post} isDarkMode={isDarkMode} handleLikeToggle={handleLikeToggle} handleCommentToggle={handleCommentToggle} handleCommentChange={handleCommentChange} handleCommentSubmit={handleCommentSubmit} />
                            </div>
                        ))
                    )}
                </div>
            </div>

            <RightSidebar user={user} isDarkMode={isDarkMode} />
            {
                isModalOpen && (
                    <Post
                        onClose={handleCloseModal}
                        onPostCreate={handlePostCreate}
                        isDarkMode={isDarkMode}
                    />
                )
            }
        </div>
    );

}

export default HomePage;
