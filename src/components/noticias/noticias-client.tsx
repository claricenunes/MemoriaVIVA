'use client'

import { useState } from 'react'
import GlassCard from '@/components/shared/glass-card'
import SectionTitle from '@/components/shared/section-title'
import type { NoticiaItem } from '@/lib/rss'

const CHIPS = [
  { label: 'Para você',   cat: null           },
  { label: '⚽ Esportes', cat: 'Esportes'     },
  { label: '🌎 Brasil',   cat: 'Brasil'       },
  { label: '🔬 Saúde',   cat: 'Saúde'        },
  { label: '😄 Alegria',  cat: 'Alegria'      },
]

const BG: Record<string, string> = {
  Saúde:    'var(--mv-azul-soft)',
  Esportes: 'var(--mv-salvia-soft)',
  Alegria:  'var(--mv-ambar-soft)',
  Brasil:   'var(--mv-terracota-soft)',
  Notícias: 'var(--mv-azul-soft)',
}

const TAG_COLOR: Record<string, string> = {
  Saúde:    'var(--mv-azul-deep)',
  Esportes: 'var(--mv-salvia-deep)',
  Alegria:  'var(--mv-ambar-deep)',
  Brasil:   'var(--mv-terracota-deep)',
  Notícias: 'var(--mv-azul-deep)',
}

interface Props {
  noticias: NoticiaItem[]
  updateTime: string
  aoVivo: boolean
}

export default function NoticiasClient({ noticias, updateTime, aoVivo }: Props) {
  const [cat, setCat] = useState<string | null>(null)

  const filtradas = cat ? noticias.filter((n) => n.categoria === cat) : noticias
  const [destaque, ...lista] = filtradas

  return (
    <main className="mv-shell">
      <header className="mv-fade-in" style={{ padding: '8px 4px 4px' }}>
        <p className="mv-greeting">
          <i className="ti ti-news" aria-hidden="true" style={{ marginRight: 6 }} />
          {aoVivo ? '🔴 Ao vivo — notícias reais' : 'Notícias selecionadas'}
        </p>
        <h1 className="mv-title">O que aconteceu hoje</h1>
        <p className="mv-subtitle">Notícias sem drama, só o que importa</p>
      </header>

      <div className="mv-chips" style={{ marginTop: 'var(--mv-space-5)' }}>
        {CHIPS.map((chip) => (
          <button
            key={chip.label}
            type="button"
            onClick={() => setCat(chip.cat)}
            className={`mv-chip${cat === chip.cat ? ' mv-chip--active' : ''}`}
          >
            {chip.label}
          </button>
        ))}
      </div>

      {filtradas.length === 0 ? (
        <GlassCard style={{ marginTop: 'var(--mv-space-5)', textAlign: 'center' }}>
          <p style={{ margin: 0, color: 'var(--mv-text-tertiary)', fontSize: 'var(--mv-text-sm)', padding: 'var(--mv-space-4) 0' }}>
            Nenhuma notícia nessa categoria no momento.
          </p>
        </GlassCard>
      ) : (
        <>
          {destaque && (
            <>
              <SectionTitle title="Destaque do dia" />
              <GlassCard variant="hero">
                <div style={{ display: 'flex', gap: 'var(--mv-space-4)', alignItems: 'flex-start' }}>
                  <div style={{
                    width: 80, height: 80, borderRadius: 'var(--mv-radius-md)', flexShrink: 0,
                    background: BG[destaque.categoria] ?? 'var(--mv-azul-soft)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36,
                  }}>
                    {destaque.emoji}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 'var(--mv-text-xs)', fontWeight: 700, color: TAG_COLOR[destaque.categoria] ?? 'var(--mv-azul-deep)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {destaque.categoria}
                    </div>
                    <p style={{ margin: 0, fontWeight: 700, fontSize: 'var(--mv-text-md)', lineHeight: 1.4, color: 'var(--mv-text-primary)' }}>
                      {destaque.titulo}
                    </p>
                    {destaque.resumo && (
                      <p style={{ margin: '8px 0 0', fontSize: 'var(--mv-text-sm)', color: 'var(--mv-text-secondary)', lineHeight: 1.5 }}>
                        {destaque.resumo}
                      </p>
                    )}
                    <p style={{ margin: '8px 0 0', fontSize: 'var(--mv-text-xs)', color: 'var(--mv-text-tertiary)' }}>
                      {destaque.publicado} · {destaque.fonte}
                    </p>
                  </div>
                </div>
                {destaque.link && (
                  <a
                    href={destaque.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mv-btn mv-btn--ghost mv-btn--full"
                    style={{ marginTop: 'var(--mv-space-4)' }}
                  >
                    <i className="ti ti-external-link" aria-hidden="true" />
                    Ler notícia completa
                  </a>
                )}
              </GlassCard>
            </>
          )}

          {lista.length > 0 && (
            <>
              <SectionTitle title="Mais notícias" />
              <GlassCard>
                {lista.map((item, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex', gap: 'var(--mv-space-3)',
                      paddingBottom: i < lista.length - 1 ? 'var(--mv-space-4)' : 0,
                      marginBottom:  i < lista.length - 1 ? 'var(--mv-space-4)' : 0,
                      borderBottom:  i < lista.length - 1 ? '1px solid var(--mv-border)' : 'none',
                    }}
                  >
                    <div style={{
                      width: 52, height: 52, borderRadius: 'var(--mv-radius-sm)', flexShrink: 0,
                      background: BG[item.categoria] ?? 'var(--mv-azul-soft)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24,
                    }}>
                      {item.emoji}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: TAG_COLOR[item.categoria] ?? 'var(--mv-azul-deep)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 4 }}>
                        {item.categoria}
                      </div>
                      {item.link ? (
                        <a href={item.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                          <p style={{ margin: 0, fontSize: 'var(--mv-text-sm)', fontWeight: 600, color: 'var(--mv-text-primary)', lineHeight: 1.4 }}>
                            {item.titulo}
                          </p>
                        </a>
                      ) : (
                        <p style={{ margin: 0, fontSize: 'var(--mv-text-sm)', fontWeight: 600, color: 'var(--mv-text-primary)', lineHeight: 1.4 }}>
                          {item.titulo}
                        </p>
                      )}
                      <p style={{ margin: '4px 0 0', fontSize: 'var(--mv-text-xs)', color: 'var(--mv-text-tertiary)' }}>
                        {item.publicado} · {item.fonte}
                      </p>
                    </div>
                  </div>
                ))}
              </GlassCard>
            </>
          )}
        </>
      )}

      <p style={{ textAlign: 'center', fontSize: 'var(--mv-text-xs)', color: 'var(--mv-text-tertiary)', padding: 'var(--mv-space-5) 0 var(--mv-space-4)', lineHeight: 1.6 }}>
        {aoVivo ? 'Notícias via Agência Brasil' : 'Notícias curadas sem sensacionalismo'}<br />
        Atualizado às {updateTime}
      </p>
    </main>
  )
}
