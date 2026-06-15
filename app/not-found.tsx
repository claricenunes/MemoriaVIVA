export default function NotFound() {
  return (
    <main className="mv-shell" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '80dvh',
    }}>
      <div className="mv-fade-in" style={{ textAlign: 'center', maxWidth: 300, padding: 'var(--mv-space-5)' }}>
        <div style={{ fontSize: 56, marginBottom: 'var(--mv-space-4)' }}>🗺️</div>
        <h1 style={{ margin: '0 0 var(--mv-space-3)', fontSize: 'var(--mv-text-xl)', fontWeight: 700, color: 'var(--mv-text-primary)' }}>
          Página não encontrada
        </h1>
        <p style={{ margin: '0 0 var(--mv-space-5)', fontSize: 'var(--mv-text-sm)', color: 'var(--mv-text-secondary)', lineHeight: 1.6 }}>
          Esse endereço não existe. Que tal voltar para o início?
        </p>
        <a href="/dashboard" className="mv-btn mv-btn--primary mv-btn--full">
          <i className="ti ti-home-2" aria-hidden="true" />
          Ir para o início
        </a>
      </div>
    </main>
  )
}
