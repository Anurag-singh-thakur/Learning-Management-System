import React from 'react';
import { Link } from 'react-router-dom';
import { FaChalkboardTeacher, FaUserGraduate, FaChartLine } from 'react-icons/fa';

function InstructorDashboard() {
  return (
    <div className="p-4 bg-gray-900 text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Instructor Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gray-800 shadow-lg rounded-lg p-6 transform transition duration-500 hover:scale-105 hover:bg-gray-700">
          <FaChalkboardTeacher className="text-4xl text-blue-400 mb-4" />
          <h2 className="text-xl font-semibold">Manage Courses</h2>
          <p className="text-gray-400">Create and manage your courses.</p>
          <Link to="/instructor/courses" className="text-blue-400 hover:underline">Go to Courses</Link>
        </div>
        <div className="bg-gray-800 shadow-lg rounded-lg p-6 transform transition duration-500 hover:scale-105 hover:bg-gray-700">
          <FaUserGraduate className="text-4xl text-green-400 mb-4" />
          <h2 className="text-xl font-semibold">View Students</h2>
          <p className="text-gray-400">See enrolled students and their progress.</p>
          <Link to="/instructor/students" className="text-green-400 hover:underline">View Students</Link>
        </div>
        <div className="bg-gray-800 shadow-lg rounded-lg p-6 transform transition duration-500 hover:scale-105 hover:bg-gray-700">
          <FaChartLine className="text-4xl text-yellow-400 mb-4" />
          <h2 className="text-xl font-semibold">Analytics</h2>
          <p className="text-gray-400">Analyze course performance and student engagement.</p>
          <Link to="/instructor/analytics" className="text-yellow-400 hover:underline">View Analytics</Link>
        </div>
      </div>
    </div>
  );
}

export default InstructorDashboard;
