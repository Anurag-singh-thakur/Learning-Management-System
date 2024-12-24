import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "../components/shadcn/button";
import Navbar from '../components/Navbar';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const SignUp = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student' // Default role
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const register = async (data) => {
    try {
      const { data: response } = await authAPI.register(data);
      if (response.success !== false) {
        toast.success('Account created successfully!');
        // After successful registration, try to log in
        try {
          await login(data.email, data.password);
          const dashboardPath = data.role === 'instructor' ? '/instructor/dashboard' : '/student/dashboard';
          navigate(dashboardPath);
        } catch (loginError) {
          console.error('Login error after registration:', loginError);
          toast.error('Registration successful, but login failed. Please try logging in manually.');
          navigate('/login');
        }
      }
      return response;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.email || !formData.password) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);
    try {
      // Register user
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role
      });
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to create account';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pt-16">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className="dark-card p-8 rounded-lg border">
            <h1 className="text-2xl font-bold text-center mb-8">Create Account</h1>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-zinc-900 text-white border border-zinc-800 rounded-lg px-4 py-2 focus:outline-none focus:border-violet-600"
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-zinc-900 text-white border border-zinc-800 rounded-lg px-4 py-2 focus:outline-none focus:border-violet-600"
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-zinc-900 text-white border border-zinc-800 rounded-lg px-4 py-2 focus:outline-none focus:border-violet-600"
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full bg-zinc-900 text-white border border-zinc-800 rounded-lg px-4 py-2 focus:outline-none focus:border-violet-600"
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">I want to join as</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'student' })}
                    className={`p-4 rounded-lg border ${
                      formData.role === 'student'
                        ? 'border-violet-600 bg-violet-600/10'
                        : 'border-zinc-800 hover:border-violet-600'
                    }`}
                    disabled={isLoading}
                  >
                    <span className="block text-lg mb-1">👨‍🎓</span>
                    <span className="block font-medium">Student</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'instructor' })}
                    className={`p-4 rounded-lg border ${
                      formData.role === 'instructor'
                        ? 'border-violet-600 bg-violet-600/10'
                        : 'border-zinc-800 hover:border-violet-600'
                    }`}
                    disabled={isLoading}
                  >
                    <span className="block text-lg mb-1">👨‍🏫</span>
                    <span className="block font-medium">Instructor</span>
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-violet-600 hover:bg-violet-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>

            <p className="text-center mt-6 text-zinc-400">
              Already have an account?{' '}
              <Link to="/login" className="text-violet-400 hover:text-violet-300">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
