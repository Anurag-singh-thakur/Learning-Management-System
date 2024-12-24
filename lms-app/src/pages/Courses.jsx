import { AnimatePresence, motion } from 'framer-motion';
import React, { memo, useEffect, useState, } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axiosInstance from '../lib/axios';
// import { useAuth } from '../context/AuthContext';
// import { useNavigate } from 'react-router-dom'; 
import { FaFire } from 'react-icons/fa';
import { loadStripe } from '@stripe/stripe-js';
import {
    FaBook,
    FaChevronDown,
    FaClock,
    FaSearch
} from 'react-icons/fa';
const CourseCard = memo(({ course, index }) => {
    const navigate = useNavigate();
    // const { user } = useAuth();
    const [showEnrollmentModal, setShowEnrollmentModal] = useState(false);
    console.log('Course Card ID:', course._id);
    const cardVariants = {
        hidden: {
            opacity: 0,
            y: 50,
            scale: 0.95
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 120,
                damping: 12,
                delay: index * 0.1
            }
        },
        hover: {
            y: -10,
            scale: 1.03,
            boxShadow: "0 20px 25px -5px rgba(0,0,0,0.2), 0 10px 10px -5px rgba(0,0,0,0.1)",
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 20
            }
        }
    };

    const imageVariants = {
        initial: {
            scale: 1,
            filter: "brightness(0.4)"
        },
        hover: {
            scale: 1.1,
            filter: "brightness(1.2)",
            transition: {
                duration: 0.5,
                ease: "easeInOut"
            }
        }
    };

    return (
        <>
            <motion.div
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                className="bg-slate-800/60 backdrop-blur-xl rounded-3xl overflow-hidden border border-slate-700/50 shadow-lg hover:shadow-2xl transition-shadow duration-300 group relative"
            >
                {/* Thumbnail */}
                <motion.div 
                    className="relative h-52 w-full overflow-hidden"
                    variants={imageVariants}
                >
                    <motion.img
                        src={course.thumbnail ? `http://localhost:3008${course.thumbnail}` : '/default-course-image.jpg'}
                        alt={course.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent" />
                </motion.div>

                {/* Content Section */}
                <div className="p-6 space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors duration-300 line-clamp-2">
                            {course.name}
                        </h3>
                        <div className="bg-cyan-500/20 text-cyan-400 px-3 py-1 rounded-full text-xs font-semibold">
                            {course.category}
                        </div>
                      
                    </div>

                   <div className="fle">
                   <p className="text-slate-400 text-sm line-clamp-3 mb-4">  {course.description}</p>
                   <p>{course.level}</p>
                   </div>
                   
                    {/* Pricing and Duration */}
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2">
                            <FaClock className="text-cyan-500" />
                            <span className="text-slate-400">{course.duration} Hours</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="text-white font-semibold">
                                {course.isPaid ? (
                                    <span className="text-green-400">
                                        ${course.price.toFixed(2)}
                                    </span>
                                ) : (
                                    <span className="text-cyan-400">Free</span>
                                )}
                            </span>
                        </div>
                    </div>
                    <div className="flex space-x-3 p-6">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate(`/courses/${course._id}`)}
                            className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white py-3 rounded-full font-semibold transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-blue-500/50"
                        >
                            View course Details
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={()=>handleEnroll(course)} 
                            className="flex-1 py-3 rounded-full font-semibold transition-all duration-300 transform hover:-translate-y-1 shadow-lg bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                        >
                            Enroll Now
                        </motion.button>
                    </div>
                </div>
            </motion.div>

            {showEnrollmentModal && (
                <EnrollmentModal 
                    course={course} 
                    onClose={() => setShowEnrollmentModal(false)} 
                />
            )}
        </> 
    );
});
const stripePromise = loadStripe('pk_test_51OvOiGSDBIx2UJzRcUorq7L5QgLbfFZOREu1GbPWjmEUfi7c67dNqJRyZSDOmCtFBAbZ02jLo3pxfYQgQZHI6xe400n5xyZbSc') ;
const handleEnroll = async (course) => {
    console.log('Course to enroll:', course); // Log the entire course object
    console.log('Course ID:', course._id); // Log the course ID

    try {
        const response = await axiosInstance.post(`/courses/${course._id}/enroll`, {}, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}` // Ensure the token is sent
            }
        });

        if (course.isPaid) {
            const { clientSecret } = response.data; 
            const stripe = await stripePromise;
            const { error } = await stripe.redirectToCheckout({ clientSecret });

            if (error) {
                console.error('Error redirecting to Stripe:', error);
                toast.error('Failed to redirect to payment');
            } else {
                toast.success('Redirecting to payment...');
            }
        } else {
            toast.success('Successfully enrolled in the free course!');
            navigate(`/courses/${course._id}`); // Redirect to CourseDetails page
        }
    } catch (error) {
        console.error('Error during enrollment:', error);
        toast.error('Enrollment failed: ' + (error.response?.data?.message || 'An error occurred'));
    }
};
// const EnrollmentModal = ({ course, onClose }) => {
//     const { user } = useAuth();
//     const [isProcessing, setIsProcessing] = useState(false);

//     const handleSubmit = async (event) => {
//         event.preventDefault();
        
//         // For free courses, directly enroll without payment
//         if (!course.isPaid) {
//             try {
//                 const response = await axiosInstance.post(`/courses/${course._id}/enroll`, {
//                     courseId: course._id,
//                     userId: user._id
//                 });

//                 toast.success('Successfully enrolled in the course!');
//                 onClose();
//                 return;
//             } catch (error) {
//                 toast.error(error.response?.data?.message || 'Enrollment failed');
//                 return;
//             }
//         }

//         // Paid course logic remains the same
//         setIsProcessing(true);

//         try {
//             // Create checkout session
//             const response = await axiosInstance.post('/api/courses/create-checkout-session', {
//                 courseId: course._id,
//                 userId: user._id
//             });

//             // Redirect to Stripe Checkout
//             // Removed Stripe-related code here
//         } catch (error) {
//             toast.error('Enrollment failed. Please try again.');
//             console.error('Enrollment error:', error);
//         } finally {
//             setIsProcessing(false);
//         }
//     };

//     return (
//         <motion.div 
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
//         >
//             <motion.div
//                 initial={{ scale: 0.9 }}
//                 animate={{ scale: 1 }}
//                 className="bg-slate-900 rounded-xl p-8 w-full max-w-md"
//             >
//                 <h2 className="text-2xl font-bold text-white mb-4">Enroll in {course.name}</h2>
//                 <form onSubmit={handleSubmit}>
//                     <div className="mb-4">
//                         <p className="text-slate-300 mb-2">
//                             {course.isPaid 
//                                 ? `Course Price: $${course.price.toFixed(2)}` 
//                                 : 'This is a Free Course'}
//                         </p>
//                     </div>
//                     <div className="flex space-x-4 mt-6">
//                         <button 
//                             type="button"
//                             onClick={onClose}
//                             className="flex-1 bg-slate-700 text-white py-2 rounded-lg hover:bg-slate-600"
//                         >
//                             Cancel
//                         </button>
//                         <button 
//                             type="submit" 
//                             disabled={isProcessing}
//                             className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-2 rounded-lg hover:from-green-700 hover:to-emerald-700 disabled:opacity-50"
//                         >
//                             {isProcessing 
//                                 ? 'Processing...' 
//                                 : (course.isPaid ? 'Pay & Enroll' : 'Enroll Now')}
//                         </button>
//                     </div>
//                 </form>
//             </motion.div>
//         </motion.div>
//     );
// };



const FilterDropdown = ({ label, options, value, onChange, gradientFrom, gradientTo }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="py-14 relative">
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full sm:w-48 px-4 py-2 rounded-xl font-medium flex items-center justify-between ${
                    value !== 'all'
                        ? `bg-gradient-to-r from-${gradientFrom} to-${gradientTo} text-white shadow-lg shadow-${gradientFrom}/20`
                        : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50'
                }`}
            >
                <span>{options.find(opt => opt.value === value)?.label}</span>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <FaChevronDown className="ml-2" />
                </motion.div>
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute z-50 mt-2 w-full sm:w-48 rounded-xl overflow-hidden bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 shadow-xl"
                    >
                        {options.map((option) => (
                            <motion.button
                                key={option.value}
                                onClick={() => {
                                    onChange(option.value);
                                    setIsOpen(false);
                                }}
                                className={`w-full px-4 py-2 text-left transition-colors ${
                                    value === option.value
                                        ? `bg-gradient-to-r from-${gradientFrom} to-${gradientTo} text-white`
                                        : 'text-slate-300 hover:bg-slate-700/50'
                                }`}
                                whileHover={{ x: 4 }}
                            >
                                {option.label}
                            </motion.button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};







const Courses = () => {
    // Move state variables to the top
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Filter and search state
    const [searchTerm, setSearchTerm] = useState('');
    const [priceFilter, setPriceFilter] = useState('all');
    const [levelFilter, setLevelFilter] = useState('all');

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                setLoading(true);
                const response = await axiosInstance.get('/courses');
                
                // Extensive logging
                console.group('Course Fetching Debug');
                console.log('Full Response:', response);
                console.log('Response Data:', response.data);
                console.log('Response Success:', response.data.success);
                console.log('Courses Data:', response.data.data);
                console.groupEnd();

                // Ensure we're accessing the correct data path
                const coursesData = response.data.data || response.data;
                
                if (!coursesData || !Array.isArray(coursesData)) {
                    throw new Error('Invalid courses data structure');
                }

                setCourses(coursesData);
            } catch (err) {
                console.group('Course Fetching Error');
                console.error('Error Details:', err);
                console.error('Error Message:', err.message);
                console.error('Error Response:', err.response);
                console.groupEnd();

                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    // Filtering logic moved inside the component
    const filteredCourses = React.useMemo(() => {
        if (!courses) return [];

        return courses.filter(course => {
            const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchesPriceFilter = priceFilter === 'all' || 
                (priceFilter === 'free' && !course.isPaid) || 
                (priceFilter === 'paid' && course.isPaid);
            
            const matchesLevelFilter = levelFilter === 'all' || 
                course.level.toLowerCase() === levelFilter.toLowerCase();
            
            return matchesSearch && matchesPriceFilter && matchesLevelFilter;
        });
    }, [courses, searchTerm, priceFilter, levelFilter]);

    // Level filter options
    const levelOptions = [
        { value: 'all', label: 'All Levels' },
        { value: 'beginner', label: 'Beginner' },
        { value: 'intermediate', label: 'Intermediate' },
        { value: 'advanced', label: 'Advanced' }
    ];

    // Error boundary fallback
    if (error) {
        return (
            <div className="flex justify-center items-center h-screen text-red-500">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Error Loading Courses</h2>
                    <p>{error.message}</p>
                    <button 
                        onClick={() => window.location.reload()}
                        className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    // Loading state
    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <motion.div
                    animate={{
                        rotate: 360,
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        rotate: {
                            repeat: Infinity,
                            duration: 1.5,
                            ease: "linear"
                        },
                        scale: {
                            repeat: Infinity,
                            duration: 2,
                            ease: "easeInOut"
                        }
                    }}
                    className="text-cyan-500"
                >
                    <FaBook className="text-4xl" />
                </motion.div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="container mx-auto px-4 py-8"
        >
            {/* Search and Filter Section */}
            <div className="mb-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                {/* Search Input */}
                <div className="relative w-full md:w-1/3">
                    <input 
                        type="text" 
                        placeholder="Search courses..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 bg-slate-800 text-white rounded-full border border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                    <FaSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
                </div>

                {/* Filters */}
                <div className="flex items-center space-x-4">
                    <FilterDropdown
                        label="Price"
                        options={[
                            { value: 'all', label: 'All Courses' },
                            { value: 'free', label: 'Free Courses' },
                            { value: 'paid', label: 'Paid Courses' }
                        ]}
                        value={priceFilter}
                        onChange={setPriceFilter}
                        gradientFrom="green-500"
                        gradientTo="emerald-500"
                    />
                    <FilterDropdown
                        label="Level"
                        options={levelOptions}
                        value={levelFilter}
                        onChange={setLevelFilter}
                        gradientFrom="blue-500"
                        gradientTo="cyan-500"
                    />
                </div>
            </div>

            {/* Courses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredCourses.map((course, index) => (
                    <CourseCard key={course._id} course={course} index={index} />
                ))}
            </div>

            {/* No Courses Found */}
            {filteredCourses.length === 0 && (
                <div className="text-center text-slate-400 mt-12">
                    <p className="text-xl">No courses found matching your criteria.</p>
                </div>
            )}
        </motion.div>
    );
};

export default Courses;

