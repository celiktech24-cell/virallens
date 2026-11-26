import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { getVideoById, upsertVideos } from '@/lib/supabase/videos'
import { VIDEOS } from '@/lib/mock-data'
import { getTikTokVideoById } from '@/lib/scrape/tiktok'
import { getYouTubeVideoById } from '@/lib/scrape/youtube'
import { getInstagramVideoById } from '@/lib/scrape/instagram'
import { normalizeTikTokVideo, normalizeYouTubeVideo, normalizeInstagramReel } from '@/lib/scrape/normalize'

function getServiceSupabase() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

async function fetchFromScrapeCreators(id: string) {
  // ID format: "platform:originalId"
  const colonIdx = id.indexOf(':')
  if (colonIdx === -1) return null
  const platform = id.slice(0, colonIdx)
  const originalId = id.slice(colonIdx + 1)

  try {
    if (platform === 'tiktok') {
      const raw = await getTikTokVideoById(originalId)
      return normalizeTikTokVideo(raw)
    }
    if (platform === 'youtube') {
      const raw = await getYouTubeVideoById(originalId)
      return normalizeYouTubeVideo(raw)
    }
    if (platform === 'instagram') {
      const raw = await getInstagramVideoById(originalId)
      return normalizeInstagramReel(raw)
    }
  } catch {}
  return null
}

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id')
  if (!id) return NextResponse.json({ video: null }, { status: 400 })

  // 1. Try Supabase (service client — no cookie/session dependency)
  try {
    const video = await getVideoById(getServiceSupabase(), id)
    if (video) return NextResponse.json({ video })
  } catch {}

  // 2. Try mock data
  const mock = VIDEOS.find(v => v.id === id)
  if (mock) return NextResponse.json({ video: mock })

  // 3. Re-fetch from ScrapeCreators API
  const fetched = await fetchFromScrapeCreators(id)
  if (fetched) {
    // Persist so future loads are fast
    upsertVideos(getServiceSupabase(), [fetched]).catch(() => {})
    return NextResponse.json({ video: fetched })
  }

  return NextResponse.json({ video: null })
}
