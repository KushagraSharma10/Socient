// import { useState, useEffect, useRef } from 'react';
// import { FaBell, FaSearch, FaPlus, FaThumbsUp, FaRegThumbsUp, FaComment, FaSun, FaMoon } from 'react-icons/fa';
// import Post from '../components/Post'; // Import your modal
// import axios from 'axios';
// import { Link, useNavigate } from 'react-router-dom';
// import { gsap } from 'gsap';
// import { ScrollTrigger } from 'gsap/ScrollTrigger';
// import Lenis from '@studio-freight/lenis';

// gsap.registerPlugin(ScrollTrigger);

// function HomePage() {
//     const [posts, setPosts] = useState([]);
//     const [user, setUser] = useState(null);
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [isDarkMode, setIsDarkMode] = useState(() => {
//         const savedTheme = localStorage.getItem('isDarkMode');
//         return savedTheme ? JSON.parse(savedTheme) : false;
//     });
//     const navigate = useNavigate();
//     const postRefs = useRef([]);

//     // Initialize Lenis for smooth scrolling
//     useEffect(() => {
//         const lenis = new Lenis({
//             duration: 1.2,
//             easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
//             smooth: true,
//         });

//         function raf(time) {
//             lenis.raf(time);
//             requestAnimationFrame(raf);
//         }

//         requestAnimationFrame(raf);

//         return () => {
//             lenis.destroy();
//         };
//     }, []);

//     // Fetch the logged-in user's profile
//     useEffect(() => {
//         const fetchUser = async () => {
//             try {
//                 const token = localStorage.getItem('token');
//                 const userId = localStorage.getItem('userId');  // Assuming the user ID is stored in localStorage
//                 const response = await axios.get(`http://localhost:3000/api/users/${userId}`, {
//                     headers: {
//                         Authorization: `Bearer ${token}`  // Ensure you're sending the token for authentication if needed
//                     }
//                 });

//                 setUser(response.data); // Set the user data, including profile picture
//             } catch (error) {
//                 console.error('Error fetching user:', error);
//             }
//         };
//         fetchUser();
//     }, []);

//     // Fetch posts from the backend
//     useEffect(() => {
//         const fetchPosts = async () => {
//             try {
//                 const response = await axios.get('http://localhost:3000/api/posts');
//                 setPosts(response.data);
//             } catch (error) {
//                 console.error('Error fetching posts:', error);
//             }
//         };
//         fetchPosts();
//     }, []);

//     useEffect(() => {
//         if (postRefs.current.length > 0) {
//             postRefs.current.forEach((post, index) => {
//                 if (post) {
//                     gsap.fromTo(post, {
//                         opacity: 0,
//                         y: 50,
//                     }, {
//                         opacity: 1,
//                         y: 0,
//                         duration: 1,
//                         scrollTrigger: {
//                             trigger: post,
//                             start: "top bottom",
//                             end: "top center",
//                             scrub: true,
//                         }
//                     });
//                 }
//             });
//         }
//     }, [posts]);

//     const handlePostCreate = (newPost) => {
//         const updatedPost = {
//             ...newPost,
//             userDp: user?.profilePicture, // Add this line
//         };
//         setPosts([updatedPost, ...posts]);
//     };

//     const handleOpenModal = () => {
//         setIsModalOpen(true);
//     };

//     const handleCloseModal = () => {
//         setIsModalOpen(false);
//     };

//     const handleLikeToggle = async (id) => {
//         try {
//             const token = localStorage.getItem('token');
//             const response = await axios.put(`http://localhost:3000/api/posts/${id}/like`, null, {
//                 headers: { Authorization: `Bearer ${token}` }
//             });

//             if (response.status === 200) {
//                 const updatedPost = response.data.post;
//                 const newLikeStatus = response.data.hasLiked;
//                 const updatedLikeCount = response.data.likesCount;

//                 setPosts(posts.map(post => {
//                     if (post._id === id) {
//                         return {
//                             ...post,
//                             likes: updatedLikeCount,
//                             hasLiked: newLikeStatus
//                         };
//                     }
//                     return post;
//                 }));
//             }
//         } catch (error) {
//             console.error('Error toggling like:', error);
//         }
//     };

//     const handleCommentToggle = (id) => {
//         setPosts(posts.map(post => {
//             if (post._id === id) {
//                 return {
//                     ...post,
//                     showComments: !post.showComments
//                 };
//             }
//             return post;
//         }));
//     };

//     const handleCommentChange = (id, value) => {
//         setPosts(posts.map(post => {
//             if (post._id === id) {
//                 return { ...post, commentInput: value };
//             }
//             return post;
//         }));
//     };

//     const handleCommentSubmit = async (id) => {
//         const post = posts.find(post => post._id === id);

//         if (!post || !post.commentInput || post.commentInput.trim() === "") return;

//         const newComment = {
//             content: post.commentInput,
//             userDp: user?.profilePicture || "https://via.placeholder.com/50",
//             userId: user?._id, // Include user ID in the new comment
//         };

//         try {
//             const token = localStorage.getItem('token');
//             const response = await axios.post(`http://localhost:3000/api/posts/${id}/comments`, newComment, {
//                 headers: { Authorization: `Bearer ${token}` }
//             });

//             if (response.status === 201) {
//                 const savedComment = response.data.comment;
//                 const overallSentiment = response.data.overallSentiment;

//                 setPosts(posts.map(post => {
//                     if (post._id === id) {
//                         return {
//                             ...post,
//                             comments: [...(post.comments || []), savedComment],
//                             commentInput: '',
//                             overallSentiment
//                         };
//                     }
//                     return post;
//                 }));
//             }
//         } catch (error) {
//             console.error('Error submitting comment:', error.response ? error.response.data : error.message);
//         }
//     };


//     const handleLogout = async () => {
//         try {
//             await axios.get('http://localhost:3000/api/users/logout', {
//                 withCredentials: true
//             });
//             localStorage.removeItem('token');
//             setUser(null);
//             navigate('/');
//         } catch (error) {
//             console.error('Error logging out:', error);
//         }
//     };

//     const toggleDarkMode = () => {
//         setIsDarkMode(!isDarkMode);
//         localStorage.setItem('isDarkMode', JSON.stringify(!isDarkMode));
//     };

//     return (
//         <div className={`min-h-screen transition-colors duration-500 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
//             <div className={`py-4 px-7 shadow-md flex justify-between items-center transition-colors duration-500 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
//                 <div className="text-xl font-bold">Socient</div>
//                 <div className="w-[40vw] flex items-center justify-center gap-5">
//                     <div className={`flex items-center rounded-full px-3 py-2 w-full max-w-xs transition-colors duration-500 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
//                         <FaSearch className={`mr-2 transition-colors duration-500 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} />
//                         <input
//                             type="text"
//                             placeholder="Search..."
//                             className={`bg-transparent outline-none w-full transition-colors duration-500 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
//                         />
//                     </div>
//                     <FaBell className={`text-md cursor-pointer transition-colors duration-500 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`} />
//                     <Link to="/profile" className='w-[3.2vw] h-[3.2vw] overflow-hidden rounded-full '>
//                         <img
//                             src={user?.profilePicture || "https://via.placeholder.com/150"}
//                             alt="User DP"
//                             className=" w-full h-full object-cover cursor-pointer"
//                         />
//                     </Link>
//                     <FaPlus
//                         className={`text-xl cursor-pointer transition-colors duration-500 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
//                         onClick={handleOpenModal}
//                     />
//                     <button
//                         onClick={handleLogout}
//                         className="text-white text-md bg-red-500 px-2 py-1 rounded-lg"
//                     >
//                         Logout
//                     </button>
//                     <button
//                         onClick={toggleDarkMode}
//                         className="text-white text-md  px-2 py-1 rounded-lg flex items-center"
//                     >
//                         {isDarkMode ? <FaSun className="text-yellow-500" /> : <FaMoon className="text-black" />}
//                     </button>
//                 </div>
//             </div>

//             <div className="container mx-auto py-10">
//                 {posts.length === 0 ? (
//                     <div className="text-center text-gray-500">No posts yet. Create one!</div>
//                 ) : (
//                     posts.map((post, index) => (
//                         <div key={post._id} ref={el => postRefs.current[index] = el} className={`rounded-lg shadow-md mb-6  w-[50vw] h-fit bg-red-500 transition-colors duration-500 ${isDarkMode ? 'bg-zinc-800' : 'bg-gray-200'}`}>

//                             <div className="p-2 items-start ">
//                                 <div className='flex items-center gap-3'>
//                                     <img
//                                         src={post.userId.profilePicture || "https://via.placeholder.com/50"}
//                                         alt="User DP"
//                                         className="w-10 h-10 rounded-full object-cover"
//                                     />
//                                     <h3 className="font-semibold">{post.userId ? post.userId.username : 'User'}</h3>
//                                 </div>
//                                 <div>
//                                     {post.image && (
//                                         <div className='w-full h-[33vw] mt-3  rounded-lg overflow-hidden'>
//                                             <img
//                                                 src={post.image}
//                                                 alt="Post Image"
//                                                 className="w-full h-full object-cover transition-transform duration-500 ease-in-out transform hover:scale-105"
//                                             />
//                                         </div>
//                                     )}
//                                     <p className="mt-3">{post.content}</p>
//                                 </div>
//                                 <div className='flex items-center justify-between px-3'>
//                                     <div className="flex items-center gap-3 mt-2">
//                                         <button
//                                             onClick={() => handleLikeToggle(post._id)}
//                                             className="flex items-center"
//                                         >
//                                             {post.hasLiked ? (
//                                                 <FaThumbsUp className="text-blue-500 mr-1" />
//                                             ) : (
//                                                 <FaRegThumbsUp className="mr-1" />
//                                             )}
//                                             <span>{post.likes}</span>
//                                         </button>
//                                         <button
//                                             onClick={() => handleCommentToggle(post._id)}
//                                             className="flex items-center"
//                                         >
//                                             <FaComment className="mr-1" />
//                                             <span>{(post.comments || []).length}</span>
//                                         </button>
//                                     </div>
//                                     {post.overallSentiment && (
//                                         <div className="mt-2 text-md font-semibold">
//                                             Overall Sentiment:{" "}
//                                             <span className={`${post.overallSentiment === 'positive'
//                                                 ? 'text-green-500'
//                                                 : post.overallSentiment === 'negative'
//                                                     ? 'text-red-500'
//                                                     : 'text-gray-600'
//                                                 }`}
//                                             >
//                                                 {post.overallSentiment}
//                                             </span>
//                                         </div>
//                                     )}
//                                 </div>
//                             </div>

//                             {post.showComments && (
//                                 <div className="mt-4">
//                                     <div className="flex items-center mb-2">
//                                         <input
//                                             type="text"
//                                             value={post.commentInput || ""}
//                                             onChange={(e) => handleCommentChange(post._id, e.target.value)}
//                                             placeholder="Add a comment..."
//                                             className="flex-grow border border-gray-300 rounded-lg py-2 px-3 mr-2"
//                                         />
//                                         <button
//                                             onClick={() => handleCommentSubmit(post._id)}
//                                             className="bg-blue-500 text-white px-4 py-2 rounded-lg"
//                                         >
//                                             Post
//                                         </button>
//                                     </div>
//                                     <div className="space-y-2">
//                                         {(post.comments || []).map((comment, index) => (
//                                             <div key={index} className="flex items-center space-x-4">
//                                                 <img src={comment.userDp} alt="user" className="w-8 h-8 rounded-full object-cover" />
//                                                 <div className="bg-gray-100 rounded-lg p-2 flex-grow">
//                                                     <div className="font-semibold">{comment.userId.username}</div>
//                                                     <p>{comment.content}</p>
//                                                     <span className="text-sm text-gray-600">Sentiment: {comment.sentiment}</span>
//                                                 </div>
//                                             </div>
//                                         ))}
//                                     </div>
//                                 </div>
//                             )}

//                         </div>
//                     ))
//                 )}
//             </div>

//             {isModalOpen && (
//                 <Post
//                     onClose={handleCloseModal}
//                     onPostCreate={handlePostCreate}
//                     isDarkMode={isDarkMode} 
//                 />
//             )}
//         </div>
//     );
// }

// export default HomePage;



// import { useState, useEffect, useRef } from 'react';
// import { FaBell, FaSearch, FaPlus, FaThumbsUp, FaRegThumbsUp, FaComment, FaSun, FaMoon } from 'react-icons/fa';
// import Post from '../components/Post'; // Import your modal
// import axios from 'axios';
// import { Link, useNavigate } from 'react-router-dom';
// import { gsap } from 'gsap';
// import { ScrollTrigger } from 'gsap/ScrollTrigger';
// import Lenis from '@studio-freight/lenis';
// import PostItem from '../components/PostItem';

// gsap.registerPlugin(ScrollTrigger);

// function HomePage() {
//     const [posts, setPosts] = useState([]);
//     const [user, setUser] = useState(null);
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [isDarkMode, setIsDarkMode] = useState(() => {
//         const savedTheme = localStorage.getItem('isDarkMode');
//         return savedTheme ? JSON.parse(savedTheme) : false;
//     });
//     const navigate = useNavigate();
//     const postRefs = useRef([]);

//     // Initialize Lenis for smooth scrolling
//     useEffect(() => {
//         const lenis = new Lenis({
//             duration: 1.2,
//             easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
//             smooth: true,
//         });

//         function raf(time) {
//             lenis.raf(time);
//             requestAnimationFrame(raf);
//         }

//         requestAnimationFrame(raf);

//         return () => {
//             lenis.destroy();
//         };
//     }, []);

//     // Fetch the logged-in user's profile
//     useEffect(() => {
//         const fetchUser = async () => {
//             try {
//                 const token = localStorage.getItem('token');
//                 const userId = localStorage.getItem('userId');  // Assuming the user ID is stored in localStorage
//                 const response = await axios.get(`http://localhost:3000/api/users/${userId}`, {
//                     headers: {
//                         Authorization: `Bearer ${token}`  // Ensure you're sending the token for authentication if needed
//                     }
//                 });

//                 setUser(response.data); // Set the user data, including profile picture
//             } catch (error) {
//                 console.error('Error fetching user:', error);
//             }
//         };
//         fetchUser();
//     }, []);

//     // Fetch posts from the backend
//     useEffect(() => {
//         const fetchPosts = async () => {
//             try {
//                 const response = await axios.get('http://localhost:3000/api/posts');
//                 setPosts(response.data);
//             } catch (error) {
//                 console.error('Error fetching posts:', error);
//             }
//         };
//         fetchPosts();
//     }, []);

//     useEffect(() => {
//         if (postRefs.current.length > 0) {
//             postRefs.current.forEach((post, index) => {
//                 if (post) {
//                     gsap.fromTo(post, {
//                         opacity: 0,
//                         y: 50,
//                     }, {
//                         opacity: 1,
//                         y: 0,
//                         duration: 1,
//                         scrollTrigger: {
//                             trigger: post,
//                             start: "top bottom",
//                             end: "top center",
//                             scrub: true,
//                         }
//                     });
//                 }
//             });
//         }
//     }, [posts]);

//     const handlePostCreate = (newPost) => {
//         const updatedPost = {
//             ...newPost,
//             userDp: user?.profilePicture, // Add this line
//         };
//         setPosts([updatedPost, ...posts]);
//     };

//     const handleOpenModal = () => {
//         setIsModalOpen(true);
//     };

//     const handleCloseModal = () => {
//         setIsModalOpen(false);
//     };

//     const handleLikeToggle = async (id) => {
//         try {
//             const token = localStorage.getItem('token');
//             const response = await axios.put(`http://localhost:3000/api/posts/${id}/like`, null, {
//                 headers: { Authorization: `Bearer ${token}` }
//             });

//             if (response.status === 200) {
//                 const updatedPost = response.data.post;
//                 const newLikeStatus = response.data.hasLiked;
//                 const updatedLikeCount = response.data.likesCount;

//                 setPosts(posts.map(post => {
//                     if (post._id === id) {
//                         return {
//                             ...post,
//                             likes: updatedLikeCount,
//                             hasLiked: newLikeStatus
//                         };
//                     }
//                     return post;
//                 }));
//             }
//         } catch (error) {
//             console.error('Error toggling like:', error);
//         }
//     };

//     const handleCommentToggle = (id) => {
//         setPosts(posts.map(post => {
//             if (post._id === id) {
//                 return {
//                     ...post,
//                     showComments: !post.showComments
//                 };
//             }
//             return post;
//         }));
//     };

//     const handleCommentChange = (id, value) => {
//         setPosts(posts.map(post => {
//             if (post._id === id) {
//                 return { ...post, commentInput: value };
//             }
//             return post;
//         }));
//     };

//     const handleCommentSubmit = async (id) => {
//         const post = posts.find(post => post._id === id);

//         if (!post || !post.commentInput || post.commentInput.trim() === "") return;

//         const newComment = {
//             content: post.commentInput,
//             userDp: user?.profilePicture || "https://via.placeholder.com/50",
//             userId: user?._id, // Include user ID in the new comment
//         };

//         try {
//             const token = localStorage.getItem('token');
//             const response = await axios.post(`http://localhost:3000/api/posts/${id}/comments`, newComment, {
//                 headers: { Authorization: `Bearer ${token}` }
//             });

//             if (response.status === 201) {
//                 const savedComment = response.data.comment;
//                 const overallSentiment = response.data.overallSentiment;

//                 setPosts(prevPosts =>
//                     prevPosts.map(post => {
//                         if (post._id === id) {
//                             return {
//                                 ...post,
//                                 comments: [...(post.comments || []), savedComment],
//                                 commentInput: '',
//                                 overallSentiment
//                             };
//                         }
//                         return post;
//                     })
//                 );
//             }
//         } catch (error) {
//             console.error('Error submitting comment:', error.response ? error.response.data : error.message);
//         }
//     };


//     const handleLogout = async () => {
//         try {
//             await axios.get('http://localhost:3000/api/users/logout', {
//                 withCredentials: true
//             });
//             localStorage.removeItem('token');
//             setUser(null);
//             navigate('/');
//         } catch (error) {
//             console.error('Error logging out:', error);
//         }
//     };

//     const toggleDarkMode = () => {
//         setIsDarkMode(!isDarkMode);
//         localStorage.setItem('isDarkMode', JSON.stringify(!isDarkMode));
//     };

//     return (
//         <div className={`min-h-screen transition-colors duration-500 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
//             <div className={`py-4 px-7 shadow-md flex justify-between items-center transition-colors duration-500 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
//                 <div className="text-xl font-bold">Socient</div>
//                 <div className="w-[40vw] flex items-center justify-center gap-5">
//                     <div className={`flex items-center rounded-full px-3 py-2 w-full max-w-xs transition-colors duration-500 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
//                         <FaSearch className={`mr-2 transition-colors duration-500 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} />
//                         <input
//                             type="text"
//                             placeholder="Search..."
//                             className={`bg-transparent outline-none w-full transition-colors duration-500 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
//                         />
//                     </div>
//                     <FaBell className={`text-md cursor-pointer transition-colors duration-500 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`} />
//                     <Link to="/profile" className='w-[3.2vw] h-[3.2vw] overflow-hidden rounded-full '>
//                         <img
//                             src={user?.profilePicture || "https://via.placeholder.com/150"}
//                             alt="User DP"
//                             className=" w-full h-full object-cover cursor-pointer"
//                         />
//                     </Link>
//                     <FaPlus
//                         className={`text-xl cursor-pointer transition-colors duration-500 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
//                         onClick={handleOpenModal}
//                     />
//                     <button
//                         onClick={handleLogout}
//                         className="text-white text-md bg-red-500 px-2 py-1 rounded-lg"
//                     >
//                         Logout
//                     </button>
//                     <button
//                         onClick={toggleDarkMode}
//                         className="text-white text-md  px-2 py-1 rounded-lg flex items-center"
//                     >
//                         {isDarkMode ? <FaSun className="text-yellow-500" /> : <FaMoon className="text-black" />}
//                     </button>
//                 </div>
//             </div>

//             <div className="container mx-auto py-10">
//                 {posts.length === 0 ? (
//                     <div className="text-center text-gray-500">No posts yet. Create one!</div>
//                 ) : (
//                     posts.map((post, index) => (
//                         <PostItem
//                             key={post._id}
//                             post={post}
//                             handleLikeToggle={handleLikeToggle}
//                             handleCommentToggle={handleCommentToggle}
//                             handleCommentChange={handleCommentChange}
//                             handleCommentSubmit={handleCommentSubmit}
//                             isDarkMode={isDarkMode}
//                         />
//                     ))
//                 )}
//             </div>

//             {isModalOpen && (
//                 <Post
//                     onClose={handleCloseModal}
//                     onPostCreate={handlePostCreate}
//                     isDarkMode={isDarkMode}
//                 />
//             )}
//         </div>
//     );
// }

// export default HomePage;


// import { useState, useEffect, useRef } from 'react';
// import { FaBell, FaSearch, FaRegComment, FaRegHeart, FaHeart } from 'react-icons/fa';
// import { Link, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import PostItem from '../components/PostItem'; // Import your post component

// function HomePage() {
//     const [posts, setPosts] = useState([]);
//     const [user, setUser] = useState(null);
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [isDarkMode, setIsDarkMode] = useState(false); // Instagram doesn’t have dark mode

//     const navigate = useNavigate();

//     // Fetch the logged-in user's profile
//     useEffect(() => {
//         const fetchUser = async () => {
//             try {
//                 const token = localStorage.getItem('token');
//                 const userId = localStorage.getItem('userId');
//                 const response = await axios.get(`http://localhost:3000/api/users/${userId}`, {
//                     headers: { Authorization: `Bearer ${token}` }
//                 });

//                 setUser(response.data); // Set the user data
//             } catch (error) {
//                 console.error('Error fetching user:', error);
//             }
//         };
//         fetchUser();
//     }, []);

//     // Fetch posts from the backend
//     useEffect(() => {
//         const fetchPosts = async () => {
//             try {
//                 const response = await axios.get('http://localhost:3000/api/posts');
//                 setPosts(response.data);
//             } catch (error) {
//                 console.error('Error fetching posts:', error);
//             }
//         };
//         fetchPosts();
//     }, []);

//     // Handle opening and closing the modal (post creation)
//     const handleOpenModal = () => setIsModalOpen(true);
//     const handleCloseModal = () => setIsModalOpen(false);

//     return (
//         <div className="bg-gray-100 min-h-screen text-gray-900 flex flex-col">
//             {/* Top Navigation Bar */}
//             <div className="bg-white border-b border-gray-300 py-3 px-5 sticky top-0 z-50 flex justify-between items-center shadow-sm">
//                 {/* Instagram Logo */}
//                 <Link to="/" className="text-2xl font-bold">Instagram</Link>

//                 {/* Search Bar */}
//                 <div className="flex items-center bg-gray-200 rounded-full px-3 py-2 w-[30vw]">
//                     <FaSearch className="text-gray-500 mr-2" />
//                     <input
//                         type="text"
//                         placeholder="Search"
//                         className="bg-transparent outline-none w-full text-gray-600"
//                     />
//                 </div>

//                 {/* Icons on the right */}
//                 <div className="flex items-center gap-6">
//                     <FaBell className="text-xl cursor-pointer" />
//                     <Link to="/inbox" className="text-xl cursor-pointer">
//                         <FaRegComment />
//                     </Link>
//                     <Link to="/profile" className="rounded-full w-8 h-8 overflow-hidden">
//                         <img
//                             src={user?.profilePicture || "https://via.placeholder.com/150"}
//                             alt="Profile"
//                             className="w-full h-full object-cover"
//                         />
//                     </Link>
//                 </div>
//             </div>

//             {/* Main Content */}
//             <div className="container mx-auto mt-6 flex">
//                 {/* Post Feed (Middle column) */}
//                 <div className="w-[60%] mx-auto">
//                     {posts.length === 0 ? (
//                         <div className="text-center text-gray-500">No posts yet. Create one!</div>
//                     ) : (
//                         posts.map((post, index) => (
//                             <PostItem
//                                 key={post._id}
//                                 post={post}
//                                 isDarkMode={isDarkMode}
//                             />
//                         ))
//                     )}
//                 </div>


//             </div>

//             {/* Post Creation Modal */}
//             {isModalOpen && (
//                 <Post
//                     onClose={handleCloseModal}
//                     onPostCreate={(newPost) => setPosts([newPost, ...posts])}
//                     isDarkMode={isDarkMode}
//                 />
//             )}
//         </div>
//     );
// }

// export default HomePage;


import { useState, useEffect, useRef } from 'react';
import { FaBell, FaSearch, FaPlus, FaSun, FaMoon, FaHome } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';
import PostItem from '../components/PostItem'; // Import your post component
import Post from '../components/Post'
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

    const handlePostCreate = (newPost) => {
        const updatedPost = {
            ...newPost,
            userDp: user?.profilePicture,
        };
        setPosts([updatedPost, ...posts]);
    };

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    const handleLikeToggle = async (id) => {
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
    };
    

    const handleCommentToggle = (id) => {
        setPosts(prevPosts =>
            prevPosts.map(post => {
                if (post._id === id) {
                    return { ...post, showComments: !post.showComments };
                }
                return post;
            })
        );
    };
    
    

    const handleCommentChange = (id, value) => {
        setPosts(prevPosts =>
            prevPosts.map(post => {
                if (post._id === id) {
                    return { ...post, commentInput: value };
                }
                return post;
            })
        );
    };
    
    
    const handleCommentSubmit = async (id) => {
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
    };
    
    

    const handleLogout = async () => {
        try {
            await axios.get('http://localhost:3000/api/users/logout', {
                withCredentials: true
            });
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
            {/* Left Sidebar (Navigation bar like Instagram) */}
            <div className={`w-[15vw] min-h-screen fixed left-0 top-0 z-10 flex flex-col items-start justify-start p-5 border-r ${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} transition-all duration-500`}>
                <Link to="/" className="text-3xl font-bold mb-8">Instagram</Link>
                <div className="flex flex-col space-y-6">
                    <Link to="/" className="flex items-center gap-4 text-xl">
                        <FaHome />
                        <span>Home</span>
                    </Link>
                    <Link to="/profile" className="flex items-center gap-4 text-xl">
                        <img
                            src={user?.profilePicture || "https://via.placeholder.com/150"}
                            alt="Profile"
                            className="w-8 h-8 rounded-full"
                        />
                        <span>Profile</span>
                    </Link>
                    <FaPlus
                        className="text-xl cursor-pointer mt-4"
                        onClick={handleOpenModal}
                    />

                    {/* Dark Mode Toggle */}
                    <button
                        onClick={toggleDarkMode}
                        className="flex items-center gap-3 mt-8 text-xl"
                    >
                        {isDarkMode ? <FaSun className="text-yellow-500" /> : <FaMoon className="text-blue-500" />}
                        <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
                    </button>

                    <button
                        onClick={handleLogout}
                        className="text-md bg-red-500 text-white px-4 py-2 rounded-lg mt-8"
                    >
                        Logout
                    </button>
                </div>
            </div>

            {/* Middle Post Feed (Post Feed Section) */}
            <div className="flex-1 ml-[15vw] pt-8">
                <div className="container mx-auto px-4">
                    {posts.length === 0 ? (
                        <div className="text-center text-gray-500">No posts yet. Create one!</div>
                    ) : (
                        posts.map((post, index) => (
                            <div key={post._id} ref={el => postRefs.current[index] = el}>
                                <PostItem
                                    post={post}
                                    handleLikeToggle={handleLikeToggle}
                                    handleCommentToggle={handleCommentToggle}
                                    handleCommentChange={handleCommentChange}
                                    handleCommentSubmit={handleCommentSubmit}
                                    isDarkMode={isDarkMode}
                                />
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Right Sidebar */}
            <div className={`w-[22vw] p-2 fixed right-0 top-0 z-10 hidden lg:block ml-auto p-6 ${isDarkMode ? 'text-black' : ' text-gray-900'} transition-all duration-500`}>
                {/* User Profile */}
                <div className="flex items-center p-4 bg-white shadow-sm rounded-lg mb-6">
                    <Link to="/profile" className="rounded-full w-14 h-14 overflow-hidden">
                        <img
                            src={user?.profilePicture || "https://via.placeholder.com/150"}
                            alt="Profile"
                            className="w-full h-full object-cover"
                        />
                    </Link>
                    <div className="ml-4">
                        <h3 className="font-semibold">{user?.username || 'Username'}</h3>
                        <p className="text-sm text-gray-500">{user?.email || 'email@example.com'}</p>
                    </div>
                </div>

                {/* Suggestions for you */}
                <div className="bg-white p-4 shadow-sm rounded-lg mb-6">
                    <h4 className="font-semibold mb-3">Suggestions for you</h4>
                    <ul>
                        <li className="flex justify-between items-center mb-3">
                            <div className="flex items-center">
                                <img
                                    src="https://via.placeholder.com/40"
                                    alt="suggestion"
                                    className="w-10 h-10 rounded-full object-cover"
                                />
                                <div className="ml-3">
                                    <h5 className="font-semibold">suggested_user</h5>
                                    <p className="text-sm text-gray-500">Follows you</p>
                                </div>
                            </div>
                            <button className="text-blue-500 text-sm font-semibold">Follow</button>
                        </li>
                        {/* Repeat similar blocks for more suggestions */}
                    </ul>
                </div>

                {/* Footer Links */}
                <div className="text-sm text-gray-500">
                    <p className="mb-2">About &middot; Help &middot; Press &middot; API &middot; Jobs &middot; Privacy &middot; Terms &middot; Locations</p>
                    <p>© 2024 Instagram Clone</p>
                </div>
            </div>
        
            {/* Post Modal */ }
    {
        isModalOpen && (
            <Post
                onClose={handleCloseModal}
                onPostCreate={handlePostCreate}
                isDarkMode={isDarkMode}
            />
        )
    }
        </div >
    );
}

export default HomePage;
