'use client'

import { useState, useActionState, useEffect, useTransition } from 'react'
import { toast } from 'sonner'
import { editarEvento, deletarEvento } from '@/actions/agenda'
import type { AgendaEvento } from '@/lib/types/database'

const CATEGORIAS = [
  { value: 'medico',    label: '🔴 Médico',    cor: 'terracota', icone: 'stethoscope' },
  { value: 'psicologa', label: '🔵 Psicóloga', cor: 'azul',      icone: 'brain'       },
  { value: 'estudos',   label: '🟡 Estudos',   cor: 'ambar',     icone: 'book-2'      },
  { value: 'social',    label: '🟢 Social',    cor: 'salvia',    icone: 'users'       },
  { value: 'missa',     label: '🟣 Missa/Fé',  cor: 'ambar',     icone: 'heart'       },
  { value: 'outro',     label: '⚪ Outro',      cor: 'azul',      icone: 'calendar'   },
] as const

const BLOB_CLASS: Record<string, string> = {
  terracota: 'mv-icon-blob--terracota',
  azul:      'mv-icon-blob--azul',
  ambar:     'mv-icon-blob--ambar',
  salvia:    'mv-icon-blob--salvia',
}

const INPUT: React.CSSProperties = {
  padding: '10px 12px',
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

export default function EventoItem({ ev, separator }: { ev: AgendaEvento; separator: boolean }) {
  const [modo, setModo] = useState<'view' | 'edit' | 'delete'>('view')
  const [cat, setCat] = useState<Cat>(
    CATEGORIAS.find((c) => c.value === ev.categoria) ?? CATEGORIAS[5]
  )
  const editBound = editarEvento.bind(null, ev.id)
  const [state, formAction, pending] = useActionState(editBound, null)
  const [deletePending, startDelete] = useTransition()

  useEffect(() => {
    if (!state) return
    if ('success' in state) {
      toast.success('Compromisso atualizado! 📅')
      setModo('view')
    } else {
      toast.error(state.error)
    }
  }, [state])

  if (modo === 'edit') {
    return (
      <form action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--mv-space-3)', padding: 'var(--mv-space-2) 0' }}>
        <input type="hidden" name="categoria" value={cat.value} readOnly />
        <input type="hidden" name="cor"       value={cat.cor}   readOnly />
        <input type="hidden" name="icone"     value={cat.icone} readOnly />

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {CATEGORIAS.map((c) => (
            <button key={c.value} type="button" onClick={() => setCat(c)}
              className={`mv-chip${cat.value === c.value ? ' mv-chip--active' : ''}`}
              style={{ fontSize: 12 }}
            >
              {c.label}
            </button>
          ))}
        </div>

        <input required name="titulo" defaultValue={ev.titulo} placeholder="Título *" maxLength={80} style={INPUT} />
        <input name="detalhes" defaultValue={ev.detalhes ?? ''} placeholder="Local ou detalhes" style={INPUT} />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--mv-space-3)' }}>
          <div>
            <label style={{ fontSize: 'var(--mv-text-xs)', color: 'var(--mv-text-secondary)', display: 'block', marginBottom: 4 }}>Data *</label>
            <input required type="date" name="data" defaultValue={ev.data} style={INPUT} />
          </div>
          <div>
            <label style={{ fontSize: 'var(--mv-text-xs)', color: 'var(--mv-text-secondary)', display: 'block', marginBottom: 4 }}>Horário</label>
            <input type="time" name="hora" defaultValue={ev.hora ?? ''} style={INPUT} />
          </div>
        </div>

        {state && 'error' in state && (
          <p style={{ margin: 0, fontSize: 'var(--mv-text-xs)', color: '#C0392B' }}>{state.error}</p>
        )}

        <div style={{ display: 'flex', gap: 'var(--mv-space-3)' }}>
          <button type="button" onClick={() => setModo('view')} className="mv-btn mv-btn--ghost" style={{ flex: 1 }}>
            Cancelar
          </button>
          <button type="submit" disabled={pending} className="mv-btn mv-btn--primary" style={{ flex: 2 }}>
            {pending ? 'Salvando…' : 'Salvar'}
          </button>
        </div>
      </form>
    )
  }

  return (
    <div
      style={{
        display: 'flex', alignItems: 'center', gap: 'var(--mv-space-3)',
        paddingBottom: separator ? 'var(--mv-space-3)' : 0,
        marginBottom:  separator ? 'var(--mv-space-3)' : 0,
        borderBottom:  separator ? '1px solid var(--mv-border)' : 'none',
      }}
    >
      <span className="mv-agenda-time" style={{ minWidth: 42, flexShrink: 0 }}>
        {ev.hora ? ev.hora.slice(0, 5) : '—'}
      </span>
      <div className={`mv-icon-blob ${BLOB_CLASS[ev.cor] ?? 'mv-icon-blob--azul'}`} style={{ width: 42, height: 42, flexShrink: 0 }}>
        <i className={`ti ti-${ev.icone}`} aria-hidden="true" style={{ fontSize: 18 }} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="mv-agenda-label">{ev.titulo}</div>
        {ev.detalhes && (
          <div style={{ fontSize: 'var(--mv-text-xs)', color: 'var(--mv-text-secondary)', marginTop: 2 }}>{ev.detalhes}</div>
        )}
      </div>
      <button
        type="button"
        aria-label="Editar compromisso"
        onClick={() => setModo('edit')}
        style={{
          background: 'none', border: '1.5px solid var(--mv-border)', cursor: 'pointer',
          color: 'var(--mv-text-tertiary)', borderRadius: 10, width: 42, height: 42,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 17,
        }}
      >
        <i className="ti ti-pencil" aria-hidden="true" />
      </button>
      {modo === 'delete' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0, minWidth: 140 }}>
          <p style={{ margin: 0, fontSize: 'var(--mv-text-xs)', fontWeight: 600, color: '#B91C1C', textAlign: 'right' }}>
            Excluir este compromisso?
          </p>
          <div style={{ display: 'flex', gap: 6 }}>
            <button
              type="button"
              disabled={deletePending}
              onClick={() => startDelete(async () => { await deletarEvento(ev.id); toast.success('Removido') })}
              style={{ flex: 1, background: '#DC2626', color: 'white', border: 'none', cursor: 'pointer', padding: '10px 8px', borderRadius: 10, fontSize: 'var(--mv-text-sm)', fontWeight: 700, fontFamily: 'var(--mv-font)', minHeight: 44, opacity: deletePending ? 0.7 : 1 }}
            >
              {deletePending ? '…' : 'Sim'}
            </button>
            <button
              type="button"
              onClick={() => setModo('view')}
              style={{ flex: 1, background: 'var(--mv-card)', border: '1.5px solid var(--mv-border)', cursor: 'pointer', padding: '10px 8px', borderRadius: 10, fontSize: 'var(--mv-text-sm)', fontWeight: 600, fontFamily: 'var(--mv-font)', color: 'var(--mv-text-secondary)', minHeight: 44 }}
            >
              Não
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          aria-label="Excluir compromisso"
          onClick={() => setModo('delete')}
          style={{
            background: 'none', border: '1.5px solid var(--mv-border)', cursor: 'pointer',
            color: 'var(--mv-text-tertiary)', borderRadius: 10, width: 42, height: 42,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 17,
          }}
        >
          <i className="ti ti-trash" aria-hidden="true" />
        </button>
      )}
    </div>
  )
}
