'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/client'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get('next') || '/'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

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

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 14px',
    background: 'var(--raised)', border: '1px solid var(--border)',
    borderRadius: 10, color: 'var(--ink)', fontSize: 13,
    outline: 'none', fontFamily: 'DM Sans, sans-serif',
    transition: 'border-color 150ms',
  }

  return (
    <>
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', color: 'var(--muted)', marginBottom: 8 }}>WELCOME BACK</div>
        <div style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 700, fontSize: 24, color: 'var(--ink)' }}>Sign in to ViralLens</div>
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <label style={{ fontSize: 12, color: 'var(--label)' }}>Password</label>
            <Link href="/forgot-password" style={{ fontSize: 11, color: 'var(--muted)', textDecoration: 'none' }}
              onMouseEnter={e => ((e.target as HTMLElement).style.color = 'var(--label)')}
              onMouseLeave={e => ((e.target as HTMLElement).style.color = 'var(--muted)')}>
              Forgot password?
            </Link>
          </div>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)}
            placeholder="••••••••" required style={inputStyle}
            onFocus={e => (e.target.style.borderColor = 'var(--border-hi)')}
            onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
        </div>

        {status === 'error' && (
          <div style={{ fontSize: 12, color: 'var(--down)', padding: '10px 12px', background: 'rgba(248,113,113,0.08)', borderRadius: 8 }}>
            {errorMsg}
          </div>
        )}

        <button type="submit" disabled={status === 'loading' || !email.trim() || !password}
          style={{
            width: '100%', padding: '11px 0', marginTop: 4,
            background: (email.trim() && password) ? 'var(--accent)' : 'var(--raised)',
            color: (email.trim() && password) ? '#000' : 'var(--muted)',
            border: 'none', borderRadius: 10,
            fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: 13,
            cursor: (email.trim() && password && status !== 'loading') ? 'pointer' : 'default',
            transition: 'background 150ms',
          }}>
          {status === 'loading' ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <div style={{ marginTop: 24, textAlign: 'center', fontSize: 12, color: 'var(--muted)' }}>
        Don't have an account?{' '}
        <Link href="/signup" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>
          Sign up free
        </Link>
      </div>
    </>
  )
}

export default function LoginPage() {
  return <Suspense><LoginForm /></Suspense>
}
