'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const ITEMS = [
  { key: 'dashboard', icon: 'home-2',    label: 'Início', href: '/dashboard' },
  { key: 'agenda',    icon: 'calendar',  label: 'Agenda', href: '/agenda' },
  { key: 'saude',     icon: 'heart',     label: 'Saúde',  href: '/saude' },
  { key: 'mais',      icon: 'grid-dots', label: 'Mais',   href: '/mais' },
] as const

const MAIS_PATHS = [
  '/mais', '/medicamentos', '/memorias', '/financeiro',
  '/noticias', '/exercicios', '/perfil',
  '/mais/historia', '/mais/onde-guardei', '/mais/quem-e-quem',
  '/mais/feito-hoje', '/mais/emergencia', '/mais/assistente',
  '/mais/lista-de-compras',
]

function isActive(href: string, pathname: string): boolean {
  if (href === '/dashboard') return pathname === '/dashboard'
  if (href === '/mais') return MAIS_PATHS.some((p) => pathname.startsWith(p))
  return pathname.startsWith(href)
}

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="mv-bottom-nav" aria-label="Navegação principal">
      {ITEMS.map((item) => {
        const active = isActive(item.href, pathname)
        return (
          <Link
            key={item.key}
            href={item.href}
            className={`mv-nav-item${active ? ' mv-nav-item--active' : ''}`}
            aria-current={active ? 'page' : undefined}
          >
            <i className={`ti ti-${item.icon}`} aria-hidden="true" />
            <span>{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
