'use client'

import { useState } from 'react'
import MemoriaItem from '@/components/memorias/memoria-item'
import type { Memoria } from '@/lib/types/database'

const CATS = [
  { value: 'todas',     label: 'Todas'         },
  { value: 'familia',   label: '👨‍👩‍👧 Família'  },
  { value: 'praia',     label: '🌊 Praias'     },
  { value: 'faculdade', label: '🎓 Estudos'    },
  { value: 'fe',        label: '✝️ Fé'         },
  { value: 'outro',     label: '✨ Outro'      },
]

export default function MemoriasLista({ memorias }: { memorias: Memoria[] }) {
  const [filtro, setFiltro] = useState('todas')

  const visiveis = filtro === 'todas'
    ? memorias
    : memorias.filter((m) => m.categoria === filtro)

  return (
    <>
      <div className="mv-chips" style={{ marginTop: 'var(--mv-space-4)' }}>
        {CATS.map((cat) => (
          <button
            key={cat.value}
            type="button"
            onClick={() => setFiltro(cat.value)}
            className={`mv-chip${filtro === cat.value ? ' mv-chip--active' : ''}`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div style={{ marginTop: 'var(--mv-space-4)' }}>
        {visiveis.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--mv-text-tertiary)', fontSize: 'var(--mv-text-sm)', padding: 'var(--mv-space-5) 0' }}>
            {memorias.length === 0
              ? 'Nenhuma memória guardada ainda. Adicione a primeira!'
              : 'Nenhuma memória nessa categoria.'}
          </p>
        ) : (
          visiveis.map((mem) => (
            <MemoriaItem key={mem.id} mem={mem} />
          ))
        )}
      </div>
    </>
  )
}
