const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, deleteProfile } = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/multer'); // Import multer middleware

// All routes are protected
router.use(protect);

router.get('/profile', getProfile);
router.put('/profile', upload.single('profileImage'), updateProfile); // Use multer to handle image upload
router.delete('/profile', deleteProfile);

module.exports = router;