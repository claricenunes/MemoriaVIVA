'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import GlassCard from '@/components/shared/glass-card'
import PageHeader from '@/components/shared/page-header'
import BackButton from '@/components/shared/back-button'

type Item = { id: string; item: string; lugar: string; quando: string }

const ITENS_RAPIDOS = [
  { item: 'Óculos',      emoji: '👓' },
  { item: 'Chaves',      emoji: '🔑' },
  { item: 'Documentos',  emoji: '📄' },
  { item: 'Carteira',    emoji: '👜' },
  { item: 'Remédios',    emoji: '💊' },
  { item: 'Celular',     emoji: '📱' },
]

function carregarItens(): Item[] {
  try { return JSON.parse(localStorage.getItem('mv-onde-guardei') ?? '[]') } catch { return [] }
}

function formatarHora(iso: string) {
  try {
    const d = new Date(iso)
    const hoje = new Date().toDateString() === d.toDateString()
    if (hoje) return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    return d.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })
  } catch { return '' }
}

export default function OndeGuardeiPage() {
  const [itens, setItens]   = useState<Item[]>([])
  const [pronto, setPronto] = useState(false)
  const [form, setForm]     = useState({ item: '', lugar: '' })

  useEffect(() => { setItens(carregarItens()); setPronto(true) }, [])

  function salvar(next: Item[]) {
    setItens(next)
    localStorage.setItem('mv-onde-guardei', JSON.stringify(next))
  }

  function add() {
    const it = form.item.trim()
    const lu = form.lugar.trim()
    if (!it || !lu) return
    const novo: Item = { id: Date.now().toString(), item: it, lugar: lu, quando: new Date().toISOString() }
    salvar([novo, ...itens])
    setForm({ item: '', lugar: '' })
  }

  function remove(id: string) { salvar(itens.filter((i) => i.id !== id)) }

  if (!pronto) return null

  return (
    <main className="mv-shell">
      <BackButton href="/mais" label="Mais" />

      <PageHeader icon="map-pin" color="salvia" title="Onde Guardei" />

      {/* Atalhos rápidos */}
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4, marginTop: 'var(--mv-space-5)', scrollbarWidth: 'none' }}>
        {ITENS_RAPIDOS.map(({ item, emoji }) => (
          <button key={item} type="button"
            onClick={() => setForm((f) => ({ ...f, item }))}
            className={`mv-chip${form.item === item ? ' mv-chip--active' : ''}`}
            style={{ flexShrink: 0 }}>
            {emoji} {item}
          </button>
        ))}
      </div>

      {/* Formulário */}
      <GlassCard style={{ marginTop: 'var(--mv-space-4)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--mv-space-3)', marginBottom: 'var(--mv-space-3)' }}>
          <div>
            <label style={{ display: 'block', fontSize: 'var(--mv-text-xs)', fontWeight: 600, color: 'var(--mv-text-secondary)', marginBottom: 6 }}>O quê?</label>
            <input
              value={form.item}
              onChange={(e) => setForm((f) => ({ ...f, item: e.target.value }))}
              placeholder="Meus óculos"
              style={INPUT}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 'var(--mv-text-xs)', fontWeight: 600, color: 'var(--mv-text-secondary)', marginBottom: 6 }}>Onde?</label>
            <input
              value={form.lugar}
              onChange={(e) => setForm((f) => ({ ...f, lugar: e.target.value }))}
              onKeyDown={(e) => e.key === 'Enter' && add()}
              placeholder="Criado-mudo"
              style={INPUT}
            />
          </div>
        </div>
        <button type="button" onClick={add} className="mv-btn mv-btn--primary mv-btn--full">
          <i className="ti ti-map-pin" aria-hidden="true" /> Registrar
        </button>
      </GlassCard>

      {itens.length > 0 && (
        <>
          <p style={{ margin: 'var(--mv-space-5) 0 var(--mv-space-3) 4px', fontSize: 'var(--mv-text-xs)', fontWeight: 700, color: 'var(--mv-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
            Últimos registros
          </p>
          <GlassCard style={{ padding: 0, overflow: 'hidden' }}>
            {itens.map((it, i) => (
              <div key={it.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--mv-space-3)', padding: '14px 16px', borderBottom: i < itens.length - 1 ? '1px solid var(--mv-border)' : 'none' }}>
                <div className="mv-icon-blob mv-icon-blob--salvia" style={{ width: 40, height: 40, flexShrink: 0 }}>
                  <i className="ti ti-map-pin" aria-hidden="true" style={{ fontSize: 16 }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 'var(--mv-text-sm)', color: 'var(--mv-text-primary)' }}>{it.item}</div>
                  <div style={{ fontSize: 'var(--mv-text-xs)', color: 'var(--mv-text-secondary)', marginTop: 2 }}>
                    📍 {it.lugar} · {formatarHora(it.quando)}
                  </div>
                </div>
                <button type="button" onClick={() => remove(it.id)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--mv-text-tertiary)', fontSize: 18, padding: '4px', lineHeight: 1, flexShrink: 0 }}>
                  <i className="ti ti-x" aria-hidden="true" />
                </button>
              </div>
            ))}
          </GlassCard>
        </>
      )}

      {itens.length === 0 && (
        <div style={{ textAlign: 'center', padding: 'var(--mv-space-8) 0', color: 'var(--mv-text-tertiary)' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
          <p style={{ margin: 0, fontSize: 'var(--mv-text-sm)' }}>Nenhum registro ainda.<br />Comece guardando os seus óculos!</p>
        </div>
      )}

      <p style={{ textAlign: 'center', fontSize: 'var(--mv-text-xs)', color: 'var(--mv-text-tertiary)', padding: 'var(--mv-space-5) 0 var(--mv-space-4)' }}>
        Salvo no seu dispositivo 🔒
      </p>
    </main>
  )
}

const INPUT: React.CSSProperties = {
  width: '100%', padding: '10px 12px',
  border: '1.5px solid var(--mv-border)', borderRadius: 12,
  fontFamily: 'var(--mv-font)', fontSize: 'var(--mv-text-sm)',
  background: 'transparent', color: 'var(--mv-text-primary)',
  outline: 'none', boxSizing: 'border-box',
}
