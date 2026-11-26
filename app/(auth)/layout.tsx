export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--ground)' }}>
      {/* Left branding panel */}
      <div style={{
        width: 420, flexShrink: 0,
        background: 'var(--surface)',
        borderRight: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column',
        padding: '48px 48px',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 'auto' }}>
          <span style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 800, fontSize: 22, color: 'var(--ink)', letterSpacing: '-0.5px' }}>
            Viral<span style={{ color: 'var(--accent)' }}>Lens</span>
          </span>
          <span style={{ fontSize: 9, fontWeight: 700, color: 'var(--muted)', letterSpacing: '0.08em', border: '1px solid var(--border)', borderRadius: 4, padding: '1px 4px' }}>BETA</span>
        </div>

        {/* Center content */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 800, fontSize: 36, color: 'var(--ink)', lineHeight: 1.1, marginBottom: 16 }}>
            Viral content<br />
            <span style={{ color: 'var(--accent)' }}>intelligence</span><br />
            for creators.
          </div>
          <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.7, marginBottom: 32 }}>
            Spot what's going viral before everyone else. Study the hooks, patterns, and creators behind viral content.
          </div>

          {/* Feature list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { icon: '↗', label: 'Trending content across TikTok, Instagram & YouTube' },
              { icon: '◎', label: 'Viral score analysis — know what works and why' },
              { icon: '⊞', label: 'Save & organize into collections by niche' },
            ].map(f => (
              <div key={f.label} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <span style={{ fontSize: 11, color: 'var(--accent)', fontFamily: 'JetBrains Mono, monospace', marginTop: 1, flexShrink: 0 }}>{f.icon}</span>
                <span style={{ fontSize: 12, color: 'var(--label)', lineHeight: 1.5 }}>{f.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom quote */}
        <div style={{ fontSize: 11, color: 'var(--muted)', fontStyle: 'italic', borderTop: '1px solid var(--border)', paddingTop: 20 }}>
          "The best time to study viral content was yesterday. The second best time is now."
        </div>

        {/* Background accent orb */}
        <div style={{
          position: 'absolute', bottom: -120, right: -120,
          width: 320, height: 320, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(206,255,94,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
      </div>

      {/* Right form panel */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '40px 32px', overflowY: 'auto',
      }}>
        <div style={{ width: '100%', maxWidth: 400 }}>
          {children}
        </div>
      </div>
    </div>
  )
}
