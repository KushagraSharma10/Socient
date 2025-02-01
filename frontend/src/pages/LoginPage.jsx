// // src/components/Login.jsx
// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';

// const LoginPage = () => {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [error, setError] = useState('');
//     const navigate = useNavigate();

//     const handleLogin = async (e) => {
//         e.preventDefault();
//         try {
//             const response = await axios.post('http://localhost:3000/api/users/login', {
//                 email,
//                 password,
//             }, { withCredentials: true });

//             console.log('Login successful:', response.data);

//             // Check if the response contains a token and userId
//             const { token, userId } = response.data;
//             if (token && userId) {
//                 // Store token and userId in localStorage
//                 localStorage.setItem('token', token);
//                 localStorage.setItem('userId', userId);
    
//                 // Redirect to the HomePage after successful login
//                 navigate('/home');
//             } else {
//                 console.error('Token or userId not received:', response.data);
//                 setError('Login failed. Please try again.');
//             }
    
//         } catch (err) {
//             console.error('Login error:', err);
//             setError('Login failed. Please check your credentials.');
//         }
//     };

//     return (
//         <div className="flex items-center justify-center h-screen bg-gray-100">
//             <div className="bg-white shadow-md rounded-lg p-8 max-w-sm w-full">
//                 <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
//                 {error && <p className="text-red-500">{error}</p>}
//                 <form onSubmit={handleLogin}>
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
//                         Login
//                     </button>
//                 </form>
//                 <p className="mt-4 text-sm text-center">
//                     Don't have an account? <a href="/register" className="text-blue-500">Register</a>
//                 </p>
//             </div>
//         </div>
//     );
// };

// export default LoginPage;


import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaGoogle, FaGithub, FaEnvelope, FaLock } from 'react-icons/fa';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Login | Socient";
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/api/users/login', {
                email,
                password,
            }, { withCredentials: true });

            const { token, userId } = response.data;
            if (token && userId) {
                localStorage.setItem('token', token);
                localStorage.setItem('userId', userId);
                navigate('/home');
            } else {
                setError('Login failed. Please try again.');
            }
    
        } catch (err) {
            setError('Login failed. Please check your credentials.');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative bg-gray-800 rounded-2xl p-8 w-full max-w-md shadow-2xl overflow-hidden"
            >
                {/* Decorative elements */}
                <div className="absolute -top-32 -left-32 w-64 h-64 bg-purple-600 rounded-full blur-3xl opacity-30"></div>
                <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-blue-600 rounded-full blur-3xl opacity-30"></div>
                
                <div className="relative z-10">
                    <div className="text-center mb-8">
                        <motion.h1 
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2"
                        >
                            Welcome Back
                        </motion.h1>
                        <p className="text-gray-400">Please sign in to continue</p>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mb-4 p-3 bg-red-900/30 text-red-400 rounded-lg text-sm"
                        >
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleLogin} className="py-3 space-y-6">
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                                    <FaEnvelope className="w-4 h-4" />
                                    Email
                                </label>
                                <input
                                    type="email"
                                    className="w-full mt-2 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100 placeholder-gray-400 transition-all"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                                    <FaLock className="w-4 h-4" />
                                    Password
                                </label>
                                <input
                                    type="password"
                                    className="w-full mt-3 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100 placeholder-gray-400 transition-all"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    required
                                />
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            className="w-full py-3.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white font-semibold  rounded-lg transition-all"
                        >
                            Sign In
                        </motion.button>
                    </form>

                        {/* <div className="mt-8">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-600"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-gray-800 text-gray-400">
                                        Or continue with
                                    </span>
                                </div>
                            </div>

                            <div className="mt-6 grid grid-cols-2 gap-3">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    className="flex items-center justify-center gap-2 p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all"
                                >
                                    <FaGoogle className="text-red-400 w-5 h-5" />
                                    <span className="text-gray-300 text-sm">Google</span>
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    className="flex items-center justify-center gap-2 p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all"
                                >
                                    <FaGithub className="text-purple-400 w-5 h-5" />
                                    <span className="text-gray-300 text-sm">GitHub</span>
                                </motion.button>
                            </div>
                        </div> */}

                    <p className="mt-10 text-center text-sm text-gray-400">
                        Don't have an account?{' '}
                        <a 
                            href="/register" 
                            className="text-blue-400 hover:text-blue-300 underline underline-offset-4 transition-colors"
                        >
                            Create account
                        </a>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginPage;