import { ReactNode } from 'react'

interface PageShellProps {
  children: ReactNode
  className?: string
}

export default function PageShell({ children, className = '' }: PageShellProps) {
  return (
    <main className={`mv-shell ${className}`}>
      {children}
    </main>
  )
}
