import GlassCard from '@/components/shared/glass-card'
import SectionTitle from '@/components/shared/section-title'
import MemoryCard from '@/components/shared/memory-card'
import FloatingAction from '@/components/shared/floating-action'

const CATEGORIES = [
  { label: 'Todas',      active: true  },
  { label: '👨‍👩‍👧 Família', active: false },
  { label: '🌊 Praias',  active: false },
  { label: '🎓 Estudos', active: false },
  { label: '✝️ Fé',      active: false },
]

const MEMORIES = [
  { title: 'Viagem para Floripa',              date: 'Verão de 1998', category: 'praia'    as const, preview: 'Aquela semana inesquecível com a família na Praia de Jurerê. As crianças ainda eram pequenas...' },
  { title: 'Formatura de Medicina da Ana',     date: 'Dezembro de 2010', category: 'familia'  as const, preview: 'Que orgulho ver minha filha receber o diploma. Chorei muito naquele dia...' },
  { title: 'Minha graduação em Letras',        date: 'Dezembro de 1985', category: 'faculdade' as const, preview: 'Primeiro da família a se formar na universidade. Minha mãe chorou tanto...' },
  { title: 'Casamento de prata',               date: 'Setembro de 2003', category: 'familia'  as const, preview: 'Renovamos os votos em frente aos filhos e netos. Uma celebração linda...' },
  { title: 'Natal em família — 2022',          date: 'Dezembro de 2022', category: 'familia'  as const, preview: 'Toda a família reunida na casa da filha. Seis netos brincando no jardim...' },
  { title: 'Primeira vez no mar',              date: 'Verão de 1973', category: 'praia'    as const, preview: 'Tinha 12 anos quando fui ao litoral pela primeira vez. Assustei com as ondas...' },
]

export default function MemoriasPage() {
  return (
    <main className="mv-shell">
      <header className="mv-fade-in" style={{ padding: '8px 4px 4px' }}>
        <p className="mv-greeting">
          <i className="ti ti-photo-heart" aria-hidden="true" style={{ marginRight: 6 }} />
          Sua história
        </p>
        <h1 className="mv-title">Minhas memórias</h1>
        <p className="mv-subtitle">{MEMORIES.length} recordações guardadas</p>
      </header>

      <div className="mv-chips" style={{ marginTop: 'var(--mv-space-5)' }}>
        {CATEGORIES.map((cat) => (
          <button key={cat.label} type="button" className={`mv-chip${cat.active ? ' mv-chip--active' : ''}`}>
            {cat.label}
          </button>
        ))}
      </div>

      <GlassCard variant="hero" style={{ marginTop: 'var(--mv-space-3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--mv-space-3)' }}>
          <div className="mv-icon-blob mv-icon-blob--terracota" style={{ width: 52, height: 52, flexShrink: 0 }}>
            <i className="ti ti-book-2" aria-hidden="true" style={{ fontSize: 22 }} />
          </div>
          <div>
            <p style={{ margin: 0, fontWeight: 700, color: 'var(--mv-text-primary)' }}>Minha História</p>
            <p style={{ margin: '3px 0 0', fontSize: 'var(--mv-text-sm)', color: 'var(--mv-text-secondary)' }}>
              Narrativa da sua vida em capítulos
            </p>
          </div>
          <a href="/mais/historia" style={{ marginLeft: 'auto', fontSize: 'var(--mv-text-xs)', fontWeight: 700, color: 'var(--mv-terracota-deep)', textDecoration: 'none', flexShrink: 0 }}>
            Ver →
          </a>
        </div>
      </GlassCard>

      <SectionTitle title="Todas as memórias" action="Nova memória" />
      {MEMORIES.map((mem, i) => (
        <MemoryCard key={i} title={mem.title} date={mem.date} category={mem.category} preview={mem.preview} />
      ))}

      <FloatingAction variant="add" label="Nova memória" />
    </main>
  )
}
