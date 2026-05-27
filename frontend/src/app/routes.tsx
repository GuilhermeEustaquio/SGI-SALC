import { Navigate, createBrowserRouter } from 'react-router-dom';
import AdminDashboard from '../pages/AdminGlobal/AdminDashboard';
import ChangePasswordPage from '../pages/ChangePassword/ChangePasswordPage';
import DashboardPage from '../pages/Dashboard/DashboardPage';
import LoginPage from '../pages/Login/LoginPage';

const guard = (el: JSX.Element, superOnly = false) => {
  const token = localStorage.getItem('token'); const session = JSON.parse(localStorage.getItem('session') || 'null');
  if (!token) return <Navigate to='/login' replace />;
  if (superOnly && !session?.is_super_admin) return <Navigate to='/dashboard' replace />;
  return el;
};

export const routes = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  { path: '/trocar-senha', element: guard(<ChangePasswordPage />) },
  { path: '/dashboard', element: guard(<DashboardPage />) },
  { path: '/admin-global', element: guard(<AdminDashboard />, true) },
  { path: '*', element: <Navigate to='/login' replace /> },
]);
