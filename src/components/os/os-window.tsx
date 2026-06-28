import { useRef, useState, useEffect, type ReactNode, useCallback } from 'react'
import { motion, useMotionValue, useSpring, useTransform, useVelocity } from 'framer-motion'
import { useOSStore, type Window } from '@/store/os-store'
import { X, Minus, Maximize2, Minimize2 } from 'lucide-react'

/* ─── Constants ─── */
const TITLE_BAR_H = 40
const MIN_W = 320
const MIN_H = 240
const EDGE_SNAP = 24  // Pixels from edge to snap
const MIN_VISIBLE_HEADER = 100 // Minimum width of titlebar that must stay visible

interface OSWindowProps {
  window: Window
  children: ReactNode
}

export function OSWindow({ window: win, children }: OSWindowProps) {
  const {
    closeWindow,
    focusWindow,
    minimizeWindow,
    maximizeWindow,
    activeWindow,
    updateWindowPosition,
    updateWindowSize,
    workArea,
  } = useOSStore()

  const windowRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const isActive = activeWindow === win.id

  // ── Motion values: isolated from React render cycle ──
  const x = useMotionValue(win.position.x)
  const y = useMotionValue(win.position.y)
  const w = useMotionValue(win.size.width)
  const h = useMotionValue(win.size.height)

  // Velocity for physics effects
  const xVel = useVelocity(x)
  const rotY = useTransform(xVel, [-3000, 0, 3000], [-2.5, 0, 2.5])
  const smoothRotY = useSpring(rotY, { stiffness: 150, damping: 25 })

  // Sync motion values from store when not interacting
  useEffect(() => {
    if (!isDragging && !isResizing) {
      x.set(win.position.x)
      y.set(win.position.y)
      w.set(win.size.width)
      h.set(win.size.height)
    }
  }, [win.position.x, win.position.y, win.size.width, win.size.height, isDragging, isResizing, x, y, w, h])

  // ── Viewport clamping & Snapping ──
  // Window x/y are LOCAL to the desktop <main> (its offset parent), so the
  // usable space spans [0..workArea.width] × [0..workArea.height].
  const getClampedPos = useCallback((rawX: number, rawY: number): [number, number] => {
    const { width: areaW, height: areaH } = workArea
    const curW = w.get()
    const curH = h.get()

    let cx = rawX
    let cy = rawY

    // Snapping logic (relative to the work area edges)
    if (Math.abs(cx) < EDGE_SNAP) cx = 0
    if (Math.abs(cx + curW - areaW) < EDGE_SNAP) cx = areaW - curW
    if (Math.abs(cy) < EDGE_SNAP) cy = 0
    if (Math.abs(cy + curH - areaH) < EDGE_SNAP) cy = areaH - curH

    // Hard constraints: never lose the window within the work area
    cx = Math.min(Math.max(0, cx), Math.max(0, areaW - MIN_VISIBLE_HEADER))
    cy = Math.min(Math.max(0, cy), Math.max(0, areaH - TITLE_BAR_H))

    return [cx, cy]
  }, [w, h, workArea])

  // ── Drag handler ──
  const handleDragStart = useCallback((e: React.PointerEvent) => {
    if (win.isMaximized || isResizing || win.isMinimized) return
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
    focusWindow(win.id)

    const startX = x.get()
    const startY = y.get()
    const offsetX = e.clientX - startX
    const offsetY = e.clientY - startY

    const onMove = (ev: PointerEvent) => {
      const [cx, cy] = getClampedPos(ev.clientX - offsetX, ev.clientY - offsetY)
      x.set(cx)
      y.set(cy)
    }

    const onUp = () => {
      setIsDragging(false)
      updateWindowPosition(win.id, { x: x.get(), y: y.get() })
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
  }, [win.isMaximized, win.isMinimized, win.id, isResizing, x, y, focusWindow, updateWindowPosition, getClampedPos])

  // ── Resize handler ──
  const handleResizeStart = useCallback((e: React.PointerEvent, edges: string) => {
    if (win.isMinimized) return
    e.stopPropagation()
    e.preventDefault()
    setIsResizing(true)
    focusWindow(win.id)

    const startMX = e.clientX
    const startMY = e.clientY
    const startW = w.get()
    const startH = h.get()
    const startX = x.get()
    const startY = y.get()

    const onMove = (ev: PointerEvent) => {
      const dx = ev.clientX - startMX
      const dy = ev.clientY - startMY

      if (edges.includes('e')) w.set(Math.max(MIN_W, startW + dx))
      if (edges.includes('s')) h.set(Math.max(MIN_H, startH + dy))
      if (edges.includes('w')) {
        const newW = Math.max(MIN_W, startW - dx)
        w.set(newW)
        x.set(startX + (startW - newW))
      }
      if (edges.includes('n')) {
        const newH = Math.max(MIN_H, startH - dy)
        h.set(newH)
        y.set(startY + (startH - newH))
      }
    }

    const onUp = () => {
      setIsResizing(false)
      updateWindowPosition(win.id, { x: x.get(), y: y.get() })
      updateWindowSize(win.id, { width: w.get(), height: h.get() })
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
  }, [win.id, win.isMinimized, w, h, x, y, focusWindow, updateWindowPosition, updateWindowSize])

  // ── Animation Setup ──
  const dockRect = win.dockRect
  // Dock rect is measured in screen coords; convert to <main>-local space so the
  // minimized window flies toward the actual dock icon.
  const dockX = dockRect ? dockRect.x + dockRect.width / 2 - workArea.left : workArea.width / 2
  const dockY = dockRect ? dockRect.y + dockRect.height / 2 - workArea.top : workArea.height

  const variants: any = {
    standard: {
      opacity: 1,
      scale: 1,
      x: x.get(),
      y: y.get(),
      width: w.get(),
      height: h.get(),
      borderRadius: 14,
      filter: 'blur(0px) brightness(1)',
      pointerEvents: 'auto',
      transition: {
        type: 'spring',
        stiffness: 380,
        damping: 30,
        mass: 0.8,
      }
    },
    maximized: {
      opacity: 1,
      scale: 1,
      // Windows are absolute-positioned inside the desktop <main>, so local
      // origin (0,0) maps to the top-left of that <main>. Filling its measured
      // width/height guarantees the window never overflows the work area.
      x: 0,
      y: 0,
      width: workArea.width,
      height: workArea.height,
      borderRadius: 0,
      filter: 'blur(0px) brightness(1)',
      pointerEvents: 'auto',
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 32,
      }
    },
    minimized: {
      opacity: 0,
      scale: 0.1,
      x: dockX - (win.size.width / 2),
      y: dockY - (win.size.height / 2),
      filter: 'blur(10px) brightness(0.5)',
      pointerEvents: 'none',
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 38,
        mass: 1,
      }
    },
    inactive: {
      opacity: 1,
      scale: 0.995,
      x: x.get(),
      y: y.get(),
      width: w.get(),
      height: h.get(),
      borderRadius: 14,
      filter: 'brightness(0.85)',
      pointerEvents: 'auto',
      transition: { duration: 0.4 }
    }
  }

  const currentState = win.isMinimized 
    ? 'minimized' 
    : (win.isMaximized ? 'maximized' : (isActive ? 'standard' : 'inactive'))

  const triggerPos = win.triggerPosition

  return (
    <motion.div
      ref={windowRef}
      initial={triggerPos ? {
        opacity: 0,
        scale: 0.2,
        // triggerPos is screen coords from the dock icon; convert to <main>-local space
        x: triggerPos.x - workArea.left - win.size.width/2,
        y: triggerPos.y - workArea.top - win.size.height/2
      } : 'minimized'}
      animate={currentState}
      variants={variants}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: win.zIndex,
        rotateY: isDragging ? smoothRotY : 0,
        perspective: 1000,
        willChange: 'transform, width, height, opacity',
      } as any}
      onPointerDown={() => focusWindow(win.id)}
      className={`
        flex flex-col overflow-hidden absolute
        bg-[oklch(0.09_0.01_240/0.92)]
        transition-shadow duration-500 ease-out
        ${isActive
          ? 'shadow-[var(--shadow-window)] ring-1 ring-white/[0.12]'
          : 'shadow-[var(--shadow-window-inactive)] ring-1 ring-white/[0.04]'
        }
        ${isDragging || isResizing
          ? 'shadow-[0_60px_130px_-20px_rgba(0,0,0,0.95)] transition-none'
          : ''
        }
      `}
    >
      {/* ── Title bar ── */}
      <div
        className={`
          h-10 flex items-center justify-between px-3.5
          ${isActive ? 'bg-white/[0.06]' : 'bg-transparent'}
          select-none touch-none
          ${win.isMaximized ? 'cursor-default' : isDragging ? 'cursor-grabbing' : 'cursor-grab'}
        `}
        onPointerDown={handleDragStart}
        onDoubleClick={() => maximizeWindow(win.id)}
      >
        <div className="flex items-center gap-2.5 z-10">
          <button
            onClick={(e) => { e.stopPropagation(); closeWindow(win.id) }}
            className="w-3.5 h-3.5 rounded-full bg-[#ff5f57] hover:bg-[#ff4136] transition-all group flex items-center justify-center shadow-[inset_0_-1px_1px_rgba(0,0,0,0.2)] active:scale-90"
          >
            <X className="w-2 h-2 text-black/70 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); minimizeWindow(win.id) }}
            className="w-3.5 h-3.5 rounded-full bg-[#ffbd2e] hover:bg-[#f5a623] transition-all group flex items-center justify-center shadow-[inset_0_-1px_1px_rgba(0,0,0,0.2)] active:scale-90"
          >
            <Minus className="w-2 h-2 text-black/70 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); maximizeWindow(win.id) }}
            className="w-3.5 h-3.5 rounded-full bg-[#27c93f] hover:bg-[#1fb734] transition-all group flex items-center justify-center shadow-[inset_0_-1px_1px_rgba(0,0,0,0.2)] active:scale-90"
          >
            {win.isMaximized
              ? <Minimize2 className="w-1.5 h-1.5 text-black/70 opacity-0 group-hover:opacity-100 transition-opacity" />
              : <Maximize2 className="w-1.5 h-1.5 text-black/70 opacity-0 group-hover:opacity-100 transition-opacity" />
            }
          </button>
        </div>

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className={`text-[11px] font-bold tracking-[0.05em] uppercase transition-colors ${isActive ? 'text-foreground/60' : 'text-muted-foreground/30'}`}>
            {win.title}
          </span>
        </div>
        <div className="w-20" />
      </div>

      {/* ── Content ── */}
      <div className="flex-1 overflow-hidden bg-background/60 relative">
        <div className={`w-full h-full ${win.isMinimized ? 'pointer-events-none' : ''}`}>
          {children}
        </div>
      </div>

      {/* ── Resize handles (all edges + corners) ── */}
      {!win.isMaximized && !win.isMinimized && (
        <>
          {/* Edges */}
          <div className="absolute right-0 top-10 bottom-0 w-2 cursor-e-resize z-20 group" onPointerDown={(e) => handleResizeStart(e, 'e')}>
             <div className="w-full h-full hover:bg-primary/5 transition-colors" />
          </div>
          <div className="absolute left-0 top-10 bottom-0 w-2 cursor-w-resize z-20 group" onPointerDown={(e) => handleResizeStart(e, 'w')}>
             <div className="w-full h-full hover:bg-primary/5 transition-colors" />
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-2 cursor-s-resize z-20 group" onPointerDown={(e) => handleResizeStart(e, 's')}>
             <div className="w-full h-full hover:bg-primary/5 transition-colors" />
          </div>
          {/* Corners */}
          <div className="absolute bottom-0 right-0 w-6 h-6 cursor-se-resize z-30" onPointerDown={(e) => handleResizeStart(e, 'se')} />
          <div className="absolute bottom-0 left-0 w-6 h-6 cursor-sw-resize z-30" onPointerDown={(e) => handleResizeStart(e, 'sw')} />
        </>
      )}
    </motion.div>
  )
}

