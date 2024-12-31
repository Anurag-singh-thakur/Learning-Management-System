const Course = require('../models/Course');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const jwt = require('jsonwebtoken');
// const stripe = require('stripe');
const mongoose = require('mongoose'); // Added mongoose import
const Enrollment = require('../models/Enrollment');
// No selected code provided, so I'll suggest a general improvement for the entire code file
const express = require('express')
const app = express()
// Add input validation for all API endpoints
const validateInput = (req, res, next) => {
    if (!req.body) {
        return res.status(400).json({ message: 'Invalid request body' });
    }
    next();
};

// // Use the validateInput middleware in all API endpoints
// exports.createCourse = [
//     validateInput,
//     thumbnailUpload.single('thumbnail'),
//     async (req, res) => {
//         // ...
//     }
// ];

// exports.getAllCourses = async (req, res) => {
//     try {
//         // ...
//     } catch (error) {
//         console.error('Error fetching courses:', error);
//         res.status(500).json({ message: 'Error fetching courses' });
//     }
// };


// Consider using a more robust error handling mechanism
const errorHandler = (error, req, res, next) => {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
};

// Use the errorHandler middleware in the main application file
app.use(errorHandler);



const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
// Ensure directory exists
const ensureDirectoryExists = async (dirPath) => {
    try {
        await fs.mkdir(dirPath, { recursive: true });
    } catch (error) {
        console.error('Error creating directory:', error);
    }
};

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Configure multer for thumbnail upload
const thumbnailStorage = multer.diskStorage({
    destination: async function (req, file, cb) {
        const uploadDir = path.join(__dirname, '..', 'uploads', 'course-thumbnails');
        
        // Ensure directory exists before upload
        await ensureDirectoryExists(uploadDir);
        
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, `course-${Date.now()}${path.extname(file.originalname)}`);
    }
});

// Multer file filter for images
const thumbnailFileFilter = (req, file, cb) => {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        req.fileValidationError = 'Only image files are allowed!';
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};

const thumbnailUpload = multer({
    storage: thumbnailStorage,
    fileFilter: thumbnailFileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB file size limit
});

exports.createCourse = [
    // Middleware for thumbnail upload
    thumbnailUpload.single('thumbnail'),
    
    async (req, res) => {
        try {
            // Destructure course data from request body
            const { 
                name, 
                description, 
                duration, 
                level,
                isPaid, 
                price 
            } = req.body;

            // Prepare course data
            const courseData = {
                name, 
                description, 
                instructor: req.user.id,
                duration: Number(duration), 
                level: level || 'Beginner', 
                isPaid: isPaid === 'true',
                price: isPaid === 'true' ? Number(price) : 0
            };

            // Add thumbnail if uploaded
            if (req.file) {
                // Use a relative path from the uploads directory
                courseData.thumbnail = `/uploads/course-thumbnails/${req.file.filename}`;
            }

            // Create course
            const course = await Course.create(courseData);

            res.status(201).json({ 
                success: true, 
                data: course,
                message: 'Course created successfully' 
            });
        } catch (error) {
            console.error('Course creation error:', error);
            
            // Handle validation errors
            if (error.name === 'ValidationError') {
                const validationErrors = Object.values(error.errors).map(err => err.message);
                return res.status(400).json({
                    success: false,
                    message: validationErrors.join(', ')
                });
            }

            // Generic error response
            res.status(500).json({ 
                success: false, 
                message: 'Error creating course',
                error: error.message 
            });
        }
    }
];

