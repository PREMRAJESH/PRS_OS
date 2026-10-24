/**
 * Assistant configuration.
 *
 * Everything here is server-only. No value is exposed through NEXT_PUBLIC_*.
 */

export const ASSISTANT_LINKS = {
  github: 'https://github.com/PREMRAJESH',
  linkedin: 'https://www.linkedin.com/in/gecdhd-comp-prem-sargara/',
  youtube: 'https://www.youtube.com/@Merged_PRs',
  leetcode: 'https://leetcode.com/u/Sargara_Prem/',
  email: 'sargarapremrajesh@gmail.com',
  portfolio: 'https://premsargara.me',
  resume: '/Resume.pdf',
} as const

export const PROMPT_VERSION = '2026-10-24.2'
export const KNOWLEDGE_FILE = 'prem-rajesh-profile.md'

export const MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash'

/** Overridable for a proxy or for local mock-based tests. */
export const GEMINI_API_BASE = (
  process.env.GEMINI_API_BASE || 'https://generativelanguage.googleapis.com/v1beta'
).replace(/\/$/, '')

export const GITHUB_API_BASE = (
  process.env.GITHUB_API_BASE || 'https://api.github.com'
).replace(/\/$/, '')

export const GITHUB_USERNAME = 'PREMRAJESH'

/** Fresh window for repository metadata. */
export const GITHUB_CACHE_TTL_MS = 10 * 60 * 1000
/** Stale data may still be served while a refresh runs. */
export const GITHUB_STALE_TTL_MS = 60 * 60 * 1000
export const GITHUB_FETCH_TIMEOUT_MS = 6_000
export const README_FETCH_TIMEOUT_MS = 5_000
export const README_EXCERPT_CHARS = 1_400

export const MAX_MESSAGE_LENGTH = 1_200
export const MAX_HISTORY_ITEMS = 8
export const MAX_HISTORY_ITEM_LENGTH = 1_500
export const MAX_BODY_BYTES = 24 * 1024
export const MAX_OUTPUT_TOKENS = 900
export const UPSTREAM_TIMEOUT_MS = 25_000

export const RATE_LIMIT_WINDOW_MS = 60_000
export const RATE_LIMIT_MAX = 15
/** Per-instance guard; the shared store (if configured) is the global limit. */
export const MAX_CONCURRENT_REQUESTS =
  Number(process.env.ASSISTANT_MAX_CONCURRENCY) || 4

export const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL?.replace(/\/$/, '')
export const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN

/** Extra origins allowed to call the API (e.g. a separate Android WebView). */
export const ALLOWED_ORIGINS = (process.env.ASSISTANT_ALLOWED_ORIGINS || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)
