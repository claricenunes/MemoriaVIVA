'use client'

import { useState, useTransition } from 'react'
import { excluirMedicamento } from '@/actions/medicamentos'

export default function ExcluirMedButton({ id, nome }: { id: string; nome: string }) {
  const [confirmando, setConfirmando] = useState(false)
  const [isPending, startTransition]  = useTransition()

  if (!confirmando) {
    return (
      <button
        type="button"
        onClick={() => setConfirmando(true)}
        aria-label={`Excluir ${nome}`}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'var(--mv-text-tertiary)', padding: '6px',
          borderRadius: 'var(--mv-radius-sm)', fontSize: 16,
          flexShrink: 0,
        }}
      >
        <i className="ti ti-trash" aria-hidden="true" />
      </button>
    )
  }

  return (
    <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
      <button
        type="button"
        onClick={() => setConfirmando(false)}
        disabled={isPending}
        style={{
          fontSize: 11, fontWeight: 600, padding: '4px 10px',
          borderRadius: 'var(--mv-radius-sm)', border: '1.5px solid var(--mv-border)',
          background: 'none', cursor: 'pointer', color: 'var(--mv-text-secondary)',
        }}
      >
        Não
      </button>
      <button
        type="button"
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            await excluirMedicamento(id)
          })
        }
        style={{
          fontSize: 11, fontWeight: 700, padding: '4px 10px',
          borderRadius: 'var(--mv-radius-sm)', border: 'none',
          background: 'var(--mv-terracota)', color: '#fff',
          cursor: 'pointer', opacity: isPending ? 0.6 : 1,
        }}
      >
        {isPending ? '…' : 'Excluir'}
      </button>
    </div>
  )
}
