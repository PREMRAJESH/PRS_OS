'use client'

import { useEffect, useState } from 'react'

/**
 * SSR-safe media query hook. Returns `null` until the client has measured,
 * so callers can avoid rendering the wrong OS shell on first paint.
 */
export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState<boolean | null>(null)

  useEffect(() => {
    const mq = window.matchMedia(query)
    const update = () => setMatches(mq.matches)

    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [query])

  return matches
}

/** Desktop OS below 1024px; Android-style OS at and under tablet width. */
export function useIsAndroid() {
  return useMediaQuery('(max-width: 1023px)')
}
