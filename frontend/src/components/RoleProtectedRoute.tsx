import { Navigate, Outlet } from 'react-router-dom';
import { authService } from '../services/authService';

export default function RoleProtectedRoute() {
  const session = authService.getSession();
  const isSuperAdmin = Boolean(session?.is_super_admin) || Array.isArray(session?.perfis) && session.perfis.includes('SUPER_ADMIN');

  if (!isSuperAdmin) {
    return <Navigate to='/dashboard' replace />;
  }

  return <Outlet />;
}
