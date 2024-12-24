const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

async function verifyCredentials() {
    try {
        await mongoose.connect('mongodb+srv://singhanurag1309:PJNp9rLbTm25c81p@cluster0.vdiv4.mongodb.net/');
        console.log('Connected to MongoDB');

        const user = await User.findOne({ email: 'student@gmail.com' }).select('+password');
        
        if (!user) {
            console.log('User not found');
            return;
        }

        console.log('User found:', user);

        // Try hashing the password you're using
        const hashedInputPassword = await bcrypt.hash('student123', 10);
        
        // Compare the stored password with the hashed input
        const isMatch = await bcrypt.compare(user.password, hashedInputPassword);
        console.log('Password match result:', isMatch);

        // Direct comparison of the stored password
        const directCompare = await bcrypt.compare('student123', user.password);
        console.log('Direct comparison result:', directCompare);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
}

verifyCredentials();
