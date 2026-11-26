import { scrapeGet } from './client'

export async function getYouTubeTrending() {
  return scrapeGet<any>('/v1/youtube/shorts/trending')
}

export async function searchYouTube(query: string) {
  return scrapeGet<any>('/v1/youtube/search', { query })
}

export async function getYouTubeVideoById(videoId: string) {
  const url = `https://www.youtube.com/watch?v=${videoId}`
  return scrapeGet<any>('/v1/youtube/video', { url })
}
