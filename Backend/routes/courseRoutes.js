const express = require('express');
const router = express.Router();
const { 
    createCourse, 
    getCourses, 
    getInstructorCourses,
    addCourseContent,
    deleteCourse,
    getCourseById,
    getTrendingCourses
} = require('../controllers/courseController');
const { protect, optionalProtect } = require('../middleware/auth');
const Course = require('../models/Course');
// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Enrollment = require('../models/Enrollment');
const User = require('../models/User');
const { enrollInCourse } = require('../controllers/courseController');
// Public routes
router.get('/', async (req, res) => {
    try {
        const courses = await Course.find();

        res.status(200).json({
            success: true,
            data: courses
        });
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch courses',
            error: error.message
        });
    }
});

// Public route for fetching a single course by ID with optional authentication
router.get('/:courseId', optionalProtect, getCourseById);

// Get Trending Courses (Public Route)
router.get('/trending', getTrendingCourses);

// Protected instructor routes
router.use('/instructor', protect); // Apply protect middleware to all instructor routes
router.post('/instructor/create', createCourse);
router.get('/instructor/courses', getInstructorCourses); 
router.post('/instructor/:courseId/content', addCourseContent);
router.delete('/instructor/:courseId', deleteCourse);

router.post('/courses/:courseId/enroll', protect, enrollInCourse);

// Removed the duplicate enroll route

module.exports = router;