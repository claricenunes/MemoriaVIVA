'use client'

import { useState } from 'react'
import GlassCard from '@/components/shared/glass-card'
import SectionTitle from '@/components/shared/section-title'

const CATEGORIES = [
  { label: 'Todos',     active: true  },
  { label: '🧠 Memória', active: false },
  { label: '🔢 Números', active: false },
  { label: '🔤 Palavras', active: false },
  { label: '🎯 Foco',    active: false },
]

const GAME_LETTERS = ['A', 'C', 'A', 'A', 'Ç', 'L', 'A', 'Ã', 'R']
const ANSWER = 'CLARAÇA'
const HINT = 'Nome feminino'

const EXERCISES = [
  { icon: '🔡', title: 'Palavra escondida',  desc: 'Forme palavras com as letras',         duration: '3 min',  difficulty: 'Fácil',   color: 'terracota', status: 'disponivel' },
  { icon: '🔢', title: 'Sequência de números', desc: 'Memorize e repita a sequência',       duration: '5 min',  difficulty: 'Médio',   color: 'azul',      status: 'disponivel' },
  { icon: '🎯', title: 'Onde estava?',        desc: 'Encontre onde o objeto foi escondido', duration: '4 min',  difficulty: 'Médio',   color: 'salvia',    status: 'disponivel' },
  { icon: '🖼️', title: 'Diferença das imagens', desc: 'Encontre as 5 diferenças',          duration: '5 min',  difficulty: 'Fácil',   color: 'ambar',     status: 'bloqueado'  },
]

const BLOB_CLASS: Record<string, string> = {
  terracota: 'mv-icon-blob--terracota',
  azul:      'mv-icon-blob--azul',
  salvia:    'mv-icon-blob--salvia',
  ambar:     'mv-icon-blob--ambar',
}

