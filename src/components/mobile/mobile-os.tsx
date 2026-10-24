'use client'

import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { BatteryMedium, ChevronLeft, Signal, Wifi } from 'lucide-react'
import { useOSStore } from '@/store/os-store'
import { MobileAppScreen } from './mobile-app-screen'
import { MobileDrawer } from './mobile-drawer'
import { MobileHome } from './mobile-home'
import { MobileRecents } from './mobile-recents'
import { MobileShade } from './mobile-shade'
import { WINDOW_TO_APP, type MobileAppId } from './mobile-apps'

type Overlay = 'none' | 'drawer' | 'shade' | 'recents'

const TIME_FORMAT: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit' }
const DATE_FORMAT: Intl.DateTimeFormatOptions = {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
}

export function MobileOS() {
  const [app, setApp] = useState<MobileAppId | null>(null)
  const [overlay, setOverlay] = useState<Overlay>('none')
  const [recents, setRecents] = useState<MobileAppId[]>([])
  const [drawerFocus, setDrawerFocus] = useState(false)
  const [brightness, setBrightness] = useState(78)
  const [clock, setClock] = useState({ time: '', date: '' })

  const currentTheme = useOSStore((state) => state.currentTheme)

  /* Theme tokens are shared with the desktop shell. */
  useEffect(() => {
    const root = document.documentElement
    const previous = Array.from(root.classList).find((c) => c.startsWith('theme-'))
    if (previous) root.classList.remove(previous)
    root.classList.add(`theme-${currentTheme}`)
  }, [currentTheme])

  /* Clock */
  useEffect(() => {
    const tick = () => {
      const now = new Date()
      setClock({
        time: now.toLocaleTimeString('en-GB', TIME_FORMAT),
        date: now.toLocaleDateString('en-GB', DATE_FORMAT),
      })
    }
    tick()
    const timer = window.setInterval(tick, 20_000)
    return () => window.clearInterval(timer)
  }, [])

  const openApp = useCallback((id: MobileAppId) => {
    setApp(id)
    setOverlay('none')
    setRecents((prev) => [id, ...prev.filter((entry) => entry !== id)].slice(0, 6))
  }, [])

  const goHome = useCallback(() => {
    setApp(null)
    setOverlay('none')
  }, [])

  /* Let portfolio content open mobile apps through the existing OS store. */
  useEffect(() => {
    useOSStore.setState({ windows: [], activeWindow: null, commandPaletteOpen: false })

    const unsubscribe = useOSStore.subscribe((state, previous) => {
      if (state.windows.length <= previous.windows.length) return

      const newest = state.windows[state.windows.length - 1]
      const mapped = WINDOW_TO_APP[newest.type]
      if (mapped) openApp(mapped)

      useOSStore.setState({ windows: [], activeWindow: null })
    })

    return unsubscribe
  }, [openApp])

  const handleBack = useCallback(() => {
    if (overlay === 'shade' || overlay === 'drawer') {
      setOverlay('none')
      return
    }

    if (app) {
      // Apps with internal navigation (e.g. a project case study) can cancel this.
      const shouldLeave = window.dispatchEvent(
        new CustomEvent('prs:mobile-back', { cancelable: true }),
      )
      if (shouldLeave) setApp(null)
      return
    }

    if (overlay === 'recents') setOverlay('none')
  }, [app, overlay])

  const openRecents = useCallback(() => {
    setApp(null)
    setOverlay('recents')
  }, [])

  const screen = app ? 'app' : overlay === 'recents' ? 'recents' : 'home'
  const backDisabled = screen === 'home'

  return (
    <div
      id="workspace"
      className="relative flex h-[100dvh] w-full flex-col overflow-hidden bg-background font-sans text-foreground select-none"
    >
      <div
        className="android-wallpaper"
        aria-hidden="true"
        style={{ filter: `brightness(${0.45 + (brightness / 100) * 0.55})` }}
      />
      <div className="grain" aria-hidden="true" />

      <h1 className="sr-only">Prem Rajesh — software engineer</h1>

      {/* Status bar */}
      <div
        className="relative z-30 shrink-0"
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
        <button
          onClick={() => setOverlay('shade')}
          aria-label="Open quick settings and notifications"
          className="flex h-10 w-full items-center justify-between px-5 text-foreground/85"
        >
          <span className="tabular text-[11.5px] font-medium tracking-tight">
            {clock.time || '--:--'}
          </span>
          <span className="flex items-center gap-2">
            <Signal className="h-3.5 w-3.5" strokeWidth={2} />
            <Wifi className="h-3.5 w-3.5" strokeWidth={2} />
            <span className="flex items-center gap-1">
              <BatteryMedium className="h-4 w-4" strokeWidth={1.8} />
              <span className="text-[9.5px] font-medium tabular">86</span>
            </span>
          </span>
        </button>
      </div>

      {/* Screen */}
      <div className="relative z-10 min-h-0 flex-1">
        <AnimatePresence mode="wait" initial={false}>
          {screen === 'app' && app ? (
            <MobileAppScreen key={app} app={app} onHome={goHome} />
          ) : screen === 'recents' ? (
            <MobileRecents
              key="recents"
              recents={recents}
              onOpenApp={openApp}
              onCloseApp={(id) => setRecents((prev) => prev.filter((entry) => entry !== id))}
              onClear={() => setRecents([])}
              onClose={goHome}
            />
          ) : (
            <MobileHome
              key="home"
              time={clock.time}
              dateLabel={clock.date}
              onOpenApp={openApp}
              onOpenDrawer={(focusSearch) => {
                setDrawerFocus(Boolean(focusSearch))
                setOverlay('drawer')
              }}
            />
          )}
        </AnimatePresence>
      </div>

      {/* 3-button Android navigation */}
      <div
        className="relative z-30 shrink-0 border-t border-hairline bg-background/80 backdrop-blur-xl"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="mx-auto flex h-14 w-full max-w-lg items-center justify-around px-7">
          <button
            onClick={handleBack}
            disabled={backDisabled}
            aria-label="Back"
            className="flex h-12 w-16 items-center justify-center rounded-full text-foreground/60 transition-colors active:bg-foreground/[0.06] disabled:opacity-25"
          >
            <ChevronLeft className="h-5 w-5" strokeWidth={1.8} />
          </button>

          <button
            onClick={goHome}
            aria-label="Home"
            className="flex h-12 w-16 items-center justify-center rounded-full transition-colors active:bg-foreground/[0.06]"
          >
            <span
              className={`h-[17px] w-[17px] rounded-full border-[1.5px] transition-colors ${
                screen === 'home' ? 'border-primary bg-primary/15' : 'border-foreground/45'
              }`}
            />
          </button>

          <button
            onClick={openRecents}
            aria-label="Recent apps"
            className="flex h-12 w-16 items-center justify-center rounded-full transition-colors active:bg-foreground/[0.06]"
          >
            <span
              className={`h-[15px] w-[15px] rounded-[3px] border-[1.5px] transition-colors ${
                screen === 'recents' ? 'border-primary bg-primary/15' : 'border-foreground/45'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Overlays */}
      <AnimatePresence>
        {overlay === 'drawer' && (
          <MobileDrawer
            focusSearch={drawerFocus}
            onClose={() => setOverlay('none')}
            onOpenApp={openApp}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {overlay === 'shade' && (
          <MobileShade
            time={clock.time}
            dateLabel={clock.date}
            brightness={brightness}
            onBrightnessChange={setBrightness}
            onClose={() => setOverlay('none')}
            onOpenApp={openApp}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
