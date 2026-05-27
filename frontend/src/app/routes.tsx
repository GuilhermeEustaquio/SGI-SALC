import { Navigate, createBrowserRouter } from 'react-router-dom';
import AdminDashboard from '../pages/AdminGlobal/AdminDashboard';
import ChangePasswordPage from '../pages/ChangePassword/ChangePasswordPage';
import DashboardPage from '../pages/Dashboard/DashboardPage';
import LoginPage from '../pages/Login/LoginPage';
import { authService } from '../services/authService';

const rootRedirect = () => {
  const s = authService.getSession();
  if (!s) return '/login';
  if (s.deve_trocar_senha) return '/trocar-senha';
  if (s.is_super_admin) return '/admin-global';
  return '/dashboard';
};
const guard = (el: JSX.Element, superOnly = false) => {
  const token = authService.getToken(); const s = authService.getSession();
  if (!token || !s) return <Navigate to='/login' replace />;
  if (s.deve_trocar_senha) return <Navigate to='/trocar-senha' replace />;
  if (superOnly && !s.is_super_admin) return <Navigate to='/dashboard' replace />;
  return el;
};

export const routes = createBrowserRouter([
  { path: '/', element: <Navigate to={rootRedirect()} replace /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/trocar-senha', element: guard(<ChangePasswordPage />) },
  { path: '/dashboard', element: guard(<DashboardPage />) },
  { path: '/admin-global', element: guard(<AdminDashboard />, true) },
  { path: '*', element: <Navigate to={rootRedirect()} replace /> },
]);
