import HeroCard from '@/components/shared/hero-card'
import EmotionCheckin from '@/components/shared/emotion-checkin'
import SectionTitle from '@/components/shared/section-title'
import Link from 'next/link'

export default function DashboardPage() {
  return (
    <main className="mv-shell">
      <HeroCard name="Clarice" />

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
              Médico — Dr. Carlos
            </p>
            <p style={{ margin: '2px 0 0', fontSize: 'var(--mv-text-sm)', color: 'var(--mv-text-secondary)' }}>
              Hoje • 14:00
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
              Metformina — 1 comprimido
            </p>
            <p style={{ margin: '2px 0 0', fontSize: 'var(--mv-text-sm)', color: 'var(--mv-text-secondary)' }}>
              Às 18:00
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
