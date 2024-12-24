import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    AcademicCapIcon, 
    ClockIcon, 
    CurrencyDollarIcon, 
    UserIcon 
} from '@heroicons/react/24/solid';
import axiosInstance from '../lib/axios';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

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
                                    value: course.isPaid ? `$${course.price}` : 'Free' 
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
                                alt={course.instructor.name} 
                                className="w-32 h-32 mx-auto rounded-full object-cover border-4 border-cyan-500 mb-4" 
                            />
                        )}
                        <h3 className="text-2xl font-semibold text-cyan-400 mb-2">
                            {course.instructor ? course.instructor.name : 'Unknown Instructor'}
                        </h3>
                        <p className="text-gray-400 mb-4">
                            {course.instructor ? course.instructor.email : ''}
                        </p>
                        <div className="flex items-center justify-center space-x-2">
                            <UserIcon className="w-5 h-5 text-gray-300" />
                            <span className="text-sm text-gray-300">Course Instructor</span>
                        </div>
                    </motion.div>

                    {/* Course Content */}
                    <motion.div 
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                        className="md:col-span-2 bg-slate-800/50 p-6 rounded-2xl"
                    >
                        <h2 className="text-3xl font-semibold mb-6 text-cyan-400 flex items-center">
                            <AcademicCapIcon className="w-8 h-8 mr-3 text-cyan-400" />
                            Course Content
                        </h2>
                        {course.content && course.content.length > 0 ? (
                            <motion.div 
                                initial="hidden"
                                animate="visible"
                                variants={{
                                    hidden: { opacity: 0 },
                                    visible: { 
                                        opacity: 1,
                                        transition: {
                                            delayChildren: 0.3,
                                            staggerChildren: 0.1
                                        }
                                    }
                                }}
                                className="grid md:grid-cols-2 gap-4"
                            >
                                {course.content.map((item, index) => (
                                    <motion.div 
                                        key={index} 
                                        variants={{
                                            hidden: { opacity: 0, y: 20 },
                                            visible: { 
                                                opacity: 1, 
                                                y: 0,
                                                transition: { duration: 0.5 }
                                            }
                                        }}
                                        className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50 hover:border-cyan-500 transition-all group"
                                    >
                                        <div className="flex items-start space-x-3">
                                            <p className="text-gray-300 group-hover:text-white transition-colors">
                                                • {item}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        ) : (
                            <p className="text-gray-500 text-center">No content available</p>
                        )}
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

export default CourseDetails;
