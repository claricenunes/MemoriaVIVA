'use client'

import { useState } from 'react'
import GlassCard from './glass-card'

const PHYSICAL_SCALE = [
  { value: 1,  emoji: '😣', label: 'Muito\nmal' },
  { value: 3,  emoji: '😟', label: 'Mal' },
  { value: 5,  emoji: '😐', label: 'Regular' },
  { value: 8,  emoji: '😊', label: 'Bem' },
  { value: 10, emoji: '😄', label: 'Ótimo!' },
]

const MENTAL_SCALE = [
  { value: 1,  emoji: '😞', label: 'Muito\nmal' },
  { value: 3,  emoji: '😕', label: 'Mal' },
  { value: 5,  emoji: '😌', label: 'Regular' },
  { value: 8,  emoji: '🙂', label: 'Bem' },
  { value: 10, emoji: '😁', label: 'Ótimo!' },
]

export default function EmotionCheckin() {
  const [physical, setPhysical]     = useState<number | null>(null)
  const [mental, setMental]         = useState<number | null>(null)
  const [note, setNote]             = useState('')
  const [bookmarked, setBookmarked] = useState(false)
  const [saved, setSaved]           = useState(false)

  if (saved) {
    return (
      <GlassCard variant="hero">
        <p style={{ margin: 0, fontSize: 'var(--mv-text-md)', fontWeight: 600 }}>
          ✅ Check-in feito hoje!
        </p>
        <div style={{ display: 'flex', gap: 'var(--mv-space-3)', marginTop: 'var(--mv-space-4)' }}>
          <div style={{ flex: 1, background: 'var(--mv-salvia-soft)', borderRadius: 'var(--mv-radius-md)', padding: '16px', textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: 'var(--mv-salvia-deep)', fontWeight: 700, marginBottom: 4 }}>🏃 Corpo</div>
            <div style={{ fontSize: 'var(--mv-text-display)', fontWeight: 600, color: 'var(--mv-salvia-deep)', lineHeight: 1 }}>
              {physical ?? '—'}
            </div>
            <div style={{ fontSize: 11, color: 'var(--mv-salvia-deep)' }}>de 10</div>
          </div>
          <div style={{ flex: 1, background: 'var(--mv-azul-soft)', borderRadius: 'var(--mv-radius-md)', padding: '16px', textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: 'var(--mv-azul-deep)', fontWeight: 700, marginBottom: 4 }}>🧠 Mente</div>
            <div style={{ fontSize: 'var(--mv-text-display)', fontWeight: 600, color: 'var(--mv-azul-deep)', lineHeight: 1 }}>
              {mental ?? '—'}
            </div>
            <div style={{ fontSize: 11, color: 'var(--mv-azul-deep)' }}>de 10</div>
          </div>
        </div>
        {note && (
          <p style={{ margin: 'var(--mv-space-4) 0 0', fontSize: 'var(--mv-text-sm)', color: 'var(--mv-text-secondary)', fontStyle: 'italic', lineHeight: 1.5 }}>
            "{note}"
          </p>
        )}
        {bookmarked && (
          <div style={{ marginTop: 'var(--mv-space-3)', fontSize: 'var(--mv-text-xs)', color: 'var(--mv-azul-deep)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
            <i className="ti ti-stethoscope" aria-hidden="true" />
            Marcado para mostrar ao médico
          </div>
        )}
        <a href="/saude" style={{ display: 'block', marginTop: 'var(--mv-space-3)', fontSize: 'var(--mv-text-xs)', color: 'var(--mv-terracota-deep)', fontWeight: 600, textDecoration: 'none' }}>
          Ver meu diário →
        </a>
      </GlassCard>
    )
  }

  return (
    <GlassCard variant="hero">
      <p style={{ margin: 0, fontSize: 'var(--mv-text-lg)', fontWeight: 600 }}>
        Como você está hoje?
      </p>
      <p style={{ margin: '4px 0 0', fontSize: 'var(--mv-text-sm)', color: 'var(--mv-text-secondary)' }}>
        Leva só um minuto ☀️
      </p>

      <div className="mv-checkin-section-label" style={{ marginTop: 'var(--mv-space-4)' }}>
        <span>🏃</span>
        <span>Seu corpo hoje</span>
      </div>
      <div className="mv-checkin-scale">
        {PHYSICAL_SCALE.map((item) => (
          <button
            key={item.value}
            type="button"
            aria-label={item.label.replace('\n', ' ')}
            aria-pressed={physical === item.value}
            className={`mv-checkin-scale-btn${physical === item.value ? ' mv-checkin-scale-btn--selected' : ''}`}
            onClick={() => setPhysical(item.value)}
          >
            <span className="mv-checkin-scale-btn-emoji">{item.emoji}</span>
            <span className="mv-checkin-scale-btn-label">{item.label}</span>
          </button>
        ))}
      </div>

      <div className="mv-divider" />

      <div className="mv-checkin-section-label">
        <span>🧠</span>
        <span>Sua mente hoje</span>
      </div>
      <div className="mv-checkin-scale">
        {MENTAL_SCALE.map((item) => (
          <button
            key={item.value}
            type="button"
            aria-label={item.label.replace('\n', ' ')}
            aria-pressed={mental === item.value}
            className={`mv-checkin-scale-btn${mental === item.value ? ' mv-checkin-scale-btn--selected' : ''}`}
            onClick={() => setMental(item.value)}
          >
            <span className="mv-checkin-scale-btn-emoji">{item.emoji}</span>
            <span className="mv-checkin-scale-btn-label">{item.label}</span>
          </button>
        ))}
      </div>

      <div className="mv-divider" />

      <p style={{ margin: '0 0 var(--mv-space-2)', fontSize: 'var(--mv-text-sm)', fontWeight: 600, color: 'var(--mv-text-secondary)' }}>
        Quer escrever algo sobre hoje?{' '}
        <span style={{ fontWeight: 400 }}>(opcional)</span>
      </p>
      <textarea
        className="mv-diary-textarea"
        placeholder={'Hoje acordei cansada...\nEstou me sentindo melhor...\nDormi bem essa noite...'}
        value={note}
        onChange={(e) => setNote(e.target.value)}
        rows={3}
      />

      <button
        type="button"
        className={`mv-doctor-toggle${bookmarked ? ' mv-doctor-toggle--active' : ''}`}
        onClick={() => setBookmarked(!bookmarked)}
        style={{ marginTop: 'var(--mv-space-3)' }}
      >
        <span className="mv-doctor-toggle-icon">🩺</span>
        <div>
          <span className="mv-doctor-toggle-title">
            {bookmarked ? '✓ Marcado para o médico' : 'Marcar para mostrar ao médico'}
          </span>
          <p className="mv-doctor-toggle-sub">Guardar esse registro para a consulta</p>
        </div>
      </button>

      <button
        type="button"
        className="mv-btn mv-btn--primary mv-btn--full"
        style={{ marginTop: 'var(--mv-space-4)' }}
        onClick={() => setSaved(true)}
      >
        Salvar meu dia
      </button>
    </GlassCard>
  )
}
