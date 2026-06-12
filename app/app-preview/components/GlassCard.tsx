import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  variant?: "default" | "hero" | "flat";
  className?: string;
}

/**
 * Card base usado em todas as telas do preview.
 * Fundo branco, cantos arredondados, sombra suave.
 */
export default function GlassCard({
  children,
  variant = "default",
  className = "",
}: GlassCardProps) {
  const variantClass =
    variant === "hero"
      ? "mv-card mv-card--hero"
      : variant === "flat"
      ? "mv-card mv-card--flat"
      : "mv-card";

  return (
    <div className={`${variantClass} mv-fade-in ${className}`}>{children}</div>
  );
}
