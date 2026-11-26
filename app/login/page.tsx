'use client'
import { useState } from 'react'
import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

function LoginForm() {
  const searchParams = useSearchParams()
  const next = searchParams.get('next') || '/'
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'sent' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setStatus('loading')
    const supabase = createClient()
    const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: redirectTo,
      },
    })
    if (error) {
      setErrorMsg(error.message)
      setStatus('error')
    } else {
      setStatus('sent')
    }
  }

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      minHeight: '100%', padding: '40px 32px',
    }}>
      <div style={{ width: '100%', maxWidth: 400 }}>

        {/* Logo */}
        <div style={{ marginBottom: 36, textAlign: 'center' }}>
          <div style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 800, fontSize: 28, color: 'var(--ink)', letterSpacing: '-0.5px', marginBottom: 8 }}>
            Viral<span style={{ color: 'var(--accent)' }}>Lens</span>
          </div>
          <div style={{ fontSize: 13, color: 'var(--muted)' }}>
            Save and study viral content across your niches
          </div>
        </div>

        {status === 'sent' ? (
          /* Success state */
          <div style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 'var(--r)', padding: '32px 28px', textAlign: 'center',
          }}>
            <div style={{ fontSize: 32, marginBottom: 16 }}>📬</div>
            <div style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 700, fontSize: 17, color: 'var(--ink)', marginBottom: 8 }}>
              Check your inbox
            </div>
            <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6, marginBottom: 24 }}>
              A magic link is on its way to<br />
              <span style={{ color: 'var(--label)', fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }}>{email}</span>
            </div>
            <button
              onClick={() => { setStatus('idle'); setEmail('') }}
              style={{
                fontSize: 12, color: 'var(--muted)', background: 'transparent',
                border: 'none', cursor: 'pointer', textDecoration: 'underline',
              }}
            >
              Use a different email
            </button>
          </div>
        ) : (
          /* Login form */
          <div style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 'var(--r)', padding: '32px 28px',
          }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', color: 'var(--muted)', marginBottom: 20 }}>SIGN IN</div>
            <form onSubmit={handleSubmit}>
              <label style={{ display: 'block', fontSize: 12, color: 'var(--label)', marginBottom: 6 }}>
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoFocus
                style={{
                  width: '100%', padding: '10px 14px',
                  background: 'var(--raised)', border: '1px solid var(--border)',
                  borderRadius: 10, color: 'var(--ink)', fontSize: 13,
                  outline: 'none', marginBottom: 16,
                  fontFamily: 'DM Sans, sans-serif',
                  transition: 'border-color 150ms',
                }}
                onFocus={e => (e.target.style.borderColor = 'var(--border-hi)')}
                onBlur={e => (e.target.style.borderColor = 'var(--border)')}
              />

              {status === 'error' && (
                <div style={{
                  fontSize: 12, color: 'var(--down)',
                  marginBottom: 12, padding: '8px 12px',
                  background: 'rgba(248,113,113,0.08)', borderRadius: 8,
                }}>
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={status === 'loading' || !email.trim()}
                style={{
                  width: '100%', padding: '11px 0',
                  background: email.trim() ? 'var(--accent)' : 'var(--raised)',
                  color: email.trim() ? '#000' : 'var(--muted)',
                  border: 'none', borderRadius: 10,
                  fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: 13,
                  cursor: email.trim() && status !== 'loading' ? 'pointer' : 'default',
                  transition: 'background 150ms',
                }}
              >
                {status === 'loading' ? 'Sending…' : 'Send Magic Link'}
              </button>
            </form>

            <div style={{ marginTop: 20, textAlign: 'center', fontSize: 11, color: 'var(--muted)' }}>
              No password needed — we'll email you a one-click sign-in link.
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
