import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User } from 'lucide-react';
import axios from 'axios';


const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await axios.post('https://vennila-accessoriesbckend.onrender.com/api/auth/login', { email, password });
            
            if (response.data.success && response.data.user.role === 'admin') {
                sessionStorage.setItem('isAuthenticated', 'true');
                sessionStorage.setItem('token', response.data.token);
                navigate('/');
            } else {
                setError('You do not have administrative privileges. Access denied.');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid credentials. Access denied.');
        }
    };

    return (
        <div className="min-h-screen bg-[#f3f4f6] flex items-center justify-center p-4">
            <div className="bg-white p-8 shadow-xl w-full max-w-md border-t-4 border-[rgb(0, 184, 148)]">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-black text-gray-800 uppercase tracking-tighter">Admin Panel</h1>
                    <p className="text-gray-500 text-sm font-bold uppercase tracking-widest mt-1">Secure Access</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 text-sm font-bold mb-6 border border-red-200 text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-xs font-black text-gray-400 uppercase mb-2">Email Address</label>
                        <div className="relative">
                            <div className="absolute left-3 top-3.5 text-gray-400">
                                <User size={18} />
                            </div>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 focus:border-[rgb(0, 184, 148)] outline-none font-bold text-gray-700 transition-colors"
                                placeholder="admin@example.com"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-black text-gray-400 uppercase mb-2">Password</label>
                        <div className="relative">
                            <div className="absolute left-3 top-3.5 text-gray-400">
                                <Lock size={18} />
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 focus:border-[rgb(0, 184, 148)] outline-none font-bold text-gray-700 transition-colors"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-[rgb(0, 184, 148)] text-white py-3 font-black uppercase tracking-wider hover:bg-black transition-colors shadow-lg"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
