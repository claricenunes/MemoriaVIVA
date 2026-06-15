'use client'

import { useEffect, useState } from 'react'

interface HeroCardProps {
  name: string
}

function getGreeting(hour: number): { text: string; emoji: string } {
  if (hour < 12) return { text: 'Bom dia',  emoji: '☀️' }
  if (hour < 18) return { text: 'Boa tarde', emoji: '🌤️' }
  return              { text: 'Boa noite', emoji: '🌙' }
}

function formatDate(): string {
  const d = new Date()
  return d.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })
}

export default function HeroCard({ name }: HeroCardProps) {
  const [greeting, setGreeting] = useState<{ text: string; emoji: string } | null>(null)
  const [date, setDate] = useState<string | null>(null)

  useEffect(() => {
    setGreeting(getGreeting(new Date().getHours()))
    setDate(formatDate())
  }, [])

  const initial = name.charAt(0).toUpperCase()

  return (
    <div
      className="mv-fade-in"
      style={{
        background: 'linear-gradient(135deg, #C4614A 0%, #D4914A 100%)',
        borderRadius: 'var(--mv-radius-lg)',
        padding: '22px 22px 22px',
        color: '#FFFFFF',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 10px 36px rgba(142, 58, 34, 0.30)',
        marginBottom: 'var(--mv-space-5)',
      }}
    >
      {/* blobs decorativos de profundidade */}
      <div style={{ position: 'absolute', top: -36, right: -24, width: 130, height: 130, borderRadius: '50%', background: 'rgba(255,255,255,0.09)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -18, left: -14, width: 88, height: 88, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', pointerEvents: 'none' }} />

      <div style={{ position: 'relative' }}>
        {/* avatar no canto superior direito */}
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: 52,
          height: 52,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.18)',
          border: '2px solid rgba(255,255,255,0.42)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 20,
          fontWeight: 800,
          color: '#FFFFFF',
          fontFamily: 'var(--mv-font)',
          flexShrink: 0,
        }}>
          {initial}
        </div>

        {/* texto com padding para nao colidir com o avatar */}
        <div style={{ paddingRight: 64 }}>

          {/* "Bom dia," pequeno, acima do nome */}
          <p style={{
            margin: 0,
            fontSize: 'var(--mv-text-md)',
            fontWeight: 600,
            color: 'rgba(255,255,255,0.85)',
            lineHeight: 1.2,
          }}>
            {greeting ? greeting.emoji + ' ' + greeting.text + ',' : ' '}
          </p>

          {/* nome - elemento hero */}
          <h1 style={{
            margin: '4px 0 0',
            fontSize: 'var(--mv-text-display)',
            fontWeight: 800,
            letterSpacing: '-0.025em',
            lineHeight: 1.05,
            color: '#FFFFFF',
          }}>
            {name}!
          </h1>

          {/* data como frase natural */}
          <p style={{
            margin: '12px 0 0',
            fontSize: 'var(--mv-text-sm)',
            color: 'rgba(255,255,255,0.75)',
            fontWeight: 500,
            lineHeight: 1.4,
          }}>
            {date ? 'Hoje é ' + date : ' '}
          </p>
        </div>
      </div>
    </div>
  )
}
