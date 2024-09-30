// // HomePage.js
// import { useState } from 'react';
// import { FaBell, FaSearch, FaRegThumbsUp, FaThumbsUp } from 'react-icons/fa';
// import axios from 'axios';

// function HomePage() {
//   const userProfilePic = "https://via.placeholder.com/150";
//   const projectName = "SentimentX";

//   const [posts, setPosts] = useState([
//     {
//       id: 1,
//       user: "Zack Emerson",
//       userDp: "https://images.unsplash.com/photo-1493106819501-66d381c466f1?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGZhY2V8ZW58MHx8MHx8fDA%3D",
//       timestamp: "Yesterday at 7PM",
//       image: "https://images.unsplash.com/photo-1727229766396-efc10f50c169?q=80&w=2196&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//       content: "Great win by the Packers. I've been a fan for years and I know they've got it in them to win the Super Bowl.",
//       likes: 45,
//       hasLiked: false,
//       comments: [],
//       showComments: false,
//       commentInput: "",
//       overallSentiment: "Neutral" // Add sentiment field
//     },
//     {
//       id: 2,
//       user: "James Linden",
//       userDp: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZmFjZXxlbnwwfHwwfHx8MA%3D%3D",
//       timestamp: "Yesterday at 2PM",
//       image: "https://images.unsplash.com/photo-1725714834984-4f37a2406563?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//       content: "Went hiking in the Pacific Northwest this weekend. It was beautiful!",
//       likes: 23,
//       hasLiked: false,
//       comments: [],
//       showComments: false,
//       commentInput: "",
//       overallSentiment: "Neutral" // Add sentiment field
//     },
//   ]);

//   const handleLikeToggle = (id) => {
//     setPosts(posts.map(post => {
//       if (post.id === id) {
//         // Toggle like state
//         const newHasLiked = !post.hasLiked;
//         return {
//           ...post,
//           hasLiked: newHasLiked,
//           likes: newHasLiked ? post.likes + 1 : post.likes - 1
//         };
//       }
//       return post;
//     }));
//   };

//   const handleCommentToggle = (id) => {
//     setPosts(posts.map(post => {
//       if (post.id === id) {
//         return {
//           ...post,
//           showComments: !post.showComments
//         };
//       }
//       return post;
//     }));
//   };

//   const handleCommentChange = (id, value) => {
//     setPosts(posts.map(post => {
//       if (post.id === id) {
//         return {
//           ...post,
//           commentInput: value
//         };
//       }
//       return post;
//     }));
//   };
//   const handleCommentSubmit = async (postId) => {
//     try {
//       // Find the post with the given postId
//       const post = posts.find(post => post.id === postId);

//       // Prepare the new comment data to send to the backend
//       const newComment = {
//         userId: "You", // Replace with the actual logged-in user ID
//         content: post.commentInput, // The comment input text
//         userDp: userProfilePic, // Replace with actual user profile pic if available
//         sentiment: "Neutral", // Set sentiment, or perform sentiment analysis if available
//       };

//       // Send a POST request to create the comment
//       const response = await axios.post(`http://localhost:3000/api/posts/${postId}/comments`, newComment);

//       // Update the state with the new comment added (if the request was successful)
//       if (response.status === 201) {
//         setPosts(posts.map(post => {
//           if (post.id === postId) {
//             return {
//               ...post,
//               comments: [...post.comments, response.data.comment], // Append the new comment from the response
//               commentInput: "" // Clear input after posting
//             };
//           }
//           return post;
//         }));
//       }
//     } catch (error) {
//       console.error("Error submitting comment:", error.response ? error.response.data : error.message);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100">
//       {/* Navigation Bar */}
//       <div className="bg-white py-4 px-6 shadow-md flex justify-between items-center">
//         <div className="text-xl font-bold text-gray-700">{projectName}</div>
//         <div className="flex items-center space-x-6">
//           <div className="flex items-center bg-gray-200 rounded-full px-3 py-2 w-full max-w-xs">
//             <FaSearch className="text-gray-600 mr-2" />
//             <input type="text" placeholder="Search..." className="bg-transparent outline-none text-gray-700 w-full" />
//           </div>
//           <FaBell className="text-gray-700 text-xl cursor-pointer" />
//           <img src={userProfilePic} alt="User DP" className="w-10 h-10 rounded-full object-cover cursor-pointer" />
//         </div>
//       </div>

//       {/* Feed Section */}
//       <div className="container mx-auto py-10">
//         {posts.map(post => (
//           <div key={post.id} className="bg-white rounded-lg shadow-md mb-6 p-6">
//             <div className="flex items-center">
//               <div className='w-[4vw] h-[4vw]'>
//                 <img className="w-full h-full rounded-full object-cover mr-4" src={post.userDp} alt="user" />
//               </div>
//               <div>
//                 <h2 className="font-bold text-lg">{post.user}</h2>
//                 <p className="text-gray-500 text-sm">{post.timestamp}</p>
//               </div>
//             </div>

