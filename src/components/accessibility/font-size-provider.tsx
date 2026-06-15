'use client'
import { useEffect, useState } from 'react'

type FontSize = 'normal' | 'medio' | 'grande'

function applySize(size: FontSize) {
  document.documentElement.classList.remove('mv-fonte-medio', 'mv-fonte-grande')
  if (size !== 'normal') {
    document.documentElement.classList.add(`mv-fonte-${size}`)
  }
}

export function FontSizeProvider() {
  useEffect(() => {
    const saved = localStorage.getItem('mv-fonte') as FontSize | null
    if (saved === 'medio' || saved === 'grande') applySize(saved)
  }, [])
  return null
}

export function FontSizeToggle() {
  const [current, setCurrent] = useState<FontSize>('normal')

  useEffect(() => {
    const saved = localStorage.getItem('mv-fonte') as FontSize | null
    if (saved === 'medio' || saved === 'grande') setCurrent(saved)
  }, [])

  function select(size: FontSize) {
    setCurrent(size)
    localStorage.setItem('mv-fonte', size)
    applySize(size)
  }

  const opts: { size: FontSize; fontSize: number }[] = [
    { size: 'normal', fontSize: 15 },
    { size: 'medio',  fontSize: 19 },
    { size: 'grande', fontSize: 24 },
  ]

  return (
    <div style={{ display: 'flex', gap: 8 }}>
      {opts.map(({ size, fontSize }) => (
        <button
          key={size}
          type="button"
          onClick={() => select(size)}
          style={{
            flex: 1, height: 44, borderRadius: 12, border: '2px solid',
            borderColor: current === size ? 'var(--mv-terracota)' : 'var(--mv-border)',
            background: current === size ? 'var(--mv-terracota-soft)' : 'transparent',
            cursor: 'pointer', fontWeight: 700, fontSize,
            fontFamily: 'var(--mv-font)',
            color: current === size ? 'var(--mv-terracota-deep)' : 'var(--mv-text-secondary)',
            transition: 'all 0.15s',
          }}
        >
          A
        </button>
      ))}
    </div>
  )
}
