export default function ModulePlaceholder({ title, description }: { title: string; description: string }) {
  return (
    <section>
      <h1>{title}</h1>
      <p className='muted'>{description}</p>
      <div className='card page-card'>
        <h3>Módulo em construção</h3>
        <p className='muted'>Funcionalidade será implementada na próxima etapa.</p>
      </div>
    </section>
  );
}
