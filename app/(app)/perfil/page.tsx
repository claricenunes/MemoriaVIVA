import GlassCard from '@/components/shared/glass-card'
import PageHeader from '@/components/shared/page-header'
import LogoutButton from '@/components/auth/logout-button'
import { FontSizeToggle } from '@/components/accessibility/font-size-provider'
import ModoFamiliar from '@/components/shared/modo-familiar'

const PREFS = [
  { label: 'Tema',                  value: 'Claro',            icon: 'sun'   },
  { label: 'Notificações',          value: 'Ativadas',         icon: 'bell'  },
  { label: 'Lembrete de remédios',  value: '15 min antes',     icon: 'clock' },
]

const ACCOUNT_ITEMS = [
  { label: 'Família e acessos',     icon: 'users',             href: '#' },
  { label: 'Privacidade',           icon: 'shield-lock',       href: '#' },
  { label: 'Fazer backup',          icon: 'cloud-upload',      href: '#' },
  { label: 'Ajuda e suporte',       icon: 'help-circle',       href: '#' },
]

export default function PerfilPage() {
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
            <h2 style={{ margin: 0, fontSize: 'var(--mv-text-lg)', fontWeight: 700, color: 'var(--mv-text-primary)' }}>Clarice Oliveira</h2>
            <p style={{ margin: '3px 0 0', fontSize: 'var(--mv-text-sm)', color: 'var(--mv-text-secondary)' }}>
              📍 Belo Horizonte, MG
            </p>
            <p style={{ margin: '3px 0 0', fontSize: 'var(--mv-text-xs)', color: 'var(--mv-text-tertiary)' }}>
              Membro desde junho de 2026
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--mv-space-3)', marginTop: 'var(--mv-space-4)' }}>
          {[
            { label: 'Memórias',   value: 6 },
            { label: 'Dias ativos', value: 7 },
            { label: 'Remédios',   value: 4 },
          ].map(({ label, value }) => (
            <div key={label} style={{ background: 'rgba(0,0,0,0.04)', borderRadius: 'var(--mv-radius-md)', padding: '10px', textAlign: 'center' }}>
              <div style={{ fontSize: 'var(--mv-text-xl)', fontWeight: 700, color: 'var(--mv-text-primary)' }}>{value}</div>
              <div style={{ fontSize: 'var(--mv-text-xs)', color: 'var(--mv-text-tertiary)', marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>

        <button type="button" className="mv-btn mv-btn--ghost mv-btn--full" style={{ marginTop: 'var(--mv-space-4)' }}>
          <i className="ti ti-edit" aria-hidden="true" />
          Editar perfil
        </button>
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
          <a key={item.href + item.label} href={item.href} style={{ display: 'flex', alignItems: 'center', gap: 'var(--mv-space-3)', padding: '14px 16px', textDecoration: 'none', borderBottom: i < ACCOUNT_ITEMS.length - 1 ? '1px solid var(--mv-border)' : 'none' }}>
            <div className={`mv-icon-blob ${(item as { danger?: boolean }).danger ? 'mv-icon-blob--terracota' : 'mv-icon-blob--salvia'}`} style={{ width: 36, height: 36, flexShrink: 0 }}>
              <i className={`ti ti-${item.icon}`} aria-hidden="true" style={{ fontSize: 15 }} />
            </div>
            <span style={{ flex: 1, fontWeight: 600, fontSize: 'var(--mv-text-sm)', color: (item as { danger?: boolean }).danger ? 'var(--mv-terracota-deep)' : 'var(--mv-text-primary)' }}>
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
        Memória Viva v1.0 • euclaricenunes@gmail.com
      </p>
    </main>
  )
}
