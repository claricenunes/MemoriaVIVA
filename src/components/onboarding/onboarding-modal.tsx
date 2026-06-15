'use client'
import { useState, useEffect } from 'react'

const SLIDES = [
  {
    emoji: '🌸',
    titulo: 'Bem-vinda ao Memória Viva',
    texto: 'Seu companheiro diário para cuidar da saúde, guardar memórias e manter tudo organizado com carinho.',
  },
  {
    emoji: '🏥',
    titulo: 'Saúde em dia',
    texto: 'Faça seu check-in de bem-estar, acompanhe seus remédios e registre como você está se sentindo cada dia.',
  },
  {
    emoji: '📅',
    titulo: 'Agenda organizada',
    texto: 'Nunca perca uma consulta. Organize compromissos, consultas médicas e eventos importantes em um só lugar.',
  },
  {
    emoji: '💕',
    titulo: 'Guarde suas memórias',
    texto: 'Registre momentos especiais, histórias e recordações para revisitar e compartilhar com a família.',
  },
]

export default function OnboardingModal() {
  const [show, setShow] = useState(false)
  const [slide, setSlide] = useState(0)

  useEffect(() => {
    if (!localStorage.getItem('mv-onboarded')) setShow(true)
  }, [])

  function finish() {
    localStorage.setItem('mv-onboarded', '1')
    setShow(false)
  }

  if (!show) return null

  const current = SLIDES[slide]
  const isLast  = slide === SLIDES.length - 1

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(58, 53, 48, 0.55)',
      backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
    }}>
      <div style={{
        background: 'var(--mv-card)',
        borderRadius: '28px 28px 0 0',
        padding: '32px 24px 44px',
        maxWidth: 430, width: '100%',
        animation: 'mv-slide-up 0.3s ease both',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 64, marginBottom: 16, lineHeight: 1 }}>{current.emoji}</div>
          <h2 style={{ margin: '0 0 12px', fontSize: 'var(--mv-text-xl)', fontWeight: 700, color: 'var(--mv-text-primary)', lineHeight: 1.3 }}>
            {current.titulo}
          </h2>
          <p style={{ margin: 0, fontSize: 'var(--mv-text-md)', color: 'var(--mv-text-secondary)', lineHeight: 1.6 }}>
            {current.texto}
          </p>
        </div>

        {/* Dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 24 }}>
          {SLIDES.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setSlide(i)}
              style={{
                width: i === slide ? 24 : 8, height: 8,
                borderRadius: 4, border: 'none', cursor: 'pointer',
                background: i === slide ? 'var(--mv-terracota)' : 'var(--mv-border)',
                padding: 0, transition: 'all 0.2s',
              }}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          {slide > 0 && (
            <button
              type="button"
              onClick={() => setSlide(s => s - 1)}
              className="mv-btn mv-btn--ghost"
              style={{ flex: 1 }}
            >
              ← Anterior
            </button>
          )}
          {!isLast ? (
            <button
              type="button"
              onClick={() => setSlide(s => s + 1)}
              className="mv-btn mv-btn--primary"
              style={{ flex: slide > 0 ? 2 : 1 }}
            >
              Próximo →
            </button>
          ) : (
            <button
              type="button"
              onClick={finish}
              className="mv-btn mv-btn--primary"
              style={{ flex: slide > 0 ? 2 : 1 }}
            >
              Começar! 🌸
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={finish}
          style={{
            display: 'block', width: '100%', marginTop: 12,
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 'var(--mv-text-sm)', color: 'var(--mv-text-tertiary)', padding: 8,
          }}
        >
          Pular
        </button>
      </div>
    </div>
  )
}
