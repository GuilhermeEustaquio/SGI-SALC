import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { authService } from '../services/authService';

export default function ProtectedRoute() {
  const location = useLocation();
  const token = authService.getToken();
  const session = authService.getSession();

  if (!token || !session) {
    authService.logout();
    return <Navigate to='/login' replace />;
  }

  if (typeof session !== 'object' || session === null || !('deve_trocar_senha' in session)) {
    authService.logout();
    return <Navigate to='/login' replace />;
  }

  if (session.deve_trocar_senha === true && location.pathname !== '/trocar-senha') {
    return <Navigate to='/trocar-senha' replace />;
  }

  return <Outlet />;
}
