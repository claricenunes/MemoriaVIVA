'use client'

import { useState } from 'react'
import AjudaModal from './ajuda-modal'

interface FloatingActionProps {
  variant: 'pill' | 'add'
  label?: string
  icon?: string
  href?: string
}

export default function FloatingAction({ variant, label, icon = 'plus' }: FloatingActionProps) {
  const [modalAberto, setModalAberto] = useState(false)

  if (variant === 'pill') {
    return (
      <>
        <div className="mv-floating-action">
          <button
            type="button"
            className="mv-floating-action--pill"
            aria-label={label}
            onClick={() => setModalAberto(true)}
          >
            <i className="ti ti-phone-call" aria-hidden="true" style={{ fontSize: 18 }} />
            {label}
          </button>
        </div>
        {modalAberto && <AjudaModal onClose={() => setModalAberto(false)} />}
      </>
    )
  }

  return (
    <div className="mv-floating-action">
      <button type="button" className="mv-floating-action--add" aria-label={label ?? 'Adicionar'}>
        <i className={`ti ti-${icon}`} aria-hidden="true" />
      </button>
    </div>
  )
}
