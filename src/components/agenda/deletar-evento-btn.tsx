'use client'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { deletarEvento } from '@/actions/agenda'

export default function DeletarEventoBtn({ eventoId }: { eventoId: string }) {
  const [confirmar, setConfirmar] = useState(false)
  const [pending, start] = useTransition()

  if (!confirmar) {
    return (
      <button
        type="button"
        aria-label="Excluir compromisso"
        title="Excluir compromisso"
        onClick={() => setConfirmar(true)}
        style={{
          background: 'none',
          border: '1.5px solid var(--mv-border)',
          cursor: 'pointer',
          color: 'var(--mv-text-tertiary)',
          borderRadius: 10,
          width: 42,
          height: 42,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          fontSize: 18,
          transition: 'border-color 0.15s, color 0.15s',
        }}
      >
        <i className="ti ti-trash" aria-hidden="true" />
      </button>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0, minWidth: 160 }}>
      <p style={{ margin: 0, fontSize: 'var(--mv-text-xs)', fontWeight: 600, color: '#B91C1C', textAlign: 'right' }}>
        Excluir este compromisso?
      </p>
      <div style={{ display: 'flex', gap: 6 }}>
        <button
          type="button"
          disabled={pending}
          onClick={() =>
            start(async () => {
              await deletarEvento(eventoId)
              toast.success('Compromisso removido')
            })
          }
          style={{
            flex: 1,
            background: '#DC2626',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            padding: '10px 12px',
            borderRadius: 10,
            fontSize: 'var(--mv-text-sm)',
            fontWeight: 700,
            fontFamily: 'var(--mv-font)',
            minHeight: 48,
            opacity: pending ? 0.7 : 1,
          }}
        >
          {pending ? '…' : 'Sim, excluir'}
        </button>
        <button
          type="button"
          onClick={() => setConfirmar(false)}
          style={{
            flex: 1,
            background: 'var(--mv-card)',
            border: '1.5px solid var(--mv-border)',
            cursor: 'pointer',
            padding: '10px 12px',
            borderRadius: 10,
            fontSize: 'var(--mv-text-sm)',
            fontWeight: 600,
            fontFamily: 'var(--mv-font)',
            color: 'var(--mv-text-secondary)',
            minHeight: 48,
          }}
        >
          Manter
        </button>
      </div>
    </div>
  )
}
