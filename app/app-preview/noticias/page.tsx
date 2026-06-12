import SectionTitle from "../components/SectionTitle";
import BottomNav from "../components/BottomNav";

const CATEGORIES = [
  { label: "Todas",           active: true  },
  { label: "⚽ Flamengo",    active: false },
  { label: "🏛️ Política",    active: false },
  { label: "✝️ Religião",    active: false },
  { label: "📝 Português",   active: false },
  { label: "💡 Curiosidades", active: false },
];

const FEATURED = {
  emoji:    "⚽",
  bg:       "var(--mv-salvia-soft)",
  tag:      "Flamengo",
  tagBg:    "var(--mv-salvia-soft)",
  tagColor: "var(--mv-salvia-deep)",
  title:    "Flamengo vence clássico e sobe na tabela do Brasileirão",
  summary:  "O Mengão conquistou mais uma vitória importante. A torcida comemorou bastante no Maracanã.",
  time:     "Há 2 horas",
};

const NEWS = [
  {
    emoji:    "🏛️",
    bg:       "var(--mv-azul-soft)",
    tag:      "Política",
    tagColor: "var(--mv-azul-deep)",
    title:    "Congresso aprova nova lei de proteção ao idoso",
    time:     "Ontem",
  },
  {
    emoji:    "✝️",
    bg:       "var(--mv-ambar-soft)",
    tag:      "Religião",
    tagColor: "var(--mv-ambar-deep)",
    title:    "Festa de Corpus Christi celebrada em todo o Brasil",
    time:     "Há 1 dia",
  },
  {
    emoji:    "📝",
    bg:       "var(--mv-terracota-soft)",
    tag:      "Português",
    tagColor: "var(--mv-terracota-deep)",
    title:    "Você sabia? 'Saudade' não tem tradução em inglês",
    time:     "Há 2 dias",
  },
  {
    emoji:    "💡",
    bg:       "var(--mv-salvia-soft)",
    tag:      "Curiosidade",
    tagColor: "var(--mv-salvia-deep)",
    title:    "Estudar um segundo idioma ajuda a retardar o Alzheimer",
    time:     "Há 3 dias",
  },
];

export default function NoticiasPage() {
  return (
    <main className="mv-shell">
      <header className="mv-fade-in" style={{ padding: "8px 4px 4px" }}>
        <p className="mv-greeting">
          <i className="ti ti-news" aria-hidden="true" style={{ marginRight: 6 }} />
          Notícias
        </p>
        <h1 className="mv-title">O que há no mundo</h1>
        <p className="mv-subtitle">Só o que é bom de saber ☀️</p>
      </header>

      {/* Filtros de categoria */}
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

      {/* Destaque */}
      <div className="mv-news-featured">
        <div className="mv-news-image" style={{ background: FEATURED.bg }}>
          {FEATURED.emoji}
        </div>
        <div className="mv-news-body">
          <div
            className="mv-news-tag"
            style={{ background: FEATURED.tagBg, color: FEATURED.tagColor }}
          >
            {FEATURED.tag}
          </div>
          <p className="mv-news-title">{FEATURED.title}</p>
          <p className="mv-news-summary">{FEATURED.summary}</p>
          <p className="mv-news-time">{FEATURED.time}</p>
        </div>
      </div>

      {/* Mais notícias */}
      <SectionTitle title="Mais notícias" />
      {NEWS.map((item) => (
        <div key={item.title} className="mv-news-mini">
          <div className="mv-news-mini-image" style={{ background: item.bg }}>
            {item.emoji}
          </div>
          <div className="mv-news-mini-body">
            <div className="mv-news-mini-tag" style={{ color: item.tagColor }}>
              {item.tag}
            </div>
            <p className="mv-news-mini-title">{item.title}</p>
            <p style={{ fontSize: "var(--mv-text-xs)", color: "var(--mv-text-tertiary)", margin: "4px 0 0" }}>
              {item.time}
            </p>
          </div>
        </div>
      ))}

      <BottomNav active="mais" />
    </main>
  );
}
