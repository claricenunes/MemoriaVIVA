import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import TomadoButton from '@/components/medicamentos/tomado-button'
import AdicionarMedForm from '@/components/medicamentos/adicionar-form'
import GlassCard from '@/components/shared/glass-card'
import PageHeader from '@/components/shared/page-header'
import SectionTitle from '@/components/shared/section-title'
import FloatingAction from '@/components/shared/floating-action'
import NotificacoesBanner from '@/components/shared/notificacoes-banner'
import type { Medicamento, MedicamentoRegistro } from '@/lib/types/database'

function getMedStatus(horario: string, tomado: boolean): 'tomado' | 'proximo' | 'pendente' {
  if (tomado) return 'tomado'
  const now = new Date()
  const [h, m] = horario.split(':').map(Number)
  const t = new Date(); t.setHours(h, m, 0, 0)
  return (t.getTime() - now.getTime()) > -1800_000 ? 'proximo' : 'pendente'
}

const STATUS_COLOR = {
  tomado:  { color: '#fff',                  bg: '#22A55A'                },
  proximo: { color: '#fff',                  bg: '#2B7EC9'                },
  pendente:{ color: '#5C3A00',               bg: '#F59E0B'                },
}

const STATUS_BLOB: Record<string, string> = {
  tomado:   'mv-icon-blob--salvia',
  proximo:  'mv-icon-blob--azul',
  pendente: 'mv-icon-blob--ambar',
}

const STATUS_LABEL: Record<string, string> = {
  tomado:   '✓ Tomado',
  proximo:  '⏱ Próximo',
  pendente: '! Pendente',
}

type MedDia = { med: Medicamento; horario: string; status: 'tomado' | 'proximo' | 'pendente' }

