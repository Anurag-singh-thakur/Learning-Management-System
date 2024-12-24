const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['pdf', 'image', 'assignment', 'notice'],
        required: true
    },
    filePath: {
        type: String,
        required: true
    },
    uploadDate: {
        type: Date,
        default: Date.now
    }
});

const courseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Course name is required'],
        trim: true,
        minlength: [3, 'Course name must be at least 3 characters long']
    },
    description: {
        type: String,
        required: [true, 'Course description is required'],
        trim: true,
        minlength: [10, 'Description must be at least 10 characters long']
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    duration: {
        type: Number,
        required: [true, 'Course duration is required'],
        min: [1, 'Duration must be at least 1 hour']
    },
    level: {
        type: String,
        enum: {
            values: ['Beginner', 'Intermediate', 'Advanced'],
            message: 'Invalid course level'
        },
        default: 'Beginner'
    },
    thumbnail: {
        type: String,
        default: ''
    },
    isPaid: {
        type: Boolean,
        default: false
    },
    price: {
        type: Number,
        default: 0,
        min: [0, 'Price cannot be negative']
    },
    content: [contentSchema],
    videos: [{
        type: String
    }],
    enrolledStudents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Course', courseSchema);
