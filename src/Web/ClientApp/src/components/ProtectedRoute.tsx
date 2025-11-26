import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@store';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requireAdmin?: boolean;
}

export default function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
    const location = useLocation();
    const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (requireAdmin && user) {
        const isAdmin = user.roles?.some(role =>
            role.toLowerCase() === 'admin' || role.toLowerCase() === 'administrator'
        );
        if (!isAdmin) {
            return <Navigate to="/" replace />;
        }
    }

    return <>{children}</>;
}
