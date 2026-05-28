import { Link } from 'react-router-dom';

const cards = [
  { title: 'Total de UASGs', value: '0' },
  { title: 'Total de usuários', value: '0' },
  { title: 'Usuários ativos', value: '0' },
  { title: 'Usuários bloqueados', value: '0' },
  { title: 'Últimos logs', value: '0' },
];

export default function AdminDashboard() {
  return (
    <section>
      <h1>Admin Global</h1>
      <p className='muted'>Painel inicial do SUPER_ADMIN.</p>
      <div className='stats-grid'>
        {cards.map((card) => (
          <div key={card.title} className='card stat-card'>
            <span className='muted'>{card.title}</span>
            <strong>{card.value}</strong>
          </div>
        ))}
      </div>
      <div className='card page-card'>
        <h3>Atalhos</h3>
        <div className='actions'>
          <Link className='btn' to='/admin-global/uasgs'>Nova UASG</Link>
          <Link className='btn' to='/admin-global/usuarios'>Novo Usuário</Link>
          <Link className='btn' to='/admin-global/logs'>Ver Logs</Link>
        </div>
        <p className='muted'>Funcionalidades completas serão implementadas na próxima etapa.</p>
      </div>
    </section>
  );
}
