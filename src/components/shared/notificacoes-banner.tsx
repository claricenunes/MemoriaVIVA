'use client'

import { useEffect, useState } from 'react'

type Estado = 'idle' | 'concedido' | 'negado' | 'indisponivel'

export default function NotificacoesBanner() {
  const [estado, setEstado] = useState<Estado>('indisponivel')

  useEffect(() => {
    if (!('Notification' in window)) {
      setEstado('indisponivel')
      return
    }
    if (Notification.permission === 'granted') setEstado('concedido')
    else if (Notification.permission === 'denied') setEstado('negado')
    else setEstado('idle')
  }, [])

  async function ativar() {
    if (!('Notification' in window)) return
    const perm = await Notification.requestPermission()
    if (perm === 'granted') {
      setEstado('concedido')
      new Notification('Memória Viva', {
        body: 'Você vai receber lembretes dos seus remédios! 💊',
        icon: '/icons/icon-192.png',
      })
    } else {
      setEstado('negado')
    }
  }

  if (estado === 'indisponivel' || estado === 'concedido') return null

  if (estado === 'negado') {
    return (
      <div style={{
        display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 'var(--mv-space-4)',
        padding: '12px 14px', borderRadius: 'var(--mv-radius-md)',
        background: 'var(--mv-ambar-soft)', border: '1.5px solid var(--mv-ambar)',
      }}>
        <i className="ti ti-bell-off" aria-hidden="true" style={{ color: 'var(--mv-ambar-deep)', fontSize: 18, flexShrink: 0, marginTop: 1 }} />
        <p style={{ margin: 0, fontSize: 'var(--mv-text-xs)', color: 'var(--mv-ambar-deep)', lineHeight: 1.5 }}>
          Notificações bloqueadas. Para receber lembretes dos remédios, ative nas configurações do navegador.
        </p>
      </div>
    )
  }

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12, marginBottom: 'var(--mv-space-4)',
      padding: '14px 16px', borderRadius: 'var(--mv-radius-md)',
      background: 'var(--mv-azul-soft)', border: '1.5px solid var(--mv-azul)',
    }}>
      <i className="ti ti-bell" aria-hidden="true" style={{ color: 'var(--mv-azul-deep)', fontSize: 20, flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <p style={{ margin: '0 0 2px', fontWeight: 700, fontSize: 'var(--mv-text-sm)', color: 'var(--mv-azul-deep)' }}>
          Ativar lembretes de remédios
        </p>
        <p style={{ margin: 0, fontSize: 'var(--mv-text-xs)', color: 'var(--mv-azul-deep)', lineHeight: 1.4 }}>
          Receba notificações no horário certo
        </p>
      </div>
      <button
        type="button"
        onClick={ativar}
        className="mv-btn mv-btn--primary"
        style={{ padding: '7px 14px', fontSize: 'var(--mv-text-xs)', flexShrink: 0 }}
      >
        Ativar
      </button>
    </div>
  )
}
