'use client'
import Link from 'next/link'
import { toast } from 'sonner'
import GlassCard from '@/components/shared/glass-card'
import PageHeader from '@/components/shared/page-header'

const FUNCIONALIDADES = [
  { emoji: '💊', titulo: 'Dúvidas sobre remédios',   desc: 'Para que serve, efeitos colaterais, interações' },
  { emoji: '🥗', titulo: 'Alimentação saudável',     desc: 'Receitas leves e dicas para sua saúde'          },
  { emoji: '🧠', titulo: 'Exercícios cognitivos',    desc: 'Desafios e jogos personalizados para você'       },
  { emoji: '📅', titulo: 'Ajuda com a agenda',       desc: 'Sugestões e lembretes inteligentes'              },
  { emoji: '💕', titulo: 'Companhia e conversa',     desc: 'Alguém para ouvir e conversar quando precisar'   },
  { emoji: '📖', titulo: 'Contar sua história',      desc: 'Ajuda para escrever e preservar suas memórias'   },
]

export default function AssistentePage() {
  function avisar() {
    toast.success('Ótimo! Avisaremos quando o assistente estiver disponível 🤖')
  }

  return (
    <main className="mv-shell">
      <Link href="/mais" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 'var(--mv-text-sm)', color: 'var(--mv-text-tertiary)', textDecoration: 'none', marginBottom: 'var(--mv-space-3)', marginTop: 2 }}>
        <i className="ti ti-arrow-left" aria-hidden="true" /> Mais
      </Link>

      <PageHeader icon="robot" color="azul" title="Assistente" subtitle="Sua companhia inteligente" />

      <GlassCard variant="hero" style={{ marginTop: 'var(--mv-space-5)', textAlign: 'center' }}>
        <div style={{
          width: 96, height: 96, borderRadius: 28, margin: '0 auto 20px',
          background: 'linear-gradient(135deg, var(--mv-terracota-soft), var(--mv-azul-soft))',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48,
        }}>
          🤖
        </div>
        <div style={{
          display: 'inline-block', background: 'var(--mv-ambar-soft)', color: 'var(--mv-ambar-deep)',
          fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
          padding: '4px 12px', borderRadius: 20, marginBottom: 14, border: '1px solid var(--mv-ambar)',
        }}>
          Em breve
        </div>
        <h2 style={{ margin: '0 0 10px', fontSize: 'var(--mv-text-lg)', fontWeight: 700, color: 'var(--mv-text-primary)' }}>
          Seu assistente pessoal
        </h2>
        <p style={{ margin: '0 0 var(--mv-space-5)', fontSize: 'var(--mv-text-sm)', color: 'var(--mv-text-secondary)', lineHeight: 1.6 }}>
          Estamos construindo um assistente com inteligência artificial especialmente pensado para o seu dia a dia.
        </p>
        <button type="button" onClick={avisar} className="mv-btn mv-btn--primary mv-btn--full">
          <i className="ti ti-bell" aria-hidden="true" /> Avisar quando estiver pronto
        </button>
      </GlassCard>

      <p style={{ margin: 'var(--mv-space-5) 0 var(--mv-space-3) 4px', fontSize: 'var(--mv-text-xs)', fontWeight: 700, color: 'var(--mv-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
        O que o assistente vai fazer
      </p>
      <GlassCard style={{ padding: 0, overflow: 'hidden' }}>
        {FUNCIONALIDADES.map((f, i) => (
          <div key={f.titulo} style={{ display: 'flex', alignItems: 'center', gap: 'var(--mv-space-3)', padding: '14px 16px', borderBottom: i < FUNCIONALIDADES.length - 1 ? '1px solid var(--mv-border)' : 'none' }}>
            <span style={{ fontSize: 28, flexShrink: 0, width: 40, textAlign: 'center' }}>{f.emoji}</span>
            <div>
              <div style={{ fontWeight: 600, fontSize: 'var(--mv-text-sm)', color: 'var(--mv-text-primary)', marginBottom: 2 }}>{f.titulo}</div>
              <div style={{ fontSize: 'var(--mv-text-xs)', color: 'var(--mv-text-secondary)' }}>{f.desc}</div>
            </div>
          </div>
        ))}
      </GlassCard>

      <p style={{ textAlign: 'center', fontSize: 'var(--mv-text-xs)', color: 'var(--mv-text-tertiary)', padding: 'var(--mv-space-6) 0 var(--mv-space-4)', lineHeight: 1.6 }}>
        Feito com ❤️ para quem a gente ama
      </p>
    </main>
  )
}
