import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';

interface ProtectedRouteProps {
    children: ReactNode;
    requireAuth?: boolean;
}

export const ProtectedRoute = ({ children, requireAuth = true }: ProtectedRouteProps) => {
    const { user, loading } = useAuth();

    if (loading) {
        // Show loading spinner while checking auth state
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (requireAuth && !user) {
        // Redirect to login if authentication is required but user is not logged in
        return <Navigate to="/login" replace />;
    }

    if (!requireAuth && user) {
        // Redirect to dashboard if user is already logged in and trying to access auth pages
        return <Navigate to="/dashboard" replace />;
    }

    return <>{children}</>;
};