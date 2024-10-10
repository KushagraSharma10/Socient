import React, { memo } from 'react';
import { FaThumbsUp, FaRegThumbsUp, FaComment } from 'react-icons/fa';

// PostItem component to render each individual post
const PostItem = memo(({ post, handleLikeToggle, handleCommentToggle, handleCommentChange, handleCommentSubmit, isDarkMode }) => {
    return (
        <div key={post._id} className={`rounded-lg shadow-md mb-6  w-[50vw] h-fit bg-red-500 transition-colors duration-500 ${isDarkMode ? 'bg-zinc-800' : 'bg-gray-200'}`}>
            <div className="p-2 items-start ">
                <div className='flex items-center gap-3'>
                    <img
                        src={post.userId?.profilePicture || "https://via.placeholder.com/50"}
                        alt="User DP"
                        className="w-10 h-10 rounded-full object-cover"
                    />
                    <h3 className="font-semibold">{post.userId ? post.userId.username : 'User'}</h3>
                </div>
                <div>
                    {post.image && (
                        <div className='w-full h-[33vw] mt-3  rounded-lg overflow-hidden'>
                            <img
                                src={post.image}
                                alt="Post Image"
                                className="w-full h-full object-cover transition-transform duration-500 ease-in-out transform hover:scale-105"
                            />
                        </div>
                    )}
                    <p className="mt-3">{post.content}</p>
                </div>
                <div className='flex items-center justify-between px-3'>
                    <div className="flex items-center gap-3 mt-2">
                        <button
                            onClick={() => handleLikeToggle(post._id)}
                            className="flex items-center"
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
                            className="flex items-center"
                        >
                            <FaComment className="mr-1" />
                            <span>{(post.comments || []).length}</span>
                        </button>
                    </div>
                    {post.overallSentiment && (
                        <div className="mt-2 text-md font-semibold">
                            Overall Sentiment:{" "}
                            <span className={`${post.overallSentiment === 'positive'
                                ? 'text-green-500'
                                : post.overallSentiment === 'negative'
                                    ? 'text-red-500'
                                    : 'text-gray-600'
                                }`}
                            >
                                {post.overallSentiment}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {post.showComments && (
                <div className="mt-4">
                    <div className="flex items-center mb-2">
                        <input
                            type="text"
                            value={post.commentInput || ""}
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
                        {(post.comments || []).map((comment, index) => (
                            <div key={index} className="flex items-center space-x-4">
                                <img src={comment.userDp} alt="user" className="w-8 h-8 rounded-full object-cover" />
                                <div className="bg-gray-100 rounded-lg p-2 flex-grow">
                                    <div className="font-semibold">{comment.userId.username}</div>
                                    <p>{comment.content}</p>
                                    <span className="text-sm text-gray-600">Sentiment: {comment.sentiment}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
});

export default PostItem;