const KEY = 'virallens_saved'
const EVENT = 'virallens_saved_change'

export function getSavedIds(): string[] {
  if (typeof window === 'undefined') return []
  try { return JSON.parse(localStorage.getItem(KEY) || '[]') } catch { return [] }
}

export function isSaved(id: string): boolean {
  return getSavedIds().includes(id)
}

export function toggleSaved(id: string): boolean {
  const current = getSavedIds()
  const next = current.includes(id)
    ? current.filter(x => x !== id)
    : [...current, id]
  localStorage.setItem(KEY, JSON.stringify(next))
  window.dispatchEvent(new Event(EVENT))
  return next.includes(id)
}

export function onSavedChange(cb: () => void) {
  window.addEventListener(EVENT, cb)
  return () => window.removeEventListener(EVENT, cb)
}
