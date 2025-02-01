// // src/components/Register.jsx
// import { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const RegisterPage = () => {
//     const [profilePic, setProfilePic] = useState(null);
//     const [previewPic, setPreviewPic] = useState('');
//     const [fullName, setFullName] = useState('');
//     const [username, setUsername] = useState('');
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [error, setError] = useState('');
//     const [success, setSuccess] = useState('');

//     const navigate = useNavigate();

//     const handleProfilePicChange = (e) => {
//         const file = e.target.files[0];
//         setProfilePic(file);
//         setPreviewPic(URL.createObjectURL(file));
//     };

//     const handleRegister = async (e) => {
//         e.preventDefault();
//         try {
//             const formData = new FormData();
//             formData.append('profilePicture', profilePic);
//             formData.append('name', fullName);
//             formData.append('username', username);
//             formData.append('email', email);
//             formData.append('password', password);

//             const response = await axios.post('http://localhost:3000/api/users/register', formData, {
//                 headers: {
//                     'Content-Type': 'multipart/form-data',
//                 },
//             });

//             // If registration is successful, store token and userId
//             if (response.status === 201) {
//                 const { token, userId } = response.data;

//                 // Store token and userId in localStorage
//                 localStorage.setItem('token', token);
//                 localStorage.setItem('userId', userId);

//                 setSuccess('Registration successful!');
//                 setError('');
                
//                 // Redirect to homepage after registration
//                 navigate('/home');
//             }
//         } catch (err) {
//             setError(err.response?.data?.message || 'Registration failed. Please try again.');
//             setSuccess('');
//         }
//     };

//     return (
//         <div className="flex items-center justify-center h-screen bg-gray-100">
//             <div className="bg-white shadow-md rounded-lg p-8 max-w-sm w-full">
//                 <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
//                 {error && <p className="text-red-500">{error}</p>}
//                 {success && <p className="text-green-500">{success}</p>}
//                 <form onSubmit={handleRegister}>
//                     <div className="flex flex-col items-center mb-6">
//                         <div
//                             className="w-24 h-24 rounded-full bg-gray-200 cursor-pointer mb-4 relative"
//                             onClick={() => document.getElementById('profilePicInput').click()}
//                             style={{
//                                 backgroundImage: `url(${previewPic || 'https://via.placeholder.com/150'})`,
//                                 backgroundSize: 'cover',
//                                 backgroundPosition: 'center',
//                             }}
//                         >
//                             {!previewPic && <div className="absolute inset-0 flex items-center justify-center text-gray-500"></div>}
//                         </div>

//                         <input
//                             type="file"
//                             id="profilePicInput"
//                             accept="image/*"
//                             className="hidden"
//                             onChange={handleProfilePicChange}
//                         />
//                     </div>

//                     <div className="mb-4">
//                         <label className="block text-sm font-medium mb-1" htmlFor="fullName">Full Name</label>
//                         <input
//                             type="text"
//                             id="fullName"
//                             className="border border-gray-300 rounded-lg w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                             value={fullName}
//                             onChange={(e) => setFullName(e.target.value)}
//                             required
//                         />
//                     </div>
//                     <div className="mb-4">
//                         <label className="block text-sm font-medium mb-1" htmlFor="username">Username</label>
//                         <input
//                             type="text"
//                             id="username"
//                             className="border border-gray-300 rounded-lg w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                             value={username}
//                             onChange={(e) => setUsername(e.target.value)}
//                             required
//                         />
//                     </div>
//                     <div className="mb-4">
//                         <label className="block text-sm font-medium mb-1" htmlFor="email">Email</label>
//                         <input
//                             type="email"
//                             id="email"
//                             className="border border-gray-300 rounded-lg w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                             value={email}
//                             onChange={(e) => setEmail(e.target.value)}
//                             required
//                         />
//                     </div>
//                     <div className="mb-4">
//                         <label className="block text-sm font-medium mb-1" htmlFor="password">Password</label>
//                         <input
//                             type="password"
//                             id="password"
//                             className="border border-gray-300 rounded-lg w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                             value={password}
//                             onChange={(e) => setPassword(e.target.value)}
//                             required
//                         />
//                     </div>
//                     <button
//                         type="submit"
//                         className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
//                     >
//                         Register
//                     </button>
//                 </form>
//                 <p className="mt-4 text-sm text-center">
//                     Already have an account? <a href="/" className="text-blue-500">Login</a>
//                 </p>
//             </div>
//         </div>
//     );
// };

// export default RegisterPage;


// src/components/RegisterPage.jsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import {
  FaUser,
  FaUserAlt,
  FaEnvelope,
  FaLock,
  FaCamera,
} from 'react-icons/fa';

