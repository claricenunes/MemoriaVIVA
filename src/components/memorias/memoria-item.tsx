'use client'

import { useState, useActionState, useEffect, useTransition } from 'react'
import { toast } from 'sonner'
import { editarMemoria, deletarMemoria } from '@/actions/memorias'
import MemoryCard from '@/components/shared/memory-card'
import type { Memoria } from '@/lib/types/database'

const CATEGORIAS = [
  { value: 'familia',   label: '👨‍👩‍👧 Família' },
  { value: 'praia',     label: '🌊 Praias'  },
  { value: 'faculdade', label: '🎓 Estudos' },
  { value: 'fe',        label: '✝️ Fé'      },
  { value: 'outro',     label: '✨ Outro'   },
]

const INPUT: React.CSSProperties = {
  padding: '10px 14px',
  borderRadius: 'var(--mv-radius-md)',
  border: '1.5px solid var(--mv-border)',
  fontSize: 'var(--mv-text-sm)',
  background: 'var(--mv-bg-secondary)',
  fontFamily: 'inherit',
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
}

export default function MemoriaItem({ mem }: { mem: Memoria }) {
  const [modo, setModo] = useState<'view' | 'edit' | 'delete'>('view')
  const [categoria, setCategoria] = useState<Memoria['categoria']>(mem.categoria)
  const editBound = editarMemoria.bind(null, mem.id)
  const [state, formAction, pending] = useActionState(editBound, null)
  const [deletePending, startDelete] = useTransition()

  useEffect(() => {
    if (!state) return
    if ('success' in state) {
      toast.success('Memória atualizada! 💕')
      setModo('view')
    } else {
      toast.error(state.error)
    }
  }, [state])

  if (modo === 'edit') {
    return (
      <div style={{ background: 'var(--mv-card)', border: '1.5px solid var(--mv-border)', borderRadius: 'var(--mv-radius-lg)', padding: 'var(--mv-space-5)', marginBottom: 'var(--mv-space-3)' }}>
        <p style={{ margin: '0 0 var(--mv-space-3)', fontWeight: 700, fontSize: 'var(--mv-text-sm)', color: 'var(--mv-text-primary)' }}>
          Editar memória
        </p>
        <form action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--mv-space-3)' }}>
          <input type="hidden" name="categoria" value={categoria} readOnly />

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {CATEGORIAS.map((cat) => (
              <button key={cat.value} type="button" onClick={() => setCategoria(cat.value as Memoria['categoria'])}
                className={`mv-chip${categoria === cat.value ? ' mv-chip--active' : ''}`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <input required name="titulo" defaultValue={mem.titulo} placeholder="Título *" maxLength={100} style={INPUT} />
          <input required name="data_memoria" defaultValue={mem.data_memoria} placeholder="Quando foi? *" maxLength={60} style={INPUT} />
          <textarea
            required
            name="conteudo"
            defaultValue={mem.conteudo}
            placeholder="Conte essa história… *"
            rows={4}
            style={{ ...INPUT, resize: 'vertical', lineHeight: 1.6 }}
          />

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
      </div>
    )
  }

  return (
    <div style={{ position: 'relative', marginBottom: 'var(--mv-space-3)' }}>
      <MemoryCard
        title={mem.titulo}
        date={mem.data_memoria}
        category={mem.categoria}
        preview={mem.conteudo}
      />
      <div style={{ position: 'absolute', top: 12, right: 56, display: 'flex', gap: 6 }}>
        <button
          type="button"
          aria-label="Editar memória"
          onClick={() => setModo('edit')}
          style={{
            background: 'rgba(255,255,255,0.9)',
            border: '1.5px solid var(--mv-border)',
            cursor: 'pointer',
            color: 'var(--mv-text-tertiary)',
            borderRadius: 10,
            width: 40, height: 40,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 17,
            backdropFilter: 'blur(4px)',
          }}
        >
          <i className="ti ti-pencil" aria-hidden="true" />
        </button>
      </div>
      <div style={{ position: 'absolute', top: 12, right: 12 }}>
        {modo === 'delete' ? (
          <div style={{ background: 'var(--mv-card)', border: '1.5px solid var(--mv-border)', borderRadius: 14, padding: 12, boxShadow: 'var(--mv-shadow-float)', minWidth: 180, position: 'relative', zIndex: 10 }}>
            <p style={{ margin: '0 0 10px', fontSize: 'var(--mv-text-xs)', fontWeight: 700, color: '#B91C1C', lineHeight: 1.4 }}>
              Excluir esta memória?
            </p>
            <button
              type="button"
              disabled={deletePending}
              onClick={() => startDelete(async () => { await deletarMemoria(mem.id); toast.success('Memória removida') })}
              style={{ display: 'block', width: '100%', background: '#DC2626', color: 'white', border: 'none', cursor: 'pointer', padding: '10px', borderRadius: 10, fontSize: 'var(--mv-text-sm)', fontWeight: 700, fontFamily: 'var(--mv-font)', minHeight: 46, marginBottom: 6, opacity: deletePending ? 0.7 : 1 }}
            >
              {deletePending ? 'Excluindo…' : 'Sim, excluir'}
            </button>
            <button
              type="button"
              onClick={() => setModo('view')}
              style={{ display: 'block', width: '100%', background: 'transparent', border: '1.5px solid var(--mv-border)', cursor: 'pointer', padding: '10px', borderRadius: 10, fontSize: 'var(--mv-text-sm)', fontWeight: 600, fontFamily: 'var(--mv-font)', color: 'var(--mv-text-secondary)', minHeight: 46 }}
            >
              Não, manter
            </button>
          </div>
        ) : (
          <button
            type="button"
            aria-label="Excluir memória"
            onClick={() => setModo('delete')}
            style={{
              background: 'rgba(255,255,255,0.9)',
              border: '1.5px solid var(--mv-border)',
              cursor: 'pointer',
              color: 'var(--mv-text-tertiary)',
              borderRadius: 10,
              width: 40, height: 40,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 17,
              backdropFilter: 'blur(4px)',
            }}
          >
            <i className="ti ti-trash" aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  )
}
