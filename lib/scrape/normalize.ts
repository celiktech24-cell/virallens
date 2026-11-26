import type { Video, Platform } from '../mock-data'
import { computeScore, detectNiche, detectHooks, generateAnalysis, platformGradient, timeAgo } from '../viral-score'

// ── TikTok ────────────────────────────────────────────────────────────────────
export function normalizeTikTokVideo(raw: any): Video | null {
  try {
    // Handle both aweme_list items and direct aweme_detail structures
    const v = raw.aweme_detail ?? raw
    const id = v.aweme_id ?? v.id
    if (!id) return null

    const title = v.desc ?? v.title ?? ''
    const author = v.author ?? {}
    const stats = v.statistics ?? v.stats ?? {}
    const views    = Number(stats.play_count ?? stats.playCount ?? stats.views ?? 0)
    const likes    = Number(stats.digg_count ?? stats.likeCount ?? stats.likes ?? 0)
    const shares   = Number(stats.share_count ?? stats.shareCount ?? stats.shares ?? 0)
    const comments = Number(stats.comment_count ?? stats.commentCount ?? stats.comments ?? 0)
    const createdAt = v.create_time ? new Date(v.create_time * 1000) : new Date()

    const hooks = detectHooks(title)
    const niche = detectNiche(title)
    const score = computeScore(views, likes, shares, comments, createdAt)

    return {
      id: `tiktok:${id}`,
      platform: 'tiktok',
      title: title || 'Untitled',
      creator: author.nickname ?? author.unique_id ?? 'Unknown',
      creatorHandle: author.unique_id ?? 'unknown',
      views, likes, shares, comments, score, niche,
      hookTypes: hooks,
      analysisText: generateAnalysis(title, 'tiktok', hooks),
      thumbnailGradient: platformGradient('tiktok'),
      postedAt: createdAt.toISOString(),
      ago: timeAgo(createdAt),
    }
  } catch { return null }
}

export function normalizeTikTokFeed(raw: any): Video[] {
  const list = raw?.aweme_list ?? raw?.data ?? raw?.videos ?? []
  return list.map(normalizeTikTokVideo).filter(Boolean) as Video[]
}

// ── Instagram ─────────────────────────────────────────────────────────────────
export function normalizeInstagramReel(raw: any): Video | null {
  try {
    const id = raw.pk ?? raw.id ?? raw.media_id
    if (!id) return null

    const caption = raw.caption?.text ?? raw.title ?? raw.desc ?? ''
    const user = raw.user ?? raw.owner ?? {}
    const views    = Number(raw.play_count ?? raw.view_count ?? raw.video_view_count ?? 0)
    const likes    = Number(raw.like_count ?? raw.likes ?? 0)
    const shares   = Number(raw.reshare_count ?? raw.shares ?? 0)
    const comments = Number(raw.comment_count ?? raw.comments ?? 0)
    const createdAt = raw.taken_at ? new Date(raw.taken_at * 1000) : new Date()

    const hooks = detectHooks(caption)
    const niche = detectNiche(caption)
    const score = computeScore(views, likes, shares, comments, createdAt)

    return {
      id: `instagram:${id}`,
      platform: 'instagram',
      title: caption.slice(0, 120) || 'Instagram Reel',
      creator: user.full_name ?? user.username ?? 'Unknown',
      creatorHandle: user.username ?? 'unknown',
      views, likes, shares, comments, score, niche,
      hookTypes: hooks,
      analysisText: generateAnalysis(caption, 'instagram', hooks),
      thumbnailGradient: platformGradient('instagram'),
      postedAt: createdAt.toISOString(),
      ago: timeAgo(createdAt),
    }
  } catch { return null }
}

export function normalizeInstagramFeed(raw: any): Video[] {
  const list = raw?.reels ?? raw?.data ?? raw?.items ?? raw?.medias ?? []
  return list.map(normalizeInstagramReel).filter(Boolean) as Video[]
}

// ── YouTube ───────────────────────────────────────────────────────────────────
export function normalizeYouTubeVideo(raw: any): Video | null {
  try {
    const id = raw.id ?? raw.videoId ?? raw.video_id
    if (!id) return null

    const title = raw.title ?? raw.name ?? ''
    const channel = raw.channel ?? raw.author ?? {}
    const views    = Number(raw.viewCount ?? raw.views ?? raw.view_count ?? 0)
    const likes    = Number(raw.likeCount ?? raw.likes ?? raw.like_count ?? 0)
    const shares   = 0
    const comments = Number(raw.commentCount ?? raw.comments ?? raw.comment_count ?? 0)
    const createdAt = raw.publishedAt ? new Date(raw.publishedAt) :
                      raw.published_at ? new Date(raw.published_at) : new Date()

    const hooks = detectHooks(title)
    const niche = detectNiche(title)
    const score = computeScore(views, likes, shares, comments, createdAt)

    return {
      id: `youtube:${id}`,
      platform: 'youtube',
      title: title || 'Untitled',
      creator: channel.name ?? channel.title ?? raw.channelTitle ?? 'Unknown',
      creatorHandle: channel.handle ?? channel.id ?? raw.channelId ?? 'unknown',
      views, likes, shares, comments, score, niche,
      hookTypes: hooks,
      analysisText: generateAnalysis(title, 'youtube', hooks),
      thumbnailGradient: platformGradient('youtube'),
      postedAt: createdAt.toISOString(),
      ago: timeAgo(createdAt),
    }
  } catch { return null }
}

export function normalizeYouTubeFeed(raw: any): Video[] {
  const list = raw?.videos ?? raw?.shorts ?? raw?.items ?? raw?.data ?? []
  return list.map(normalizeYouTubeVideo).filter(Boolean) as Video[]
}
