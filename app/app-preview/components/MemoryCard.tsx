interface MemoryCardProps {
  label: string;
  variant: "praia" | "familia" | "faculdade";
  full?: boolean;
}

/**
 * Card de lembrança feliz, com imagem mockada (gradiente suave + ícone)
 * e legenda sobreposta. Usado na Home e na tela de Memórias.
 */
export default function MemoryCard({ label, variant, full = false }: MemoryCardProps) {
  return (
    <div className={full ? "mv-memory-full" : ""}>
      <div className={`mv-image-mock mv-image-mock--${variant}`}>
        <i className="ti ti-photo" aria-hidden="true" />
        <span className="mv-image-mock-label">{label}</span>
      </div>
    </div>
  );
}
