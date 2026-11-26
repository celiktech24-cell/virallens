import { NextResponse } from 'next/server'

export async function GET() {
  // Call our own scrape endpoint
  const origin = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000'

  const res = await fetch(`${origin}/api/scrape/trending`, { method: 'POST' })
  const data = await res.json()
  return NextResponse.json(data)
}
