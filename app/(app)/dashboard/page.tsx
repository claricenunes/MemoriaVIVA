import { createClient } from '@/lib/supabase/server'
import HeroCard from '@/components/shared/hero-card'
import EmotionCheckin from '@/components/shared/emotion-checkin'
import SectionTitle from '@/components/shared/section-title'
import Link from 'next/link'
import type { AgendaEvento } from '@/lib/types/database'

function formatEventoLabel(data: string, hora: string | null): string {
  const hoje  = new Date()
  const hojeStr   = `${hoje.getFullYear()}-${String(hoje.getMonth()+1).padStart(2,'0')}-${String(hoje.getDate()).padStart(2,'0')}`
  const amanha    = new Date(hoje.getTime() + 86_400_000)
  const amanhaStr = `${amanha.getFullYear()}-${String(amanha.getMonth()+1).padStart(2,'0')}-${String(amanha.getDate()).padStart(2,'0')}`

  const diaLabel = data === hojeStr
    ? 'Hoje'
    : data === amanhaStr
    ? 'Amanhã'
    : new Date(data + 'T12:00:00').toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })

  return hora ? `${diaLabel} • ${hora.slice(0, 5)}` : diaLabel
}

type ProximoRemedio = { nome: string; dosagem: string; horario: string } | null

function nomeDisplay(meta: Record<string, string> | undefined, email: string | undefined): string {
  const nome = meta?.nome ?? meta?.full_name ?? meta?.name ?? ''
  if (nome) return nome
  const local = (email ?? '').split('@')[0].replace(/[._-]/g, ' ')
  return local.replace(/\b\w/g, (c) => c.toUpperCase()) || 'você'
}

