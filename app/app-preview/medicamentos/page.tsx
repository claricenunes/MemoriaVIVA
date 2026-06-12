import MedicationCard from "../components/MedicationCard";
import BottomNav from "../components/BottomNav";
import FloatingAction from "../components/FloatingAction";

const MEDICATIONS = [
  { name: "Losartana", dosage: "1 comprimido", time: "08:00", status: "tomado" as const },
  { name: "Vitamina D", dosage: "1 cápsula", time: "08:00", status: "tomado" as const },
  { name: "Omeprazol", dosage: "1 comprimido", time: "12:00", status: "tomado" as const },
  { name: "Metformina", dosage: "1 comprimido", time: "18:00", status: "pendente" as const },
  { name: "Sinvastatina", dosage: "1 comprimido", time: "21:00", status: "proximo" as const },
];

/**
 * TELA 3 — MEDICAMENTOS ("Meus remédios")
 *
 * Dados estáticos / mockados. Não importa services, hooks ou
 * schema do projeto real — apenas para preview visual.
 */
export default function MedicamentosPreviewPage() {
  return (
    <main className="mv-shell">
      <header className="mv-fade-in" style={{ padding: "8px 4px 4px" }}>
        <p className="mv-greeting">
          <i className="ti ti-pill" aria-hidden="true" style={{ marginRight: 6 }} />
          Hoje, sexta-feira
        </p>
        <h1 className="mv-title">Meus remédios</h1>
        <p className="mv-subtitle">3 tomados · 1 pendente · 1 próximo</p>
      </header>

      <div style={{ marginTop: "var(--mv-space-5)" }}>
        {MEDICATIONS.map((med) => (
          <MedicationCard key={med.name + med.time} {...med} />
        ))}
      </div>

      <FloatingAction variant="add" label="Adicionar remédio" />
      <BottomNav active="mais" />
    </main>
  );
}
