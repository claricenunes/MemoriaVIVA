'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import GlassCard from '@/components/shared/glass-card'
import PageHeader from '@/components/shared/page-header'
import BackButton from '@/components/shared/back-button'

const EMOJIS = ['👩', '👩‍🦳', '👩‍🦱', '👵', '🧕', '👨', '👴', '🧑', '🧒']

const FATOS_CONFIG = [
  { label: 'Cidade natal',       placeholder: 'Onde nasci...'               },
  { label: 'Onde moro',          placeholder: 'Minha cidade atual...'        },
  { label: 'Profissão',          placeholder: 'O que faço ou fiz...'         },
  { label: 'Estado civil',       placeholder: 'Casada, solteira...'          },
  { label: 'Filhos e netos',     placeholder: 'Quantos, nomes...'            },
  { label: 'Passatempo favorito',placeholder: 'O que amo fazer...'           },
]

type Marco = { id: string; ano: string; texto: string }
type Historia = {
  nome: string
  emoji: string
  bio: string
  fatos: string[]
  marcos: Marco[]
}

const VAZIO: Historia = {
  nome: '', emoji: '👩', bio: '',
  fatos: Array(FATOS_CONFIG.length).fill(''),
  marcos: [],
}

function carregar(): Historia {
  try {
    const s = localStorage.getItem('mv-historia')
    if (!s) return VAZIO
    const parsed = JSON.parse(s)
    return {
      ...VAZIO,
      ...parsed,
      fatos: parsed.fatos ?? VAZIO.fatos,
      marcos: parsed.marcos ?? [],
    }
  } catch { return VAZIO }
}

const INPUT: React.CSSProperties = {
  display: 'block', width: '100%', padding: '11px 14px',
  border: '1.5px solid var(--mv-border)', borderRadius: 'var(--mv-radius-md)',
  fontFamily: 'var(--mv-font)', fontSize: 'var(--mv-text-sm)',
  background: 'transparent', color: 'var(--mv-text-primary)',
  outline: 'none', boxSizing: 'border-box',
}