const RegisterPage = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [previewPic, setPreviewPic] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Register | Socient';
  }, []);

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    setProfilePic(file);
    setPreviewPic(URL.createObjectURL(file));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('profilePicture', profilePic);
      formData.append('name', fullName);
      formData.append('username', username);
      formData.append('email', email);
      formData.append('password', password);

      const response = await axios.post(
        'http://localhost:3000/api/users/register',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.status === 201) {
        const { token, userId } = response.data;

        localStorage.setItem('token', token);
        localStorage.setItem('userId', userId);

        setSuccess('Registration successful!');
        setError('');
        navigate('/home');
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 'Registration failed. Please try again.'
      );
      setSuccess('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center ">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative bg-gray-800 rounded-2xl p-8 w-full max-w-md shadow-2xl overflow-hidden"
      >
        {/* Decorative elements */}
        <div className="absolute -top-32 -left-32 w-64 h-64 bg-purple-600 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-blue-600 rounded-full blur-3xl opacity-30"></div>

        <div className="relative h-[90vh] z-10">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.h1
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2"
            >
              Create Your Account
            </motion.h1>
            <p className="text-gray-400">We are excited to have you join us!</p>
          </div>

          {/* Error & Success Messages */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-4 p-3 bg-red-900/30 text-red-400 rounded-lg text-sm"
            >
              {error}
            </motion.div>
          )}
          {success && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-4 p-3 bg-green-900/30 text-green-400 rounded-lg text-sm"
            >
              {success}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleRegister} className="space-y-6">
            {/* Profile Picture */}
            <div className="flex flex-col items-center">
              <label htmlFor="profilePicInput" className="cursor-pointer">
                <div
                  className="relative w-24 h-24 rounded-full bg-gray-700 overflow-hidden 
                             flex items-center justify-center ring-1 ring-gray-500 
                             hover:ring-2 hover:ring-blue-500 transition-all"
                  style={{
                    backgroundImage: previewPic
                      ? `url(${previewPic})`
                      : 'url(https://via.placeholder.com/150)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  {!previewPic && (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      <FaCamera className="w-6 h-6" />
                    </div>
                  )}
                </div>
              </label>
              <input
                type="file"
                id="profilePicInput"
                accept="image/*"
                className="hidden"
                onChange={handleProfilePicChange}
              />
            </div>

            {/* Full Name */}
            <div>
              <label
                className="text-sm font-medium text-gray-300 flex items-center gap-2"
                htmlFor="fullName"
              >
                <FaUser className="w-4 h-4" />
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                className="w-full mt-2 px-4 py-3 bg-gray-700 
                           border border-gray-600 rounded-lg focus:outline-none 
                           focus:ring-2 focus:ring-blue-500 
                           text-gray-100 placeholder-gray-400 transition-all"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                required
              />
            </div>

            {/* Username */}
            <div>
              <label
                className="text-sm font-medium text-gray-300 flex items-center gap-2"
                htmlFor="username"
              >
                <FaUserAlt className="w-4 h-4" />
                Username
              </label>
              <input
                type="text"
                id="username"
                className="w-full mt-2 px-4 py-3 bg-gray-700 
                           border border-gray-600 rounded-lg focus:outline-none 
                           focus:ring-2 focus:ring-blue-500 
                           text-gray-100 placeholder-gray-400 transition-all"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="johnny123"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label
                className="text-sm font-medium text-gray-300 flex items-center gap-2"
                htmlFor="email"
              >
                <FaEnvelope className="w-4 h-4" />
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full mt-2 px-4 py-3 bg-gray-700 
                           border border-gray-600 rounded-lg focus:outline-none 
                           focus:ring-2 focus:ring-blue-500 
                           text-gray-100 placeholder-gray-400 transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label
                className="text-sm font-medium text-gray-300 flex items-center gap-2"
                htmlFor="password"
              >
                <FaLock className="w-4 h-4" />
                Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full mt-2 px-4 py-3 bg-gray-700 
                           border border-gray-600 rounded-lg focus:outline-none 
                           focus:ring-2 focus:ring-blue-500 
                           text-gray-100 placeholder-gray-400 transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-blue-500 to-blue-600 
                         hover:from-blue-400 hover:to-blue-500 
                         text-white font-semibold rounded-lg transition-all"
            >
              Register
            </motion.button>
          </form>

          {/* Redirect to Login */}
          <p className="mt-10 text-center text-sm text-gray-400">
            Already have an account?{' '}
            <a
              href="/"
              className="text-blue-400 hover:text-blue-300 underline underline-offset-4 transition-colors"
            >
              Sign In
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
