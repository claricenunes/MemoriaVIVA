import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import CheckinWidget from '@/components/saude/checkin-widget'
import MedicationCard from '@/components/shared/medication-card'
import SectionTitle from '@/components/shared/section-title'
import GlassCard from '@/components/shared/glass-card'
import PageHeader from '@/components/shared/page-header'
import type { SaudeRegistro, Medicamento, MedicamentoRegistro } from '@/lib/types/database'

function formatDate(d: Date) {
  const s = d.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })
  return s.charAt(0).toUpperCase() + s.slice(1)
}

function formatHistDate(iso: string) {
  const d = new Date(iso + 'T12:00:00')
  return d.toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'short' })
}

function getMedStatus(horario: string, tomado: boolean): 'tomado' | 'proximo' | 'pendente' {
  if (tomado) return 'tomado'
  const now = new Date()
  const [h, m] = horario.split(':').map(Number)
  const t = new Date(); t.setHours(h, m, 0, 0)
  return (t.getTime() - now.getTime()) > -1800_000 ? 'proximo' : 'pendente'
}

type MedDia = { med: Medicamento; horario: string; status: 'tomado' | 'proximo' | 'pendente' }

export default async function SaudePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const hoje = new Date().toISOString().split('T')[0]

  // Variáveis com fallback seguro
  let checkin: SaudeRegistro | null = null
  let hist: SaudeRegistro[]         = []
  let medsDia: MedDia[]             = []
  let dbSetupNeeded                  = false

  try {
    const [r1, r2, r3, r4] = await Promise.all([
      supabase.from('saude_registros').select('*').eq('user_id', user.id).eq('data', hoje).maybeSingle(),
      supabase.from('saude_registros').select('*').eq('user_id', user.id).lt('data', hoje).order('data', { ascending: false }).limit(7),
      supabase.from('medicamentos').select('*').eq('user_id', user.id).eq('ativo', true).order('nome'),
      supabase.from('medicamentos_registros').select('*').eq('user_id', user.id).eq('data', hoje),
    ])

    // Código 42P01 = tabela não existe no PostgreSQL
    if (r1.error?.code === '42P01' || r3.error?.code === '42P01') {
      dbSetupNeeded = true
    } else {
      checkin = r1.data as SaudeRegistro | null
      hist    = (r2.data ?? []) as SaudeRegistro[]

      const takenSet = new Set(
        (r4.data ?? [] as MedicamentoRegistro[]).map((r: MedicamentoRegistro) => `${r.medicamento_id}:${r.horario_previsto}`)
      )
      medsDia = (r3.data ?? [] as Medicamento[]).flatMap((med: Medicamento) =>
        med.horarios.map((horario) => ({
          med,
          horario,
          status: getMedStatus(horario, takenSet.has(`${med.id}:${horario}`)),
        }))
      )
    }
  } catch (e) {
    console.error('[SaudePage] query error:', e)
    dbSetupNeeded = true
  }

  return (
    <main className="mv-shell">
      <PageHeader icon="heart" color="terracota" title="Saúde" subtitle={formatDate(new Date())} />

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
              Execute <strong>supabase/migrations/001_core_tables.sql</strong> no Supabase SQL Editor para ativar o salvamento de dados.
            </p>
          </div>
        </div>
      )}

      <div style={{ marginTop: 'var(--mv-space-5)' }}>
        <CheckinWidget checkin={checkin} />
      </div>

      {medsDia.length > 0 && (
        <>
          <SectionTitle title="Remédios de hoje" action="Ver todos" actionHref="/medicamentos" />
          {medsDia.map(({ med, horario, status }) => (
            <MedicationCard
              key={`${med.id}-${horario}`}
              name={med.nome}
              dosage={med.dosagem}
              time={`${status === 'tomado' ? 'Tomado' : status === 'proximo' ? 'Próximo' : 'Pendente'} • ${horario}`}
              status={status}
            />
          ))}
        </>
      )}

      {hist.length > 0 && (
        <>
          <SectionTitle title="Meu diário" action="Ver tudo" />
          <GlassCard>
            {hist.map((entry, i) => (
              <div
                key={entry.id}
                className="mv-diary-entry"
                style={{
                  borderBottom: i < hist.length - 1 ? '1px solid var(--mv-border)' : 'none',
                  paddingBottom: i < hist.length - 1 ? 'var(--mv-space-3)' : 0,
                  marginBottom:  i < hist.length - 1 ? 'var(--mv-space-3)' : 0,
                }}
              >
                <div className="mv-diary-entry-header">
                  <span className="mv-diary-entry-date">{formatHistDate(entry.data)}</span>
                  <div className="mv-diary-entry-scores">
                    <span className="mv-diary-score-pill mv-diary-score-pill--corpo">🏃 {entry.corpo}/10</span>
                    <span className="mv-diary-score-pill mv-diary-score-pill--mente">🧠 {entry.mente}/10</span>
                  </div>
                </div>
                {entry.nota && <p className="mv-diary-entry-text">{entry.nota}</p>}
                {entry.marcado_medico && (
                  <div className="mv-diary-entry-bookmark">
                    <i className="ti ti-stethoscope" aria-hidden="true" /> Marcado para o médico
                  </div>
                )}
              </div>
            ))}
          </GlassCard>
        </>
      )}

      {hist.length === 0 && !checkin && !dbSetupNeeded && (
        <p style={{ textAlign: 'center', color: 'var(--mv-text-tertiary)', fontSize: 'var(--mv-text-sm)', padding: 'var(--mv-space-5) 0', lineHeight: 1.7 }}>
          Faça seu primeiro check-in! 🌟<br />
          <span style={{ fontSize: 'var(--mv-text-xs)' }}>Seu diário aparecerá aqui.</span>
        </p>
      )}
    </main>
  )
}
