
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
