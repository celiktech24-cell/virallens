export const instant = false

import { VIDEOS } from '@/lib/mock-data'
import { formatNumber, scoreLabel } from '@/lib/utils'
import BackButton from '@/components/BackButton'
import SaveButton from '@/components/SaveButton'
import AddToCollection from '@/components/AddToCollection'
import VideoPlayer from '@/components/VideoPlayer'
import { createClient } from '@/lib/supabase/server'
import { getVideoById } from '@/lib/supabase/videos'


const PLATFORM_DOT: Record<string, string> = {
  tiktok: '#69C9D0', instagram: '#E1306C', youtube: '#FF4444',
}

const HOOK_ICONS: Record<string, string> = {
  'List Format': '📋', 'Question Hook': '❓', 'Shocking Stat': '⚡', 'Story Arc': '📖',
  'Transformation Arc': '🔄', 'Exact Amount': '💰', 'Journey Hook': '🗺️',
  'Secret Reveal': '🔮', 'Curiosity Gap': '🎯', 'Contrarian Take': '↩️',
  'Fear Hook': '⚠️', 'Speed Challenge': '⚡', 'No-Code Appeal': '🛠️',
  'Zero Budget Hook': '🆓', 'Proof Result': '✅', 'Income Proof': '💵',
  'Specific Amount': '🔢', 'CTA Early': '📢', 'Experiment Frame': '🔬',
  'Budget Constraint': '💲', 'Practical Utility': '🔧',
}

