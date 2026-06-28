'use client'

import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion'
import { useOSStore } from '@/store/os-store'
import { Sidebar } from '../sidebar/sidebar'
import { Dock } from '../dock/dock'
import { TopBar } from './top-bar'
import { WindowManager } from './window-manager'
import { CommandPalette } from '../command/command-palette'
import { ActiveWorkspace } from './active-workspace'
import { useEffect, useCallback, useRef } from 'react'

export function Desktop() {
  const { commandPaletteOpen, toggleCommandPalette, openWindow, setWorkArea, sidebarCollapsed } = useOSStore()
  // Mouse reactive lighting
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const springX = useSpring(mouseX, { stiffness: 40, damping: 30 })
  const springY = useSpring(mouseY, { stiffness: 40, damping: 30 })

  // Subtle depth parallax on ambient lights
  const ambientX = useTransform(springX, [0, typeof window !== 'undefined' ? window.innerWidth : 1920], [-30, 30])
  const ambientY = useTransform(springY, [0, typeof window !== 'undefined' ? window.innerHeight : 1080], [-20, 20])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    mouseX.set(e.clientX)
    mouseY.set(e.clientY)
  }, [mouseX, mouseY])

  // ── Measure the real usable work area (<main>) so windows can fit inside it ──
  const workspaceRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = workspaceRef.current
    if (!el) return

    const sync = () => {
      const rect = el.getBoundingClientRect()
      // Guard against zero-size during initial mount
      if (rect.width === 0 || rect.height === 0) return
      setWorkArea({
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
      })
    }

    // Initial measurement (deferred so layout has settled)
    const frame = requestAnimationFrame(sync)

    // Track any size changes to <main> (viewport resize, sidebar collapse/expand, etc.)
    const ro = new ResizeObserver(sync)
    ro.observe(el)

    window.addEventListener('resize', sync)
    return () => {
      cancelAnimationFrame(frame)
      ro.disconnect()
      window.removeEventListener('resize', sync)
    }
  }, [setWorkArea, sidebarCollapsed])

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
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={handleMouseMove}
      className="h-screen w-screen flex flex-col overflow-hidden bg-background selection:bg-primary/30"
    >
      {/* ── Spatial Continuity: Layered Ambient Lighting ── */}

      {/* Primary ambient – follows mouse with soft parallax */}
      <motion.div 
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          x: ambientX,
          y: ambientY,
        }}
      >
        <div 
          className="absolute top-[-10%] left-[20%] w-[800px] h-[800px] rounded-full opacity-[0.06]"
          style={{
            background: 'radial-gradient(circle, oklch(0.72 0.16 200 / 0.5) 0%, transparent 60%)',
            filter: 'blur(80px)',
          }}
        />
        <div 
          className="absolute bottom-[-5%] right-[10%] w-[600px] h-[600px] rounded-full opacity-[0.04]"
          style={{
            background: 'radial-gradient(circle, oklch(0.68 0.18 180 / 0.5) 0%, transparent 60%)',
            filter: 'blur(60px)',
          }}
        />
      </motion.div>

      {/* Reactive spotlight – follows cursor directly */}
      <motion.div 
        className="fixed pointer-events-none z-0"
        style={{
          width: 900,
          height: 900,
          left: springX,
          top: springY,
          x: '-50%',
          y: '-50%',
          background: 'radial-gradient(circle, oklch(0.72 0.16 200 / 0.04) 0%, transparent 70%)',
        }}
      />

      {/* Background grid – very faint for depth */}
      <div className="fixed inset-0 opacity-[0.02] pointer-events-none z-0">
        <div className="w-full h-full bg-[linear-gradient(rgba(100,200,255,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(100,200,255,0.2)_1px,transparent_1px)] bg-[size:80px_80px]" />
      </div>

      {/* Top bar */}
      <TopBar />

      {/* Main workspace */}
      <div className="flex-1 flex overflow-hidden z-10">
        {/* Sidebar */}
        <Sidebar />

        {/* Main content area — windows live here, so this is the work area */}
        <main ref={workspaceRef} className="flex-1 relative overflow-hidden bg-background/30 workspace-glow">
          <ActiveWorkspace />
          <WindowManager />
        </main>
      </div>

      {/* Dock */}
      <Dock />

      {/* Command Palette */}
      <AnimatePresence>
        {commandPaletteOpen && <CommandPalette />}
      </AnimatePresence>
    </motion.div>
  )
}
