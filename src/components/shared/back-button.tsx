import Link from 'next/link'

interface BackButtonProps {
  href: string
  label?: string
}

export default function BackButton({ href, label = 'Voltar' }: BackButtonProps) {
  return (
    <Link
      href={href}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '10px 16px 10px 12px',
        background: 'var(--mv-card)',
        border: '1.5px solid var(--mv-border)',
        borderRadius: 'var(--mv-radius-md)',
        color: 'var(--mv-text-secondary)',
        fontSize: 'var(--mv-text-sm)',
        fontWeight: 600,
        textDecoration: 'none',
        marginBottom: 'var(--mv-space-5)',
        minHeight: 48,
        boxShadow: 'var(--mv-shadow-soft)',
      }}
    >
      <i className="ti ti-arrow-left" aria-hidden="true" style={{ fontSize: 20 }} />
      {label}
    </Link>
  )
}
