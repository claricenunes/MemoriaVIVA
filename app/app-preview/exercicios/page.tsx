import GlassCard from "../components/GlassCard";
import SectionTitle from "../components/SectionTitle";
import BottomNav from "../components/BottomNav";

const EXERCISES = [
  { emoji: "🧩", name: "Complete\na palavra",    duration: "2 min", bg: "var(--mv-ambar-soft)" },
  { emoji: "👁️", name: "Reconheça\no objeto",   duration: "3 min", bg: "var(--mv-azul-soft)" },
  { emoji: "🎭", name: "Memória\nvisual",        duration: "5 min", bg: "var(--mv-salvia-soft)" },
  { emoji: "👤", name: "Quem\né quem?",          duration: "4 min", bg: "var(--mv-terracota-soft)" },
  { emoji: "🔢", name: "Lembrar\nsequência",     duration: "2 min", bg: "var(--mv-azul-soft)" },
  { emoji: "🌍", name: "Palavras\ndo mundo",     duration: "3 min", bg: "var(--mv-salvia-soft)" },
];

const HISTORY = [
  { date: "Ontem",      ex: "Memória visual",     score: "4 de 5 acertos" },
  { date: "Qua, 10 jun", ex: "Complete a palavra", score: "5 de 5 acertos" },
  { date: "Ter, 9 jun",  ex: "Palavra escondida",  score: "3 palavras" },
];

export default function ExerciciosPage() {
  return (
    <main className="mv-shell">
      <header className="mv-fade-in" style={{ padding: "8px 4px 4px" }}>
        <p className="mv-greeting">
          <i className="ti ti-brain" aria-hidden="true" style={{ marginRight: 6 }} />
          Exercícios
        </p>
        <h1 className="mv-title">Ative sua mente</h1>
        <p className="mv-subtitle">Rápido, simples e divertido</p>
      </header>

      {/* Sequência de dias */}
      <div className="mv-exercise-streak" style={{ marginTop: "var(--mv-space-5)" }}>
        <span style={{ fontSize: 26 }}>🔥</span>
        <div>
          <div className="mv-exercise-streak-text">3 dias seguidos! Continue assim.</div>
          <div style={{ fontSize: "var(--mv-text-xs)", color: "var(--mv-ambar-deep)", marginTop: 2 }}>
            Sua maior sequência foi de 7 dias
          </div>
        </div>
      </div>

      {/* Exercício em destaque */}
      <div className="mv-exercise-hero">
        <div className="mv-exercise-hero-label">Exercício de hoje ✨</div>
        <p className="mv-exercise-hero-title">Palavra escondida</p>
        <p className="mv-exercise-hero-desc">
          Encontre a palavra escondida nas letras embaralhadas. Rápido e divertido!
        </p>
        <button type="button" className="mv-btn mv-btn--primary">
          <i className="ti ti-player-play" aria-hidden="true" />
          Começar — 3 min
        </button>
      </div>

      {/* Outros exercícios */}
      <SectionTitle title="Outros exercícios" />
      <div className="mv-exercise-grid">
        {EXERCISES.map((ex) => (
          <button
            key={ex.name}
            type="button"
            className="mv-exercise-item"
            style={{ background: ex.bg }}
          >
            <span className="mv-exercise-icon">{ex.emoji}</span>
            <span className="mv-exercise-name" style={{ whiteSpace: "pre-line" }}>{ex.name}</span>
            <span className="mv-exercise-duration">{ex.duration}</span>
          </button>
        ))}
      </div>

      {/* Histórico */}
      <SectionTitle title="Histórico recente" />
      <GlassCard>
        {HISTORY.map((entry) => (
          <div key={entry.date} className="mv-finance-row">
            <div className="mv-icon-blob mv-icon-blob--ambar" style={{ width: 42, height: 42 }}>
              <i className="ti ti-brain" aria-hidden="true" style={{ fontSize: 18 }} />
            </div>
            <div className="mv-finance-row-content">
              <p className="mv-finance-row-label">{entry.ex}</p>
              <div className="mv-finance-row-date">{entry.date}</div>
            </div>
            <span style={{ fontSize: "var(--mv-text-sm)", color: "var(--mv-salvia-deep)", fontWeight: 600 }}>
              {entry.score}
            </span>
          </div>
        ))}
      </GlassCard>

      <BottomNav active="mais" />
    </main>
  );
}
