'use client'

import { useState } from 'react'
import CheckinForm from './checkin-form'
import GlassCard from '@/components/shared/glass-card'
import type { SaudeRegistro } from '@/lib/types/database'

export default function CheckinWidget({ checkin }: { checkin: SaudeRegistro | null }) {
  const [editando, setEditando] = useState(false)

  if (!checkin || editando) {
    return (
      <CheckinForm
        initialCorpo={checkin?.corpo}
        initialMente={checkin?.mente}
        initialNota={checkin?.nota}
        initialMarcadoMedico={checkin?.marcado_medico}
        onCancel={checkin ? () => setEditando(false) : undefined}
      />
    )
  }

  return (
    <GlassCard variant="hero">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--mv-space-3)' }}>
        <p style={{ margin: 0, fontSize: 'var(--mv-text-lg)', fontWeight: 600 }}>✅ Check-in feito hoje!</p>
        <button
          type="button"
          onClick={() => setEditando(true)}
          style={{
            background: 'none',
            border: '1.5px solid var(--mv-border)',
            cursor: 'pointer',
            borderRadius: 10,
            padding: '6px 12px',
            fontSize: 'var(--mv-text-xs)',
            fontWeight: 600,
            color: 'var(--mv-text-secondary)',
            fontFamily: 'var(--mv-font)',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          <i className="ti ti-pencil" aria-hidden="true" style={{ fontSize: 14 }} /> Editar
        </button>
      </div>

      <div style={{ display: 'flex', gap: 'var(--mv-space-3)' }}>
        {[
          { label: '🏃 Corpo', value: checkin.corpo, color: 'var(--mv-salvia-deep)', bg: 'var(--mv-salvia-soft)' },
          { label: '🧠 Mente', value: checkin.mente, color: 'var(--mv-azul-deep)',   bg: 'var(--mv-azul-soft)'   },
        ].map(({ label, value, color, bg }) => (
          <div key={label} style={{ flex: 1, background: bg, borderRadius: 'var(--mv-radius-md)', padding: '16px', textAlign: 'center' }}>
            <div style={{ fontSize: 11, color, fontWeight: 700, marginBottom: 6 }}>{label}</div>
            <div style={{ fontSize: 'var(--mv-text-display)', fontWeight: 600, color, lineHeight: 1 }}>{value}</div>
            <div style={{ fontSize: 11, color, marginTop: 4 }}>de 10</div>
          </div>
        ))}
      </div>

      {checkin.nota && (
        <p style={{ margin: 'var(--mv-space-4) 0 0', fontSize: 'var(--mv-text-sm)', color: 'var(--mv-text-secondary)', fontStyle: 'italic', lineHeight: 1.55 }}>
          &ldquo;{checkin.nota}&rdquo;
        </p>
      )}
      {checkin.marcado_medico && (
        <div style={{ marginTop: 'var(--mv-space-3)', fontSize: 'var(--mv-text-xs)', color: 'var(--mv-azul-deep)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
          <i className="ti ti-stethoscope" aria-hidden="true" /> Marcado para mostrar ao médico
        </div>
      )}
    </GlassCard>
  )
}
