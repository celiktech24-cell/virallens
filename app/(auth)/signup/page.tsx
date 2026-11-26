'use client'
import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5Z" stroke="currentColor" strokeWidth="1.4"/>
      <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.4"/>
    </svg>
  ) : (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5Z" stroke="currentColor" strokeWidth="1.4"/>
      <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.4"/>
      <path d="M2 2l12 12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  )
}

function Spinner() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ animation: 'spin 0.7s linear infinite' }}>
      <circle cx="8" cy="8" r="6" stroke="rgba(0,0,0,0.2)" strokeWidth="2"/>
      <path d="M8 2a6 6 0 0 1 6 6" stroke="#000" strokeWidth="2" strokeLinecap="round"/>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </svg>
  )
}

function getStrength(pw: string): { level: number; label: string; color: string } {
  if (pw.length === 0) return { level: 0, label: '', color: '' }
  if (pw.length < 6)   return { level: 1, label: 'Weak',   color: 'var(--down)' }
  if (pw.length < 10)  return { level: 2, label: 'Fair',   color: '#F59E0B' }
  if (pw.length < 14)  return { level: 3, label: 'Good',   color: 'var(--accent)' }
  return                      { level: 4, label: 'Strong', color: 'var(--up)' }
}

export default function SignupPage() {
  const [email, setEmail]           = useState('')
  const [password, setPassword]     = useState('')
  const [confirm, setConfirm]       = useState('')
  const [showPw, setShowPw]         = useState(false)
  const [showCf, setShowCf]         = useState(false)
  const [status, setStatus]         = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg]     = useState('')
  const [focused, setFocused]       = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirm) { setErrorMsg('Passwords do not match'); setStatus('error'); return }
    if (password.length < 8)  { setErrorMsg('Password must be at least 8 characters'); setStatus('error'); return }
    setStatus('loading'); setErrorMsg('')
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email: email.trim(), password,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    })
    if (error) { setErrorMsg(error.message); setStatus('error') }
    else { setStatus('success') }
  }

  const strength = getStrength(password)
  const passwordsMatch = confirm.length > 0 && password === confirm
  const isReady = email.trim() && password && confirm && status !== 'loading'

  const fieldBase: React.CSSProperties = {
    width: '100%', padding: '11px 14px',
    background: 'var(--raised)', border: '1px solid var(--border)',
    borderRadius: 10, color: 'var(--ink)', fontSize: 13,
    outline: 'none', fontFamily: 'DM Sans, sans-serif',
    transition: 'border-color 150ms, box-shadow 150ms',
  }
  const fieldFocused: React.CSSProperties = {
    borderColor: 'var(--border-hi)',
    boxShadow: '0 0 0 3px rgba(206,255,94,0.06)',
  }

  // ── Success state ──
  if (status === 'success') {
    return (
      <div style={{ textAlign: 'center' }}>
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
        <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.75, marginBottom: 8 }}>
          We sent a confirmation link to
        </div>
        <div style={{
          display: 'inline-block', margin: '0 auto 24px',
          background: 'var(--raised)', border: '1px solid var(--border)',
          borderRadius: 8, padding: '6px 14px',
          fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'var(--label)',
        }}>{email}</div>
        <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.7 }}>
          Click the link to activate your account,<br />then{' '}
          <Link href="/login" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>sign in here →</Link>
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
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', color: 'var(--muted)', fontFamily: 'JetBrains Mono, monospace' }}>GET STARTED</span>
        </div>
        <div style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 800, fontSize: 28, color: 'var(--ink)', letterSpacing: '-0.4px', lineHeight: 1.1 }}>
          Create your<br />account
        </div>
      </div>

      {/* Form card */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '28px 28px 24px' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Email */}
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--label)', marginBottom: 7, letterSpacing: '0.02em' }}>
              Email address
            </label>
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)',
                color: focused === 'email' ? 'var(--accent)' : 'var(--muted)',
                pointerEvents: 'none', transition: 'color 150ms',
              }}>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <rect x="2" y="4" width="12" height="9" rx="2" stroke="currentColor" strokeWidth="1.4"/>
                  <path d="M2 6l6 4 6-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com" required autoFocus
                style={{ ...fieldBase, paddingLeft: 36, ...(focused === 'email' ? fieldFocused : {}) }}
                onFocus={() => setFocused('email')} onBlur={() => setFocused(null)} />
            </div>
          </div>

          {/* Password */}
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--label)', marginBottom: 7, letterSpacing: '0.02em' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)',
                color: focused === 'password' ? 'var(--accent)' : 'var(--muted)',
                pointerEvents: 'none', transition: 'color 150ms',
              }}>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <rect x="4" y="7" width="8" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
                  <path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                </svg>
              </div>
              <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                placeholder="Min. 8 characters" required
                style={{ ...fieldBase, paddingLeft: 36, paddingRight: 40, ...(focused === 'password' ? fieldFocused : {}) }}
                onFocus={() => setFocused('password')} onBlur={() => setFocused(null)} />
              <button type="button" onClick={() => setShowPw(v => !v)} style={{
                position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                background: 'transparent', border: 'none', cursor: 'pointer', padding: 2,
                color: showPw ? 'var(--accent)' : 'var(--muted)', transition: 'color 150ms',
                display: 'flex', alignItems: 'center',
              }}>
                <EyeIcon open={showPw} />
              </button>
            </div>

            {/* Strength bar */}
            {password.length > 0 && (
              <div style={{ marginTop: 8 }}>
                <div style={{ display: 'flex', gap: 4, marginBottom: 5 }}>
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} style={{
                      flex: 1, height: 3, borderRadius: 2,
                      background: strength.level >= i ? strength.color : 'var(--raised)',
                      transition: 'background 200ms',
                    }} />
                  ))}
                </div>
                <div style={{ fontSize: 10, color: strength.color, fontFamily: 'JetBrains Mono, monospace', fontWeight: 600 }}>
                  {strength.label}
                </div>
              </div>
            )}
          </div>

          {/* Confirm password */}
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--label)', marginBottom: 7, letterSpacing: '0.02em' }}>
              Confirm password
            </label>
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)',
                color: focused === 'confirm' ? 'var(--accent)' : 'var(--muted)',
                pointerEvents: 'none', transition: 'color 150ms',
              }}>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <rect x="4" y="7" width="8" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
                  <path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                </svg>
              </div>
              <input type={showCf ? 'text' : 'password'} value={confirm} onChange={e => setConfirm(e.target.value)}
                placeholder="Re-enter password" required
                style={{
                  ...fieldBase, paddingLeft: 36, paddingRight: 40,
                  ...(focused === 'confirm' ? fieldFocused : {}),
                  ...(confirm.length > 0 ? { borderColor: passwordsMatch ? 'rgba(52,211,153,0.4)' : 'rgba(248,113,113,0.4)' } : {}),
                }}
                onFocus={() => setFocused('confirm')} onBlur={() => setFocused(null)} />
              {/* Show/hide */}
              <button type="button" onClick={() => setShowCf(v => !v)} style={{
                position: 'absolute', right: confirm.length > 0 ? 36 : 12, top: '50%', transform: 'translateY(-50%)',
                background: 'transparent', border: 'none', cursor: 'pointer', padding: 2,
                color: showCf ? 'var(--accent)' : 'var(--muted)', transition: 'color 150ms',
                display: 'flex', alignItems: 'center',
              }}>
                <EyeIcon open={showCf} />
              </button>
              {/* Match indicator */}
              {confirm.length > 0 && (
                <div style={{
                  position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                  color: passwordsMatch ? 'var(--up)' : 'var(--down)',
                }}>
                  {passwordsMatch ? (
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.4"/>
                      <path d="M5 8l2 2 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.4"/>
                      <path d="M6 6l4 4M10 6l-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                    </svg>
                  )}
                </div>
              )}
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
              <><Spinner /> Creating account…</>
            ) : (
              <>
                Create account
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Footer */}
      <div style={{ marginTop: 20, textAlign: 'center', fontSize: 12, color: 'var(--muted)' }}>
        Already have an account?{' '}
        <Link href="/login" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}
          onMouseEnter={e => ((e.target as HTMLElement).style.opacity = '0.8')}
          onMouseLeave={e => ((e.target as HTMLElement).style.opacity = '1')}>
          Sign in →
        </Link>
      </div>
    </>
  )
}
