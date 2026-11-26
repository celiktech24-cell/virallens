'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/AuthProvider'
import { createClient } from '@/lib/supabase/client'
import { isSaved, toggleSaved, onSavedChange } from '@/lib/saved-store'

type Props = {
  videoId: string
  variant?: 'pill' | 'icon'
}

export default function SaveButton({ videoId, variant = 'pill' }: Props) {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [saved, setSaved] = useState(false)
  const [busy, setBusy] = useState(false)

  // Load initial saved state
  useEffect(() => {
    if (authLoading) return
    if (!user) {
      setSaved(isSaved(videoId))
      return onSavedChange(() => setSaved(isSaved(videoId)))
    }
    // Logged in — check Supabase
    const supabase = createClient()
    supabase
      .from('saved_videos')
      .select('id')
      .eq('video_id', videoId)
      .maybeSingle()
      .then(({ data }) => setSaved(!!data))
  }, [user, authLoading, videoId])

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    // Not logged in — redirect to login
    if (!user) {
      router.push('/login')
      return
    }

    setBusy(true)
    const supabase = createClient()
    if (saved) {
      await supabase.from('saved_videos').delete().eq('video_id', videoId)
      setSaved(false)
    } else {
      await supabase.from('saved_videos').insert({ video_id: videoId })
      setSaved(true)
    }
    setBusy(false)
  }

  if (variant === 'icon') {
    return (
      <button
        onClick={handleClick}
        title={saved ? 'Unsave' : 'Save'}
        disabled={busy}
        style={{
          width: 28, height: 28, borderRadius: 8,
          border: `1px solid ${saved ? 'rgba(206,255,94,0.3)' : 'var(--border-hi)'}`,
          background: saved ? 'var(--accent-bg)' : 'rgba(0,0,0,0.4)',
          color: saved ? 'var(--accent)' : 'var(--label)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: busy ? 'default' : 'pointer',
          transition: 'all 150ms', flexShrink: 0,
          opacity: busy ? 0.6 : 1,
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
      disabled={busy}
      style={{
        padding: '8px 20px', borderRadius: 20,
        border: `1px solid ${saved ? 'rgba(206,255,94,0.3)' : 'var(--border-hi)'}`,
        background: saved ? 'var(--accent-bg)' : 'transparent',
        color: saved ? 'var(--accent)' : 'var(--label)',
        fontSize: 12, fontWeight: saved ? 600 : 500,
        cursor: busy ? 'default' : 'pointer',
        transition: 'all 150ms',
        display: 'flex', alignItems: 'center', gap: 6,
        whiteSpace: 'nowrap', opacity: busy ? 0.6 : 1,
      }}
    >
      <svg width="12" height="12" viewBox="0 0 16 16" fill={saved ? 'currentColor' : 'none'}>
        <path d="M4 2h8a1 1 0 0 1 1 1v10l-5-3-5 3V3a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      </svg>
      {busy ? '…' : saved ? 'Saved' : user ? 'Save' : 'Sign in to save'}
    </button>
  )
}
