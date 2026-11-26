'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirm) { setErrorMsg('Passwords do not match'); setStatus('error'); return }
    if (password.length < 8) { setErrorMsg('Password must be at least 8 characters'); setStatus('error'); return }
    setStatus('loading')
    setErrorMsg('')
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email: email.trim(), password,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    })
    if (error) { setErrorMsg(error.message); setStatus('error') }
    else { setStatus('success') }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 14px',
    background: 'var(--raised)', border: '1px solid var(--border)',
    borderRadius: 10, color: 'var(--ink)', fontSize: 13,
    outline: 'none', fontFamily: 'DM Sans, sans-serif',
    transition: 'border-color 150ms',
  }

  if (status === 'success') {
    return (
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 20 }}>📬</div>
        <div style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 700, fontSize: 22, color: 'var(--ink)', marginBottom: 12 }}>Check your inbox</div>
        <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.7, marginBottom: 24 }}>
          We sent a confirmation link to<br />
          <span style={{ color: 'var(--label)', fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }}>{email}</span>
        </div>
        <div style={{ fontSize: 12, color: 'var(--muted)' }}>
          Click the link to activate your account, then{' '}
          <Link href="/login" style={{ color: 'var(--accent)', textDecoration: 'none' }}>sign in</Link>.
        </div>
      </div>
    )
  }

  return (
    <>
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', color: 'var(--muted)', marginBottom: 8 }}>GET STARTED</div>
        <div style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 700, fontSize: 24, color: 'var(--ink)' }}>Create your account</div>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <label style={{ display: 'block', fontSize: 12, color: 'var(--label)', marginBottom: 6 }}>Email address</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com" required autoFocus style={inputStyle}
            onFocus={e => (e.target.style.borderColor = 'var(--border-hi)')}
            onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 12, color: 'var(--label)', marginBottom: 6 }}>Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)}
            placeholder="Min. 8 characters" required style={inputStyle}
            onFocus={e => (e.target.style.borderColor = 'var(--border-hi)')}
            onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 12, color: 'var(--label)', marginBottom: 6 }}>Confirm password</label>
          <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)}
            placeholder="••••••••" required style={inputStyle}
            onFocus={e => (e.target.style.borderColor = 'var(--border-hi)')}
            onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
        </div>

        {/* Password strength indicator */}
        {password.length > 0 && (
          <div style={{ display: 'flex', gap: 4 }}>
            {[1,2,3,4].map(i => (
              <div key={i} style={{
                flex: 1, height: 3, borderRadius: 2,
                background: password.length >= i * 3 ? (password.length >= 12 ? 'var(--up)' : 'var(--accent)') : 'var(--raised)',
                transition: 'background 200ms',
              }} />
            ))}
          </div>
        )}

        {status === 'error' && (
          <div style={{ fontSize: 12, color: 'var(--down)', padding: '10px 12px', background: 'rgba(248,113,113,0.08)', borderRadius: 8 }}>
            {errorMsg}
          </div>
        )}

        <button type="submit" disabled={status === 'loading' || !email.trim() || !password || !confirm}
          style={{
            width: '100%', padding: '11px 0', marginTop: 4,
            background: (email.trim() && password && confirm) ? 'var(--accent)' : 'var(--raised)',
            color: (email.trim() && password && confirm) ? '#000' : 'var(--muted)',
            border: 'none', borderRadius: 10,
            fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: 13,
            cursor: (email.trim() && password && confirm && status !== 'loading') ? 'pointer' : 'default',
            transition: 'background 150ms',
          }}>
          {status === 'loading' ? 'Creating account…' : 'Create account'}
        </button>
      </form>

      <div style={{ marginTop: 24, textAlign: 'center', fontSize: 12, color: 'var(--muted)' }}>
        Already have an account?{' '}
        <Link href="/login" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>
          Sign in
        </Link>
      </div>
    </>
  )
}
