'use client'
import { useState, useEffect } from 'react'
import type { Platform } from '@/lib/mock-data'

type Props = {
  title: string
  subtitle?: string
  platforms: Platform[]
  onPlatformChange: (platforms: Platform[]) => void
}

const PLATFORMS: { id: Platform; label: string; dot: string }[] = [
  { id: 'tiktok',    label: 'TikTok',    dot: '#69C9D0' },
  { id: 'instagram', label: 'Instagram', dot: '#E1306C' },
  { id: 'youtube',   label: 'YouTube',   dot: '#FF4444' },
]

export default function PageHeader({ title, subtitle, platforms, onPlatformChange }: Props) {
  const toggle = (id: Platform) => {
    if (platforms.includes(id)) {
      if (platforms.length === 1) return
      onPlatformChange(platforms.filter(p => p !== id))
    } else {
      onPlatformChange([...platforms, id])
    }
  }

  const [dateStr, setDateStr] = useState('')
  useEffect(() => {
    setDateStr(new Date().toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase())
  }, [])

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '14px 32px',
      borderBottom: '1px solid var(--border)',
      background: 'var(--surface)',
      position: 'sticky',
      top: 0,
      zIndex: 10,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <span style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 700, fontSize: 15, color: 'var(--ink)' }}>{title}</span>
        {subtitle && (
          <>
            <span style={{ color: 'var(--border-hi)', fontSize: 16 }}>|</span>
            <span style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.03em' }}>{subtitle || dateStr}</span>
          </>
        )}
        <span style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.03em' }}>{dateStr}</span>
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        {PLATFORMS.map(p => {
          const active = platforms.includes(p.id)
          return (
            <button
              key={p.id}
              onClick={() => toggle(p.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '5px 12px', borderRadius: 20,
                fontSize: 12, fontWeight: 500,
                border: `1px solid ${active ? 'var(--border-hi)' : 'var(--border)'}`,
                background: active ? 'var(--raised)' : 'transparent',
                color: active ? 'var(--ink)' : 'var(--label)',
                cursor: 'pointer',
                transition: 'all 150ms',
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: active ? p.dot : 'var(--muted)', display: 'inline-block' }} />
              {p.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
