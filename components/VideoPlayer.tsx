'use client'
import { useState } from 'react'

type Props = {
  platform: 'tiktok' | 'instagram' | 'youtube'
  originalId: string
  videoUrl?: string
  thumbnailUrl?: string
  title: string
  creatorHandle: string
  ago: string
  externalUrl: string
}

const PLATFORM_COLOR: Record<string, string> = {
  tiktok: '#69C9D0',
  instagram: '#E1306C',
  youtube: '#FF4444',
}

export default function VideoPlayer({
  platform, originalId, videoUrl, thumbnailUrl, title, creatorHandle, ago, externalUrl
}: Props) {
  const [error, setError] = useState(false)

  // YouTube — always use iframe embed
  if (platform === 'youtube') {
    const embedUrl = `https://www.youtube.com/embed/${originalId}?autoplay=0&rel=0`
    return (
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r)', overflow: 'hidden' }}>
        <iframe
          src={embedUrl}
          style={{ width: '100%', aspectRatio: '16/9', display: 'block', border: 'none' }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title={title}
        />
      </div>
    )
  }

  const proxyUrl = videoUrl
    ? `/api/proxy/video?url=${encodeURIComponent(videoUrl)}`
    : null

  const color = PLATFORM_COLOR[platform]

  // Has a video URL and no error — show <video> player
  if (proxyUrl && !error) {
    return (
      <div style={{
        background: '#000', borderRadius: 'var(--r)', overflow: 'hidden',
        border: '1px solid var(--border)', position: 'relative',
      }}>
        <video
          src={proxyUrl}
          poster={thumbnailUrl}
          controls
          playsInline
          style={{ width: '100%', maxHeight: 480, display: 'block', background: '#000' }}
          onError={() => setError(true)}
        />
        {/* Open original link */}
        <a
          href={externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            position: 'absolute', top: 10, right: 10,
            background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
            color: '#fff', fontSize: 11, fontWeight: 600,
            padding: '4px 10px', borderRadius: 20, textDecoration: 'none',
            display: 'flex', alignItems: 'center', gap: 5, border: '1px solid rgba(255,255,255,0.15)',
          }}
        >
          Open on {platform === 'tiktok' ? 'TikTok' : 'Instagram'}
          <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
            <path d="M4 12L12 4M12 4H6M12 4v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
      </div>
    )
  }

  // No video URL or load error — styled platform card
  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 'var(--r)', overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Thumbnail or gradient */}
      <div style={{
        aspectRatio: '9/16', maxHeight: 320,
        background: thumbnailUrl ? `url(${thumbnailUrl}) center/cover no-repeat` : `linear-gradient(145deg, ${color}22, ${color}08)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative',
      }}>
        {error && (
          <div style={{
            position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5"/>
              <path d="M12 8v4M12 16v.5" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>Video unavailable</span>
          </div>
        )}
        {!thumbnailUrl && !error && (
          platform === 'tiktok' ? (
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V9.07a8.16 8.16 0 0 0 4.77 1.52V7.14a4.85 4.85 0 0 1-1.01-.45Z" fill={color} opacity="0.6"/>
            </svg>
          ) : (
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
              <rect x="2" y="2" width="20" height="20" rx="5" stroke={color} strokeWidth="1.5" opacity="0.6"/>
              <circle cx="12" cy="12" r="4" stroke={color} strokeWidth="1.5" opacity="0.6"/>
              <circle cx="17.5" cy="6.5" r="1" fill={color} opacity="0.6"/>
            </svg>
          )
        )}
      </div>
      <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ minWidth: 0 }}>
          <p style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 2 }}>@{creatorHandle} · {ago}</p>
          <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</p>
        </div>
        <a
          href={externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            flexShrink: 0, display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '8px 16px', borderRadius: 20,
            background: color, color: platform === 'tiktok' ? '#000' : '#fff',
            fontSize: 11, fontWeight: 700, textDecoration: 'none', whiteSpace: 'nowrap',
          }}
        >
          Watch
          <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
            <path d="M4 12L12 4M12 4H6M12 4v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
      </div>
    </div>
  )
}
