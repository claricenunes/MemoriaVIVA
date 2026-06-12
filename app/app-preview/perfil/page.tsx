import GlassCard from "../components/GlassCard";
import SectionTitle from "../components/SectionTitle";
import BottomNav from "../components/BottomNav";

const INFO_ROWS = [
  { label: "Nome completo",         value: "Clarice Oliveira Nunes" },
  { label: "Data de nascimento",    value: "18 de março de 1952" },
  { label: "Médico(a)",             value: "Dra. Ana Paula — (81) 99999-0000" },
  { label: "Contato de emergência", value: "Fátima — (81) 99888-7766" },
];

const SETTINGS_ROWS = [
  { icon: "bell",       label: "Notificações",      value: "Ativadas" },
  { icon: "moon",       label: "Tema escuro",        value: "Desativado" },
  { icon: "text-size",  label: "Tamanho da letra",   value: "Grande" },
  { icon: "volume",     label: "Leitura em voz alta", value: "Ativada" },
];

export default function PerfilPage() {
  return (
    <main className="mv-shell">
      <header className="mv-fade-in" style={{ padding: "8px 4px 4px" }}>
        <p className="mv-greeting">
          <i className="ti ti-user" aria-hidden="true" style={{ marginRight: 6 }} />
          Meu perfil
        </p>
      </header>

      {/* Avatar */}
      <div style={{ marginTop: "var(--mv-space-6)", textAlign: "center" }}>
        <div className="mv-profile-avatar">👩</div>
        <h1 className="mv-profile-name">Clarice Nunes</h1>
        <p className="mv-profile-sub">74 anos · Recife, PE</p>
      </div>

      {/* Informações pessoais */}
      <SectionTitle title="Informações" />
      <GlassCard>
        {INFO_ROWS.map((row) => (
          <div key={row.label} className="mv-settings-row">
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "var(--mv-text-xs)", color: "var(--mv-text-secondary)", marginBottom: 3 }}>
                {row.label}
              </div>
              <div className="mv-settings-row-label">{row.value}</div>
            </div>
            <i className="ti ti-pencil" style={{ color: "var(--mv-text-tertiary)", fontSize: 18 }} aria-hidden="true" />
          </div>
        ))}
      </GlassCard>

      {/* Configurações */}
      <SectionTitle title="Configurações" />
      <GlassCard>
        {SETTINGS_ROWS.map((row) => (
          <div key={row.label} className="mv-settings-row">
            <div className="mv-icon-blob mv-icon-blob--azul" style={{ width: 42, height: 42 }}>
              <i className={`ti ti-${row.icon}`} aria-hidden="true" style={{ fontSize: 18 }} />
            </div>
            <span className="mv-settings-row-label">{row.label}</span>
            <span style={{ fontSize: "var(--mv-text-sm)", color: "var(--mv-text-secondary)" }}>
              {row.value}
            </span>
          </div>
        ))}
      </GlassCard>

      <div style={{ marginTop: "var(--mv-space-4)" }}>
        <button type="button" className="mv-btn mv-btn--secondary mv-btn--full">
          <i className="ti ti-logout" aria-hidden="true" />
          Sair da conta
        </button>
      </div>

      <BottomNav active="mais" />
    </main>
  );
}
