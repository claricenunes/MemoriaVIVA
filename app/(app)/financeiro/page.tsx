'use client'

import { useState, useEffect, useId } from 'react'
import GlassCard from '@/components/shared/glass-card'
import PageHeader from '@/components/shared/page-header'
import SectionTitle from '@/components/shared/section-title'
import FloatingAction from '@/components/shared/floating-action'

// ─── Tipos ────────────────────────────────────────────────────────────────
interface Transacao {
  id: string
  descricao: string
  valor: number      // positivo = entrada, negativo = saída
  categoria: string
  emoji: string
  data: string       // YYYY-MM-DD
}

interface Conta {
  id: string
  label: string
  vencimento: string // YYYY-MM-DD
  valor: number
  paga: boolean
}

// ─── Configuração de categorias ───────────────────────────────────────────
const CATS_ENTRADA = [
  { label: 'Aposentadoria', emoji: '💰' },
  { label: 'Salário',       emoji: '💼' },
  { label: 'Transferência', emoji: '🎁' },
  { label: 'Outros',        emoji: '💳' },
]

const CATS_SAIDA = [
  { label: 'Alimentação',  emoji: '🛒' },
  { label: 'Saúde',        emoji: '💊' },
  { label: 'Moradia',      emoji: '🏠' },
  { label: 'Transporte',   emoji: '🚌' },
  { label: 'Lazer',        emoji: '🎭' },
  { label: 'Outros',       emoji: '💳' },
]

