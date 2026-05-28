import { SessionData } from '../../services/authService';

export default function Header({ session, onLogout, onToggleSidebar }: { session: SessionData; onLogout: () => void; onToggleSidebar: () => void }) {
  const perfilPrincipal = session.perfis?.[0] ?? 'SEM_PERFIL';
  const uasgAtual = session.uasg_atual?.codigo ?? 'MASTER';

  return (
    <header className='topbar'>
      <button className='menu-toggle' onClick={onToggleSidebar} aria-label='Alternar menu'>☰</button>
      <div className='topbar-info'>
        <strong>{session.nome}</strong>
        <span>UASG: {uasgAtual}</span>
        <span>Perfil: {perfilPrincipal}</span>
      </div>
      <button className='btn btn-danger' onClick={onLogout}>Sair</button>
    </header>
  );
}
