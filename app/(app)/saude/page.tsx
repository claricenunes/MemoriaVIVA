'use client'

import { useState } from 'react'
import GlassCard from '@/components/shared/glass-card'
import SectionTitle from '@/components/shared/section-title'
import MedicationCard from '@/components/shared/medication-card'

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

const HISTORY = [
  { date: 'Ontem, 11 jun',  corpo: 7, mente: 6, note: 'Fiz uma caminhada pela manhã. Me senti mais disposta do que nos últimos dias.', bookmarked: false },
  { date: 'Qua, 10 jun',   corpo: 5, mente: 4, note: 'Acordei com dor de cabeça. Fiquei em casa o dia todo e não tive ânimo pra nada.', bookmarked: true },
  { date: 'Ter, 9 jun',    corpo: 8, mente: 8, note: 'Dia ótimo! Almocei com minha filha e fomos ao parque.', bookmarked: false },
  { date: 'Seg, 8 jun',    corpo: 6, mente: 7, note: 'Dormi bem. Dia tranquilo em casa com netos.', bookmarked: false },
]

export default function SaudePage() {
  const [physical, setPhysical]     = useState<number | null>(null)
  const [mental, setMental]         = useState<number | null>(null)
  const [note, setNote]             = useState('')
  const [bookmarked, setBookmarked] = useState(false)
  const [saved, setSaved]           = useState(false)

  return (
    <main className="mv-shell">
      <header className="mv-fade-in" style={{ padding: '8px 4px 4px' }}>
        <p className="mv-greeting">
          <i className="ti ti-heart" aria-hidden="true" style={{ marginRight: 6 }} />
          Seu bem-estar
        </p>
        <h1 className="mv-title">Como você está?</h1>
        <p className="mv-subtitle">Sexta-feira, 12 de junho</p>
      </header>

      <div style={{ marginTop: 'var(--mv-space-5)' }}>
        {saved ? (
          <GlassCard variant="hero">
            <p style={{ margin: 0, fontSize: 'var(--mv-text-lg)', fontWeight: 600 }}>✅ Check-in feito hoje!</p>
            <div style={{ display: 'flex', gap: 'var(--mv-space-3)', marginTop: 'var(--mv-space-4)' }}>
              <div style={{ flex: 1, background: 'var(--mv-salvia-soft)', borderRadius: 'var(--mv-radius-md)', padding: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: 11, color: 'var(--mv-salvia-deep)', fontWeight: 700, marginBottom: 6 }}>🏃 Corpo</div>
                <div style={{ fontSize: 'var(--mv-text-display)', fontWeight: 600, color: 'var(--mv-salvia-deep)', lineHeight: 1 }}>{physical ?? '—'}</div>
                <div style={{ fontSize: 11, color: 'var(--mv-salvia-deep)', marginTop: 4 }}>de 10</div>
              </div>
              <div style={{ flex: 1, background: 'var(--mv-azul-soft)', borderRadius: 'var(--mv-radius-md)', padding: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: 11, color: 'var(--mv-azul-deep)', fontWeight: 700, marginBottom: 6 }}>🧠 Mente</div>
                <div style={{ fontSize: 'var(--mv-text-display)', fontWeight: 600, color: 'var(--mv-azul-deep)', lineHeight: 1 }}>{mental ?? '—'}</div>
                <div style={{ fontSize: 11, color: 'var(--mv-azul-deep)', marginTop: 4 }}>de 10</div>
              </div>
            </div>
            {note && <p style={{ margin: 'var(--mv-space-4) 0 0', fontSize: 'var(--mv-text-sm)', color: 'var(--mv-text-secondary)', fontStyle: 'italic', lineHeight: 1.55 }}>"{note}"</p>}
            {bookmarked && (
              <div style={{ marginTop: 'var(--mv-space-3)', fontSize: 'var(--mv-text-xs)', color: 'var(--mv-azul-deep)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                <i className="ti ti-stethoscope" aria-hidden="true" /> Marcado para mostrar ao médico
              </div>
            )}
          </GlassCard>
        ) : (
          <GlassCard variant="hero">
            <p style={{ margin: 0, fontSize: 'var(--mv-text-lg)', fontWeight: 600 }}>Check-in de hoje ☀️</p>
            <p style={{ margin: '4px 0 var(--mv-space-4)', fontSize: 'var(--mv-text-sm)', color: 'var(--mv-text-secondary)' }}>Como você acordou hoje, Clarice?</p>

            <div className="mv-checkin-section-label"><span>🏃</span><span>Seu corpo hoje</span></div>
            <div className="mv-checkin-scale">
              {PHYSICAL_SCALE.map((item) => (
                <button key={item.value} type="button" aria-pressed={physical === item.value}
                  className={`mv-checkin-scale-btn${physical === item.value ? ' mv-checkin-scale-btn--selected' : ''}`}
                  onClick={() => setPhysical(item.value)}>
                  <span className="mv-checkin-scale-btn-emoji">{item.emoji}</span>
                  <span className="mv-checkin-scale-btn-label">{item.label}</span>
                </button>
              ))}
            </div>

            <div className="mv-divider" />

            <div className="mv-checkin-section-label"><span>🧠</span><span>Sua mente hoje</span></div>
            <div className="mv-checkin-scale">
              {MENTAL_SCALE.map((item) => (
                <button key={item.value} type="button" aria-pressed={mental === item.value}
                  className={`mv-checkin-scale-btn${mental === item.value ? ' mv-checkin-scale-btn--selected' : ''}`}
                  onClick={() => setMental(item.value)}>
                  <span className="mv-checkin-scale-btn-emoji">{item.emoji}</span>
                  <span className="mv-checkin-scale-btn-label">{item.label}</span>
                </button>
              ))}
            </div>

            <div className="mv-divider" />

            <p style={{ margin: '0 0 var(--mv-space-2)', fontSize: 'var(--mv-text-sm)', fontWeight: 600, color: 'var(--mv-text-secondary)' }}>
              Quer escrever algo sobre hoje? <span style={{ fontWeight: 400 }}>(opcional)</span>
            </p>
            <textarea className="mv-diary-textarea" placeholder={'Hoje acordei cansada...\nEstou me sentindo melhor...'} value={note} onChange={(e) => setNote(e.target.value)} rows={3} />

            <button type="button" className={`mv-doctor-toggle${bookmarked ? ' mv-doctor-toggle--active' : ''}`} onClick={() => setBookmarked(!bookmarked)} style={{ marginTop: 'var(--mv-space-3)' }}>
              <span className="mv-doctor-toggle-icon">🩺</span>
              <div>
                <span className="mv-doctor-toggle-title">{bookmarked ? '✓ Marcado para o médico' : 'Marcar para mostrar ao médico'}</span>
                <p className="mv-doctor-toggle-sub">Guardar esse registro para a consulta</p>
              </div>
            </button>

            <button type="button" className="mv-btn mv-btn--primary mv-btn--full" style={{ marginTop: 'var(--mv-space-4)' }} onClick={() => setSaved(true)}>
              Salvar meu dia
            </button>
          </GlassCard>
        )}
      </div>

      <SectionTitle title="Remédios de hoje" action="Ver todos" actionHref="/medicamentos" />
      <MedicationCard name="Losartana"  dosage="1 comprimido" time="Tomado • 08:00"  status="tomado" />
      <MedicationCard name="Vitamina D" dosage="1 cápsula"    time="Tomado • 08:00"  status="tomado" />
      <MedicationCard name="Metformina" dosage="1 comprimido" time="Próximo • 18:00" status="pendente" />

      <SectionTitle title="Meu diário" action="Ver tudo" />
      <GlassCard>
        {HISTORY.map((entry, i) => (
          <div key={i} className="mv-diary-entry">
            <div className="mv-diary-entry-header">
              <span className="mv-diary-entry-date">{entry.date}</span>
              <div className="mv-diary-entry-scores">
                <span className="mv-diary-score-pill mv-diary-score-pill--corpo">🏃 {entry.corpo}/10</span>
                <span className="mv-diary-score-pill mv-diary-score-pill--mente">🧠 {entry.mente}/10</span>
              </div>
            </div>
            <p className="mv-diary-entry-text">{entry.note}</p>
            {entry.bookmarked && (
              <div className="mv-diary-entry-bookmark">
                <i className="ti ti-stethoscope" aria-hidden="true" /> Marcado para o médico
              </div>
            )}
          </div>
        ))}
      </GlassCard>
    </main>
  )
}