//             <div className='h-[40vw]'>
//               <img className="my-4 h-full object-cover rounded-lg w-full" src={post.image} alt="post" />
//             </div>

//             <p className="mb-4">{post.content}</p>

//             <div className="flex items-center justify-between text-gray-600 mb-2">
//               <div className="flex space-x-4">
//                 <button className="flex items-center space-x-1" onClick={() => handleLikeToggle(post.id)}>
//                   {post.hasLiked ? (
//                     <FaThumbsUp className="text-blue-500 transition duration-300" />
//                   ) : (
//                     <FaRegThumbsUp className="text-gray-600 transition duration-300" />
//                   )}
//                   <span>{post.likes}</span>
//                 </button>
//                 <button className="flex items-center space-x-1" onClick={() => handleCommentToggle(post.id)}>
//                   <span className="text-gray-600">💬</span>
//                   <span>{post.comments.length}</span>
//                 </button>
//               </div>
//               <p className="text-sm">Overall Sentiment: {post.overallSentiment}</p>
//             </div>

//             {/* Comment Section */}
//             {post.showComments && (
//               <div>
//                 <div className="flex items-center mb-4">
//                   <input
//                     type="text"
//                     value={post.commentInput}
//                     onChange={(e) => handleCommentChange(post.id, e.target.value)}
//                     placeholder="Add a comment..."
//                     className="flex-grow border border-gray-300 rounded-lg py-2 px-3 mr-2"
//                   />
//                   <button
//                     onClick={() => handleCommentSubmit(post.id)}
//                     className="bg-blue-500 text-white px-4 py-2 rounded-lg"
//                   >
//                     Post
//                   </button>
//                 </div>
//                 <div className="space-y-2">
//                   {post.comments.map((comment, index) => (
//                     <div key={index} className="flex items-center space-x-4">
//                       <img src={comment.userDp} alt="user" className="w-8 h-8 rounded-full object-cover" />
//                       <div className="bg-gray-100 rounded-lg p-2 flex-grow">
//                         <div className='flex items-center gap-1'>
//                         <div className="font-semibold">{comment.user} : </div>
//                         <p>{comment.comment}</p>
//                         </div>
//                         <span className="text-sm text-gray-600">Sentiment: {comment.sentiment}</span>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default HomePage;


// // HomePage.js
// import { useEffect, useState } from 'react';
// import { FaBell, FaSearch, FaRegThumbsUp, FaThumbsUp } from 'react-icons/fa';
// import axios from 'axios';

// function HomePage() {
//   const userProfilePic = "https://via.placeholder.com/150";
//   const projectName = "SentimentX";

//   const [posts, setPosts] = useState([]);

//   useEffect(() => {
//     const fetchPosts = async () => {
//       try {
//         const response = await axios.get('http://localhost:3000/api/posts'); // Adjust the URL based on your API
//         setPosts(response.data); // Set the fetched posts in the state
//       } catch (error) {
//         console.error("Error fetching posts:", error);
//       }
//     };

//     fetchPosts(); // Fetch posts when the component mounts
//   }, []);

//   const handleLikeToggle = (id) => {
//     setPosts(posts.map(post => {
//       if (post._id === id) { // Use MongoDB _id for matching
//         const newHasLiked = !post.hasLiked;
//         return {
//           ...post,
//           hasLiked: newHasLiked,
//           likes: newHasLiked ? post.likes + 1 : post.likes - 1
//         };
//       }
//       return post;
//     }));
//   };

//   const handleCommentToggle = (id) => {
//     setPosts(posts.map(post => {
//       if (post._id === id) { // Use MongoDB _id for matching
//         return {
//           ...post,
//           showComments: !post.showComments
//         };
//       }
//       return post;
//     }));
//   };

//   const handleCommentChange = (id, value) => {
//     setPosts(posts.map(post => {
//       if (post._id === id) { // Use MongoDB _id for matching
//         return {
//           ...post,
//           commentInput: value
//         };
//       }
//       return post;
//     }));
//   };

// //   const handleCommentSubmit = async (postId) => {
// //     try {
// //       const post = posts.find(post => post._id === postId);

// //       const newComment = {
// //         userId: "You", // Replace with the actual logged-in user ID
// //         content: post.commentInput,
// //         userDp: userProfilePic,
// //         sentiment: "Neutral", // Set sentiment, or perform sentiment analysis if available
// //       };

// //       const response = await axios.post(`http://localhost:3000/api/posts/${postId}/comments`, newComment);

