'use client'
import { useRef, useEffect, useState } from 'react'
import type { Niche } from '@/lib/mock-data'

type Value = Niche | 'all'
const OPTIONS: { id: Value; label: string }[] = [
  { id: 'all',       label: 'All Niches' },
  { id: 'tech',      label: 'Tech' },
  { id: 'business',  label: 'Business' },
  { id: 'lifestyle', label: 'Lifestyle' },
]

export default function NicheSegment({ value, onChange }: { value: Value; onChange: (v: Value) => void }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [thumbStyle, setThumbStyle] = useState({ width: 0, x: 0 })

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const idx = OPTIONS.findIndex(o => o.id === value)
    const btn = container.children[idx + 1] as HTMLElement // +1 for the thumb
    if (btn) {
      setThumbStyle({ width: btn.offsetWidth, x: btn.offsetLeft })
    }
  }, [value])

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        display: 'inline-flex',
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 12,
        padding: 3,
        gap: 0,
      }}
    >
      {/* Sliding thumb */}
      <div style={{
        position: 'absolute',
        top: 3, bottom: 3,
        left: thumbStyle.x,
        width: thumbStyle.width,
        background: 'var(--raised)',
        borderRadius: 10,
        transition: 'left 200ms var(--expo), width 200ms var(--expo)',
        pointerEvents: 'none',
      }} />

      {OPTIONS.map(opt => (
        <button
          key={opt.id}
          onClick={() => onChange(opt.id)}
          style={{
            position: 'relative',
            padding: '5px 14px',
            borderRadius: 10,
            border: 'none',
            background: 'transparent',
            color: value === opt.id ? 'var(--ink)' : 'var(--muted)',
            fontWeight: value === opt.id ? 600 : 400,
            fontSize: 12,
            cursor: 'pointer',
            transition: 'color 150ms',
            whiteSpace: 'nowrap',
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
