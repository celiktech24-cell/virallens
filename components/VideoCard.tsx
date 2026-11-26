import Link from 'next/link'
import type { Video } from '@/lib/mock-data'
import { formatNumber } from '@/lib/utils'
import SaveButton from '@/components/SaveButton'

const PLATFORM_DOT: Record<string, string> = {
  tiktok:    '#69C9D0',
  instagram: '#E1306C',
  youtube:   '#FF4444',
}

type Props = {
  video: Video
  index?: number
  showAnalysis?: boolean
}

export default function VideoCard({ video, index = 0, showAnalysis = false }: Props) {
  const delay = 30 + index * 50

  return (
    <Link href={`/analysis/${video.id}`} style={{ textDecoration: 'none' }}>
      <div
        className="animate-card-in"
        style={{
          animationDelay: `${delay}ms`,
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--r)',
          overflow: 'hidden',
          cursor: 'pointer',
          transition: 'border-color 280ms, box-shadow 280ms var(--expo)',
        }}
        onMouseEnter={e => {
          const el = e.currentTarget as HTMLDivElement
          el.style.borderColor = 'var(--border-hi)'
          el.style.boxShadow = 'var(--lift)'
        }}
        onMouseLeave={e => {
          const el = e.currentTarget as HTMLDivElement
          el.style.borderColor = 'var(--border)'
          el.style.boxShadow = 'none'
        }}
      >
        {/* Thumbnail */}
        <div style={{
          position: 'relative',
          height: 140,
          background: video.thumbnailGradient,
          display: 'flex',
          alignItems: 'flex-end',
          padding: 10,
        }}>
          {/* Platform label */}
          <span style={{
            position: 'absolute', top: 10, left: 10,
            fontSize: 10, fontWeight: 700, letterSpacing: '0.06em',
            color: 'var(--label)', textTransform: 'uppercase',
            fontFamily: 'JetBrains Mono, monospace',
          }}>
            {video.platform.toUpperCase()}
          </span>
          {/* Score badge + save icon */}
          <div style={{ position: 'absolute', top: 10, right: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
            <SaveButton videoId={video.id} variant="icon" />
            <span style={{
              background: 'var(--accent)', color: '#000',
              fontSize: 11, fontWeight: 800,
              padding: '2px 7px', borderRadius: 6,
              fontFamily: 'JetBrains Mono, monospace',
            }}>
              {video.score}
            </span>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '12px 14px' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6,
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
              background: PLATFORM_DOT[video.platform],
            }} />
            <span style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'JetBrains Mono, monospace' }}>
              {video.creator}
            </span>
            <span style={{ fontSize: 11, color: 'var(--muted)', marginLeft: 'auto' }}>
              {video.ago}
            </span>
          </div>

          <p style={{
            fontFamily: 'Bricolage Grotesque, sans-serif',
            fontWeight: 600, fontSize: 13,
            color: 'var(--ink)', lineHeight: 1.4,
            marginBottom: 10,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>
            {video.title}
          </p>

          {showAnalysis && (
            <p style={{
              fontSize: 11, color: 'var(--label)', lineHeight: 1.45,
              marginBottom: 10,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}>
              {video.analysisText}
            </p>
          )}

          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 4, paddingTop: 10,
            borderTop: '1px solid var(--border)',
          }}>
            {[
              { label: 'Views',  value: formatNumber(video.views) },
              { label: 'Likes',  value: formatNumber(video.likes) },
              { label: 'Shares', value: formatNumber(video.shares) },
            ].map(m => (
              <div key={m.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink)', fontFamily: 'JetBrains Mono, monospace' }}>{m.value}</div>
                <div style={{ fontSize: 10, color: 'var(--muted)' }}>{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Link>
  )
}