// //       if (response.status === 201) {
// //         setPosts(posts.map(post => {
// //           if (post._id === postId) {
// //             return {
// //               ...post,
// //               comments: [...post.comments, response.data.comment],
// //               commentInput: ""
// //             };
// //           }
// //           return post;
// //         }));
// //       }
// //     } catch (error) {
// //       console.error("Error submitting comment:", error.response ? error.response.data : error.message);
// //     }
// //   };

// const handleCommentSubmit = async (postId) => {
//     try {
//         // Find the post and extract the necessary information
//         const post = posts.find(post => post._id === postId);

//         // Check if post and user input are valid
//         if (!post) {
//             console.error("Post not found");
//             return;
//         }

//         // Create new comment object
//         const newComment = {
//             userId: "dummyUserId123", // Replace with the actual logged-in user ID from your context or state
//             content: post.commentInput, // Ensure this is capturing the right input value
//             userDp: userProfilePic, // Assuming this is set somewhere in your component
//             sentiment: "Neutral", // Adjust if you have sentiment analysis
//         };

//         // Make POST request to the backend
//         const response = await axios.post(`http://localhost:3000/api/posts/${postId}/comments`, newComment);

//         // Check if the response is successful
//         if (response.status === 201) {
//             // Update posts state with the new comment
//             setPosts(posts.map(post => {
//                 if (post._id === postId) {
//                     return {
//                         ...post,
//                         comments: [...post.comments, response.data.comment], // Assuming your response has the new comment
//                         commentInput: "" // Clear input after submission
//                     };
//                 }
//                 return post;
//             }));
//         }
//     } catch (error) {
//         console.error("Error submitting comment:", error.response ? error.response.data : error.message);
//     }
// };


//   return (
//     <div className="min-h-screen bg-gray-100">
//       {/* Navigation Bar */}
//       <div className="bg-white py-4 px-6 shadow-md flex justify-between items-center">
//         <div className="text-xl font-bold text-gray-700">{projectName}</div>
//         <div className="flex items-center space-x-6">
//           <div className="flex items-center bg-gray-200 rounded-full px-3 py-2 w-full max-w-xs">
//             <FaSearch className="text-gray-600 mr-2" />
//             <input type="text" placeholder="Search..." className="bg-transparent outline-none text-gray-700 w-full" />
//           </div>
//           <FaBell className="text-gray-700 text-xl cursor-pointer" />
//           <img src={userProfilePic} alt="User DP" className="w-10 h-10 rounded-full object-cover cursor-pointer" />
//         </div>
//       </div>

//       {/* Feed Section */}
//       <div className="container mx-auto py-10">
//         {posts.map(post => (
//           <div key={post._id} className="bg-white rounded-lg shadow-md mb-6 p-6">
//             <div className="flex items-center">
//               <div className='w-[4vw] h-[4vw]'>
//                 <img className="w-full h-full rounded-full object-cover mr-4" src={post.userDp || userProfilePic} alt="user" />
//               </div>
//               <div>
//                 <h2 className="font-bold text-lg">{post.user || "Anonymous"}</h2>
//                 <p className="text-gray-500 text-sm">{new Date(post.timestamp).toLocaleString()}</p>
//               </div>
//             </div>

//             <div className='h-[40vw]'>
//               <img className="my-4 h-full object-cover rounded-lg w-full" src={post.image} alt="post" />
//             </div>

//             <p className="mb-4">{post.content}</p>

//             <div className="flex items-center justify-between text-gray-600 mb-2">
//               <div className="flex space-x-4">
//                 <button className="flex items-center space-x-1" onClick={() => handleLikeToggle(post._id)}>
//                   {post.hasLiked ? (
//                     <FaThumbsUp className="text-blue-500 transition duration-300" />
//                   ) : (
//                     <FaRegThumbsUp className="text-gray-600 transition duration-300" />
//                   )}
//                   <span>{post.likes}</span>
//                 </button>
//                 <button className="flex items-center space-x-1" onClick={() => handleCommentToggle(post._id)}>
//                   <span className="text-gray-600">💬</span>
//                   <span>{post.comments.length}</span>
//                 </button>
//               </div>
//               <p className="text-sm">Overall Sentiment: {post.overallSentiment}</p>
//             </div>