export default async function AnalysisPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const video = (await getVideoById(supabase, id)) ?? VIDEOS.find(v => v.id === id)

  if (!video) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--muted)' }}>
        Video not found.
      </div>
    )
  }

  const originalId = video.id.includes(':') ? video.id.split(':')[1] : video.id
  const videoUrl =
    video.platform === 'tiktok'    ? `https://www.tiktok.com/@${video.creatorHandle}/video/${originalId}`
    : video.platform === 'instagram' ? `https://www.instagram.com/reels/${originalId}/`
    :                                   `https://www.youtube.com/shorts/${originalId}`
  const circumference = 251.3
  const dashOffset = circumference - (video.score / 100) * (circumference - 15.1)

  const maxMetric = Math.max(video.views, video.likes * 10, video.shares * 15, video.comments * 20)
  const metrics = [
    { label: 'Views',    value: video.views,    pct: video.views / maxMetric, color: 'var(--accent)' },
    { label: 'Likes',    value: video.likes,    pct: (video.likes * 10) / maxMetric, color: '#60A5FA' },
    { label: 'Shares',   value: video.shares,   pct: (video.shares * 15) / maxMetric, color: '#A78BFA' },
    { label: 'Comments', value: video.comments, pct: (video.comments * 20) / maxMetric, color: '#34D399' },
  ]

  return (
    <>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 16,
        padding: '14px 32px', borderBottom: '1px solid var(--border)',
        background: 'var(--surface)', position: 'sticky', top: 0, zIndex: 10,
      }}>
        <BackButton />
        <span style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 700, fontSize: 15, color: 'var(--ink)' }}>
          Video Analysis
        </span>
      </div>

      <div style={{ padding: '32px' }}>
        {/* Score + summary hero */}
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 'var(--r)', padding: '28px 32px',
          display: 'grid', gridTemplateColumns: '160px 1fr',
          gap: 32, marginBottom: 20,
        }} className="animate-card-in">

          {/* Ring */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="130" height="130" viewBox="0 0 90 90">
              <circle cx="45" cy="45" r="40" fill="none" stroke="var(--raised)" strokeWidth="4" />
              <circle
                cx="45" cy="45" r="40"
                fill="none" stroke="var(--accent)" strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                transform="rotate(-90 45 45)"
                className="animate-ring"
              />
              <text x="45" y="49" textAnchor="middle" dominantBaseline="middle"
                fill="var(--ink)" fontSize="18" fontWeight="800"
                fontFamily="Bricolage Grotesque, sans-serif">
                {video.score}
              </text>
            </svg>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--accent)', letterSpacing: '0.08em', marginTop: 4 }}>
              {scoreLabel(video.score).toUpperCase()}
            </div>
          </div>

          {/* Summary */}
          <div>
            <div style={{ marginBottom: 12 }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                background: 'var(--accent-bg)', border: '1px solid rgba(206,255,94,0.2)',
                borderRadius: 8, padding: '4px 12px', marginBottom: 10,
              }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent)' }}>{scoreLabel(video.score)}</span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--muted)' }}>
                Exceptional score: high engagement velocity and outstanding hook-to-share ratio across all platforms tracked.
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: PLATFORM_DOT[video.platform] }} />
              <span style={{ fontSize: 12, color: 'var(--label)', fontFamily: 'JetBrains Mono, monospace' }}>{video.creator}</span>
              <span style={{ fontSize: 11, color: 'var(--muted)', marginLeft: 4 }}>
                {video.platform.toUpperCase()} · {video.niche}
              </span>
            </div>

            <p style={{ fontSize: 14, fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 600, color: 'var(--ink)', lineHeight: 1.4, marginBottom: 12 }}>
              {video.title}
            </p>

            <p style={{ fontSize: 13, color: 'var(--label)', lineHeight: 1.6 }}>{video.analysisText}</p>
          </div>
        </div>

        {/* 4 metric cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
          {[
            { label: 'VIEWS',    value: formatNumber(video.views),    sub: `↑ ${(video.views / 1_000_000).toFixed(1)}M in 24h`, color: 'var(--up)' },
            { label: 'LIKES',    value: formatNumber(video.likes),    sub: '12% rate', color: null },
            { label: 'SHARES',   value: formatNumber(video.shares),   sub: '↑ Top 3%', color: 'var(--up)' },
            { label: 'COMMENTS', value: formatNumber(video.comments), sub: '↑ Top 5%', color: 'var(--up)' },
          ].map((m, i) => (
            <div
              key={m.label}
              className="animate-card-in"
              style={{ animationDelay: `${60 + i * 50}ms`, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: '16px 20px' }}
            >
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', color: 'var(--muted)', marginBottom: 8 }}>{m.label}</div>
              <div style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 800, fontSize: 28, color: 'var(--ink)', lineHeight: 1 }}>{m.value}</div>
              {m.sub && <div style={{ fontSize: 11, color: m.color || 'var(--muted)', marginTop: 6 }}>{m.sub}</div>}
            </div>
          ))}
        </div>

        {/* Video Preview */}
        <div style={{ marginBottom: 20, display: 'grid', gridTemplateColumns: video.platform === 'youtube' ? '1fr' : '280px 1fr', gap: 14, alignItems: 'start' }} className="animate-card-in">
          <VideoPlayer
            platform={video.platform}
            originalId={originalId}
            videoUrl={video.videoUrl}
            thumbnailUrl={video.thumbnailUrl}
            title={video.title}
            creatorHandle={video.creatorHandle}
            ago={video.ago}
            externalUrl={videoUrl}
          />
          {video.platform !== 'youtube' && (
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', color: 'var(--muted)', marginBottom: 8 }}>WHY IT WENT VIRAL</div>
                <p style={{ fontSize: 13, color: 'var(--label)', lineHeight: 1.65 }}>{video.analysisText}</p>
              </div>
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16 }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', color: 'var(--muted)', marginBottom: 10 }}>HOOK SUMMARY</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {video.hookTypes.slice(0, 4).map(h => (
                    <span key={h.label} style={{
                      fontSize: 11, padding: '4px 10px', borderRadius: 20,
                      background: 'var(--accent-bg)', border: '1px solid rgba(206,255,94,0.15)',
                      color: 'var(--accent)', fontWeight: 600,
                    }}>{h.label}</span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Hook breakdown + engagement bars */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          {/* Hook Types */}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: '20px 24px' }} className="animate-card-in">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <span style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 700, fontSize: 14, color: 'var(--ink)' }}>Hook Type</span>
              <span style={{ background: 'var(--accent)', color: '#000', fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 6, fontFamily: 'JetBrains Mono, monospace' }}>{video.hookTypes.length}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {video.hookTypes.map((h, i) => (
                <div key={h.label} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 14px', borderRadius: 10,
                  background: i === 0 ? 'var(--raised)' : 'transparent',
                  border: `1px solid ${i === 0 ? 'var(--border-hi)' : 'transparent'}`,
                }}>
                  <span style={{ fontSize: 16, width: 24, textAlign: 'center' }}>{HOOK_ICONS[h.label] || '🎯'}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: i === 0 ? 600 : 400, color: i === 0 ? 'var(--ink)' : 'var(--label)' }}>{h.label}</div>
                    <div style={{ fontSize: 10, color: 'var(--muted)' }}>{i === 0 ? 'Numbered list · viral archetype' : i === 1 ? '45% open rate' : i === 2 ? '38% stop-scroll' : '22% watch-through'}</div>
                  </div>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, fontWeight: 700, color: i === 0 ? 'var(--accent)' : 'var(--muted)' }}>{h.score}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Engagement breakdown */}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: '20px 24px' }} className="animate-card-in">
            <div style={{ marginBottom: 16 }}>
              <span style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 700, fontSize: 14, color: 'var(--ink)' }}>Engagement Breakdown</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {metrics.map(m => (
                <div key={m.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                    <span style={{ fontSize: 11, color: 'var(--label)' }}>{m.label}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--ink)', fontFamily: 'JetBrains Mono, monospace' }}>{formatNumber(m.value)}</span>
                  </div>
                  <div style={{ height: 4, background: 'var(--raised)', borderRadius: 2, overflow: 'hidden' }}>
                    <div className="animate-bar" style={{ height: '100%', width: `${Math.round(m.pct * 100)}%`, background: m.color, borderRadius: 2 }} />
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 20, padding: '14px 16px', background: 'var(--raised)', borderRadius: 10 }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', color: 'var(--muted)', marginBottom: 6 }}>WHY IT WENT VIRAL</div>
              <p style={{ fontSize: 12, color: 'var(--label)', lineHeight: 1.55 }}>{video.analysisText}</p>
            </div>
          </div>
        </div>

        {/* Action bar */}
        <div style={{ marginTop: 20, display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <AddToCollection videoId={video.id} />
          <SaveButton videoId={video.id} />
          <a href={videoUrl} target="_blank" rel="noopener noreferrer" style={{ padding: '8px 20px', borderRadius: 20, background: 'var(--accent)', color: '#000', fontSize: 12, fontWeight: 700, border: 'none', cursor: 'pointer', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            Open Original →
          </a>
        </div>
      </div>
    </>
  )
}
