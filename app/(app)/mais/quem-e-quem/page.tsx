'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import GlassCard from '@/components/shared/glass-card'
import PageHeader from '@/components/shared/page-header'
import BackButton from '@/components/shared/back-button'

const EMOJIS_P = ['👩', '👨', '👵', '👴', '👧', '👦', '🧒', '👶', '👩‍⚕️', '👨‍⚕️', '🧕', '🧑']
const RELACOES = ['Marido / Esposa', 'Filho / Filha', 'Neto / Neta', 'Irmão / Irmã', 'Amigo / Amiga', 'Médico / Médica', 'Cuidador/a', 'Vizinho / Vizinha', 'Outro']

type Pessoa = { id: string; emoji: string; nome: string; relacao: string; telefone: string; nota: string }

const FORM_VAZIO: Omit<Pessoa, 'id'> = { emoji: '👩', nome: '', relacao: 'Filho / Filha', telefone: '', nota: '' }

const INPUT: React.CSSProperties = {
  display: 'block', width: '100%', padding: '10px 14px',
  border: '1.5px solid var(--mv-border)', borderRadius: 12,
  fontFamily: 'var(--mv-font)', fontSize: 'var(--mv-text-sm)',
  background: 'transparent', color: 'var(--mv-text-primary)',
  outline: 'none', boxSizing: 'border-box',
}

function carregarPessoas(): Pessoa[] {
  try { return JSON.parse(localStorage.getItem('mv-pessoas') ?? '[]') } catch { return [] }
}