//             {/* Comment Section */}
//             {post.showComments && (
//               <div>
//                 <div className="flex items-center mb-4">
//                   <input
//                     type="text"
//                     value={post.commentInput || ""}
//                     onChange={(e) => handleCommentChange(post._id, e.target.value)}
//                     placeholder="Add a comment..."
//                     className="flex-grow border border-gray-300 rounded-lg py-2 px-3 mr-2"
//                   />
//                   <button
//                     onClick={() => handleCommentSubmit(post._id)}
//                     className="bg-blue-500 text-white px-4 py-2 rounded-lg"
//                   >
//                     Post
//                   </button>
//                 </div>
//                 <div className="space-y-2">
//                   {post.comments.map((comment, index) => (
//                     <div key={index} className="flex items-center space-x-4">
//                       <img src={comment.userDp || userProfilePic} alt="user" className="w-8 h-8 rounded-full object-cover" />
//                       <div className="bg-gray-100 rounded-lg p-2 flex-grow">
//                         <div className='flex items-center gap-1'>
//                           <div className="font-semibold">{comment.user || "Anonymous"} : </div>
//                           <p>{comment.content}</p>
//                         </div>
//                         <span className="text-sm text-gray-600">Sentiment: {comment.sentiment || "Neutral"}</span>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default HomePage;


// HomePage.js
// import { useEffect, useState } from 'react';
// import { FaBell, FaSearch, FaRegThumbsUp, FaThumbsUp } from 'react-icons/fa';
// import axios from 'axios';

// function HomePage() {
//     const userProfilePic = "https://via.placeholder.com/150";
//     const projectName = "SentimentX";

//     const [posts, setPosts] = useState([]);

//     useEffect(() => {
//         const fetchPosts = async () => {
//             try {
//                 const response = await axios.get('http://localhost:3000/api/posts');
//                 setPosts(response.data);
//             } catch (error) {
//                 console.error("Error fetching posts:", error);
//             }
//         };

//         fetchPosts();
//     }, []);

//     const handleLikeToggle = (id) => {
//         setPosts(posts.map(post => {
//             if (post._id === id) {
//                 const newHasLiked = !post.hasLiked;
//                 return {
//                     ...post,
//                     hasLiked: newHasLiked,
//                     likes: newHasLiked ? post.likes + 1 : post.likes - 1
//                 };
//             }
//             return post;
//         }));
//     };

//     const handleCommentToggle = (id) => {
//         setPosts(posts.map(post => {
//             if (post._id === id) {
//                 return {
//                     ...post,
//                     showComments: !post.showComments // Toggle comment section visibility
//                 };
//             }
//             return post;
//         }));
//     };

//     const handleCommentChange = (id, value) => {
//         setPosts(posts.map(post => {
//             if (post._id === id) {
//                 return {
//                     ...post,
//                     commentInput: value
//                 };
//             }
//             return post;
//         }));
//     };

//     const handleCommentSubmit = async (postId) => {
//         try {
//             const post = posts.find(post => post._id === postId);

//             if (!post) {
//                 console.error("Post not found");
//                 return;
//             }

//             // Log the new comment object
//             const newComment = {
//                 userId: post.userId || "dummyUserId123",
//                 content: post.commentInput,
//                 userDp: userProfilePic,
//                 sentiment: "Neutral",
//             };

//             console.log("New comment data:", newComment); // Debug log

//             const url = `http://localhost:3000/api/posts/${postId}/comments`;
//             console.log("Submitting comment to:", url); // Debug log

//             const response = await axios.post(url, newComment);

//             if (response.status === 201) {
//                 console.log("Comment submitted successfully:", response.data); // Debug log
//                 setPosts(posts.map(post => {
//                     if (post._id === postId) {
//                         return {
//                             ...post,
//                             comments: [...post.comments, response.data.comment],
//                             commentInput: ""
//                         };
//                     }
//                     return post;
//                 }));
//             }
//         } catch (error) {
//             console.error("Error submitting comment:", error.response ? error.response.data : error.message);
//         }
//     };



//     return (
//         <div className="min-h-screen bg-gray-100">
//             {/* Navigation Bar */}
//             <div className="bg-white py-4 px-6 shadow-md flex justify-between items-center">
//                 <div className="text-xl font-bold text-gray-700">{projectName}</div>
//                 <div className="flex items-center space-x-6">
//                     <div className="flex items-center bg-gray-200 rounded-full px-3 py-2 w-full max-w-xs">
//                         <FaSearch className="text-gray-600 mr-2" />
//                         <input type="text" placeholder="Search..." className="bg-transparent outline-none text-gray-700 w-full" />
//                     </div>
//                     <FaBell className="text-gray-700 text-xl cursor-pointer" />
//                     <img src={userProfilePic} alt="User DP" className="w-10 h-10 rounded-full object-cover cursor-pointer" />
//                 </div>
//             </div>

