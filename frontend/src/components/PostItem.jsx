
import React, { memo, useState, useRef } from 'react';
import { FaThumbsUp, FaRegThumbsUp, FaComment, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';

const PostItem = memo(({ post, handleLikeToggle, handleCommentToggle, handleCommentChange, handleCommentSubmit, isDarkMode }) => {
    
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const swiperRef = useRef(null); // Ref to control Swiper

    const handleNextImage = () => {
        if (currentImageIndex < post.images.length - 1) {
            setCurrentImageIndex(currentImageIndex + 1);
            swiperRef.current.slideTo(currentImageIndex + 1); // Move Swiper to next image
        }
    };

    const handlePrevImage = () => {
        if (currentImageIndex > 0) {
            setCurrentImageIndex(currentImageIndex - 1);
            swiperRef.current.slideTo(currentImageIndex - 1); // Move Swiper to previous image
        }
    };

    return (
        <div className={`rounded-lg shadow-md mb-6 w-[50vw] h-fit transition-colors duration-500 ${isDarkMode ? 'bg-zinc-800' : 'bg-gray-200'}`}>
            <div className="p-2 items-start">
                <div className='flex items-center gap-3'>
                    <img
                        src={post.userId?.profilePicture || "https://via.placeholder.com/50"}
                        alt="User DP"
                        className="w-10 h-10 rounded-full object-cover"
                    />
                    <h3 className="font-semibold">{post.userId ? post.userId.username : 'User'}</h3>
                </div>
                <div>
                    {post.images && post.images.length > 0 ? (
                        <div className='w-full h-[70vh] mt-3 rounded-lg overflow-hidden relative'>
                            {/* Swiper to display multiple images */}
                            <Swiper
                                spaceBetween={0}
                                slidesPerView={1}
                                initialSlide={currentImageIndex}
                                onSwiper={(swiper) => (swiperRef.current = swiper)} // Store Swiper instance
                            >
                                {post.images.map((image, index) => (
                                    <SwiperSlide key={index}>
                                        <div className="w-full h-[100vh] overflow-hidden flex items-center justify-center hover:scale-105 transition-all duration-500 bg-gray-100">
                                            <img
                                                src={image}  // Make sure the image URL is valid
                                                alt={`Post Image ${index}`}
                                                className="w-full h-full object-cover object-bottom"
                                            />
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                            {/* Left arrow */}
                            {currentImageIndex > 0 && (
                                <button
                                    onClick={handlePrevImage}
                                    className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white p-2 rounded-full z-10"
                                >
                                    <FaArrowLeft className="w-5 h-5" />
                                </button>
                            )}
                            {/* Right arrow */}
                            {currentImageIndex < post.images.length - 1 && (
                                <button
                                    onClick={handleNextImage}
                                    className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white p-2 rounded-full z-10"
                                >
                                    <FaArrowRight className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                    ) : (
                        <p>No images available</p> // Fallback if no images are available
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
                <div className="mt-2 px-2 pb-2">
                    <div className="flex items-center mb-2">
                        <input
                            type="text"
                            value={post.commentInput || ""}
                            onChange={(e) => handleCommentChange(post._id, e.target.value)}
                            placeholder="Add a comment..."
                            className={`flex-grow  ${isDarkMode ? 'border-gray-600 bg-zinc-900 text-white' : 'border-gray-300 bg-white text-black'} rounded-lg py-2 px-3 mr-2`}
                        />
                        <button
                            onClick={() => handleCommentSubmit(post._id)}
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                        >
                            Post
                        </button>
                    </div>
                    <div className="space-y-2 mt-3 px-3 ">
                        {(post.comments || []).map((comment, index) => (
                            <div key={index} className="flex items-center space-x-2">
                                <img src={comment.userDp} alt="user" className="w-8 h-8 rounded-full object-cover" />
                                <div className={`${isDarkMode ? 'bg-zinc-900 text-white' : 'bg-gray-100 text-black'} rounded-lg p-2 flex-grow`}>
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
