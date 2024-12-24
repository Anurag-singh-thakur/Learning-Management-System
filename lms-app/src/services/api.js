import axios from 'axios';

const API_URL = 'http://localhost:3008';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auth API calls
export const authAPI = {
    register: (userData) => api.post('/api/auth/register', userData),
    login: (credentials) => api.post('/api/auth/login', credentials),
    getCurrentUser: () => api.get('/api/auth/profile'),
    updateProfile: (data) => api.put('/api/auth/profile', data, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }),
    deleteAccount: () => api.delete('/api/auth/profile')
};

// Course API calls
export const courseAPI = {
    getAllCourses: () => api.get('/api/courses'),
    getCourseById: (id) => api.get(`/api/courses/${id}`),
    getInstructorCourses: () => api.get('/api/courses/instructor'),
    createCourse: (courseData) => api.post('/api/courses/instructor/create', courseData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }),
    updateCourse: (id, courseData) => api.put(`/api/courses/${id}`, courseData),
    deleteCourse: (id) => api.delete(`/api/courses/${id}`),
    enrollCourse: (courseId) => api.post(`/api/courses/${courseId}/enroll`)
};

export default api;
