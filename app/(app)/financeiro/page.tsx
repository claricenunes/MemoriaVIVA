import GlassCard from '@/components/shared/glass-card'
import SectionTitle from '@/components/shared/section-title'
import FloatingAction from '@/components/shared/floating-action'

const TRANSACTIONS = [
  { emoji: '🛒', label: 'Supermercado Pão de Açúcar', date: 'Hoje',           amount: -234.50, color: 'var(--mv-text-primary)' },
  { emoji: '💊', label: 'Farmácia Droga Raia',         date: 'Hoje',           amount:  -89.30, color: 'var(--mv-text-primary)' },
  { emoji: '💰', label: 'Aposentadoria INSS',           date: '11 jun',         amount: 1412.00, color: 'var(--mv-salvia-deep)'  },
  { emoji: '💡', label: 'Conta de luz CEMIG',           date: '10 jun',         amount: -147.80, color: 'var(--mv-text-primary)' },
  { emoji: '🏥', label: 'Plano de saúde Unimed',        date: '08 jun',         amount: -380.00, color: 'var(--mv-text-primary)' },
  { emoji: '👩‍⚕️', label: 'Consulta Dr. Carlos',         date: '05 jun',         amount:  -80.00, color: 'var(--mv-text-primary)' },
  { emoji: '🎁', label: 'Transferência — Ana',          date: '01 jun',         amount:  200.00, color: 'var(--mv-salvia-deep)'  },
]

const BILLS_UPCOMING = [
  { label: 'Água',         when: 'Amanhã, 13 jun',  amount: 85.00,  urgent: true  },
  { label: 'Telefone',     when: '15 jun',           amount: 49.90,  urgent: false },
  { label: 'Internet',     when: '20 jun',           amount: 89.90,  urgent: false },
  { label: 'Plano de saúde', when: '28 jun',         amount: 380.00, urgent: false },
]

