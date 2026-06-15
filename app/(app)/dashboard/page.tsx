import HeroCard from '@/components/shared/hero-card'
import EmotionCheckin from '@/components/shared/emotion-checkin'
import EventCard from '@/components/shared/event-card'
import MedicationCard from '@/components/shared/medication-card'
import SectionTitle from '@/components/shared/section-title'

export default function DashboardPage() {
  return (
    <main className="mv-shell">
      <HeroCard name="Clarice" />

      <div style={{ marginTop: 'var(--mv-space-5)' }}>
        <EmotionCheckin />
      </div>

      <div className="mv-alert-strip mv-alert-strip--ambar" style={{ marginTop: 'var(--mv-space-4)' }}>
        <i className="ti ti-calendar-due" style={{ fontSize: 20, flexShrink: 0 }} aria-hidden="true" />
        <span className="mv-alert-strip-text">
          Conta de água vence amanhã — R$&nbsp;85,00
        </span>
        <a href="/financeiro" style={{ fontSize: 'var(--mv-text-xs)', fontWeight: 600, color: 'var(--mv-ambar-deep)', textDecoration: 'none', flexShrink: 0 }}>
          Ver
        </a>
      </div>

      <SectionTitle title="Próximo compromisso" />
      <EventCard icon="stethoscope" title="Médico — Dr. Carlos" when="Hoje • 14:00" />

      <SectionTitle title="Notícia do dia" action="Ver mais" actionHref="/noticias" />
      <a href="/noticias" style={{ textDecoration: 'none' }}>
        <div className="mv-news-mini">
          <div className="mv-news-mini-image" style={{ background: 'var(--mv-salvia-soft)' }}>⚽</div>
          <div className="mv-news-mini-body">
            <div className="mv-news-mini-tag" style={{ color: 'var(--mv-salvia-deep)' }}>Flamengo</div>
            <p className="mv-news-mini-title">Flamengo vence clássico e sobe na tabela do Brasileirão</p>
            <p style={{ fontSize: 'var(--mv-text-xs)', color: 'var(--mv-text-tertiary)', marginTop: 4, marginBottom: 0 }}>
              Há 2 horas
            </p>
          </div>
        </div>
      </a>

      <SectionTitle title="Exercício do dia" action="Ver todos" actionHref="/exercicios" />
      <a href="/exercicios" style={{ textDecoration: 'none' }}>
        <div className="mv-exercise-hero">
          <div className="mv-exercise-hero-label">Pronto em 3 minutos ✨</div>
          <div className="mv-exercise-hero-title">Palavra escondida</div>
          <div className="mv-exercise-hero-desc">Encontre a palavra escondida nas letras embaralhadas</div>
          <button type="button" className="mv-btn mv-btn--primary" style={{ pointerEvents: 'none' }}>
            <i className="ti ti-brain" aria-hidden="true" />
            Começar agora
          </button>
        </div>
      </a>

      <SectionTitle title="Remédios" action="Ver todos" actionHref="/medicamentos" />
      <MedicationCard name="Losartana"  dosage="1 comprimido" time="Tomado • 08:00"  status="tomado" />
      <MedicationCard name="Metformina" dosage="1 comprimido" time="Próximo • 18:00" status="pendente" />

    </main>
  )
}
