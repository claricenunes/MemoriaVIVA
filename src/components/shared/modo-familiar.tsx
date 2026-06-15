'use client'

import { useState } from 'react'

export default function ModoFamiliar() {
  const [email, setEmail] = useState('')
  const [enviado, setEnviado] = useState(false)

  function compartilhar() {
    if (!email.trim()) return
    setEnviado(true)
  }

  if (enviado) {
    return (
      <div style={{
        padding: 'var(--mv-space-4)', borderRadius: 'var(--mv-radius-md)',
        background: 'var(--mv-salvia-soft)', border: '1.5px solid var(--mv-salvia)',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: 36, marginBottom: 8 }}>💚</div>
        <p style={{ margin: '0 0 4px', fontWeight: 700, color: 'var(--mv-salvia-deep)', fontSize: 'var(--mv-text-sm)' }}>
          Convite enviado!
        </p>
        <p style={{ margin: 0, fontSize: 'var(--mv-text-xs)', color: 'var(--mv-salvia-deep)', lineHeight: 1.5 }}>
          {email} poderá acompanhar seus dados de saúde.
        </p>
        <p style={{ margin: '8px 0 0', fontSize: 11, color: 'var(--mv-salvia-deep)', opacity: 0.7 }}>
          Esta funcionalidade estará disponível em breve.
        </p>
      </div>
    )
  }

  return (
    <div>
      <p style={{ margin: '0 0 var(--mv-space-3)', fontSize: 'var(--mv-text-sm)', color: 'var(--mv-text-secondary)', lineHeight: 1.6 }}>
        Permita que um familiar ou cuidador acompanhe sua saúde — apenas para visualização, sem poder editar nada.
      </p>
      <div style={{ display: 'flex', gap: 'var(--mv-space-3)', alignItems: 'center' }}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email@familiar.com"
          style={{
            flex: 1, border: '1.5px solid var(--mv-border)', borderRadius: 12,
            padding: '10px 14px', fontFamily: 'var(--mv-font)', fontSize: 'var(--mv-text-sm)',
            background: 'transparent', color: 'var(--mv-text-primary)', outline: 'none', minWidth: 0,
          }}
        />
        <button
          type="button"
          onClick={compartilhar}
          className="mv-btn mv-btn--primary"
          style={{ flexShrink: 0, padding: '10px 14px', fontSize: 'var(--mv-text-sm)' }}
        >
          Convidar
        </button>
      </div>
      <p style={{ margin: '8px 0 0', fontSize: 11, color: 'var(--mv-text-tertiary)', lineHeight: 1.5 }}>
        🔒 Eles só verão. Você sempre poderá revogar o acesso.
      </p>
    </div>
  )
}
