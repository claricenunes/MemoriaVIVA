'use client'

import { useActionState, useState, useEffect } from 'react'
import { toast } from 'sonner'
import { salvarCheckin } from '@/actions/saude'
import GlassCard from '@/components/shared/glass-card'

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

interface CheckinFormProps {
  userName?: string
}

export default function CheckinForm({ userName = 'você' }: CheckinFormProps) {
  const [state, formAction, pending] = useActionState(salvarCheckin, null)
  const [corpo, setCorpo]           = useState<number | null>(null)
  const [mente, setMente]           = useState<number | null>(null)
  const [bookmarked, setBookmarked] = useState(false)

  useEffect(() => {
    if (!state) return
    if ('success' in state) toast.success('Check-in salvo! Bom dia ☀️')
    else toast.error(state.error)
  }, [state])

  return (
    <GlassCard variant="hero">
      <p style={{ margin: 0, fontSize: 'var(--mv-text-lg)', fontWeight: 600 }}>Check-in de hoje ☀️</p>
      <p style={{ margin: '4px 0 var(--mv-space-4)', fontSize: 'var(--mv-text-sm)', color: 'var(--mv-text-secondary)' }}>
        Como você acordou hoje, {userName}?
      </p>

      <form action={formAction}>
        {/* Valores capturados pelos botões de escala */}
        <input type="hidden" name="corpo"         value={corpo ?? ''} readOnly />
        <input type="hidden" name="mente"         value={mente ?? ''} readOnly />
        <input type="hidden" name="marcado_medico" value={String(bookmarked)} readOnly />

        {state && 'error' in state && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', borderRadius: 'var(--mv-radius-md)', background: 'var(--mv-terracota-soft)', color: 'var(--mv-terracota-deep)', fontSize: 'var(--mv-text-sm)', fontWeight: 600, marginBottom: 'var(--mv-space-3)' }}>
            <i className="ti ti-alert-circle" aria-hidden="true" />
            {state.error}
          </div>
        )}

        <div className="mv-checkin-section-label"><span>🏃</span><span>Seu corpo hoje</span></div>
        <div className="mv-checkin-scale">
          {PHYSICAL_SCALE.map((item) => (
            <button
              key={item.value}
              type="button"
              aria-label={item.label.replace('\n', ' ')}
              aria-pressed={corpo === item.value}
              className={`mv-checkin-scale-btn${corpo === item.value ? ' mv-checkin-scale-btn--selected' : ''}`}
              onClick={() => setCorpo(item.value)}
            >
              <span className="mv-checkin-scale-btn-emoji">{item.emoji}</span>
              <span className="mv-checkin-scale-btn-label">{item.label}</span>
            </button>
          ))}
        </div>

        <div className="mv-divider" />

        <div className="mv-checkin-section-label"><span>🧠</span><span>Sua mente hoje</span></div>
        <div className="mv-checkin-scale">
          {MENTAL_SCALE.map((item) => (
            <button
              key={item.value}
              type="button"
              aria-label={item.label.replace('\n', ' ')}
              aria-pressed={mente === item.value}
              className={`mv-checkin-scale-btn${mente === item.value ? ' mv-checkin-scale-btn--selected' : ''}`}
              onClick={() => setMente(item.value)}
            >
              <span className="mv-checkin-scale-btn-emoji">{item.emoji}</span>
              <span className="mv-checkin-scale-btn-label">{item.label}</span>
            </button>
          ))}
        </div>

        <div className="mv-divider" />

        <p style={{ margin: '0 0 var(--mv-space-2)', fontSize: 'var(--mv-text-sm)', fontWeight: 600, color: 'var(--mv-text-secondary)' }}>
          Quer escrever algo sobre hoje? <span style={{ fontWeight: 400 }}>(opcional)</span>
        </p>
        <textarea
          name="nota"
          className="mv-diary-textarea"
          placeholder={'Hoje acordei cansada...\nEstou me sentindo melhor...'}
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
          type="submit"
          disabled={pending}
          className="mv-btn mv-btn--primary mv-btn--full"
          style={{ marginTop: 'var(--mv-space-4)', opacity: pending ? 0.7 : 1 }}
        >
          {pending ? 'Salvando...' : 'Salvar meu dia'}
        </button>
      </form>
    </GlassCard>
  )
}
