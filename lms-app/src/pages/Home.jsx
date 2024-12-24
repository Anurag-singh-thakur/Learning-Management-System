import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AcademicCapIcon, 
  UserGroupIcon, 
  ClockIcon, 
  SparklesIcon,
  FireIcon,
  StarIcon
} from '@heroicons/react/24/solid';
import { Button } from "../components/shadcn/button";
import Navbar from '../components/Navbar';
import axios from '../lib/axios';

const CourseCard = ({ course }) => {
  return (
    <motion.div 
      whileHover={{ 
        scale: 1.05,
        transition: { type: "spring", stiffness: 300 }
      }}
      className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-3xl border border-slate-700/50 hover:border-cyan-500/50 transition-all duration-300 group relative overflow-hidden"
    >
      <div className="absolute top-4 right-4 bg-cyan-500/20 text-cyan-400 px-3 py-1 rounded-full text-xs font-semibold">
        {course.category}
      </div>
      <img 
        src={course.thumbnail} 
        alt={course.title} 
        className="w-full h-48 object-cover rounded-2xl mb-4 group-hover:scale-105 transition-transform duration-300"
      />
      <h3 className="text-lg font-semibold mb-2 text-white group-hover:text-cyan-400 transition-colors duration-300">
        {course.title}
      </h3>
      <div className="flex items-center justify-between text-sm text-slate-400">
        <div className="flex items-center space-x-2">
          <StarIcon className="w-5 h-5 text-yellow-500" />
          <span>{course.rating.toFixed(1)}</span>
        </div>
        <div className="flex items-center space-x-2">
          <FireIcon className="w-5 h-5 text-orange-500" />
          <span>{course.enrollments} Enrolled</span>
        </div>
      </div>
      <Link to={`/courses/${course._id}`} className="absolute inset-0 z-10"></Link>
    </motion.div>
  );
};