exports.getAllCourses = async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 10, 
            category, 
            search, 
            sortBy = 'createdAt', 
            sortOrder = 'desc' 
        } = req.query;

        // Create a dynamic filter object
        const filter = {};
        if (category) filter.category = category;
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        // Create a dynamic sort object
        const sort = {};
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

        // Pagination
        const pageNumber = parseInt(page);
        const limitNumber = parseInt(limit);
        const skip = (pageNumber - 1) * limitNumber;

        // Fetch courses with populated instructor details
        const courses = await Course.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(limitNumber)
            .populate({
                path: 'instructor',
                select: 'name avatar expertise email' // Select specific fields
            });

        // Count total courses for pagination
        const totalCourses = await Course.countDocuments(filter);

        res.status(200).json({
            courses,
            totalPages: Math.ceil(totalCourses / limitNumber),
            currentPage: pageNumber
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching courses',
            error: error.message
        });
    }
};

exports.getTrendingCourses = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 4;
        
        const trendingCourses = await Course.aggregate([
            {
                $addFields: {
                    // Calculate trending score based on multiple factors
                    trendingScore: {
                        $add: [
                            { $multiply: ['$enrollments', 2] },  // Enrollments weighted more
                            { $multiply: ['$rating', 1.5] },     // Rating with moderate weight
                            { $divide: [{ $subtract: [new Date(), '$createdAt'] }, 86400000] }  // Recency factor
                        ]
                    }
                }
            },
            { $sort: { trendingScore: -1 } },  // Sort by trending score
            { $limit: limit },
            {
                $lookup: {
                    from: 'users',  // Assuming your users collection is named 'users'
                    localField: 'instructor',
                    foreignField: '_id',
                    as: 'instructorDetails'
                }
            },
            { $unwind: '$instructorDetails' },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    category: 1,
                    thumbnail: 1,
                    rating: 1,
                    enrollments: 1,
                    description: 1,
                    duration: 1,
                    price: 1,
                    isPaid: 1,
                    'instructor.name': '$instructorDetails.name',
                    'instructor.avatar': '$instructorDetails.avatar',
                    'instructor.expertise': '$instructorDetails.expertise'
                }
            }
        ]);

        res.status(200).json(trendingCourses);
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching trending courses',
            error: error.message
        });
    }
};

