'use client'
import { useState, useMemo, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { VIDEOS, type Platform, type Video } from '@/lib/mock-data'
import { formatNumber } from '@/lib/utils'
import PageHeader from '@/components/PageHeader'

const ALL_PLATFORMS: Platform[] = ['tiktok', 'instagram', 'youtube']
const PLATFORM_DOT: Record<Platform, string> = { tiktok: '#69C9D0', instagram: '#E1306C', youtube: '#FF4444' }

export default function AnalyticsPage() {
  const [platforms, setPlatforms] = useState<Platform[]>(ALL_PLATFORMS)
  const [videos, setVideos] = useState<Video[]>(VIDEOS)

  const loadVideos = useCallback(async () => {
    try {
      const res = await fetch('/api/videos')
      if (!res.ok) return
      const data = await res.json()
      if (data.videos?.length > 0) setVideos(data.videos)
    } catch {
      // keep mock fallback
    }
  }, [])

  useEffect(() => { loadVideos() }, [loadVideos])

  const filtered = useMemo(() => videos.filter(v => platforms.includes(v.platform)), [videos, platforms])

  const stats = useMemo(() => {
    const count = filtered.length
    const avg = count ? Math.round(filtered.reduce((s, v) => s + v.score, 0) / count) : 0

    const pCounts: Record<string, number> = {}
    filtered.forEach(v => { pCounts[v.platform] = (pCounts[v.platform] || 0) + 1 })
    const topPlatform = Object.entries(pCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'tiktok'
    const topPlatformLabel = topPlatform.charAt(0).toUpperCase() + topPlatform.slice(1)

    const hookCounts: Record<string, number> = {}
    filtered.forEach(v => v.hookTypes.forEach(h => { hookCounts[h.label] = (hookCounts[h.label] || 0) + 1 }))
    const topHook = Object.entries(hookCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—'

    return { count, avg, topPlatformLabel, topHook }
  }, [filtered])

  const platformStats = useMemo(() =>
    (['tiktok', 'instagram', 'youtube'] as Platform[]).map(p => {
      const vids = filtered.filter(v => v.platform === p)
      const avg = vids.length ? Math.round(vids.reduce((s, v) => s + v.score, 0) / vids.length) : 0
      const top = vids.sort((a, b) => b.score - a.score)[0]
      return { platform: p, count: vids.length, avg, topTitle: top?.title ?? '—' }
    }), [filtered])

  const nicheStats = useMemo(() =>
    (['tech', 'business', 'lifestyle'] as const).map(n => {
      const vids = filtered.filter(v => v.niche === n)
      const avg = vids.length ? Math.round(vids.reduce((s, v) => s + v.score, 0) / vids.length) : 0
      const hookCounts: Record<string, number> = {}
      vids.forEach(v => v.hookTypes.forEach(h => { hookCounts[h.label] = (hookCounts[h.label] || 0) + 1 }))
      const domHook = Object.entries(hookCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—'
      return { niche: n, count: vids.length, avg, domHook }
    }), [filtered])

  const hookLeaderboard = useMemo(() => {
    const map: Record<string, { count: number; scores: number[] }> = {}
    filtered.forEach(v => v.hookTypes.forEach(h => {
      if (!map[h.label]) map[h.label] = { count: 0, scores: [] }
      map[h.label].count++
      map[h.label].scores.push(h.score)
    }))
    return Object.entries(map)
      .map(([label, { count, scores }]) => ({
        label, count,
        avgScore: Math.round(scores.reduce((s, x) => s + x, 0) / scores.length),
      }))
      .sort((a, b) => b.avgScore - a.avgScore)
      .slice(0, 8)
  }, [filtered])

  const topPerformers = useMemo(() =>
    [...filtered].sort((a, b) => b.score - a.score).slice(0, 5), [filtered])

  const card: React.CSSProperties = {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--r)',
    padding: '20px 24px',
  }

  return (
    <>
      <PageHeader title="Analytics" platforms={platforms} onPlatformChange={setPlatforms} />
      <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Stat strip */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, background: 'var(--border)', borderRadius: 'var(--r)', overflow: 'hidden' }}>
          {[
            { label: 'VIDEOS TRACKED',  value: stats.count.toString(),         sub: `${videos.length} total in dataset`,    color: 'var(--muted)' },
            { label: 'AVG VIRAL SCORE', value: stats.avg.toString(),            sub: '↑ +3 this week',         color: 'var(--up)' },
            { label: 'TOP PLATFORM',    value: stats.topPlatformLabel,          sub: 'most viral content',     color: 'var(--muted)' },
            { label: 'TOP HOOK',        value: stats.topHook,                   sub: 'dominant pattern',       color: 'var(--muted)' },
          ].map((s, i) => (
            <div key={i} style={{ background: 'var(--surface)', padding: '14px 20px' }}>
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', color: 'var(--muted)', marginBottom: 6 }}>{s.label}</div>
              <div style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 800, fontSize: 28, color: 'var(--ink)', lineHeight: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.value}</div>
              <div style={{ fontSize: 11, color: s.color, marginTop: 4 }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Two-column row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

          {/* Platform Performance */}
          <div className="animate-card-in" style={card}>
            <div style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 700, fontSize: 14, color: 'var(--ink)', marginBottom: 16 }}>Platform Performance</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {platformStats.map(ps => (
                <div key={ps.platform}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: PLATFORM_DOT[ps.platform], display: 'inline-block', flexShrink: 0 }} />
                      <span style={{ fontSize: 13, color: 'var(--ink)', fontWeight: 500 }}>{ps.platform.charAt(0).toUpperCase() + ps.platform.slice(1)}</span>
                      <span style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: 'var(--muted)', background: 'var(--raised)', padding: '1px 6px', borderRadius: 4 }}>{ps.count}</span>
                    </div>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, fontSize: 12, color: ps.avg >= 90 ? 'var(--accent)' : 'var(--label)' }}>{ps.avg}</span>
                  </div>
                  <div style={{ height: 4, background: 'var(--raised)', borderRadius: 2, overflow: 'hidden', marginBottom: 6 }}>
                    <div className="animate-bar" style={{ height: '100%', width: `${ps.avg}%`, background: 'var(--accent)', borderRadius: 2 }} />
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ps.topTitle}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Niche Breakdown */}
          <div className="animate-card-in" style={{ ...card, animationDelay: '60ms' }}>
            <div style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 700, fontSize: 14, color: 'var(--ink)', marginBottom: 16 }}>Niche Breakdown</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {nicheStats.map(ns => (
                <div key={ns.niche}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 13, color: 'var(--ink)', fontWeight: 500 }}>{ns.niche.charAt(0).toUpperCase() + ns.niche.slice(1)}</span>
                      <span style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: 'var(--muted)', background: 'var(--raised)', padding: '1px 6px', borderRadius: 4 }}>{ns.count}</span>
                    </div>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, fontSize: 12, color: 'var(--label)' }}>{ns.avg}</span>
                  </div>
                  <div style={{ height: 4, background: 'var(--raised)', borderRadius: 2, overflow: 'hidden', marginBottom: 6 }}>
                    <div className="animate-bar" style={{ height: '100%', width: `${ns.avg}%`, background: 'var(--accent)', borderRadius: 2 }} />
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--muted)' }}>Top hook: <span style={{ color: 'var(--label)' }}>{ns.domHook}</span></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Hook Type Leaderboard */}
        <div className="animate-card-in" style={{ ...card, animationDelay: '120ms' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 16 }}>
            <span style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 700, fontSize: 14, color: 'var(--ink)' }}>Hook Type Leaderboard</span>
            <span style={{ fontSize: 11, color: 'var(--muted)' }}>ranked by average viral score</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {hookLeaderboard.map((h, i) => {
              const isTop1 = i === 0
              const isTop3 = i < 3
              return (
                <div key={h.label} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '8px 10px', borderRadius: 8,
                  background: isTop3 ? 'var(--raised)' : 'transparent',
                }}>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'var(--muted)', width: 16, flexShrink: 0 }}>{i + 1}</span>
                  <span style={{ fontSize: 13, color: isTop3 ? 'var(--ink)' : 'var(--label)', fontWeight: isTop3 ? 500 : 400, minWidth: 160 }}>{h.label}</span>
                  <span style={{ fontSize: 11, color: 'var(--muted)', flexShrink: 0 }}>in {h.count} videos</span>
                  <div style={{ flex: 1, height: 4, background: 'var(--border)', borderRadius: 2, overflow: 'hidden' }}>
                    <div className="animate-bar" style={{
                      height: '100%',
                      width: `${h.avgScore}%`,
                      background: isTop1
                        ? 'linear-gradient(90deg, var(--accent), #60A5FA)'
                        : isTop3 ? 'var(--accent)' : 'var(--raised)',
                      borderRadius: 2,
                    }} />
                  </div>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, fontWeight: 700, color: isTop1 ? 'var(--accent)' : 'var(--label)', flexShrink: 0, width: 28, textAlign: 'right' }}>{h.avgScore}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Top Performers */}
        <div className="animate-card-in" style={{ ...card, animationDelay: '180ms' }}>
          <div style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 700, fontSize: 14, color: 'var(--ink)', marginBottom: 16 }}>Top Performers</div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {topPerformers.map((v, i) => (
              <Link key={v.id} href={`/analysis/${v.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '12px 0',
                  borderBottom: i < topPerformers.length - 1 ? '1px solid var(--border)' : 'none',
                  cursor: 'pointer',
                }}>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'var(--muted)', width: 20, flexShrink: 0 }}>#{i + 1}</span>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: PLATFORM_DOT[v.platform], display: 'inline-block', flexShrink: 0 }} />
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'var(--muted)', flexShrink: 0 }}>@{v.creatorHandle}</span>
                  <span style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 600, fontSize: 13, color: 'var(--ink)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v.title}</span>
                  <span style={{ fontSize: 10, color: 'var(--label)', border: '1px solid var(--border-hi)', borderRadius: 4, padding: '2px 7px', flexShrink: 0 }}>{v.niche}</span>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, fontWeight: 800, color: '#000', background: 'var(--accent)', borderRadius: 5, padding: '2px 8px', flexShrink: 0 }}>{v.score}</span>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'var(--muted)', flexShrink: 0, minWidth: 48, textAlign: 'right' }}>{formatNumber(v.views)}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--muted)' }}>
            No videos match the current filters.
          </div>
        )}
      </div>
    </>
  )
}
