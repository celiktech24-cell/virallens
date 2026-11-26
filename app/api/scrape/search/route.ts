import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { searchTikTok } from '@/lib/scrape/tiktok'
import { searchInstagram } from '@/lib/scrape/instagram'
import { searchYouTube } from '@/lib/scrape/youtube'
import { normalizeTikTokFeed, normalizeInstagramFeed, normalizeYouTubeFeed } from '@/lib/scrape/normalize'
import { upsertVideos } from '@/lib/supabase/videos'
import type { Platform } from '@/lib/mock-data'

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

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

  const MIN_VIEWS = 10_000

  const results = await Promise.all(fetches)
  const videos = results.flat()
    .filter(v => v.views >= MIN_VIEWS)
    .sort((a, b) => b.score - a.score)

  // Persist to Supabase so analysis pages can find them by ID (await = no race condition)
  if (videos.length > 0) {
    await upsertVideos(getServiceClient(), videos).catch(() => {})
  }

  return NextResponse.json({ videos })
}
