interface MemoryCardProps {
  title: string
  date: string
  category: 'praia' | 'familia' | 'faculdade'
  preview?: string
}

const CATEGORY_CONFIG = {
  praia:     { icon: 'ti-waves',   label: 'Praia',    color: 'azul'      },
  familia:   { icon: 'ti-users',   label: 'Família',  color: 'terracota' },
  faculdade: { icon: 'ti-book-2',  label: 'Estudos',  color: 'salvia'    },
} as const

const ICON_BLOB_CLASS = {
  azul:      'mv-icon-blob--azul',
  terracota: 'mv-icon-blob--terracota',
  salvia:    'mv-icon-blob--salvia',
}

export default function MemoryCard({ title, date, category, preview }: MemoryCardProps) {
  const config = CATEGORY_CONFIG[category]
  return (
    <div className="mv-card mv-fade-in" style={{ marginBottom: 'var(--mv-space-3)' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--mv-space-3)' }}>
        <div className={`mv-icon-blob ${ICON_BLOB_CLASS[config.color]}`} style={{ width: 44, height: 44, flexShrink: 0 }}>
          <i className={`ti ${config.icon}`} aria-hidden="true" style={{ fontSize: 18 }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, color: 'var(--mv-text-primary)', marginBottom: 2 }}>{title}</div>
          <div style={{ fontSize: 'var(--mv-text-xs)', color: 'var(--mv-text-tertiary)', marginBottom: preview ? 6 : 0 }}>
            📅 {date} · {config.label}
          </div>
          {preview && (
            <p style={{ margin: 0, fontSize: 'var(--mv-text-sm)', color: 'var(--mv-text-secondary)', lineHeight: 1.55, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {preview}
            </p>
          )}
        </div>
        <i className="ti ti-chevron-right" aria-hidden="true" style={{ color: 'var(--mv-text-tertiary)', fontSize: 16, flexShrink: 0, marginTop: 4 }} />
      </div>
    </div>
  )
}
