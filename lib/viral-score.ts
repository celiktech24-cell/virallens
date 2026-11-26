import type { Platform, Niche, HookType } from './mock-data'

// ── Viral score ──────────────────────────────────────────────────────────────
export function computeScore(
  views: number, likes: number, shares: number, comments: number, postedAt: Date
): number {
  if (views === 0) return 50
  const hoursOld = Math.max((Date.now() - postedAt.getTime()) / 3_600_000, 1)
  const engRate = (likes + shares * 2 + comments * 3) / views
  const velocity = Math.min(views / hoursOld / 50_000, 1)
  const raw = engRate * 60 + velocity * 40
  return Math.min(Math.max(Math.round(raw * 2.2 + 35), 50), 99)
}

// ── Niche detection ───────────────────────────────────────────────────────────
const TECH = ['ai', 'chatgpt', 'iphone', 'tech', 'software', 'code', 'coding', 'app', 'saas', 'programming', 'developer', 'notion', 'automation', 'robot', 'crypto', 'nft']
const BIZ  = ['money', 'income', 'business', 'hustle', 'revenue', 'startup', 'invest', 'entrepreneur', 'profit', 'sales', 'marketing', 'brand', 'dropship', 'ecommerce', 'passive']
const LIFE = ['fitness', 'workout', 'food', 'recipe', 'travel', 'fashion', 'morning', 'routine', 'health', 'style', 'outfit', 'home', 'wellness', 'yoga', 'diet', 'sleep']

export function detectNiche(title: string): Niche {
  const t = title.toLowerCase()
  const techScore = TECH.filter(k => t.includes(k)).length
  const bizScore  = BIZ.filter(k => t.includes(k)).length
  const lifeScore = LIFE.filter(k => t.includes(k)).length
  if (techScore >= bizScore && techScore >= lifeScore) return 'tech'
  if (bizScore >= lifeScore) return 'business'
  return 'lifestyle'
}

// ── Hook type detection ───────────────────────────────────────────────────────
const PATTERNS: { label: string; re: RegExp }[] = [
  { label: 'List Format',        re: /\b\d+\s+(ways|tips|tricks|things|steps|secrets|hacks|ideas|reasons|tools|apps)/i },
  { label: 'Question Hook',      re: /\?$|^(how|why|what|when|who|is|are|can|will|should)\s/i },
  { label: 'Transformation Arc', re: /\$?\d+[k]?\s*(to|→|-)\s*\$?\d+[k]?|from\s+\$?0|went from/i },
  { label: 'Specific Amount',    re: /\$[\d,.]+[k]?|\d+[k]?\s*(dollars|followers|subs)/i },
  { label: 'Time Challenge',     re: /\b(in\s+)?\d+\s+(days?|hours?|weeks?|minutes?)\b/i },
  { label: 'Secret Reveal',      re: /nobody\s+(talks?|knows?|tells?)|secrets?|hidden|exposed/i },
  { label: 'Fear Hook',          re: /\b(replace|dying|warning|danger|stop|quit|never)\b/i },
  { label: 'Curiosity Gap',      re: /\.\.\.|you won.t believe|this changed|wait for it/i },
  { label: 'Contrarian Take',    re: /\b(actually|truth|lie|myth|wrong|dark side|stop believing)\b/i },
  { label: 'Experiment Frame',   re: /i (tried|tested|used|spent|did)\s.{0,20}(days?|weeks?|months?)/i },
]

export function detectHooks(title: string): HookType[] {
  return PATTERNS
    .filter(p => p.re.test(title))
    .map((p, i) => ({ label: p.label, score: Math.max(95 - i * 7, 55), rank: i + 1 }))
    .slice(0, 4)
}

// ── Analysis text ─────────────────────────────────────────────────────────────
export function generateAnalysis(title: string, platform: Platform, hooks: HookType[]): string {
  const topHook = hooks[0]?.label ?? 'Strong hook'
  const platformNote: Record<Platform, string> = {
    tiktok: 'TikTok algorithm rewards high completion rate.',
    instagram: 'Instagram Reels saves drive algorithmic reach.',
    youtube: 'YouTube Shorts loop rate signals quality to the algorithm.',
  }
  return `${topHook} detected. ${platformNote[platform]} ${hooks.length > 1 ? `${hooks.length} hook patterns compound virality.` : ''}`
}

// ── Gradient by platform ──────────────────────────────────────────────────────
export function platformGradient(platform: Platform): string {
  return {
    tiktok:    'linear-gradient(145deg, #0d1218 0%, #0f1824 100%)',
    instagram: 'linear-gradient(145deg, #12100c 0%, #1a160a 100%)',
    youtube:   'linear-gradient(145deg, #120808 0%, #1a0c0c 100%)',
  }[platform]
}

// ── Time ago ──────────────────────────────────────────────────────────────────
export function timeAgo(date: Date): string {
  const diff = (Date.now() - date.getTime()) / 1000
  if (diff < 3600)  return `${Math.round(diff / 60)}m ago`
  if (diff < 86400) return `${Math.round(diff / 3600)}h ago`
  return `${Math.round(diff / 86400)}d ago`
}
