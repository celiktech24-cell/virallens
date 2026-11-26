'use client'
import { useState, useMemo, useEffect, useCallback } from 'react'
import type { Platform, Niche, Video } from '@/lib/mock-data'
import { VIDEOS } from '@/lib/mock-data'
import { formatNumber } from '@/lib/utils'
import PageHeader from '@/components/PageHeader'
import FeaturedCard from '@/components/FeaturedCard'
import VideoCard from '@/components/VideoCard'
import NicheSegment from '@/components/NicheSegment'
import { useAuth } from '@/components/AuthProvider'

const ALL_PLATFORMS: Platform[] = ['tiktok', 'instagram', 'youtube']

export default function TrendingPage() {
  const { user } = useAuth()
  const [platforms, setPlatforms] = useState<Platform[]>(ALL_PLATFORMS)
  const [niche, setNiche] = useState<Niche | 'all'>('all')
  const [videos, setVideos] = useState<Video[]>(VIDEOS)  // start with mock
  const [source, setSource] = useState<'live' | 'mock'>('mock')
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)

  const loadVideos = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/videos')
      const data = await res.json()
      if (data.videos?.length > 0) {
        setVideos(data.videos)
        setSource(data.source)
        setLastUpdated(new Date().toLocaleTimeString())
      }
    } finally {
      setLoading(false)
    }
  }, [])

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      await fetch('/api/scrape/trending', { method: 'POST' })
      await loadVideos()
    } finally {
      setRefreshing(false)
    }
  }

  useEffect(() => { loadVideos() }, [loadVideos])

  const filtered = useMemo(() =>
    videos
      .filter(v => platforms.includes(v.platform))
      .filter(v => niche === 'all' || v.niche === niche)
      .sort((a, b) => b.score - a.score),
    [videos, platforms, niche]
  )

  const featured = filtered[0]
  const rest = filtered.slice(1)
  const totalViralToday = filtered.length
  const avgScore = filtered.length ? Math.round(filtered.reduce((s, v) => s + v.score, 0) / filtered.length) : 0
  const topTopic = niche === 'all' ? 'AI tools' : niche.charAt(0).toUpperCase() + niche.slice(1)

  return (
    <>
      <PageHeader title="Trending Now" platforms={platforms} onPlatformChange={setPlatforms} />
      <div style={{ padding: '24px 32px' }}>

        {/* Live/mock status bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{
              width: 6, height: 6, borderRadius: '50%',
              background: source === 'live' ? 'var(--up)' : 'var(--muted)',
              display: 'inline-block',
            }} />
            <span style={{ fontSize: 10, fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, letterSpacing: '0.08em', color: source === 'live' ? 'var(--up)' : 'var(--muted)' }}>
              {source === 'live' ? 'LIVE DATA' : 'DEMO DATA'}
            </span>
            {lastUpdated && (
              <span style={{ fontSize: 10, color: 'var(--muted)', fontFamily: 'JetBrains Mono, monospace' }}>
                · updated {lastUpdated}
              </span>
            )}
          </div>
          {user && (
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '5px 12px', borderRadius: 8, fontSize: 11,
                border: '1px solid var(--border)', background: 'var(--surface)',
                color: refreshing ? 'var(--muted)' : 'var(--label)',
                cursor: refreshing ? 'default' : 'pointer',
                fontFamily: 'JetBrains Mono, monospace', fontWeight: 600,
                transition: 'border-color 150ms',
              }}
            >
              <span style={{ display: 'inline-block', animation: refreshing ? 'spin 1s linear infinite' : 'none' }}>↻</span>
              {refreshing ? 'Scraping…' : 'Refresh Data'}
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </button>
          )}
        </div>

        {/* Stat strip */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 1, marginBottom: 24,
          background: 'var(--border)', borderRadius: 'var(--r)', overflow: 'hidden',
        }}>
          {[
            { label: 'VIRAL VIDEOS TODAY', value: totalViralToday.toString(), sub: `↑ ${Math.max(1, totalViralToday - 3)} from yesterday`, color: 'var(--up)' },
            { label: 'AVG VIRAL SCORE',    value: avgScore.toString(),         sub: `↑ +3 this week`,                                      color: 'var(--up)' },
            { label: 'TOP TOPIC',          value: topTopic,                    sub: null,                                                   color: null },
            { label: 'UPDATED',            value: loading ? '…' : lastUpdated ?? '—', sub: null, color: null },
          ].map((s, i) => (
            <div key={i} style={{ background: 'var(--surface)', padding: '14px 20px' }}>
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', color: 'var(--muted)', marginBottom: 6 }}>{s.label}</div>
              <div style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 800, fontSize: 28, color: 'var(--ink)', lineHeight: 1 }}>{s.value}</div>
              {s.sub && <div style={{ fontSize: 11, color: s.color || 'var(--muted)', marginTop: 4 }}>{s.sub}</div>}
            </div>
          ))}
        </div>

        {/* Niche control */}
        <div style={{ marginBottom: 20 }}>
          <NicheSegment value={niche} onChange={setNiche} />
        </div>

        {/* Loading state */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
            {[1,2,3,4,5,6].map(i => (
              <div key={i} style={{ height: 220, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r)', opacity: 0.4 }} />
            ))}
          </div>
        ) : (
          <>
            {featured && <FeaturedCard video={featured} />}
            {rest.length > 0 && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <div>
                    <span style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 700, fontSize: 15, color: 'var(--ink)' }}>More Trending</span>
                    <span style={{ fontSize: 12, color: 'var(--muted)', marginLeft: 8 }}>{rest.length} videos</span>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {(['Most Viral', 'Growing Fast', 'Recent'] as const).map((s, i) => (
                      <button key={s} style={{
                        fontSize: 12, padding: '4px 12px', borderRadius: 20,
                        border: '1px solid var(--border)',
                        background: i === 0 ? 'var(--raised)' : 'transparent',
                        color: i === 0 ? 'var(--ink)' : 'var(--muted)',
                        cursor: 'pointer',
                      }}>{s}</button>
                    ))}
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
                  {rest.map((v, i) => <VideoCard key={v.id} video={v} index={i + 1} />)}
                </div>
              </>
            )}
            {filtered.length === 0 && (
              <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--muted)' }}>
                No videos match the current filters.
              </div>
            )}
          </>
        )}
      </div>
    </>
  )
}
