import GlassCard from '@/components/shared/glass-card'

const SECTIONS = [
  {
    title: 'Memória & História',
    items: [
      { icon: 'photo-heart',   label: 'Minhas Memórias',   color: 'terracota', href: '/memorias',         desc: 'Fotos e histórias guardadas' },
      { icon: 'book-2',        label: 'Minha História',     color: 'terracota', href: '/mais/historia',    desc: 'Narrativa da sua vida' },
      { icon: 'star',          label: 'Feito Hoje',         color: 'ambar',     href: '/mais/feito-hoje',  desc: 'Conquistas do dia' },
    ],
  },
  {
    title: 'Pessoas & Contatos',
    items: [
      { icon: 'users',         label: 'Quem é Quem',        color: 'azul',      href: '/mais/quem-e-quem', desc: 'Suas pessoas queridas' },
      { icon: 'phone-call',    label: 'Emergência',         color: 'ambar',     href: '/mais/emergencia',  desc: 'Contatos e kit de primeiros-socorros' },
    ],
  },
  {
    title: 'Saúde & Bem-estar',
    items: [
      { icon: 'map-pin',       label: 'Onde Guardei',       color: 'salvia',    href: '/mais/onde-guardei', desc: 'Não perca mais nada' },
      { icon: 'robot',         label: 'Assistente',         color: 'azul',      href: '/mais/assistente',   desc: 'Pergunte o que quiser' },
    ],
  },
  {
    title: 'Configurações',
    items: [
      { icon: 'user-circle',   label: 'Meu Perfil',         color: 'terracota', href: '/perfil',            desc: 'Seus dados e preferências' },
    ],
  },
]

const ICON_BLOB_CLASS: Record<string, string> = {
  terracota: 'mv-icon-blob--terracota',
  azul:      'mv-icon-blob--azul',
  salvia:    'mv-icon-blob--salvia',
  ambar:     'mv-icon-blob--ambar',
}

export default function MaisPage() {
  return (
    <main className="mv-shell">
      <header className="mv-fade-in" style={{ padding: '8px 4px 4px' }}>
        <p className="mv-greeting">
          <i className="ti ti-grid-dots" aria-hidden="true" style={{ marginRight: 6 }} />
          Tudo em um lugar
        </p>
        <h1 className="mv-title">Mais</h1>
      </header>

      {SECTIONS.map((section) => (
        <div key={section.title} style={{ marginTop: 'var(--mv-space-5)' }}>
          <p style={{ margin: '0 0 var(--mv-space-3)', fontSize: 'var(--mv-text-xs)', fontWeight: 700, color: 'var(--mv-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.07em', paddingLeft: 4 }}>
            {section.title}
          </p>
          <GlassCard style={{ padding: 0, overflow: 'hidden' }}>
            {section.items.map((item, i) => (
              <a key={item.href} href={item.href} style={{ display: 'flex', alignItems: 'center', gap: 'var(--mv-space-3)', padding: '14px 16px', textDecoration: 'none', borderBottom: i < section.items.length - 1 ? '1px solid var(--mv-border)' : 'none' }}>
                <div className={`mv-icon-blob ${ICON_BLOB_CLASS[item.color] ?? 'mv-icon-blob--azul'}`} style={{ width: 44, height: 44, flexShrink: 0 }}>
                  <i className={`ti ti-${item.icon}`} aria-hidden="true" style={{ fontSize: 18 }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, color: 'var(--mv-text-primary)', marginBottom: 2 }}>{item.label}</div>
                  <div style={{ fontSize: 'var(--mv-text-xs)', color: 'var(--mv-text-secondary)' }}>{item.desc}</div>
                </div>
                <i className="ti ti-chevron-right" aria-hidden="true" style={{ color: 'var(--mv-text-tertiary)', fontSize: 16 }} />
              </a>
            ))}
          </GlassCard>
        </div>
      ))}

      <p style={{ textAlign: 'center', fontSize: 'var(--mv-text-xs)', color: 'var(--mv-text-tertiary)', padding: 'var(--mv-space-6) 0 var(--mv-space-4)', lineHeight: 1.6 }}>
        Memória Viva v1.0<br />
        Feito com ❤️ para quem a gente ama
      </p>
    </main>
  )
}
