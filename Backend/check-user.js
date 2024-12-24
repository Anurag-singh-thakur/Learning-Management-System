const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

async function checkUser() {
    try {
        await mongoose.connect('mongodb+srv://singhanurag1309:PJNp9rLbTm25c81p@cluster0.vdiv4.mongodb.net/');
        console.log('Connected to MongoDB');

        const user = await User.findOne({ email: 'student@gmail.com' });
        console.log('User found:', user);

        // If you want to verify password
        if (user) {
            const isMatch = await user.matchPassword('student123');
            console.log('Password match:', isMatch);
        }
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
}

checkUser();