//             {/* Feed Section */}
//             <div className="container mx-auto py-10">
//                 {posts.map(post => (
//                     <div key={post._id} className="bg-white rounded-lg shadow-md mb-6 p-6">
//                         <div className="flex items-center">
//                             <div className='w-[4vw] h-[4vw]'>
//                                 <img className="w-full h-full rounded-full object-cover mr-4" src={post.userDp || userProfilePic} alt="user" />
//                             </div>
//                             <div>
//                                 <h2 className="font-bold text-lg">{post.user || "Anonymous"}</h2>
//                                 <p className="text-gray-500 text-sm">{new Date(post.timestamp).toLocaleString()}</p>
//                             </div>
//                         </div>

//                         <div className='h-[40vw]'>
//                             <img className="my-4 h-full object-cover rounded-lg w-full" src={post.image} alt="post" />
//                         </div>

//                         <p className="mb-4">{post.content}</p>

//                         <div className="flex items-center justify-between text-gray-600 mb-2">
//                             <div className="flex space-x-4">
//                                 <button className="flex items-center space-x-1" onClick={() => handleLikeToggle(post._id)}>
//                                     {post.hasLiked ? (
//                                         <FaThumbsUp className="text-blue-500 transition duration-300" />
//                                     ) : (
//                                         <FaRegThumbsUp className="text-gray-600 transition duration-300" />
//                                     )}
//                                     <span>{post.likes}</span>
//                                 </button>
//                                 <button className="flex items-center space-x-1" onClick={() => handleCommentToggle(post._id)}>
//                                     <span className="text-gray-600">💬</span>
//                                     <span>{post.comments.length}</span>
//                                 </button>
//                             </div>
//                             <p className="text-sm">Overall Sentiment: {post.overallSentiment}</p>
//                         </div>

//                         {/* Comment Section */}
//                         {post.showComments && ( // Highlighted: Toggle comment visibility
//                             <div>
//                                 <div className="flex items-center mb-4">
//                                     <input
//                                         type="text"
//                                         value={post.commentInput || ""}
//                                         onChange={(e) => handleCommentChange(post._id, e.target.value)}
//                                         placeholder="Add a comment..."
//                                         className="flex-grow border border-gray-300 rounded-lg py-2 px-3 mr-2"
//                                     />
//                                     <button
//                                         onClick={() => handleCommentSubmit(post._id)}
//                                         className="bg-blue-500 text-white px-4 py-2 rounded-lg"
//                                     >
//                                         Post
//                                     </button>
//                                 </div>
//                                 <div className="space-y-2">
//                                     {post.comments.map((comment, index) => (
//                                         <div key={index} className="flex items-center space-x-4">
//                                             <img src={comment.userDp || userProfilePic} alt="user" className="w-8 h-8 rounded-full object-cover" />
//                                             <div className="bg-gray-100 rounded-lg p-2 flex-grow">
//                                                 <div className='flex items-center gap-1'>
//                                                     <div className="font-semibold">{comment.user || "Anonymous"} : </div>
//                                                     <p>{comment.content}</p>
//                                                 </div>
//                                                 <span className="text-sm text-gray-600">Sentiment: {comment.sentiment || "Neutral"}</span>
//                                             </div>
//                                         </div>
//                                     ))}
//                                 </div>
//                             </div>
//                         )}
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// }

// export default HomePage;

// import { useState } from 'react';
// import { FaBell, FaSearch, FaPlus } from 'react-icons/fa';
// import Post from '../components/Post'; // Import your modal

// function HomePage() {
//     const userProfilePic = "https://via.placeholder.com/150";
//     const projectName = "SentimentX";

//     const [posts, setPosts] = useState([]);
//     const [isModalOpen, setIsModalOpen] = useState(false);

//     const handlePostCreate = (newPost) => {
//         setPosts([newPost, ...posts]); // Add the new post to the top of the list
//     };

//     const handleOpenModal = () => {
//         setIsModalOpen(true);
//     };

//     const handleCloseModal = () => {
//         setIsModalOpen(false);
//     };

//     return (
//         <div className="min-h-screen bg-gray-100">
//             {/* Navigation Bar */}
//             <div className="bg-white py-4 px-6 shadow-md flex justify-between items-center">
//                 <div className="text-xl font-bold text-gray-700">{projectName}</div>
//                 <div className="flex items-center space-x-6">
//                     <div className="flex items-center bg-gray-200 rounded-full px-3 py-2 w-full max-w-xs">
//                         <FaSearch className="text-gray-600 mr-2" />
//                         <input
//                             type="text"
//                             placeholder="Search..."
//                             className="bg-transparent outline-none text-gray-700 w-full"
//                         />
//                     </div>
//                     <FaBell className="text-gray-700 text-xl cursor-pointer" />
//                     <img
//                         src={userProfilePic}
//                         alt="User DP"
//                         className="w-10 h-10 rounded-full object-cover cursor-pointer"
//                     />
//                     <FaPlus
//                         className="text-gray-700 text-xl cursor-pointer"
//                         onClick={handleOpenModal} // Open modal when clicked
//                     />
//                 </div>
//             </div>

