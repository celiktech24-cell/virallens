import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getTikTokTrending } from '@/lib/scrape/tiktok'
import { getInstagramTrending } from '@/lib/scrape/instagram'
import { getYouTubeTrending } from '@/lib/scrape/youtube'
import { normalizeTikTokFeed, normalizeInstagramFeed, normalizeYouTubeFeed } from '@/lib/scrape/normalize'
import { upsertVideos } from '@/lib/supabase/videos'

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  return createClient(url, key)
}

export async function POST() {
  const results: { platform: string; count: number; error?: string }[] = []
  const supabase = getServiceClient()
  const allVideos: any[] = []

  // TikTok
  try {
    const raw = await getTikTokTrending()
    const videos = normalizeTikTokFeed(raw)
    allVideos.push(...videos)
    results.push({ platform: 'tiktok', count: videos.length })
  } catch (e: any) {
    results.push({ platform: 'tiktok', count: 0, error: e.message })
  }

  // Instagram
  try {
    const raw = await getInstagramTrending()
    const videos = normalizeInstagramFeed(raw)
    allVideos.push(...videos)
    results.push({ platform: 'instagram', count: videos.length })
  } catch (e: any) {
    results.push({ platform: 'instagram', count: 0, error: e.message })
  }

  // YouTube
  try {
    const raw = await getYouTubeTrending()
    const videos = normalizeYouTubeFeed(raw)
    allVideos.push(...videos)
    results.push({ platform: 'youtube', count: videos.length })
  } catch (e: any) {
    results.push({ platform: 'youtube', count: 0, error: e.message })
  }

  // Upsert to DB
  if (allVideos.length > 0) {
    await upsertVideos(supabase, allVideos)
  }

  return NextResponse.json({ ok: true, total: allVideos.length, results })
}

// Allow GET for cron
export async function GET() {
  return POST()
}
