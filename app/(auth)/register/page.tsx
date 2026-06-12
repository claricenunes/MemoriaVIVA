'use client'

import { useActionState } from 'react'
import { register } from '@/actions/auth'

const INPUT_STYLE = {
  width: '100%',
  padding: '12px 14px',
  borderRadius: 'var(--mv-radius-md)',
  border: '2px solid var(--mv-border)',
  fontSize: 'var(--mv-text-md)',
  fontFamily: 'var(--mv-font)',
  background: 'var(--mv-bg-secondary)',
  color: 'var(--mv-text-primary)',
  outline: 'none',
  boxSizing: 'border-box' as const,
  transition: 'border-color 0.15s',
}

export default function RegisterPage() {
  const [state, formAction, pending] = useActionState(register, null)

  return (
    <main style={{
      minHeight: '100dvh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'var(--mv-space-5)',
      background: 'var(--mv-bg)',
    }}>
      <div className="mv-fade-in" style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--mv-space-6)' }}>
          <div style={{
            width: 72, height: 72, borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--mv-salvia-soft), var(--mv-azul-soft))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 32, margin: '0 auto var(--mv-space-3)',
            boxShadow: 'var(--mv-shadow-md)',
          }}>
            🌱
          </div>
          <h1 style={{ margin: 0, fontSize: 'var(--mv-text-xl)', fontWeight: 700, color: 'var(--mv-text-primary)' }}>
            Criar conta
          </h1>
          <p style={{ margin: '6px 0 0', fontSize: 'var(--mv-text-sm)', color: 'var(--mv-text-secondary)' }}>
            Comece sua jornada no Memória Viva
          </p>
        </div>

        <div className="mv-card">
          <form action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--mv-space-4)' }}>
            {state?.error && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px',
                borderRadius: 'var(--mv-radius-md)', background: 'var(--mv-terracota-soft)',
                color: 'var(--mv-terracota-deep)', fontSize: 'var(--mv-text-sm)', fontWeight: 600,
              }}>
                <i className="ti ti-alert-circle" aria-hidden="true" style={{ fontSize: 18, flexShrink: 0 }} />
                <span>{state.error}</span>
              </div>
            )}

            <div>
              <label style={{
                display: 'block', fontSize: 'var(--mv-text-sm)', fontWeight: 600,
                color: 'var(--mv-text-secondary)', marginBottom: 6,
              }}>
                Seu nome
              </label>
              <input
                name="nome"
                type="text"
                autoComplete="name"
                required
                placeholder="Maria das Graças"
                style={INPUT_STYLE}
              />
            </div>

            <div>
              <label style={{
                display: 'block', fontSize: 'var(--mv-text-sm)', fontWeight: 600,
                color: 'var(--mv-text-secondary)', marginBottom: 6,
              }}>
                E-mail
              </label>
              <input
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="seu@email.com"
                style={INPUT_STYLE}
              />
            </div>

            <div>
              <label style={{
                display: 'block', fontSize: 'var(--mv-text-sm)', fontWeight: 600,
                color: 'var(--mv-text-secondary)', marginBottom: 6,
              }}>
                Senha <span style={{ fontWeight: 400, color: 'var(--mv-text-tertiary)' }}>(mínimo 6 caracteres)</span>
              </label>
              <input
                name="password"
                type="password"
                autoComplete="new-password"
                required
                minLength={6}
                placeholder="••••••••"
                style={INPUT_STYLE}
              />
            </div>

            <button
              type="submit"
              disabled={pending}
              className="mv-btn mv-btn--primary mv-btn--full"
              style={{ marginTop: 'var(--mv-space-2)', opacity: pending ? 0.7 : 1 }}
            >
              {pending
                ? <><i className="ti ti-loader-2" aria-hidden="true" style={{ animation: 'spin 1s linear infinite' }} /> Criando conta...</>
                : <><i className="ti ti-user-plus" aria-hidden="true" /> Criar conta</>
              }
            </button>
          </form>

          <div style={{
            textAlign: 'center', marginTop: 'var(--mv-space-5)',
            paddingTop: 'var(--mv-space-4)', borderTop: '1px solid var(--mv-border)',
          }}>
            <p style={{ margin: 0, fontSize: 'var(--mv-text-sm)', color: 'var(--mv-text-secondary)' }}>
              Já tem conta?{' '}
              <a href="/login" style={{ color: 'var(--mv-terracota-deep)', fontWeight: 700, textDecoration: 'none' }}>
                Entrar
              </a>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
