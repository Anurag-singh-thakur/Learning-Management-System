import React, { useEffect, useState } from 'react';
import axiosInstance from '../lib/axios'; // If you're not using this, you can remove it
import { useAuth } from '../context/AuthContext';

const MyCourses = () => {
    const { user } = useAuth();
    const [courses, setCourses] = useState([]);
    const [error, setError] = useState(null);

    const fetchMyCourses = async () => {
        try {
            const response = await fetch('http://localhost:3008/api/courses/c/my-courses', {
                credentials: "include",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            setCourses(data);
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
            <h1 className="text-white text-center py-2 mt-20">My Courses</h1>
            {error && <p className="text-red-500 text-center">{error}</p>} 
            <div className="text-center">
                {courses.length > 0 ? (
                    courses.map(course => (
                        <div key={course._id} className="text-white text-center py-2">
                            {course.name}
                        </div>
                    ))
                ) : (
                    <p className="text-white">No courses found.</p>
                )}
            </div>
        </div>
    );
};

export default MyCourses;
