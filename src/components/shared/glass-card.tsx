import { CSSProperties, ReactNode } from 'react'

interface GlassCardProps {
  children: ReactNode
  variant?: 'default' | 'hero' | 'flat'
  className?: string
  style?: CSSProperties
}

export default function GlassCard({ children, variant = 'default', className = '', style }: GlassCardProps) {
  const variantClass =
    variant === 'hero' ? 'mv-card mv-card--hero' :
    variant === 'flat' ? 'mv-card mv-card--flat' :
    'mv-card'

  return (
    <div className={`${variantClass} mv-fade-in ${className}`} style={style}>
      {children}
    </div>
  )
}
