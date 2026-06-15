export function SkeletonLine({ w = '100%', h = 16 }: { w?: string | number; h?: number }) {
  return <div className="mv-skeleton" style={{ width: w, height: h }} />
}

export function SkeletonCard({ rows = 3, blob = false }: { rows?: number; blob?: boolean }) {
  return (
    <div style={{
      background: 'var(--mv-card)',
      borderRadius: 'var(--mv-radius-lg)',
      padding: '16px 20px',
      border: '1px solid var(--mv-border)',
      display: 'flex',
      gap: 12,
      boxShadow: 'var(--mv-shadow-card)',
      marginBottom: 12,
    }}>
      {blob && (
        <div className="mv-skeleton" style={{ width: 46, height: 46, borderRadius: 14, flexShrink: 0 }} />
      )}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {Array.from({ length: rows }, (_, i) => (
          <SkeletonLine key={i} w={i === 0 ? '60%' : i === rows - 1 ? '35%' : '90%'} />
        ))}
      </div>
    </div>
  )
}

export function SkeletonPage() {
  return (
    <main className="mv-shell">
      <div style={{ padding: '8px 4px 4px', marginBottom: 20 }}>
        <div className="mv-skeleton" style={{ width: 110, height: 13, borderRadius: 6, marginBottom: 10 }} />
        <div className="mv-skeleton" style={{ width: 190, height: 26, borderRadius: 8, marginBottom: 8 }} />
        <div className="mv-skeleton" style={{ width: 150, height: 13, borderRadius: 6 }} />
      </div>
      <SkeletonCard rows={3} />
      <SkeletonCard rows={3} blob />
      <SkeletonCard rows={2} blob />
    </main>
  )
}
