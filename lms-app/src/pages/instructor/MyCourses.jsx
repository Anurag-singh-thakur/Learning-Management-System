import React, { useCallback, useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import axiosInstance from '../../lib/axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CourseCard = React.memo(({ course, onDelete, onEdit }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [instructorImage, setInstructorImage] = useState(null);

  useEffect(() => {
    // Set initial image source
    setInstructorImage(course.instructor?.profilePicture || null);
  }, [course.instructor]);

  const handleImageError = useCallback(() => {
    setInstructorImage(null);
  }, []);

  const renderInstructorAvatar = () => {
    // If image exists and is valid, render the image
    if (instructorImage) {
      return (
        <img 
          src={`http://localhost:3008${instructorImage}`} 
          alt={`${course.instructor?.name || 'Unknown'} profile`}
          className="w-8 h-8 rounded-full object-cover border-2 border-zinc-700"
          onError={handleImageError}
        />
      );
    }

    // Fallback to first letter or default
    return (
      <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center">
        <span className="text-xs text-zinc-400">
          {course.instructor?.name ? 
            course.instructor.name.charAt(0).toUpperCase() : 
            'U'
          }
        </span>
      </div>
    );
  };

  const handleDelete = useCallback(() => {
    const confirmDelete = window.confirm(`Are you sure you want to delete the course "${course.name}"?`);
    if (confirmDelete) {
      onDelete(course._id);
    }
  }, [course, onDelete]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.03 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="bg-zinc-900/50 rounded-xl border border-zinc-800 overflow-hidden shadow-lg relative group"
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-white mb-2">{course.name}</h3>
            <div className="flex items-center space-x-2 text-sm text-zinc-400">
              <span 
                className={`px-2 py-1 rounded-full ${
                  course.level.toLowerCase() === 'beginner' 
                    ? 'bg-green-500/10 text-green-400' 
                    : course.level.toLowerCase() === 'intermediate' 
                    ? 'bg-yellow-500/10 text-yellow-400' 
                    : 'bg-red-500/10 text-red-400'
                }`}
              >
                {course.level}
              </span>
              <span>{course.approxDuration}h</span>
            </div>
          </div>
          {course.thumbnail && (
            <img 
              src={`http://localhost:3008${course.thumbnail}`} 
              alt={course.name} 
              className="w-16 h-16 rounded-lg object-cover border border-zinc-700"
            />
          )}
        </div>

        <p className="text-zinc-400 mb-4 line-clamp-2">{course.description}</p>

        {/* Instructor Details */}
        <div className="flex items-center gap-2 mb-4">
          {renderInstructorAvatar()}
          <span className="text-sm text-zinc-400">
            {course.instructor?.name || 'Unknown Instructor'}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className={`px-3 py-1 rounded-full text-sm ${
            course.isPaid 
              ? 'bg-green-500/10 text-green-400' 
              : 'bg-blue-500/10 text-blue-400'
          }`}>
            {course.isPaid ? `$${course.price}` : 'Free'}
          </span>
          
          <div className="flex space-x-2">
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onEdit(course)}
              className="text-blue-400 hover:text-blue-300 p-2 rounded-full transition-colors"
            >
              <FaEdit />
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleDelete}
              className="text-red-400 hover:text-red-300 p-2 rounded-full transition-colors"
            >
              <FaTrash />
            </motion.button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isHovered && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-indigo-500/20 pointer-events-none"
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
});

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const { user } = useAuth();

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      console.log('Auth Token:', localStorage.getItem('token'));
      console.log('Current User:', user);
      const response = await axiosInstance.get('/courses/instructor/courses');
      console.log('API Response:', response.data);
      setCourses(response.data.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setError('Failed to fetch your courses. Please try again later.');
      toast.error(error.response?.data?.message || 'Failed to load courses', {
        position: "top-right",
        autoClose: 3008,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const handleDeleteCourse = useCallback(async (courseId) => {
    try {
      await axiosInstance.delete(`/courses/${courseId}`);
      setCourses(prevCourses => prevCourses.filter(course => course._id !== courseId));
      toast.success('Course deleted successfully', {
        position: "top-right",
        autoClose: 3008,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      console.error('Error deleting course:', error);
      toast.error(error.response?.data?.message || 'Failed to delete course', {
        position: "top-right",
        autoClose: 3008,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  }, []);

  const handleEditCourse = useCallback((course) => {
    // Navigate to edit course page or open modal
    // You can implement this based on your routing strategy
    console.log('Edit course:', course);
  }, []);

  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSort = !sortOrder || course.level?.toLowerCase() === sortOrder.toLowerCase();
      return matchesSearch && matchesSort;
    });
  }, [courses, searchTerm, sortOrder]);

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
          <p>Please log in to view your courses.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-center items-center min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950"
      >
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-cyan-500"></div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Error</h2>
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pt-16 py-8">
      <ToastContainer />
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-teal-400">
          My Courses
        </h1>
        <Link 
          to="/instructor/create-course" 
          className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-4 py-2 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl shadow-cyan-500/20 hover:shadow-cyan-500/40"
        >
          <FaPlus /> Create Course
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <input
          type="text"
          placeholder="Search courses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white focus:border-cyan-500 transition-colors"
        />
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="w-full p-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white focus:border-cyan-500 transition-colors"
        >
          <option value="">All Levels</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
      </div>

      {filteredCourses.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12 bg-slate-800/50 rounded-lg border border-slate-700/50"
        >
          <h3 className="text-xl font-semibold mb-2 text-white">No Courses Found</h3>
          <p className="text-slate-400">Start creating your first course or adjust your search criteria.</p>
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {filteredCourses.map(course => (
              <CourseCard 
                key={course._id} 
                course={course} 
                onDelete={handleDeleteCourse}
                onEdit={handleEditCourse}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};

export default MyCourses;
