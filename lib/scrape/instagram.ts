import { scrapeGet } from './client'

export async function getInstagramTrending() {
  return scrapeGet<any>('/v1/instagram/reels/trending')
}

export async function searchInstagram(keyword: string) {
  return scrapeGet<any>('/v2/instagram/reels/search', { keyword })
}
