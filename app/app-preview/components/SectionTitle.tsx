interface SectionTitleProps {
  title: string;
  action?: string;
}

/**
 * Título de seção, usado para introduzir blocos de conteúdo
 * (ex: "Próximo compromisso", "Medicamentos", "Lembrança feliz").
 */
export default function SectionTitle({ title, action }: SectionTitleProps) {
  return (
    <div className="mv-section-title">
      <span>{title}</span>
      {action && <span className="mv-section-action">{action}</span>}
    </div>
  );
}
