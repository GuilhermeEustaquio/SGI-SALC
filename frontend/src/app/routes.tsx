import { Navigate, createBrowserRouter } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import RoleProtectedRoute from '../components/RoleProtectedRoute';
import AdminDashboard from '../pages/AdminGlobal/AdminDashboard';
import ChangePasswordPage from '../pages/ChangePassword/ChangePasswordPage';
import DashboardPage from '../pages/Dashboard/DashboardPage';
import LoginPage from '../pages/Login/LoginPage';
import { authService } from '../services/authService';

const rootRedirect = () => {
  const token = authService.getToken();
  const s = authService.getSession();
  if (!token || !s) return '/login';
  if (s.deve_trocar_senha === true) return '/trocar-senha';
  if (s.is_super_admin === true || (Array.isArray(s.perfis) && s.perfis.includes('SUPER_ADMIN'))) return '/admin-global';
  return '/dashboard';
};

export const routes = createBrowserRouter([
  { path: '/', element: <Navigate to={rootRedirect()} replace /> },
  { path: '/login', element: <LoginPage /> },
  {
    element: <ProtectedRoute />,
    children: [
      { path: '/trocar-senha', element: <ChangePasswordPage /> },
      { path: '/dashboard', element: <DashboardPage /> },
      {
        element: <RoleProtectedRoute />,
        children: [{ path: '/admin-global', element: <AdminDashboard /> }],
      },
    ],
  },
  { path: '*', element: <Navigate to={rootRedirect()} replace /> },
]);
