export default function SettingsPage() {
  return (
    <div style={{ padding: '32px' }}>
      <div style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 700, fontSize: 24, color: 'var(--ink)', marginBottom: 24 }}>Settings</div>
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: '24px', maxWidth: 480 }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', color: 'var(--muted)', marginBottom: 16 }}>MY NICHES</div>
        <div style={{ display: 'flex', gap: 8 }}>
          {['Tech', 'Business', 'Lifestyle'].map(n => (
            <span key={n} style={{
              padding: '5px 14px', borderRadius: 20,
              background: 'var(--accent-bg)', border: '1px solid rgba(206,255,94,0.2)',
              color: 'var(--accent)', fontSize: 12, fontWeight: 600,
            }}>{n}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