export default async function DashboardPage() {
  let proximoEvento:  AgendaEvento | null = null
  let proximoRemedio: ProximoRemedio      = null
  let nomeUsuario = 'você'

  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      nomeUsuario = nomeDisplay(
        user.user_metadata as Record<string, string> | undefined,
        user.email,
      )

      const agora = new Date()
      const hojeStr = `${agora.getFullYear()}-${String(agora.getMonth()+1).padStart(2,'0')}-${String(agora.getDate()).padStart(2,'0')}`

      // Brasil = UTC-3 (horário de Brasília)
      const horaAtual = `${String((agora.getUTCHours() - 3 + 24) % 24).padStart(2, '0')}:${String(agora.getUTCMinutes()).padStart(2, '0')}`

      const [{ data: eventoData }, { data: meds }] = await Promise.all([
        supabase
          .from('agenda_eventos')
          .select('*')
          .eq('user_id', user.id)
          .gte('data', hojeStr)
          .order('data', { ascending: true })
          .order('hora', { ascending: true, nullsFirst: false })
          .limit(1),
        supabase
          .from('medicamentos')
          .select('nome, dosagem, horarios')
          .eq('user_id', user.id)
          .eq('ativo', true),
      ])

      proximoEvento = eventoData?.[0] ?? null

      if (meds && meds.length > 0) {
        type Med = { nome: string; dosagem: string; horarios: string[] }
        const todos: { med: Med; h: string }[] = (meds as Med[]).flatMap((m) =>
          (m.horarios ?? []).map((h) => ({ med: m, h }))
        )
        todos.sort((a, b) => a.h.localeCompare(b.h))

        const proximo = todos.find(({ h }) => h >= horaAtual) ?? todos[0]
        if (proximo) {
          proximoRemedio = {
            nome:     proximo.med.nome,
            dosagem:  proximo.med.dosagem,
            horario:  proximo.h,
          }
        }
      }
    }
  } catch {
    // Supabase não configurado — mostra placeholder
  }

  return (
    <main className="mv-shell">
      <HeroCard name={nomeUsuario} />

      {/* Check-in do dia — elemento principal */}
      <EmotionCheckin />

      {/* Os 2 blocos grandes de "o que importa hoje" */}
      <p style={{
        margin: 'var(--mv-space-6) 0 var(--mv-space-3) 4px',
        fontSize: 'var(--mv-text-xs)', fontWeight: 700,
        color: 'var(--mv-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.07em',
      }}>
        O que importa hoje
      </p>

      {/* Próximo compromisso */}
      <Link href="/agenda" style={{ textDecoration: 'none', display: 'block', marginBottom: 'var(--mv-space-3)' }}>
        <div style={{
          background: 'var(--mv-card)', border: '1.5px solid var(--mv-border)',
          borderRadius: 'var(--mv-radius-lg)', padding: 'var(--mv-space-5)',
          display: 'flex', alignItems: 'center', gap: 'var(--mv-space-4)',
          boxShadow: 'var(--mv-shadow-soft)', minHeight: 80,
        }}>
          <div className="mv-icon-blob mv-icon-blob--azul" style={{ width: 52, height: 52, borderRadius: 16, flexShrink: 0 }}>
            <i className="ti ti-calendar" aria-hidden="true" style={{ fontSize: 24 }} />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ margin: 0, fontSize: 'var(--mv-text-xs)', fontWeight: 700, color: 'var(--mv-azul-deep)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Próximo compromisso
            </p>
            <p style={{ margin: '3px 0 0', fontSize: 'var(--mv-text-md)', fontWeight: 700, color: 'var(--mv-text-primary)' }}>
              {proximoEvento ? proximoEvento.titulo : 'Nenhum compromisso'}
            </p>
            <p style={{ margin: '2px 0 0', fontSize: 'var(--mv-text-sm)', color: 'var(--mv-text-secondary)' }}>
              {proximoEvento
                ? formatEventoLabel(proximoEvento.data, proximoEvento.hora)
                : 'Adicione um evento na agenda'}
            </p>
          </div>
          <i className="ti ti-chevron-right" aria-hidden="true" style={{ color: 'var(--mv-text-tertiary)', fontSize: 22, flexShrink: 0 }} />
        </div>
      </Link>

      {/* Próximo remédio */}
      <Link href="/medicamentos" style={{ textDecoration: 'none', display: 'block', marginBottom: 'var(--mv-space-3)' }}>
        <div style={{
          background: 'var(--mv-card)', border: '1.5px solid var(--mv-border)',
          borderRadius: 'var(--mv-radius-lg)', padding: 'var(--mv-space-5)',
          display: 'flex', alignItems: 'center', gap: 'var(--mv-space-4)',
          boxShadow: 'var(--mv-shadow-soft)', minHeight: 80,
        }}>
          <div className="mv-icon-blob mv-icon-blob--ambar" style={{ width: 52, height: 52, borderRadius: 16, flexShrink: 0 }}>
            <i className="ti ti-pill" aria-hidden="true" style={{ fontSize: 24 }} />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ margin: 0, fontSize: 'var(--mv-text-xs)', fontWeight: 700, color: 'var(--mv-ambar-deep)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Próximo remédio
            </p>
            <p style={{ margin: '3px 0 0', fontSize: 'var(--mv-text-md)', fontWeight: 700, color: 'var(--mv-text-primary)' }}>
              {proximoRemedio
                ? `${proximoRemedio.nome}${proximoRemedio.dosagem ? ` — ${proximoRemedio.dosagem}` : ''}`
                : 'Nenhum medicamento'}
            </p>
            <p style={{ margin: '2px 0 0', fontSize: 'var(--mv-text-sm)', color: 'var(--mv-text-secondary)' }}>
              {proximoRemedio ? `Às ${proximoRemedio.horario}` : 'Adicione na aba de medicamentos'}
            </p>
          </div>
          <i className="ti ti-chevron-right" aria-hidden="true" style={{ color: 'var(--mv-text-tertiary)', fontSize: 22, flexShrink: 0 }} />
        </div>
      </Link>

      {/* Seção secundária */}
      <SectionTitle title="Notícia do dia" action="Ver mais" actionHref="/noticias" />
      <Link href="/noticias" style={{ textDecoration: 'none' }}>
        <div className="mv-news-mini">
          <div className="mv-news-mini-image" style={{ background: 'var(--mv-salvia-soft)' }}>⚽</div>
          <div className="mv-news-mini-body">
            <div className="mv-news-mini-tag" style={{ color: 'var(--mv-salvia-deep)' }}>Esportes</div>
            <p className="mv-news-mini-title">Flamengo vence clássico e sobe na tabela do Brasileirão</p>
            <p style={{ fontSize: 'var(--mv-text-xs)', color: 'var(--mv-text-tertiary)', marginTop: 4, marginBottom: 0 }}>
              Há 2 horas
            </p>
          </div>
        </div>
      </Link>

      <SectionTitle title="Exercício do dia" action="Ver todos" actionHref="/exercicios" />
      <Link href="/exercicios" style={{ textDecoration: 'none' }}>
        <div className="mv-exercise-hero">
          <div className="mv-exercise-hero-label">Pronto em 3 minutos ✨</div>
          <div className="mv-exercise-hero-title">Palavra escondida</div>
          <div className="mv-exercise-hero-desc">Encontre a palavra escondida nas letras embaralhadas</div>
          <button type="button" className="mv-btn mv-btn--primary" style={{ pointerEvents: 'none' }}>
            <i className="ti ti-brain" aria-hidden="true" />
            Começar agora
          </button>
        </div>
      </Link>
    </main>
  )
}
