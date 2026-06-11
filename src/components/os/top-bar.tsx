'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useOSStore } from '@/store/os-store'
import { developerStatus } from '@/data/workspace'
import {
  Search,
  Wifi,
  Volume2,
  GitBranch,
  Command,
} from 'lucide-react'

export function TopBar() {
  const { toggleCommandPalette } = useOSStore()
  const [currentTime, setCurrentTime] = useState<string>('')
  const [currentDate, setCurrentDate] = useState<string>('')

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })
      )
      setCurrentDate(
        now.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
        })
      )
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="h-11 flex items-center justify-between px-4 bg-[oklch(0.07_0.01_240/0.8)] z-50 shrink-0 shadow-[0_1px_0_rgba(255,255,255,0.03)]"
    >
      {/* ── Left: Brand + Branch ───────────────── */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 group cursor-default">
          <div className="w-5 h-5 rounded-md bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-[0_2px_8px_rgba(120,200,255,0.2)] transition-transform group-hover:scale-110">
            <span className="text-[9px] font-black text-background leading-none">P</span>
          </div>
          <span className="text-xs font-bold font-mono text-foreground/80 tracking-tight group-hover:text-primary transition-colors">PRS-OS</span>
        </div>

        <div className="h-3.5 w-px bg-white/[0.06]" />

        <div className="flex items-center gap-1.5 text-[10px] text-foreground/30 font-mono uppercase tracking-widest">
          <GitBranch className="w-3 h-3" />
          <span className="hover:text-primary/70 transition-colors cursor-default">{developerStatus.branch}</span>
        </div>
      </div>

      {/* ── Center: Command / Search Bar ────────── */}
      <button
        onClick={toggleCommandPalette}
        className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2.5 px-4 py-1.5 rounded-xl bg-white/[0.03] text-foreground/25 text-[11px] hover:bg-white/[0.06] hover:text-foreground/50 transition-all duration-300 group w-72 max-w-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]"
      >
        <Search className="w-3.5 h-3.5 shrink-0 group-hover:text-primary/60 transition-colors" />
        <span className="flex-1 text-left font-medium tracking-wide">Search or run command...</span>
        <kbd className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-white/[0.04] text-[9px] font-mono text-foreground/20 group-hover:text-primary/40 transition-colors">
          <Command className="w-2.5 h-2.5" />K
        </kbd>
      </button>

      {/* ── Right: System status ─────────────── */}
      <div className="flex items-center gap-4 text-foreground/30">
        <div className="flex items-center gap-0.5">
          <button className="p-1.5 rounded-lg hover:bg-white/[0.04] hover:text-foreground/60 transition-all active:scale-90">
            <Wifi className="w-3.5 h-3.5" />
          </button>
          <button className="p-1.5 rounded-lg hover:bg-white/[0.04] hover:text-foreground/60 transition-all active:scale-90">
            <Volume2 className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="h-3 w-px bg-white/[0.06]" />

        <div className="flex items-center gap-3 text-[11px] font-bold">
          <span className="text-foreground/20 uppercase tracking-[0.1em]">{currentDate}</span>
          <span className="font-mono text-foreground/70 tabular-nums tracking-wider">{currentTime}</span>
        </div>
      </div>
    </motion.header>
  )
}