export default async function MedicamentosPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const hoje = new Date().toISOString().split('T')[0]

  let meds: Medicamento[]  = []
  let medsDia: MedDia[]    = []
  let dbSetupNeeded         = false

  try {
    const [r1, r2] = await Promise.all([
      supabase.from('medicamentos').select('*').eq('user_id', user.id).eq('ativo', true).order('nome'),
      supabase.from('medicamentos_registros').select('*').eq('user_id', user.id).eq('data', hoje),
    ])

    // Código 42P01 = tabela não existe no PostgreSQL
    if (r1.error?.code === '42P01') {
      dbSetupNeeded = true
    } else {
      meds = (r1.data ?? []) as Medicamento[]
      const takenSet = new Set(
        (r2.data ?? [] as MedicamentoRegistro[]).map((r: MedicamentoRegistro) => `${r.medicamento_id}:${r.horario_previsto}`)
      )
      medsDia = meds.flatMap((med) =>
        med.horarios.map((horario) => ({
          med,
          horario,
          status: getMedStatus(horario, takenSet.has(`${med.id}:${horario}`)),
        }))
      )
    }
  } catch (e) {
    console.error('[MedicamentosPage] query error:', e)
    dbSetupNeeded = true
  }

  const tomados   = medsDia.filter((m) => m.status === 'tomado').length
  const proximos  = medsDia.filter((m) => m.status === 'proximo').length
  const pendentes = medsDia.filter((m) => m.status === 'pendente').length
  const proximo   = medsDia.find((m) => m.status === 'proximo')

  return (
    <main className="mv-shell">
      <PageHeader
        icon="pill"
        color="ambar"
        title="Medicamentos"
        subtitle={new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
      />

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

      <NotificacoesBanner />

      <GlassCard variant="hero" style={{ marginTop: 'var(--mv-space-5)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--mv-space-3)' }}>
          {[
            { n: tomados,   label: 'Tomados',   ...STATUS_COLOR.tomado   },
            { n: proximos,  label: 'Próximos',  ...STATUS_COLOR.proximo  },
            { n: pendentes, label: 'Pendentes', ...STATUS_COLOR.pendente },
          ].map(({ n, label, color, bg }) => (
            <div key={label} style={{ background: bg, borderRadius: 'var(--mv-radius-md)', padding: '12px 8px', textAlign: 'center' }}>
              <div style={{ fontSize: 'var(--mv-text-display)', fontWeight: 700, color, lineHeight: 1 }}>{n}</div>
              <div style={{ fontSize: 'var(--mv-text-xs)', color, marginTop: 4, fontWeight: 600 }}>{label}</div>
            </div>
          ))}
        </div>
        {proximo && (
          <div style={{ background: 'rgba(0,0,0,0.04)', borderRadius: 'var(--mv-radius-md)', padding: '10px 14px', marginTop: 'var(--mv-space-3)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <i className="ti ti-clock" aria-hidden="true" style={{ color: 'var(--mv-text-tertiary)', flexShrink: 0 }} />
            <span style={{ fontSize: 'var(--mv-text-sm)', color: 'var(--mv-text-secondary)' }}>
              Próximo: <strong style={{ color: 'var(--mv-text-primary)' }}>{proximo.med.nome} às {proximo.horario}</strong>
            </span>
          </div>
        )}
      </GlassCard>

      <SectionTitle title="Hoje" />
      {medsDia.length === 0 ? (
        <GlassCard>
          <p style={{ margin: 0, textAlign: 'center', color: 'var(--mv-text-tertiary)', fontSize: 'var(--mv-text-sm)', padding: 'var(--mv-space-3) 0' }}>
            {dbSetupNeeded
              ? 'Configure o banco de dados para ver seus remédios aqui.'
              : 'Nenhum remédio cadastrado ainda.\nAdicione abaixo ↓'}
          </p>
        </GlassCard>
      ) : (
        <GlassCard>
          {medsDia.map(({ med, horario, status }, i) => (
            <div
              key={`${med.id}-${horario}`}
              style={{
                display: 'flex', alignItems: 'center', gap: 'var(--mv-space-3)',
                paddingBottom: i < medsDia.length - 1 ? 'var(--mv-space-3)' : 0,
                marginBottom:  i < medsDia.length - 1 ? 'var(--mv-space-3)' : 0,
                borderBottom:  i < medsDia.length - 1 ? '1px solid var(--mv-border)' : 'none',
              }}
            >
              <div className={`mv-icon-blob ${STATUS_BLOB[status]}`} style={{ width: 48, height: 48, flexShrink: 0 }}>
                <i className="ti ti-pill" aria-hidden="true" style={{ fontSize: 20 }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, color: 'var(--mv-text-primary)', marginBottom: 2 }}>{med.nome}</div>
                <div style={{ fontSize: 'var(--mv-text-xs)', color: 'var(--mv-text-secondary)' }}>
                  {med.dosagem} • {horario}
                </div>
                <span style={{
                  display: 'inline-block', marginTop: 5,
                  fontSize: 11, fontWeight: 700,
                  color: STATUS_COLOR[status].color, background: STATUS_COLOR[status].bg,
                  padding: '3px 9px', borderRadius: 20,
                }}>
                  {STATUS_LABEL[status]}
                </span>
              </div>
              {status !== 'tomado' && <TomadoButton medicamentoId={med.id} horario={horario} />}
            </div>
          ))}
        </GlassCard>
      )}

      <SectionTitle title="Todos os meus remédios" />
      <GlassCard>
        {meds.length === 0 ? (
          <p style={{ margin: 0, textAlign: 'center', color: 'var(--mv-text-tertiary)', fontSize: 'var(--mv-text-sm)', padding: 'var(--mv-space-2) 0' }}>
            {dbSetupNeeded ? 'Configure o banco de dados primeiro.' : 'Nenhum remédio cadastrado.'}
          </p>
        ) : (
          meds.map((med, i) => (
            <div
              key={med.id}
              style={{
                display: 'flex', alignItems: 'center', gap: 'var(--mv-space-3)',
                paddingBottom: i < meds.length - 1 ? 'var(--mv-space-3)' : 0,
                marginBottom:  i < meds.length - 1 ? 'var(--mv-space-3)' : 0,
                borderBottom:  i < meds.length - 1 ? '1px solid var(--mv-border)' : 'none',
              }}
            >
              <div className="mv-icon-blob mv-icon-blob--ambar" style={{ width: 44, height: 44, flexShrink: 0 }}>
                <i className="ti ti-pill" aria-hidden="true" style={{ fontSize: 18 }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, color: 'var(--mv-text-primary)' }}>{med.nome}</div>
                <div style={{ fontSize: 'var(--mv-text-xs)', color: 'var(--mv-text-secondary)', marginTop: 2 }}>
                  {med.frequencia} • {med.horarios.join(', ')}
                </div>
                <div style={{ fontSize: 'var(--mv-text-xs)', color: med.estoque <= 14 ? 'var(--mv-ambar-deep)' : 'var(--mv-text-tertiary)', marginTop: 2 }}>
                  {med.estoque <= 14
                    ? `⚠️ Estoque baixo — ${med.estoque} comprimidos`
                    : `Estoque: ${med.estoque} comprimidos`}
                </div>
              </div>
            </div>
          ))
        )}
        <AdicionarMedForm />
      </GlassCard>

      <FloatingAction variant="add" label="Novo remédio" />
    </main>
  )
}
