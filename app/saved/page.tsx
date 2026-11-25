'use client'
import { useState } from 'react'
import { VIDEOS, type Platform, type Niche } from '@/lib/mock-data'
import { formatNumber } from '@/lib/utils'
import PageHeader from '@/components/PageHeader'
import VideoCard from '@/components/VideoCard'

const ALL_PLATFORMS: Platform[] = ['tiktok', 'instagram', 'youtube']
const SAVED_IDS = ['v1', 'v3', 'v6', 'v9', 'v11', 'v12', 'v2', 'v5', 'v14']

export default function SavedPage() {
  const [platforms, setPlatforms] = useState<Platform[]>(ALL_PLATFORMS)
  const [niche, setNiche] = useState<Niche | 'all'>('all')

  const saved = VIDEOS.filter(v => SAVED_IDS.includes(v.id))
  const filtered = saved
    .filter(v => platforms.includes(v.platform))
    .filter(v => niche === 'all' || v.niche === niche)

  const avgScore = saved.length ? Math.round(saved.reduce((s, v) => s + v.score, 0) / saved.length) : 0
  const analyzed = Math.round(saved.length * 0.5)
  const platformCount = new Set(saved.map(v => v.platform)).size
  const thisWeek = 7

  const nicheCounts: Record<string, number> = { all: saved.length }
  for (const v of saved) {
    nicheCounts[v.niche] = (nicheCounts[v.niche] || 0) + 1
  }

  return (
    <>
      <PageHeader title="Saved" platforms={platforms} onPlatformChange={setPlatforms} />
      <div style={{ padding: '24px 32px' }}>

        {/* Asymmetric stats: 1fr 3fr */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 3fr',
          gap: 1, marginBottom: 24,
          background: 'var(--border)', borderRadius: 'var(--r)', overflow: 'hidden',
        }}>
          {/* Big stat */}
          <div style={{ background: 'var(--surface)', padding: '24px 28px' }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', color: 'var(--muted)', marginBottom: 8 }}>SAVED VIDEOS</div>
            <div style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 800, fontSize: 56, color: 'var(--ink)', lineHeight: 1 }}>{saved.length}</div>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 6 }}>Across {platformCount} collections</div>
          </div>

          {/* Mini grid */}
          <div style={{
            background: 'var(--surface)',
            display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)',
            gap: 1, padding: 0, overflow: 'hidden',
          }}>
            {[
              { label: 'AVG SCORE',   value: avgScore.toString(), sub: 'Top tier' },
              { label: 'ANALYZED',    value: analyzed.toString(), sub: '50% complete', color: 'var(--accent)' },
              { label: 'COLLECTIONS', value: '3',                 sub: null },
              { label: 'PLATFORMS',   value: platformCount.toString(), sub: null },
              { label: 'THIS WEEK',   value: thisWeek.toString(), sub: `↑ ${thisWeek - 5} new`, color: 'var(--up)' },
            ].map((s, i) => (
              <div key={i} style={{
                background: 'var(--raised)', padding: '20px 18px',
                borderLeft: '1px solid var(--border)',
              }}>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', color: 'var(--muted)', marginBottom: 8 }}>{s.label}</div>
                <div style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 800, fontSize: 28, color: 'var(--ink)', lineHeight: 1 }}>{s.value}</div>
                {s.sub && <div style={{ fontSize: 11, color: (s as any).color || 'var(--muted)', marginTop: 4 }}>{s.sub}</div>}
              </div>
            ))}
          </div>
        </div>

        {/* Collection tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
          {(['all', 'tech', 'business', 'lifestyle'] as const).map(n => (
            <button
              key={n}
              onClick={() => setNiche(n)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '5px 14px', borderRadius: 20, fontSize: 12,
                border: `1px solid ${niche === n ? 'var(--border-hi)' : 'var(--border)'}`,
                background: niche === n ? 'var(--raised)' : 'transparent',
                color: niche === n ? 'var(--ink)' : 'var(--muted)',
                cursor: 'pointer', transition: 'all 150ms',
              }}
            >
              {n === 'all' ? 'All' : n.charAt(0).toUpperCase() + n.slice(1)}
              <span style={{
                fontSize: 10, fontFamily: 'JetBrains Mono, monospace',
                color: niche === n ? 'var(--accent)' : 'var(--muted)',
              }}>{nicheCounts[n] || 0}</span>
            </button>
          ))}
          <button style={{
            marginLeft: 4, padding: '5px 14px', borderRadius: 20, fontSize: 12,
            border: '1px dashed var(--border)', background: 'transparent',
            color: 'var(--muted)', cursor: 'pointer',
          }}>+ New Collection</button>
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
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
