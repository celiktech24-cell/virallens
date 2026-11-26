import { scrapeGet } from './client'

export async function getInstagramTrending() {
  return scrapeGet<any>('/v1/instagram/reels/trending')
}

export async function searchInstagram(query: string) {
  return scrapeGet<any>('/v2/instagram/reels/search', { query })
}

export async function getInstagramVideoById(mediaId: string) {
  const url = `https://www.instagram.com/reel/${mediaId}/`
  return scrapeGet<any>('/v1/instagram/post', { url })
}
