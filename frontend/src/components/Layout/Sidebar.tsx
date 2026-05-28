import { NavLink } from 'react-router-dom';
import { SessionData } from '../../services/authService';

type Item = { to: string; label: string };

const menuByRole = (session: SessionData): Item[] => {
  if (session.is_super_admin || session.perfis.includes('SUPER_ADMIN')) {
    return [
      { to: '/admin-global', label: 'Admin Global' },
      { to: '/dashboard', label: 'Dashboard' },
      { to: '/admin-global/uasgs', label: 'UASGs' },
      { to: '/admin-global/usuarios', label: 'Usuários' },
      { to: '/admin-global/logs', label: 'Logs' },
      { to: '/licitacoes', label: 'Licitações' },
      { to: '/aquisicoes', label: 'Aquisições' },
      { to: '/contratos', label: 'Contratos' },
      { to: '/checklist-art72', label: 'Checklist Art. 72' },
    ];
  }
  return [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/licitacoes', label: 'Licitações' },
    { to: '/aquisicoes', label: 'Aquisições' },
    { to: '/contratos', label: 'Contratos' },
    { to: '/checklist-art72', label: 'Checklist Art. 72' },
  ];
};

export default function Sidebar({ session, open, onNavigate }: { session: SessionData; open: boolean; onNavigate: () => void }) {
  const menu = menuByRole(session);
  return (
    <aside className={`sidebar ${open ? 'open' : ''}`}>
      <div className='sidebar-brand'>SGI-SALC</div>
      <nav className='sidebar-nav'>
        {menu.map((item) => (
          <NavLink key={item.to} to={item.to} onClick={onNavigate} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
