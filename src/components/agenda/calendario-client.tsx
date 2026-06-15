'use client'

import { useRouter } from 'next/navigation'

interface DiaComEvento {
  data: string
  cores: string[]
}

interface CalendarioClientProps {
  ano: number
  mes: number
  diasComEventos: DiaComEvento[]
  diaSelecionado: string
}

const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

const DOT_COLOR: Record<string, string> = {
  terracota: 'var(--mv-terracota)',
  azul:      'var(--mv-azul-suave)',
  ambar:     'var(--mv-ambar)',
  salvia:    'var(--mv-salvia)',
}

const MESES_PT = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']

export default function CalendarioClient({ ano, mes, diasComEventos, diaSelecionado }: CalendarioClientProps) {
  const router = useRouter()

  const dotMap = new Map<string, string[]>()
  for (const d of diasComEventos) dotMap.set(d.data, d.cores)

  const primeiroDia = new Date(ano, mes, 1).getDay()
  const diasNoMes   = new Date(ano, mes + 1, 0).getDate()

  const cells: (number | null)[] = [
    ...Array<null>(primeiroDia).fill(null),
    ...Array.from({ length: diasNoMes }, (_, i) => i + 1),
  ]

  const hoje = new Date().toISOString().split('T')[0]

  function toIso(day: number) {
    return `${ano}-${String(mes + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  }

  function navMes(delta: number) {
    const d = new Date(ano, mes + delta, 1)
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    router.push(`/agenda?mes=${y}-${m}`, { scroll: false })
  }

  return (
    <div>
      {/* Navegação de mês */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <button
          type="button"
          onClick={() => navMes(-1)}
          style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '4px 8px', borderRadius: 8, color: 'var(--mv-text-secondary)', fontSize: 18, lineHeight: 1 }}
          aria-label="Mês anterior"
        >
          ‹
        </button>
        <span style={{ fontSize: 'var(--mv-text-sm)', fontWeight: 700, color: 'var(--mv-text-primary)' }}>
          {MESES_PT[mes]} {ano}
        </span>
        <button
          type="button"
          onClick={() => navMes(1)}
          style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '4px 8px', borderRadius: 8, color: 'var(--mv-text-secondary)', fontSize: 18, lineHeight: 1 }}
          aria-label="Próximo mês"
        >
          ›
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 8 }}>
        {WEEKDAYS.map((d) => (
          <div key={d} style={{ textAlign: 'center', fontSize: 'var(--mv-text-xs)', color: 'var(--mv-text-tertiary)', fontWeight: 600, paddingBottom: 4 }}>
            {d}
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
        {cells.map((day, i) => {
          if (!day) return <div key={i} />

          const iso      = toIso(day)
          const dots     = dotMap.get(iso) ?? []
          const isToday  = iso === hoje
          const isSel    = iso === diaSelecionado

          return (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '3px 0' }}>
              <button
                type="button"
                onClick={() => router.push(`/agenda?dia=${iso}`, { scroll: false })}
                className={isToday || isSel ? 'mv-calendar-day mv-calendar-day--today' : 'mv-calendar-day'}
                style={{
                  width: 34, height: 34,
                  cursor: 'pointer', border: 'none',
                  outline: isSel && !isToday ? '2px solid var(--mv-terracota)' : undefined,
                  background: isSel && !isToday ? 'var(--mv-terracota-soft, #fce8e0)' : undefined,
                }}
              >
                {day}
              </button>
              <div style={{ display: 'flex', gap: 2, marginTop: 3, minHeight: 6 }}>
                {dots.slice(0, 3).map((color, di) => (
                  <span
                    key={di}
                    style={{ width: 5, height: 5, borderRadius: '50%', background: DOT_COLOR[color] ?? 'var(--mv-text-tertiary)', display: 'block' }}
                  />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
