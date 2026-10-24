import { ALLOWED_ORIGINS } from './config'

/**
 * Allow same-origin browser requests and explicitly configured origins
 * (for example a separately hosted Android WebView). Requests without an
 * Origin header — native apps and server-to-server calls — are allowed.
 *
 * CORS is not authentication; rate limits and upstream quotas remain the
 * real abuse controls.
 */
export function isAllowedOrigin(request: Request): boolean {
  const origin = request.headers.get('origin')
  if (!origin) return true

  const host = request.headers.get('host')
  try {
    const parsed = new URL(origin)
    if (host && parsed.host === host) return true
  } catch {
    return false
  }

  return ALLOWED_ORIGINS.includes(origin)
}

export function corsHeaders(request: Request): Headers {
  const headers = new Headers({ Vary: 'Origin' })
  const origin = request.headers.get('origin')

  if (origin && isAllowedOrigin(request)) {
    headers.set('Access-Control-Allow-Origin', origin)
  }

  return headers
}

export function clientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0]?.trim() || 'unknown'

  return (
    request.headers.get('x-real-ip') ||
    request.headers.get('cf-connecting-ip') ||
    'unknown'
  )
}
