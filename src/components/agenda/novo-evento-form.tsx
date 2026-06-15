'use client'

import { useState, useActionState, useEffect } from 'react'
import { toast } from 'sonner'
import { adicionarEvento } from '@/actions/agenda'

const CATEGORIAS = [
  { value: 'medico',    label: '🔴 Médico',    cor: 'terracota', icone: 'stethoscope' },
  { value: 'psicologa', label: '🔵 Psicóloga', cor: 'azul',      icone: 'brain'       },
  { value: 'estudos',   label: '🟡 Estudos',   cor: 'ambar',     icone: 'book-2'      },
  { value: 'social',    label: '🟢 Social',    cor: 'salvia',    icone: 'users'       },
  { value: 'missa',     label: '🟣 Missa/Fé',  cor: 'ambar',     icone: 'heart'       },
  { value: 'outro',     label: '⚪ Outro',      cor: 'azul',      icone: 'calendar'   },
] as const

const INPUT: React.CSSProperties = {
  padding: '11px 14px',
  borderRadius: 'var(--mv-radius-md)',
  border: '1.5px solid var(--mv-border)',
  fontSize: 'var(--mv-text-sm)',
  background: 'var(--mv-bg-secondary)',
  fontFamily: 'inherit',
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
}

type Cat = typeof CATEGORIAS[number]

export default function NovoEventoForm() {
  const [open, setOpen] = useState(false)
  const [cat, setCat] = useState<Cat>(CATEGORIAS[0])
  const [state, formAction, pending] = useActionState(adicionarEvento, null)

  useEffect(() => {
    if (!state) return
    if ('success' in state) {
      toast.success('Compromisso salvo! 📅')
      setOpen(false)
    } else {
      toast.error(state.error)
    }
  }, [state])

  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)}
        className="mv-btn mv-btn--ghost mv-btn--full"
        style={{ marginTop: 'var(--mv-space-4)' }}
      >
        <i className="ti ti-plus" aria-hidden="true" /> Novo compromisso
      </button>
    )
  }

  return (
    <form action={formAction} style={{ marginTop: 'var(--mv-space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--mv-space-3)' }}>
      {/* Valores hidden controlados por state */}
      <input type="hidden" name="categoria" value={cat.value}  readOnly />
      <input type="hidden" name="cor"       value={cat.cor}    readOnly />
      <input type="hidden" name="icone"     value={cat.icone}  readOnly />

      <div>
        <p style={{ margin: '0 0 var(--mv-space-2)', fontSize: 'var(--mv-text-sm)', fontWeight: 600, color: 'var(--mv-text-primary)' }}>
          Tipo de compromisso
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--mv-space-2)' }}>
          {CATEGORIAS.map((c) => (
            <button key={c.value} type="button" onClick={() => setCat(c)}
              className={`mv-chip${cat.value === c.value ? ' mv-chip--active' : ''}`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <input required name="titulo" placeholder="Título *" maxLength={80} style={INPUT} />
      <input name="detalhes" placeholder="Local ou detalhes (opcional)" style={INPUT} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--mv-space-3)' }}>
        <div>
          <label style={{ fontSize: 'var(--mv-text-xs)', color: 'var(--mv-text-secondary)', display: 'block', marginBottom: 4 }}>
            Data *
          </label>
          <input required type="date" name="data"
            defaultValue={new Date().toISOString().split('T')[0]}
            style={INPUT}
          />
        </div>
        <div>
          <label style={{ fontSize: 'var(--mv-text-xs)', color: 'var(--mv-text-secondary)', display: 'block', marginBottom: 4 }}>
            Horário
          </label>
          <input type="time" name="hora" style={INPUT} />
        </div>
      </div>

      {state && 'error' in state && (
        <p style={{ margin: 0, fontSize: 'var(--mv-text-xs)', color: '#C0392B' }}>
          {state.error}
        </p>
      )}

      <div style={{ display: 'flex', gap: 'var(--mv-space-3)' }}>
        <button type="button" onClick={() => setOpen(false)}
          className="mv-btn mv-btn--ghost" style={{ flex: 1 }}
        >
          Cancelar
        </button>
        <button type="submit" disabled={pending}
          className="mv-btn mv-btn--primary" style={{ flex: 2 }}
        >
          {pending ? 'Salvando…' : 'Salvar compromisso'}
        </button>
      </div>
    </form>
  )
}
