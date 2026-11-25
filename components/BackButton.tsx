'use client'
import { useRouter } from 'next/navigation'

export default function BackButton() {
  const router = useRouter()
  return (
    <button
      onClick={() => router.back()}
      style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '6px 14px', borderRadius: 20,
        border: '1px solid var(--border)', background: 'transparent',
        color: 'var(--label)', fontSize: 12, cursor: 'pointer',
      }}
    >
      ← Back
    </button>
  )
}
