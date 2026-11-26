const KEY = 'virallens_collections'
const EVENT = 'virallens_collections_change'

export type Collection = {
  id: string
  name: string
  color: string
  videoIds: string[]
  builtIn?: boolean
}

const SEED: Collection[] = [
  { id: 'ai-tools',         name: 'AI Tools',        color: '#69C9D0', videoIds: [], builtIn: true },
  { id: 'side-hustle',      name: 'Side Hustle',      color: '#CEFF5E', videoIds: [], builtIn: true },
  { id: 'morning-routines', name: 'Morning Routines', color: '#E1306C', videoIds: [], builtIn: true },
]

export function getCollections(): Collection[] {
  if (typeof window === 'undefined') return SEED
  try {
    const raw = localStorage.getItem(KEY)
    if (raw === null) {
      localStorage.setItem(KEY, JSON.stringify(SEED))
      return SEED
    }
    return JSON.parse(raw) as Collection[]
  } catch {
    return SEED
  }
}

export function saveCollections(cols: Collection[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(KEY, JSON.stringify(cols))
  window.dispatchEvent(new Event(EVENT))
}

export function addVideoToCollection(collectionId: string, videoId: string): void {
  const cols = getCollections()
  const updated = cols.map(c =>
    c.id === collectionId && !c.videoIds.includes(videoId)
      ? { ...c, videoIds: [...c.videoIds, videoId] }
      : c
  )
  saveCollections(updated)
}

export function removeVideoFromCollection(collectionId: string, videoId: string): void {
  const cols = getCollections()
  const updated = cols.map(c =>
    c.id === collectionId
      ? { ...c, videoIds: c.videoIds.filter(id => id !== videoId) }
      : c
  )
  saveCollections(updated)
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function createCollection(name: string, color: string): Collection {
  const cols = getCollections()
  const baseId = slugify(name) || 'collection'
  let id = baseId
  let n = 1
  while (cols.some(c => c.id === id)) {
    id = `${baseId}-${n++}`
  }
  const newCol: Collection = { id, name, color, videoIds: [] }
  saveCollections([...cols, newCol])
  return newCol
}

export function deleteCollection(id: string): void {
  const cols = getCollections()
  saveCollections(cols.filter(c => c.id !== id))
}

export function onCollectionsChange(cb: () => void): () => void {
  window.addEventListener(EVENT, cb)
  return () => window.removeEventListener(EVENT, cb)
}
