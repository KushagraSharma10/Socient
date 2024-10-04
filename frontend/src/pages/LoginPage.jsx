// src/components/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';  // Added useNavigate for redirection
import axios from 'axios';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();  // Initializing useNavigate

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/api/users/login', {
                email,
                password,
            }, { withCredentials: true });
            console.log('Login successful:', response.data);

            // Storing user data (token) in localStorage or state
            const { token } = response.data;     // Assume the token is returned from your login response
            localStorage.setItem('token', token);
            // Redirecting to the HomePage
            navigate('/home');  // Navigates to the HomePage route after successful login

        } catch (err) {
            setError('Login failed. Please check your credentials.');
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="bg-white shadow-md rounded-lg p-8 max-w-sm w-full">
                <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
                {error && <p className="text-red-500">{error}</p>}
                <form onSubmit={handleLogin}>
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
                        Login
                    </button>
                </form>
                <p className="mt-4 text-sm text-center">
                    Don't have an account? <a href="/register" className="text-blue-500">Register</a>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
