import GlassCard from "./GlassCard";

interface MedicationCardProps {
  name: string;
  time: string;
  dosage: string;
  status: "tomado" | "pendente" | "proximo";
  compact?: boolean;
}

const STATUS_LABEL: Record<MedicationCardProps["status"], string> = {
  tomado: "Tomado",
  pendente: "Pendente",
  proximo: "Próximo",
};

const STATUS_ICON: Record<MedicationCardProps["status"], string> = {
  tomado: "ti-check",
  pendente: "ti-clock",
  proximo: "ti-bell",
};

/**
 * Card individual de medicamento, usado na Home (resumo) e na
 * tela "Meus remédios" (lista completa).
 */
export default function MedicationCard({
  name,
  time,
  dosage,
  status,
  compact = false,
}: MedicationCardProps) {
  return (
    <GlassCard className={compact ? "mv-card--flat" : ""}>
      <div style={{ display: "flex", alignItems: "center", gap: "var(--mv-space-4)" }}>
        <div className="mv-icon-blob mv-icon-blob--ambar">
          <i className="ti ti-pill" aria-hidden="true" style={{ fontSize: 24 }} />
        </div>
        <div style={{ flex: 1 }}>
          <p className="mv-greeting">{time}</p>
          <p style={{ margin: "2px 0 6px", fontSize: "var(--mv-text-md)", fontWeight: 600 }}>
            {name} — {dosage}
          </p>
          <span className={`mv-status-badge mv-status-badge--${status}`}>
            <i className={`ti ${STATUS_ICON[status]}`} aria-hidden="true" style={{ fontSize: 14 }} />
            {STATUS_LABEL[status]}
          </span>
        </div>
      </div>
    </GlassCard>
  );
}
