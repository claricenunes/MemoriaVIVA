import GlassCard from '@/components/shared/glass-card'
import SectionTitle from '@/components/shared/section-title'
import MedicationCard from '@/components/shared/medication-card'
import FloatingAction from '@/components/shared/floating-action'

const MEDS_TODAY = [
  { name: 'Losartana',   dosage: '50mg • 1 comprimido', time: 'Tomado • 08:00',  status: 'tomado'   as const },
  { name: 'Vitamina D',  dosage: '2000 UI • 1 cápsula', time: 'Tomado • 08:00',  status: 'tomado'   as const },
  { name: 'Metformina',  dosage: '500mg • 1 comprimido', time: 'Próximo • 12:00', status: 'proximo'  as const },
  { name: 'Metformina',  dosage: '500mg • 1 comprimido', time: 'Pendente • 18:00', status: 'pendente' as const },
  { name: 'Cloridrato',  dosage: '25mg • 1 comprimido', time: 'Pendente • 22:00', status: 'pendente' as const },
]

const MEDS_LIST = [
  { name: 'Losartana 50mg',        freq: '1× ao dia', hours: '08:00', icon: 'pill', color: 'terracota', stock: 28 },
  { name: 'Metformina 500mg',      freq: '2× ao dia', hours: '12:00 / 18:00', icon: 'pill', color: 'azul', stock: 56 },
  { name: 'Vitamina D 2000 UI',    freq: '1× ao dia', hours: '08:00', icon: 'droplet', color: 'salvia', stock: 60 },
  { name: 'Cloridrato de Paroxetina', freq: '1× ao dia', hours: '22:00', icon: 'pill', color: 'ambar', stock: 20 },
]

const ICON_BLOB_CLASS: Record<string, string> = {
  terracota: 'mv-icon-blob--terracota',
  azul:      'mv-icon-blob--azul',
  salvia:    'mv-icon-blob--salvia',
  ambar:     'mv-icon-blob--ambar',
}

export default function MedicamentosPage() {
  return (
    <main className="mv-shell">
      <header className="mv-fade-in" style={{ padding: '8px 4px 4px' }}>
        <p className="mv-greeting">
          <i className="ti ti-pill" aria-hidden="true" style={{ marginRight: 6 }} />
          Seus remédios
        </p>
        <h1 className="mv-title">Medicamentos</h1>
        <p className="mv-subtitle">Sexta-feira, 12 de junho</p>
      </header>

      <GlassCard variant="hero" style={{ marginTop: 'var(--mv-space-5)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--mv-space-3)' }}>
          {[
            { n: 2, label: 'Tomados', color: 'var(--mv-salvia-deep)', bg: 'var(--mv-salvia-soft)' },
            { n: 1, label: 'Próximo',  color: 'var(--mv-azul-deep)',   bg: 'var(--mv-azul-soft)'   },
            { n: 2, label: 'Pendentes', color: 'var(--mv-ambar-deep)', bg: 'var(--mv-ambar-soft)'  },
          ].map(({ n, label, color, bg }) => (
            <div key={label} style={{ background: bg, borderRadius: 'var(--mv-radius-md)', padding: '12px 8px', textAlign: 'center' }}>
              <div style={{ fontSize: 'var(--mv-text-display)', fontWeight: 700, color, lineHeight: 1 }}>{n}</div>
              <div style={{ fontSize: 'var(--mv-text-xs)', color, marginTop: 4, fontWeight: 600 }}>{label}</div>
            </div>
          ))}
        </div>
        <div style={{ background: 'rgba(0,0,0,0.04)', borderRadius: 'var(--mv-radius-md)', padding: '10px 14px', marginTop: 'var(--mv-space-3)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <i className="ti ti-clock" aria-hidden="true" style={{ color: 'var(--mv-text-tertiary)', flexShrink: 0 }} />
          <span style={{ fontSize: 'var(--mv-text-sm)', color: 'var(--mv-text-secondary)' }}>Próximo: <strong style={{ color: 'var(--mv-text-primary)' }}>Metformina às 12:00</strong></span>
        </div>
      </GlassCard>

      <SectionTitle title="Hoje" />
      {MEDS_TODAY.map((med, i) => (
        <MedicationCard key={i} name={med.name} dosage={med.dosage} time={med.time} status={med.status} />
      ))}

      <SectionTitle title="Todos os meus remédios" />
      <GlassCard>
        {MEDS_LIST.map((med) => (
          <div key={med.name} className="mv-agenda-item" style={{ paddingBottom: 'var(--mv-space-3)', marginBottom: 'var(--mv-space-3)', borderBottom: '1px solid var(--mv-border)' }}>
            <div className={`mv-icon-blob ${ICON_BLOB_CLASS[med.color] ?? 'mv-icon-blob--azul'}`} style={{ width: 44, height: 44 }}>
              <i className={`ti ti-${med.icon}`} aria-hidden="true" style={{ fontSize: 18 }} />
            </div>
            <div style={{ flex: 1 }}>
              <div className="mv-agenda-label">{med.name}</div>
              <div style={{ fontSize: 'var(--mv-text-xs)', color: 'var(--mv-text-secondary)', marginTop: 2 }}>
                {med.freq} • {med.hours}
              </div>
              <div style={{ fontSize: 'var(--mv-text-xs)', color: med.stock <= 14 ? 'var(--mv-ambar-deep)' : 'var(--mv-text-tertiary)', marginTop: 2 }}>
                {med.stock <= 14 ? `⚠️ Estoque baixo — ${med.stock} comprimidos` : `Estoque: ${med.stock} comprimidos`}
              </div>
            </div>
            <button type="button" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: 'var(--mv-text-tertiary)' }}>
              <i className="ti ti-dots-vertical" aria-hidden="true" style={{ fontSize: 18 }} />
            </button>
          </div>
        ))}
        <button type="button" className="mv-btn mv-btn--ghost mv-btn--full" style={{ marginTop: 'var(--mv-space-2)' }}>
          <i className="ti ti-plus" aria-hidden="true" />
          Adicionar remédio
        </button>
      </GlassCard>

      <FloatingAction variant="add" label="Novo remédio" />
    </main>
  )
}
