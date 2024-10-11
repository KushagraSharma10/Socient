// import { useEffect, useState } from 'react';
// import { FaTimes, FaImages } from 'react-icons/fa';
// import { ImSpinner2 } from 'react-icons/im';
// import axios from 'axios';

// const Post = ({ onClose, onPostCreate, isDarkMode }) => {
//     const [content, setContent] = useState('');
//     const [image, setImage] = useState(null);
//     const [imagePreview, setImagePreview] = useState(null);
//     const [userDp, setUserDp] = useState(null);
//     const [isLoading, setIsLoading] = useState(false);
    
//     const loggedInUserId = localStorage.getItem('userId');

//     const fetchUserProfilePicture = async (userId) => {
//         try {
//             const response = await axios.get(`http://localhost:3000/api/users/${userId}`);
//             console.log(response.data.profilePicture)
//             return response.data.profilePicture;
//         } catch (error) {
//             console.error("Error fetching user profile picture:", error);
//             return null;
//         }
//     };

//     useEffect(() => {
//         const getUserDp = async () => {
//             const profilePic = await fetchUserProfilePicture(loggedInUserId);
//             setUserDp(profilePic);
//         };
//         getUserDp();
//     }, [loggedInUserId]);

//     const handleImageUpload = (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             setImage(file);
//             const previewUrl = URL.createObjectURL(file);
//             setImagePreview(previewUrl);
//         }
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setIsLoading(true);
//         const formData = new FormData();
//         formData.append('content', content);
//         formData.append('image', image);
//         formData.append('userDp', userDp);

//         try {
//             const token = localStorage.getItem('token');
//             const response = await axios.post('http://localhost:3000/api/posts', formData, {
//                 headers: {
//                     'Content-Type': 'multipart/form-data',
//                     'Authorization': `Bearer ${token}`
//                 },
//             });
            
//             if (response.status === 201) {
//                 const newPost = response.data;
//                 onPostCreate(newPost);
//                 onClose();
//             }
            
//         } catch (error) {
//             console.error('Error creating post:', error);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     return (
//         <div className={`fixed inset-0 flex justify-center items-center ${isDarkMode ? 'bg-black bg-opacity-30' : 'bg-zinc-500 bg-opacity-30'} backdrop-blur-[.1vw]`}>
//             <div className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-zinc-300 text-black'} rounded-lg shadow-lg p-6 w-full max-w-3xl`}>
//                 <div className="flex justify-between items-center">
//                     <h2 className="text-2xl font-bold">Create Post</h2>
//                     <FaTimes className={`cursor-pointer ${isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-800'}`} onClick={onClose} />
//                 </div>
//                 <form onSubmit={handleSubmit}>
//                     <div className="flex mt-4 space-x-4">
//                         <textarea
//                             className={`w-2/3 p-4 border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'outline-none bg-zinc-200 text-black'} rounded-lg resize-none`}
//                             rows="5"
//                             placeholder="What's on your mind?"
//                             value={content}
//                             onChange={(e) => setContent(e.target.value)}
//                             required
//                         ></textarea>

//                         {imagePreview && (
//                             <div className="w-1/3 flex items-center justify-center">
//                                 <img
//                                     src={imagePreview}
//                                     alt="Preview"
//                                     className="object-cover w-full h-full rounded-lg shadow-md"
//                                 />
//                             </div>
//                         )}
//                     </div>

//                     <div className="mt-4 flex items-center space-x-4">
//                         <label className={`cursor-pointer flex items-center justify-center w-12 h-12 ${isDarkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-200 hover:bg-gray-300'} rounded-full`}>
//                             <FaImages className={`text-xl ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`} />
//                             <input
//                                 type="file"
//                                 className="hidden"
//                                 accept="image/*"
//                                 onChange={handleImageUpload}
//                             />
//                         </label>

//                         <button
//                             type="submit"
//                             className="w-[27vw] bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 flex items-center justify-center"
//                             disabled={isLoading}
//                         >
//                             {isLoading ? (
//                                 <ImSpinner2 className="animate-spin text-white text-2xl" />
//                             ) : (
//                                 'Post'
//                             )}
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default Post;

import { useEffect, useState } from 'react';
import { FaTimes, FaImages } from 'react-icons/fa';
import { ImSpinner2 } from 'react-icons/im';
import axios from 'axios';

const Post = ({ onClose, onPostCreate, isDarkMode }) => {
    const [content, setContent] = useState('');
    const [images, setImages] = useState([]); // Array to store multiple images
    const [imagePreviews, setImagePreviews] = useState([]); // Array to store previews of selected images
    const [userDp, setUserDp] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    
    const loggedInUserId = localStorage.getItem('userId');

    const fetchUserProfilePicture = async (userId) => {
        try {
            const response = await axios.get(`http://localhost:3000/api/users/${userId}`);
            return response.data.profilePicture;
        } catch (error) {
            console.error("Error fetching user profile picture:", error);
            return null;
        }
    };

    useEffect(() => {
        const getUserDp = async () => {
            const profilePic = await fetchUserProfilePicture(loggedInUserId);
            setUserDp(profilePic);
        };
        getUserDp();
    }, [loggedInUserId]);

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files); // Convert FileList to an array

        // Append new images to the existing images array
        setImages((prevImages) => [...prevImages, ...files]);

        // Create previews for newly selected images
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setImagePreviews((prevPreviews) => [...prevPreviews, ...newPreviews]); // Append new previews
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const formData = new FormData();
        formData.append('content', content);

        // Append all images to formData under the same field name 'images[]'
        images.forEach((image) => {
            formData.append('images', image);  // Use 'images' as the field name for all images
        });

        formData.append('userDp', userDp);

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:3000/api/posts', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                },
            });
            
            if (response.status === 201) {
                const newPost = response.data;
                onPostCreate(newPost);
                onClose();
            }
            
        } catch (error) {
            console.error('Error creating post:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={`fixed inset-0 flex justify-center items-center ${isDarkMode ? 'bg-black bg-opacity-30' : 'bg-zinc-500 bg-opacity-30'} backdrop-blur-[.1vw]`}>
            <div className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-zinc-300 text-black'} rounded-lg shadow-lg p-6 w-full max-w-3xl`}>
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">Create Post</h2>
                    <FaTimes className={`cursor-pointer ${isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-800'}`} onClick={onClose} />
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="flex mt-4 space-x-4">
                        <textarea
                            className={`w-2/3 p-4 border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'outline-none bg-zinc-200 text-black'} rounded-lg resize-none`}
                            rows="5"
                            placeholder="What's on your mind?"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                        ></textarea>

                        {/* Display previews of all selected images */}
                        {imagePreviews.length > 0 && (
                            <div className="w-1/3 flex flex-wrap gap-2 justify-center">
                                {imagePreviews.map((preview, index) => (
                                    <img
                                        key={index}
                                        src={preview}
                                        alt={`Preview ${index}`}
                                        className="object-cover w-full h-[8vw] rounded-lg shadow-md"
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="mt-4 flex items-center space-x-4">
                        <label className={`cursor-pointer flex items-center justify-center w-12 h-12 ${isDarkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-200 hover:bg-gray-300'} rounded-full`}>
                            <FaImages className={`text-xl ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`} />
                            <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={handleImageUpload}
                                multiple // Allow multiple file selection
                            />
                        </label>

                        <button
                            type="submit"
                            className="w-[27vw] bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 flex items-center justify-center"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <ImSpinner2 className="animate-spin text-white text-2xl" />
                            ) : (
                                'Post'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Post;
