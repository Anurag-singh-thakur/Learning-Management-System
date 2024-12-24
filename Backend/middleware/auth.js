const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
    let token;

    // Check if token exists in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Find user by decoded ID, excluding password
            const user = await User.findById(decoded.id).select('-password');

            if (!user) {
                return res.status(401).json({ 
                    success: false, 
                    message: 'User not found' 
                });
            }

            // Attach user to request object
            req.user = user;

            next();
        } catch (error) {
            console.error('Token verification error:', error);
            return res.status(401).json({ 
                success: false, 
                message: 'Not authorized, token failed',
                error: error.message
            });
        }
    } else {
        // No token provided
        return res.status(401).json({ 
            success: false, 
            message: 'Not authorized, no token' 
        });
    }
};

// Optional authentication middleware
exports.optionalProtect = async (req, res, next) => {
    let token;

    // Check if token exists in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Find user by decoded ID, excluding password
            const user = await User.findById(decoded.id).select('-password');

            if (user) {
                // Attach user to request object if found
                req.user = user;
            }
        } catch (error) {
            console.error('Optional token verification error:', error);
            // If token is invalid, continue without user
        }
    }

    // Always call next middleware, whether user is authenticated or not
    next();
};
