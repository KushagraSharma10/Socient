// src/components/Register.jsx
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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

            const response = await axios.post('http://localhost:3000/api/users/register', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // If registration is successful, store token and userId
            if (response.status === 201) {
                const { token, userId } = response.data;

                // Store token and userId in localStorage
                localStorage.setItem('token', token);
                localStorage.setItem('userId', userId);

                setSuccess('Registration successful!');
                setError('');
                
                // Redirect to homepage after registration
                navigate('/home');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
            setSuccess('');
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="bg-white shadow-md rounded-lg p-8 max-w-sm w-full">
                <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
                {error && <p className="text-red-500">{error}</p>}
                {success && <p className="text-green-500">{success}</p>}
                <form onSubmit={handleRegister}>
                    <div className="flex flex-col items-center mb-6">
                        <div
                            className="w-24 h-24 rounded-full bg-gray-200 cursor-pointer mb-4 relative"
                            onClick={() => document.getElementById('profilePicInput').click()}
                            style={{
                                backgroundImage: `url(${previewPic || 'https://via.placeholder.com/150'})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                            }}
                        >
                            {!previewPic && <div className="absolute inset-0 flex items-center justify-center text-gray-500"></div>}
                        </div>

                        <input
                            type="file"
                            id="profilePicInput"
                            accept="image/*"
                            className="hidden"
                            onChange={handleProfilePicChange}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1" htmlFor="fullName">Full Name</label>
                        <input
                            type="text"
                            id="fullName"
                            className="border border-gray-300 rounded-lg w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1" htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            className="border border-gray-300 rounded-lg w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1" htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            className="border border-gray-300 rounded-lg w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1" htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            className="border border-gray-300 rounded-lg w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
                    >
                        Register
                    </button>
                </form>
                <p className="mt-4 text-sm text-center">
                    Already have an account? <a href="/" className="text-blue-500">Login</a>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;
