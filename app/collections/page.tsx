import Link from 'next/link'

const COLLECTIONS = [
  { name: 'AI Tools', count: 8, niche: 'Tech', color: '#69C9D0' },
  { name: 'Side Hustle', count: 6, niche: 'Business', color: '#CEFF5E' },
  { name: 'Morning Routines', count: 4, niche: 'Lifestyle', color: '#E1306C' },
]

export default function CollectionsPage() {
  return (
    <div style={{ padding: '24px 32px' }}>
      <div style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 700, fontSize: 24, color: 'var(--ink)', marginBottom: 24 }}>
        Collections
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
        {COLLECTIONS.map(c => (
          <div key={c.name} style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 'var(--r)', padding: '24px',
            cursor: 'pointer',
          }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: c.color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: c.color }} />
            </div>
            <div style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 700, fontSize: 15, color: 'var(--ink)', marginBottom: 4 }}>{c.name}</div>
            <div style={{ fontSize: 11, color: 'var(--muted)' }}>{c.count} videos · {c.niche}</div>
          </div>
        ))}
        <div style={{
          background: 'transparent', border: '1px dashed var(--border)',
          borderRadius: 'var(--r)', padding: '24px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', color: 'var(--muted)', fontSize: 13,
        }}>
          + New Collection
        </div>
      </div>
    </div>
  )
}