// ─── Utilitários ──────────────────────────────────────────────────────────
function brl(v: number): string {
  return Math.abs(v).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function nomeMes(data: Date): string {
  return data.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
}

function hoje(): string {
  return new Date().toISOString().split('T')[0]
}

function diasParaVencer(iso: string): number {
  const d    = new Date(iso + 'T12:00:00')
  const diff = d.getTime() - Date.now()
  return Math.ceil(diff / 86_400_000)
}

const INPUT: React.CSSProperties = {
  padding: '11px 14px', borderRadius: 'var(--mv-radius-md)',
  border: '1.5px solid var(--mv-border)', fontSize: 'var(--mv-text-sm)',
  background: 'var(--mv-bg-secondary)', fontFamily: 'inherit',
  outline: 'none', width: '100%', boxSizing: 'border-box',
}

// ─── Componente principal ─────────────────────────────────────────────────
export default function FinanceiroPage() {
  const uid = useId()
  const [mounted,      setMounted]      = useState(false)
  const [transacoes,   setTransacoes]   = useState<Transacao[]>([])
  const [contas,       setContas]       = useState<Conta[]>([])
  const [formAberto,   setFormAberto]   = useState<'transacao' | 'conta' | null>(null)

  // Estado do form de transação
  const [tipo,        setTipo]        = useState<'entrada' | 'saida'>('saida')
  const [categoria,   setCategoria]   = useState(CATS_SAIDA[0])
  const [descricao,   setDescricao]   = useState('')
  const [valor,       setValor]       = useState('')
  const [dataForm,    setDataForm]    = useState(hoje())

  // Estado do form de conta
  const [cLabel,      setCLabel]      = useState('')
  const [cVenc,       setCVenc]       = useState('')
  const [cValor,      setCValor]      = useState('')

  // ── Persistência ──────────────────────────────────────────────────────
  useEffect(() => {
    setMounted(true)
    try {
      const t = localStorage.getItem('mv-transacoes')
      const c = localStorage.getItem('mv-contas')
      if (t) setTransacoes(JSON.parse(t))
      if (c) setContas(JSON.parse(c))
    } catch { /* ignore */ }
  }, [])

  useEffect(() => {
    if (!mounted) return
    localStorage.setItem('mv-transacoes', JSON.stringify(transacoes))
  }, [transacoes, mounted])

  useEffect(() => {
    if (!mounted) return
    localStorage.setItem('mv-contas', JSON.stringify(contas))
  }, [contas, mounted])

  // ── Cálculos mensais ─────────────────────────────────────────────────
  const mesAtual = hoje().slice(0, 7) // YYYY-MM
  const doMes    = transacoes.filter((t) => t.data.startsWith(mesAtual))
  const entradas = doMes.filter((t) => t.valor > 0).reduce((s, t) => s + t.valor, 0)
  const saidas   = doMes.filter((t) => t.valor < 0).reduce((s, t) => s + Math.abs(t.valor), 0)
  const saldo    = entradas - saidas

  // Contas não pagas, ordenadas por vencimento
  const contasPendentes = contas
    .filter((c) => !c.paga)
    .sort((a, b) => a.vencimento.localeCompare(b.vencimento))

  const contaUrgente = contasPendentes.find((c) => diasParaVencer(c.vencimento) <= 2)

  // ── Handlers ─────────────────────────────────────────────────────────
  function salvarTransacao(e: React.FormEvent) {
    e.preventDefault()
    const v = parseFloat(valor.replace(',', '.'))
    if (!descricao.trim() || isNaN(v) || v <= 0) return
    const nova: Transacao = {
      id: `${Date.now()}-${Math.random()}`,
      descricao: descricao.trim(),
      valor:     tipo === 'entrada' ? v : -v,
      categoria: categoria.label,
      emoji:     categoria.emoji,
      data:      dataForm || hoje(),
    }
    setTransacoes((prev) => [nova, ...prev])
    setDescricao(''); setValor(''); setDataForm(hoje()); setFormAberto(null)
  }

  function deletarTransacao(id: string) {
    setTransacoes((prev) => prev.filter((t) => t.id !== id))
  }

  function salvarConta(e: React.FormEvent) {
    e.preventDefault()
    const v = parseFloat(cValor.replace(',', '.'))
    if (!cLabel.trim() || !cVenc || isNaN(v) || v <= 0) return
    const nova: Conta = { id: `${Date.now()}`, label: cLabel.trim(), vencimento: cVenc, valor: v, paga: false }
    setContas((prev) => [...prev, nova])
    setCLabel(''); setCVenc(''); setCValor(''); setFormAberto(null)
  }

  function marcarPaga(id: string) {
    const conta = contas.find((c) => c.id === id)
    if (!conta) return
    // Move para transações como saída
    const tx: Transacao = {
      id: `${Date.now()}`, descricao: conta.label,
      valor: -conta.valor, categoria: 'Conta', emoji: '📄', data: hoje(),
    }
    setTransacoes((prev) => [tx, ...prev])
    setContas((prev) => prev.filter((c) => c.id !== id))
  }

  // ── Render ────────────────────────────────────────────────────────────
  if (!mounted) return null

  const catsAtuais = tipo === 'entrada' ? CATS_ENTRADA : CATS_SAIDA

  return (
    <main className="mv-shell">
      <PageHeader icon="wallet" color="ambar" title="Financeiro" subtitle={nomeMes(new Date())} />

      {/* Saldo hero */}
      <GlassCard variant="hero" style={{ marginTop: 'var(--mv-space-5)' }}>
        <p style={{ margin: 0, fontSize: 'var(--mv-text-sm)', color: 'var(--mv-text-secondary)', fontWeight: 600 }}>Saldo do mês</p>
        <p style={{ margin: '4px 0 0', fontSize: 'var(--mv-text-display)', fontWeight: 700, lineHeight: 1.1, color: saldo >= 0 ? 'var(--mv-salvia-deep)' : 'var(--mv-terracota-deep)' }}>
          {saldo >= 0 ? '+' : '−'}R$&nbsp;{brl(saldo)}
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--mv-space-3)', marginTop: 'var(--mv-space-4)' }}>
          <div style={{ background: 'var(--mv-salvia-soft)', borderRadius: 'var(--mv-radius-md)', padding: '12px 14px' }}>
            <div style={{ fontSize: 'var(--mv-text-xs)', color: 'var(--mv-salvia-deep)', fontWeight: 700, marginBottom: 4 }}>↑ Entradas</div>
            <div style={{ fontSize: 'var(--mv-text-md)', fontWeight: 700, color: 'var(--mv-salvia-deep)' }}>R$&nbsp;{brl(entradas)}</div>
          </div>
          <div style={{ background: 'var(--mv-terracota-soft)', borderRadius: 'var(--mv-radius-md)', padding: '12px 14px' }}>
            <div style={{ fontSize: 'var(--mv-text-xs)', color: 'var(--mv-terracota-deep)', fontWeight: 700, marginBottom: 4 }}>↓ Saídas</div>
            <div style={{ fontSize: 'var(--mv-text-md)', fontWeight: 700, color: 'var(--mv-terracota-deep)' }}>R$&nbsp;{brl(saidas)}</div>
          </div>
        </div>
      </GlassCard>

      {/* Alerta conta urgente */}
      {contaUrgente && (
        <div className="mv-alert-strip mv-alert-strip--ambar" style={{ marginTop: 'var(--mv-space-4)' }}>
          <i className="ti ti-calendar-due" aria-hidden="true" style={{ fontSize: 20, flexShrink: 0 }} />
          <span className="mv-alert-strip-text">
            {contaUrgente.label} vence {diasParaVencer(contaUrgente.vencimento) <= 0 ? 'hoje' : 'amanhã'} — R$&nbsp;{brl(contaUrgente.valor)}
          </span>
          <button type="button" onClick={() => marcarPaga(contaUrgente.id)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 'var(--mv-text-xs)', fontWeight: 700, color: 'var(--mv-ambar-deep)', flexShrink: 0, padding: 0 }}>
            Pagar
          </button>
        </div>
      )}

      {/* Contas a pagar */}
      {(contasPendentes.length > 0 || formAberto === 'conta') && (
        <>
          <SectionTitle title="Contas a pagar" />
          <GlassCard>
            {contasPendentes.map((conta, i) => {
              const dias  = diasParaVencer(conta.vencimento)
              const urgente = dias <= 2
              return (
                <div key={conta.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--mv-space-3)', paddingBottom: i < contasPendentes.length - 1 ? 'var(--mv-space-3)' : 0, marginBottom: i < contasPendentes.length - 1 ? 'var(--mv-space-3)' : 0, borderBottom: i < contasPendentes.length - 1 ? '1px solid var(--mv-border)' : 'none' }}>
                  <div className={`mv-icon-blob ${urgente ? 'mv-icon-blob--ambar' : 'mv-icon-blob--azul'}`} style={{ width: 40, height: 40, flexShrink: 0 }}>
                    <i className="ti ti-receipt" aria-hidden="true" style={{ fontSize: 16 }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, color: 'var(--mv-text-primary)' }}>{conta.label}</div>
                    <div style={{ fontSize: 'var(--mv-text-xs)', marginTop: 2, fontWeight: urgente ? 700 : 400, color: urgente ? 'var(--mv-ambar-deep)' : 'var(--mv-text-tertiary)' }}>
                      {urgente ? '⚠️ ' : ''}{new Date(conta.vencimento + 'T12:00').toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })}
                      {dias > 0 ? ` · em ${dias} dia${dias > 1 ? 's' : ''}` : ' · hoje'}
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                    <span style={{ fontWeight: 700, color: 'var(--mv-text-primary)', fontSize: 'var(--mv-text-sm)' }}>R$&nbsp;{brl(conta.valor)}</span>
                    <button type="button" onClick={() => marcarPaga(conta.id)}
                      style={{ fontSize: 11, color: 'var(--mv-salvia-deep)', background: 'var(--mv-salvia-soft)', border: 'none', borderRadius: 6, padding: '3px 8px', cursor: 'pointer', fontWeight: 700 }}>
                      ✓ Pago
                    </button>
                  </div>
                </div>
              )
            })}

            {formAberto === 'conta' ? (
              <form onSubmit={salvarConta} style={{ marginTop: contasPendentes.length > 0 ? 'var(--mv-space-4)' : 0, display: 'flex', flexDirection: 'column', gap: 'var(--mv-space-3)', borderTop: contasPendentes.length > 0 ? '1px solid var(--mv-border)' : 'none', paddingTop: contasPendentes.length > 0 ? 'var(--mv-space-4)' : 0 }}>
                <input required placeholder="Nome da conta *" value={cLabel} onChange={(e) => setCLabel(e.target.value)} style={INPUT} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--mv-space-3)' }}>
                  <div>
                    <label style={{ fontSize: 'var(--mv-text-xs)', color: 'var(--mv-text-secondary)', display: 'block', marginBottom: 4 }}>Vencimento *</label>
                    <input required type="date" value={cVenc} onChange={(e) => setCVenc(e.target.value)} style={INPUT} />
                  </div>
                  <div>
                    <label style={{ fontSize: 'var(--mv-text-xs)', color: 'var(--mv-text-secondary)', display: 'block', marginBottom: 4 }}>Valor (R$) *</label>
                    <input required type="number" step="0.01" min="0.01" placeholder="0,00" value={cValor} onChange={(e) => setCValor(e.target.value)} style={INPUT} />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 'var(--mv-space-3)' }}>
                  <button type="button" onClick={() => setFormAberto(null)} className="mv-btn mv-btn--ghost" style={{ flex: 1 }}>Cancelar</button>
                  <button type="submit" className="mv-btn mv-btn--primary" style={{ flex: 2 }}>Salvar conta</button>
                </div>
              </form>
            ) : (
              <button type="button" onClick={() => setFormAberto('conta')} className="mv-btn mv-btn--ghost mv-btn--full" style={{ marginTop: contasPendentes.length > 0 ? 'var(--mv-space-4)' : 0 }}>
                <i className="ti ti-plus" aria-hidden="true" /> Adicionar conta
              </button>
            )}
          </GlassCard>
        </>
      )}

      {contasPendentes.length === 0 && formAberto !== 'conta' && (
        <button type="button" onClick={() => setFormAberto('conta')} className="mv-btn mv-btn--ghost mv-btn--full" style={{ marginTop: 'var(--mv-space-4)' }}>
          <i className="ti ti-calendar-due" aria-hidden="true" /> Adicionar conta a pagar
        </button>
      )}

      {/* Movimentações */}
      <SectionTitle title="Movimentações do mês" />
      <GlassCard>
        {doMes.length === 0 && formAberto !== 'transacao' && (
          <p style={{ margin: 0, textAlign: 'center', color: 'var(--mv-text-tertiary)', fontSize: 'var(--mv-text-sm)', padding: 'var(--mv-space-4) 0' }}>
            Nenhuma movimentação registrada neste mês.<br />
            <span style={{ fontSize: 'var(--mv-text-xs)' }}>Adicione entradas e saídas abaixo.</span>
          </p>
        )}

        {doMes.map((tx, i) => (
          <div key={tx.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--mv-space-3)', paddingBottom: i < doMes.length - 1 ? 'var(--mv-space-3)' : 0, marginBottom: i < doMes.length - 1 ? 'var(--mv-space-3)' : 0, borderBottom: i < doMes.length - 1 ? '1px solid var(--mv-border)' : 'none' }}>
            <div style={{ width: 42, height: 42, borderRadius: 'var(--mv-radius-md)', background: 'var(--mv-bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
              {tx.emoji}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 'var(--mv-text-sm)', fontWeight: 600, color: 'var(--mv-text-primary)' }}>{tx.descricao}</div>
              <div style={{ fontSize: 'var(--mv-text-xs)', color: 'var(--mv-text-tertiary)', marginTop: 2 }}>
                {new Date(tx.data + 'T12:00').toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })} · {tx.categoria}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
              <span style={{ fontWeight: 700, color: tx.valor >= 0 ? 'var(--mv-salvia-deep)' : 'var(--mv-text-primary)' }}>
                {tx.valor >= 0 ? '+' : '−'}R$&nbsp;{brl(tx.valor)}
              </span>
              <button type="button" onClick={() => deletarTransacao(tx.id)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--mv-text-tertiary)', padding: 4, borderRadius: 6, fontSize: 14 }}
                aria-label="Excluir">
                <i className="ti ti-trash" aria-hidden="true" />
              </button>
            </div>
          </div>
        ))}

        {/* Form de nova transação */}
        {formAberto === 'transacao' ? (
          <form onSubmit={salvarTransacao} style={{ marginTop: doMes.length > 0 ? 'var(--mv-space-4)' : 0, display: 'flex', flexDirection: 'column', gap: 'var(--mv-space-3)', borderTop: doMes.length > 0 ? '1px solid var(--mv-border)' : 'none', paddingTop: doMes.length > 0 ? 'var(--mv-space-4)' : 0 }}>
            {/* Tipo entrada/saída */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {(['saida', 'entrada'] as const).map((t) => (
                <button key={t} type="button" onClick={() => { setTipo(t); setCategoria(t === 'entrada' ? CATS_ENTRADA[0] : CATS_SAIDA[0]) }}
                  style={{ padding: '10px', borderRadius: 'var(--mv-radius-md)', border: '2px solid', cursor: 'pointer', fontWeight: 700, fontSize: 'var(--mv-text-sm)', transition: 'all 0.15s', borderColor: tipo === t ? (t === 'entrada' ? 'var(--mv-salvia)' : 'var(--mv-terracota)') : 'var(--mv-border)', background: tipo === t ? (t === 'entrada' ? 'var(--mv-salvia-soft)' : 'var(--mv-terracota-soft)') : 'var(--mv-bg-secondary)', color: tipo === t ? (t === 'entrada' ? 'var(--mv-salvia-deep)' : 'var(--mv-terracota-deep)') : 'var(--mv-text-secondary)' }}>
                  {t === 'entrada' ? '↑ Entrada' : '↓ Saída'}
                </button>
              ))}
            </div>

            {/* Categoria */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--mv-space-2)' }}>
              {catsAtuais.map((cat) => (
                <button key={cat.label} type="button" onClick={() => setCategoria(cat)}
                  className={`mv-chip${categoria.label === cat.label ? ' mv-chip--active' : ''}`}>
                  {cat.emoji} {cat.label}
                </button>
              ))}
            </div>

            <input required placeholder="Descrição *" value={descricao} onChange={(e) => setDescricao(e.target.value)} style={INPUT} />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--mv-space-3)' }}>
              <div>
                <label htmlFor={`${uid}-valor`} style={{ fontSize: 'var(--mv-text-xs)', color: 'var(--mv-text-secondary)', display: 'block', marginBottom: 4 }}>Valor (R$) *</label>
                <input id={`${uid}-valor`} required type="number" step="0.01" min="0.01" placeholder="0,00" value={valor} onChange={(e) => setValor(e.target.value)} style={INPUT} />
              </div>
              <div>
                <label htmlFor={`${uid}-data`} style={{ fontSize: 'var(--mv-text-xs)', color: 'var(--mv-text-secondary)', display: 'block', marginBottom: 4 }}>Data</label>
                <input id={`${uid}-data`} type="date" value={dataForm} onChange={(e) => setDataForm(e.target.value)} style={INPUT} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 'var(--mv-space-3)' }}>
              <button type="button" onClick={() => setFormAberto(null)} className="mv-btn mv-btn--ghost" style={{ flex: 1 }}>Cancelar</button>
              <button type="submit" className="mv-btn mv-btn--primary" style={{ flex: 2 }}>Salvar</button>
            </div>
          </form>
        ) : (
          <button type="button" onClick={() => setFormAberto('transacao')} className="mv-btn mv-btn--ghost mv-btn--full" style={{ marginTop: doMes.length > 0 ? 'var(--mv-space-4)' : 0 }}>
            <i className="ti ti-plus" aria-hidden="true" /> Nova movimentação
          </button>
        )}
      </GlassCard>

      <FloatingAction variant="add" label="Nova movimentação" />
    </main>
  )
}
