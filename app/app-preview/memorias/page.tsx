"use client";

import { useState } from "react";
import MemoryCard from "../components/MemoryCard";
import BottomNav from "../components/BottomNav";
import FloatingAction from "../components/FloatingAction";

const MEMORIES = [
  { label: "Praia — Janeiro", variant: "praia" as const, full: true },
  { label: "Família", variant: "familia" as const, full: false },
  { label: "Faculdade", variant: "faculdade" as const, full: false },
  { label: "Aniversário da Júlia", variant: "familia" as const, full: false },
  { label: "Viagem a Goiás", variant: "praia" as const, full: false },
];

/**
 * TELA 4 — MEMÓRIAS
 *
 * Dados estáticos / mockados. Não importa services, hooks ou
 * schema do projeto real — apenas para preview visual.
 * O clique em uma lembrança abre um "preview falso" (modal simples).
 */
export default function MemoriasPreviewPage() {
  const [openMemory, setOpenMemory] = useState<string | null>(null);

  return (
    <main className="mv-shell">
      <header className="mv-fade-in" style={{ padding: "8px 4px 4px" }}>
        <p className="mv-greeting">
          <i className="ti ti-heart" aria-hidden="true" style={{ marginRight: 6 }} />
          Suas lembranças
        </p>
        <h1 className="mv-title">Memórias felizes</h1>
        <p className="mv-subtitle">Momentos para revisitar sempre que quiser.</p>
      </header>

      <div className="mv-memories-grid">
        {MEMORIES.map((memory) => (
          <button
            key={memory.label}
            type="button"
            onClick={() => setOpenMemory(memory.label)}
            style={{
              background: "none",
              border: "none",
              padding: 0,
              cursor: "pointer",
              textAlign: "left",
              gridColumn: memory.full ? "span 2" : undefined,
            }}
            aria-label={`Abrir lembrança: ${memory.label}`}
          >
            <MemoryCard label={memory.label} variant={memory.variant} full={memory.full} />
          </button>
        ))}
      </div>

      <div style={{ marginTop: "var(--mv-space-6)" }}>
        <button type="button" className="mv-btn mv-btn--secondary mv-btn--full">
          <i className="ti ti-plus" aria-hidden="true" />
          Adicionar lembrança
        </button>
      </div>

      {openMemory && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Visualizando ${openMemory}`}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(58, 53, 48, 0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
            padding: "var(--mv-space-5)",
          }}
          onClick={() => setOpenMemory(null)}
        >
          <div
            className="mv-card"
            style={{ maxWidth: "100%", width: 360 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="mv-image-mock mv-image-mock--praia"
              style={{ height: 200, marginBottom: "var(--mv-space-4)" }}
            >
              <i className="ti ti-photo" aria-hidden="true" />
            </div>
            <p style={{ margin: 0, fontSize: "var(--mv-text-lg)", fontWeight: 600 }}>
              {openMemory}
            </p>
            <p className="mv-subtitle">Um momento especial guardado com carinho.</p>
            <button
              type="button"
              className="mv-btn mv-btn--secondary mv-btn--full"
              style={{ marginTop: "var(--mv-space-4)" }}
              onClick={() => setOpenMemory(null)}
            >
              Fechar
            </button>
          </div>
        </div>
      )}

      <FloatingAction variant="add" label="Adicionar lembrança" />
      <BottomNav active="mais" />
    </main>
  );
}
