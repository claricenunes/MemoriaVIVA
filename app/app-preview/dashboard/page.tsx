import HeroCard from "../components/HeroCard";
import EmotionCheckin from "../components/EmotionCheckin";
import EventCard from "../components/EventCard";
import MedicationCard from "../components/MedicationCard";
import SectionTitle from "../components/SectionTitle";
import BottomNav from "../components/BottomNav";
import FloatingAction from "../components/FloatingAction";

export default function DashboardPreviewPage() {
  return (
    <main className="mv-shell">
      <HeroCard name="Clarice" date="Hoje é sexta-feira, 12 de junho" />

      {/* Check-in diário */}
      <div style={{ marginTop: "var(--mv-space-5)" }}>
        <EmotionCheckin />
      </div>

      {/* Aviso: pagamento próximo */}
      <div className="mv-alert-strip mv-alert-strip--ambar" style={{ marginTop: "var(--mv-space-4)" }}>
        <i className="ti ti-calendar-due" style={{ fontSize: 20, flexShrink: 0 }} aria-hidden="true" />
        <span className="mv-alert-strip-text">
          Conta de água vence amanhã — R$&nbsp;85,00
        </span>
        <a href="/app-preview/financeiro" style={{ fontSize: "var(--mv-text-xs)", fontWeight: 600, color: "var(--mv-ambar-deep)", textDecoration: "none", flexShrink: 0 }}>
          Ver
        </a>
      </div>

      {/* Próximo compromisso */}
      <SectionTitle title="Próximo compromisso" />
      <EventCard icon="stethoscope" title="Médico — Dr. Carlos" when="Hoje • 14:00" />

      {/* Notícia do dia */}
      <SectionTitle title="Notícia do dia" action="Ver mais" />
      <a href="/app-preview/noticias" style={{ textDecoration: "none" }}>
        <div className="mv-news-mini">
          <div className="mv-news-mini-image" style={{ background: "var(--mv-salvia-soft)" }}>
            ⚽
          </div>
          <div className="mv-news-mini-body">
            <div className="mv-news-mini-tag" style={{ color: "var(--mv-salvia-deep)" }}>
              Flamengo
            </div>
            <p className="mv-news-mini-title">
              Flamengo vence clássico e sobe na tabela do Brasileirão
            </p>
            <p style={{ fontSize: "var(--mv-text-xs)", color: "var(--mv-text-tertiary)", marginTop: 4, marginBottom: 0 }}>
              Há 2 horas
            </p>
          </div>
        </div>
      </a>

      {/* Exercício do dia */}
      <SectionTitle title="Exercício do dia" action="Ver todos" />
      <a href="/app-preview/exercicios" style={{ textDecoration: "none" }}>
        <div className="mv-exercise-hero">
          <div className="mv-exercise-hero-label">Pronto em 3 minutos ✨</div>
          <div className="mv-exercise-hero-title">Palavra escondida</div>
          <div className="mv-exercise-hero-desc">
            Encontre a palavra escondida nas letras embaralhadas
          </div>
          <button type="button" className="mv-btn mv-btn--primary" style={{ pointerEvents: "none" }}>
            <i className="ti ti-brain" aria-hidden="true" />
            Começar agora
          </button>
        </div>
      </a>

      {/* Medicamentos */}
      <SectionTitle title="Remédios" action="Ver todos" />
      <MedicationCard
        name="Losartana"
        dosage="1 comprimido"
        time="Tomado • 08:00"
        status="tomado"
      />
      <MedicationCard
        name="Metformina"
        dosage="1 comprimido"
        time="Próximo • 18:00"
        status="pendente"
      />

      <FloatingAction variant="pill" label="Precisa de ajuda?" />
      <BottomNav active="dashboard" />
    </main>
  );
}