export default function FinanceiroPage() {
  const balance = 1412.00 - 234.50 - 89.30 - 147.80 - 380.00 - 80.00 + 200.00
  const income  = 1412.00 + 200.00
  const expense = 234.50 + 89.30 + 147.80 + 380.00 + 80.00

  return (
    <main className="mv-shell">
      <header className="mv-fade-in" style={{ padding: '8px 4px 4px' }}>
        <p className="mv-greeting">
          <i className="ti ti-wallet" aria-hidden="true" style={{ marginRight: 6 }} />
          Suas finanças
        </p>
        <h1 className="mv-title">Financeiro</h1>
        <p className="mv-subtitle">Junho de 2026</p>
      </header>

      <GlassCard variant="hero" style={{ marginTop: 'var(--mv-space-5)' }}>
        <p style={{ margin: 0, fontSize: 'var(--mv-text-sm)', color: 'var(--mv-text-secondary)', fontWeight: 600 }}>Saldo do mês</p>
        <p style={{ margin: '4px 0 0', fontSize: 'var(--mv-text-display)', fontWeight: 700, color: balance >= 0 ? 'var(--mv-salvia-deep)' : 'var(--mv-terracota-deep)', lineHeight: 1.1 }}>
          {balance >= 0 ? '+' : ''}R$&nbsp;{balance.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--mv-space-3)', marginTop: 'var(--mv-space-4)' }}>
          <div style={{ background: 'var(--mv-salvia-soft)', borderRadius: 'var(--mv-radius-md)', padding: '12px 14px' }}>
            <div style={{ fontSize: 'var(--mv-text-xs)', color: 'var(--mv-salvia-deep)', fontWeight: 700, marginBottom: 4 }}>↑ Entradas</div>
            <div style={{ fontSize: 'var(--mv-text-md)', fontWeight: 700, color: 'var(--mv-salvia-deep)' }}>R$&nbsp;{income.toFixed(2).replace('.', ',')}</div>
          </div>
          <div style={{ background: 'var(--mv-terracota-soft)', borderRadius: 'var(--mv-radius-md)', padding: '12px 14px' }}>
            <div style={{ fontSize: 'var(--mv-text-xs)', color: 'var(--mv-terracota-deep)', fontWeight: 700, marginBottom: 4 }}>↓ Saídas</div>
            <div style={{ fontSize: 'var(--mv-text-md)', fontWeight: 700, color: 'var(--mv-terracota-deep)' }}>R$&nbsp;{expense.toFixed(2).replace('.', ',')}</div>
          </div>
        </div>
      </GlassCard>

      <div className="mv-alert-strip mv-alert-strip--ambar" style={{ marginTop: 'var(--mv-space-4)' }}>
        <i className="ti ti-calendar-due" aria-hidden="true" style={{ fontSize: 20, flexShrink: 0 }} />
        <span className="mv-alert-strip-text">Conta de água vence amanhã — R$&nbsp;85,00</span>
        <button type="button" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 'var(--mv-text-xs)', fontWeight: 700, color: 'var(--mv-ambar-deep)', flexShrink: 0, padding: 0 }}>Pagar</button>
      </div>

      <SectionTitle title="Contas a pagar" />
      <GlassCard>
        {BILLS_UPCOMING.map((bill, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--mv-space-3)', paddingBottom: i < BILLS_UPCOMING.length - 1 ? 'var(--mv-space-3)' : 0, marginBottom: i < BILLS_UPCOMING.length - 1 ? 'var(--mv-space-3)' : 0, borderBottom: i < BILLS_UPCOMING.length - 1 ? '1px solid var(--mv-border)' : 'none' }}>
            <div className={`mv-icon-blob ${bill.urgent ? 'mv-icon-blob--ambar' : 'mv-icon-blob--azul'}`} style={{ width: 40, height: 40 }}>
              <i className="ti ti-receipt" aria-hidden="true" style={{ fontSize: 16 }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, color: 'var(--mv-text-primary)' }}>{bill.label}</div>
              <div style={{ fontSize: 'var(--mv-text-xs)', color: bill.urgent ? 'var(--mv-ambar-deep)' : 'var(--mv-text-tertiary)', marginTop: 2, fontWeight: bill.urgent ? 700 : 400 }}>
                {bill.urgent ? '⚠️ ' : ''}{bill.when}
              </div>
            </div>
            <span style={{ fontWeight: 700, color: 'var(--mv-text-primary)' }}>R$&nbsp;{bill.amount.toFixed(2).replace('.', ',')}</span>
          </div>
        ))}
      </GlassCard>

      <SectionTitle title="Movimentações" />
      <GlassCard>
        {TRANSACTIONS.map((tx, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--mv-space-3)', paddingBottom: i < TRANSACTIONS.length - 1 ? 'var(--mv-space-3)' : 0, marginBottom: i < TRANSACTIONS.length - 1 ? 'var(--mv-space-3)' : 0, borderBottom: i < TRANSACTIONS.length - 1 ? '1px solid var(--mv-border)' : 'none' }}>
            <div style={{ width: 42, height: 42, borderRadius: 'var(--mv-radius-md)', background: 'var(--mv-bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
              {tx.emoji}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 'var(--mv-text-sm)', fontWeight: 600, color: 'var(--mv-text-primary)' }}>{tx.label}</div>
              <div style={{ fontSize: 'var(--mv-text-xs)', color: 'var(--mv-text-tertiary)', marginTop: 2 }}>{tx.date}</div>
            </div>
            <span style={{ fontWeight: 700, color: tx.amount >= 0 ? 'var(--mv-salvia-deep)' : 'var(--mv-text-primary)', flexShrink: 0 }}>
              {tx.amount >= 0 ? '+' : ''}R$&nbsp;{Math.abs(tx.amount).toFixed(2).replace('.', ',')}
            </span>
          </div>
        ))}
      </GlassCard>

      <FloatingAction variant="add" label="Nova movimentação" />
    </main>
  )
}
