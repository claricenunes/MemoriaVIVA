import GlassCard from '@/components/shared/glass-card'
import SectionTitle from '@/components/shared/section-title'

const CATEGORIES = [
  { label: 'Para você',   active: true  },
  { label: '⚽ Esportes', active: false },
  { label: '🌎 Brasil',   active: false },
  { label: '🔬 Saúde',    active: false },
  { label: '😄 Alegria',  active: false },
]

const FEATURED = {
  emoji:    '⚽',
  bg:       'var(--mv-salvia-soft)',
  tag:      'Flamengo',
  tagColor: 'var(--mv-salvia-deep)',
  title:    'Flamengo vence clássico e sobe na tabela do Brasileirão',
  summary:  'Em partida emocionante no Maracanã, o Flamengo derrotou o Vasco por 2 a 1 e subiu para a terceira posição na tabela.',
  time:     'Há 2 horas • UOL Esporte',
}

const NEWS = [
  { emoji: '💊', bg: 'var(--mv-azul-soft)',  tag: 'Saúde',    tagColor: 'var(--mv-azul-deep)',      title: 'Estudo aponta que caminhar 30 minutos por dia reduz risco cardíaco em 35%',    time: 'Há 3 horas • G1 Saúde' },
  { emoji: '🌺', bg: 'var(--mv-ambar-soft)', tag: 'Bem-estar', tagColor: 'var(--mv-ambar-deep)',     title: 'Pesquisa revela que cultivar plantas em casa melhora o humor e reduz estresse', time: 'Há 5 horas • Viva Bem' },
  { emoji: '🇧🇷', bg: 'var(--mv-terracota-soft)', tag: 'Brasil', tagColor: 'var(--mv-terracota-deep)', title: 'Nova lei facilita acesso a medicamentos para idosos em todo o país',            time: 'Há 6 horas • Agência Brasil' },
  { emoji: '😄', bg: 'var(--mv-salvia-soft)', tag: 'Alegria',  tagColor: 'var(--mv-salvia-deep)',    title: 'Vovó de 78 anos aprende a usar celular e conquista a internet com doçaria',     time: 'Há 1 dia • Portal UOL' },
  { emoji: '🎵', bg: 'var(--mv-azul-soft)',  tag: 'Cultura',  tagColor: 'var(--mv-azul-deep)',      title: 'Roberto Carlos anuncia turnê de despedida com shows em 15 cidades brasileiras',  time: 'Há 1 dia • Folha de S.Paulo' },
  { emoji: '🌤️', bg: 'var(--mv-ambar-soft)', tag: 'Tempo',    tagColor: 'var(--mv-ambar-deep)',     title: 'Previsão indica semana de sol com temperaturas agradáveis no Sudeste',           time: 'Há 2 dias • Climatempo' },
]

export default function NoticiasPage() {
  return (
    <main className="mv-shell">
      <header className="mv-fade-in" style={{ padding: '8px 4px 4px' }}>
        <p className="mv-greeting">
          <i className="ti ti-news" aria-hidden="true" style={{ marginRight: 6 }} />
          Notícias selecionadas
        </p>
        <h1 className="mv-title">O que aconteceu hoje</h1>
        <p className="mv-subtitle">Notícias sem drama, só o que importa</p>
      </header>

      <div className="mv-chips" style={{ marginTop: 'var(--mv-space-5)' }}>
        {CATEGORIES.map((cat) => (
          <button key={cat.label} type="button" className={`mv-chip${cat.active ? ' mv-chip--active' : ''}`}>
            {cat.label}
          </button>
        ))}
      </div>

      <SectionTitle title="Destaque do dia" />
      <GlassCard variant="hero">
        <div style={{ display: 'flex', gap: 'var(--mv-space-4)', alignItems: 'flex-start' }}>
          <div style={{ width: 80, height: 80, borderRadius: 'var(--mv-radius-md)', background: FEATURED.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, flexShrink: 0 }}>
            {FEATURED.emoji}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 'var(--mv-text-xs)', fontWeight: 700, color: FEATURED.tagColor, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{FEATURED.tag}</div>
            <p style={{ margin: 0, fontWeight: 700, fontSize: 'var(--mv-text-md)', lineHeight: 1.4, color: 'var(--mv-text-primary)' }}>{FEATURED.title}</p>
            <p style={{ margin: '8px 0 0', fontSize: 'var(--mv-text-sm)', color: 'var(--mv-text-secondary)', lineHeight: 1.5 }}>{FEATURED.summary}</p>
            <p style={{ margin: '8px 0 0', fontSize: 'var(--mv-text-xs)', color: 'var(--mv-text-tertiary)' }}>{FEATURED.time}</p>
          </div>
        </div>
      </GlassCard>

      <SectionTitle title="Mais notícias" />
      <GlassCard>
        {NEWS.map((item, i) => (
          <div key={i} style={{ display: 'flex', gap: 'var(--mv-space-3)', paddingBottom: i < NEWS.length - 1 ? 'var(--mv-space-4)' : 0, marginBottom: i < NEWS.length - 1 ? 'var(--mv-space-4)' : 0, borderBottom: i < NEWS.length - 1 ? '1px solid var(--mv-border)' : 'none' }}>
            <div style={{ width: 52, height: 52, borderRadius: 'var(--mv-radius-sm)', background: item.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>
              {item.emoji}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: item.tagColor, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 4 }}>{item.tag}</div>
              <p style={{ margin: 0, fontSize: 'var(--mv-text-sm)', fontWeight: 600, color: 'var(--mv-text-primary)', lineHeight: 1.4 }}>{item.title}</p>
              <p style={{ margin: '4px 0 0', fontSize: 'var(--mv-text-xs)', color: 'var(--mv-text-tertiary)' }}>{item.time}</p>
            </div>
          </div>
        ))}
      </GlassCard>

      <p style={{ textAlign: 'center', fontSize: 'var(--mv-text-xs)', color: 'var(--mv-text-tertiary)', padding: 'var(--mv-space-5) 0 var(--mv-space-4)', lineHeight: 1.6 }}>
        Notícias filtradas para você — sem sensacionalismo<br />
        Atualizado às 08:00 de hoje
      </p>
    </main>
  )
}
