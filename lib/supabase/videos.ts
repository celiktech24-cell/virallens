import type { SupabaseClient } from '@supabase/supabase-js'
import type { Video, Platform, Niche } from '../mock-data'

export type VideoRow = {
  id: string
  platform: Platform
  original_id: string
  title: string
  creator: string
  creator_handle: string
  views: number
  likes: number
  shares: number
  comments: number
  score: number
  niche: Niche
  hook_types: Array<{ label: string; score: number; rank: number }>
  analysis_text: string
  posted_at: string
  fetched_at: string
}

function rowToVideo(row: VideoRow): Video {
  const postedAt = new Date(row.posted_at)
  const diff = (Date.now() - postedAt.getTime()) / 1000
  const ago = diff < 3600 ? `${Math.round(diff/60)}m ago`
            : diff < 86400 ? `${Math.round(diff/3600)}h ago`
            : `${Math.round(diff/86400)}d ago`

  const gradients: Record<Platform, string> = {
    tiktok:    'linear-gradient(145deg, #0d1218 0%, #0f1824 100%)',
    instagram: 'linear-gradient(145deg, #12100c 0%, #1a160a 100%)',
    youtube:   'linear-gradient(145deg, #120808 0%, #1a0c0c 100%)',
  }

  return {
    id: row.id,
    platform: row.platform,
    title: row.title,
    creator: row.creator,
    creatorHandle: row.creator_handle,
    views: row.views,
    likes: row.likes,
    shares: row.shares,
    comments: row.comments,
    score: row.score,
    niche: row.niche,
    hookTypes: row.hook_types ?? [],
    analysisText: row.analysis_text ?? '',
    thumbnailGradient: gradients[row.platform],
    postedAt: row.posted_at,
    ago,
  }
}

export async function getVideos(
  supabase: SupabaseClient,
  opts: { platform?: Platform | 'all'; niche?: Niche | 'all'; limit?: number } = {}
): Promise<Video[]> {
  let q = supabase
    .from('videos')
    .select('id,platform,original_id,title,creator,creator_handle,views,likes,shares,comments,score,niche,hook_types,analysis_text,posted_at,fetched_at')
    .order('score', { ascending: false })
    .limit(opts.limit ?? 30)

  if (opts.platform && opts.platform !== 'all') q = q.eq('platform', opts.platform)
  if (opts.niche    && opts.niche    !== 'all') q = q.eq('niche',    opts.niche)

  const { data, error } = await q
  if (error || !data || data.length === 0) return []
  return data.map(rowToVideo)
}

export async function upsertVideos(supabase: SupabaseClient, videos: Video[]): Promise<void> {
  if (videos.length === 0) return
  const rows = videos.map(v => ({
    id:             v.id,
    platform:       v.platform,
    original_id:    v.id.split(':')[1] ?? v.id,
    title:          v.title,
    creator:        v.creator,
    creator_handle: v.creatorHandle,
    views:          v.views,
    likes:          v.likes,
    shares:         v.shares,
    comments:       v.comments,
    score:          v.score,
    niche:          v.niche,
    hook_types:     v.hookTypes,
    analysis_text:  v.analysisText,
    posted_at:      v.postedAt,
    fetched_at:     new Date().toISOString(),
  }))
  await supabase.from('videos').upsert(rows, { onConflict: 'id' })
}

export async function getVideoById(supabase: SupabaseClient, id: string): Promise<Video | null> {
  const { data } = await supabase.from('videos').select('*').eq('id', id).single()
  if (!data) return null
  return rowToVideo(data)
}

export async function getVideosCount(supabase: SupabaseClient): Promise<number> {
  const { count } = await supabase.from('videos').select('id', { count: 'exact', head: true })
  return count ?? 0
}
