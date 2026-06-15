'use client'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { deletarMemoria } from '@/actions/memorias'

export default function DeletarMemoriaBtn({ memoriaId }: { memoriaId: string }) {
  const [confirmar, setConfirmar] = useState(false)
  const [pending, start] = useTransition()

  if (!confirmar) {
    return (
      <button
        type="button"
        aria-label="Excluir memória"
        title="Excluir memória"
        onClick={() => setConfirmar(true)}
        style={{
          background: 'rgba(255,255,255,0.9)',
          border: '1.5px solid var(--mv-border)',
          cursor: 'pointer',
          color: 'var(--mv-text-tertiary)',
          borderRadius: 10,
          width: 40,
          height: 40,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 17,
          backdropFilter: 'blur(4px)',
          transition: 'border-color 0.15s, color 0.15s',
        }}
      >
        <i className="ti ti-trash" aria-hidden="true" />
      </button>
    )
  }

  return (
    <div style={{
      background: 'var(--mv-card)',
      border: '1.5px solid var(--mv-border)',
      borderRadius: 14,
      padding: 12,
      boxShadow: 'var(--mv-shadow-float)',
      minWidth: 180,
      position: 'relative',
      zIndex: 10,
    }}>
      <p style={{ margin: '0 0 10px', fontSize: 'var(--mv-text-xs)', fontWeight: 700, color: '#B91C1C', lineHeight: 1.4 }}>
        Excluir esta memória para sempre?
      </p>
      <button
        type="button"
        disabled={pending}
        onClick={() =>
          start(async () => {
            await deletarMemoria(memoriaId)
            toast.success('Memória removida')
          })
        }
        style={{
          display: 'block',
          width: '100%',
          background: '#DC2626',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          padding: '10px',
          borderRadius: 10,
          fontSize: 'var(--mv-text-sm)',
          fontWeight: 700,
          fontFamily: 'var(--mv-font)',
          minHeight: 46,
          marginBottom: 6,
          opacity: pending ? 0.7 : 1,
        }}
      >
        {pending ? 'Excluindo…' : 'Sim, excluir'}
      </button>
      <button
        type="button"
        onClick={() => setConfirmar(false)}
        style={{
          display: 'block',
          width: '100%',
          background: 'transparent',
          border: '1.5px solid var(--mv-border)',
          cursor: 'pointer',
          padding: '10px',
          borderRadius: 10,
          fontSize: 'var(--mv-text-sm)',
          fontWeight: 600,
          fontFamily: 'var(--mv-font)',
          color: 'var(--mv-text-secondary)',
          minHeight: 46,
        }}
      >
        Não, manter
      </button>
    </div>
  )
}
