'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { VIDEOS, type Platform, type Niche } from '@/lib/mock-data'
import PageHeader from '@/components/PageHeader'
import VideoCard from '@/components/VideoCard'
import { useAuth } from '@/components/AuthProvider'
import { createClient } from '@/lib/supabase/client'
import { getSavedVideoIds, unsaveVideo } from '@/lib/supabase/db'

const ALL_PLATFORMS: Platform[] = ['tiktok', 'instagram', 'youtube']

export default function SavedPage() {
  const { user, loading: authLoading } = useAuth()
  const [platforms, setPlatforms] = useState<Platform[]>(ALL_PLATFORMS)
  const [niche, setNiche] = useState<Niche | 'all'>('all')
  const [savedIds, setSavedIds] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (authLoading) return
    if (!user) { setLoading(false); return }

    const supabase = createClient()
    getSavedVideoIds(supabase).then(ids => {
      setSavedIds(ids)
      setLoading(false)
    })

    // Realtime subscription for instant save/unsave feedback
    const channel = supabase
      .channel('saved_videos_changes')
      .on('postgres_changes', {
        event: '*', schema: 'public', table: 'saved_videos',
        filter: `user_id=eq.${user.id}`,
      }, () => {
        getSavedVideoIds(supabase).then(setSavedIds)
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [user, authLoading])

  // Not logged in
  if (!authLoading && !user) {
    return (
      <>
        <PageHeader title="Saved" platforms={platforms} onPlatformChange={setPlatforms} />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60%', gap: 16, padding: '0 32px', textAlign: 'center' }}>
          <svg width="40" height="40" viewBox="0 0 16 16" fill="none" style={{ opacity: 0.25 }}>
            <path d="M4 2h8a1 1 0 0 1 1 1v10l-5-3-5 3V3a1 1 0 0 1 1-1Z" stroke="var(--ink)" strokeWidth="1.2" strokeLinejoin="round"/>
          </svg>
          <div style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 700, fontSize: 18, color: 'var(--label)' }}>Sign in to save videos</div>
          <div style={{ fontSize: 13, color: 'var(--muted)', maxWidth: 280, lineHeight: 1.6 }}>Create an account to save viral videos and access them from any device.</div>
          <Link href="/login" style={{ textDecoration: 'none' }}>
            <div style={{ padding: '10px 28px', borderRadius: 20, background: 'var(--accent)', color: '#000', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
              Sign in
            </div>
          </Link>
        </div>
      </>
    )
  }

  const saved = VIDEOS.filter(v => savedIds.includes(v.id))
  const filtered = saved
    .filter(v => platforms.includes(v.platform))
    .filter(v => niche === 'all' || v.niche === niche)

  const avgScore = saved.length ? Math.round(saved.reduce((s, v) => s + v.score, 0) / saved.length) : 0
  const platformCount = new Set(saved.map(v => v.platform)).size
  const nicheCounts: Record<string, number> = { all: saved.length }
  for (const v of saved) nicheCounts[v.niche] = (nicheCounts[v.niche] || 0) + 1

  if (!loading && saved.length === 0) {
    return (
      <>
        <PageHeader title="Saved" platforms={platforms} onPlatformChange={setPlatforms} />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60%', gap: 12, color: 'var(--muted)', padding: '0 32px', textAlign: 'center' }}>
          <svg width="40" height="40" viewBox="0 0 16 16" fill="none" style={{ opacity: 0.3 }}>
            <path d="M4 2h8a1 1 0 0 1 1 1v10l-5-3-5 3V3a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
          </svg>
          <div style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 700, fontSize: 18, color: 'var(--label)' }}>Nothing saved yet</div>
          <div style={{ fontSize: 13 }}>Hit the bookmark icon on any video to save it here.</div>
        </div>
      </>
    )
  }

  return (
    <>
      <PageHeader title="Saved" platforms={platforms} onPlatformChange={setPlatforms} />
      <div style={{ padding: '24px 32px' }}>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: 1, marginBottom: 24, background: 'var(--border)', borderRadius: 'var(--r)', overflow: 'hidden' }}>
          <div style={{ background: 'var(--surface)', padding: '24px 28px' }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', color: 'var(--muted)', marginBottom: 8 }}>SAVED VIDEOS</div>
            <div style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 800, fontSize: 56, color: 'var(--ink)', lineHeight: 1 }}>{saved.length}</div>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 6 }}>Across {Math.max(platformCount, 1)} platform{platformCount !== 1 ? 's' : ''}</div>
          </div>
          <div style={{ background: 'var(--surface)', display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 1, overflow: 'hidden' }}>
            {[
              { label: 'AVG SCORE',   value: avgScore.toString(),         sub: avgScore >= 90 ? 'Top tier' : 'Good' },
              { label: 'ANALYZED',    value: Math.round(saved.length * 0.5).toString(), sub: '50% complete', color: 'var(--accent)' },
              { label: 'COLLECTIONS', value: '3',                          sub: null },
              { label: 'PLATFORMS',   value: Math.max(platformCount, 1).toString(), sub: null },
              { label: 'TOTAL',       value: saved.length.toString(),      sub: 'synced to cloud', color: 'var(--up)' },
            ].map((s, i) => (
              <div key={i} style={{ background: 'var(--raised)', padding: '20px 18px', borderLeft: '1px solid var(--border)' }}>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', color: 'var(--muted)', marginBottom: 8 }}>{s.label}</div>
                <div style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 800, fontSize: 28, color: 'var(--ink)', lineHeight: 1 }}>{s.value}</div>
                {s.sub && <div style={{ fontSize: 11, color: (s as { color?: string }).color || 'var(--muted)', marginTop: 4 }}>{s.sub}</div>}
              </div>
            ))}
          </div>
        </div>

        {/* Niche filter tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
          {(['all', 'tech', 'business', 'lifestyle'] as const).map(n => (
            <button key={n} onClick={() => setNiche(n)} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '5px 14px', borderRadius: 20, fontSize: 12,
              border: `1px solid ${niche === n ? 'var(--border-hi)' : 'var(--border)'}`,
              background: niche === n ? 'var(--raised)' : 'transparent',
              color: niche === n ? 'var(--ink)' : 'var(--muted)',
              cursor: 'pointer', transition: 'all 150ms',
            }}>
              {n === 'all' ? 'All' : n.charAt(0).toUpperCase() + n.slice(1)}
              <span style={{ fontSize: 10, fontFamily: 'JetBrains Mono, monospace', color: niche === n ? 'var(--accent)' : 'var(--muted)' }}>{nicheCounts[n] || 0}</span>
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
            {[1,2,3].map(i => (
              <div key={i} style={{ height: 220, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r)', opacity: 0.5 }} />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
            {filtered.map((v, i) => <VideoCard key={v.id} video={v} index={i} showAnalysis />)}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '64px 0', color: 'var(--muted)' }}>
            No saved videos match the current filters.
          </div>
        )}
      </div>
    </>
  )
}
