'use client'

import { usePathname } from 'next/navigation'
import FloatingAction from './floating-action'

const HIDE_ON = ['/mais/assistente']

export default function FloatingActionGuard() {
  const pathname = usePathname()
  if (HIDE_ON.some((p) => pathname.startsWith(p))) return null
  return <FloatingAction variant="pill" label="Precisa de ajuda?" />
}
