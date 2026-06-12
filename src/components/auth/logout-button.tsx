'use client'

import { type CSSProperties } from 'react'
import { logout } from '@/actions/auth'

interface LogoutButtonProps {
  className?: string
  style?: CSSProperties
  children?: React.ReactNode
}

export default function LogoutButton({ className, style, children = 'Sair' }: LogoutButtonProps) {
  return (
    <form action={logout} style={{ display: 'contents' }}>
      <button type="submit" className={className} style={style}>
        {children}
      </button>
    </form>
  )
}
