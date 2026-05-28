import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { authService } from '../services/authService';

export default function ProtectedRoute() {
  const location = useLocation();
  const isValid = authService.validateLocalSession();
  const session = authService.getSession();

  if (!isValid || !session) {
    return <Navigate to='/login' replace />;
  }

  if (session.deve_trocar_senha === true && location.pathname !== '/trocar-senha') {
    return <Navigate to='/trocar-senha' replace />;
  }

  return <Outlet />;
}
