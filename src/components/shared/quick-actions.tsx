const ACTIONS = [
  { icon: 'heart-rate-monitor', label: 'Saúde',      color: 'salvia',    href: '/saude' },
  { icon: 'calendar',           label: 'Agenda',     color: 'azul',      href: '/agenda' },
  { icon: 'books',              label: 'Memórias',   color: 'terracota', href: '/memorias' },
  { icon: 'phone-call',         label: 'Emergência', color: 'ambar',     href: '/mais/emergencia' },
] as const

export default function QuickActions() {
  return (
    <div className="mv-quick-actions">
      {ACTIONS.map((action) => (
        <a key={action.label} href={action.href} className="mv-quick-action">
          <div className={`mv-icon-blob mv-icon-blob--${action.color}`}>
            <i className={`ti ti-${action.icon}`} aria-hidden="true" style={{ fontSize: 22 }} />
          </div>
          <span>{action.label}</span>
        </a>
      ))}
    </div>
  )
}
