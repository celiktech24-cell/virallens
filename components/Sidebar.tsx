'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { getSavedIds, onSavedChange } from '@/lib/saved-store'

const NAV_BASE = [
  { href: '/',        label: 'Trending',    staticCount: 247 as number | null, icon: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 12l3.5-4 3 2.5L12 5l2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
  )},
  { href: '/search',  label: 'Search',      staticCount: null, icon: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5"/><path d="M11 11l2.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
  )},
  { href: '/saved',   label: 'Saved',       staticCount: null, icon: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 2h8a1 1 0 0 1 1 1v10l-5-3-5 3V3a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>
  )},
  { href: '/collections', label: 'Collections', staticCount: 3 as number | null, icon: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="2" width="5" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="9" y="2" width="5" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="2" y="9" width="5" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="9" y="9" width="5" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.5"/></svg>
  )},
]

const TOOLS = [
  { href: '/analytics', label: 'Analytics', icon: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="9" width="3" height="5" rx="1" stroke="currentColor" strokeWidth="1.5"/><rect x="6.5" y="5" width="3" height="9" rx="1" stroke="currentColor" strokeWidth="1.5"/><rect x="11" y="2" width="3" height="12" rx="1" stroke="currentColor" strokeWidth="1.5"/></svg>
  )},
  { href: '/settings',  label: 'Settings', icon: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.5"/><path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.05 3.05l1.41 1.41M11.54 11.54l1.41 1.41M3.05 12.95l1.41-1.41M11.54 4.46l1.41-1.41" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
  )},
]

export default function Sidebar() {
  const path = usePathname()
  const [savedCount, setSavedCount] = useState(0)

  useEffect(() => {
    setSavedCount(getSavedIds().length)
    return onSavedChange(() => setSavedCount(getSavedIds().length))
  }, [])

  const NAV = NAV_BASE.map(item =>
    item.href === '/saved'
      ? { ...item, count: savedCount || null }
      : { ...item, count: item.staticCount }
  )

  return (
    <aside style={{
      width: 232,
      flexShrink: 0,
      background: 'var(--surface)',
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      padding: '20px 12px',
      gap: 0,
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, padding: '8px 12px', marginBottom: 32 }}>
        <span style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 800, fontSize: 18, color: 'var(--ink)', letterSpacing: '-0.5px' }}>
          Viral<span style={{ color: 'var(--accent)' }}>Lens</span>
        </span>
        <span style={{ fontSize: 9, fontWeight: 700, color: 'var(--muted)', letterSpacing: '0.08em', border: '1px solid var(--border)', borderRadius: 4, padding: '1px 4px' }}>BETA</span>
      </div>

      {/* Discover section */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', color: 'var(--muted)', padding: '0 12px', marginBottom: 4 }}>DISCOVER</div>
        {NAV.map(item => {
          const active = path === item.href
          return (
            <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '7px 12px',
                borderRadius: 10,
                marginBottom: 1,
                background: active ? 'var(--raised)' : 'transparent',
                color: active ? 'var(--ink)' : 'var(--label)',
                fontWeight: active ? 500 : 400,
                fontSize: 13,
                transition: 'background 150ms, color 150ms',
                cursor: 'pointer',
              }}>
                <span style={{ color: active ? 'var(--accent)' : 'var(--muted)' }}>{item.icon}</span>
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.count && (
                  <span style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'JetBrains Mono, monospace' }}>{item.count}</span>
                )}
              </div>
            </Link>
          )
        })}
      </div>

      {/* Tools section */}
      <div style={{ marginBottom: 'auto' }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', color: 'var(--muted)', padding: '0 12px', marginBottom: 4 }}>TOOLS</div>
        {TOOLS.map(item => {
          const active = path === item.href
          return (
            <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '7px 12px',
                borderRadius: 10,
                marginBottom: 1,
                background: active ? 'var(--raised)' : 'transparent',
                color: active ? 'var(--ink)' : 'var(--label)',
                fontWeight: active ? 500 : 400,
                fontSize: 13,
                transition: 'background 150ms, color 150ms',
                cursor: 'pointer',
              }}>
                <span style={{ color: active ? 'var(--accent)' : 'var(--muted)' }}>{item.icon}</span>
                <span>{item.label}</span>
              </div>
            </Link>
          )
        })}
      </div>

      {/* My Niches */}
      <div style={{ padding: '0 12px', borderTop: '1px solid var(--border)', paddingTop: 16 }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', color: 'var(--muted)', marginBottom: 8 }}>MY NICHES</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {['Tech', 'Business', 'Lifestyle'].map(n => (
            <span key={n} style={{
              fontSize: 11, fontWeight: 600,
              padding: '3px 10px', borderRadius: 20,
              border: '1px solid var(--border-hi)',
              color: 'var(--accent)',
              background: 'var(--accent-bg)',
            }}>{n}</span>
          ))}
        </div>
      </div>
    </aside>
  )
}
