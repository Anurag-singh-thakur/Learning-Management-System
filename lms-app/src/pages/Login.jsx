// src/pages/Login.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "../components/shadcn/button";
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [rememberMe, setRememberMe] = useState(false);

    // Check for saved credentials on component mount
    useEffect(() => {
        const savedCredentials = localStorage.getItem('rememberedCredentials');
        if (savedCredentials) {
            const { email, password } = JSON.parse(savedCredentials);
            setFormData({ email, password });
            setRememberMe(true);
        }
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleRememberMeChange = (e) => {
        setRememberMe(e.target.checked);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        if (!formData.email || !formData.password) {
            toast.error('Please enter both email and password');
            setIsLoading(false);
            return;
        }

        try {
            await login(formData.email, formData.password, rememberMe);
            
            // Save credentials if remember me is checked
            if (rememberMe) {
                const credentials = {
                    email: formData.email,
                    password: formData.password,
                    timestamp: new Date().getTime()
                };
                localStorage.setItem('rememberedCredentials', JSON.stringify(credentials));
            } else {
                localStorage.removeItem('rememberedCredentials');
            }
            
            toast.success('Logged in successfully!');
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Invalid email or password';
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white pt-16">
            <Navbar />
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-md mx-auto">
                    <div className="dark-card p-8 rounded-lg border">
                        <h1 className="text-2xl font-bold text-center mb-8">Welcome Back</h1>
                        
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium mb-2">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full bg-zinc-900 text-white border border-zinc-800 rounded-lg px-4 py-2 focus:outline-none focus:border-violet-600"
                                    required
                                    disabled={isLoading}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full bg-zinc-900 text-white border border-zinc-800 rounded-lg px-4 py-2 focus:outline-none focus:border-violet-600"
                                    required
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="remember"
                                        checked={rememberMe}
                                        onChange={handleRememberMeChange}
                                        className="h-4 w-4 rounded border-zinc-800 bg-zinc-900 text-violet-600 focus:ring-violet-600"
                                    />
                                    <label htmlFor="remember" className="ml-2 block text-sm text-zinc-400">
                                        Remember me
                                    </label>
                                </div>

                                <div className="text-sm">
                                    <Link to="/forgot-password" className="text-violet-400 hover:text-violet-300">
                                        Forgot password?
                                    </Link>
                                </div>
                            </div>

                            <Button 
                                type="submit" 
                                className="w-full bg-violet-600 hover:bg-violet-700 text-white"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Signing in...' : 'Sign In'}
                            </Button>
                        </form>

                        <p className="text-center mt-6 text-zinc-400">
                            Don't have an account?{' '}
                            <Link to="/signup" className="text-violet-400 hover:text-violet-300">
                                Sign Up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;