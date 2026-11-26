import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getVideos } from '@/lib/supabase/videos'
import { VIDEOS } from '@/lib/mock-data'
import type { Platform, Niche } from '@/lib/mock-data'

export async function GET(req: NextRequest) {
  const platform = req.nextUrl.searchParams.get('platform') as Platform | 'all' ?? 'all'
  const niche    = req.nextUrl.searchParams.get('niche')    as Niche    | 'all' ?? 'all'

  try {
    const supabase = await createClient()
    const videos = await getVideos(supabase, { platform, niche, limit: 30 })
    if (videos.length > 0) return NextResponse.json({ videos, source: 'live' })
  } catch {}

  // Fallback to mock data
  const filtered = VIDEOS
    .filter(v => platform === 'all' || v.platform === platform)
    .filter(v => niche    === 'all' || v.niche    === niche)
  return NextResponse.json({ videos: filtered, source: 'mock' })
}
