interface HeroCardProps {
  name: string;
  date: string;
}

/**
 * Cabeçalho da Home: saudação calorosa + data + frase de acolhimento.
 * Não é um card "branco" — fica direto sobre o fundo, como um header leve.
 */
export default function HeroCard({ name, date }: HeroCardProps) {
  return (
    <header className="mv-fade-in" style={{ padding: "8px 4px 4px" }}>
      <p className="mv-greeting">
        <i className="ti ti-sun-2" aria-hidden="true" style={{ marginRight: 6 }} />
        Bom dia, {name}
      </p>
      <h1 className="mv-title">{date}</h1>
      <p className="mv-subtitle">Estamos aqui com você.</p>
    </header>
  );
}
