import { useState } from 'react';
import { FaTimes, FaImages } from 'react-icons/fa';
import axios from 'axios';

const Post = ({ onClose, onPostCreate }) => {
    const [content, setContent] = useState('');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('content', content);
        formData.append('image', image);

        try {

            const token = localStorage.getItem('token');

            const response = await axios.post('http://localhost:3000/api/posts', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                },
            });

            if (response.status === 201) {
                onPostCreate(response.data); // Pass the new post back to the homepage
                onClose(); // Close the modal after submitting
            }
        } catch (error) {
            console.error('Error creating post:', error);
        }
    };

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-30 backdrop-blur-[.1vw]">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">Create Post</h2>
                    <FaTimes className="cursor-pointer text-gray-600 hover:text-gray-800" onClick={onClose} />
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="flex mt-4 space-x-4">
                        <textarea
                            className="w-2/3 p-4 border border-gray-300 rounded-lg resize-none"
                            rows="6"
                            placeholder="What's on your mind?"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                        ></textarea>

                        {imagePreview && (
                            <div className="w-1/3 flex items-center justify-center">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="object-cover w-full h-full rounded-lg shadow-md"
                                />
                            </div>
                        )}
                    </div>

                    <div className="mt-4 flex items-center space-x-4">
                        <label className="cursor-pointer flex items-center justify-center w-12 h-12 bg-gray-200 hover:bg-gray-300 rounded-full">
                            <FaImages className="text-xl text-gray-700" />
                            <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={handleImageUpload}
                            />
                        </label>

                        <button
                            type="submit"
                            className="w-[27vw] bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
                        >
                            Post
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Post;
