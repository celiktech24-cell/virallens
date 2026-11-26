import { scrapeGet } from './client'

export async function getTikTokTrending() {
  return scrapeGet<any>('/v1/tiktok/get-trending-feed')
}

export async function searchTikTok(query: string) {
  return scrapeGet<any>('/v1/tiktok/search/keyword', { query })
}

export async function getTikTokVideoById(awemeId: string) {
  // /v2/tiktok/video requires the full URL, not just the ID
  const url = `https://www.tiktok.com/video/${awemeId}`
  return scrapeGet<any>('/v2/tiktok/video', { url })
}
