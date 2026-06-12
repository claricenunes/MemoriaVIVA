import GlassCard from "../components/GlassCard";
import SectionTitle from "../components/SectionTitle";
import BottomNav from "../components/BottomNav";

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

// Junho 2026 começa numa segunda (índice 1), então Dom antes é vazio
const CALENDAR_DAYS: { day: number | null; dots: string[] }[] = [
  { day: null, dots: [] },
  { day: 1,  dots: [] },
  { day: 2,  dots: [] },
  { day: 3,  dots: [] },
  { day: 4,  dots: [] },
  { day: 5,  dots: ["ambar"] },
  { day: 6,  dots: [] },
  { day: 7,  dots: [] },
  { day: 8,  dots: [] },
  { day: 9,  dots: ["azul"] },
  { day: 10, dots: ["terracota"] },
  { day: 11, dots: [] },
  { day: 12, dots: ["azul", "terracota"] },
  { day: 13, dots: [] },
  { day: 14, dots: ["salvia"] },
  { day: 15, dots: [] },
  { day: 16, dots: ["terracota"] },
  { day: 17, dots: [] },
  { day: 18, dots: [] },
  { day: 19, dots: ["ambar"] },
  { day: 20, dots: [] },
  { day: 21, dots: ["salvia"] },
  { day: 22, dots: [] },
  { day: 23, dots: [] },
  { day: 24, dots: ["azul"] },
  { day: 25, dots: [] },
  { day: 26, dots: [] },
  { day: 27, dots: [] },
  { day: 28, dots: ["terracota"] },
  { day: 29, dots: [] },
  { day: 30, dots: ["salvia"] },
];

const TODAY = 12;

const CATEGORIES = [
  { label: "Todos",        active: true  },
  { label: "🔴 Médico",   active: false },
  { label: "🔵 Psicóloga", active: false },
  { label: "🟡 Estudos",  active: false },
  { label: "🟢 Social",   active: false },
  { label: "🟣 Missa",    active: false },
];

const DOT_COLOR: Record<string, string> = {
  terracota: "var(--mv-terracota)",
  azul:      "var(--mv-azul-suave)",
  ambar:     "var(--mv-ambar)",
  salvia:    "var(--mv-salvia)",
};

const BLOB_CLASS: Record<string, string> = {
  terracota: "mv-icon-blob--terracota",
  azul:      "mv-icon-blob--azul",
  ambar:     "mv-icon-blob--ambar",
  salvia:    "mv-icon-blob--salvia",
};

const EVENTS_TODAY = [
  {
    time: "09:00",
    label: "Psicóloga Dra. Maria",
    details: "Centro de Saúde Mental",
    icon: "brain",
    category: "azul",
  },
  {
    time: "14:00",
    label: "Médico Dr. Carlos",
    details: "Clínica São Lucas",
    icon: "stethoscope",
    category: "terracota",
  },
  {
    time: "18:30",
    label: "Remédio — Losartana",
    details: "1 comprimido",
    icon: "pill",
    category: "salvia",
  },
];

const LEGEND = [
  { color: "var(--mv-terracota)",  label: "Médico" },
  { color: "var(--mv-azul-suave)", label: "Psicóloga" },
  { color: "var(--mv-ambar)",      label: "Estudos/Fé" },
  { color: "var(--mv-salvia)",     label: "Social/Saúde" },
];

export default function AgendaPreviewPage() {
  return (
    <main className="mv-shell">
      <header className="mv-fade-in" style={{ padding: "8px 4px 4px" }}>
        <p className="mv-greeting">
          <i className="ti ti-calendar" aria-hidden="true" style={{ marginRight: 6 }} />
          Sua agenda
        </p>
        <h1 className="mv-title">Junho de 2026</h1>
      </header>

      {/* Filtros por categoria */}
      <div className="mv-chips" style={{ marginTop: "var(--mv-space-5)" }}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.label}
            type="button"
            className={`mv-chip ${cat.active ? "mv-chip--active" : ""}`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Calendário com pontos de eventos */}
      <GlassCard>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, marginBottom: 8 }}>
          {WEEKDAYS.map((d) => (
            <div
              key={d}
              style={{ textAlign: "center", fontSize: "var(--mv-text-xs)", color: "var(--mv-text-tertiary)", fontWeight: 600, paddingBottom: 4 }}
            >
              {d}
            </div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
          {CALENDAR_DAYS.map((cell, i) => (
            <div
              key={i}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "3px 0" }}
            >
              {cell.day !== null && (
                <>
                  <span
                    className={
                      cell.day === TODAY
                        ? "mv-calendar-day mv-calendar-day--today"
                        : "mv-calendar-day"
                    }
                    style={{ width: 34, height: 34 }}
                  >
                    {cell.day}
                  </span>
                  <div style={{ display: "flex", gap: 2, marginTop: 3, minHeight: 6 }}>
                    {cell.dots.map((color, di) => (
                      <span
                        key={di}
                        style={{ width: 5, height: 5, borderRadius: "50%", background: DOT_COLOR[color] ?? "var(--mv-text-tertiary)", display: "block" }}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Eventos de hoje */}
      <SectionTitle title="Hoje, sexta-feira" />
      <GlassCard>
        {EVENTS_TODAY.map((event) => (
          <div className="mv-agenda-item" key={event.time}>
            <span className="mv-agenda-time">{event.time}</span>
            <div
              className={`mv-icon-blob ${BLOB_CLASS[event.category] ?? "mv-icon-blob--azul"}`}
              style={{ width: 42, height: 42 }}
            >
              <i className={`ti ti-${event.icon}`} aria-hidden="true" style={{ fontSize: 18 }} />
            </div>
            <div style={{ flex: 1 }}>
              <div className="mv-agenda-label">{event.label}</div>
              <div style={{ fontSize: "var(--mv-text-xs)", color: "var(--mv-text-secondary)", marginTop: 2 }}>
                {event.details}
              </div>
            </div>
          </div>
        ))}
      </GlassCard>

      {/* Legenda */}
      <div style={{ display: "flex", gap: "var(--mv-space-5)", flexWrap: "wrap", padding: "var(--mv-space-3) var(--mv-space-1) var(--mv-space-4)" }}>
        {LEGEND.map((leg) => (
          <div key={leg.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: leg.color, display: "block", flexShrink: 0 }} />
            <span style={{ fontSize: "var(--mv-text-xs)", color: "var(--mv-text-secondary)" }}>{leg.label}</span>
          </div>
        ))}
      </div>

      <button type="button" className="mv-btn mv-btn--primary mv-btn--full">
        <i className="ti ti-plus" aria-hidden="true" />
        Novo compromisso
      </button>

      <BottomNav active="agenda" />
    </main>
  );
}
