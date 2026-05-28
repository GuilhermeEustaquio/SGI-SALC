import { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { authService } from '../../services/authService';
import Header from './Header';
import Sidebar from './Sidebar';

export default function AppLayout() {
  const session = authService.getSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!session) return <Navigate to='/login' replace />;

  return (
    <div className='app-shell'>
      <Sidebar session={session} open={sidebarOpen} onNavigate={() => setSidebarOpen(false)} />
      <div className='app-main'>
        <Header session={session} onLogout={authService.logout} onToggleSidebar={() => setSidebarOpen((s) => !s)} />
        <main className='content'>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