export default function ExerciciosPage() {
  const [selected, setSelected]   = useState<string[]>([])
  const [guess, setGuess]         = useState('')
  const [result, setResult]       = useState<'correct' | 'wrong' | null>(null)
  const [showHint, setShowHint]   = useState(false)

  function toggleLetter(letter: string, idx: number) {
    const key = `${letter}-${idx}`
    setSelected((prev) => prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key])
    setResult(null)
  }

  function checkAnswer() {
    const formed = selected.map((k) => k.split('-')[0]).join('')
    setResult(formed.toUpperCase() === ANSWER ? 'correct' : 'wrong')
  }

  return (
    <main className="mv-shell">
      <header className="mv-fade-in" style={{ padding: '8px 4px 4px' }}>
        <p className="mv-greeting">
          <i className="ti ti-brain" aria-hidden="true" style={{ marginRight: 6 }} />
          Ginástica mental
        </p>
        <h1 className="mv-title">Exercícios</h1>
        <p className="mv-subtitle">Mantenha a mente ativa todos os dias</p>
      </header>

      <GlassCard variant="hero" style={{ marginTop: 'var(--mv-space-5)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--mv-space-3)' }}>
          <span style={{ fontSize: 'var(--mv-text-sm)', fontWeight: 600, color: 'var(--mv-text-secondary)' }}>⭐ Sequência</span>
          <span style={{ fontSize: 'var(--mv-text-sm)', fontWeight: 700, color: 'var(--mv-terracota-deep)' }}>7 dias</span>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map((d, i) => (
            <div key={d} style={{ flex: 1, textAlign: 'center' }}>
              <div style={{
                width: '100%',
                aspectRatio: '1',
                borderRadius: 'var(--mv-radius-sm)',
                background: i < 5 ? 'var(--mv-salvia)' : i === 5 ? 'var(--mv-salvia-soft)' : 'var(--mv-bg-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 4,
              }}>
                {i < 5 ? <i className="ti ti-check" aria-hidden="true" style={{ fontSize: 14, color: 'white' }} /> : <span style={{ fontSize: 10, color: 'var(--mv-text-tertiary)' }}>—</span>}
              </div>
              <span style={{ fontSize: 10, color: 'var(--mv-text-tertiary)' }}>{d}</span>
            </div>
          ))}
        </div>
      </GlassCard>

      <SectionTitle title="Exercício do dia — Palavra escondida" />
      <GlassCard>
        <p style={{ margin: '0 0 var(--mv-space-3)', fontSize: 'var(--mv-text-sm)', color: 'var(--mv-text-secondary)' }}>
          Toque nas letras para formar uma palavra
          {showHint && <span style={{ fontStyle: 'italic', color: 'var(--mv-text-tertiary)' }}> — Dica: {HINT}</span>}
        </p>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 'var(--mv-space-4)' }}>
          {GAME_LETTERS.map((letter, idx) => {
            const key = `${letter}-${idx}`
            const isSelected = selected.includes(key)
            return (
              <button key={key} type="button" onClick={() => toggleLetter(letter, idx)}
                style={{
                  width: 48, height: 52, borderRadius: 'var(--mv-radius-sm)', border: '2px solid', cursor: 'pointer',
                  fontSize: 'var(--mv-text-lg)', fontWeight: 700, transition: 'all 0.15s',
                  borderColor: isSelected ? 'var(--mv-terracota)' : 'var(--mv-border)',
                  background:  isSelected ? 'var(--mv-terracota-soft)' : 'var(--mv-bg-secondary)',
                  color:       isSelected ? 'var(--mv-terracota-deep)' : 'var(--mv-text-primary)',
                }}>
                {letter}
              </button>
            )
          })}
        </div>

        <div style={{ minHeight: 44, background: 'var(--mv-bg-secondary)', borderRadius: 'var(--mv-radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--mv-space-3)', gap: 6, padding: '8px 12px' }}>
          {selected.length === 0 ? (
            <span style={{ color: 'var(--mv-text-tertiary)', fontSize: 'var(--mv-text-sm)' }}>Sua palavra aparece aqui</span>
          ) : selected.map((k, i) => (
            <span key={i} style={{ fontSize: 'var(--mv-text-lg)', fontWeight: 700, color: 'var(--mv-terracota-deep)', letterSpacing: 2 }}>{k.split('-')[0]}</span>
          ))}
        </div>

        {result === 'correct' && <div style={{ textAlign: 'center', color: 'var(--mv-salvia-deep)', fontWeight: 700, marginBottom: 'var(--mv-space-3)' }}>✅ Correto! Parabéns!</div>}
        {result === 'wrong'   && <div style={{ textAlign: 'center', color: 'var(--mv-terracota-deep)', fontWeight: 700, marginBottom: 'var(--mv-space-3)' }}>❌ Tente novamente</div>}

        <div style={{ display: 'flex', gap: 'var(--mv-space-3)' }}>
          <button type="button" className="mv-btn mv-btn--ghost" style={{ flex: 1 }} onClick={() => setShowHint(true)}>
            💡 Dica
          </button>
          <button type="button" className="mv-btn mv-btn--primary" style={{ flex: 2 }} onClick={checkAnswer} disabled={selected.length === 0}>
            Verificar
          </button>
        </div>
      </GlassCard>

      <div className="mv-chips" style={{ marginTop: 'var(--mv-space-5)' }}>
        {CATEGORIES.map((cat) => (
          <button key={cat.label} type="button" className={`mv-chip${cat.active ? ' mv-chip--active' : ''}`}>
            {cat.label}
          </button>
        ))}
      </div>

      <SectionTitle title="Mais exercícios" />
      <GlassCard>
        {EXERCISES.map((ex, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--mv-space-3)', paddingBottom: i < EXERCISES.length - 1 ? 'var(--mv-space-4)' : 0, marginBottom: i < EXERCISES.length - 1 ? 'var(--mv-space-4)' : 0, borderBottom: i < EXERCISES.length - 1 ? '1px solid var(--mv-border)' : 'none', opacity: ex.status === 'bloqueado' ? 0.5 : 1 }}>
            <div className={`mv-icon-blob ${BLOB_CLASS[ex.color] ?? 'mv-icon-blob--azul'}`} style={{ width: 50, height: 50, fontSize: 22 }}>
              <span aria-hidden="true">{ex.icon}</span>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, color: 'var(--mv-text-primary)', marginBottom: 2 }}>{ex.title}</div>
              <div style={{ fontSize: 'var(--mv-text-xs)', color: 'var(--mv-text-secondary)' }}>{ex.desc}</div>
              <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                <span style={{ fontSize: 11, color: 'var(--mv-text-tertiary)' }}>⏱ {ex.duration}</span>
                <span style={{ fontSize: 11, color: 'var(--mv-text-tertiary)' }}>· {ex.difficulty}</span>
              </div>
            </div>
            {ex.status === 'bloqueado'
              ? <i className="ti ti-lock" aria-hidden="true" style={{ color: 'var(--mv-text-tertiary)', fontSize: 18 }} />
              : <button type="button" className="mv-btn mv-btn--primary" style={{ padding: '6px 14px', fontSize: 'var(--mv-text-xs)' }}>Jogar</button>
            }
          </div>
        ))}
      </GlassCard>
    </main>
  )
}
