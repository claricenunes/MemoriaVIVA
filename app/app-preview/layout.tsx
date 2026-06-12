import type { Metadata } from "next";
import "./styles/preview-theme.css";

export const metadata: Metadata = {
  title: "Memória Viva — Preview de Design",
  description: "Preview visual isolado do novo design do Memória Viva. Não afeta o app em produção.",
};

/**
 * Layout isolado para o preview de design.
 *
 * IMPORTANTE:
 * - Este layout NÃO importa nada do app real (services, hooks, schema).
 * - Todos os dados exibidos nas páginas dentro de /app-preview são estáticos (mock).
 * - Serve apenas para visualizar e aprovar a nova direção visual antes de aplicar no projeto.
 */
export default function AppPreviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mv-root">
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:wght@400;700&display=swap"
      />
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/tabler-icons/3.1.0/tabler-icons.min.css"
      />
      {children}
    </div>
  );
}
