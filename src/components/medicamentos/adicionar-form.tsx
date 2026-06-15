'use client'

import { useActionState, useState, useEffect } from 'react'
import { toast } from 'sonner'
import { adicionarMedicamento } from '@/actions/medicamentos'

const INPUT_STYLE = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: 'var(--mv-radius-md)',
  border: '2px solid var(--mv-border)',
  fontSize: 'var(--mv-text-sm)',
  fontFamily: 'var(--mv-font)',
  background: 'var(--mv-bg-secondary)',
  color: 'var(--mv-text-primary)',
  outline: 'none',
  boxSizing: 'border-box' as const,
  marginTop: 6,
}

const LABEL_STYLE = {
  display: 'block' as const,
  fontSize: 'var(--mv-text-xs)',
  fontWeight: 600 as const,
  color: 'var(--mv-text-secondary)',
  marginTop: 'var(--mv-space-3)',
}

export default function AdicionarMedForm() {
  const [open, setOpen]             = useState(false)
  const [state, formAction, pending] = useActionState(adicionarMedicamento, null)

  useEffect(() => {
    if (!state) return
    if ('success' in state) {
      toast.success('Remédio adicionado!')
      setOpen(false)
    } else {
      toast.error(state.error)
    }
  }, [state])

  if (!open) {
    return (
      <button
        type="button"
        className="mv-btn mv-btn--ghost mv-btn--full"
        onClick={() => setOpen(true)}
        style={{ marginTop: 'var(--mv-space-2)' }}
      >
        <i className="ti ti-plus" aria-hidden="true" />
        Adicionar remédio
      </button>
    )
  }

  return (
    <div style={{ marginTop: 'var(--mv-space-4)', paddingTop: 'var(--mv-space-4)', borderTop: '1px solid var(--mv-border)' }}>
      <p style={{ margin: '0 0 var(--mv-space-3)', fontSize: 'var(--mv-text-sm)', fontWeight: 700, color: 'var(--mv-text-primary)' }}>
        Novo remédio
      </p>

      {state && 'error' in state && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', borderRadius: 'var(--mv-radius-md)', background: 'var(--mv-terracota-soft)', color: 'var(--mv-terracota-deep)', fontSize: 'var(--mv-text-sm)', fontWeight: 600, marginBottom: 'var(--mv-space-3)' }}>
          <i className="ti ti-alert-circle" aria-hidden="true" />
          {state.error}
        </div>
      )}

      <form action={formAction}>
        <label style={LABEL_STYLE}>Nome do remédio *</label>
        <input name="nome" required placeholder="Losartana" style={INPUT_STYLE} />

        <label style={LABEL_STYLE}>Dosagem *</label>
        <input name="dosagem" required placeholder="50mg • 1 comprimido" style={INPUT_STYLE} />

        <label style={LABEL_STYLE}>Frequência *</label>
        <input name="frequencia" required placeholder="1× ao dia" style={INPUT_STYLE} />

        <label style={LABEL_STYLE}>Horários (separados por vírgula) *</label>
        <input name="horarios" required placeholder="08:00, 18:00" style={INPUT_STYLE} />

        <label style={LABEL_STYLE}>Estoque (comprimidos)</label>
        <input name="estoque" type="number" min="0" defaultValue="0" style={INPUT_STYLE} />

        <div style={{ display: 'flex', gap: 'var(--mv-space-3)', marginTop: 'var(--mv-space-4)' }}>
          <button type="button" className="mv-btn mv-btn--ghost" style={{ flex: 1 }} onClick={() => setOpen(false)}>
            Cancelar
          </button>
          <button type="submit" disabled={pending} className="mv-btn mv-btn--primary" style={{ flex: 2, opacity: pending ? 0.7 : 1 }}>
            {pending ? 'Salvando...' : 'Salvar remédio'}
          </button>
        </div>
      </form>
    </div>
  )
}
