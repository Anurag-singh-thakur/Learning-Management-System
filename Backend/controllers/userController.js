const User = require('../models/User');
const path = require('path');
const fs = require('fs');
const fsPromises = require('fs').promises;
const multer = require('multer');
const jwt = require('jsonwebtoken');

// Ensure uploads directory exists
const uploadDir = 'uploads/profile-pictures';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Set up multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, `${req.user.id}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        const filetypes = /jpeg|jpg|png/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Error: Images Only!'));
        }
    }
});

// Get user profile
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching profile',
            error: error.message
        });
    }
};

// Update user profile
exports.updateProfile = [
    upload.single('profileImage'),
    async (req, res) => {
        try {
            const updates = {};
            
            // Update basic profile information
            if (req.body.name) updates.name = req.body.name;
            if (req.body.email) updates.email = req.body.email;
            if (req.body.bio) updates.bio = req.body.bio;

            // Handle profile picture upload
            if (req.file) {
                // Construct the profile picture path
                updates.profilePicture = `/uploads/profile-pictures/${req.file.filename}`;

                // Optional: Delete old profile picture if it exists
                const user = await User.findById(req.user.id);
                if (user.profilePicture) {
                    try {
                        const oldImagePath = path.join(__dirname, '..', user.profilePicture);
                        await fsPromises.unlink(oldImagePath);
                    } catch (error) {
                        console.log('Error deleting old profile picture:', error);
                    }
                }
            }

            // Update user profile
            const updatedUser = await User.findByIdAndUpdate(
                req.user.id,
                { $set: updates },
                { new: true, runValidators: true }
            ).select('-password');

            if (!updatedUser) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            res.json({
                success: true,
                data: updatedUser
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error updating profile',
                error: error.message
            });
        }
    }
];

// Delete user account
exports.deleteProfile = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.user.id);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Optional: Delete profile picture if it exists
        if (user.profilePicture) {
            try {
                const imagePath = path.join(__dirname, '..', user.profilePicture);
                await fsPromises.unlink(imagePath);
            } catch (error) {
                console.log('Error deleting profile picture:', error);
            }
        }

        res.json({
            success: true,
            message: 'User profile deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting profile',
            error: error.message
        });
    }
};

// Register a new user
exports.registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists'
            });
        }

        // Create a new user
        const user = await User.create({
            name,
            email,
            password,
            role
        });

        // Generate a token
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '30d' }
        );

        res.status(201).json({
            success: true,
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error registering user',
            error: error.message
        });
    }
};
