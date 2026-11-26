import { NextRequest, NextResponse } from 'next/server'

// Only proxy URLs from known video CDN domains
const ALLOWED_DOMAINS = [
  'tiktokcdn.com',
  'tiktokcdn-us.com',
  'byteaccelerate.com',
  'cdninstagram.com',
  'fbcdn.net',
  'scontent.cdninstagram.com',
  'instagram.fcdn.net',
]

function isAllowed(url: string): boolean {
  try {
    const { hostname } = new URL(url)
    return ALLOWED_DOMAINS.some(d => hostname === d || hostname.endsWith('.' + d))
  } catch { return false }
}

export async function GET(request: NextRequest) {
  const raw = request.nextUrl.searchParams.get('url')
  if (!raw) return new NextResponse('Missing url', { status: 400 })

  let videoUrl: string
  try {
    videoUrl = decodeURIComponent(raw)
  } catch {
    return new NextResponse('Invalid url', { status: 400 })
  }

  if (!isAllowed(videoUrl)) {
    return new NextResponse('Domain not allowed', { status: 403 })
  }

  // Forward Range header so the browser can seek
  const headers: Record<string, string> = {
    'User-Agent': 'Mozilla/5.0 (compatible; ViralLens/1.0)',
  }
  const range = request.headers.get('range')
  if (range) headers['Range'] = range

  try {
    const upstream = await fetch(videoUrl, { headers })
    const contentType = upstream.headers.get('content-type') ?? 'video/mp4'
    const contentLength = upstream.headers.get('content-length')
    const contentRange = upstream.headers.get('content-range')
    const acceptRanges = upstream.headers.get('accept-ranges')

    const responseHeaders: Record<string, string> = {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=3600',
      'Access-Control-Allow-Origin': '*',
    }
    if (contentLength) responseHeaders['Content-Length'] = contentLength
    if (contentRange) responseHeaders['Content-Range'] = contentRange
    if (acceptRanges) responseHeaders['Accept-Ranges'] = acceptRanges

    return new NextResponse(upstream.body, {
      status: upstream.status,
      headers: responseHeaders,
    })
  } catch (err) {
    return new NextResponse('Proxy error', { status: 502 })
  }
}
