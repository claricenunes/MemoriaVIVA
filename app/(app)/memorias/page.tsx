import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import GlassCard from '@/components/shared/glass-card'
import PageHeader from '@/components/shared/page-header'
import SectionTitle from '@/components/shared/section-title'
import FloatingAction from '@/components/shared/floating-action'
import MemoriasLista from '@/components/memorias/lista-client'
import NovaMemoriaForm from '@/components/memorias/nova-memoria-form'
import type { Memoria } from '@/lib/types/database'

export default async function MemoriasPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  let memorias: Memoria[] = []
  let dbSetupNeeded = false

  try {
    const { data, error } = await supabase
      .from('memorias')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error?.code === '42P01') {
      dbSetupNeeded = true
    } else {
      memorias = (data ?? []) as Memoria[]
    }
  } catch (e) {
    console.error('[MemoriasPage] query error:', e)
    dbSetupNeeded = true
  }

  return (
    <main className="mv-shell">
      <PageHeader
        icon="photo-heart"
        color="terracota"
        title="Memórias"
        subtitle={memorias.length > 0 ? memorias.length + ' recordações guardadas' : 'Guarde momentos especiais aqui'}
      />

      {dbSetupNeeded && (
        <div style={{
          display: 'flex', alignItems: 'flex-start', gap: 12,
          padding: '14px 16px', borderRadius: 'var(--mv-radius-md)',
          background: 'var(--mv-ambar-soft)', marginTop: 'var(--mv-space-4)',
          border: '1.5px solid var(--mv-ambar)',
        }}>
          <i className="ti ti-tool" aria-hidden="true" style={{ fontSize: 20, color: 'var(--mv-ambar-deep)', flexShrink: 0, marginTop: 2 }} />
          <div>
            <p style={{ margin: '0 0 4px', fontWeight: 700, fontSize: 'var(--mv-text-sm)', color: 'var(--mv-ambar-deep)' }}>
              Banco de dados não configurado
            </p>
            <p style={{ margin: 0, fontSize: 'var(--mv-text-xs)', color: 'var(--mv-ambar-deep)', lineHeight: 1.6 }}>
              Execute <strong>supabase/migrations/002_agenda_memorias.sql</strong> no Supabase SQL Editor.
            </p>
          </div>
        </div>
      )}

      {/* Hero card — Minha História */}
      <GlassCard variant="hero" style={{ marginTop: 'var(--mv-space-4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--mv-space-3)' }}>
          <div className="mv-icon-blob mv-icon-blob--terracota" style={{ width: 52, height: 52, flexShrink: 0 }}>
            <i className="ti ti-book-2" aria-hidden="true" style={{ fontSize: 22 }} />
          </div>
          <div>
            <p style={{ margin: 0, fontWeight: 700, color: 'var(--mv-text-primary)' }}>Minha História</p>
            <p style={{ margin: '3px 0 0', fontSize: 'var(--mv-text-sm)', color: 'var(--mv-text-secondary)' }}>
              Narrativa da sua vida em capítulos
            </p>
          </div>
          <a href="/mais/historia" style={{ marginLeft: 'auto', fontSize: 'var(--mv-text-xs)', fontWeight: 700, color: 'var(--mv-terracota-deep)', textDecoration: 'none', flexShrink: 0 }}>
            Ver →
          </a>
        </div>
      </GlassCard>

      <SectionTitle title="Todas as memórias" />

      {dbSetupNeeded ? (
        <GlassCard>
          <p style={{ margin: 0, textAlign: 'center', color: 'var(--mv-text-tertiary)', fontSize: 'var(--mv-text-sm)', padding: 'var(--mv-space-3) 0' }}>
            Configure o banco de dados para guardar suas memórias.
          </p>
        </GlassCard>
      ) : (
        <>
          {/* Chips de filtro + lista — estado local no client */}
          <MemoriasLista memorias={memorias} />

          <GlassCard style={{ marginTop: 'var(--mv-space-4)' }}>
            <NovaMemoriaForm />
          </GlassCard>
        </>
      )}

      <FloatingAction variant="add" label="Nova memória" />
    </main>
  )
}
