'use client'

import { useState, useActionState, startTransition, useEffect, useRef } from 'react'
import { atualizarPerfil } from '@/actions/perfil'

interface Props {
  nomeAtual: string
}

export default function EditarPerfilModal({ nomeAtual }: Props) {
  const [aberto, setAberto] = useState(false)
  const [nome, setNome]     = useState(nomeAtual)
  const inputRef            = useRef<HTMLInputElement>(null)

  const [state, dispatch, isPending] = useActionState(atualizarPerfil, null)

  // Fecha ao salvar com sucesso
  useEffect(() => {
    if (state && 'success' in state) setAberto(false)
  }, [state])

  // Foca o input ao abrir
  useEffect(() => {
    if (aberto) setTimeout(() => inputRef.current?.focus(), 50)
  }, [aberto])

  function abrir() {
    setNome(nomeAtual)
    setAberto(true)
  }

  function fechar() {
    if (!isPending) setAberto(false)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const fd = new FormData()
    fd.append('nome', nome)
    startTransition(() => dispatch(fd))
  }

  return (
    <>
      <button
        type="button"
        className="mv-btn mv-btn--ghost mv-btn--full"
        style={{ marginTop: 'var(--mv-space-4)' }}
        onClick={abrir}
      >
        <i className="ti ti-edit" aria-hidden="true" />
        Editar perfil
      </button>

      {aberto && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Editar perfil"
          onClick={(e) => { if (e.target === e.currentTarget) fechar() }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 200,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: 430,
              background: 'var(--mv-card)',
              borderRadius: '20px 20px 0 0',
              padding: '20px 20px calc(20px + env(safe-area-inset-bottom))',
              boxShadow: '0 -4px 32px rgba(0,0,0,0.18)',
              maxHeight: '80dvh',
              overflowY: 'auto',
            }}
          >
            {/* Handle */}
            <div style={{
              width: 36, height: 4, borderRadius: 2,
              background: 'var(--mv-border)',
              margin: '0 auto 20px',
            }} />

            <h2 style={{
              margin: '0 0 20px',
              fontSize: 'var(--mv-text-lg)',
              fontWeight: 700,
              color: 'var(--mv-text-primary)',
            }}>
              Editar perfil
            </h2>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label
                  htmlFor="perfil-nome"
                  style={{
                    display: 'block',
                    fontSize: 'var(--mv-text-xs)',
                    fontWeight: 700,
                    color: 'var(--mv-text-secondary)',
                    marginBottom: 6,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  Seu nome
                </label>
                <input
                  ref={inputRef}
                  id="perfil-nome"
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Como quer ser chamada?"
                  required
                  disabled={isPending}
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    padding: '13px 14px',
                    borderRadius: 'var(--mv-radius-md)',
                    border: '1.5px solid var(--mv-border)',
                    fontSize: 'var(--mv-text-md)',
                    fontFamily: 'inherit',
                    background: 'var(--mv-bg-secondary)',
                    color: 'var(--mv-text-primary)',
                    outline: 'none',
                  }}
                />
              </div>

              {state && 'error' in state && (
                <p style={{
                  margin: 0,
                  fontSize: 'var(--mv-text-sm)',
                  color: 'var(--mv-terracota-deep)',
                  fontWeight: 600,
                }}>
                  ⚠️ {state.error}
                </p>
              )}

              <div style={{ display: 'flex', gap: 12 }}>
                <button
                  type="button"
                  className="mv-btn mv-btn--ghost"
                  style={{ flex: 1 }}
                  onClick={fechar}
                  disabled={isPending}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="mv-btn mv-btn--primary"
                  style={{ flex: 2 }}
                  disabled={isPending || !nome.trim()}
                >
                  {isPending ? 'Salvando…' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
