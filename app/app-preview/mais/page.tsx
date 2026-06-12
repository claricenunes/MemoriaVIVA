import GlassCard from "../components/GlassCard";
import BottomNav from "../components/BottomNav";

const HUB_ITEMS = [
  {
    emoji:     "💊",
    label:     "Remédios",
    desc:      "Seus medicamentos do dia",
    href:      "/app-preview/medicamentos",
    blobClass: "mv-icon-blob--salvia",
  },
  {
    emoji:     "📚",
    label:     "Memórias",
    desc:      "Suas lembranças felizes",
    href:      "/app-preview/memorias",
    blobClass: "mv-icon-blob--terracota",
  },
  {
    emoji:     "💰",
    label:     "Financeiro",
    desc:      "Entradas e saídas do mês",
    href:      "/app-preview/financeiro",
    blobClass: "mv-icon-blob--ambar",
  },
  {
    emoji:     "📰",
    label:     "Notícias",
    desc:      "O que há no mundo hoje",
    href:      "/app-preview/noticias",
    blobClass: "mv-icon-blob--azul",
  },
  {
    emoji:     "🧠",
    label:     "Exercícios",
    desc:      "Ative sua mente agora",
    href:      "/app-preview/exercicios",
    blobClass: "mv-icon-blob--terracota",
  },
  {
    emoji:     "👤",
    label:     "Perfil",
    desc:      "Suas informações pessoais",
    href:      "/app-preview/perfil",
    blobClass: "mv-icon-blob--azul",
  },
];

const SETTINGS_ROWS = [
  { icon: "phone-call", label: "Contatos de emergência" },
  { icon: "bell",       label: "Notificações" },
  { icon: "settings",   label: "Configurações" },
  { icon: "help-circle", label: "Ajuda" },
];

export default function MaisPage() {
  return (
    <main className="mv-shell">
      <header className="mv-fade-in" style={{ padding: "8px 4px 4px" }}>
        <p className="mv-greeting">
          <i className="ti ti-grid-dots" aria-hidden="true" style={{ marginRight: 6 }} />
          Tudo no app
        </p>
        <h1 className="mv-title">O que você precisa</h1>
      </header>

      {/* Hub de módulos */}
      <div className="mv-hub-grid" style={{ marginTop: "var(--mv-space-5)" }}>
        {HUB_ITEMS.map((item) => (
          <a key={item.label} href={item.href} className="mv-hub-item">
            <div className={`mv-icon-blob ${item.blobClass}`} style={{ width: 52, height: 52, fontSize: 22 }}>
              {item.emoji}
            </div>
            <div className="mv-hub-item-label">{item.label}</div>
            <div className="mv-hub-item-desc">{item.desc}</div>
          </a>
        ))}
      </div>

      {/* Configurações e ajuda */}
      <div style={{ marginTop: "var(--mv-space-6)" }}>
        <GlassCard>
          {SETTINGS_ROWS.map((row) => (
            <div key={row.label} className="mv-settings-row">
              <div className="mv-icon-blob mv-icon-blob--azul" style={{ width: 42, height: 42 }}>
                <i className={`ti ti-${row.icon}`} aria-hidden="true" style={{ fontSize: 18 }} />
              </div>
              <span className="mv-settings-row-label">{row.label}</span>
              <i className="ti ti-chevron-right" style={{ color: "var(--mv-text-tertiary)", fontSize: 18 }} aria-hidden="true" />
            </div>
          ))}
        </GlassCard>
      </div>

      <BottomNav active="mais" />
    </main>
  );
}
