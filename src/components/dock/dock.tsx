'use client'

import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { useOSStore, type WindowType, type Window } from '@/store/os-store'
import {
  FolderOpen,
  Terminal,
  Code,
  Github,
  Globe,
  Mail,
  BookOpen,
  User,
  Brain,
} from 'lucide-react'

interface DockApp {
  type: WindowType
  icon: any
  label: string
  color: string
  activeGlow: string
}

const dockItems: DockApp[] = [
  { type: 'projects',  icon: FolderOpen, label: 'Projects',  color: 'text-sky-400',     activeGlow: 'rgba(56,189,248,0.3)' },
  { type: 'terminal',  icon: Terminal,   label: 'Terminal',   color: 'text-emerald-400', activeGlow: 'rgba(52,211,153,0.3)' },
  { type: 'runtime',   icon: Globe,      label: 'Runtime',    color: 'text-violet-400',  activeGlow: 'rgba(167,139,250,0.3)' },
  { type: 'github',    icon: Github,     label: 'GitHub',     color: 'text-white/80',    activeGlow: 'rgba(255,255,255,0.15)' },
  { type: 'skills',    icon: Code,       label: 'Skills',     color: 'text-rose-400',    activeGlow: 'rgba(251,113,133,0.2)' },
]

export function Dock() {
  const { openWindow, windows, activeWindow, toggleMinimize } = useOSStore()
  const mouseX = useMotionValue(Infinity)

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.4, type: 'spring', stiffness: 300, damping: 24 }}
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[1000]"
    >
      <div className="flex items-end gap-2.5 px-4 py-3 rounded-[24px] bg-[oklch(0.08_0.01_240/0.75)] shadow-[0_24px_80px_-12px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.06)] ring-1 ring-inset ring-white/5">
        {dockItems.map((item) => {
          const openInstances = windows.filter(w => w.type === item.type)
          const isActive = openInstances.some(w => w.id === activeWindow)
          const hasOpenWindow = openInstances.length > 0
          const isMinimized = openInstances.every(w => w.isMinimized) && hasOpenWindow

          return (
            <DockIcon
              key={item.type}
              mouseX={mouseX}
              app={item}
              isActive={isActive}
              hasOpenWindow={hasOpenWindow}
              isMinimized={isMinimized}
              windows={openInstances}
              onClick={(pos) => {
                if (hasOpenWindow) {
                  // If we have instances, toggle the first one (standard behavior)
                  toggleMinimize(openInstances[0].id)
                } else {
                  openWindow(item.type, undefined, undefined, pos)
                }
              }}
            />
          )
        })}
        
        {/* Separator */}
        {windows.some(w => !dockItems.find(d => d.type === w.type)) && (
          <div className="w-px h-8 bg-white/[0.08] mx-1 mb-2 rounded-full" />
        )}
        
        {/* Dynamic apps (windows not in default dock) */}
        {windows.filter(w => !dockItems.find(d => d.type === w.type)).map((win) => {
          return (
            <DockIcon
              key={win.id}
              mouseX={mouseX}
              app={{ 
                type: win.type, 
                icon: getIconForType(win.type), 
                label: win.title, 
                color: 'text-white/60', 
                activeGlow: 'rgba(255,255,255,0.1)' 
              }}
              isActive={win.id === activeWindow}
              hasOpenWindow={true}
              isMinimized={win.isMinimized}
              windows={[win]}
              onClick={() => toggleMinimize(win.id)}
            />
          )
        })}
      </div>
    </motion.div>
  )
}

function getIconForType(type: WindowType) {
  const icons: Record<WindowType, any> = {
    projects: FolderOpen,
    terminal: Terminal,
    resume: BookOpen,
    skills: Code,
    timeline: BookOpen,
    settings: Code,
    about: User,
    github: Github,
    runtime: Globe,
    'ai-assistant': Brain,
    'quick-links': Mail,
  }
  return icons[type] || BookOpen
}

interface DockIconProps {
  mouseX: any
  app: DockApp
  isActive: boolean
  hasOpenWindow: boolean
  isMinimized?: boolean
  windows: Window[]
  onClick: (pos: { x: number; y: number }) => void
}

function DockIcon({ mouseX, app, isActive, hasOpenWindow, isMinimized, windows, onClick }: DockIconProps) {
  const ref = useRef<HTMLButtonElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const { setDockRect } = useOSStore()
  
  const distance = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 }
    return val - (bounds.x + bounds.width / 2)
  })

  const widthSync = useTransform(distance, [-150, 0, 150], [48, 72, 48])
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 220, damping: 16 })

  // Stable key: only re-sync when the set of window IDs changes, not on every store update
  const windowIds = windows.map(w => w.id).join(',')

  // Update window's dockRect for minimize/restore animation
  useEffect(() => {
    if (!ref.current || windowIds.length === 0) return

    const syncRect = () => {
      const bounds = ref.current?.getBoundingClientRect()
      if (!bounds) return
      const rect = { x: bounds.left, y: bounds.top, width: bounds.width, height: bounds.height }
      windowIds.split(',').forEach(id => setDockRect(id, rect))
    }

    // Initial sync (deferred to avoid layout thrash)
    const frame = requestAnimationFrame(syncRect)
    window.addEventListener('resize', syncRect)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', syncRect)
    }
  }, [windowIds, setDockRect])

  const handleClick = (e: React.MouseEvent) => {
    const bounds = ref.current?.getBoundingClientRect()
    if (bounds) {
      onClick({ 
        x: bounds.left + bounds.width / 2, 
        y: bounds.top + bounds.height / 2 
      })
    }
  }

  return (
    <div className="flex flex-col items-center group relative">
      {/* Tooltip */}
      <AnimatePresence>
        {isHovered && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: -12, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 500, damping: 28 }}
            className="absolute -top-12 px-3 py-1.5 rounded-xl bg-[oklch(0.12_0.01_240/0.98)] text-[10px] font-black uppercase tracking-wider text-white/90 whitespace-nowrap pointer-events-none shadow-[0_12px_40px_rgba(0,0,0,0.7)] border border-white/10"
          >
            {app.label}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        ref={ref}
        style={{ width, height: width }}
        onPointerDown={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileTap={{ scale: 0.8, y: 4 }}
        className={`
          relative flex items-center justify-center rounded-[18px] transition-all duration-500
          ${isActive 
            ? `bg-white/[0.12] ${app.color} shadow-[0_0_20px_${app.activeGlow}]` 
            : 'bg-white/[0.04] text-white/40 hover:bg-white/[0.08] hover:text-white/80'
          }
          ${isMinimized ? 'opacity-60 ring-1 ring-white/10' : ''}
        `}
      >
        <app.icon className="w-[45%] h-[45%] transition-transform duration-300 group-hover:scale-110" />
        
        {/* Active indicator dot — always visible for minimized windows */}
        {hasOpenWindow && (
          <div 
            className={`absolute -bottom-2 w-1.5 h-1.5 rounded-full transition-all duration-500 ${
              isActive 
                ? `bg-current shadow-[0_0_8px_currentColor] scale-100` 
                : isMinimized
                  ? 'bg-white/50 scale-100'
                  : 'bg-white/30 scale-75'
            }`}
          />
        )}

        {/* Active glow ring */}
        {isActive && (
          <motion.div 
            layoutId="dock-active-glow"
            className="absolute inset-[-4px] rounded-[22px] -z-10"
            style={{
              background: `radial-gradient(circle, ${app.activeGlow}, transparent 75%)`,
            }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          />
        )}
      </motion.button>
    </div>
  )
}
