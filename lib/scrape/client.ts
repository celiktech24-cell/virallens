const BASE = 'https://api.scrapecreators.com'

export async function scrapeGet<T>(path: string, params: Record<string, string> = {}): Promise<T> {
  const url = new URL(BASE + path)
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
  const res = await fetch(url.toString(), {
    headers: { 'x-api-key': process.env.SCRAPECREATORS_API_KEY! },
    next: { revalidate: 0 },
  })
  if (!res.ok) throw new Error(`ScrapeCreators ${path} → ${res.status}`)
  return res.json()
}
