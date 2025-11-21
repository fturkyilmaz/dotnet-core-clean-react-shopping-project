import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@store';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredRole?: string;
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
    const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (requiredRole && !user?.roles.includes(requiredRole)) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
}