export default function HistoriaPage() {
  const [h, setH]           = useState<Historia>(VAZIO)
  const [pronto, setPronto] = useState(false)
  const [novoMarco, setNovoMarco] = useState({ ano: '', texto: '' })
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => { setH(carregar()); setPronto(true) }, [])

  function salvar(next: Historia) {
    setH(next)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      localStorage.setItem('mv-historia', JSON.stringify(next))
    }, 600)
  }

  function addMarco() {
    if (!novoMarco.texto.trim()) return
    const novo = { id: Date.now().toString(), ...novoMarco }
    const marcos = [...h.marcos, novo].sort((a, b) => a.ano.localeCompare(b.ano))
    salvar({ ...h, marcos })
    setNovoMarco({ ano: '', texto: '' })
  }

  if (!pronto) return null

  return (
    <main className="mv-shell">
      <BackButton href="/mais" label="Mais" />

      <PageHeader icon="book-2" color="terracota" title="Minha História" />

      {/* Avatar + nome */}
      <GlassCard variant="hero" style={{ marginTop: 'var(--mv-space-5)', textAlign: 'center' }}>
        <div style={{ fontSize: 64, marginBottom: 10, lineHeight: 1 }}>{h.emoji}</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 6, marginBottom: 14 }}>
          {EMOJIS.map((e) => (
            <button key={e} type="button" onClick={() => salvar({ ...h, emoji: e })}
              style={{ fontSize: 24, background: e === h.emoji ? 'var(--mv-terracota-soft)' : 'var(--mv-border)', border: 'none', borderRadius: 10, padding: '4px 7px', cursor: 'pointer', lineHeight: 1, transition: 'background 0.15s' }}>
              {e}
            </button>
          ))}
        </div>
        <input
          value={h.nome}
          onChange={(e) => salvar({ ...h, nome: e.target.value })}
          placeholder="Seu nome completo"
          style={{ width: '100%', border: 'none', background: 'transparent', textAlign: 'center', fontSize: 'var(--mv-text-lg)', fontWeight: 700, fontFamily: 'var(--mv-font)', color: 'var(--mv-text-primary)', outline: 'none', padding: '4px 0' }}
        />
      </GlassCard>

      {/* Bio */}
      <p style={{ margin: 'var(--mv-space-5) 0 var(--mv-space-3) 4px', fontSize: 'var(--mv-text-xs)', fontWeight: 700, color: 'var(--mv-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
        Quem sou eu
      </p>
      <GlassCard>
        <textarea
          value={h.bio}
          onChange={(e) => salvar({ ...h, bio: e.target.value })}
          placeholder="Escreva sobre você — sua personalidade, valores, conquistas, família, o que você ama..."
          rows={5}
          style={{ width: '100%', border: 'none', background: 'transparent', fontFamily: 'var(--mv-font)', fontSize: 'var(--mv-text-md)', color: 'var(--mv-text-primary)', outline: 'none', resize: 'none', lineHeight: 1.6, padding: 0 }}
        />
        <p style={{ margin: '8px 0 0', fontSize: 11, color: 'var(--mv-text-tertiary)' }}>Salvo automaticamente</p>
      </GlassCard>

      {/* Fatos rápidos */}
      <p style={{ margin: 'var(--mv-space-5) 0 var(--mv-space-3) 4px', fontSize: 'var(--mv-text-xs)', fontWeight: 700, color: 'var(--mv-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
        Fatos rápidos
      </p>
      <GlassCard style={{ padding: 0, overflow: 'hidden' }}>
        {FATOS_CONFIG.map((fato, i) => (
          <div key={fato.label} style={{ display: 'flex', alignItems: 'center', gap: 'var(--mv-space-3)', padding: '12px 16px', borderBottom: i < FATOS_CONFIG.length - 1 ? '1px solid var(--mv-border)' : 'none' }}>
            <span style={{ fontSize: 'var(--mv-text-sm)', fontWeight: 600, color: 'var(--mv-text-secondary)', minWidth: 120, flexShrink: 0 }}>
              {fato.label}
            </span>
            <input
              value={h.fatos[i] ?? ''}
              onChange={(e) => { const f = [...h.fatos]; f[i] = e.target.value; salvar({ ...h, fatos: f }) }}
              placeholder={fato.placeholder}
              style={{ flex: 1, border: 'none', background: 'transparent', fontFamily: 'var(--mv-font)', fontSize: 'var(--mv-text-sm)', color: 'var(--mv-text-primary)', outline: 'none', padding: '2px 0', minWidth: 0 }}
            />
          </div>
        ))}
      </GlassCard>

      {/* Marcos */}
      <p style={{ margin: 'var(--mv-space-5) 0 var(--mv-space-3) 4px', fontSize: 'var(--mv-text-xs)', fontWeight: 700, color: 'var(--mv-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
        Momentos marcantes
      </p>

      {h.marcos.length > 0 && (
        <GlassCard style={{ padding: 0, overflow: 'hidden', marginBottom: 'var(--mv-space-3)' }}>
          {h.marcos.map((marco, i) => (
            <div key={marco.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--mv-space-3)', padding: '12px 16px', borderBottom: i < h.marcos.length - 1 ? '1px solid var(--mv-border)' : 'none' }}>
              <span style={{ fontSize: 'var(--mv-text-sm)', fontWeight: 700, color: 'var(--mv-terracota-deep)', minWidth: 40, flexShrink: 0 }}>
                {marco.ano || '—'}
              </span>
              <span style={{ flex: 1, fontSize: 'var(--mv-text-sm)', color: 'var(--mv-text-primary)', minWidth: 0 }}>
                {marco.texto}
              </span>
              <button type="button" onClick={() => salvar({ ...h, marcos: h.marcos.filter((m) => m.id !== marco.id) })}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--mv-text-tertiary)', fontSize: 17, lineHeight: 1, padding: '4px', flexShrink: 0 }}>
                <i className="ti ti-trash" aria-hidden="true" />
              </button>
            </div>
          ))}
        </GlassCard>
      )}

      <GlassCard>
        <div style={{ display: 'grid', gridTemplateColumns: '76px 1fr', gap: 'var(--mv-space-3)', marginBottom: 'var(--mv-space-3)' }}>
          <input
            value={novoMarco.ano}
            onChange={(e) => setNovoMarco((m) => ({ ...m, ano: e.target.value }))}
            placeholder="Ano"
            maxLength={4}
            style={{ ...INPUT, textAlign: 'center' }}
          />
          <input
            value={novoMarco.texto}
            onChange={(e) => setNovoMarco((m) => ({ ...m, texto: e.target.value }))}
            onKeyDown={(e) => e.key === 'Enter' && addMarco()}
            placeholder="O que aconteceu?"
            style={INPUT}
          />
        </div>
        <button type="button" onClick={addMarco} className="mv-btn mv-btn--ghost mv-btn--full">
          <i className="ti ti-plus" aria-hidden="true" /> Adicionar marco
        </button>
      </GlassCard>

      <p style={{ textAlign: 'center', fontSize: 'var(--mv-text-xs)', color: 'var(--mv-text-tertiary)', padding: 'var(--mv-space-6) 0 var(--mv-space-4)', lineHeight: 1.6 }}>
        Tudo salvo no seu dispositivo 🔒
      </p>
    </main>
  )
}
