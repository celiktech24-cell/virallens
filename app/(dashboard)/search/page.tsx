'use client'
import { useState } from 'react'
import { VIDEOS, RECENT_SEARCHES, type Platform, type Video } from '@/lib/mock-data'
import PageHeader from '@/components/PageHeader'
import VideoCard from '@/components/VideoCard'

const ALL_PLATFORMS: Platform[] = ['tiktok', 'instagram', 'youtube']
const PLATFORM_ABBR: Record<Platform, string> = { tiktok: 'TK', instagram: 'IG', youtube: 'YT' }
const PLATFORM_COLOR: Record<Platform, string> = { tiktok: '#69C9D0', instagram: '#E1306C', youtube: '#FF4444' }

export default function SearchPage() {
  const [platforms, setPlatforms] = useState<Platform[]>(ALL_PLATFORMS)
  const [query, setQuery] = useState('')
  const [submitted, setSubmitted] = useState('')
  const [sort, setSort] = useState<'viral' | 'views' | 'recent'>('viral')
  const [results, setResults] = useState<Video[]>([])
  const [searching, setSearching] = useState(false)

  const handleSearch = async () => {
    const q = query.trim()
    if (!q) return
    setSubmitted(q)
    setSearching(true)
    try {
      const platformParam = platforms.length === 3 ? 'all' : platforms[0]
      const res = await fetch(`/api/scrape/search?q=${encodeURIComponent(q)}&platform=${platformParam}`)
      const data = await res.json()
      const fetched: Video[] = data.videos ?? []
      // Apply sort
      const sorted = [...fetched].sort((a, b) => {
        if (sort === 'viral')  return b.score - a.score
        if (sort === 'views')  return b.views - a.views
        return new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime()
      })
      setResults(sorted)
    } catch {
      // fallback to mock search
      const filtered = VIDEOS.filter(v =>
        platforms.includes(v.platform) &&
        (v.title.toLowerCase().includes(q.toLowerCase()) || v.creator.toLowerCase().includes(q.toLowerCase()))
      ).sort((a, b) => {
        if (sort === 'viral')  return b.score - a.score
        if (sort === 'views')  return b.views - a.views
        return new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime()
      })
      setResults(filtered)
    } finally {
      setSearching(false)
    }
  }

  return (
    <>
      <PageHeader title="Search" platforms={platforms} onPlatformChange={setPlatforms} />
      <div style={{ padding: '48px 32px 32px' }}>

        {/* Hero heading */}
        <div style={{ marginBottom: 32, maxWidth: 600 }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', color: 'var(--muted)', marginBottom: 10 }}>SEARCH ENGINE</div>
          <h1 style={{
            fontFamily: 'Bricolage Grotesque, sans-serif',
            fontWeight: 800, fontSize: 42, lineHeight: 1.1, color: 'var(--ink)',
          }}>
            Find what's<br />
            <span style={{ color: 'var(--accent)' }}>going viral</span>
          </h1>
        </div>

        {/* Search bar */}
        <div style={{
          display: 'flex', gap: 0,
          border: '1px solid var(--border-hi)',
          borderRadius: 'var(--r)', overflow: 'hidden',
          background: 'var(--surface)',
          marginBottom: 20, maxWidth: 640,
        }}>
          <div style={{ padding: '0 16px', display: 'flex', alignItems: 'center', color: 'var(--muted)' }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5"/><path d="M11 11l2.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </div>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            placeholder='Try "iPhone 16", "morning routine", "make money online"...'
            style={{
              flex: 1, border: 'none', outline: 'none',
              background: 'transparent', color: 'var(--ink)',
              fontSize: 13, padding: '12px 0',
            }}
          />
          <button
            onClick={handleSearch}
            disabled={searching}
            style={{
              padding: '12px 24px',
              background: searching ? 'var(--raised)' : 'var(--accent)',
              color: searching ? 'var(--muted)' : '#000',
              fontWeight: 700, fontSize: 13, border: 'none',
              cursor: searching ? 'default' : 'pointer',
              transition: 'background 150ms',
            }}
          >{searching ? 'Searching…' : 'Search'}</button>
        </div>

        {/* On: platform pills + Sort */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
          <span style={{ fontSize: 11, color: 'var(--muted)' }}>On:</span>
          {ALL_PLATFORMS.map(p => {
            const on = platforms.includes(p)
            return (
              <button
                key={p}
                onClick={() => setPlatforms(prev => on && prev.length > 1 ? prev.filter(x => x !== p) : [...new Set([...prev, p])])}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '4px 12px', borderRadius: 20,
                  border: `1px solid ${on ? 'var(--border-hi)' : 'var(--border)'}`,
                  background: on ? 'var(--raised)' : 'transparent',
                  color: on ? 'var(--ink)' : 'var(--muted)',
                  fontSize: 12, cursor: 'pointer',
                  transition: 'all 150ms',
                }}
              >
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: on ? PLATFORM_COLOR[p] : 'var(--muted)' }} />
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            )
          })}
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>
            {(['viral', 'views', 'recent'] as const).map(s => (
              <button
                key={s}
                onClick={() => setSort(s)}
                style={{
                  padding: '4px 12px', borderRadius: 20, fontSize: 12,
                  border: '1px solid var(--border)',
                  background: sort === s ? 'var(--raised)' : 'transparent',
                  color: sort === s ? 'var(--ink)' : 'var(--muted)',
                  cursor: 'pointer',
                }}
              >
                {s === 'viral' ? 'Most Viral' : s === 'views' ? 'Views' : 'Recent'}
              </button>
            ))}
          </div>
        </div>

        {/* Recent searches (shown when no query) */}
        {!submitted && (
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', color: 'var(--muted)', marginBottom: 12 }}>RECENT SEARCHES</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {RECENT_SEARCHES.map((s, i) => (
                <button
                  key={i}
                  onClick={() => { setQuery(s.query); setSubmitted(s.query); handleSearch() }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '6px 14px', borderRadius: 20,
                    border: '1px solid var(--border)',
                    background: 'var(--surface)', color: 'var(--label)',
                    fontSize: 12, cursor: 'pointer',
                    transition: 'border-color 150ms',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--border-hi)')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
                >
                  <span style={{
                    fontSize: 9, fontWeight: 700, letterSpacing: '0.06em',
                    color: PLATFORM_COLOR[s.platform],
                    fontFamily: 'JetBrains Mono, monospace',
                  }}>{PLATFORM_ABBR[s.platform]}</span>
                  {s.query}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {submitted && (
          <div>
            <div style={{ marginBottom: 16, fontSize: 13, color: 'var(--label)' }}>
              {searching ? (
                <span style={{ color: 'var(--muted)' }}>Searching across platforms…</span>
              ) : (
                <>{results.length} result{results.length !== 1 ? 's' : ''} for <strong style={{ color: 'var(--ink)' }}>"{submitted}"</strong></>
              )}
            </div>
            {searching ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
                {[1,2,3,4,5,6].map(i => (
                  <div key={i} style={{ height: 220, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r)', opacity: 0.4 }} />
                ))}
              </div>
            ) : results.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
                {results.map((v, i) => <VideoCard key={v.id} video={v} index={i} />)}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '64px 0', color: 'var(--muted)' }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>🔍</div>
                <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--label)', marginBottom: 6 }}>No results found</div>
                <div style={{ fontSize: 13, color: 'var(--muted)' }}>Try a different keyword — "AI tools", "money", "workout"</div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}