//             {/* Feed Section */}
//             <div className="container mx-auto py-10">
//                 {posts.map((post) => (
//                     <div key={post._id} className="bg-white rounded-lg shadow-md mb-6 p-6">
//                         {/* Post content here */}
//                     </div>
//                 ))}
//             </div>

//             {/* Create Post Modal */}
//             {isModalOpen && (
//                 <Post
//                     onClose={handleCloseModal}
//                     onPostCreate={handlePostCreate}
//                 />
//             )}
//         </div>
//     );
// }

// export default HomePage;

// import { useState, useEffect } from 'react';
// import { FaBell, FaSearch, FaPlus } from 'react-icons/fa';
// import Post from '../components/Post'; // Import your modal
// import axios from 'axios';

// function HomePage() {
//     const userProfilePic = "https://via.placeholder.com/150";
//     const projectName = "SentimentX";

//     const [posts, setPosts] = useState([]);
//     const [isModalOpen, setIsModalOpen] = useState(false);

//     const handlePostCreate = (newPost) => {
//         setPosts([newPost, ...posts]); // Add the new post to the top of the list
//     };

//     const handleOpenModal = () => {
//         setIsModalOpen(true);
//     };

//     const handleCloseModal = () => {
//         setIsModalOpen(false);
//     };

//     // Fetch posts when the component mounts
//     useEffect(() => {
//         const fetchPosts = async () => {
//             try {
//                 const response = await axios.get('http://localhost:3000/api/posts'); // Adjust the URL as needed
//                 setPosts(response.data); // Assuming the response contains an array of posts
//             } catch (error) {
//                 console.error('Error fetching posts:', error);
//             }
//         };

//         fetchPosts();
//     }, []); // Empty dependency array means this runs once when the component mounts

//     return (
//         <div className="min-h-screen bg-gray-100">
//             {/* Navigation Bar */}
//             <div className="bg-white py-4 px-6 shadow-md flex justify-between items-center">
//                 <div className="text-xl font-bold text-gray-700">{projectName}</div>
//                 <div className="flex items-center space-x-6">
//                     <div className="flex items-center bg-gray-200 rounded-full px-3 py-2 w-full max-w-xs">
//                         <FaSearch className="text-gray-600 mr-2" />
//                         <input
//                             type="text"
//                             placeholder="Search..."
//                             className="bg-transparent outline-none text-gray-700 w-full"
//                         />
//                     </div>
//                     <FaBell className="text-gray-700 text-xl cursor-pointer" />
//                     <img
//                         src={userProfilePic}
//                         alt="User DP"
//                         className="w-10 h-10 rounded-full object-cover cursor-pointer"
//                     />
//                     <FaPlus
//                         className="text-gray-700 text-xl cursor-pointer"
//                         onClick={handleOpenModal} // Open modal when clicked
//                     />
//                 </div>
//             </div>

//             {/* Feed Section */}
//             <div className="container mx-auto py-10">
//                 {posts.length === 0 ? (
//                     <div className="text-center text-gray-500">No posts yet. Create one!</div>
//                 ) : (
//                     posts.map((post) => (
//                         <div key={post._id} className="bg-white rounded-lg shadow-md mb-6 p-6">
//                             {/* Post content here */}
//                             <div className="flex items-start space-x-4">
//                                 <img
//                                     src={userProfilePic}
//                                     alt="User DP"
//                                     className="w-10 h-10 rounded-full object-cover"
//                                 />
//                                 <div>
//                                     <h3 className="font-semibold">{post.username || 'User'}</h3>
//                                     <p className="text-gray-700 mt-1">{post.content}</p>
//                                     {post.image && (
//                                         <img
//                                             src={post.image} // Assuming `post.image` holds the image URL
//                                             alt="Post"
//                                             className="mt-4 rounded-lg object-cover w-full h-64"
//                                         />
//                                     )}
//                                 </div>
//                             </div>
//                         </div>
//                     ))
//                 )}
//             </div>

//             {/* Create Post Modal */}
//             {isModalOpen && (
//                 <Post
//                     onClose={handleCloseModal}
//                     onPostCreate={handlePostCreate}
//                 />
//             )}
//         </div>
//     );
// }

// export default HomePage;


// import { useState, useEffect } from 'react';
// import { FaBell, FaSearch, FaPlus } from 'react-icons/fa';
// import Post from '../components/Post'; // Import your modal
// import axios from 'axios';

// function HomePage() {
//     const userProfilePic = "https://via.placeholder.com/150";
//     const projectName = "SentimentX";

