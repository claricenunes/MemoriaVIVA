'use client'

import { useState, useActionState, useEffect } from 'react'
import { toast } from 'sonner'
import { adicionarMemoria } from '@/actions/memorias'

const CATEGORIAS = [
  { value: 'familia',   label: '👨‍👩‍👧 Família' },
  { value: 'praia',     label: '🌊 Praias'  },
  { value: 'faculdade', label: '🎓 Estudos' },
  { value: 'fe',        label: '✝️ Fé'      },
  { value: 'outro',     label: '✨ Outro'   },
]

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

export default function NovaMemoriaForm() {
  const [open, setOpen] = useState(false)
  const [categoria, setCategoria] = useState('familia')
  const [state, formAction, pending] = useActionState(adicionarMemoria, null)

  useEffect(() => {
    if (!state) return
    if ('success' in state) {
      toast.success('Memória guardada! 💕')
      setOpen(false)
    } else {
      toast.error(state.error)
    }
  }, [state])

  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)}
        className="mv-btn mv-btn--ghost mv-btn--full"
        style={{ marginTop: 'var(--mv-space-2)' }}
      >
        <i className="ti ti-plus" aria-hidden="true" /> Adicionar memória
      </button>
    )
  }

  return (
    <form action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--mv-space-3)' }}>
      <input type="hidden" name="categoria" value={categoria} readOnly />

      <div>
        <p style={{ margin: '0 0 var(--mv-space-2)', fontSize: 'var(--mv-text-sm)', fontWeight: 600, color: 'var(--mv-text-primary)' }}>
          Categoria
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--mv-space-2)' }}>
          {CATEGORIAS.map((cat) => (
            <button key={cat.value} type="button" onClick={() => setCategoria(cat.value)}
              className={`mv-chip${categoria === cat.value ? ' mv-chip--active' : ''}`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <input required name="titulo" placeholder="Título da memória *" maxLength={100} style={INPUT} />

      <input required name="data_memoria" placeholder="Quando foi? Ex: Verão de 1998 *" maxLength={60} style={INPUT} />

      <textarea
        required
        name="conteudo"
        placeholder="Conte essa história… *"
        rows={4}
        style={{ ...INPUT, resize: 'vertical', lineHeight: 1.6 }}
      />

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
          {pending ? 'Salvando…' : 'Guardar memória'}
        </button>
      </div>
    </form>
  )
}
