'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'

type Contato = { id: string; nome: string; telefone: string; relacao: string }

const OVERLAY: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  zIndex: 200,
  background: 'rgba(44, 35, 26, 0.6)',
  backdropFilter: 'blur(4px)',
  display: 'flex',
  alignItems: 'flex-end',
  justifyContent: 'center',
}

const SHEET: React.CSSProperties = {
  background: 'var(--mv-card)',
  borderRadius: '28px 28px 0 0',
  padding: '28px 24px calc(32px + env(safe-area-inset-bottom))',
  maxWidth: 430,
  width: '100%',
  animation: 'mv-slide-up 0.25s ease both',
}

const CALL_BTN: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 16,
  width: '100%',
  padding: '16px 18px',
  borderRadius: 'var(--mv-radius-md)',
  border: '1.5px solid var(--mv-border)',
  background: 'var(--mv-bg-secondary)',
  cursor: 'pointer',
  fontFamily: 'var(--mv-font)',
  textDecoration: 'none',
  color: 'var(--mv-text-primary)',
  marginBottom: 10,
  minHeight: 70,
}

export default function AjudaModal({ onClose }: { onClose: () => void }) {
  const [contato, setContato] = useState<Contato | null>(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem('mv-emergencia')
      if (raw) {
        const dados = JSON.parse(raw)
        if (dados.contatos?.length > 0) setContato(dados.contatos[0])
      }
    } catch { /* sem contato salvo */ }
  }, [])

  const opcoes = [
    ...(contato ? [{
      label: contato.nome,
      sub: contato.relacao || 'Contato de emergência',
      tel: contato.telefone.replace(/\D/g, ''),
      icon: 'ti-phone-call',
      color: 'var(--mv-terracota-deep)',
      bg: 'var(--mv-terracota-soft)',
      border: 'var(--mv-terracota)',
    }] : []),
    {
      label: 'Polícia',
      sub: '190',
      tel: '190',
      icon: 'ti-shield',
      color: 'var(--mv-azul-deep)',
      bg: 'var(--mv-azul-soft)',
      border: 'var(--mv-azul-suave)',
    },
    {
      label: 'Ambulância (SAMU)',
      sub: '192',
      tel: '192',
      icon: 'ti-ambulance',
      color: 'var(--mv-salvia-deep)',
      bg: 'var(--mv-salvia-soft)',
      border: 'var(--mv-salvia)',
    },
  ]

  const conteudo = (
    <div style={OVERLAY} onClick={onClose}>
      <div style={SHEET} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <p style={{ margin: 0, fontSize: 'var(--mv-text-lg)', fontWeight: 700, color: 'var(--mv-text-primary)' }}>
              Precisa de ajuda?
            </p>
            <p style={{ margin: '2px 0 0', fontSize: 'var(--mv-text-xs)', color: 'var(--mv-text-secondary)' }}>
              Toque para ligar
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            style={{
              background: 'var(--mv-bg-secondary)', border: '1.5px solid var(--mv-border)',
              borderRadius: 12, width: 40, height: 40, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--mv-text-tertiary)', fontSize: 20,
            }}
          >
            <i className="ti ti-x" aria-hidden="true" />
          </button>
        </div>

        {opcoes.map((op) => (
          <a
            key={op.tel + op.label}
            href={`tel:${op.tel}`}
            style={{ ...CALL_BTN, borderColor: op.border }}
          >
            <div style={{
              width: 52, height: 52, borderRadius: 16, flexShrink: 0,
              background: op.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <i className={`ti ${op.icon}`} aria-hidden="true" style={{ fontSize: 24, color: op.color }} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 'var(--mv-text-md)', color: 'var(--mv-text-primary)' }}>
                {op.label}
              </div>
              <div style={{ fontSize: 'var(--mv-text-sm)', color: 'var(--mv-text-secondary)', marginTop: 2 }}>
                {op.sub}
              </div>
            </div>
            <i className="ti ti-phone" aria-hidden="true" style={{ marginLeft: 'auto', fontSize: 20, color: op.color, flexShrink: 0 }} />
          </a>
        ))}

        {!contato && (
          <p style={{ margin: '4px 0 0', fontSize: 'var(--mv-text-xs)', color: 'var(--mv-text-tertiary)', textAlign: 'center', lineHeight: 1.5 }}>
            Adicione um contato de emergência em{' '}
            <a href="/mais/emergencia" style={{ color: 'var(--mv-terracota-deep)', fontWeight: 600, textDecoration: 'none' }}>
              Emergência
            </a>
          </p>
        )}
      </div>
    </div>
  )

  return createPortal(conteudo, document.body)
}
