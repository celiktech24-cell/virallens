'use client'
import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

function Spinner() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ animation: 'spin 0.7s linear infinite' }}>
      <circle cx="8" cy="8" r="6" stroke="rgba(0,0,0,0.2)" strokeWidth="2"/>
      <path d="M8 2a6 6 0 0 1 6 6" stroke="#000" strokeWidth="2" strokeLinecap="round"/>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </svg>
  )
}

export default function ForgotPasswordPage() {
  const [email, setEmail]       = useState('')
  const [status, setStatus]     = useState<'idle' | 'loading' | 'sent' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [focused, setFocused]   = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    })
    if (error) { setErrorMsg(error.message); setStatus('error') }
    else { setStatus('sent') }
  }

  const isReady = email.trim() && status !== 'loading'

  // ── Sent state ──
  if (status === 'sent') {
    return (
      <div style={{ textAlign: 'center' }}>
        {/* Icon */}
        <div style={{
          width: 64, height: 64, borderRadius: '50%', margin: '0 auto 24px',
          background: 'var(--accent-bg)', border: '1px solid rgba(206,255,94,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Z" stroke="var(--accent)" strokeWidth="1.5"/>
            <path d="M2 7l10 7 10-7" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <div style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 800, fontSize: 24, color: 'var(--ink)', marginBottom: 10, letterSpacing: '-0.3px' }}>
          Check your inbox
        </div>
        <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.75, marginBottom: 10 }}>
          We sent a password reset link to
        </div>
        <div style={{
          display: 'inline-block', margin: '0 auto 24px',
          background: 'var(--raised)', border: '1px solid var(--border)',
          borderRadius: 8, padding: '6px 14px',
          fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'var(--label)',
        }}>{email}</div>

        {/* Steps */}
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 12, padding: '16px 20px', marginBottom: 24, textAlign: 'left',
        }}>
          {[
            'Open the email from ViralLens',
            'Click "Reset password"',
            'Choose a new password',
          ].map((step, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '6px 0', borderBottom: i < 2 ? '1px solid var(--border)' : 'none' }}>
              <div style={{
                width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                background: 'var(--raised)', border: '1px solid var(--border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 10, fontWeight: 700, fontFamily: 'JetBrains Mono, monospace', color: 'var(--accent)',
              }}>{i + 1}</div>
              <span style={{ fontSize: 12, color: 'var(--label)' }}>{step}</span>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
          <button
            onClick={() => { setStatus('idle'); setEmail('') }}
            style={{
              fontSize: 12, color: 'var(--muted)', background: 'transparent',
              border: 'none', cursor: 'pointer', textDecoration: 'none',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--label)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}
          >
            Use a different email
          </button>
          <Link href="/login" style={{ fontSize: 12, color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}
            onMouseEnter={e => ((e.target as HTMLElement).style.opacity = '0.8')}
            onMouseLeave={e => ((e.target as HTMLElement).style.opacity = '1')}>
            ← Back to sign in
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Header */}
      <div style={{ marginBottom: 36 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)' }} />
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', color: 'var(--muted)', fontFamily: 'JetBrains Mono, monospace' }}>ACCOUNT RECOVERY</span>
        </div>
        <div style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 800, fontSize: 28, color: 'var(--ink)', letterSpacing: '-0.4px', lineHeight: 1.1, marginBottom: 10 }}>
          Forgot your<br />password?
        </div>
        <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.65 }}>
          No worries — enter your email and we'll send you a reset link instantly.
        </div>
      </div>

      {/* Form card */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '28px 28px 24px' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--label)', marginBottom: 7, letterSpacing: '0.02em' }}>
              Email address
            </label>
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)',
                color: focused ? 'var(--accent)' : 'var(--muted)',
                pointerEvents: 'none', transition: 'color 150ms',
              }}>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <rect x="2" y="4" width="12" height="9" rx="2" stroke="currentColor" strokeWidth="1.4"/>
                  <path d="M2 6l6 4 6-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com" required autoFocus
                style={{
                  width: '100%', padding: '11px 14px 11px 36px',
                  background: 'var(--raised)', border: '1px solid var(--border)',
                  borderRadius: 10, color: 'var(--ink)', fontSize: 13,
                  outline: 'none', fontFamily: 'DM Sans, sans-serif',
                  transition: 'border-color 150ms, box-shadow 150ms',
                  ...(focused ? { borderColor: 'var(--border-hi)', boxShadow: '0 0 0 3px rgba(206,255,94,0.06)' } : {}),
                }}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
              />
            </div>
          </div>

          {/* Error */}
          {status === 'error' && (
            <div style={{
              display: 'flex', alignItems: 'flex-start', gap: 8,
              fontSize: 12, color: 'var(--down)',
              padding: '10px 12px', background: 'rgba(248,113,113,0.07)',
              border: '1px solid rgba(248,113,113,0.15)', borderRadius: 9,
            }}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
                <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.4"/>
                <path d="M8 5v3M8 11v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              {errorMsg}
            </div>
          )}

          {/* Submit */}
          <button type="submit" disabled={!isReady}
            style={{
              width: '100%', padding: '12px 0', marginTop: 2,
              background: isReady ? 'var(--accent)' : 'var(--raised)',
              color: isReady ? '#000' : 'var(--muted)',
              border: 'none', borderRadius: 10,
              fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: 13,
              cursor: isReady ? 'pointer' : 'default',
              transition: 'background 150ms, transform 80ms',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}
            onMouseDown={e => { if (isReady) (e.currentTarget.style.transform = 'scale(0.98)') }}
            onMouseUp={e => { (e.currentTarget.style.transform = 'scale(1)') }}
          >
            {status === 'loading' ? (
              <><Spinner /> Sending…</>
            ) : (
              <>
                Send reset link
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Footer */}
      <div style={{ marginTop: 20, textAlign: 'center' }}>
        <Link href="/login" style={{ fontSize: 12, color: 'var(--muted)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 5 }}
          onMouseEnter={e => ((e.target as HTMLElement).style.color = 'var(--label)')}
          onMouseLeave={e => ((e.target as HTMLElement).style.color = 'var(--muted)')}>
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
            <path d="M13 8H3M7 4L3 8l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back to sign in
        </Link>
      </div>
    </>
  )
}
