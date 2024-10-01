import { useState, useEffect } from 'react';
import { FaBell, FaSearch, FaPlus, FaThumbsUp, FaRegThumbsUp, FaComment } from 'react-icons/fa';
import Post from '../components/Post'; // Import your modal
import axios from 'axios';
import { Link } from 'react-router-dom';

function HomePage() {
    const userProfilePic = "https://via.placeholder.com/150"; // Placeholder for user profile pic, replace this
    const projectName = "SentimentX";

    const [posts, setPosts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

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

    const handlePostCreate = (newPost) => {
        setPosts([newPost, ...posts]);
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
                    hasLiked: !post.hasLiked
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
                    showComments: !post.showComments
                };
            }
            return post;
        }));
    };

    const handleCommentChange = (id, value) => {
        setPosts(posts.map(post => {
            if (post._id === id) {
                return { ...post, commentInput: value }; // Update the commentInput for the specific post
            }
            return post;
        }));
    };

    //     const post = posts.find(post => post._id === id);
    //     console.log('Comment being submitted:', post.commentInput);
    //     if (!post || post.commentInput.trim() === "") return;

    //     const newComment = {
    //       content: post.commentInput,
    //       sentiment: 'Positive', // Placeholder, could be based on sentiment analysis logic
    //     };

    //     try {
    //       const token = localStorage.getItem('token');
    //       const response = await axios.post(`http://localhost:3000/api/posts/${id}/comments`, newComment, {
    //         headers: { Authorization: `Bearer ${token}` }
    //       });

    //       if (response.status === 201) {
    //         const savedComment = response.data;
    //         console.log('Saved comment:', savedComment); // Debugging
    //         setPosts(posts.map(post => {
    //           if (post._id === id) {
    //             return {
    //               ...post,
    //               comments: [...(post.comments || []), savedComment], // Ensure comments array is not undefined
    //               commentInput: '', // Clear comment input after submission
    //             };
    //           }
    //           return post;
    //         }));
    //       }
    //     } catch (error) {
    //       console.error('Error submitting comment:', error);
    //     }
    //   };

    // const handleCommentSubmit = async (id) => {
    //     const post = posts.find(post => post._id === id);

    //     // Ensure that the post exists and the comment input is not empty or whitespace
    //     if (!post || !post.commentInput || post.commentInput.trim() === "") return;

    //     const newComment = {
    //         content: post.commentInput, // Use the commentInput for content
    //         sentiment: 'Positive', // Placeholder sentiment, could be dynamic
    //     };

    //     try {
    //         const token = localStorage.getItem('token');
    //         const response = await axios.post(`http://localhost:3000/api/posts/${id}/comments`, newComment, {
    //             headers: { Authorization: `Bearer ${token}` }
    //         });

    //         if (response.status === 201) {
    //             const savedComment = response.data.comment; // Access the saved comment
    //             console.log('Saved comment:', savedComment); // Debugging

    //             // Update the posts state immutably to add the new comment and clear the comment input
    //             setPosts(posts.map(post => {
    //                 if (post._id === id) {
    //                     return {
    //                         ...post,
    //                         comments: [...(post.comments || []), savedComment], // Add the new comment
    //                         commentInput: '', // Clear the comment input after submission
    //                     };
    //                 }
    //                 return post;
    //             }));
    //         }
    //     } catch (error) {
    //         console.error('Error submitting comment:', error);
    //     }
    // };

    // const handleCommentSubmit = async (id) => {
    //     const post = posts.find(post => post._id === id);
    
    //     // Ensure that the post exists and the comment input is not empty or whitespace
    //     if (!post || !post.commentInput || post.commentInput.trim() === "") return;
    
    //     const newComment = {
    //         content: post.commentInput, // Use the commentInput for content
    //         // No need to set sentiment here, it will be set on the backend
    //     };
    
    //     try {
    //         const token = localStorage.getItem('token');
    //         const response = await axios.post(`http://localhost:3000/api/posts/${id}/comments`, newComment, {
    //             headers: { Authorization: `Bearer ${token}` }
    //         });
    
    //         if (response.status === 201) {
    //             const savedComment = response.data.comment; // Access the saved comment
    //             console.log('Saved comment:', savedComment); // Debugging
    
    //             // Update the posts state immutably to add the new comment and clear the comment input
    //             setPosts(posts.map(post => {
    //                 if (post._id === id) {
    //                     return {
    //                         ...post,
    //                         comments: [...(post.comments || []), savedComment], // Add the new comment
    //                         commentInput: '', // Clear the comment input after submission
    //                     };
    //                 }
    //                 return post;
    //             }));
    //         }
    //     } catch (error) {
    //         console.error('Error submitting comment:', error);
    //     }
    // };
    
    const handleCommentSubmit = async (id) => {
        const post = posts.find(post => post._id === id);
    
        // Ensure that the post exists and the comment input is not empty or whitespace
        if (!post || !post.commentInput || post.commentInput.trim() === "") return;
    
        const newComment = {
            content: post.commentInput, // Use the commentInput for content
            userDp: "https://via.placeholder.com/50", // Provide a default user DP or use dynamic user DP
        };
    
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`http://localhost:3000/api/posts/${id}/comments`, newComment, {
                headers: { Authorization: `Bearer ${token}` }
            });
    
            if (response.status === 201) {
                const savedComment = response.data.comment; // Access the saved comment
                console.log('Saved comment:', savedComment); // Debugging
    
                // Update the posts state immutably to add the new comment and clear the comment input
                setPosts(posts.map(post => {
                    if (post._id === id) {
                        return {
                            ...post,
                            comments: [...(post.comments || []), savedComment], // Add the new comment
                            commentInput: '', // Clear the comment input after submission
                        };
                    }
                    return post;
                }));
            }
        } catch (error) {
            console.error('Error submitting comment:', error);
        }
    };
    



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
                            <div className="p-2 items-start space-x-4">
                                <div className='flex items-center gap-3'>
                                    <img
                                        src={userProfilePic}
                                        alt="User DP"
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                    <h3 className="font-semibold">{post.userId ? post.userId.username : 'User'}</h3>

                                </div>
                                <div>
                                    {post.image && (
                                        <div className='h-[40vw]'>
                                            <img
                                                src={`data:image/jpeg;base64,${post.image}`}
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
                                        <span>{(post.comments || []).length}</span> {/* Safe access to comments */}
                                    </button>
                                </div>
                            </div>

                            {/* Comment Section */}
                            {post.showComments && (
                                <div className="mt-4">
                                    <div className="flex items-center mb-2">
                                        <input
                                            type="text"
                                            value={post.commentInput || ""} // Ensure the input is controlled
                                            onChange={(e) => handleCommentChange(post._id, e.target.value)} // Call handleCommentChange on input change
                                            placeholder="Add a comment..."
                                            className="flex-grow border border-gray-300 rounded-lg py-2 px-3 mr-2"
                                        />
                                        <button
                                            onClick={() => handleCommentSubmit(post._id)} // Call handleCommentSubmit on click
                                            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                                        >
                                            Post
                                        </button>
                                    </div>
                                    <div className="space-y-2">
                                        {(post.comments || []).map((comment, index) => ( // Safe access to comments array
                                            <div key={index} className="flex items-center space-x-4">
                                                <img src={comment.userDp} alt="user" className="w-8 h-8 rounded-full object-cover" />
                                                <div className="bg-gray-100 rounded-lg p-2 flex-grow">
                                                    <div className="font-semibold">{comment.userId ? comment.userId.username : 'Unknown User'}</div>
                                                    <p>{comment.content}</p> {/* Display the comment content */}
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
