type IconColor = 'terracota' | 'salvia' | 'ambar' | 'azul'

interface PageHeaderProps {
  icon: string
  color?: IconColor
  title: string
  subtitle?: string
}

export default function PageHeader({ icon, color = 'terracota', title, subtitle }: PageHeaderProps) {
  return (
    <header
      className="mv-fade-in"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: '8px 4px',
        marginBottom: 'var(--mv-space-5)',
      }}
    >
      <div
        className={`mv-icon-blob mv-icon-blob--${color}`}
        style={{ width: 54, height: 54, borderRadius: 18, flexShrink: 0 }}
      >
        <i className={`ti ti-${icon}`} aria-hidden="true" style={{ fontSize: 26 }} />
      </div>
      <div>
        <h1
          style={{
            margin: 0,
            fontSize: 'var(--mv-text-xl)',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
            color: 'var(--mv-text-primary)',
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            style={{
              margin: '4px 0 0',
              fontSize: 'var(--mv-text-sm)',
              color: 'var(--mv-text-secondary)',
              fontWeight: 500,
              lineHeight: 1.3,
            }}
          >
            {subtitle}
          </p>
        )}
      </div>
    </header>
  )
}
