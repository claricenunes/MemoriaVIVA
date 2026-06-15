'use client'
import { useState, useEffect } from 'react'
import GlassCard from '@/components/shared/glass-card'
import PageHeader from '@/components/shared/page-header'
import BackButton from '@/components/shared/back-button'

interface Item {
  id: string
  texto: string
  feito: boolean
}

const SUGESTOES = [
  'Pão', 'Leite', 'Ovos', 'Frango', 'Arroz', 'Feijão',
  'Banana', 'Maçã', 'Laranja', 'Iogurte', 'Queijo', 'Café',
]

export default function ListaDeComprasPage() {
  const [itens, setItens] = useState<Item[]>([])
  const [input, setInput] = useState('')
  const [pronto, setPronto] = useState(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem('mv-lista-compras')
      if (saved) setItens(JSON.parse(saved))
    } catch { /* ignore */ }
    setPronto(true)
  }, [])

  function salvar(next: Item[]) {
    setItens(next)
    localStorage.setItem('mv-lista-compras', JSON.stringify(next))
  }

  function adicionar(texto: string) {
    const t = texto.trim()
    if (!t) return
    salvar([...itens, { id: Date.now().toString(), texto: t, feito: false }])
    setInput('')
  }

  function toggleFeito(id: string) {
    salvar(itens.map(item => item.id === id ? { ...item, feito: !item.feito } : item))
  }

  function remover(id: string) {
    salvar(itens.filter(item => item.id !== id))
  }

  function limparFeitos() {
    salvar(itens.filter(item => !item.feito))
  }

  if (!pronto) return null

  const pendentes = itens.filter(i => !i.feito)
  const feitos    = itens.filter(i => i.feito)

  return (
    <main className="mv-shell">
      <BackButton href="/mais" label="Mais" />
      <PageHeader icon="shopping-cart" color="salvia" title="Lista de Compras" />

      {/* Adicionar item */}
      <GlassCard>
        <div style={{ display: 'flex', gap: 'var(--mv-space-3)' }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && adicionar(input)}
            placeholder="O que precisa comprar?"
            autoFocus
            style={{
              flex: 1, border: '1.5px solid var(--mv-border)', borderRadius: 14,
              padding: '13px 16px', fontFamily: 'var(--mv-font)',
              fontSize: 'var(--mv-text-md)', outline: 'none',
              background: 'var(--mv-bg-secondary)', color: 'var(--mv-text-primary)',
              minWidth: 0,
            }}
          />
          <button
            type="button"
            onClick={() => adicionar(input)}
            className="mv-btn mv-btn--primary"
            style={{ flexShrink: 0, padding: '0 20px', borderRadius: 14 }}
          >
            <i className="ti ti-plus" aria-hidden="true" />
          </button>
        </div>

        {/* Sugestões rápidas */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 'var(--mv-space-4)' }}>
          {SUGESTOES.filter(s => !itens.some(i => i.texto.toLowerCase() === s.toLowerCase())).slice(0, 6).map(s => (
            <button
              key={s}
              type="button"
              onClick={() => adicionar(s)}
              className="mv-chip"
              style={{ fontSize: 'var(--mv-text-sm)', minHeight: 38 }}
            >
              + {s}
            </button>
          ))}
        </div>
      </GlassCard>

      {/* Itens pendentes */}
      {pendentes.length > 0 && (
        <>
          <p style={{ margin: 'var(--mv-space-5) 0 var(--mv-space-3) 4px', fontSize: 'var(--mv-text-xs)', fontWeight: 700, color: 'var(--mv-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
            {pendentes.length} {pendentes.length === 1 ? 'item' : 'itens'} para comprar
          </p>
          <GlassCard style={{ padding: 0, overflow: 'hidden' }}>
            {pendentes.map((item, i) => (
              <div
                key={item.id}
                style={{
                  display: 'flex', alignItems: 'center', gap: 'var(--mv-space-3)',
                  padding: '14px 16px',
                  borderBottom: i < pendentes.length - 1 ? '1px solid var(--mv-border)' : 'none',
                }}
              >
                <button
                  type="button"
                  onClick={() => toggleFeito(item.id)}
                  aria-label="Marcar como comprado"
                  style={{
                    width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                    border: '2px solid var(--mv-salvia)', background: 'transparent',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                />
                <span style={{ flex: 1, fontSize: 'var(--mv-text-md)', color: 'var(--mv-text-primary)', fontWeight: 500 }}>
                  {item.texto}
                </span>
                <button type="button" onClick={() => remover(item.id)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--mv-text-tertiary)', fontSize: 18, padding: 4 }}>
                  <i className="ti ti-x" aria-hidden="true" />
                </button>
              </div>
            ))}
          </GlassCard>
        </>
      )}

      {/* Itens comprados */}
      {feitos.length > 0 && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: 'var(--mv-space-5) 0 var(--mv-space-3)' }}>
            <p style={{ margin: 0, fontSize: 'var(--mv-text-xs)', fontWeight: 700, color: 'var(--mv-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
              Já comprados ({feitos.length})
            </p>
            <button type="button" onClick={limparFeitos}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 'var(--mv-text-xs)', color: 'var(--mv-text-tertiary)', fontFamily: 'var(--mv-font)', fontWeight: 600 }}>
              Limpar
            </button>
          </div>
          <GlassCard style={{ padding: 0, overflow: 'hidden' }}>
            {feitos.map((item, i) => (
              <div
                key={item.id}
                style={{
                  display: 'flex', alignItems: 'center', gap: 'var(--mv-space-3)',
                  padding: '14px 16px',
                  borderBottom: i < feitos.length - 1 ? '1px solid var(--mv-border)' : 'none',
                  opacity: 0.55,
                }}
              >
                <button
                  type="button"
                  onClick={() => toggleFeito(item.id)}
                  aria-label="Desmarcar"
                  style={{
                    width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                    border: '2px solid var(--mv-salvia)', background: 'var(--mv-salvia)',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontSize: 14,
                  }}
                >
                  <i className="ti ti-check" aria-hidden="true" />
                </button>
                <span style={{ flex: 1, fontSize: 'var(--mv-text-md)', color: 'var(--mv-text-secondary)', textDecoration: 'line-through' }}>
                  {item.texto}
                </span>
              </div>
            ))}
          </GlassCard>
        </>
      )}

      {itens.length === 0 && (
        <div style={{ textAlign: 'center', padding: 'var(--mv-space-10) var(--mv-space-4)', color: 'var(--mv-text-tertiary)' }}>
          <div style={{ fontSize: 56, marginBottom: 12 }}>🛒</div>
          <p style={{ margin: 0, fontSize: 'var(--mv-text-md)', fontWeight: 600 }}>Lista vazia</p>
          <p style={{ margin: '6px 0 0', fontSize: 'var(--mv-text-sm)', lineHeight: 1.5 }}>
            Adicione o que precisa comprar acima
          </p>
        </div>
      )}
    </main>
  )
}
