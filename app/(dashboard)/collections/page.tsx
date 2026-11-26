'use client'
import { useState, useEffect } from 'react'
import type { Platform, Video } from '@/lib/mock-data'
import { VIDEOS } from '@/lib/mock-data'
import { useAuth } from '@/components/AuthProvider'
import { createClient } from '@/lib/supabase/client'
import {
  getCollectionsWithVideos, seedBuiltInCollections,
  createDbCollection, deleteDbCollection,
  type DbCollection,
} from '@/lib/supabase/db'
import { getVideosByIds } from '@/lib/supabase/videos'
import PageHeader from '@/components/PageHeader'
import VideoCard from '@/components/VideoCard'

const COLOR_SWATCHES = ['#69C9D0', '#CEFF5E', '#E1306C', '#A78BFA', '#34D399']

export default function CollectionsPage() {
  const { user, loading: authLoading } = useAuth()
  const [platforms, setPlatforms] = useState<Platform[]>(['tiktok', 'instagram', 'youtube'])
  const [collections, setCollections] = useState<DbCollection[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [showNewForm, setShowNewForm] = useState(false)
  const [newName, setNewName] = useState('')
  const [newColor, setNewColor] = useState('#69C9D0')
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  const [expandedVideos, setExpandedVideos] = useState<Video[]>([])

  const loadCollections = async () => {
    if (!user) return
    const supabase = createClient()
    await seedBuiltInCollections(supabase)
    const cols = await getCollectionsWithVideos(supabase)
    setCollections(cols)
    setLoading(false)
  }

  useEffect(() => {
    if (authLoading) return
    if (!user) { setLoading(false); return }
    loadCollections()
  }, [user, authLoading])

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (expandedId === id) setExpandedId(null)
    const supabase = createClient()
    await deleteDbCollection(supabase, id)
    setCollections(prev => prev.filter(c => c.id !== id))
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = newName.trim()
    if (!trimmed || !user) return
    const supabase = createClient()
    const id = await createDbCollection(supabase, trimmed, newColor)
    if (id) {
      setCollections(prev => [...prev, { id, name: trimmed, color: newColor, is_built_in: false, videoIds: [] }])
    }
    setNewName(''); setNewColor('#69C9D0'); setShowNewForm(false)
  }

  const totalVideos = collections.reduce((s, c) => s + c.videoIds.length, 0)
  const expandedCollection = collections.find(c => c.id === expandedId) ?? null

  useEffect(() => {
    if (!expandedCollection) { setExpandedVideos([]); return }
    const ids = expandedCollection.videoIds
    if (ids.length === 0) { setExpandedVideos([]); return }
    const supabase = createClient()
    getVideosByIds(supabase, ids).then(dbVideos => {
      const mockFallback = VIDEOS.filter(v => ids.includes(v.id) && !dbVideos.find(dv => dv.id === v.id))
      const all = [...dbVideos, ...mockFallback]
      setExpandedVideos(all.filter(v => platforms.includes(v.platform)))
    })
  }, [expandedId, platforms, collections])

  return (
    <div style={{ minHeight: '100vh', background: 'var(--ground)' }}>
      <PageHeader title="Collections" platforms={platforms} onPlatformChange={setPlatforms} />
      <div style={{ padding: '28px 32px' }}>

        {/* Stats strip */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: 'var(--border)', borderRadius: 'var(--r)', overflow: 'hidden', marginBottom: 28 }}>
          {[
            { label: 'COLLECTIONS',  value: String(collections.length) },
            { label: 'TOTAL VIDEOS', value: String(totalVideos) },
            { label: 'SYNCED',       value: 'Cloud' },
          ].map((s, i) => (
            <div key={s.label} style={{ background: 'var(--surface)', padding: '14px 20px' }}>
              <div style={{ fontSize: 9, fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, letterSpacing: '0.1em', color: 'var(--muted)', marginBottom: 6 }}>{s.label}</div>
              <div style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 800, fontSize: 28, color: i === 2 ? 'var(--up)' : 'var(--ink)', lineHeight: 1 }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Collection cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: expandedCollection ? 0 : 28 }}>
          {loading ? [1,2,3].map(i => (
            <div key={i} style={{ height: 120, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r)', opacity: 0.5 }} />
          )) : collections.map(col => {
            const isExpanded = expandedId === col.id
            const isHovered = hoveredCard === col.id
            return (
              <div
                key={col.id}
                onClick={() => { setExpandedId(prev => prev === col.id ? null : col.id); setShowNewForm(false) }}
                onMouseEnter={() => setHoveredCard(col.id)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  position: 'relative', background: 'var(--surface)',
                  border: `1px solid ${isExpanded || isHovered ? 'var(--border-hi)' : 'var(--border)'}`,
                  borderRadius: 'var(--r)', padding: '20px', cursor: 'pointer',
                  transition: 'border-color 200ms, box-shadow 200ms',
                  boxShadow: isHovered || isExpanded ? 'var(--lift)' : 'none',
                }}
              >
                {!col.is_built_in && isHovered && (
                  <button onClick={e => handleDelete(col.id, e)} style={{
                    position: 'absolute', top: 10, right: 10,
                    width: 22, height: 22, borderRadius: 6,
                    border: '1px solid var(--border)', background: 'var(--raised)',
                    color: 'var(--muted)', fontSize: 13, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0,
                  }}>×</button>
                )}
                <div style={{ width: 36, height: 36, borderRadius: 10, background: col.color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                  <div style={{ width: 12, height: 12, borderRadius: '50%', background: col.color }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 700, fontSize: 15, color: 'var(--ink)' }}>{col.name}</span>
                  {col.is_built_in && (
                    <span style={{ fontSize: 9, fontFamily: 'JetBrains Mono, monospace', fontWeight: 600, letterSpacing: '0.07em', color: 'var(--muted)', border: '1px solid var(--border)', borderRadius: 4, padding: '1px 5px' }}>BUILT-IN</span>
                  )}
                </div>
                <div style={{ fontSize: 11, color: 'var(--muted)' }}>
                  {col.videoIds.length === 0 ? '0 videos · Add from an analysis page' : `${col.videoIds.length} video${col.videoIds.length !== 1 ? 's' : ''}`}
                </div>
                {isExpanded && (
                  <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px solid var(--border)', fontSize: 11, color: 'var(--accent)', fontFamily: 'JetBrains Mono, monospace' }}>EXPANDED ↑</div>
                )}
              </div>
            )
          })}

          {/* New Collection */}
          {!showNewForm ? (
            <div
              onClick={() => { setShowNewForm(true); setExpandedId(null) }}
              onMouseEnter={() => setHoveredCard('__new__')}
              onMouseLeave={() => setHoveredCard(null)}
              style={{
                background: 'transparent',
                border: `1px dashed ${hoveredCard === '__new__' ? 'var(--border-hi)' : 'var(--border)'}`,
                borderRadius: 'var(--r)', padding: '20px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', gap: 8, minHeight: 120, transition: 'border-color 200ms',
              }}
            >
              <span style={{ width: 32, height: 32, borderRadius: '50%', border: '1px dashed var(--border-hi)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, color: 'var(--muted)' }}>+</span>
              <span style={{ fontSize: 13, color: 'var(--muted)' }}>New Collection</span>
            </div>
          ) : (
            <form onSubmit={handleCreate} onClick={e => e.stopPropagation()} style={{ background: 'var(--surface)', border: '1px solid var(--border-hi)', borderRadius: 'var(--r)', padding: '20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 700, fontSize: 13, color: 'var(--ink)' }}>New Collection</div>
              <input autoFocus type="text" placeholder="Collection name…" value={newName} onChange={e => setNewName(e.target.value)}
                style={{ background: 'var(--raised)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--ink)', fontSize: 13, padding: '8px 12px', outline: 'none', fontFamily: 'DM Sans, sans-serif', width: '100%' }} />
              <div style={{ display: 'flex', gap: 8 }}>
                {COLOR_SWATCHES.map(c => (
                  <button key={c} type="button" onClick={() => setNewColor(c)} style={{ width: 22, height: 22, borderRadius: '50%', background: c, border: newColor === c ? '2px solid var(--ink)' : '2px solid transparent', cursor: 'pointer', padding: 0, flexShrink: 0 }} />
                ))}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button type="submit" disabled={!newName.trim()} style={{ flex: 1, background: newName.trim() ? 'var(--accent)' : 'var(--raised)', color: newName.trim() ? '#000' : 'var(--muted)', border: 'none', borderRadius: 8, padding: '7px 0', fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: 12, cursor: newName.trim() ? 'pointer' : 'default' }}>Create</button>
                <button type="button" onClick={() => { setShowNewForm(false); setNewName(''); setNewColor('#69C9D0') }} style={{ background: 'var(--raised)', color: 'var(--muted)', border: '1px solid var(--border)', borderRadius: 8, padding: '7px 14px', fontFamily: 'DM Sans, sans-serif', fontSize: 12, cursor: 'pointer' }}>Cancel</button>
              </div>
            </form>
          )}
        </div>

        {/* Expanded section */}
        {expandedCollection && (
          <div style={{ marginTop: 14, marginBottom: 28, background: 'var(--surface)', border: '1px solid var(--border-hi)', borderRadius: 'var(--r)', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: expandedCollection.color, flexShrink: 0 }} />
              <span style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 700, fontSize: 15, color: 'var(--ink)' }}>{expandedCollection.name}</span>
              <span style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'JetBrains Mono, monospace' }}>{expandedCollection.videoIds.length} video{expandedCollection.videoIds.length !== 1 ? 's' : ''}</span>
              <button onClick={() => setExpandedId(null)} style={{ marginLeft: 'auto', background: 'transparent', border: '1px solid var(--border)', borderRadius: 6, color: 'var(--muted)', cursor: 'pointer', fontSize: 16, width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>×</button>
            </div>
            <div style={{ padding: '20px' }}>
              {expandedCollection.videoIds.length === 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: '40px 20px', textAlign: 'center' }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--border-hi)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                  </svg>
                  <div style={{ fontSize: 13, color: 'var(--label)', lineHeight: 1.5, maxWidth: 320 }}>
                    No videos yet. Open any video's analysis page and use "Add to Collection".
                  </div>
                </div>
              ) : expandedVideos.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', fontSize: 13, color: 'var(--label)' }}>No videos match the selected platforms.</div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
                  {expandedVideos.map((v, i) => <VideoCard key={v.id} video={v} index={i} showAnalysis />)}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
