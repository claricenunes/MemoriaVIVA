'use client'
import { useState, useEffect, useCallback } from 'react'
import GlassCard from '@/components/shared/glass-card'
import PageHeader from '@/components/shared/page-header'
import BackButton from '@/components/shared/back-button'

const EMOJIS = ['⭐', '🎯', '💪', '🌟', '✅', '🏆', '🎉', '🌸', '💚', '🌺']
const CONFETTI = ['🎉', '⭐', '🌟', '✨', '🎊', '💛', '🌸', '💪']

function getHoje() {
  return new Date().toISOString().split('T')[0]
}

function formatarData(iso: string) {
  const d = new Date(iso + 'T12:00:00')
  const s = d.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })
  return s.charAt(0).toUpperCase() + s.slice(1)
}

type Particle = { id: number; emoji: string; x: number; delay: number }

export default function FeitoHojePage() {
  const [wins, setWins]       = useState<string[]>([])
  const [input, setInput]     = useState('')
  const [pronto, setPronto]   = useState(false)
  const [particles, setParticles] = useState<Particle[]>([])
  const hoje = getHoje()

  useEffect(() => {
    try {
      const saved = localStorage.getItem(`mv-feito-${hoje}`)
      if (saved) setWins(JSON.parse(saved))
    } catch { /* ignore */ }
    setPronto(true)
  }, [hoje])

  function salvar(next: string[]) {
    setWins(next)
    localStorage.setItem(`mv-feito-${hoje}`, JSON.stringify(next))
  }

  function burst() {
    const ps: Particle[] = Array.from({ length: 10 }, (_, i) => ({
      id: Date.now() + i,
      emoji: CONFETTI[i % CONFETTI.length],
      x: 10 + Math.random() * 80,
      delay: i * 60,
    }))
    setParticles(ps)
    setTimeout(() => setParticles([]), 1400)
  }

  function add() {
    const texto = input.trim()
    if (!texto) return
    salvar([...wins, texto])
    setInput('')
    burst()
  }

  function remove(i: number) {
    salvar(wins.filter((_, idx) => idx !== i))
  }

  if (!pronto) return null

  const heroEmoji = wins.length >= 5 ? '🏆' : wins.length >= 3 ? '🎉' : wins.length > 0 ? '⭐' : '🌟'
  const heroMsg =
    wins.length === 0 ? 'Nenhuma conquista ainda' :
    wins.length === 1 ? '1 conquista hoje!' :
    `${wins.length} conquistas hoje!`

  return (
    <main className="mv-shell" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Confetti particles */}
      {particles.map((p) => (
        <span
          key={p.id}
          aria-hidden="true"
          style={{
            position: 'fixed',
            left: p.x + '%',
            bottom: '120px',
            fontSize: 24,
            pointerEvents: 'none',
            zIndex: 999,
            animation: 'mv-confetti-burst 1.2s ease-out forwards',
            animationDelay: p.delay + 'ms',
            opacity: 0,
          }}
        >
          {p.emoji}
        </span>
      ))}

      <BackButton href="/mais" label="Mais" />

      <PageHeader icon="star" color="ambar" title="Feito Hoje" subtitle={formatarData(hoje)} />

      <GlassCard variant="hero" style={{ marginTop: 'var(--mv-space-5)', textAlign: 'center' }}>
        <div style={{ fontSize: 56, marginBottom: 10, lineHeight: 1 }}>{heroEmoji}</div>
        <p style={{ margin: 0, fontSize: 'var(--mv-text-lg)', fontWeight: 700, color: 'var(--mv-text-primary)' }}>
          {heroMsg}
        </p>
        <p style={{ margin: '6px 0 0', fontSize: 'var(--mv-text-sm)', color: 'var(--mv-text-secondary)' }}>
          {wins.length === 0
            ? 'O que você fez hoje que merece celebrar?'
            : wins.length >= 3
            ? 'Que dia incrível você está tendo!'
            : 'Continue assim, você está arrasando!'}
        </p>
      </GlassCard>

      {wins.length > 0 && (
        <>
          <p style={{ margin: 'var(--mv-space-5) 0 var(--mv-space-3) 4px', fontSize: 'var(--mv-text-xs)', fontWeight: 700, color: 'var(--mv-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
            Conquistas de hoje
          </p>
          <GlassCard style={{ padding: 0, overflow: 'hidden' }}>
            {wins.map((win, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--mv-space-3)', padding: '13px 16px', borderBottom: i < wins.length - 1 ? '1px solid var(--mv-border)' : 'none' }}>
                <span style={{ fontSize: 22, flexShrink: 0 }}>{EMOJIS[i % EMOJIS.length]}</span>
                <span style={{ flex: 1, fontSize: 'var(--mv-text-md)', color: 'var(--mv-text-primary)' }}>{win}</span>
                <button type="button" onClick={() => remove(i)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--mv-text-tertiary)', fontSize: 18, padding: '4px', lineHeight: 1 }}>
                  <i className="ti ti-x" aria-hidden="true" />
                </button>
              </div>
            ))}
          </GlassCard>
        </>
      )}

      <p style={{ margin: 'var(--mv-space-5) 0 var(--mv-space-3) 4px', fontSize: 'var(--mv-text-xs)', fontWeight: 700, color: 'var(--mv-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
        Adicionar conquista
      </p>
      <GlassCard>
        <div style={{ display: 'flex', gap: 'var(--mv-space-3)' }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && add()}
            placeholder="Ex: Tomei toda a água do dia..."
            style={{ flex: 1, border: '1.5px solid var(--mv-border)', borderRadius: 12, padding: '11px 14px', fontFamily: 'var(--mv-font)', fontSize: 'var(--mv-text-sm)', outline: 'none', background: 'transparent', minWidth: 0 }}
          />
          <button type="button" onClick={add} className="mv-btn mv-btn--primary" style={{ flexShrink: 0, padding: '0 18px' }}>
            <i className="ti ti-plus" aria-hidden="true" />
          </button>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 'var(--mv-space-3)' }}>
          {['Tomei os remédios', 'Bebi água', 'Saí para caminhar', 'Liguei para a família', 'Comi bem'].map((s) => (
            <button key={s} type="button" onClick={() => { setInput(s) }}
              className="mv-chip"
              style={{ fontSize: 12, minHeight: 32 }}>
              {s}
            </button>
          ))}
        </div>
      </GlassCard>

      <p style={{ textAlign: 'center', fontSize: 'var(--mv-text-xs)', color: 'var(--mv-text-tertiary)', padding: 'var(--mv-space-6) 0 var(--mv-space-4)', lineHeight: 1.6 }}>
        As conquistas de hoje ficam aqui até amanhã ✨
      </p>
    </main>
  )
}
