import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const InstructorCourses = () => {
    const [courses, setCourses] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('');

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await api.get('/instructor/courses');
                setCourses(response.data.data);
            } catch (error) {
                console.error('Error fetching instructor courses:', error);
            }
        };
        fetchCourses();
    }, []);

    const filteredCourses = courses.filter(course => {
        const courseName = course.name || '';
        return courseName.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const sortedCourses = filteredCourses.sort((a, b) => {
        if (sortOrder === 'Beginner') return a.level === 'Beginner' ? -1 : 1;
        if (sortOrder === 'Intermediate') return a.level === 'Intermediate' ? -1 : 1;
        if (sortOrder === 'Advanced') return a.level === 'Advanced' ? -1 : 1;
        return 0;
    });

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">My Courses</h1>
                    <button className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md">
                        Create New Course
                    </button>
                </div>

                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Search courses..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                    />
                </div>

                <div className="mb-4">
                    <select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                    >
                        <option value="">Sort by Level</option>
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                    </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sortedCourses.map(course => (
                        <div key={course._id} className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
                            <div className="p-6">
                                <h3 className="text-xl font-semibold mb-2">{course.name}</h3>
                                <p className="text-gray-400 mb-4">
                                    {course.description || 'No description available.'}
                                </p>
                                <p className="text-gray-400 mb-4">
                                    Price: {course.isPaid ? `$${course.price}` : 'Free'}
                                </p>
                                <div className="flex justify-end space-x-2">
                                    <button className="text-indigo-400 hover:text-indigo-300">
                                        Edit
                                    </button>
                                    <button className="text-red-400 hover:text-red-300">
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default InstructorCourses;
