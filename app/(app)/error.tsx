'use client'

import { useEffect } from 'react'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

function isDbSetupError(msg: string) {
  return msg.includes('relation') ||
         msg.includes('does not exist') ||
         msg.includes('permission denied') ||
         msg.includes('42P01') ||
         msg.includes('Failed to fetch')
}

export default function AppError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('[AppError]', error.message)
  }, [error])

  const isSetup = isDbSetupError(error.message ?? '')

  return (
    <main className="mv-shell" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '80dvh',
    }}>
      <div className="mv-fade-in" style={{ textAlign: 'center', maxWidth: 340, padding: 'var(--mv-space-5)' }}>
        <div style={{ fontSize: 56, marginBottom: 'var(--mv-space-4)' }}>
          {isSetup ? '🔧' : '😕'}
        </div>

        <h1 style={{ margin: '0 0 var(--mv-space-3)', fontSize: 'var(--mv-text-xl)', fontWeight: 700, color: 'var(--mv-text-primary)' }}>
          {isSetup ? 'Configuração pendente' : 'Algo deu errado'}
        </h1>

        {isSetup ? (
          <div className="mv-card" style={{ textAlign: 'left', marginBottom: 'var(--mv-space-5)' }}>
            <p style={{ margin: '0 0 var(--mv-space-3)', fontSize: 'var(--mv-text-sm)', color: 'var(--mv-text-secondary)', lineHeight: 1.6 }}>
              As tabelas do banco de dados ainda não foram criadas. Siga os passos:
            </p>
            <ol style={{ margin: 0, paddingLeft: 20, fontSize: 'var(--mv-text-sm)', color: 'var(--mv-text-secondary)', lineHeight: 2 }}>
              <li>Acesse <strong>supabase.com</strong> → seu projeto</li>
              <li>Vá em <strong>SQL Editor → New query</strong></li>
              <li>Cole o conteúdo de <code style={{ background: 'var(--mv-bg-secondary)', padding: '1px 5px', borderRadius: 4, fontSize: 12 }}>supabase/migrations/001_core_tables.sql</code></li>
              <li>Clique em <strong>Run</strong></li>
            </ol>
          </div>
        ) : (
          <p style={{ margin: '0 0 var(--mv-space-5)', fontSize: 'var(--mv-text-sm)', color: 'var(--mv-text-secondary)', lineHeight: 1.6 }}>
            Ocorreu um erro inesperado. Tente novamente ou volte para o início.
          </p>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--mv-space-3)' }}>
          <button
            type="button"
            onClick={reset}
            className="mv-btn mv-btn--primary mv-btn--full"
          >
            <i className="ti ti-refresh" aria-hidden="true" />
            Tentar novamente
          </button>
          <a href="/dashboard" className="mv-btn mv-btn--ghost mv-btn--full">
            <i className="ti ti-home-2" aria-hidden="true" />
            Ir para o início
          </a>
        </div>
      </div>
    </main>
  )
}