//     const [posts, setPosts] = useState([]);
//     const [isModalOpen, setIsModalOpen] = useState(false);

//     const handlePostCreate = (newPost) => {
//         setPosts([newPost, ...posts]); // Add the new post to the top of the list
//     };

//     const handleOpenModal = () => {
//         setIsModalOpen(true);
//     };

//     const handleCloseModal = () => {
//         setIsModalOpen(false);
//     };

//     useEffect(() => {
//         const fetchPosts = async () => {
//             try {
//                 const response = await axios.get('http://localhost:3000/api/posts'); // Check this URL
//                 console.log(response.data); // Log the response to debug
//                 setPosts(response.data); // Ensure this matches your expected structure
//             } catch (error) {
//                 console.error('Error fetching posts:', error);
//             }
//         };

//         fetchPosts();
//     }, []);

//     return (
//         <div className="min-h-screen bg-gray-100">
//             {/* Navigation Bar */}
//             <div className="bg-white py-4 px-6 shadow-md flex justify-between items-center">
//                 <div className="text-xl font-bold text-gray-700">{projectName}</div>
//                 <div className="flex items-center space-x-6">
//                     <div className="flex items-center bg-gray-200 rounded-full px-3 py-2 w-full max-w-xs">
//                         <FaSearch className="text-gray-600 mr-2" />
//                         <input
//                             type="text"
//                             placeholder="Search..."
//                             className="bg-transparent outline-none text-gray-700 w-full"
//                         />
//                     </div>
//                     <FaBell className="text-gray-700 text-xl cursor-pointer" />
//                     <img
//                         src={userProfilePic}
//                         alt="User DP"
//                         className="w-10 h-10 rounded-full object-cover cursor-pointer"
//                     />
//                     <FaPlus
//                         className="text-gray-700 text-xl cursor-pointer"
//                         onClick={handleOpenModal}
//                     />
//                 </div>
//             </div>

//             {/* Feed Section */}
//             <div className="container mx-auto py-10">
//                 {posts.length === 0 ? (
//                     <div className="text-center text-gray-500">No posts yet. Create one!</div>
//                 ) : (
//                     posts.map((post) => (
//                         <div key={post._id} className="bg-white rounded-lg shadow-md mb-6 p-6">
//                             <div className="flex items-start space-x-4">
//                                 <img
//                                     src={userProfilePic}
//                                     alt="User DP"
//                                     className="w-10 h-10 rounded-full object-cover"
//                                 />
//                                 <div>
//                                     <h3 className="font-semibold">{post.username || 'User'}</h3>
//                                     {post.image && (
//                                         <img
//                                             src={`data:image/jpeg;base64,${post.image}`} // Convert Base64 string to image source
//                                             alt="Post Image"
//                                             className="mt-4 rounded-lg"
//                                         />
//                                     )}
//                                      <p className="text-gray-700 mt-2">{post.content}</p>
//                                 </div>
//                             </div>
//                         </div>
//                     ))
//                 )}
//             </div>

//             {/* Create Post Modal */}
//             {isModalOpen && (
//                 <Post
//                     onClose={handleCloseModal}
//                     onPostCreate={handlePostCreate}
//                 />
//             )}
//         </div>
//     );
// }

// export default HomePage;


import { useState, useEffect } from 'react';
import { FaBell, FaSearch, FaPlus, FaThumbsUp, FaRegThumbsUp, FaComment } from 'react-icons/fa';
import Post from '../components/Post'; // Import your modal
import axios from 'axios';
import { Link } from 'react-router-dom';

