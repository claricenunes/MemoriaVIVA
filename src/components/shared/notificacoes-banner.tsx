'use client'

import { useEffect, useState } from 'react'

type Estado = 'loading' | 'idle' | 'concedido' | 'negado' | 'indisponivel'

function urlBase64ToUint8Array(base64: string): ArrayBuffer {
  const padded = base64.replace(/-/g, '+').replace(/_/g, '/')
  const raw = atob(padded.padEnd(padded.length + (4 - (padded.length % 4)) % 4, '='))
  const buf = new ArrayBuffer(raw.length)
  const view = new Uint8Array(buf)
  for (let i = 0; i < raw.length; i++) view[i] = raw.charCodeAt(i)
  return buf
}

export default function NotificacoesBanner() {
  const [estado, setEstado] = useState<Estado>('loading')
  const [salvando, setSalvando] = useState(false)

  useEffect(() => {
    if (!('Notification' in window) || !('serviceWorker' in navigator)) {
      setEstado('indisponivel')
      return
    }
    if (Notification.permission === 'granted') setEstado('concedido')
    else if (Notification.permission === 'denied') setEstado('negado')
    else setEstado('idle')
  }, [])

  async function ativar() {
    if (!('Notification' in window)) return
    setSalvando(true)

    try {
      const perm = await Notification.requestPermission()
      if (perm !== 'granted') { setEstado('negado'); setSalvando(false); return }

      const reg = await navigator.serviceWorker.ready
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly:      true,
        applicationServerKey: urlBase64ToUint8Array(
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
        ),
      })

      await fetch('/api/push/subscribe', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ subscription: sub.toJSON() }),
      })

      setEstado('concedido')
    } catch (e) {
      console.error('[push] ativar:', e)
    } finally {
      setSalvando(false)
    }
  }

  if (estado === 'loading' || estado === 'indisponivel' || estado === 'concedido') return null

  if (estado === 'negado') {
    return (
      <div style={{
        display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 'var(--mv-space-4)',
        padding: '12px 14px', borderRadius: 'var(--mv-radius-md)',
        background: 'var(--mv-ambar-soft)', border: '1.5px solid var(--mv-ambar)',
      }}>
        <i className="ti ti-bell-off" aria-hidden="true" style={{ color: 'var(--mv-ambar-deep)', fontSize: 18, flexShrink: 0, marginTop: 1 }} />
        <p style={{ margin: 0, fontSize: 'var(--mv-text-xs)', color: 'var(--mv-ambar-deep)', lineHeight: 1.5 }}>
          Notificações bloqueadas. Para receber lembretes dos remédios, ative nas configurações do seu navegador.
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
          Notificação 15 min antes do horário
        </p>
      </div>
      <button
        type="button"
        onClick={ativar}
        disabled={salvando}
        className="mv-btn mv-btn--primary"
        style={{ padding: '7px 14px', fontSize: 'var(--mv-text-xs)', flexShrink: 0, opacity: salvando ? 0.7 : 1 }}
      >
        {salvando ? '...' : 'Ativar'}
      </button>
    </div>
  )
}