exports.getInstructorCourses = async (req, res) => {
    try {
        // Debug logs
        console.log('Request headers:', req.headers);
        console.log('User object:', req.user);
        console.log('User ID:', req.user?._id);

        // Check authentication
        if (!req.user) {
            console.log('No user found in request');
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }

        // Check user role
        if (req.user.role !== 'instructor') {
            console.log('User is not an instructor:', req.user.role);
            return res.status(403).json({
                success: false,
                message: 'User is not an instructor'
            });
        }

        // The user._id is already an ObjectId, no need to convert
        console.log('Searching for courses with instructor ID:', req.user._id);

        const courses = await Course.find({ instructor: req.user._id })
            .populate('instructor', 'name email profilePicture')
            .lean();

        console.log('Found courses:', courses);

        if (!courses) {
            return res.status(200).json({
                success: true,
                data: [],
                message: 'No courses found'
            });
        }

        // Add full URL to instructor profile pictures
        const coursesWithFullUrls = courses.map(course => ({
            ...course,
            instructor: course.instructor ? {
                ...course.instructor,
                profilePicture: course.instructor.profilePicture ? 
                    `/uploads/profile-pictures/${path.basename(course.instructor.profilePicture)}` : null
            } : null
        }));

        return res.status(200).json({ 
            success: true, 
            data: coursesWithFullUrls,
            message: 'Courses retrieved successfully'
        });
    } catch (error) {
        console.error('Error in getInstructorCourses:', error);
        return res.status(500).json({ 
            success: false, 
            message: 'Server error while fetching courses',
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

exports.updateCourse = async (req, res) => {
    try {
        const course = await Course.findOneAndUpdate(
            { _id: req.params.courseId, instructor: req.user.id },
            req.body,
            { new: true }
        );

        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }

        res.status(200).json({ success: true, data: course });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

exports.deleteCourse = async (req, res) => {
    try {
        const course = await Course.findOneAndDelete({
            _id: req.params.courseId,
            instructor: req.user.id
        });

        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

exports.addCourseContent = async (req, res) => {
    try {
        upload.single('file')(req, res, async (err) => {
            if (err) {
                return res.status(400).json({ success: false, message: 'File upload failed' });
            }

            const { title, type } = req.body;
            const filePath = req.file.path;

            const course = await Course.findOne({
                _id: req.params.courseId,
                instructor: req.user.id
            });

            if (!course) {
                return res.status(404).json({ success: false, message: 'Course not found' });
            }

            course.content.push({
                title,
                type,
                filePath,
                uploadDate: new Date()
            });

            await course.save();
            res.status(200).json({ success: true, data: course });
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

exports.getCourseById = async (req, res) => {
    try {
        const courseId = req.params.courseId;

        // Validate courseId
        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid course ID' 
            });
        }

        // Find course and populate instructor details
        const course = await Course.findById(courseId)
            .populate({
                path: 'instructor', 
                select: 'name email profilePicture' 
            })
            .lean(); // Convert to plain JavaScript object for easier manipulation

        if (!course) {
            return res.status(404).json({ 
                success: false, 
                message: 'Course not found' 
            });
        }

        // Add full URL to instructor profile picture
        if (course.instructor && course.instructor.profilePicture) {
            course.instructor.profilePicture = `/uploads/profile-pictures/${path.basename(course.instructor.profilePicture)}`;
        }

        // Add full URL to course thumbnail
        if (course.thumbnail) {
            course.thumbnail = `/uploads/course-thumbnails/${path.basename(course.thumbnail)}`;
        }

        // Check if the current user (if authenticated) is the instructor
        let isInstructor = false;
        if (req.user && course.instructor && req.user._id.toString() === course.instructor._id.toString()) {
            isInstructor = true;
        }

        return res.status(200).json({ 
            success: true, 
            data: {
                ...course,
                isInstructor
            },
            message: 'Course retrieved successfully'
        });
    } catch (error) {
        console.error('Error in getCourseById:', error);
        return res.status(500).json({ 
            success: false, 
            message: 'Server error while fetching course details',
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};


// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
// const jwt = require('jsonwebtoken');
// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
// const jwt = require('jsonwebtoken');
// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// const jwt = require('jsonwebtoken');
// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.enrollInCourse = async (req, res) => {
    const { courseId } = req.params;
    const userId = req.user.id;

    try {
        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Check if the user is already enrolled
        const enrollment = await Enrollment.findOne({ course: courseId, user: userId });
        if (enrollment) {
            return res.status(400).json({ message: 'User already enrolled in this course' });
        }

        // Check if the user is the instructor of the course
        if (course.instructor.toString() === userId) {
            return res.status(400).json({ message: 'Instructors cannot enroll in their own courses' });
        }

        if (course.isPaid) {
            // Create a token for the success URL
            const token = jwt.sign({ courseId, userId }, process.env.JWT_SECRET, { expiresIn: '1h' });

            // Create a Stripe checkout session
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: [{
                    price_data: {
                        currency: 'inr',
                        product_data: {
                            name: course.name,
                        },
                        unit_amount: course.price * 100, // Price in paise
                    },
                    quantity: 1,
                }],
                mode: 'payment',
                success_url: `${process.env.FRONTEND_URL}/courses/${courseId}/success?token=${token}`,
                cancel_url: `${process.env.FRONTEND_URL}/courses/${courseId}/cancel`,
            });

            return res.json({ url: session.url });
        } else {
            // Enroll the user in the free course
            const newEnrollment = new Enrollment({
                course: courseId,
                user: userId,
                paymentStatus: 'completed'
            });
            await newEnrollment.save();

            return res.status(200).json({ message: 'Successfully enrolled in the free course' });
        }
    } catch (error) {
        console.error('Enrollment error:', error);
        return res.status(500).json({ message: 'Enrollment failed' });
    }
};