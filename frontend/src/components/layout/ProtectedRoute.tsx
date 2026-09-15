import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { token, user } = useAuthStore();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const hasRole = user?.roles?.some(r => allowedRoles.includes(r) || r === 'SUPER_ADMIN');
    if (!hasRole) {
      // User is logged in but lacks required role. Redirect to their portal.
      const roles = user?.roles || [];
      if (roles.includes('STUDENT')) return <Navigate to="/student" replace />;
      if (roles.includes('SUPER_ADMIN') || roles.includes('ADMIN')) return <Navigate to="/admin" replace />;
      return <Navigate to="/nexoffice" replace />;
    }
  }

  return <Outlet />;
}
