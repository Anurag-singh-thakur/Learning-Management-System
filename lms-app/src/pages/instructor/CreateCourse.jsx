import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { FaPlus, FaBook, FaClock, FaTag } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import api, { courseAPI } from '../../services/api';

const CreateCourse = () => {
  const navigate = useNavigate();
  const [courseData, setCourseData] = useState({
    name: '',
    description: '',
    duration: '',
    level: 'Beginner',
    isPaid: false,
    price: '',
    thumbnail: null
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (type === 'file') {
      // Validate file type and size
      const file = files[0];
      if (file) {
        const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
        const maxSize = 5 * 1024 * 1024; // 5MB

        if (!validTypes.includes(file.type)) {
          toast.error('Invalid file type. Please upload a JPEG, PNG, or WebP image.');
          return;
        }

        if (file.size > maxSize) {
          toast.error('File size exceeds 5MB. Please choose a smaller image.');
          return;
        }

        setCourseData(prev => ({
          ...prev,
          [name]: file
        }));
      }
    } else {
      setCourseData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));

      // Clear specific field error when user starts typing
      if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: '' }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form data
    if (!courseData.name || !courseData.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Additional validation for paid courses
    if (courseData.isPaid && (!courseData.price || parseFloat(courseData.price) <= 0)) {
      toast.error('Please specify a valid price for paid courses');
      return;
    }

    const newErrors = {};

    // Name validation
    if (!courseData.name.trim()) {
      newErrors.name = 'Course name is required';
    }

    // Description validation
    if (!courseData.description.trim()) {
      newErrors.description = 'Course description is required';
    }

    // Duration validation
    if (!courseData.duration || isNaN(courseData.duration) || Number(courseData.duration) <= 0) {
      newErrors.duration = 'Valid course duration is required';
    }

    // Price validation for paid courses
    if (courseData.isPaid) {
      if (!courseData.price || isNaN(courseData.price) || Number(courseData.price) <= 0) {
        newErrors.price = 'Valid price is required for paid courses';
      }
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    const formData = new FormData();
    
    // Append all course data to FormData
    Object.keys(courseData).forEach(key => {
      if (courseData[key] !== null && courseData[key] !== undefined) {
        if (key === 'thumbnail' && courseData[key] instanceof File) {
          formData.append('thumbnail', courseData[key]);
        } else {
          formData.append(key, courseData[key]);
        }
      }
    });

    // Loading toast
    const loadingToast = toast.loading('Creating course...');

    try {
      // Use courseAPI method for creating course
      const response = await courseAPI.createCourse(formData);

      // Dismiss loading toast and show success
      toast.dismiss(loadingToast);
      toast.success(response.data.message || 'Course created successfully!');
      
      // Navigate to courses page or reset form
      navigate('/instructor/courses');

    } catch (error) {
      // Dismiss loading toast
      toast.dismiss(loadingToast);
      
      // More detailed error handling
      if (error.response) {
        const errorMessage = error.response.data.message || 'Failed to create course';
        
        toast.error(errorMessage);
        
        // Log additional details for debugging
        console.log('Error response data:', error.response.data);
        console.log('Error response status:', error.response.status);
      } else {
        toast.error('An unexpected error occurred');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-800 overflow-hidden">
          <div className="p-8">
            <h1 className="text-3xl font-bold mb-6 flex items-center">
              <FaBook className="mr-3 text-violet-500" /> Create New Course
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Course Basic Information */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-2 text-sm font-medium">
                    Course Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="name"
                      value={courseData.name}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 rounded-lg bg-zinc-800 border ${
                        errors.name ? 'border-red-500' : 'border-zinc-700'
                      } focus:outline-none focus:ring-2 focus:ring-violet-500`}
                      placeholder="Enter course name"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium">
                    Difficulty Level
                  </label>
                  <select
                    name="level"
                    value={courseData.level}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              {/* Course Description */}
              <div>
                <label className="block mb-2 text-sm font-medium">
                  Course Description
                </label>
                <textarea
                  name="description"
                  value={courseData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className={`w-full px-4 py-2 rounded-lg bg-zinc-800 border ${
                    errors.description ? 'border-red-500' : 'border-zinc-700'
                  } focus:outline-none focus:ring-2 focus:ring-violet-500`}
                  placeholder="Describe your course..."
                ></textarea>
                {errors.description && (
                  <p className="text-red-500 text-xs mt-1">{errors.description}</p>
                )}
              </div>

              {/* Course Details */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-2 text-sm font-medium flex items-center">
                    <FaClock className="mr-2 text-violet-500" /> Duration (Hours)
                  </label>
                  <input
                    type="number"
                    name="duration"
                    value={courseData.duration}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 rounded-lg bg-zinc-800 border ${
                      errors.duration ? 'border-red-500' : 'border-zinc-700'
                    } focus:outline-none focus:ring-2 focus:ring-violet-500`}
                    placeholder="Total course hours"
                  />
                  {errors.duration && (
                    <p className="text-red-500 text-xs mt-1">{errors.duration}</p>
                  )}
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium flex items-center">
                    <FaTag className="mr-2 text-violet-500" /> Pricing
                  </label>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="isPaid"
                      checked={courseData.isPaid}
                      onChange={handleInputChange}
                      className="mr-2 text-violet-500 focus:ring-violet-500"
                    />
                    <span>Paid Course</span>
                  </div>
                  {courseData.isPaid && (
                    <div className="mt-2">
                      <input
                        type="number"
                        name="price"
                        value={courseData.price}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 rounded-lg bg-zinc-800 border ${
                          errors.price ? 'border-red-500' : 'border-zinc-700'
                        } focus:outline-none focus:ring-2 focus:ring-violet-500`}
                        placeholder="Course price"
                      />
                      {errors.price && (
                        <p className="text-red-500 text-xs mt-1">{errors.price}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Thumbnail Upload */}
              <div>
                <label className="block mb-2 text-sm font-medium">
                  Course Thumbnail
                </label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col border-4 border-dashed w-full h-32 hover:bg-zinc-800 hover:border-violet-500 group">
                    <div className="flex flex-col items-center justify-center pt-7 cursor-pointer">
                      <svg className="w-10 h-10 text-violet-400 group-hover:text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                      <p className="lowercase text-sm text-gray-400 group-hover:text-violet-600 pt-1 tracking-wider">
                        {courseData.thumbnail ? courseData.thumbnail.name : 'Select a photo'}
                      </p>
                    </div>
                    <input 
                      type="file" 
                      name="thumbnail"
                      accept="image/*"
                      onChange={handleInputChange}
                      className="hidden" 
                    />
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end mt-6">
                <button
                  type="submit"
                  className="bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 flex items-center"
                >
                  <FaPlus className="mr-2" /> Create Course
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCourse;