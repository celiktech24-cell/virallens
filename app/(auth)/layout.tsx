export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--ground)', overflow: 'hidden' }}>

      {/* ── Left branding panel ── */}
      <div style={{
        width: 460, flexShrink: 0,
        background: 'var(--surface)',
        borderRight: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column',
        padding: '44px 48px',
        position: 'relative', overflow: 'hidden',
      }}>

        {/* Dot-grid background */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'radial-gradient(circle, rgba(226,228,239,0.055) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }} />

        {/* Accent glow orbs */}
        <div style={{
          position: 'absolute', bottom: -160, right: -160,
          width: 420, height: 420, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(206,255,94,0.07) 0%, transparent 65%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', top: -80, left: -80,
          width: 280, height: 280, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(52,211,153,0.04) 0%, transparent 65%)',
          pointerEvents: 'none',
        }} />

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 'auto', position: 'relative' }}>
          <div style={{
            width: 32, height: 32, borderRadius: 9,
            background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 12l3.5-4 3 2.5L12 5l2 2" stroke="#000" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 800, fontSize: 20, color: 'var(--ink)', letterSpacing: '-0.4px' }}>
            Viral<span style={{ color: 'var(--accent)' }}>Lens</span>
          </span>
          <span style={{ fontSize: 9, fontWeight: 700, color: 'var(--muted)', letterSpacing: '0.08em', border: '1px solid var(--border)', borderRadius: 4, padding: '1px 5px', marginLeft: 2 }}>BETA</span>
        </div>

        {/* Hero text */}
        <div style={{ marginBottom: 36, position: 'relative' }}>
          <div style={{
            fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 800,
            fontSize: 38, color: 'var(--ink)', lineHeight: 1.08, marginBottom: 14,
            letterSpacing: '-0.5px',
          }}>
            Spot viral content<br />
            <span style={{ color: 'var(--accent)' }}>before</span> everyone<br />
            else does.
          </div>
          <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.75, maxWidth: 320 }}>
            Study hooks, patterns, and scores behind the content that breaks the internet.
          </div>
        </div>

        {/* Mock viral card */}
        <div style={{
          background: 'var(--raised)', border: '1px solid var(--border-hi)',
          borderRadius: 14, padding: '16px 18px', marginBottom: 28, position: 'relative',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#69C9D0' }} />
              <span style={{ fontSize: 11, color: 'var(--label)', fontFamily: 'JetBrains Mono, monospace' }}>@mkbhd</span>
            </div>
            <div style={{
              background: 'var(--accent)', color: '#000',
              fontSize: 11, fontWeight: 800, fontFamily: 'JetBrains Mono, monospace',
              padding: '2px 8px', borderRadius: 6,
            }}>97</div>
          </div>
          <div style={{ fontSize: 12, color: 'var(--ink)', fontWeight: 500, lineHeight: 1.4, marginBottom: 10 }}>
            iPhone 16 Pro Max — The Camera That Changes Everything
          </div>
          <div style={{ display: 'flex', gap: 16 }}>
            {[['12.4M', 'Views'], ['847K', 'Likes'], ['↑ 340%', 'Growth']].map(([val, lbl]) => (
              <div key={lbl}>
                <div style={{ fontSize: 12, fontWeight: 700, color: lbl === 'Growth' ? 'var(--up)' : 'var(--ink)', fontFamily: 'JetBrains Mono, monospace' }}>{val}</div>
                <div style={{ fontSize: 10, color: 'var(--muted)' }}>{lbl}</div>
              </div>
            ))}
          </div>
          {/* Score bar */}
          <div style={{ marginTop: 12, height: 3, background: 'var(--border)', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: '97%', background: 'linear-gradient(90deg, var(--accent), #60A5FA)', borderRadius: 2 }} />
          </div>
        </div>

        {/* Feature list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 32, position: 'relative' }}>
          {[
            { icon: <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M2 12l3.5-4 3 2.5L12 5l2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>, label: 'Trending across TikTok, Instagram & YouTube' },
            { icon: <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.5"/><path d="M8 5v3l2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>, label: 'Real-time viral score + hook analysis' },
            { icon: <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><rect x="2" y="2" width="5" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="9" y="2" width="5" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="2" y="9" width="5" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="9" y="9" width="5" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.5"/></svg>, label: 'Save & organize into smart collections' },
          ].map((f, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 26, height: 26, borderRadius: 7, flexShrink: 0,
                background: 'var(--accent-bg)', border: '1px solid rgba(206,255,94,0.12)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--accent)',
              }}>{f.icon}</div>
              <span style={{ fontSize: 12, color: 'var(--label)', lineHeight: 1.4 }}>{f.label}</span>
            </div>
          ))}
        </div>

        {/* Bottom divider + quote */}
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 20, position: 'relative' }}>
          <div style={{ fontSize: 10, color: 'var(--muted)', fontStyle: 'italic', lineHeight: 1.6 }}>
            "The creators who study virality don't guess — they know."
          </div>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '40px 32px', overflowY: 'auto',
        background: 'var(--ground)',
      }}>
        <div style={{ width: '100%', maxWidth: 400 }}>
          {children}
        </div>
      </div>

    </div>
  )
}
