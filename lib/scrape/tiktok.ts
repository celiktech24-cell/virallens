import { scrapeGet } from './client'

export async function getTikTokTrending() {
  return scrapeGet<any>('/v1/tiktok/get-trending-feed')
}

export async function searchTikTok(query: string) {
  return scrapeGet<any>('/v1/tiktok/search/keyword', { query })
}
