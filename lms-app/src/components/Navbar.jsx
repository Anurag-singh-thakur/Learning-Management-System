import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

const Navbar = () => {
    const { user, logout, deleteAccount } = useAuth();
    const navigate = useNavigate();
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const handleDeleteAccount = async () => {
        const confirmDelete = window.confirm('Are you sure you want to delete your account? This action cannot be undone.');
        
        if (confirmDelete) {
            try {
                await deleteAccount();
                toast.success('Account deleted successfully');
                navigate('/');
            } catch (error) {
                toast.error('Failed to delete account');
                console.error('Delete account error:', error);
            }
        }
    };

    const renderProfileImage = () => {
        const imageSrc = user?.profilePicture 
            ? `http://localhost:3008${user.profilePicture}` 
            : null;

        return (
            <div className="relative" onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}>
                <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full blur opacity-20 group-hover:opacity-40 transition duration-200"></div>
                {imageSrc ? (
                    <img 
                        src={imageSrc} 
                        alt="Profile" 
                        className="relative w-10 h-10 rounded-full object-cover border border-slate-700/50 cursor-pointer hover:border-cyan-500/50 transition-colors duration-300"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=0891b2&color=fff`;
                        }}
                    />
                ) : (
                    <div className="relative w-10 h-10 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-full flex items-center justify-center text-lg text-white border border-slate-700/50 cursor-pointer hover:border-cyan-500/50 transition-colors duration-300">
                        {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                )}
                
                {isProfileMenuOpen && (
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-56 origin-top-right bg-slate-900/80 backdrop-blur-xl rounded-xl shadow-2xl border border-slate-700/50 z-50 overflow-hidden"
                    >
                        <div className="py-1 bg-gradient-to-br from-slate-900/90 to-slate-800/90">
                            <Link 
                                to="/profile" 
                                className="block px-4 py-2 text-sm text-slate-200 hover:bg-cyan-500/10 hover:text-cyan-400 transition-colors"
                                onClick={() => setIsProfileMenuOpen(false)}
                            >
                                Profile
                            </Link>
                            <Link 
                                to="/dashboard" 
                                className="block px-4 py-2 text-sm text-slate-200 hover:bg-cyan-500/10 hover:text-cyan-400 transition-colors"
                                onClick={() => setIsProfileMenuOpen(false)}
                            >
                                Dashboard
                            </Link>
                            {user?.role === 'instructor' && (
                                <>
                                    <Link 
                                        to="/instructor/courses" 
                                        className="block px-4 py-2 text-sm text-slate-200 hover:bg-cyan-500/10 hover:text-cyan-400 transition-colors"
                                        onClick={() => setIsProfileMenuOpen(false)}
                                    >
                                        My Courses
                                    </Link>
                                    <Link 
                                        to="/instructor/create-course" 
                                        className="block px-4 py-2 text-sm text-slate-200 hover:bg-cyan-500/10 hover:text-cyan-400 transition-colors"
                                        onClick={() => setIsProfileMenuOpen(false)}
                                    >
                                        Create Course
                                    </Link>
                                </>
                            )}
                            <button 
                                onClick={() => {
                                    handleLogout();
                                    setIsProfileMenuOpen(false);
                                }}
                                className="block w-full text-left px-4 py-2 text-sm text-slate-200 hover:bg-cyan-500/10 hover:text-cyan-400 transition-colors"
                            >
                                Sign Out
                            </button>
                            <button 
                                onClick={() => {
                                    handleDeleteAccount();
                                    setIsProfileMenuOpen(false);
                                }}
                                className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                            >
                                Delete Account
                            </button>
                        </div>
                    </motion.div>
                )}
            </div>
        );
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-slate-700/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center">
                            <motion.span 
                                className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500"
                                whileHover={{ scale: 1.05 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                NexusLearn
                            </motion.span>
                        </Link>
                    </div>
                    <div className="hidden md:flex items-center space-x-8">
                        <Link 
                            to="/courses" 
                            className="text-slate-300 hover:text-cyan-400 transition-colors duration-300"
                        >
                            Courses
                        </Link>
                        <Link 
                            to="/pricing" 
                            className="text-slate-300 hover:text-cyan-400 transition-colors duration-300"
                        >
                            Pricing
                        </Link>
                        <Link 
                            to="/about" 
                            className="text-slate-300 hover:text-cyan-400 transition-colors duration-300"
                        >
                            About
                        </Link>
                        <Link 
                            to="/contact" 
                            className="text-slate-300 hover:text-cyan-400 transition-colors duration-300"
                        >
                            Contact
                        </Link>
                    </div>
                    <div className="flex items-center space-x-4">
                        {user ? (
                            renderProfileImage()
                        ) : (
                            <>
                                <Link 
                                    to="/login"
                                    className="text-slate-300 hover:text-cyan-400 transition-colors duration-300"
                                >
                                    Sign In
                                </Link>
                                <Link 
                                    to="/signup"
                                    className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-300 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40"
                                >
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
