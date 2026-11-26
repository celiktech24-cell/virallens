'use client'
import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'sent' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

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

  if (status === 'sent') {
    return (
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 20 }}>📩</div>
        <div style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 700, fontSize: 22, color: 'var(--ink)', marginBottom: 12 }}>Reset link sent</div>
        <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.7, marginBottom: 24 }}>
          Check your inbox at<br />
          <span style={{ color: 'var(--label)', fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }}>{email}</span><br />
          and click the link to reset your password.
        </div>
        <Link href="/login" style={{ fontSize: 12, color: 'var(--accent)', textDecoration: 'none' }}>← Back to sign in</Link>
      </div>
    )
  }

  return (
    <>
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', color: 'var(--muted)', marginBottom: 8 }}>ACCOUNT RECOVERY</div>
        <div style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 700, fontSize: 24, color: 'var(--ink)', marginBottom: 8 }}>Forgot your password?</div>
        <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6 }}>
          No worries. Enter your email and we'll send you a reset link.
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <label style={{ display: 'block', fontSize: 12, color: 'var(--label)', marginBottom: 6 }}>Email address</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com" required autoFocus
            style={{
              width: '100%', padding: '10px 14px',
              background: 'var(--raised)', border: '1px solid var(--border)',
              borderRadius: 10, color: 'var(--ink)', fontSize: 13,
              outline: 'none', fontFamily: 'DM Sans, sans-serif',
              transition: 'border-color 150ms',
            }}
            onFocus={e => (e.target.style.borderColor = 'var(--border-hi)')}
            onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
        </div>

        {status === 'error' && (
          <div style={{ fontSize: 12, color: 'var(--down)', padding: '10px 12px', background: 'rgba(248,113,113,0.08)', borderRadius: 8 }}>
            {errorMsg}
          </div>
        )}

        <button type="submit" disabled={status === 'loading' || !email.trim()}
          style={{
            width: '100%', padding: '11px 0', marginTop: 4,
            background: email.trim() ? 'var(--accent)' : 'var(--raised)',
            color: email.trim() ? '#000' : 'var(--muted)',
            border: 'none', borderRadius: 10,
            fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: 13,
            cursor: (email.trim() && status !== 'loading') ? 'pointer' : 'default',
            transition: 'background 150ms',
          }}>
          {status === 'loading' ? 'Sending…' : 'Send reset link'}
        </button>
      </form>

      <div style={{ marginTop: 24, textAlign: 'center' }}>
        <Link href="/login" style={{ fontSize: 12, color: 'var(--muted)', textDecoration: 'none' }}>← Back to sign in</Link>
      </div>
    </>
  )
}
