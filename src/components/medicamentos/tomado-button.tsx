'use client'

import { useTransition } from 'react'
import { toast } from 'sonner'
import { marcarTomado } from '@/actions/medicamentos'

interface TomadoButtonProps {
  medicamentoId: string
  horario: string
}

export default function TomadoButton({ medicamentoId, horario }: TomadoButtonProps) {
  const [pending, startTransition] = useTransition()

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          try {
            await marcarTomado(medicamentoId, horario)
            toast.success('Remédio marcado! ✓')
          } catch {
            toast.error('Erro ao marcar o remédio')
          }
        })
      }
      className="mv-btn mv-btn--primary"
      style={{ padding: '6px 14px', fontSize: 'var(--mv-text-xs)', flexShrink: 0, opacity: pending ? 0.7 : 1 }}
    >
      {pending ? '...' : 'Marcar tomado'}
    </button>
  )
}
