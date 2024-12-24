import React from 'react';
import { motion } from 'framer-motion';
import { FaGraduationCap, FaUsers, FaLaptopCode, FaAward } from 'react-icons/fa';

const AboutPage = () => {
    const stats = [
        {
            icon: FaUsers,
            number: '10K+',
            label: 'Active Learners',
            gradient: 'from-cyan-400 to-blue-500'
        },
        {
            icon: FaGraduationCap,
            number: '500+',
            label: 'Expert Instructors',
            gradient: 'from-blue-500 to-cyan-400'
        },
        {
            icon: FaLaptopCode,
            number: '1000+',
            label: 'Courses Available',
            gradient: 'from-cyan-500 to-blue-400'
        },
        {
            icon: FaAward,
            number: '95%',
            label: 'Success Rate',
            gradient: 'from-blue-400 to-cyan-500'
        }
    ];

    const features = [
        {
            title: 'Expert-Led Instruction',
            description: 'Learn from industry professionals with years of real-world experience.',
            gradient: 'from-cyan-400 to-blue-500'
        },
        {
            title: 'Interactive Learning',
            description: 'Engage with hands-on projects and real-time collaboration tools.',
            gradient: 'from-blue-500 to-cyan-400'
        },
        {
            title: 'Flexible Schedule',
            description: 'Learn at your own pace with lifetime access to course materials.',
            gradient: 'from-cyan-500 to-blue-400'
        },
        {
            title: 'Career Support',
            description: 'Get guidance and resources to help advance your career goals.',
            gradient: 'from-blue-400 to-cyan-500'
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { 
            opacity: 0,
            y: 20
        },
        visible: { 
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 15
            }
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen bg-slate-900 pt-24 pb-12 px-4 sm:px-6 lg:px-8"
        >
            <div className="max-w-7xl mx-auto">
                {/* Hero Section */}
                <motion.div 
                    className="text-center mb-16"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 100 }}
                >
                    <motion.h1 
                        className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 mb-4"
                        whileHover={{ scale: 1.02 }}
                    >
                        Transforming Education Through Technology
                    </motion.h1>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                        We're on a mission to make quality education accessible to everyone. 
                        Our platform combines cutting-edge technology with expert instruction 
                        to deliver an unmatched learning experience.
                    </p>
                </motion.div>

                {/* Stats Section */}
                <motion.div 
                    className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            className="text-center"
                        >
                            <motion.div
                                className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-r ${stat.gradient} p-3 mb-4`}
                                whileHover={{ scale: 1.1, rotate: 5 }}
                            >
                                <stat.icon className="w-full h-full text-white" />
                            </motion.div>
                            <motion.h3 
                                className="text-2xl font-bold text-white mb-2"
                                whileHover={{ scale: 1.05 }}
                            >
                                {stat.number}
                            </motion.h3>
                            <p className="text-slate-400">{stat.label}</p>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Features Grid */}
                <motion.div 
                    className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50"
                            whileHover={{ 
                                scale: 1.02,
                                transition: { type: "spring", stiffness: 400 }
                            }}
                        >
                            <h3 className={`text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${feature.gradient} mb-3`}>
                                {feature.title}
                            </h3>
                            <p className="text-slate-400">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Mission Statement */}
                <motion.div 
                    className="text-center max-w-3xl mx-auto"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
                    <p className="text-slate-400 mb-6">
                        At NexusLearn, we believe that education should be accessible, 
                        engaging, and effective. Our platform is built on the principles 
                        of innovation, excellence, and student success. We're committed 
                        to helping learners achieve their goals through high-quality 
                        courses, expert instruction, and cutting-edge technology.
                    </p>
                    <motion.button
                        className="bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-medium px-6 py-3 rounded-xl
                            shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all duration-300"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        Join Our Community
                    </motion.button>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default AboutPage;
