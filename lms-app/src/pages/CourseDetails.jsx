import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
    AcademicCapIcon, 
    ClockIcon, 
    CurrencyDollarIcon, 
    UserIcon 
} from '@heroicons/react/24/solid';
import axiosInstance from '../lib/axios';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { jwtDecode } from "jwt-decode";

const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { 
        opacity: 1, 
        y: 0,
        transition: {
            duration: 0.6,
            ease: "easeInOut"
        }
    },
    out: { 
        opacity: 0, 
        y: -20,
        transition: {
            duration: 0.6,
            ease: "easeInOut"
        }
    }
};

const CourseDetails = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        const fetchCourseDetails = async () => {
            try {
                const response = await axiosInstance.get(`/courses/${courseId}`);
                setCourse(response.data.data);
            } catch (error) {
                console.error('Error fetching course details:', error);
                setError(error.response?.data?.message || 'Failed to fetch course details');
                toast.error(error.response?.data?.message || 'Failed to fetch course details');
            } finally {
                setIsLoading(false);
            }
        };

        fetchCourseDetails();
    }, [courseId]);

    useEffect(() => {
        const token = new URLSearchParams(window.location.search).get('token');
        if (token) {
            try {
                const decoded = jwt_decode(token);
                if (decoded.courseId !== courseId || decoded.userId !== user.id) {
                    throw new Error('Invalid token');
                }
            } catch (error) {
                console.error('Invalid token:', error);
                toast.error('Unauthorized access');
                navigate('/');
            }
        } else {
            toast.error('Unauthorized access');
            navigate('/');
        }
    }, [courseId, user.id, navigate]);

    const getThumbnailUrl = (thumbnailPath) => {
        if (!thumbnailPath) return null;
        
        const urls = [
            `http://localhost:3008${thumbnailPath}`,
            `http://localhost:3008/${thumbnailPath}`,
            `http://localhost:3008/${thumbnailPath.replace(/^\//, '')}`,
            thumbnailPath
        ];

        return urls[0];
    };

    if (isLoading) return (
        <motion.div 
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 pt-16"
        >
            <div className="animate-pulse text-2xl text-cyan-400">
                Loading Course Details...
            </div>
        </motion.div>
    );

    if (error) return (
        <motion.div 
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-red-500 pt-16"
        >
            {error}
        </motion.div>
    );

    if (!course) return (
        <motion.div 
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-red-500 pt-16"
        >
            Course not found
        </motion.div>
    );

    const thumbnailUrl = getThumbnailUrl(course.thumbnail);

    return (
        <motion.div 
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white py-12 px-4 pt-24"
        >
            <div className="max-w-6xl mx-auto">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ 
                        duration: 0.5, 
                        ease: "easeInOut" 
                    }}
                    className="grid md:grid-cols-2 gap-8 mb-12"
                >
                    {/* Thumbnail Section */}
                    <div className="relative">
                        {thumbnailUrl ? (
                            <motion.div 
                                whileHover={{ scale: 1.05 }}
                                transition={{ type: "spring", stiffness: 300 }}
                                className="rounded-2xl overflow-hidden shadow-2xl border-4 border-cyan-500/30"
                            >
                                <img 
                                    src={thumbnailUrl} 
                                    alt={course.name || 'Course Thumbnail'} 
                                    className="w-full h-72 object-cover" 
                                    onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/600x400?text=Course+Thumbnail';
                                    }}
                                />
                            </motion.div>
                        ) : (
                            <div className="w-full h-72 bg-slate-800 flex items-center justify-center text-gray-500">
                                No Thumbnail Available
                            </div>
                        )}
                    </div>

                    {/* Course Details */}
                    <div className="space-y-6">
                        <motion.h1 
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-teal-400"
                        >
                            {course.name}
                        </motion.h1>
                        
                        <motion.p 
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                            className="text-lg text-gray-300 leading-relaxed"
                        >
                            {course.description}
                        </motion.p>

                        {/* Course Quick Stats */}
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { 
                                    icon: <ClockIcon className="w-6 h-6 text-cyan-400" />, 
                                    label: 'Duration', 
                                    value: course.duration || 'Not specified' 
                                },
                                { 
                                    icon: <CurrencyDollarIcon className="w-6 h-6 text-green-400" />, 
                                    label: 'Price', 
                                    value: course.isPaid ? `₹${course.price}` : 'Free' 
                                }
                            ].map((stat, index) => (
                                <motion.div 
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                                    className="bg-slate-800/50 p-4 rounded-lg flex items-center space-x-3"
                                >
                                    {stat.icon}
                                    <div>
                                        <p className="text-sm text-gray-400">{stat.label}</p>
                                        <p className="font-semibold">{stat.value}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Instructor and Course Content */}
                <div className="grid md:grid-cols-3 gap-8">
                    {/* Instructor Card */}
                    <motion.div 
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                        className="bg-slate-800/50 p-6 rounded-2xl text-center"
                    >
                        {course.instructor && course.instructor.profilePicture && (
                            <motion.img 
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.6, type: "spring", stiffness: 300 }}
                                src={`http://localhost:3008${course.instructor.profilePicture}`} 
                                alt={course.instructor.name || 'Instructor'} 
                                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover" 
                            />
                        )}
                        <h3 className="text-xl font-semibold">{course.instructor.name}</h3>
                        <p className="text-gray-400">{course.instructor.bio}</p>
                    </motion.div>

                    {/* Course Content */}
                    <motion.div 
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                        className="md:col-span-2 bg-slate-800/50 p-6 rounded-2xl"
                    >
                        <h3 className="text-2xl font-semibold mb-4">Course Content</h3>
                        <ul className="space-y-4">
                            {course.content.map((item, index) => (
                                <li key={index} className="bg-slate-900 p-4 rounded-lg flex items-center space-x-4">
                                    <AcademicCapIcon className="w-6 h-6 text-cyan-400" />
                                    <div>
                                        <h4 className="text-lg font-semibold">{item.title}</h4>
                                        <p className="text-gray-400">{item.type}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

export default CourseDetails;