'use client'
import { useState } from 'react'
import { Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
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

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get('next') || '/'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [focusedField, setFocusedField] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
    if (error) {
      setErrorMsg(error.message)
      setStatus('error')
    } else {
      router.push(next)
      router.refresh()
    }
  }

  const fieldBase: React.CSSProperties = {
    width: '100%', padding: '11px 14px',
    background: 'var(--raised)',
    border: '1px solid var(--border)',
    borderRadius: 10, color: 'var(--ink)', fontSize: 13,
    outline: 'none', fontFamily: 'DM Sans, sans-serif',
    transition: 'border-color 150ms, box-shadow 150ms',
  }
  const fieldFocused: React.CSSProperties = {
    borderColor: 'var(--border-hi)',
    boxShadow: '0 0 0 3px rgba(206,255,94,0.06)',
  }

  const isReady = email.trim() && password && status !== 'loading'

  return (
    <>
      {/* Header */}
      <div style={{ marginBottom: 36 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)' }} />
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', color: 'var(--muted)', fontFamily: 'JetBrains Mono, monospace' }}>WELCOME BACK</span>
        </div>
        <div style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 800, fontSize: 28, color: 'var(--ink)', letterSpacing: '-0.4px', lineHeight: 1.1 }}>
          Sign in to<br />your account
        </div>
      </div>

      {/* Form card */}
      <div style={{
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 16, padding: '28px 28px 24px',
      }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Email */}
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--label)', marginBottom: 7, letterSpacing: '0.02em' }}>
              Email address
            </label>
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)',
                color: focusedField === 'email' ? 'var(--accent)' : 'var(--muted)',
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
                style={{ ...fieldBase, paddingLeft: 36, ...(focusedField === 'email' ? fieldFocused : {}) }}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--label)', letterSpacing: '0.02em' }}>Password</label>
              <Link href="/forgot-password" style={{
                fontSize: 11, color: 'var(--muted)', textDecoration: 'none',
                transition: 'color 150ms',
              }}
                onMouseEnter={e => ((e.target as HTMLElement).style.color = 'var(--accent)')}
                onMouseLeave={e => ((e.target as HTMLElement).style.color = 'var(--muted)')}>
                Forgot password?
              </Link>
            </div>
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)',
                color: focusedField === 'password' ? 'var(--accent)' : 'var(--muted)',
                pointerEvents: 'none', transition: 'color 150ms',
              }}>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <rect x="4" y="7" width="8" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
                  <path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                </svg>
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password} onChange={e => setPassword(e.target.value)}
                placeholder="Enter your password" required
                style={{ ...fieldBase, paddingLeft: 36, paddingRight: 40, ...(focusedField === 'password' ? fieldFocused : {}) }}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                style={{
                  position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                  background: 'transparent', border: 'none', cursor: 'pointer', padding: 2,
                  color: showPassword ? 'var(--accent)' : 'var(--muted)',
                  transition: 'color 150ms', display: 'flex', alignItems: 'center',
                }}
              >
                <EyeIcon open={showPassword} />
              </button>
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
          <button
            type="submit"
            disabled={!isReady}
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
              <><Spinner /> Signing in…</>
            ) : (
              <>
                Sign in
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
        Don't have an account?{' '}
        <Link href="/signup" style={{
          color: 'var(--accent)', textDecoration: 'none', fontWeight: 600,
          transition: 'opacity 150ms',
        }}
          onMouseEnter={e => ((e.target as HTMLElement).style.opacity = '0.8')}
          onMouseLeave={e => ((e.target as HTMLElement).style.opacity = '1')}>
          Create one free →
        </Link>
      </div>
    </>
  )
}

export default function LoginPage() {
  return <Suspense><LoginForm /></Suspense>
}
