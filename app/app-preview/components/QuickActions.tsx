interface QuickAction {
  icon: string;
  label: string;
  color: "terracota" | "salvia" | "ambar" | "azul";
}

const ACTIONS: QuickAction[] = [
  { icon: "heart-rate-monitor", label: "Saúde", color: "salvia" },
  { icon: "calendar", label: "Agenda", color: "azul" },
  { icon: "books", label: "Memórias", color: "terracota" },
  { icon: "phone-call", label: "Emergência", color: "ambar" },
];

/**
 * Grade de ações rápidas (4 itens) na Home.
 * Cada ação é um atalho visual para uma área do app.
 */
export default function QuickActions() {
  return (
    <div className="mv-quick-actions">
      {ACTIONS.map((action) => (
        <div className="mv-quick-action" key={action.label}>
          <div className={`mv-icon-blob mv-icon-blob--${action.color}`}>
            <i className={`ti ti-${action.icon}`} aria-hidden="true" style={{ fontSize: 22 }} />
          </div>
          <span>{action.label}</span>
        </div>
      ))}
    </div>
  );
}
