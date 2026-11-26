import Link from 'next/link'
import type { Video } from '@/lib/mock-data'
import { formatNumber } from '@/lib/utils'
import SaveButton from '@/components/SaveButton'

export default function FeaturedCard({ video }: { video: Video }) {
  return (
    <Link href={`/analysis/${video.id}`} style={{ textDecoration: 'none' }}>
      <div
        className="animate-card-in"
        style={{
          animationDelay: '20ms',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--r)',
          overflow: 'hidden',
          marginBottom: 24,
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
        {/* Left: thumbnail */}
        <div style={{
          position: 'relative',
          background: video.thumbnailGradient,
          minHeight: 200,
          display: 'flex', alignItems: 'flex-start',
          padding: 16,
        }}>
          <span style={{
            fontSize: 10, fontWeight: 700, letterSpacing: '0.08em',
            color: 'var(--muted)', textTransform: 'uppercase',
            fontFamily: 'JetBrains Mono, monospace', background: 'rgba(0,0,0,0.4)',
            padding: '3px 8px', borderRadius: 6,
          }}>
            {video.platform}
          </span>

          <div style={{
            position: 'absolute', bottom: 16, left: 16, right: 16,
          }}>
            <p style={{
              fontFamily: 'Bricolage Grotesque, sans-serif',
              fontWeight: 700, fontSize: 15, color: 'var(--ink)',
              lineHeight: 1.35, textShadow: '0 2px 12px rgba(0,0,0,0.8)',
            }}>{video.title}</p>
          </div>
        </div>

        {/* Right: analysis */}
        <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', color: 'var(--accent)', marginBottom: 2 }}>#1 VIRAL TODAY</div>
              <div style={{ fontSize: 11, color: 'var(--muted)' }}>by {video.creator} · posted {video.ago}</div>
            </div>
            <div style={{
              background: 'var(--accent)', color: '#000',
              fontFamily: 'JetBrains Mono, monospace', fontWeight: 800, fontSize: 22,
              padding: '6px 14px', borderRadius: 10,
            }}>{video.score}</div>
          </div>

          <p style={{ fontSize: 13, color: 'var(--label)', lineHeight: 1.55 }}>
            {video.analysisText}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
            {[
              { label: 'VIEWS',  value: formatNumber(video.views) },
              { label: 'LIKES',  value: formatNumber(video.likes) },
              { label: 'SHARES', value: formatNumber(video.shares) },
            ].map(m => (
              <div key={m.label} style={{
                background: 'var(--raised)', borderRadius: 10, padding: '10px 12px',
              }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink)', fontFamily: 'JetBrains Mono, monospace' }}>{m.value}</div>
                <div style={{ fontSize: 10, color: 'var(--muted)', fontWeight: 600, letterSpacing: '0.06em' }}>{m.label}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 'auto' }}>
            <div style={{
              flex: 1, padding: '8px 16px', borderRadius: 20,
              background: 'var(--accent)', color: '#000',
              fontWeight: 700, fontSize: 12, textAlign: 'center',
            }}>Analyze →</div>
            <SaveButton videoId={video.id} />
          </div>
        </div>
      </div>
    </Link>
  )
}
