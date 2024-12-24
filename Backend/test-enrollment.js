const axios = require('axios');

async function testEnrollment() {
    try {
        // Login
        const loginResponse = await axios.post('http://localhost:3008/api/auth/login', {
            email: 'student@gmail.com',
            password: 'student123'  // Corrected password
        }).catch(err => {
            console.error('Login Error:', err.response ? err.response.data : err.message);
            throw err;
        });

        const token = loginResponse.data.data.token;  // Updated to extract token from nested data
        console.log('Login successful. Token:', token);

        // Get a course ID
        const coursesResponse = await axios.get('http://localhost:3008/api/courses', {
            headers: { Authorization: `Bearer ${token}` }
        }).catch(err => {
            console.error('Courses Fetch Error:', err.response ? err.response.data : err.message);
            throw err;
        });

        const courseId = coursesResponse.data.data[0]._id;
        console.log('First Course ID:', courseId);

        // Enroll in the course
        const enrollResponse = await axios.post(`http://localhost:3008/api/courses/${courseId}/enroll`, 
            { courseId },
            { 
                headers: { 
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}` 
                } 
            }
        ).catch(err => {
            console.error('Enrollment Error:', err.response ? err.response.data : err.message);
            throw err;
        });

        console.log('Enrollment Response:', enrollResponse.data);
    } catch (error) {
        console.error('Unhandled Error:', error);
    }
}

testEnrollment();
