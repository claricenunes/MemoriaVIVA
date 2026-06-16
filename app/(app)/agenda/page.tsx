import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import GlassCard from '@/components/shared/glass-card'
import PageHeader from '@/components/shared/page-header'
import SectionTitle from '@/components/shared/section-title'
import FloatingAction from '@/components/shared/floating-action'
import CalendarioClient from '@/components/agenda/calendario-client'
import NovoEventoForm from '@/components/agenda/novo-evento-form'
import EventoItem from '@/components/agenda/evento-item'
import type { AgendaEvento } from '@/lib/types/database'

const MESES = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']


const LEGEND = [
  { color: 'var(--mv-terracota)',   label: 'Médico'     },
  { color: 'var(--mv-azul-suave)',  label: 'Psicóloga'  },
  { color: 'var(--mv-ambar)',       label: 'Estudos/Fé' },
  { color: 'var(--mv-salvia)',      label: 'Social'     },
]

function formatDiaLabel(iso: string, hoje: string) {
  if (iso === hoje) return 'Hoje'
  const d = new Date(iso + 'T12:00:00')
  const s = d.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export default async function AgendaPage({
  searchParams,
}: {
  searchParams: Promise<{ dia?: string; mes?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { dia, mes: mesParam } = await searchParams
  const hoje    = new Date().toISOString().split('T')[0]
  const diaAlvo = dia ?? hoje

  const now  = mesParam ? new Date(mesParam + '-01T12:00:00') : new Date()
  const ano  = now.getFullYear()
  const mes  = now.getMonth()
  const pad  = (n: number) => String(n).padStart(2, '0')
  const inicioMes = `${ano}-${pad(mes + 1)}-01`
  const fimMes    = `${ano}-${pad(mes + 1)}-${new Date(ano, mes + 1, 0).getDate()}`

  let eventosMes: AgendaEvento[]  = []
  let eventosDia: AgendaEvento[]  = []
  let dbSetupNeeded = false

  try {
    const [r1, r2] = await Promise.all([
      supabase
        .from('agenda_eventos')
        .select('*')
        .eq('user_id', user.id)
        .gte('data', inicioMes)
        .lte('data', fimMes)
        .order('hora', { nullsFirst: false }),
      supabase
        .from('agenda_eventos')
        .select('*')
        .eq('user_id', user.id)
        .eq('data', diaAlvo)
        .order('hora', { nullsFirst: false }),
    ])

    if (r1.error?.code === '42P01') {
      dbSetupNeeded = true
    } else {
      eventosMes = (r1.data ?? []) as AgendaEvento[]
      eventosDia = (r2.data ?? []) as AgendaEvento[]
    }
  } catch (e) {
    console.error('[AgendaPage] query error:', e)
    dbSetupNeeded = true
  }

  // Monta mapa data → cores únicas para os dots do calendário
  const dotMap = new Map<string, Set<string>>()
  for (const ev of eventosMes) {
    if (!dotMap.has(ev.data)) dotMap.set(ev.data, new Set())
    dotMap.get(ev.data)!.add(ev.cor)
  }
  const diasComEventos = Array.from(dotMap.entries()).map(([data, cores]) => ({
    data,
    cores: Array.from(cores),
  }))

  return (
    <main className="mv-shell">
      <PageHeader icon="calendar" color="azul" title="Agenda" subtitle={MESES[mes] + ' de ' + ano} />

      {dbSetupNeeded && (
        <div style={{
          display: 'flex', alignItems: 'flex-start', gap: 12,
          padding: '14px 16px', borderRadius: 'var(--mv-radius-md)',
          background: 'var(--mv-ambar-soft)', marginTop: 'var(--mv-space-4)',
          border: '1.5px solid var(--mv-ambar)',
        }}>
          <i className="ti ti-tool" aria-hidden="true" style={{ fontSize: 20, color: 'var(--mv-ambar-deep)', flexShrink: 0, marginTop: 2 }} />
          <div>
            <p style={{ margin: '0 0 4px', fontWeight: 700, fontSize: 'var(--mv-text-sm)', color: 'var(--mv-ambar-deep)' }}>
              Banco de dados não configurado
            </p>
            <p style={{ margin: 0, fontSize: 'var(--mv-text-xs)', color: 'var(--mv-ambar-deep)', lineHeight: 1.6 }}>
              Execute <strong>supabase/migrations/002_agenda_memorias.sql</strong> no Supabase SQL Editor.
            </p>
          </div>
        </div>
      )}

      {/* Calendário — client component interativo, props vindas do servidor */}
      <GlassCard style={{ marginTop: 'var(--mv-space-5)' }}>
        <CalendarioClient
          ano={ano}
          mes={mes}
          diasComEventos={diasComEventos}
          diaSelecionado={diaAlvo}
        />
      </GlassCard>

      <SectionTitle title={formatDiaLabel(diaAlvo, hoje)} />

      <GlassCard>
        {eventosDia.length === 0 ? (
          <p style={{ margin: 0, textAlign: 'center', color: 'var(--mv-text-tertiary)', fontSize: 'var(--mv-text-sm)', padding: 'var(--mv-space-3) 0' }}>
            {dbSetupNeeded ? 'Configure o banco de dados para ver sua agenda.' : 'Nenhum compromisso neste dia.'}
          </p>
        ) : (
          eventosDia.map((ev, i) => (
            <EventoItem key={ev.id} ev={ev} separator={i < eventosDia.length - 1} />
          ))
        )}

        <NovoEventoForm />
      </GlassCard>

      <div style={{ display: 'flex', gap: 'var(--mv-space-5)', flexWrap: 'wrap', padding: 'var(--mv-space-3) var(--mv-space-1) var(--mv-space-4)' }}>
        {LEGEND.map((leg) => (
          <div key={leg.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: leg.color, display: 'block', flexShrink: 0 }} />
            <span style={{ fontSize: 'var(--mv-text-xs)', color: 'var(--mv-text-secondary)' }}>{leg.label}</span>
          </div>
        ))}
      </div>

      <FloatingAction variant="add" label="Novo compromisso" />
    </main>
  )
}
