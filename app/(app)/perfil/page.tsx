import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import GlassCard from '@/components/shared/glass-card'
import PageHeader from '@/components/shared/page-header'
import LogoutButton from '@/components/auth/logout-button'
import { FontSizeToggle } from '@/components/accessibility/font-size-provider'
import ModoFamiliar from '@/components/shared/modo-familiar'
import EditarPerfilModal from './editar-perfil-modal'

const PREFS = [
  { label: 'Tema',                  value: 'Claro',        icon: 'sun'   },
  { label: 'Notificações',          value: 'Ativadas',     icon: 'bell'  },
  { label: 'Lembrete de remédios',  value: '15 min antes', icon: 'clock' },
]

const ACCOUNT_ITEMS = [
  { label: 'Família e acessos',  icon: 'users',        href: '#' },
  { label: 'Privacidade',        icon: 'shield-lock',  href: '#' },
  { label: 'Fazer backup',       icon: 'cloud-upload', href: '#' },
  { label: 'Ajuda e suporte',    icon: 'help-circle',  href: '#' },
]

function nomeDisplay(user: { user_metadata?: Record<string, string>; email?: string }): string {
  const meta = user.user_metadata ?? {}
  const nome = meta.nome ?? meta.full_name ?? meta.name ?? ''
  if (nome) return nome
  const email = user.email ?? ''
  const local = email.split('@')[0].replace(/[._-]/g, ' ')
  return local.replace(/\b\w/g, (c) => c.toUpperCase())
}

function membroDesde(createdAt: string): string {
  return new Date(createdAt).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
}

function calcularStreak(dates: string[]): number {
  if (dates.length === 0) return 0
  const set = new Set(dates)

  // Data de hoje no horário de Brasília (UTC-3)
  const brasilia = new Date(Date.now() - 3 * 60 * 60 * 1000)
  const hojeStr  = brasilia.toISOString().split('T')[0]

  // Se hoje ainda não tem check-in, começa a contar a partir de ontem
  const offset = set.has(hojeStr) ? 0 : 1
  let streak = 0

  for (let i = offset; i < 366; i++) {
    const d = new Date(brasilia)
    d.setUTCDate(d.getUTCDate() - i)
    const iso = d.toISOString().split('T')[0]
    if (set.has(iso)) streak++
    else break
  }

  return streak
}