const Home = () => {
  const [trendingCourses, setTrendingCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.classList.add('dark');
    
    // Check local storage for token
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
    
    const fetchTrendingCourses = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('/courses/trending', {
          params: { limit: 4 }
        });
        setTrendingCourses(response.data);
      } catch (error) {
        console.error('Failed to fetch trending courses', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrendingCourses();
  }, []);

  const handleGetStarted = () => {
    // Check local storage token
    const token = localStorage.getItem('token');
    
    if (token) {
      navigate('/courses');
    } else {
      navigate('/signup');
    }
  };

  const features = [
    {
      title: "Interactive Learning",
      description: "Engage with dynamic content, live sessions, and real-time feedback",
      icon: <SparklesIcon className="w-12 h-12 text-cyan-400" />
    },
    {
      title: "Expert Instructors",
      description: "Learn from industry professionals and certified experts",
      icon: <AcademicCapIcon className="w-12 h-12 text-cyan-400" />
    },
    {
      title: "Flexible Schedule",
      description: "Learn at your own pace with lifetime access to courses",
      icon: <ClockIcon className="w-12 h-12 text-cyan-400" />
    },
    {
      title: "Community Support",
      description: "Join a thriving community of learners and mentors",
      icon: <UserGroupIcon className="w-12 h-12 text-cyan-400" />
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 10
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden">
      <Navbar />
      
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative py-32 px-4 overflow-hidden"
      >
        <div className="container mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.8,
              type: "spring",
              stiffness: 120
            }}
          >
            <h1 className="text-6xl md:text-8xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-teal-400 leading-tight">
              NexusLearn
            </h1>
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-2xl md:text-3xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed tracking-wide"
            >
              Elevate Your Skills, Transform Your Career with Professional Online Learning
            </motion.p>
          </motion.div>

          <motion.div 
            className="flex gap-6 justify-center"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <Link to="/courses">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-10 py-4 text-lg font-semibold rounded-full shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300 transform hover:-translate-y-1"
              >
                Explore Courses
              </Button>
            </Link>
            <Button 
              size="lg" 
              onClick={handleGetStarted}
              variant="outline" 
              className="border-2 border-cyan-500/70 text-cyan-400 hover:bg-cyan-500/10 px-10 py-4 text-lg font-semibold rounded-full shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all duration-300 transform hover:-translate-y-1"
            >
              {isAuthenticated ? 'My Courses' : 'Get Started'}
            </Button>
          </motion.div>
        </div>
        
        {/* Animated Background Gradients */}
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0]
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl opacity-50"
        />
        <motion.div 
          animate={{ 
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90]
          }}
          transition={{ 
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-gradient-to-r from-teal-500/10 to-blue-500/10 rounded-full blur-3xl opacity-50"
        />
      </motion.section>

      {/* Features Section */}
      <motion.section 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="py-24 bg-slate-900/50 backdrop-blur-xl"
      >
        <div className="container mx-auto px-4">
          <motion.h2 
            variants={itemVariants}
            className="text-4xl md:text-5xl font-bold text-center mb-16 text-white tracking-tight"
          >
            Why Choose <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">NexusLearn</span>?
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.05,
                  transition: { type: "spring", stiffness: 300 }
                }}
                className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-3xl border border-slate-700/50 hover:border-cyan-500/50 transition-all duration-300 group relative overflow-hidden"
              >
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-all duration-300"></div>
                <motion.div 
                  className="text-4xl mb-6 relative z-10 transform-gpu transition-transform duration-300 group-hover:scale-110"
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-xl font-semibold mb-4 text-white group-hover:text-cyan-400 transition-colors duration-300 relative z-10">
                  {feature.title}
                </h3>
                <p className="text-slate-400 group-hover:text-slate-300 transition-colors duration-300 relative z-10">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Trending Courses Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        className="py-24 bg-slate-900/50 backdrop-blur-xl relative"
      >
        <div className="container mx-auto px-4">
          <motion.h2 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-center mb-16 text-white tracking-tight"
          >
            Trending <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">Courses</span>
          </motion.h2>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 animate-pulse">
              {[...Array(4)].map((_, index) => (
                <div 
                  key={index} 
                  className="bg-slate-800/50 rounded-3xl h-96 animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <AnimatePresence>
                {trendingCourses.map((course, index) => (
                  <motion.div
                    key={course._id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      delay: index * 0.2, 
                      duration: 0.6,
                      type: "spring",
                      stiffness: 100
                    }}
                  >
                    <CourseCard course={course} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          <motion.div 
            className="flex justify-center mt-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <Link to="/courses">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-10 py-4 text-lg font-semibold rounded-full shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300 transform hover:-translate-y-1"
              >
                Explore All Courses
              </Button>
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        className="py-24 bg-gradient-to-b from-slate-900 to-slate-950 relative overflow-hidden"
      >
        <div className="container mx-auto px-4 relative z-10">
          <motion.h2 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-center mb-16 text-white tracking-tight"
          >
            Learning at <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">Scale</span>
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                number: "100+", 
                label: "Expert Instructors",
                icon: <AcademicCapIcon className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
              },
              { 
                number: "500+", 
                label: "Interactive Courses",
                icon: <SparklesIcon className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
              },
              { 
                number: "50,000+", 
                label: "Active Learners",
                icon: <UserGroupIcon className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
              }
            ].map((stat, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ 
                  delay: index * 0.2, 
                  duration: 0.6,
                  type: "spring",
                  stiffness: 100
                }}
                className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-3xl text-center border border-slate-700/50 hover:border-cyan-500/50 transition-all duration-300 group"
              >
                {stat.icon}
                <h3 className="text-5xl font-bold mb-4 text-white group-hover:text-cyan-400 transition-colors duration-300">
                  {stat.number}
                </h3>
                <p className="text-slate-400 group-hover:text-slate-300 transition-colors duration-300">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default Home;