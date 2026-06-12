type ActivePage =
  | "dashboard"
  | "agenda"
  | "saude"
  | "mais"
  | "medicamentos"
  | "memorias";

interface BottomNavProps {
  active: ActivePage;
}

const ITEMS = [
  { key: "dashboard", icon: "home-2",    label: "Início", href: "/app-preview/dashboard" },
  { key: "agenda",    icon: "calendar",  label: "Agenda", href: "/app-preview/agenda" },
  { key: "saude",     icon: "heart",     label: "Saúde",  href: "/app-preview/saude" },
  { key: "mais",      icon: "grid-dots", label: "Mais",   href: "/app-preview/mais" },
] as const;

type NavKey = (typeof ITEMS)[number]["key"];

function isActive(itemKey: NavKey, active: ActivePage): boolean {
  if (itemKey === active) return true;
  if (itemKey === "mais" && (active === "medicamentos" || active === "memorias")) return true;
  return false;
}

export default function BottomNav({ active }: BottomNavProps) {
  return (
    <nav className="mv-bottom-nav" aria-label="Navegação principal">
      {ITEMS.map((item) => (
        <a
          key={item.key}
          href={item.href}
          className={`mv-nav-item ${isActive(item.key, active) ? "mv-nav-item--active" : ""}`}
          aria-current={isActive(item.key, active) ? "page" : undefined}
        >
          <i className={`ti ti-${item.icon}`} aria-hidden="true" />
          <span>{item.label}</span>
        </a>
      ))}
    </nav>
  );
}
