'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirm) { setErrorMsg('Passwords do not match'); setStatus('error'); return }
    if (password.length < 8) { setErrorMsg('Password must be at least 8 characters'); setStatus('error'); return }
    setStatus('loading')
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })
    if (error) { setErrorMsg(error.message); setStatus('error') }
    else { router.push('/') }
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
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', color: 'var(--muted)', marginBottom: 8 }}>NEW PASSWORD</div>
        <div style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 700, fontSize: 24, color: 'var(--ink)', marginBottom: 8 }}>Reset your password</div>
        <div style={{ fontSize: 13, color: 'var(--muted)' }}>Choose a strong password for your account.</div>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <label style={{ display: 'block', fontSize: 12, color: 'var(--label)', marginBottom: 6 }}>New password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)}
            placeholder="Min. 8 characters" required autoFocus style={inputStyle}
            onFocus={e => (e.target.style.borderColor = 'var(--border-hi)')}
            onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
        </div>

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

        <div>
          <label style={{ display: 'block', fontSize: 12, color: 'var(--label)', marginBottom: 6 }}>Confirm password</label>
          <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)}
            placeholder="••••••••" required style={inputStyle}
            onFocus={e => (e.target.style.borderColor = 'var(--border-hi)')}
            onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
        </div>

        {status === 'error' && (
          <div style={{ fontSize: 12, color: 'var(--down)', padding: '10px 12px', background: 'rgba(248,113,113,0.08)', borderRadius: 8 }}>
            {errorMsg}
          </div>
        )}

        <button type="submit" disabled={status === 'loading' || !password || !confirm}
          style={{
            width: '100%', padding: '11px 0', marginTop: 4,
            background: (password && confirm) ? 'var(--accent)' : 'var(--raised)',
            color: (password && confirm) ? '#000' : 'var(--muted)',
            border: 'none', borderRadius: 10,
            fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: 13,
            cursor: (password && confirm && status !== 'loading') ? 'pointer' : 'default',
            transition: 'background 150ms',
          }}>
          {status === 'loading' ? 'Updating…' : 'Set new password'}
        </button>
      </form>
    </>
  )
}
