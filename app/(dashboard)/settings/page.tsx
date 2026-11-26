'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/components/AuthProvider'

export default function SettingsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [signingOut, setSigningOut] = useState(false)

  const handleSignOut = async () => {
    setSigningOut(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  const card: React.CSSProperties = {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--r)',
    padding: '24px 28px',
    maxWidth: 520,
    marginBottom: 16,
  }

  return (
    <div style={{ padding: '32px' }}>
      <div style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 800, fontSize: 24, color: 'var(--ink)', marginBottom: 28, letterSpacing: '-0.3px' }}>Settings</div>

      {/* Account */}
      <div style={card}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', color: 'var(--muted)', marginBottom: 16 }}>ACCOUNT</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
          <div style={{
            width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
            background: 'var(--accent-bg)', border: '1px solid rgba(206,255,94,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 800, fontSize: 18, color: 'var(--accent)',
          }}>
            {user?.email?.[0]?.toUpperCase() ?? '?'}
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)', marginBottom: 2 }}>{user?.email ?? '—'}</div>
            <div style={{ fontSize: 11, color: 'var(--muted)' }}>Free plan · ViralLens</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={handleSignOut}
            disabled={signingOut}
            style={{
              padding: '8px 20px', borderRadius: 20,
              background: signingOut ? 'var(--raised)' : 'rgba(248,113,113,0.1)',
              border: '1px solid rgba(248,113,113,0.2)',
              color: signingOut ? 'var(--muted)' : 'var(--down)',
              fontSize: 12, fontWeight: 600, cursor: signingOut ? 'default' : 'pointer',
              transition: 'all 150ms',
            }}
          >
            {signingOut ? 'Signing out…' : 'Sign out'}
          </button>
          <button
            onClick={() => router.push('/forgot-password')}
            style={{
              padding: '8px 20px', borderRadius: 20,
              background: 'var(--raised)', border: '1px solid var(--border)',
              color: 'var(--label)', fontSize: 12, fontWeight: 600, cursor: 'pointer',
            }}
          >
            Change password
          </button>
        </div>
      </div>

      {/* Niche preferences */}
      <div style={card}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', color: 'var(--muted)', marginBottom: 12 }}>TRACKED NICHES</div>
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

      {/* App info */}
      <div style={{ maxWidth: 520, padding: '0 4px' }}>
        <div style={{ fontSize: 11, color: 'var(--muted)', display: 'flex', gap: 16 }}>
          <span>ViralLens v0.1</span>
          <span>·</span>
          <span>Powered by ScrapeCreators</span>
        </div>
      </div>
    </div>
  )
}
