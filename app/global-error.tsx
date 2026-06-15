'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[GlobalError]', error.message)
  }, [error])

  return (
    <html lang="pt-BR">
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif', background: '#FAF7F5', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100dvh' }}>
        <div style={{ textAlign: 'center', padding: 32, maxWidth: 320 }}>
          <div style={{ fontSize: 52, marginBottom: 16 }}>🌸</div>
          <h1 style={{ margin: '0 0 12px', fontSize: 22, fontWeight: 700, color: '#2C2416' }}>
            Memória Viva
          </h1>
          <p style={{ margin: '0 0 24px', fontSize: 15, color: '#7A6A5A', lineHeight: 1.6 }}>
            Algo inesperado aconteceu. Recarregue a página para continuar.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{ padding: '12px 24px', background: '#D98E73', color: 'white', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: 'pointer' }}
          >
            Recarregar
          </button>
          <br />
          <a href="/" style={{ display: 'inline-block', marginTop: 12, fontSize: 14, color: '#7A6A5A' }}>
            Voltar ao início
          </a>
        </div>
      </body>
    </html>
  )
}
