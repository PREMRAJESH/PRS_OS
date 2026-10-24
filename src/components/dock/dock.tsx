'use client'

import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, type MotionValue } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { useOSStore, type WindowType, type Window } from '@/store/os-store'
import {
  FolderOpen,
  Terminal,
  Code,
  Github,
  Globe,
  Mail,
  FileText,
  History,
  Settings,
  Sparkles,
  User,
  GraduationCap,
  Briefcase,
  Award,
  BookOpen,
} from 'lucide-react'

type IconComponent = typeof FolderOpen

interface DockApp {
  type: WindowType
  icon: IconComponent
  label: string
}

const dockItems: DockApp[] = [
  { type: 'projects', icon: FolderOpen, label: 'Projects' },
  { type: 'terminal', icon: Terminal, label: 'Terminal' },
  { type: 'runtime', icon: Globe, label: 'Runtime' },
  { type: 'github', icon: Github, label: 'GitHub' },
  { type: 'skills', icon: Code, label: 'Skills' },
]

const WINDOW_ICONS: Record<WindowType, IconComponent> = {
  projects: FolderOpen,
  terminal: Terminal,
  resume: FileText,
  skills: Code,
  timeline: History,
  settings: Settings,
  'ai-assistant': Sparkles,
  about: User,
  github: Github,
  runtime: Globe,
  'quick-links': Mail,
  education: GraduationCap,
  experience: Briefcase,
  certifications: Award,
}

export function Dock() {
  const { openWindow, windows, activeWindow, toggleMinimize } = useOSStore()
  const mouseX = useMotionValue(Infinity)

  const dynamicWindows = windows.filter(w => !dockItems.find(d => d.type === w.type))

  return (
    <motion.div
      initial={{ y: 24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.35, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[1000]"
    >
      <div className="flex items-end gap-1.5 px-2.5 py-2 rounded-2xl bg-glass backdrop-blur-xl border border-hairline shadow-[0_24px_60px_-20px_rgba(10,7,4,0.85),inset_0_1px_0_rgba(255,248,236,0.05)]">
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
                  toggleMinimize(openInstances[0].id)
                } else {
                  openWindow(item.type, undefined, undefined, pos)
                }
              }}
            />
          )
        })}

        {dynamicWindows.length > 0 && (
          <span className="w-px h-7 bg-hairline mx-1 mb-2 rounded-full" />
        )}

        {dynamicWindows.map((win) => (
          <DockIcon
            key={win.id}
            mouseX={mouseX}
            app={{ type: win.type, icon: WINDOW_ICONS[win.type] ?? BookOpen, label: win.title }}
            isActive={win.id === activeWindow}
            hasOpenWindow
            isMinimized={win.isMinimized}
            windows={[win]}
            onClick={() => toggleMinimize(win.id)}
          />
        ))}
      </div>
    </motion.div>
  )
}

interface DockIconProps {
  mouseX: MotionValue<number>
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

  const widthSync = useTransform(distance, [-140, 0, 140], [42, 62, 42])
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 220, damping: 18 })

  // Stable key: only re-sync when the set of window IDs changes
  const windowIds = windows.map(w => w.id).join(',')

  useEffect(() => {
    if (!ref.current || windowIds.length === 0) return

    const syncRect = () => {
      const bounds = ref.current?.getBoundingClientRect()
      if (!bounds) return
      const rect = { x: bounds.left, y: bounds.top, width: bounds.width, height: bounds.height }
      windowIds.split(',').forEach(id => setDockRect(id, rect))
    }

    const frame = requestAnimationFrame(syncRect)
    window.addEventListener('resize', syncRect)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', syncRect)
    }
  }, [windowIds, setDockRect])

  const handleClick = () => {
    const bounds = ref.current?.getBoundingClientRect()
    if (bounds) {
      onClick({
        x: bounds.left + bounds.width / 2,
        y: bounds.top + bounds.height / 2,
      })
    }
  }

  return (
    <div className="flex flex-col items-center group relative">
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.96 }}
            animate={{ opacity: 1, y: -10, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.96 }}
            transition={{ duration: 0.14, ease: 'easeOut' }}
            className="absolute -top-10 px-2.5 py-1 rounded-md bg-popover text-[11px] whitespace-nowrap pointer-events-none shadow-[0_10px_30px_rgba(10,7,4,0.65)] border border-hairline text-foreground/85"
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
        whileTap={{ scale: 0.92 }}
        aria-label={app.label}
        className={`
          relative flex items-center justify-center rounded-[13px] transition-colors duration-200
          ${isActive
            ? 'bg-foreground/[0.09] text-primary'
            : 'bg-foreground/[0.025] text-foreground/45 hover:bg-foreground/[0.06] hover:text-foreground/80'
          }
          ${isMinimized ? 'opacity-70' : ''}
        `}
      >
        <app.icon className="w-[44%] h-[44%]" strokeWidth={1.6} />

        {hasOpenWindow && (
          <span
            className={`absolute -bottom-1.5 w-1 h-1 rounded-full transition-colors duration-200 ${
              isActive ? 'bg-primary' : isMinimized ? 'bg-foreground/30' : 'bg-foreground/45'
            }`}
          />
        )}
      </motion.button>
    </div>
  )
}
