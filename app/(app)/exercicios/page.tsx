'use client'

import { useState, useEffect } from 'react'
import GlassCard from '@/components/shared/glass-card'
import PageHeader from '@/components/shared/page-header'
import SectionTitle from '@/components/shared/section-title'

// ─── Vocabulário diário ────────────────────────────────────────────────────
interface Desafio {
  palavra: string
  dica: string
  letras: string[]
}

const PALAVRAS: Desafio[] = [
  { palavra: 'AMOR',    dica: 'Sentimento entre pessoas queridas',     letras: ['A','M','O','R','U','T'] },
  { palavra: 'SAÚDE',   dica: 'Bem-estar do corpo e da mente',          letras: ['S','A','Ú','D','E','B','S'] },
  { palavra: 'FLORES',  dica: 'Presente especial para quem amamos',     letras: ['F','L','O','R','E','S','P'] },
  { palavra: 'JARDIM',  dica: 'Lugar com plantas e natureza',            letras: ['J','A','R','D','I','M','N'] },
  { palavra: 'ALEGRIA', dica: 'Emoção positiva e festiva',               letras: ['A','L','E','G','R','I','A','O'] },
  { palavra: 'CUIDADO', dica: 'Atenção especial com alguém',             letras: ['C','U','I','D','A','D','O','R'] },
  { palavra: 'MEMÓRIA', dica: 'Lembrança guardada no coração',           letras: ['M','E','M','Ó','R','I','A','L'] },
  { palavra: 'AMIZADE', dica: 'Relação de carinho entre amigos',         letras: ['A','M','I','Z','A','D','E','S'] },
  { palavra: 'VITÓRIA', dica: 'Conquista importante na vida',            letras: ['V','I','T','Ó','R','I','A','C'] },
  { palavra: 'PÁSSARO', dica: 'Animal que voa e canta',                  letras: ['P','Á','S','S','A','R','O','N'] },
  { palavra: 'CANÇÃO',  dica: 'Música com letra para cantar',            letras: ['C','A','N','Ç','Ã','O','M','R'] },
  { palavra: 'SORRISO', dica: 'Expressão de felicidade no rosto',        letras: ['S','O','R','R','I','S','O','T'] },
  { palavra: 'CARINHO', dica: 'Gesto de afeto e ternura',                letras: ['C','A','R','I','N','H','O','B'] },
  { palavra: 'FAMÍLIA', dica: 'Pessoas unidas pelo amor',                letras: ['F','A','M','Í','L','I','A','N'] },
]

function getDiaDoAno(): number {
  const now   = new Date()
  const inicio = new Date(now.getFullYear(), 0, 0)
  return Math.floor((now.getTime() - inicio.getTime()) / 86_400_000)
}

function embaralhar<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// ─── Exercícios disponíveis ───────────────────────────────────────────────
const EXERCICIOS = [
  { icon: '🔡', titulo: 'Palavra escondida',    desc: 'Forme palavras com as letras',         duracao: '3 min', dificuldade: 'Fácil', color: 'terracota', cat: 'Memória',  bloqueado: false },
  { icon: '🔢', titulo: 'Sequência de números', desc: 'Memorize e repita a sequência',        duracao: '5 min', dificuldade: 'Médio', color: 'azul',      cat: 'Números',  bloqueado: false },
  { icon: '🎯', titulo: 'Onde estava?',          desc: 'Encontre onde o objeto foi escondido', duracao: '4 min', dificuldade: 'Médio', color: 'salvia',    cat: 'Memória',  bloqueado: false },
  { icon: '🖼️', titulo: 'Ache as diferenças',   desc: 'Encontre as 5 diferenças',             duracao: '5 min', dificuldade: 'Fácil', color: 'ambar',     cat: 'Foco',     bloqueado: true  },
  { icon: '🧩', titulo: 'Palavras cruzadas',    desc: 'Complete as palavras cruzadas',        duracao: '10 min',dificuldade: 'Difícil',color: 'azul',     cat: 'Palavras', bloqueado: true  },
]

