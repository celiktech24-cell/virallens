'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/AuthProvider'
import { createClient } from '@/lib/supabase/client'
import { getCollectionsWithVideos, addVideoToDbCollection, seedBuiltInCollections, type DbCollection } from '@/lib/supabase/db'

export default function AddToCollection({ videoId }: { videoId: string }) {
  const { user } = useAuth()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [collections, setCollections] = useState<DbCollection[]>([])
  const [added, setAdded] = useState<string | null>(null)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!user || !open) return
    const supabase = createClient()
    getCollectionsWithVideos(supabase).then(setCollections)
  }, [user, open])

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!user) { router.push('/login'); return }
    setOpen(o => !o)
  }

  const handleAdd = async (col: DbCollection, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (col.videoIds.includes(videoId)) return
    const supabase = createClient()
    await addVideoToDbCollection(supabase, col.id, videoId)
    setAdded(col.id)
    setCollections(prev => prev.map(c => c.id === col.id ? { ...c, videoIds: [...c.videoIds, videoId] } : c))
    setTimeout(() => { setAdded(null); setOpen(false) }, 800)
  }

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={handleToggle}
        style={{
          padding: '8px 20px', borderRadius: 20,
          border: `1px solid ${open ? 'var(--border-hi)' : 'var(--border)'}`,
          background: open ? 'var(--raised)' : 'transparent',
          color: 'var(--label)', fontSize: 12, fontWeight: 500,
          cursor: 'pointer', transition: 'all 150ms',
          display: 'flex', alignItems: 'center', gap: 6,
        }}
      >
        <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
          <rect x="2" y="2" width="5" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
          <rect x="9" y="2" width="5" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
          <rect x="2" y="9" width="5" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
          <rect x="9" y="9" width="5" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
        </svg>
        Add to Collection
      </button>

      {open && (
        <div style={{
          position: 'absolute', bottom: '110%', right: 0,
          background: 'var(--surface)', border: '1px solid var(--border-hi)',
          borderRadius: 10, padding: '6px', minWidth: 190,
          zIndex: 50, boxShadow: 'var(--lift)',
        }}>
          {collections.length === 0 && (
            <div style={{ padding: '10px 12px', fontSize: 12, color: 'var(--muted)' }}>
              No collections yet — go to Collections to create one.
            </div>
          )}
          {collections.map(col => {
            const inCollection = col.videoIds.includes(videoId)
            const justAdded = added === col.id
            return (
              <button
                key={col.id}
                onClick={e => handleAdd(col, e)}
                disabled={inCollection}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  width: '100%', padding: '8px 12px', borderRadius: 7,
                  border: 'none', background: justAdded ? 'var(--accent-bg)' : 'transparent',
                  color: inCollection ? 'var(--muted)' : 'var(--ink)',
                  fontSize: 12, cursor: inCollection ? 'default' : 'pointer',
                  textAlign: 'left', transition: 'background 100ms',
                }}
                onMouseEnter={e => { if (!inCollection) (e.currentTarget as HTMLButtonElement).style.background = 'var(--raised)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = justAdded ? 'var(--accent-bg)' : 'transparent' }}
              >
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: col.color, flexShrink: 0 }} />
                <span style={{ flex: 1 }}>{col.name}</span>
                {inCollection && <span style={{ fontSize: 10, color: 'var(--accent)', fontFamily: 'JetBrains Mono, monospace' }}>✓</span>}
                {justAdded && <span style={{ fontSize: 10, color: 'var(--accent)' }}>Added!</span>}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
