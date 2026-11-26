import { scrapeGet } from './client'

export async function getYouTubeTrending() {
  return scrapeGet<any>('/v1/youtube/shorts/trending')
}

export async function searchYouTube(query: string) {
  return scrapeGet<any>('/v1/youtube/search', { query })
}

export async function getYouTubeVideoById(videoId: string) {
  return scrapeGet<any>('/v1/youtube/video', { id: videoId })
}
