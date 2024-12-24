import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Check if user is logged in on mount
    useEffect(() => {
        const checkLoginStatus = async () => {
            const token = localStorage.getItem('token');
            const rememberedCredentials = localStorage.getItem('rememberedCredentials');

            if (token) {
                await loadUser();
            } else if (rememberedCredentials) {
                // Check if credentials are still valid (within 24 hours)
                const { email, password, timestamp } = JSON.parse(rememberedCredentials);
                const now = new Date().getTime();
                const hoursSinceLogin = (now - timestamp) / (1000 * 60 * 60);

                if (hoursSinceLogin <= 24) {
                    try {
                        // Auto login with saved credentials
                        await login(email, password, true);
                    } catch (error) {
                        console.error('Auto-login failed:', error);
                        localStorage.removeItem('rememberedCredentials');
                    }
                } else {
                    // Remove expired credentials
                    localStorage.removeItem('rememberedCredentials');
                }
            }
            setLoading(false);
        };

        checkLoginStatus();
    }, []);

    // Load user data
    const loadUser = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setLoading(false);
                return;
            }

            const { data } = await authAPI.getCurrentUser();
            if (data && data.data) {
                setUser(data.data);
            } else {
                throw new Error('Invalid user data');
            }
        } catch (error) {
            console.error('Load user error:', error);
            // Only remove token if the error suggests an invalid token
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                localStorage.removeItem('token');
                setUser(null);
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    // Navigate based on user role
    const navigateByRole = (userData) => {
        
        navigate('/');
    };

    // Register user
    const register = async (userData) => {
        const { data } = await authAPI.register(userData);
        if (data.success !== false) {
            if (data.data.token) {
                localStorage.setItem('token', data.data.token);
                // First set basic user data
                setUser(data.data);
                // Then load complete user data
                await loadUser();
                navigateByRole(data.data);
                return true;
            } else {
                console.error('Token is missing in the response');
                throw new Error(data.message || 'Registration failed');
            }
        }
        throw new Error(data.message || 'Registration failed');
    };

    // Login user
    const login = async (email, password, rememberMe = false) => {
        const { data } = await authAPI.login({ email, password });
        console.log('Login response:', data);
        if (data.success !== false) {
            if (data.data.token) {
                localStorage.setItem('token', data.data.token);
                // First set basic user data
                setUser(data.data);
                // Then load complete user data
                await loadUser();
                navigateByRole(data.data);

                // Update remembered credentials timestamp if remember me is true
                if (rememberMe) {
                    const credentials = {
                        email,
                        password,
                        timestamp: new Date().getTime()
                    };
                    localStorage.setItem('rememberedCredentials', JSON.stringify(credentials));
                }
                return true;
            } else {
                console.error('Token is missing in the response');
                throw new Error(data.message || 'Login failed');
            }
        }
        throw new Error(data.message || 'Login failed');
    };

    // Logout user
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('rememberedCredentials');
        setUser(null);
        toast.success('Logged out successfully');
        navigate('/');
    };

    // Update profile
    const updateProfile = async (profileData) => {
        try {
            const { data } = await authAPI.updateProfile(profileData);
            if (data && data.data) {
                setUser(data.data);
                toast.success('Profile updated successfully');
                return true;
            } else {
                throw new Error('Update failed');
            }
        } catch (error) {
            console.error('Profile update error:', error);
            toast.error(error.response?.data?.message || 'Update failed');
            return false;
        }
    };

    // Delete account
    const deleteAccount = async () => {
        try {
            await authAPI.deleteAccount();
            localStorage.removeItem('token');
            setUser(null);
            toast.success('Account deleted successfully');
            navigate('/');
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Delete failed');
            return false;
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                register,
                login,
                logout,
                updateProfile,
                deleteAccount
            }}
        >
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};