interface FloatingActionProps {
  variant: "pill" | "add";
  label?: string;
  icon?: string;
}

/**
 * Ação flutuante fixa.
 * - variant="pill": botão de emergência, sempre acessível, com texto.
 * - variant="add": botão circular "+" para adicionar (remédio, lembrança, compromisso).
 */
export default function FloatingAction({ variant, label, icon = "plus" }: FloatingActionProps) {
  if (variant === "pill") {
    return (
      <div className="mv-floating-action">
        <button type="button" className="mv-floating-action--pill" aria-label={label}>
          <i className="ti ti-phone-call" aria-hidden="true" style={{ fontSize: 18 }} />
          {label}
        </button>
      </div>
    );
  }

  return (
    <div className="mv-floating-action">
      <button type="button" className="mv-floating-action--add" aria-label={label ?? "Adicionar"}>
        <i className={`ti ti-${icon}`} aria-hidden="true" />
      </button>
    </div>
  );
}
