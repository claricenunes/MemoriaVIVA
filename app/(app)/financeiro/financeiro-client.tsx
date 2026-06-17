'use client'

import { useState, useTransition, useId } from 'react'
import { useRouter } from 'next/navigation'
import GlassCard from '@/components/shared/glass-card'
import PageHeader from '@/components/shared/page-header'
import SectionTitle from '@/components/shared/section-title'
import {
  adicionarTransacao,
  deletarTransacao,
  adicionarConta,
  marcarContaPaga,
} from '@/actions/financeiro'
import type { FinanceiroTransacao, FinanceiroConta } from '@/lib/types/database'

// ─── Categorias ───────────────────────────────────────────────────────────────
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

// ─── Utilitários ──────────────────────────────────────────────────────────────
function brl(v: number): string {
  return Math.abs(v).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function nomeMes(date: Date): string {
  return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
}

function hoje(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function diasParaVencer(iso: string): number {
  const diff = new Date(iso + 'T12:00:00').getTime() - Date.now()
  return Math.ceil(diff / 86_400_000)
}

const INPUT: React.CSSProperties = {
  padding: '11px 14px', borderRadius: 'var(--mv-radius-md)',
  border: '1.5px solid var(--mv-border)', fontSize: 'var(--mv-text-sm)',
  background: 'var(--mv-bg-secondary)', fontFamily: 'inherit',
  outline: 'none', width: '100%', boxSizing: 'border-box',
}

// ─── Props ────────────────────────────────────────────────────────────────────
interface Props {
  transacoesIniciais: FinanceiroTransacao[]
  contasIniciais: FinanceiroConta[]
}

// ─── Componente ───────────────────────────────────────────────────────────────
export default function FinanceiroClient({ transacoesIniciais, contasIniciais }: Props) {
  const router = useRouter()
  const uid = useId()
  const [isPending, startTransition] = useTransition()

  const [formAberto,  setFormAberto]  = useState<'transacao' | 'conta' | null>(null)
  const [erro,        setErro]        = useState<string | null>(null)

  // Form transação
  const [tipo,      setTipo]      = useState<'entrada' | 'saida'>('saida')
  const [categoria, setCategoria] = useState(CATS_SAIDA[0])
  const [descricao, setDescricao] = useState('')
  const [valor,     setValor]     = useState('')
  const [dataForm,  setDataForm]  = useState(hoje())

  // Form conta
  const [cLabel, setCLabel] = useState('')
  const [cVenc,  setCVenc]  = useState('')
  const [cValor, setCValor] = useState('')

  // ── Cálculos (sobre dados do servidor) ──────────────────────────────────────
  const transacoes = transacoesIniciais
  const contas     = contasIniciais

  const entradas = transacoes.filter((t) => t.valor > 0).reduce((s, t) => s + t.valor, 0)
  const saidas   = transacoes.filter((t) => t.valor < 0).reduce((s, t) => s + Math.abs(t.valor), 0)
  const saldo    = entradas - saidas

  const contasPendentes = [...contas].sort((a, b) => a.vencimento.localeCompare(b.vencimento))
  const contaUrgente    = contasPendentes.find((c) => diasParaVencer(c.vencimento) <= 2)

  // ── Handlers ──────────────────────────────────────────────────────────────
  function handleSalvarTransacao(e: React.FormEvent) {
    e.preventDefault()
    setErro(null)
    const v = parseFloat(valor.replace(',', '.'))
    if (!descricao.trim() || isNaN(v) || v <= 0) return

    const fd = new FormData()
    fd.append('descricao', descricao.trim())
    fd.append('valor', String(v))
    fd.append('categoria', categoria.label)
    fd.append('emoji', categoria.emoji)
    fd.append('data', dataForm || hoje())
    fd.append('tipo', tipo)

    startTransition(async () => {
      const res = await adicionarTransacao(fd)
      if ('error' in res) { setErro(res.error); return }
      setDescricao(''); setValor(''); setDataForm(hoje()); setFormAberto(null)
      router.refresh()
    })
  }

  function handleDeletarTransacao(id: string) {
    setErro(null)
    startTransition(async () => {
      const res = await deletarTransacao(id)
      if ('error' in res) { setErro(res.error); return }
      router.refresh()
    })
  }

  function handleSalvarConta(e: React.FormEvent) {
    e.preventDefault()
    setErro(null)
    const v = parseFloat(cValor.replace(',', '.'))
    if (!cLabel.trim() || !cVenc || isNaN(v) || v <= 0) return

    const fd = new FormData()
    fd.append('label', cLabel.trim())
    fd.append('vencimento', cVenc)
    fd.append('valor', String(v))

    startTransition(async () => {
      const res = await adicionarConta(fd)
      if ('error' in res) { setErro(res.error); return }
      setCLabel(''); setCVenc(''); setCValor(''); setFormAberto(null)
      router.refresh()
    })
  }

  function handleMarcarPaga(id: string) {
    setErro(null)
    startTransition(async () => {
      const res = await marcarContaPaga(id)
      if ('error' in res) { setErro(res.error); return }
      router.refresh()
    })
  }

  const catsAtuais = tipo === 'entrada' ? CATS_ENTRADA : CATS_SAIDA

  // ── Render ────────────────────────────────────────────────────────────────
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

      {/* Erro global */}
      {erro && (
        <div className="mv-alert-strip mv-alert-strip--terracota" style={{ marginTop: 'var(--mv-space-4)' }}>
          <i className="ti ti-alert-circle" aria-hidden="true" style={{ fontSize: 18, flexShrink: 0 }} />
          <span className="mv-alert-strip-text">{erro}</span>
        </div>
      )}

      {/* Alerta conta urgente */}
      {contaUrgente && (
        <div className="mv-alert-strip mv-alert-strip--ambar" style={{ marginTop: 'var(--mv-space-4)' }}>
          <i className="ti ti-calendar-due" aria-hidden="true" style={{ fontSize: 20, flexShrink: 0 }} />
          <span className="mv-alert-strip-text">
            {contaUrgente.label} vence {diasParaVencer(contaUrgente.vencimento) <= 0 ? 'hoje' : 'amanhã'} — R$&nbsp;{brl(contaUrgente.valor)}
          </span>
          <button type="button" onClick={() => handleMarcarPaga(contaUrgente.id)} disabled={isPending}
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
              const dias    = diasParaVencer(conta.vencimento)
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
                    <button type="button" onClick={() => handleMarcarPaga(conta.id)} disabled={isPending}
                      style={{ fontSize: 11, color: 'var(--mv-salvia-deep)', background: 'var(--mv-salvia-soft)', border: 'none', borderRadius: 6, padding: '3px 8px', cursor: 'pointer', fontWeight: 700, opacity: isPending ? 0.5 : 1 }}>
                      ✓ Pago
                    </button>
                  </div>
                </div>
              )
            })}

            {formAberto === 'conta' ? (
              <form onSubmit={handleSalvarConta} style={{ marginTop: contasPendentes.length > 0 ? 'var(--mv-space-4)' : 0, display: 'flex', flexDirection: 'column', gap: 'var(--mv-space-3)', borderTop: contasPendentes.length > 0 ? '1px solid var(--mv-border)' : 'none', paddingTop: contasPendentes.length > 0 ? 'var(--mv-space-4)' : 0 }}>
                <input required placeholder="Nome da conta *" value={cLabel} onChange={(e) => setCLabel(e.target.value)} style={INPUT} disabled={isPending} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--mv-space-3)' }}>
                  <div>
                    <label style={{ fontSize: 'var(--mv-text-xs)', color: 'var(--mv-text-secondary)', display: 'block', marginBottom: 4 }}>Vencimento *</label>
                    <input required type="date" value={cVenc} onChange={(e) => setCVenc(e.target.value)} style={INPUT} disabled={isPending} />
                  </div>
                  <div>
                    <label style={{ fontSize: 'var(--mv-text-xs)', color: 'var(--mv-text-secondary)', display: 'block', marginBottom: 4 }}>Valor (R$) *</label>
                    <input required type="number" step="0.01" min="0.01" placeholder="0,00" value={cValor} onChange={(e) => setCValor(e.target.value)} style={INPUT} disabled={isPending} />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 'var(--mv-space-3)' }}>
                  <button type="button" onClick={() => setFormAberto(null)} className="mv-btn mv-btn--ghost" style={{ flex: 1 }} disabled={isPending}>Cancelar</button>
                  <button type="submit" className="mv-btn mv-btn--primary" style={{ flex: 2 }} disabled={isPending}>
                    {isPending ? 'Salvando…' : 'Salvar conta'}
                  </button>
                </div>
              </form>
            ) : (
              <button type="button" onClick={() => setFormAberto('conta')} className="mv-btn mv-btn--ghost mv-btn--full" style={{ marginTop: contasPendentes.length > 0 ? 'var(--mv-space-4)' : 0 }} disabled={isPending}>
                <i className="ti ti-plus" aria-hidden="true" /> Adicionar conta
              </button>
            )}
          </GlassCard>
        </>
      )}

      {contasPendentes.length === 0 && formAberto !== 'conta' && (
        <button type="button" onClick={() => setFormAberto('conta')} className="mv-btn mv-btn--ghost mv-btn--full" style={{ marginTop: 'var(--mv-space-4)' }} disabled={isPending}>
          <i className="ti ti-calendar-due" aria-hidden="true" /> Adicionar conta a pagar
        </button>
      )}

      {/* Movimentações */}
      <SectionTitle title="Movimentações do mês" />
      <GlassCard>
        {transacoes.length === 0 && formAberto !== 'transacao' && (
          <p style={{ margin: 0, textAlign: 'center', color: 'var(--mv-text-tertiary)', fontSize: 'var(--mv-text-sm)', padding: 'var(--mv-space-4) 0' }}>
            Nenhuma movimentação registrada neste mês.<br />
            <span style={{ fontSize: 'var(--mv-text-xs)' }}>Adicione entradas e saídas abaixo.</span>
          </p>
        )}

        {transacoes.map((tx, i) => (
          <div key={tx.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--mv-space-3)', paddingBottom: i < transacoes.length - 1 ? 'var(--mv-space-3)' : 0, marginBottom: i < transacoes.length - 1 ? 'var(--mv-space-3)' : 0, borderBottom: i < transacoes.length - 1 ? '1px solid var(--mv-border)' : 'none' }}>
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
              <button type="button" onClick={() => handleDeletarTransacao(tx.id)} disabled={isPending}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--mv-text-tertiary)', padding: 4, borderRadius: 6, fontSize: 14, opacity: isPending ? 0.4 : 1 }}
                aria-label="Excluir">
                <i className="ti ti-trash" aria-hidden="true" />
              </button>
            </div>
          </div>
        ))}

        {/* Form nova transação */}
        {formAberto === 'transacao' ? (
          <form onSubmit={handleSalvarTransacao} style={{ marginTop: transacoes.length > 0 ? 'var(--mv-space-4)' : 0, display: 'flex', flexDirection: 'column', gap: 'var(--mv-space-3)', borderTop: transacoes.length > 0 ? '1px solid var(--mv-border)' : 'none', paddingTop: transacoes.length > 0 ? 'var(--mv-space-4)' : 0 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {(['saida', 'entrada'] as const).map((t) => (
                <button key={t} type="button" disabled={isPending}
                  onClick={() => { setTipo(t); setCategoria(t === 'entrada' ? CATS_ENTRADA[0] : CATS_SAIDA[0]) }}
                  style={{ padding: '10px', borderRadius: 'var(--mv-radius-md)', border: '2px solid', cursor: 'pointer', fontWeight: 700, fontSize: 'var(--mv-text-sm)', transition: 'all 0.15s', borderColor: tipo === t ? (t === 'entrada' ? 'var(--mv-salvia)' : 'var(--mv-terracota)') : 'var(--mv-border)', background: tipo === t ? (t === 'entrada' ? 'var(--mv-salvia-soft)' : 'var(--mv-terracota-soft)') : 'var(--mv-bg-secondary)', color: tipo === t ? (t === 'entrada' ? 'var(--mv-salvia-deep)' : 'var(--mv-terracota-deep)') : 'var(--mv-text-secondary)' }}>
                  {t === 'entrada' ? '↑ Entrada' : '↓ Saída'}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--mv-space-2)' }}>
              {catsAtuais.map((cat) => (
                <button key={cat.label} type="button" disabled={isPending}
                  onClick={() => setCategoria(cat)}
                  className={`mv-chip${categoria.label === cat.label ? ' mv-chip--active' : ''}`}>
                  {cat.emoji} {cat.label}
                </button>
              ))}
            </div>

            <input required placeholder="Descrição *" value={descricao} onChange={(e) => setDescricao(e.target.value)} style={INPUT} disabled={isPending} />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--mv-space-3)' }}>
              <div>
                <label htmlFor={`${uid}-valor`} style={{ fontSize: 'var(--mv-text-xs)', color: 'var(--mv-text-secondary)', display: 'block', marginBottom: 4 }}>Valor (R$) *</label>
                <input id={`${uid}-valor`} required type="number" step="0.01" min="0.01" placeholder="0,00" value={valor} onChange={(e) => setValor(e.target.value)} style={INPUT} disabled={isPending} />
              </div>
              <div>
                <label htmlFor={`${uid}-data`} style={{ fontSize: 'var(--mv-text-xs)', color: 'var(--mv-text-secondary)', display: 'block', marginBottom: 4 }}>Data</label>
                <input id={`${uid}-data`} type="date" value={dataForm} onChange={(e) => setDataForm(e.target.value)} style={INPUT} disabled={isPending} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 'var(--mv-space-3)' }}>
              <button type="button" onClick={() => setFormAberto(null)} className="mv-btn mv-btn--ghost" style={{ flex: 1 }} disabled={isPending}>Cancelar</button>
              <button type="submit" className="mv-btn mv-btn--primary" style={{ flex: 2 }} disabled={isPending}>
                {isPending ? 'Salvando…' : 'Salvar'}
              </button>
            </div>
          </form>
        ) : (
          <button type="button" onClick={() => setFormAberto('transacao')} className="mv-btn mv-btn--ghost mv-btn--full" style={{ marginTop: transacoes.length > 0 ? 'var(--mv-space-4)' : 0 }} disabled={isPending}>
            <i className="ti ti-plus" aria-hidden="true" /> Nova movimentação
          </button>
        )}
      </GlassCard>

      <div style={{ height: 'var(--mv-space-6)' }} />
    </main>
  )
}
