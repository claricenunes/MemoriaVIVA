import GlassCard from './glass-card'

interface EventCardProps {
  icon: string
  title: string
  when: string
}

export default function EventCard({ icon, title, when }: EventCardProps) {
  return (
    <GlassCard>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--mv-space-4)' }}>
        <div className="mv-icon-blob mv-icon-blob--azul">
          <i className={`ti ti-${icon}`} aria-hidden="true" style={{ fontSize: 24 }} />
        </div>
        <div>
          <p className="mv-greeting">{when}</p>
          <p style={{ margin: '2px 0 0', fontSize: 'var(--mv-text-md)', fontWeight: 600 }}>
            {title}
          </p>
        </div>
      </div>
    </GlassCard>
  )
}
