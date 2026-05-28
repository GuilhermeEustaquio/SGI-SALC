import { Navigate, createBrowserRouter } from 'react-router-dom';
import AppLayout from '../components/Layout/AppLayout';
import ProtectedRoute from '../components/ProtectedRoute';
import RoleProtectedRoute from '../components/RoleProtectedRoute';
import AcessoNegadoPage from '../pages/AcessoNegado';
import AdminDashboard from '../pages/AdminGlobal/AdminDashboard';
import LogsPage from '../pages/AdminGlobal/Logs';
import UasgsPage from '../pages/AdminGlobal/Uasgs';
import UsuariosPage from '../pages/AdminGlobal/Usuarios';
import ChangePasswordPage from '../pages/ChangePassword/ChangePasswordPage';
import ChecklistArt72Page from '../pages/ChecklistArt72';
import ContratosPage from '../pages/Contratos';
import DashboardPage from '../pages/Dashboard/DashboardPage';
import LicitacoesPage from '../pages/Licitacoes';
import LoginPage from '../pages/Login/LoginPage';
import AquisicoesPage from '../pages/Aquisicoes';
import { authService } from '../services/authService';

const rootRedirect = () => {
  const isValid = authService.validateLocalSession();
  const session = authService.getSession();
  if (!isValid || !session) return '/login';
  if (session.deve_trocar_senha === true) return '/trocar-senha';
  if (session.is_super_admin === true || (session.perfis ?? []).includes('SUPER_ADMIN')) return '/admin-global';
  return '/dashboard';
};

export const routes = createBrowserRouter([
  { path: '/', element: <Navigate to={rootRedirect()} replace /> },
  { path: '/login', element: <LoginPage /> },
  {
    element: <ProtectedRoute />,
    children: [
      { path: '/trocar-senha', element: <ChangePasswordPage /> },
      {
        element: <AppLayout />,
        children: [
          { path: '/dashboard', element: <DashboardPage /> },
          { path: '/licitacoes', element: <LicitacoesPage /> },
          { path: '/aquisicoes', element: <AquisicoesPage /> },
          { path: '/contratos', element: <ContratosPage /> },
          { path: '/checklist-art72', element: <ChecklistArt72Page /> },
          {
            element: <RoleProtectedRoute />,
            children: [
              { path: '/admin-global', element: <AdminDashboard /> },
              { path: '/admin-global/uasgs', element: <UasgsPage /> },
              { path: '/admin-global/usuarios', element: <UsuariosPage /> },
              { path: '/admin-global/logs', element: <LogsPage /> },
            ],
          },
          { path: '/acesso-negado', element: <AcessoNegadoPage /> },
        ],
      },
    ],
  },
  { path: '*', element: <Navigate to={rootRedirect()} replace /> },
]);
