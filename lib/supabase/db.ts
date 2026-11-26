import type { SupabaseClient } from '@supabase/supabase-js'

// ── Saved Videos ─────────────────────────────────────────────────────────────

export async function getSavedVideoIds(supabase: SupabaseClient): Promise<string[]> {
  const { data } = await supabase.from('saved_videos').select('video_id')
  return (data ?? []).map((r: { video_id: string }) => r.video_id)
}

export async function saveVideo(supabase: SupabaseClient, videoId: string): Promise<void> {
  await supabase.from('saved_videos').insert({ video_id: videoId })
}

export async function unsaveVideo(supabase: SupabaseClient, videoId: string): Promise<void> {
  await supabase.from('saved_videos').delete().eq('video_id', videoId)
}

// ── Collections ───────────────────────────────────────────────────────────────

export type DbCollection = {
  id: string
  name: string
  color: string
  is_built_in: boolean
  videoIds: string[]
}

export async function getCollectionsWithVideos(supabase: SupabaseClient): Promise<DbCollection[]> {
  const { data: cols } = await supabase
    .from('collections')
    .select('id, name, color, is_built_in')
    .order('created_at')
  if (!cols || cols.length === 0) return []

  const { data: cvs } = await supabase
    .from('collection_videos')
    .select('collection_id, video_id')
    .in('collection_id', cols.map((c: { id: string }) => c.id))

  return cols.map((col: { id: string; name: string; color: string; is_built_in: boolean }) => ({
    id: col.id,
    name: col.name,
    color: col.color,
    is_built_in: col.is_built_in,
    videoIds: (cvs ?? [])
      .filter((cv: { collection_id: string }) => cv.collection_id === col.id)
      .map((cv: { video_id: string }) => cv.video_id),
  }))
}

export async function seedBuiltInCollections(supabase: SupabaseClient): Promise<void> {
  const { count } = await supabase
    .from('collections')
    .select('id', { count: 'exact', head: true })
  if (count && count > 0) return
  await supabase.from('collections').insert([
    { name: 'AI Tools',         color: '#69C9D0', is_built_in: true },
    { name: 'Side Hustle',      color: '#CEFF5E', is_built_in: true },
    { name: 'Morning Routines', color: '#E1306C', is_built_in: true },
  ])
}

export async function createDbCollection(
  supabase: SupabaseClient, name: string, color: string
): Promise<string | null> {
  const { data } = await supabase
    .from('collections').insert({ name, color }).select('id').single()
  return data?.id ?? null
}

export async function deleteDbCollection(supabase: SupabaseClient, id: string): Promise<void> {
  await supabase.from('collections').delete().eq('id', id)
}

export async function addVideoToDbCollection(
  supabase: SupabaseClient, collectionId: string, videoId: string
): Promise<void> {
  await supabase.from('collection_videos').upsert({ collection_id: collectionId, video_id: videoId })
}

export async function removeVideoFromDbCollection(
  supabase: SupabaseClient, collectionId: string, videoId: string
): Promise<void> {
  await supabase.from('collection_videos')
    .delete()
    .eq('collection_id', collectionId)
    .eq('video_id', videoId)
}
