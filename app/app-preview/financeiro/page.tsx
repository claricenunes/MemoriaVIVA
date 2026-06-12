import GlassCard from "../components/GlassCard";
import SectionTitle from "../components/SectionTitle";
import BottomNav from "../components/BottomNav";

const UPCOMING = [
  { day: "13", label: "Conta de água",   value: "R$ 85,00",  icon: "droplet" },
  { day: "15", label: "Condomínio",      value: "R$ 380,00", icon: "building" },
  { day: "20", label: "Plano de saúde",  value: "R$ 320,00", icon: "heart" },
];

const ENTRADAS = [
  { label: "Aposentadoria",   date: "1 jun",  value: "R$ 1.412,00" },
  { label: "Aluguel recebido", date: "5 jun", value: "R$ 650,00" },
];

const SAIDAS = [
  { label: "Farmácia",    date: "8 jun", value: "R$ 87,50" },
  { label: "Mercado",     date: "7 jun", value: "R$ 220,00" },
  { label: "Internet",    date: "5 jun", value: "R$ 99,90" },
];

export default function FinanceiroPage() {
  return (
    <main className="mv-shell">
      <header className="mv-fade-in" style={{ padding: "8px 4px 4px" }}>
        <p className="mv-greeting">
          <i className="ti ti-wallet" aria-hidden="true" style={{ marginRight: 6 }} />
          Suas finanças
        </p>
        <h1 className="mv-title">Junho de 2026</h1>
      </header>

      {/* Saldo do mês */}
      <div style={{ marginTop: "var(--mv-space-5)" }}>
        <GlassCard variant="hero">
          <div className="mv-finance-balance">
            <p className="mv-finance-balance-label">Saldo do mês</p>
            <p className="mv-finance-balance-value">R$ 1.654</p>
            <p className="mv-finance-balance-change">
              <span style={{ color: "var(--mv-salvia-deep)", fontWeight: 600 }}>↑ Entradas: R$ 2.062</span>
              {"  "}
              <span style={{ color: "#C0392B", fontWeight: 600 }}>↓ Saídas: R$ 408</span>
            </p>
          </div>
        </GlassCard>
      </div>

      {/* Aviso salvia: saldo positivo */}
      <div className="mv-alert-strip mv-alert-strip--salvia" style={{ marginTop: "var(--mv-space-2)" }}>
        <i className="ti ti-check" style={{ fontSize: 18, flexShrink: 0 }} aria-hidden="true" />
        <span className="mv-alert-strip-text">
          Mês no positivo! Você está indo bem. 🌿
        </span>
      </div>

      {/* Pagamentos chegando */}
      <SectionTitle title="Pagamentos chegando" />
      {UPCOMING.map((item) => (
        <div key={item.label} className="mv-finance-upcoming-card">
          <div className="mv-finance-upcoming-date">{item.day}</div>
          <div style={{ flex: 1 }}>
            <div className="mv-finance-upcoming-label">{item.label}</div>
            <div className="mv-finance-upcoming-value">{item.value}</div>
          </div>
          <i className={`ti ti-${item.icon}`} style={{ color: "var(--mv-ambar-deep)", fontSize: 20 }} aria-hidden="true" />
        </div>
      ))}

      {/* Entradas */}
      <SectionTitle title="Entradas" action="Ver todas" />
      <GlassCard>
        {ENTRADAS.map((item) => (
          <div key={item.label} className="mv-finance-row">
            <div className="mv-icon-blob mv-icon-blob--salvia" style={{ width: 42, height: 42 }}>
              <i className="ti ti-arrow-down-left" aria-hidden="true" style={{ fontSize: 18 }} />
            </div>
            <div className="mv-finance-row-content">
              <p className="mv-finance-row-label">{item.label}</p>
              <div className="mv-finance-row-date">{item.date}</div>
            </div>
            <span className="mv-finance-row-value mv-finance-row-value--in">
              + {item.value}
            </span>
          </div>
        ))}
      </GlassCard>

      {/* Saídas */}
      <SectionTitle title="Saídas" action="Ver todas" />
      <GlassCard>
        {SAIDAS.map((item) => (
          <div key={item.label} className="mv-finance-row">
            <div className="mv-icon-blob mv-icon-blob--terracota" style={{ width: 42, height: 42 }}>
              <i className="ti ti-arrow-up-right" aria-hidden="true" style={{ fontSize: 18 }} />
            </div>
            <div className="mv-finance-row-content">
              <p className="mv-finance-row-label">{item.label}</p>
              <div className="mv-finance-row-date">{item.date}</div>
            </div>
            <span className="mv-finance-row-value mv-finance-row-value--out">
              − {item.value}
            </span>
          </div>
        ))}
      </GlassCard>

      <div style={{ marginTop: "var(--mv-space-6)" }}>
        <button type="button" className="mv-btn mv-btn--primary mv-btn--full">
          <i className="ti ti-plus" aria-hidden="true" />
          Registrar movimentação
        </button>
      </div>

      <BottomNav active="mais" />
    </main>
  );
}
