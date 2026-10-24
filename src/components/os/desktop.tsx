'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useOSStore } from '@/store/os-store'
import { Sidebar } from '../sidebar/sidebar'
import { Dock } from '../dock/dock'
import { TopBar } from './top-bar'
import { WindowManager } from './window-manager'
import { CommandPalette } from '../command/command-palette'
import { ActiveWorkspace } from './active-workspace'
import { useEffect, useRef } from 'react'

export function Desktop() {
  const { commandPaletteOpen, toggleCommandPalette, setWorkArea, sidebarCollapsed, currentTheme } = useOSStore()

  // ── Measure the real usable work area (<main>) so windows can fit inside it ──
  const workspaceRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = workspaceRef.current
    if (!el) return

    const sync = () => {
      const rect = el.getBoundingClientRect()
      if (rect.width === 0 || rect.height === 0) return
      // The dock floats over the workspace, so keep windows clear of it.
      const dockReserve = 72
      setWorkArea({
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: Math.max(240, rect.height - dockReserve),
      })
    }

    const frame = requestAnimationFrame(sync)
    const ro = new ResizeObserver(sync)
    ro.observe(el)

    window.addEventListener('resize', sync)
    return () => {
      cancelAnimationFrame(frame)
      ro.disconnect()
      window.removeEventListener('resize', sync)
    }
  }, [setWorkArea, sidebarCollapsed])

  // Apply theme class to HTML element
  useEffect(() => {
    const root = document.documentElement
    const previous = Array.from(root.classList).find(c => c.startsWith('theme-'))
    if (previous) root.classList.remove(previous)
    root.classList.add(`theme-${currentTheme}`)
  }, [currentTheme])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        toggleCommandPalette()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [toggleCommandPalette])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="desktop-texture h-screen w-screen flex flex-col overflow-hidden selection:bg-primary/25"
    >
      {/* Film grain — breaks digital flatness without adding noise */}
      <div className="grain" aria-hidden="true" />

      <TopBar />

      {/* Main workspace */}
      <div className="flex-1 flex overflow-hidden z-10">
        <Sidebar />

        <main
          id="workspace"
          ref={workspaceRef}
          className="flex-1 relative overflow-hidden bg-transparent workspace-glow"
        >
          <ActiveWorkspace />
          <WindowManager />
        </main>
      </div>

      <Dock />

      <AnimatePresence>
        {commandPaletteOpen && <CommandPalette />}
      </AnimatePresence>
    </motion.div>
  )
}
