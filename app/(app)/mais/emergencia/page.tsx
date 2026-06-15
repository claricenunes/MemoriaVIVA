'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import GlassCard from '@/components/shared/glass-card'
import PageHeader from '@/components/shared/page-header'
import BackButton from '@/components/shared/back-button'

type Contato = { id: string; nome: string; telefone: string; relacao: string }
type DadosEmergencia = {
  meu_nome: string
  tipo_sanguineo: string
  alergias: string
  condicoes: string
  medicamentos_resumo: string
  medico_nome: string
  medico_tel: string
  hospital: string
  contatos: Contato[]
}

const VAZIO: DadosEmergencia = {
  meu_nome: '', tipo_sanguineo: '', alergias: '', condicoes: '',
  medicamentos_resumo: '', medico_nome: '', medico_tel: '', hospital: '',
  contatos: [],
}

const TIPOS_SANGUINEOS = ['A+', 'A−', 'B+', 'B−', 'AB+', 'AB−', 'O+', 'O−', 'Não sei']

const INPUT: React.CSSProperties = {
  display: 'block', width: '100%', padding: '10px 14px',
  border: '1.5px solid var(--mv-border)', borderRadius: 12,
  fontFamily: 'var(--mv-font)', fontSize: 'var(--mv-text-sm)',
  background: 'transparent', color: 'var(--mv-text-primary)',
  outline: 'none', boxSizing: 'border-box',
}

function carregar(): DadosEmergencia {
  try {
    const s = localStorage.getItem('mv-emergencia')
    return s ? { ...VAZIO, ...JSON.parse(s), contatos: JSON.parse(s).contatos ?? [] } : VAZIO
  } catch { return VAZIO }
}

