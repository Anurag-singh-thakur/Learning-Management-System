import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const ProtectedRoute = ({ children, allowedRoles = [], studentId }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    // Show loading state
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    // Not logged in
    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Check role if specified
    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        toast.error('You do not have permission to access this page');
        return user.role === 'instructor' 
            ? <Navigate to="/instructor/dashboard" replace /> 
            : <Navigate to="/student/dashboard" replace />;
    }

    // For student routes, check if the student is accessing their own dashboard
    if (user.role === 'student' && studentId && studentId !== user.id) {
        toast.error('You can only access your own dashboard');
        return <Navigate to="/student/dashboard" replace />;
    }

    // Handle render prop pattern
    if (typeof children === 'function') {
        return children({ user });
    }

    return children;
};

export default ProtectedRoute;
