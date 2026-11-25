import { type ClassValue, clsx } from 'clsx'
import type { Platform } from './mock-data'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace('.0', '') + 'M'
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace('.0', '') + 'K'
  return n.toString()
}

export function scoreLabel(score: number): string {
  if (score >= 95) return 'Top 1% Viral'
  if (score >= 90) return 'Top 2% Viral'
  if (score >= 85) return 'Top 5% Viral'
  if (score >= 80) return 'Top 10% Viral'
  if (score >= 70) return 'Trending'
  return 'Rising'
}

export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const h = Math.floor(diff / 3_600_000)
  const d = Math.floor(h / 24)
  if (d > 0) return `${d}d ago`
  if (h > 0) return `${h}h ago`
  return 'just now'
}

export const PLATFORM_COLOR: Record<Platform, string> = {
  tiktok: '#E2E4EF',
  instagram: '#E2E4EF',
  youtube: '#E2E4EF',
}

export const PLATFORM_DOT: Record<Platform, string> = {
  tiktok: '#69C9D0',
  instagram: '#E1306C',
  youtube: '#FF0000',
}
