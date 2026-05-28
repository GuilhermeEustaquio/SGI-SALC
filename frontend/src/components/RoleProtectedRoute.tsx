import { Navigate, Outlet } from 'react-router-dom';
import { authService } from '../services/authService';

export default function RoleProtectedRoute() {
  const session = authService.getSession();
  if (!session) return <Navigate to='/login' replace />;

  const isSuperAdmin = session.is_super_admin === true || (session.perfis ?? []).includes('SUPER_ADMIN');
  if (!isSuperAdmin) return <Navigate to='/acesso-negado' replace />;

  return <Outlet />;
}
