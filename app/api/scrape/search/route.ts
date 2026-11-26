import { NextRequest, NextResponse } from 'next/server'
import { searchTikTok } from '@/lib/scrape/tiktok'
import { searchInstagram } from '@/lib/scrape/instagram'
import { searchYouTube } from '@/lib/scrape/youtube'
import { normalizeTikTokFeed, normalizeInstagramFeed, normalizeYouTubeFeed } from '@/lib/scrape/normalize'
import type { Platform } from '@/lib/mock-data'

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q') ?? ''
  const platform = req.nextUrl.searchParams.get('platform') as Platform | 'all' | null ?? 'all'
  if (!q.trim()) return NextResponse.json({ videos: [] })

  const fetches: Promise<any[]>[] = []

  if (platform === 'all' || platform === 'tiktok') {
    fetches.push(searchTikTok(q).then(r => normalizeTikTokFeed(r)).catch(() => []))
  }
  if (platform === 'all' || platform === 'instagram') {
    fetches.push(searchInstagram(q).then(r => normalizeInstagramFeed(r)).catch(() => []))
  }
  if (platform === 'all' || platform === 'youtube') {
    fetches.push(searchYouTube(q).then(r => normalizeYouTubeFeed(r)).catch(() => []))
  }

  const results = await Promise.all(fetches)
  const videos = results.flat().sort((a, b) => b.score - a.score)
  return NextResponse.json({ videos })
}