export default function QuemEQuemPage() {
  const [pessoas, setPessoas] = useState<Pessoa[]>([])
  const [pronto, setPronto]   = useState(false)
  const [form, setForm]       = useState(FORM_VAZIO)
  const [adicionando, setAdicionando] = useState(false)

  useEffect(() => { setPessoas(carregarPessoas()); setPronto(true) }, [])

  function salvar(next: Pessoa[]) {
    setPessoas(next)
    localStorage.setItem('mv-pessoas', JSON.stringify(next))
  }

  function add() {
    if (!form.nome.trim()) return
    salvar([...pessoas, { ...form, id: Date.now().toString() }])
    setForm(FORM_VAZIO)
    setAdicionando(false)
  }

  function remove(id: string) { salvar(pessoas.filter((p) => p.id !== id)) }

  if (!pronto) return null

  return (
    <main className="mv-shell">
      <BackButton href="/mais" label="Mais" />

      <PageHeader icon="users" color="azul" title="Quem é Quem" />

      {pessoas.length === 0 && !adicionando ? (
        <GlassCard variant="hero" style={{ marginTop: 'var(--mv-space-5)', textAlign: 'center' }}>
          <div style={{ fontSize: 56, marginBottom: 12, lineHeight: 1 }}>👨‍👩‍👧</div>
          <p style={{ margin: 0, fontWeight: 700, fontSize: 'var(--mv-text-lg)', color: 'var(--mv-text-primary)' }}>
            Nenhuma pessoa cadastrada
          </p>
          <p style={{ margin: '6px 0 var(--mv-space-4)', color: 'var(--mv-text-secondary)', fontSize: 'var(--mv-text-sm)' }}>
            Adicione as pessoas que fazem parte da sua vida
          </p>
          <button type="button" onClick={() => setAdicionando(true)} className="mv-btn mv-btn--primary mv-btn--full">
            <i className="ti ti-plus" aria-hidden="true" /> Adicionar pessoa
          </button>
        </GlassCard>
      ) : (
        <>
          <div style={{ marginTop: 'var(--mv-space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--mv-space-3)' }}>
            {pessoas.map((p) => (
              <GlassCard key={p.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--mv-space-3)' }}>
                <div style={{ fontSize: 44, lineHeight: 1, flexShrink: 0, marginTop: 2 }}>{p.emoji}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 'var(--mv-text-md)', color: 'var(--mv-text-primary)' }}>{p.nome}</div>
                  <div style={{ fontSize: 'var(--mv-text-xs)', color: 'var(--mv-text-secondary)', marginTop: 2 }}>{p.relacao}</div>
                  {p.telefone && (
                    <a href={`tel:${p.telefone.replace(/\D/g, '')}`}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 5, marginTop: 8, fontSize: 'var(--mv-text-sm)', fontWeight: 700, color: 'var(--mv-azul-deep)', textDecoration: 'none' }}>
                      <i className="ti ti-phone-call" aria-hidden="true" /> {p.telefone}
                    </a>
                  )}
                  {p.nota && (
                    <p style={{ margin: '6px 0 0', fontSize: 'var(--mv-text-xs)', color: 'var(--mv-text-secondary)', lineHeight: 1.5 }}>{p.nota}</p>
                  )}
                </div>
                <button type="button" onClick={() => remove(p.id)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--mv-text-tertiary)', fontSize: 18, padding: '4px', lineHeight: 1, flexShrink: 0 }}>
                  <i className="ti ti-trash" aria-hidden="true" />
                </button>
              </GlassCard>
            ))}
          </div>

          {!adicionando && (
            <button type="button" onClick={() => setAdicionando(true)}
              className="mv-btn mv-btn--ghost mv-btn--full" style={{ marginTop: 'var(--mv-space-4)' }}>
              <i className="ti ti-plus" aria-hidden="true" /> Adicionar pessoa
            </button>
          )}
        </>
      )}

      {adicionando && (
        <GlassCard style={{ marginTop: 'var(--mv-space-4)' }}>
          <p style={{ margin: '0 0 var(--mv-space-3)', fontWeight: 700, fontSize: 'var(--mv-text-sm)', color: 'var(--mv-text-primary)' }}>Nova pessoa</p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 'var(--mv-space-4)' }}>
            {EMOJIS_P.map((e) => (
              <button key={e} type="button" onClick={() => setForm((f) => ({ ...f, emoji: e }))}
                style={{ fontSize: 24, background: form.emoji === e ? 'var(--mv-terracota-soft)' : 'var(--mv-border)', border: form.emoji === e ? '2px solid var(--mv-terracota)' : '2px solid transparent', borderRadius: 10, padding: '4px 7px', cursor: 'pointer', lineHeight: 1, transition: 'all 0.15s' }}>
                {e}
              </button>
            ))}
          </div>

          <input value={form.nome} onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value }))} placeholder="Nome *" style={INPUT} />

          <select value={form.relacao} onChange={(e) => setForm((f) => ({ ...f, relacao: e.target.value }))}
            style={{ ...INPUT, marginTop: 10 }}>
            {RELACOES.map((r) => <option key={r}>{r}</option>)}
          </select>

          <input value={form.telefone} onChange={(e) => setForm((f) => ({ ...f, telefone: e.target.value }))}
            placeholder="Telefone (opcional)" type="tel" style={{ ...INPUT, marginTop: 10 }} />

          <input value={form.nota} onChange={(e) => setForm((f) => ({ ...f, nota: e.target.value }))}
            placeholder="Nota (ex: minha filha mais velha)" style={{ ...INPUT, marginTop: 10 }} />

          <div style={{ display: 'flex', gap: 'var(--mv-space-3)', marginTop: 'var(--mv-space-4)' }}>
            <button type="button" onClick={() => { setAdicionando(false); setForm(FORM_VAZIO) }}
              className="mv-btn mv-btn--ghost" style={{ flex: 1 }}>
              Cancelar
            </button>
            <button type="button" onClick={add} className="mv-btn mv-btn--primary" style={{ flex: 2 }}>
              Salvar
            </button>
          </div>
        </GlassCard>
      )}

      <p style={{ textAlign: 'center', fontSize: 'var(--mv-text-xs)', color: 'var(--mv-text-tertiary)', padding: 'var(--mv-space-6) 0 var(--mv-space-4)' }}>
        Salvo no seu dispositivo 🔒
      </p>
    </main>
  )
}
