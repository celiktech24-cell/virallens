# ViralLens — Handoff Document

> Read this at the start of every session before touching any code.

---

## What This Is

A personal viral content intelligence tool. Find videos that went viral on TikTok, Instagram Reels, and YouTube Shorts. Understand WHY they went viral (hook type, format, engagement breakdown). Save the best ones to study and recreate.

**Owner niches:** Tech · Business · Lifestyle

---

## Live URLs

| | |
|---|---|
| **App (production)** | https://virallens-theta-one.vercel.app |
| **GitHub** | https://github.com/celiktech24-cell/virallens |
| **Vercel dashboard** | https://vercel.com/celiktech24-3928s-projects/virallens |

Auto-deploy is ON — every `git push` to `master` triggers a Vercel redeploy.

---

## Local Dev

```bash
cd "C:\Users\Celik Pro\Desktop\virallens"
npm run dev        # starts on http://localhost:3000
```

---

## Project Structure

```
virallens/
  app/
    layout.tsx              ← Root layout: Sidebar + main shell
    page.tsx                ← Home / Trending page (client component)
    globals.css             ← ALL design tokens live here
    search/page.tsx         ← Search page
    analysis/[id]/page.tsx  ← Video analysis page (server component)
    saved/page.tsx          ← Saved videos page
    collections/page.tsx    ← Collections stub
    analytics/page.tsx      ← Analytics stub (Phase 2)
    settings/page.tsx       ← Settings stub

  components/
    Sidebar.tsx             ← Left nav (ViralLens logo + nav links + niches)
    PageHeader.tsx          ← Sticky top bar (title + platform filter pills)
    VideoCard.tsx           ← Shared card used in Home, Search, Saved grids
    FeaturedCard.tsx        ← 2-col asymmetric hero card (#1 Viral Today)
    NicheSegment.tsx        ← Sliding-thumb segmented control (All/Tech/Business/Lifestyle)
    BackButton.tsx          ← Client-only back button (used in Analysis page)

  lib/
    mock-data.ts            ← 15 video records (replace with real API in Phase 2)
    utils.ts                ← formatNumber(), scoreLabel(), cn()
```

---

## Design System (DO NOT change these tokens)

```css
/* globals.css */
--ground:    #0B0D12   /* 60% — page background */
--surface:   #131720   /* sidebar, cards */
--raised:    #1C2030   /* inset elements, hover state */
--track:     #252A3A   /* progress bars, scrollbar */
--border:    rgba(226,228,239,0.07)
--border-hi: rgba(226,228,239,0.13)
--ink:       #E2E4EF   /* primary text */
--label:     #878CA6   /* secondary text */
--muted:     #565A72   /* tertiary / disabled */
--accent:    #CEFF5E   /* ONE accent: electric lime */
--accent-bg: rgba(206,255,94,0.07)
--up:        #34D399   /* positive delta */
--down:      #F87171   /* negative delta */
--r:         14px      /* ONE radius kind */
--expo:      cubic-bezier(0.16, 1, 0.3, 1)
```

**Font stack:** Bricolage Grotesque (headings/display) + DM Sans (body) + JetBrains Mono (numbers/labels)

**Rules:**
- ONE accent color only (`--accent`). Never add a second accent.
- Card hover = border-color + box-shadow only. NO translateY on hover.
- Animations must be earned. No universal fade-ups or pulsing blobs.

---

## Data Model

```ts
// lib/mock-data.ts
type Video = {
  id: string
  title: string
  platform: 'tiktok' | 'instagram' | 'youtube'
  niche: 'tech' | 'business' | 'lifestyle'
  creator: string
  creatorHandle: string
  score: number          // 0–100 viral score
  views: number
  likes: number
  shares: number
  comments: number
  postedAt: string       // ISO date
  ago: string            // pre-computed: "1d ago", "2d ago", etc.
  thumbnailGradient: string  // CSS gradient string
  hookTypes: HookType[]
  analysisText: string
}
```

---

## What's Done ✅

- [x] 4 pages: Trending, Search, Analysis, Saved
- [x] Sidebar navigation with active states
- [x] Platform filter pills (TikTok / Instagram / YouTube)
- [x] Niche segmented control with sliding thumb animation
- [x] Featured card (2-col asymmetric layout)
- [x] Video card grid with staggered entry animations
- [x] Score ring (SVG stroke-dashoffset draw animation)
- [x] Hook type breakdown
- [x] Engagement bars (scaleX animation)
- [x] 15 realistic mock videos across 3 platforms × 3 niches
- [x] Build passing, deployed to Vercel
- [x] GitHub repo connected (auto-deploy on push)

---

## What's Next (Phase 2)

### Priority 1 — Real YouTube Data (free)
1. Get a Google API key → enable YouTube Data API v3
2. Set env var: `YOUTUBE_API_KEY=...` in Vercel dashboard + `.env.local`
3. Create `app/api/trending/route.ts` — fetch YouTube Shorts trending
4. Replace `VIDEOS` mock array with API response
5. Map YouTube response shape to our `Video` type

**YouTube Shorts trending endpoint:**
```
GET https://www.googleapis.com/youtube/v3/videos
  ?part=snippet,statistics
  &chart=mostPopular
  &videoCategoryId=22
  &regionCode=US
  &maxResults=20
  &key=YOUR_KEY
```

### Priority 2 — TikTok + Instagram (Apify)
- Sign up at apify.com (~$5/mo for light usage)
- Use actor: `clockworks/tiktok-scraper` for TikTok
- Use actor: `apify/instagram-reel-scraper` for Instagram
- Set env vars: `APIFY_TOKEN=...`
- Create `app/api/trending/tiktok/route.ts` and `.../instagram/route.ts`

### Priority 3 — Supabase (Auth + Save)
1. Create Supabase project at supabase.com
2. Set env vars: `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Create tables:
   ```sql
   create table saved_videos (
     id uuid default gen_random_uuid() primary key,
     user_id uuid references auth.users,
     video_id text not null,
     video_data jsonb,
     created_at timestamptz default now()
   );
   ```
4. Add auth (email magic link) — Supabase Auth UI component
5. Wire "Save" button on VideoCard + Analysis page to insert into DB
6. Load saved videos from DB on Saved page

### Priority 4 — Custom Domain
- Go to Vercel dashboard → Settings → Domains
- Add your domain and follow DNS instructions

---

## Deployment Workflow

```bash
# Make changes locally, test with npm run dev
git add .
git commit -m "your message"
git push                   # Vercel auto-deploys in ~60s
```

Check deploy status: https://vercel.com/celiktech24-3928s-projects/virallens

---

## Known Limitations (Phase 1)

- All data is mock — no real video scores or metrics
- "Save Video" button on Analysis page is UI-only (no DB)
- Collections page is a stub
- Analytics page is a stub (needs real data)
- Search only searches mock data titles/creators
