'use client'
import { useState, useEffect } from 'react'
import { isSaved, toggleSaved, onSavedChange } from '@/lib/saved-store'

type Props = {
  videoId: string
  variant?: 'pill' | 'icon'
}

export default function SaveButton({ videoId, variant = 'pill' }: Props) {
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setSaved(isSaved(videoId))
    return onSavedChange(() => setSaved(isSaved(videoId)))
  }, [videoId])

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setSaved(toggleSaved(videoId))
  }

  if (variant === 'icon') {
    return (
      <button
        onClick={handleClick}
        title={saved ? 'Unsave' : 'Save'}
        style={{
          width: 28, height: 28,
          borderRadius: 8,
          border: `1px solid ${saved ? 'rgba(206,255,94,0.3)' : 'var(--border-hi)'}`,
          background: saved ? 'var(--accent-bg)' : 'rgba(0,0,0,0.4)',
          color: saved ? 'var(--accent)' : 'var(--label)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 150ms',
          flexShrink: 0,
        }}
      >
        <svg width="13" height="13" viewBox="0 0 16 16" fill={saved ? 'currentColor' : 'none'}>
          <path d="M4 2h8a1 1 0 0 1 1 1v10l-5-3-5 3V3a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
        </svg>
      </button>
    )
  }

  return (
    <button
      onClick={handleClick}
      style={{
        padding: '8px 20px', borderRadius: 20,
        border: `1px solid ${saved ? 'rgba(206,255,94,0.3)' : 'var(--border-hi)'}`,
        background: saved ? 'var(--accent-bg)' : 'transparent',
        color: saved ? 'var(--accent)' : 'var(--label)',
        fontSize: 12, fontWeight: saved ? 600 : 500,
        cursor: 'pointer',
        transition: 'all 150ms',
        display: 'flex', alignItems: 'center', gap: 6,
        whiteSpace: 'nowrap',
      }}
    >
      <svg width="12" height="12" viewBox="0 0 16 16" fill={saved ? 'currentColor' : 'none'}>
        <path d="M4 2h8a1 1 0 0 1 1 1v10l-5-3-5 3V3a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      </svg>
      {saved ? 'Saved' : 'Save'}
    </button>
  )
}
