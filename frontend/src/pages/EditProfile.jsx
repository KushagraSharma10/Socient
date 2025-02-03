// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { motion } from 'framer-motion';
// import { FiUser, FiMail, FiEdit, FiImage, FiSave, FiArrowLeft } from 'react-icons/fi';

// const EditProfile = () => {
//     const navigate = useNavigate();
//     const [user, setUser] = useState({
//         name: '',
//         username: '',
//         email: '',
//         bio: '',
//         profilePicture: ''
//     });
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState('');
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const [previewImage, setPreviewImage] = useState('');

//     // Fetch current user data
//     useEffect(() => {
//         const fetchUserData = async () => {
//             try {
//                 const token = localStorage.getItem('token');
//                 const response = await axios.get(`http://localhost:3000/api/users/${userId}/edit`, {
//                     headers: { Authorization: `Bearer ${token}` }
//                 });
//                 setUser(response.data);
//                 setPreviewImage(response.data.profilePicture);
//                 setLoading(false);
//             } catch (err) {
//                 setError('Failed to load profile data');
//                 setLoading(false);
//             }
//         };
//         fetchUserData();
//     }, []);

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setUser(prev => ({ ...prev, [name]: value }));
//     };

//     const handleImageUpload = async (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             const reader = new FileReader();
//             reader.onloadend = () => {
//                 setPreviewImage(reader.result);
//             };
//             reader.readAsDataURL(file);
            
//             // Here you would typically upload to your server
//             // Example: const result = await uploadImage(file);
//             // setUser(prev => ({ ...prev, profilePicture: result.url }));
//         }
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setIsSubmitting(true);
//         try {
//             const token = localStorage.getItem('token');
//             await axios.put('http://localhost:3000/api/users/me', user, {
//                 headers: { Authorization: `Bearer ${token}` }
//             });
//             navigate('/profile');
//         } catch (err) {
//             setError(err.response?.data?.message || 'Update failed');
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     if (loading) {
//         return (
//             <div className="min-h-screen bg-gray-900 flex items-center justify-center">
//                 <div className="animate-pulse text-emerald-400 text-xl">Loading profile...</div>
//             </div>
//         );
//     }

//     return (
//         <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             className="min-h-screen bg-gray-900 text-gray-100"
//         >
//             <div className="max-w-2xl mx-auto px-4 py-8">
//                 <div className="flex items-center mb-8">
//                     <button
//                         onClick={() => navigate(-1)}
//                         className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
//                     >
//                         <FiArrowLeft className="w-6 h-6" />
//                     </button>
//                     <h1 className="text-3xl font-bold ml-4">Edit Profile</h1>
//                 </div>

//                 <form onSubmit={handleSubmit} className="space-y-6">
//                     {/* Profile Picture Upload */}
//                     <div className="flex flex-col items-center">
//                         <div className="relative group">
//                             <label className="cursor-pointer">
//                                 <input
//                                     type="file"
//                                     accept="image/*"
//                                     onChange={handleImageUpload}
//                                     className="hidden"
//                                 />
//                                 <img
//                                     src={previewImage || 'https://via.placeholder.com/150'}
//                                     alt="Profile"
//                                     className="w-32 h-32 rounded-full object-cover border-4 border-gray-800 hover:border-emerald-500 transition-all"
//                                 />
//                                 <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
//                                     <FiImage className="w-8 h-8 text-white" />
//                                 </div>
//                             </label>
//                         </div>
//                     </div>

//                     {/* Form Fields */}
//                     <div className="space-y-4">
//                         <div className="bg-gray-800 p-4 rounded-xl">
//                             <label className="flex items-center space-x-3">
//                                 <FiUser className="w-5 h-5 text-emerald-400" />
//                                 <input
//                                     type="text"
//                                     name="name"
//                                     value={user.name}
//                                     onChange={handleInputChange}
//                                     placeholder="Full Name"
//                                     className="w-full bg-transparent focus:outline-none"
//                                 />
//                             </label>
//                         </div>

//                         <div className="bg-gray-800 p-4 rounded-xl">
//                             <label className="flex items-center space-x-3">
//                                 <FiEdit className="w-5 h-5 text-emerald-400" />
//                                 <input
//                                     type="text"
//                                     name="username"
//                                     value={user.username}
//                                     onChange={handleInputChange}
//                                     placeholder="Username"
//                                     className="w-full bg-transparent focus:outline-none"
//                                 />
//                             </label>
//                         </div>

//                         <div className="bg-gray-800 p-4 rounded-xl">
//                             <label className="flex items-center space-x-3">
//                                 <FiMail className="w-5 h-5 text-emerald-400" />
//                                 <input
//                                     type="email"
//                                     name="email"
//                                     value={user.email}
//                                     onChange={handleInputChange}
//                                     placeholder="Email"
//                                     className="w-full bg-transparent focus:outline-none"
//                                 />
//                             </label>
//                         </div>

//                         <div className="bg-gray-800 p-4 rounded-xl">
//                             <textarea
//                                 name="bio"
//                                 value={user.bio}
//                                 onChange={handleInputChange}
//                                 placeholder="Tell us about yourself..."
//                                 className="w-full bg-transparent h-32 resize-none focus:outline-none"
//                                 maxLength="250"
//                             />
//                             <div className="text-right text-sm text-gray-400">
//                                 {user.bio.length}/250
//                             </div>
//                         </div>
//                     </div>

//                     {/* Error Message */}
//                     {error && (
//                         <div className="text-red-400 text-center">{error}</div>
//                     )}

//                     {/* Submit Button */}
//                     <motion.button
//                         whileHover={{ scale: 1.02 }}
//                         whileTap={{ scale: 0.98 }}
//                         type="submit"
//                         disabled={isSubmitting}
//                         className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-semibold flex items-center justify-center space-x-2 transition-colors disabled:opacity-50"
//                     >
//                         <FiSave className="w-5 h-5" />
//                         <span>{isSubmitting ? 'Saving...' : 'Save Changes'}</span>
//                     </motion.button>
//                 </form>
//             </div>
//         </motion.div>
//     );
// };

// export default EditProfile;
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiUser, FiMail, FiEdit, FiImage, FiSave, FiArrowLeft } from 'react-icons/fi';

