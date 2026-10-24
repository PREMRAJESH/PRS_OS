import { createHash } from 'node:crypto'
import {
  MAX_CONCURRENT_REQUESTS,
  RATE_LIMIT_MAX,
  RATE_LIMIT_WINDOW_MS,
  UPSTASH_TOKEN,
  UPSTASH_URL,
} from './config'

export type RateLimitBackend = 'upstash' | 'memory'

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetAt: number
  backend: RateLimitBackend
}

const buckets = new Map<string, { count: number; reset: number }>()

function hashKey(value: string) {
  return createHash('sha1').update(value).digest('hex').slice(0, 16)
}

function memoryCheck(key: string): RateLimitResult {
  const now = Date.now()
  const bucket = buckets.get(key)

  if (!bucket || now > bucket.reset) {
    buckets.set(key, { count: 1, reset: now + RATE_LIMIT_WINDOW_MS })
    return {
      allowed: true,
      remaining: RATE_LIMIT_MAX - 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
      backend: 'memory',
    }
  }

  bucket.count += 1
  return {
    allowed: bucket.count <= RATE_LIMIT_MAX,
    remaining: Math.max(0, RATE_LIMIT_MAX - bucket.count),
    resetAt: bucket.reset,
    backend: 'memory',
  }
}

/**
 * Optional shared counter via Upstash REST. When configured, this is the
 * global limit across serverless instances; otherwise the in-memory window
 * is a best-effort per-instance guard.
 */
async function upstashCheck(key: string): Promise<RateLimitResult> {
  const response = await fetch(`${UPSTASH_URL}/pipeline`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${UPSTASH_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify([
      ['INCR', key],
      ['PEXPIRE', key, RATE_LIMIT_WINDOW_MS],
      ['PTTL', key],
    ]),
    signal: AbortSignal.timeout(2_500),
  })

  if (!response.ok) throw new Error(`upstash_${response.status}`)

  const data = (await response.json()) as Array<{ result: number | null }>
  const count = Number(data[0]?.result ?? 1)
  const pttl = Number(data[1]?.result ?? RATE_LIMIT_WINDOW_MS)
  const ttl = pttl > 0 ? pttl : RATE_LIMIT_WINDOW_MS

  return {
    allowed: count <= RATE_LIMIT_MAX,
    remaining: Math.max(0, RATE_LIMIT_MAX - count),
    resetAt: Date.now() + ttl,
    backend: 'upstash',
  }
}

export async function checkRateLimit(ip: string): Promise<RateLimitResult> {
  const key = `prs:assistant:rl:${hashKey(ip)}`

  if (UPSTASH_URL && UPSTASH_TOKEN) {
    try {
      return await upstashCheck(key)
    } catch {
      // Fall through to the local window rather than failing the request.
    }
  }

  return memoryCheck(key)
}

/* ── Per-instance concurrency guard ── */

let active = 0

/**
 * Returns an idempotent release function, or null when the instance is
 * already at capacity. Idempotence keeps early error paths from releasing
 * a slot twice.
 */
export function acquireConcurrency(): (() => void) | null {
  if (active >= MAX_CONCURRENT_REQUESTS) return null
  active += 1

  let released = false
  return () => {
    if (released) return
    released = true
    active = Math.max(0, active - 1)
  }
}

export function concurrencySnapshot() {
  return { active, max: MAX_CONCURRENT_REQUESTS }
}
