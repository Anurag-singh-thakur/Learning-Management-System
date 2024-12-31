import React, { useEffect, useState } from 'react';
import axiosInstance from '../lib/axios';
import { useAuth } from '../context/AuthContext';

const MyCourses = () => {
    const { user } = useAuth();
    const [courses, setCourses] = useState([]);
    const [error, setError] = useState(null);

    const fetchMyCourses = async () => {
        try {
            const response = await axiosInstance.get('/courses/my-courses', {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            });
            setCourses(response.data);
        } catch (err) {
            setError('Error fetching courses: ' + err.message);
        }
    };

    useEffect(() => {
        if (user) {
            fetchMyCourses();
        }
    }, [user]);

    return (
        <div>
            {error && <p>{error}</p>}
            <h1>My Courses</h1>
            <ul>
                {courses.map(course => (
                    <li key={course.id}>{course.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default MyCourses;