function HomePage() {
    const userProfilePic = "https://via.placeholder.com/150";
    const projectName = "SentimentX";

    const [posts, setPosts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handlePostCreate = (newPost) => {
        setPosts([newPost, ...posts]); // Add the new post to the top of the list
    };

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleLikeToggle = (id) => {
        setPosts(posts.map(post => {
            if (post._id === id) {
                const newLikes = post.hasLiked ? post.likes - 1 : post.likes + 1;
                return {
                    ...post,
                    likes: newLikes,
                    hasLiked: !post.hasLiked // Toggle the like state
                };
            }
            return post;
        }));
    };

    const handleCommentToggle = (id) => {
        setPosts(posts.map(post => {
            if (post._id === id) {
                return {
                    ...post,
                    showComments: !post.showComments // Toggle the comment section visibility
                };
            }
            return post;
        }));
    };

    const handleCommentChange = (id, value) => {
        setPosts(posts.map(post => {
            if (post._id === id) {
                return {
                    ...post,
                    commentInput: value // Update the comment input value
                };
            }
            return post;
        }));
    };

    const handleCommentSubmit = (id) => {
        setPosts(posts.map(post => {
            if (post._id === id) {
                const newComment = {
                    userDp: userProfilePic, // Assuming you have a user profile pic for comments
                    user: 'User', // You can replace this with the actual username
                    comment: post.commentInput,
                    sentiment: 'Positive' // Replace this with actual sentiment if needed
                };
                return {
                    ...post,
                    comments: [...post.comments, newComment], // Add the new comment to the comments array
                    commentInput: '', // Clear the comment input field
                    showComments: true // Ensure the comments are shown
                };
            }
            return post;
        }));
    };

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/posts'); // Check this URL
                console.log(response.data); // Log the response to debug
                setPosts(response.data); // Ensure this matches your expected structure
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };

        fetchPosts();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Navigation Bar */}
            <div className="bg-white py-4 px-6 shadow-md flex justify-between items-center">
                <div className="text-xl font-bold text-gray-700">{projectName}</div>
                <div className="flex items-center space-x-6">
                    <div className="flex items-center bg-gray-200 rounded-full px-3 py-2 w-full max-w-xs">
                        <FaSearch className="text-gray-600 mr-2" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="bg-transparent outline-none text-gray-700 w-full"
                        />
                    </div>
                    <FaBell className="text-gray-700 text-xl cursor-pointer" />
                    <Link to="/profile">
                    <img
                        src={userProfilePic}
                        alt="User DP"
                        className="w-10 h-10 rounded-full object-cover cursor-pointer"
                    />
                    </Link>
                    <FaPlus
                        className="text-gray-700 text-xl cursor-pointer"
                        onClick={handleOpenModal}
                    />
                </div>
            </div>

            {/* Feed Section */}
            <div className="container mx-auto py-10">
                {posts.length === 0 ? (
                    <div className="text-center text-gray-500">No posts yet. Create one!</div>
                ) : (
                    posts.map((post) => (
                        <div key={post._id} className="bg-white rounded-lg shadow-md mb-6 p-6">
                            <div className=" p-2 items-start space-x-4">
                               <div className='flex items-center gap-3'>
                               <img
                                    src={userProfilePic}
                                    alt="User DP"
                                    className="w-10 h-10 rounded-full object-cover"
                                />
                                <h3 className="font-semibold">{post.username || 'User'}</h3>
                               </div>
                                <div>
                                    
                                    {post.image && (
                                        <div className='h-[40vw]'>
                                            <img
                                            src={`data:image/jpeg;base64,${post.image}`} // Convert Base64 string to image source
                                            alt="Post Image"
                                            className="w-full h-full object-cover mt-4 rounded-lg"
                                        />
                                        </div>
                                    )}
                                    <p className="text-gray-700 mt-3">{post.content}</p>
                                </div>
                                {/* Like and Comment Icons */}
                                <div className="flex items-center gap-3 mt-4">
                                <button
                                    onClick={() => handleLikeToggle(post._id)}
                                    className="flex items-center text-gray-600"
                                >
                                    {post.hasLiked ? (
                                        <FaThumbsUp className="text-blue-500 mr-1" />
                                    ) : (
                                        <FaRegThumbsUp className="mr-1" />
                                    )}
                                    <span>{post.likes}</span>
                                </button>

                                <button
                                    onClick={() => handleCommentToggle(post._id)}
                                    className="flex items-center text-gray-600"
                                >
                                    <FaComment className="mr-1" />
                                    <span>{post.comments.length}</span>
                                </button>
                            </div>
                            </div>

                         
                            

                            {/* Comment Section */}
                            {post.showComments && (
                                <div className="mt-4">
                                    <div className="flex items-center mb-2">
                                        <input
                                            type="text"
                                            value={post.commentInput}
                                            onChange={(e) => handleCommentChange(post._id, e.target.value)}
                                            placeholder="Add a comment..."
                                            className="flex-grow border border-gray-300 rounded-lg py-2 px-3 mr-2"
                                        />
                                        <button
                                            onClick={() => handleCommentSubmit(post._id)}
                                            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                                        >
                                            Post
                                        </button>
                                    </div>
                                    <div className="space-y-2">
                                        {post.comments.map((comment, index) => (
                                            <div key={index} className="flex items-center space-x-4">
                                                <img src={comment.userDp} alt="user" className="w-8 h-8 rounded-full object-cover" />
                                                <div className="bg-gray-100 rounded-lg p-2 flex-grow">
                                                    <div className="font-semibold">{comment.user}</div>
                                                    <p>{comment.comment}</p>
                                                    <span className="text-sm text-gray-600">Sentiment: {comment.sentiment}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* Create Post Modal */}
            {isModalOpen && (
                <Post
                    onClose={handleCloseModal}
                    onPostCreate={handlePostCreate}
                />
            )}
        </div>
    );
}

export default HomePage;