const CATS_FILTRO = ['Todos', '🧠 Memória', '🔢 Números', '🔤 Palavras', '🎯 Foco']

const CAT_MAP: Record<string, string> = {
  '🧠 Memória': 'Memória', '🔢 Números': 'Números', '🔤 Palavras': 'Palavras', '🎯 Foco': 'Foco',
}

const BLOB_CLASS: Record<string, string> = {
  terracota: 'mv-icon-blob--terracota', azul: 'mv-icon-blob--azul',
  salvia: 'mv-icon-blob--salvia', ambar: 'mv-icon-blob--ambar',
}

const DIAS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']

// ─── Componente ───────────────────────────────────────────────────────────
export default function ExerciciosPage() {
  const desafio = PALAVRAS[getDiaDoAno() % PALAVRAS.length]

  const [letras, setLetras]             = useState<string[]>([])
  const [selecionadas, setSelecionadas] = useState<string[]>([])
  const [resultado, setResultado]       = useState<'correto' | 'errado' | null>(null)
  const [dica, setDica]                 = useState(false)
  const [completouHoje, setCompletouHoje] = useState(false)
  const [streak, setStreak]             = useState(0)
  const [diasSemana, setDiasSemana]     = useState<boolean[]>([false,false,false,false,false,false,false])
  const [catFiltro, setCatFiltro]       = useState('Todos')
  const [mounted, setMounted]           = useState(false)

  // Carrega estado do localStorage
  useEffect(() => {
    setMounted(true)

    // Embaralha letras
    setLetras(embaralhar(desafio.letras))

    // Verifica se completou hoje
    const hoje = new Date().toISOString().split('T')[0]
    const ultimoDia = localStorage.getItem('mv-ex-ultimo') ?? ''
    if (ultimoDia === hoje) setCompletouHoje(true)

    // Carrega streak
    const streakSalvo = Number(localStorage.getItem('mv-ex-streak') ?? '0')
    const ontem = new Date(Date.now() - 86_400_000).toISOString().split('T')[0]

    if (ultimoDia === hoje)    setStreak(streakSalvo)
    else if (ultimoDia === ontem) setStreak(streakSalvo) // mantém streak, aguarda completar
    else                          setStreak(0)           // streak quebrado

    // Monta semana (quais dias foram completados)
    const semana: boolean[] = []
    const dow = new Date().getDay() // 0 = Dom
    for (let i = 0; i < 7; i++) {
      const d = new Date()
      d.setDate(d.getDate() - ((dow + 6 - i) % 7))
      const iso = d.toISOString().split('T')[0]
      semana.push(localStorage.getItem(`mv-ex-${iso}`) === '1')
    }
    setDiasSemana(semana)
  }, [desafio.letras])

  function toggleLetra(letra: string, idx: number) {
    const key = `${letra}-${idx}`
    setSelecionadas((prev) => prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key])
    setResultado(null)
  }

  function verificar() {
    const formada = selecionadas.map((k) => k.split('-')[0]).join('')
    if (formada.toUpperCase() === desafio.palavra) {
      setResultado('correto')
      if (!completouHoje) {
        const hoje = new Date().toISOString().split('T')[0]
        const novoStreak = streak + 1
        localStorage.setItem('mv-ex-ultimo', hoje)
        localStorage.setItem(`mv-ex-${hoje}`, '1')
        localStorage.setItem('mv-ex-streak', String(novoStreak))
        setStreak(novoStreak)
        setCompletouHoje(true)
        setDiasSemana((prev) => {
          const d = [...prev]; d[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1] = true; return d
        })
      }
    } else {
      setResultado('errado')
    }
  }

  function limpar() { setSelecionadas([]); setResultado(null) }

  const exFiltrados = catFiltro === 'Todos'
    ? EXERCICIOS
    : EXERCICIOS.filter((e) => e.cat === (CAT_MAP[catFiltro] ?? catFiltro))

  return (
    <main className="mv-shell">
      <PageHeader icon="brain" color="salvia" title="Exercícios" subtitle="Mantenha a mente ativa todos os dias" />

      {/* Sequência da semana */}
      <GlassCard variant="hero" style={{ marginTop: 'var(--mv-space-5)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--mv-space-3)' }}>
          <span style={{ fontSize: 'var(--mv-text-sm)', fontWeight: 600, color: 'var(--mv-text-secondary)' }}>⭐ Sequência</span>
          <span style={{ fontSize: 'var(--mv-text-sm)', fontWeight: 700, color: 'var(--mv-terracota-deep)' }}>
            {mounted ? streak : 0} dia{streak !== 1 ? 's' : ''}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {DIAS.map((d, i) => (
            <div key={d} style={{ flex: 1, textAlign: 'center' }}>
              <div style={{
                width: '100%', aspectRatio: '1', borderRadius: 'var(--mv-radius-sm)', marginBottom: 4,
                background: diasSemana[i] ? 'var(--mv-salvia)' : 'var(--mv-bg-secondary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {diasSemana[i]
                  ? <i className="ti ti-check" aria-hidden="true" style={{ fontSize: 14, color: 'white' }} />
                  : <span style={{ fontSize: 10, color: 'var(--mv-text-tertiary)' }}>—</span>}
              </div>
              <span style={{ fontSize: 10, color: 'var(--mv-text-tertiary)' }}>{d}</span>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Exercício do dia */}
      <SectionTitle title={`Exercício do dia — ${desafio.palavra.length} letras`} />
      <GlassCard>
        {completouHoje ? (
          <div style={{ textAlign: 'center', padding: 'var(--mv-space-4) 0' }}>
            <div style={{ fontSize: 48, marginBottom: 'var(--mv-space-3)' }}>🎉</div>
            <p style={{ margin: 0, fontWeight: 700, fontSize: 'var(--mv-text-md)', color: 'var(--mv-salvia-deep)' }}>
              Você já completou o desafio de hoje!
            </p>
            <p style={{ margin: 'var(--mv-space-2) 0 0', fontSize: 'var(--mv-text-sm)', color: 'var(--mv-text-secondary)' }}>
              A palavra era <strong>{desafio.palavra}</strong> — Volte amanhã para um novo desafio.
            </p>
          </div>
        ) : (
          <>
            <p style={{ margin: '0 0 var(--mv-space-3)', fontSize: 'var(--mv-text-sm)', color: 'var(--mv-text-secondary)' }}>
              Toque nas letras na ordem certa para formar a palavra
              {dica && <em style={{ color: 'var(--mv-text-tertiary)' }}> — Dica: {desafio.dica}</em>}
            </p>

            {/* Letras disponíveis */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 'var(--mv-space-4)' }}>
              {letras.map((letra, idx) => {
                const key = `${letra}-${idx}`
                const sel = selecionadas.includes(key)
                return (
                  <button key={key} type="button" onClick={() => toggleLetra(letra, idx)}
                    style={{
                      width: 48, height: 52, borderRadius: 'var(--mv-radius-sm)', cursor: 'pointer',
                      fontSize: 'var(--mv-text-lg)', fontWeight: 700, transition: 'all 0.15s',
                      border: `2px solid ${sel ? 'var(--mv-terracota)' : 'var(--mv-border)'}`,
                      background: sel ? 'var(--mv-terracota-soft)' : 'var(--mv-bg-secondary)',
                      color:      sel ? 'var(--mv-terracota-deep)' : 'var(--mv-text-primary)',
                      opacity:    sel ? 0.5 : 1,
                    }}
                  >
                    {letra}
                  </button>
                )
              })}
            </div>

            {/* Palavra formada */}
            <div style={{ minHeight: 44, background: 'var(--mv-bg-secondary)', borderRadius: 'var(--mv-radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--mv-space-3)', gap: 4, padding: '8px 12px', flexWrap: 'wrap' }}>
              {selecionadas.length === 0 ? (
                <span style={{ color: 'var(--mv-text-tertiary)', fontSize: 'var(--mv-text-sm)' }}>Sua palavra aparece aqui</span>
              ) : selecionadas.map((k, i) => (
                <span key={i} style={{ fontSize: 'var(--mv-text-lg)', fontWeight: 700, color: 'var(--mv-terracota-deep)', letterSpacing: 2 }}>
                  {k.split('-')[0]}
                </span>
              ))}
            </div>

            {resultado === 'correto' && <p style={{ textAlign: 'center', color: 'var(--mv-salvia-deep)',    fontWeight: 700, marginBottom: 'var(--mv-space-3)' }}>✅ Correto! Parabéns!</p>}
            {resultado === 'errado'  && <p style={{ textAlign: 'center', color: 'var(--mv-terracota-deep)', fontWeight: 700, marginBottom: 'var(--mv-space-3)' }}>❌ Tente novamente</p>}

            <div style={{ display: 'flex', gap: 'var(--mv-space-3)' }}>
              <button type="button" className="mv-btn mv-btn--ghost" style={{ flex: 1 }} onClick={() => { setDica(true); limpar() }}>
                💡 Dica
              </button>
              {selecionadas.length > 0 && (
                <button type="button" className="mv-btn mv-btn--ghost" style={{ flex: 1 }} onClick={limpar}>
                  <i className="ti ti-rotate-ccw" aria-hidden="true" /> Limpar
                </button>
              )}
              <button type="button" className="mv-btn mv-btn--primary" style={{ flex: 2 }} onClick={verificar} disabled={selecionadas.length === 0}>
                Verificar
              </button>
            </div>
          </>
        )}
      </GlassCard>

      {/* Filtro de categoria */}
      <div className="mv-chips" style={{ marginTop: 'var(--mv-space-5)' }}>
        {CATS_FILTRO.map((cat) => (
          <button key={cat} type="button" onClick={() => setCatFiltro(cat)}
            className={`mv-chip${catFiltro === cat ? ' mv-chip--active' : ''}`}>
            {cat}
          </button>
        ))}
      </div>

      {/* Lista de exercícios */}
      <SectionTitle title="Mais exercícios" />
      <GlassCard>
        {exFiltrados.map((ex, i) => (
          <div
            key={i}
            style={{
              display: 'flex', alignItems: 'center', gap: 'var(--mv-space-3)',
              paddingBottom: i < exFiltrados.length - 1 ? 'var(--mv-space-4)' : 0,
              marginBottom:  i < exFiltrados.length - 1 ? 'var(--mv-space-4)' : 0,
              borderBottom:  i < exFiltrados.length - 1 ? '1px solid var(--mv-border)' : 'none',
              opacity: ex.bloqueado ? 0.5 : 1,
            }}
          >
            <div className={`mv-icon-blob ${BLOB_CLASS[ex.color]}`} style={{ width: 50, height: 50, fontSize: 22, flexShrink: 0 }}>
              <span aria-hidden="true">{ex.icon}</span>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, color: 'var(--mv-text-primary)', marginBottom: 2 }}>{ex.titulo}</div>
              <div style={{ fontSize: 'var(--mv-text-xs)', color: 'var(--mv-text-secondary)' }}>{ex.desc}</div>
              <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                <span style={{ fontSize: 11, color: 'var(--mv-text-tertiary)' }}>⏱ {ex.duracao}</span>
                <span style={{ fontSize: 11, color: 'var(--mv-text-tertiary)' }}>· {ex.dificuldade}</span>
              </div>
            </div>
            {ex.bloqueado
              ? <i className="ti ti-lock" aria-hidden="true" style={{ color: 'var(--mv-text-tertiary)', fontSize: 18, flexShrink: 0 }} />
              : <button type="button" className="mv-btn mv-btn--primary" style={{ padding: '6px 14px', fontSize: 'var(--mv-text-xs)', flexShrink: 0 }}>Jogar</button>}
          </div>
        ))}
        {exFiltrados.length === 0 && (
          <p style={{ margin: 0, textAlign: 'center', color: 'var(--mv-text-tertiary)', fontSize: 'var(--mv-text-sm)', padding: 'var(--mv-space-3) 0' }}>
            Nenhum exercício nessa categoria disponível.
          </p>
        )}
      </GlassCard>
    </main>
  )
}
