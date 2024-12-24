const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

async function resetPassword() {
    try {
        await mongoose.connect('mongodb+srv://singhanurag1309:PJNp9rLbTm25c81p@cluster0.vdiv4.mongodb.net/');
        console.log('Connected to MongoDB');

        const user = await User.findOne({ email: 'student@gmail.com' });
        
        if (user) {
            // Hash the new password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('student123', salt);
            
            user.password = hashedPassword;
            await user.save();
            
            console.log('Password reset successful');
        } else {
            console.log('User not found');
        }
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
}

resetPassword();