export default function EmergenciaPage() {
  const [dados, setDados]   = useState<DadosEmergencia>(VAZIO)
  const [pronto, setPronto] = useState(false)
  const [novoContato, setNovoContato] = useState({ nome: '', telefone: '', relacao: '' })
  const [addContato, setAddContato]   = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => { setDados(carregar()); setPronto(true) }, [])

  function salvar(next: DadosEmergencia) {
    setDados(next)
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => localStorage.setItem('mv-emergencia', JSON.stringify(next)), 600)
  }

  function campo<K extends keyof DadosEmergencia>(k: K, v: DadosEmergencia[K]) {
    salvar({ ...dados, [k]: v })
  }

  function addContatoFn() {
    if (!novoContato.nome.trim() || !novoContato.telefone.trim()) return
    const c = { ...novoContato, id: Date.now().toString() }
    salvar({ ...dados, contatos: [...dados.contatos, c] })
    setNovoContato({ nome: '', telefone: '', relacao: '' })
    setAddContato(false)
  }

  function removeContato(id: string) {
    salvar({ ...dados, contatos: dados.contatos.filter((c) => c.id !== id) })
  }

  if (!pronto) return null

  return (
    <main className="mv-shell">
      <BackButton href="/mais" label="Mais" />

      <PageHeader icon="ambulance" color="terracota" title="Emergência" subtitle="Dados médicos e contatos de urgência" />

      <div className="mv-alert-strip mv-alert-strip--ambar" style={{ marginTop: 'var(--mv-space-5)' }}>
        <i className="ti ti-info-circle" aria-hidden="true" style={{ fontSize: 18, flexShrink: 0 }} />
        <span className="mv-alert-strip-text" style={{ fontSize: 'var(--mv-text-xs)' }}>
          Preencha com cuidado. Mantenha atualizado. Pode salvar sua vida.
        </span>
      </div>

      {/* Dados pessoais */}
      <p style={{ margin: 'var(--mv-space-5) 0 var(--mv-space-3) 4px', fontSize: 'var(--mv-text-xs)', fontWeight: 700, color: 'var(--mv-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
        Meus dados
      </p>
      <GlassCard style={{ display: 'flex', flexDirection: 'column', gap: 'var(--mv-space-3)' }}>
        <input value={dados.meu_nome} onChange={(e) => campo('meu_nome', e.target.value)}
          placeholder="Meu nome completo" style={INPUT} />

        <div>
          <label style={{ display: 'block', fontSize: 'var(--mv-text-xs)', fontWeight: 600, color: 'var(--mv-text-secondary)', marginBottom: 8 }}>Tipo sanguíneo</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {TIPOS_SANGUINEOS.map((t) => (
              <button key={t} type="button" onClick={() => campo('tipo_sanguineo', t)}
                style={{
                  padding: '6px 14px', borderRadius: 20, border: '1.5px solid',
                  borderColor: dados.tipo_sanguineo === t ? 'var(--mv-terracota)' : 'var(--mv-border)',
                  background: dados.tipo_sanguineo === t ? 'var(--mv-terracota-soft)' : 'transparent',
                  cursor: 'pointer', fontWeight: 700, fontSize: 13, fontFamily: 'var(--mv-font)',
                  color: dados.tipo_sanguineo === t ? 'var(--mv-terracota-deep)' : 'var(--mv-text-secondary)',
                }}>
                {t}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 'var(--mv-text-xs)', fontWeight: 600, color: 'var(--mv-text-secondary)', marginBottom: 6 }}>Alergias</label>
          <input value={dados.alergias} onChange={(e) => campo('alergias', e.target.value)}
            placeholder="Ex: penicilina, dipirona..." style={INPUT} />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 'var(--mv-text-xs)', fontWeight: 600, color: 'var(--mv-text-secondary)', marginBottom: 6 }}>Condições de saúde</label>
          <input value={dados.condicoes} onChange={(e) => campo('condicoes', e.target.value)}
            placeholder="Ex: diabetes, hipertensão..." style={INPUT} />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 'var(--mv-text-xs)', fontWeight: 600, color: 'var(--mv-text-secondary)', marginBottom: 6 }}>Remédios em uso</label>
          <input value={dados.medicamentos_resumo} onChange={(e) => campo('medicamentos_resumo', e.target.value)}
            placeholder="Ex: Losartana 50mg, Metformina..." style={INPUT} />
        </div>
      </GlassCard>

      {/* Médico e hospital */}
      <p style={{ margin: 'var(--mv-space-5) 0 var(--mv-space-3) 4px', fontSize: 'var(--mv-text-xs)', fontWeight: 700, color: 'var(--mv-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
        Meu médico
      </p>
      <GlassCard style={{ display: 'flex', flexDirection: 'column', gap: 'var(--mv-space-3)' }}>
        <input value={dados.medico_nome} onChange={(e) => campo('medico_nome', e.target.value)}
          placeholder="Nome do médico" style={INPUT} />
        <input value={dados.medico_tel} onChange={(e) => campo('medico_tel', e.target.value)}
          placeholder="Telefone do consultório" type="tel" style={INPUT} />
        <input value={dados.hospital} onChange={(e) => campo('hospital', e.target.value)}
          placeholder="Hospital de preferência" style={INPUT} />
      </GlassCard>

      {/* Contatos de emergência */}
      <p style={{ margin: 'var(--mv-space-5) 0 var(--mv-space-3) 4px', fontSize: 'var(--mv-text-xs)', fontWeight: 700, color: 'var(--mv-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
        Contatos de emergência
      </p>

      {dados.contatos.map((c) => (
        <GlassCard key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--mv-space-3)', marginBottom: 'var(--mv-space-3)' }}>
          <div className="mv-icon-blob mv-icon-blob--terracota" style={{ width: 44, height: 44, flexShrink: 0 }}>
            <i className="ti ti-phone-call" aria-hidden="true" style={{ fontSize: 18 }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 700, fontSize: 'var(--mv-text-md)', color: 'var(--mv-text-primary)' }}>{c.nome}</div>
            {c.relacao && <div style={{ fontSize: 'var(--mv-text-xs)', color: 'var(--mv-text-secondary)', marginTop: 2 }}>{c.relacao}</div>}
            <a href={`tel:${c.telefone.replace(/\D/g, '')}`}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 5, marginTop: 6, fontSize: 'var(--mv-text-lg)', fontWeight: 700, color: 'var(--mv-terracota-deep)', textDecoration: 'none' }}>
              {c.telefone}
            </a>
          </div>
          <button type="button" onClick={() => removeContato(c.id)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--mv-text-tertiary)', fontSize: 18, padding: '4px', lineHeight: 1, flexShrink: 0 }}>
            <i className="ti ti-trash" aria-hidden="true" />
          </button>
        </GlassCard>
      ))}

      {addContato ? (
        <GlassCard>
          <p style={{ margin: '0 0 var(--mv-space-3)', fontWeight: 700, fontSize: 'var(--mv-text-sm)' }}>Novo contato</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <input value={novoContato.nome} onChange={(e) => setNovoContato((c) => ({ ...c, nome: e.target.value }))} placeholder="Nome *" style={INPUT} />
            <input value={novoContato.telefone} onChange={(e) => setNovoContato((c) => ({ ...c, telefone: e.target.value }))} placeholder="Telefone *" type="tel" style={INPUT} />
            <input value={novoContato.relacao} onChange={(e) => setNovoContato((c) => ({ ...c, relacao: e.target.value }))} placeholder="Relação (ex: filha)" style={INPUT} />
          </div>
          <div style={{ display: 'flex', gap: 'var(--mv-space-3)', marginTop: 'var(--mv-space-4)' }}>
            <button type="button" onClick={() => setAddContato(false)} className="mv-btn mv-btn--ghost" style={{ flex: 1 }}>Cancelar</button>
            <button type="button" onClick={addContatoFn} className="mv-btn mv-btn--primary" style={{ flex: 2 }}>Salvar</button>
          </div>
        </GlassCard>
      ) : (
        <button type="button" onClick={() => setAddContato(true)}
          className="mv-btn mv-btn--ghost mv-btn--full">
          <i className="ti ti-plus" aria-hidden="true" /> Adicionar contato de emergência
        </button>
      )}

      <p style={{ textAlign: 'center', fontSize: 'var(--mv-text-xs)', color: 'var(--mv-text-tertiary)', padding: 'var(--mv-space-6) 0 var(--mv-space-4)', lineHeight: 1.6 }}>
        Salvo no seu dispositivo 🔒<br />
        Mantenha sempre atualizado
      </p>
    </main>
  )
}
