/**
 * Tiny process-local cache with stale-while-revalidate support and
 * in-flight request deduplication.
 *
 * Limitation: in serverless deployments each instance has its own cache.
 * This is intentional — it keeps the portfolio lightweight. If multiple
 * instances need a shared GitHub cache, swap this module for a shared store.
 */

interface CacheEntry<T> {
  value: T
  freshUntil: number
  staleUntil: number
}

const entries = new Map<string, CacheEntry<unknown>>()
const inFlight = new Map<string, Promise<unknown>>()

export interface CacheRead<T> {
  value: T
  stale: boolean
}

export function readCache<T>(key: string): CacheRead<T> | null {
  const entry = entries.get(key)
  if (!entry) return null

  const now = Date.now()
  if (now > entry.staleUntil) {
    entries.delete(key)
    return null
  }

  return { value: entry.value as T, stale: now > entry.freshUntil }
}

export function writeCache<T>(key: string, value: T, freshMs: number, staleMs: number) {
  const now = Date.now()
  entries.set(key, {
    value,
    freshUntil: now + freshMs,
    staleUntil: now + Math.max(freshMs, staleMs),
  })
}

/**
 * Collapse concurrent requests for the same key into one upstream call.
 * The map entry is removed as soon as the call settles.
 */
export function dedupe<T>(key: string, work: () => Promise<T>): Promise<T> {
  const existing = inFlight.get(key)
  if (existing) return existing as Promise<T>

  const promise = work().finally(() => {
    inFlight.delete(key)
  })

  inFlight.set(key, promise)
  return promise
}

export function cacheSize() {
  return entries.size
}

/** Test/debug helper. */
export function clearCache() {
  entries.clear()
  inFlight.clear()
}