export default async function PerfilPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Cada stat é number (sucesso) ou null (erro → exibe "—")
  let totalMemorias: number | null = null
  let streak:        number | null = null
  let totalRemedios: number | null = null

  try {
    const [memorias, checkins, remedios] = await Promise.all([
      supabase
        .from('memorias')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id),
      supabase
        .from('saude_registros')
        .select('data')
        .eq('user_id', user.id)
        .order('data', { ascending: false })
        .limit(60),
      supabase
        .from('medicamentos')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('ativo', true),
    ])

    if (!memorias.error) totalMemorias = memorias.count  ?? 0
    if (!checkins.error) streak        = calcularStreak(checkins.data?.map((r) => r.data) ?? [])
    if (!remedios.error) totalRemedios = remedios.count  ?? 0
  } catch {
    // queries falham silenciosamente — stats ficam null (exibem "—")
  }

  const nome  = nomeDisplay(user as Parameters<typeof nomeDisplay>[0])
  const email = user.email ?? ''
  const desde = membroDesde(user.created_at)

  const stats = [
    { label: 'Memórias',      value: totalMemorias },
    { label: 'Dias seguidos', value: streak        },
    { label: 'Remédios',      value: totalRemedios },
  ]

  return (
    <main className="mv-shell">
      <PageHeader icon="user-circle" color="terracota" title="Meu Perfil" />

      <GlassCard variant="hero" style={{ marginTop: 'var(--mv-space-5)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--mv-space-4)' }}>
          <div style={{
            width: 72, height: 72, borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--mv-terracota-soft), var(--mv-salvia-soft))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 32, flexShrink: 0, border: '3px solid white',
            boxShadow: 'var(--mv-shadow-sm)',
          }}>
            👩
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: 'var(--mv-text-lg)', fontWeight: 700, color: 'var(--mv-text-primary)' }}>{nome}</h2>
            <p style={{ margin: '3px 0 0', fontSize: 'var(--mv-text-sm)', color: 'var(--mv-text-secondary)' }}>
              {email}
            </p>
            <p style={{ margin: '3px 0 0', fontSize: 'var(--mv-text-xs)', color: 'var(--mv-text-tertiary)' }}>
              Membro desde {desde}
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--mv-space-3)', marginTop: 'var(--mv-space-4)' }}>
          {stats.map(({ label, value }) => (
            <div key={label} style={{ background: 'rgba(0,0,0,0.04)', borderRadius: 'var(--mv-radius-md)', padding: '10px', textAlign: 'center' }}>
              <div style={{ fontSize: 'var(--mv-text-xl)', fontWeight: 700, color: 'var(--mv-text-primary)' }}>
                {value === null ? '—' : value}
              </div>
              <div style={{ fontSize: 'var(--mv-text-xs)', color: 'var(--mv-text-tertiary)', marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>

        <EditarPerfilModal nomeAtual={nome} />
      </GlassCard>

      <p style={{ margin: 'var(--mv-space-5) 0 var(--mv-space-3) 4px', fontSize: 'var(--mv-text-xs)', fontWeight: 700, color: 'var(--mv-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
        Acessibilidade
      </p>
      <GlassCard>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--mv-space-3)', marginBottom: 'var(--mv-space-3)' }}>
          <div className="mv-icon-blob mv-icon-blob--azul" style={{ width: 36, height: 36, flexShrink: 0 }}>
            <i className="ti ti-text-size" aria-hidden="true" style={{ fontSize: 15 }} />
          </div>
          <span style={{ fontWeight: 600, color: 'var(--mv-text-primary)', fontSize: 'var(--mv-text-sm)' }}>
            Tamanho da fonte
          </span>
        </div>
        <FontSizeToggle />
      </GlassCard>

      <p style={{ margin: 'var(--mv-space-5) 0 var(--mv-space-3) 4px', fontSize: 'var(--mv-text-xs)', fontWeight: 700, color: 'var(--mv-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
        Preferências
      </p>
      <GlassCard style={{ padding: 0, overflow: 'hidden' }}>
        {PREFS.map((pref, i) => (
          <div key={pref.label} style={{ display: 'flex', alignItems: 'center', gap: 'var(--mv-space-3)', padding: '14px 16px', borderBottom: i < PREFS.length - 1 ? '1px solid var(--mv-border)' : 'none' }}>
            <div className="mv-icon-blob mv-icon-blob--azul" style={{ width: 36, height: 36, flexShrink: 0 }}>
              <i className={`ti ti-${pref.icon}`} aria-hidden="true" style={{ fontSize: 15 }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, color: 'var(--mv-text-primary)', fontSize: 'var(--mv-text-sm)' }}>{pref.label}</div>
            </div>
            <span style={{ fontSize: 'var(--mv-text-xs)', color: 'var(--mv-text-secondary)', background: 'var(--mv-bg-secondary)', padding: '4px 10px', borderRadius: 'var(--mv-radius-sm)' }}>
              {pref.value}
            </span>
            <i className="ti ti-chevron-right" aria-hidden="true" style={{ color: 'var(--mv-text-tertiary)', fontSize: 14 }} />
          </div>
        ))}
      </GlassCard>

      <p style={{ margin: 'var(--mv-space-5) 0 var(--mv-space-3) 4px', fontSize: 'var(--mv-text-xs)', fontWeight: 700, color: 'var(--mv-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
        Modo Familiar
      </p>
      <GlassCard style={{ marginBottom: 'var(--mv-space-2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--mv-space-3)', marginBottom: 'var(--mv-space-3)' }}>
          <div className="mv-icon-blob mv-icon-blob--salvia" style={{ width: 40, height: 40, flexShrink: 0 }}>
            <i className="ti ti-users" aria-hidden="true" style={{ fontSize: 18 }} />
          </div>
          <div>
            <p style={{ margin: 0, fontWeight: 700, fontSize: 'var(--mv-text-sm)', color: 'var(--mv-text-primary)' }}>
              Compartilhar com familiar
            </p>
            <p style={{ margin: '2px 0 0', fontSize: 11, color: 'var(--mv-text-secondary)' }}>
              Acesso de visualização — em breve
            </p>
          </div>
        </div>
        <ModoFamiliar />
      </GlassCard>

      <p style={{ margin: 'var(--mv-space-5) 0 var(--mv-space-3) 4px', fontSize: 'var(--mv-text-xs)', fontWeight: 700, color: 'var(--mv-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
        Conta
      </p>
      <GlassCard style={{ padding: 0, overflow: 'hidden' }}>
        {ACCOUNT_ITEMS.map((item, i) => (
          <a key={item.label} href={item.href} style={{ display: 'flex', alignItems: 'center', gap: 'var(--mv-space-3)', padding: '14px 16px', textDecoration: 'none', borderBottom: i < ACCOUNT_ITEMS.length - 1 ? '1px solid var(--mv-border)' : 'none' }}>
            <div className="mv-icon-blob mv-icon-blob--salvia" style={{ width: 36, height: 36, flexShrink: 0 }}>
              <i className={`ti ti-${item.icon}`} aria-hidden="true" style={{ fontSize: 15 }} />
            </div>
            <span style={{ flex: 1, fontWeight: 600, fontSize: 'var(--mv-text-sm)', color: 'var(--mv-text-primary)' }}>
              {item.label}
            </span>
            <i className="ti ti-chevron-right" aria-hidden="true" style={{ color: 'var(--mv-text-tertiary)', fontSize: 14 }} />
          </a>
        ))}
      </GlassCard>

      <GlassCard style={{ padding: 0, overflow: 'hidden', marginTop: 'var(--mv-space-3)' }}>
        <LogoutButton
          style={{
            display: 'flex', alignItems: 'center', gap: 'var(--mv-space-3)',
            padding: '14px 16px', width: '100%', background: 'none', border: 'none',
            cursor: 'pointer', textAlign: 'left',
          }}
        >
          <div className="mv-icon-blob mv-icon-blob--terracota" style={{ width: 36, height: 36, flexShrink: 0 }}>
            <i className="ti ti-logout" aria-hidden="true" style={{ fontSize: 15 }} />
          </div>
          <span style={{ flex: 1, fontWeight: 600, fontSize: 'var(--mv-text-sm)', color: 'var(--mv-terracota-deep)' }}>
            Sair
          </span>
          <i className="ti ti-chevron-right" aria-hidden="true" style={{ color: 'var(--mv-text-tertiary)', fontSize: 14 }} />
        </LogoutButton>
      </GlassCard>

      <p style={{ textAlign: 'center', fontSize: 'var(--mv-text-xs)', color: 'var(--mv-text-tertiary)', padding: 'var(--mv-space-6) 0 var(--mv-space-4)' }}>
        Memória Viva v1.0 • {email}
      </p>
    </main>
  )
}