const EditProfile = () => {
    const { userId } = useParams(); // Get userId from the URL
    const navigate = useNavigate();
    const [user, setUser] = useState({
        name: '',
        username: '',
        email: '',
        bio: '',
        profilePicture: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch user data
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://localhost:3000/api/users/${userId}/edit`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUser(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to load profile data');
                setLoading(false);
            }
        };
        fetchUserData();
    }, [userId]);

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUser(prev => ({ ...prev, [name]: value }));
    };

    // Handle profile picture upload to ImageKit
    // const handleImageUpload = async (e) => {
    //     const file = e.target.files[0];
    //     if (file) {
    //         try {
    //             const formData = new FormData();
    //             formData.append('file', file);
    //             formData.append('fileName', file.name);

    //             // Upload to ImageKit
    //             const response = await axios.post(
    //                 'https://upload.imagekit.io/api/v1/files/upload',
    //                 formData,
    //                 {
    //                     headers: {
    //                         'Content-Type': 'multipart/form-data',
    //                         Authorization: `Basic ${btoa('your_private_key:')}` // Add your ImageKit private key
    //                     }
    //                 }
    //             );

    //             // Update profile picture URL
    //             setUser(prev => ({ ...prev, profilePicture: response.data.url }));
    //         } catch (err) {
    //             setError('Failed to upload image');
    //         }
    //     }
    // };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            await axios.put(
                `http://localhost:3000/api/users/${userId}`,
                user,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            navigate(`/profile/${userId}`); // Redirect to profile page
        } catch (err) {
            setError(err.response?.data?.message || 'Update failed');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="animate-pulse text-emerald-400 text-xl">Loading profile...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 p-4">
            <div className="max-w-2xl mx-auto">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 hover:bg-gray-800 rounded-lg"
                >
                    <FiArrowLeft className="w-6 h-6" />
                </button>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6 mt-6">
                    {/* Profile Picture */}
                    <div className="flex flex-col items-center">
                        <label className="cursor-pointer">
                            <input
                                type="file"
                                accept="image/*"
                                // onChange={handleImageUpload}
                                className="hidden"
                            />
                            <img
                                src={user.profilePicture || 'https://via.placeholder.com/150'}
                                alt="Profile"
                                className="w-32 h-32 rounded-full object-cover border-4 border-gray-800 hover:border-emerald-500 transition-all"
                            />
                        </label>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-4">
                        {/* Name */}
                        <div className="bg-gray-800 p-4 rounded-xl">
                            <label className="flex items-center space-x-3">
                                <FiUser className="w-5 h-5 text-emerald-400" />
                                <input
                                    type="text"
                                    name="name"
                                    value={user.name}
                                    onChange={handleInputChange}
                                    placeholder="Full Name"
                                    className="w-full bg-transparent focus:outline-none"
                                />
                            </label>
                        </div>

                        {/* Username */}
                        <div className="bg-gray-800 p-4 rounded-xl">
                            <label className="flex items-center space-x-3">
                                <FiEdit className="w-5 h-5 text-emerald-400" />
                                <input
                                    type="text"
                                    name="username"
                                    value={user.username}
                                    onChange={handleInputChange}
                                    placeholder="Username"
                                    className="w-full bg-transparent focus:outline-none"
                                />
                            </label>
                        </div>

                        {/* Email */}
                        <div className="bg-gray-800 p-4 rounded-xl">
                            <label className="flex items-center space-x-3">
                                <FiMail className="w-5 h-5 text-emerald-400" />
                                <input
                                    type="email"
                                    name="email"
                                    value={user.email}
                                    onChange={handleInputChange}
                                    placeholder="Email"
                                    className="w-full bg-transparent focus:outline-none"
                                />
                            </label>
                        </div>

                        {/* Bio */}
                        <div className="bg-gray-800 p-4 rounded-xl">
                            <textarea
                                name="bio"
                                value={user.bio || ''} // Ensure bio is never undefined
                                onChange={handleInputChange}
                                placeholder="Tell us about yourself..."
                                className="w-full bg-transparent h-32 resize-none focus:outline-none"
                                maxLength="250"
                            />
                            <div className="text-right text-sm text-gray-400">
                                {(user.bio || '').length}/250 {/* Safely check length */}
                            </div>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="text-red-400 text-center">{error}</div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-semibold flex items-center justify-center space-x-2 transition-colors disabled:opacity-50"
                    >
                        <FiSave className="w-5 h-5" />
                        <span>{isSubmitting ? 'Saving...' : 'Save Changes'}</span>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditProfile;