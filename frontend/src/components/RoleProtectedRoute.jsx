import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RoleProtectedRoute = ({ allowedRoles }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h1 className="text-4xl font-bold text-finance-orange mb-4">403</h1>
        <p className="text-xl text-finance-text-secondary">Access Denied</p>
        <p className="text-sm text-finance-text-muted mt-2">You don't have permission to view this page.</p>
      </div>
    );
  }

  return <Outlet />;
};

export default RoleProtectedRoute;
