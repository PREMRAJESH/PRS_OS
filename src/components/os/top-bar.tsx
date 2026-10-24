'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useOSStore } from '@/store/os-store'
import { developerStatus } from '@/data/workspace'
import { Search, GitBranch, Command, Settings } from 'lucide-react'

export function TopBar() {
  const { toggleCommandPalette, openWindow } = useOSStore()
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
      initial={{ y: -12, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative h-12 flex items-center justify-between px-4 bg-background/70 backdrop-blur-xl z-50 shrink-0 shadow-[inset_0_-1px_0_var(--hairline)]"
    >
      {/* Left — identity */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => openWindow('about')}
          className="flex items-center gap-2.5 group"
          aria-label="Open profile"
        >
          <span className="w-6 h-6 rounded-[7px] border border-hairline flex items-center justify-center bg-surface/60 group-hover:border-primary/40 transition-colors">
            <span className="font-display text-[15px] leading-none text-primary -mt-px">P</span>
          </span>
          <span className="text-[11px] font-medium font-mono tracking-[0.16em] text-foreground/70 group-hover:text-foreground transition-colors">
            PRS—OS
          </span>
        </button>

        <span className="hidden sm:block h-3 w-px bg-hairline" />

        <div className="hidden sm:flex items-center gap-1.5 text-[10px] text-muted-foreground/70 font-mono">
          <GitBranch className="w-3 h-3" />
          <span className="hover:text-foreground/70 transition-colors cursor-default">{developerStatus.branch}</span>
        </div>
      </div>

      {/* Center — command / search */}
      <button
        onClick={toggleCommandPalette}
        className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2.5 px-3.5 py-1.5 rounded-lg bg-foreground/[0.025] border border-hairline text-muted-foreground/70 text-[11px] hover:bg-foreground/[0.05] hover:text-foreground/80 hover:border-hairline-strong transition-all duration-200 group w-64 max-w-[38vw]"
        aria-label="Search or run a command"
      >
        <Search className="w-3.5 h-3.5 shrink-0 text-muted-foreground/60 group-hover:text-primary/80 transition-colors" />
        <span className="flex-1 text-left tracking-wide">Search or jump to…</span>
        <kbd className="flex items-center gap-0.5 px-1.5 py-0.5 rounded border border-hairline bg-foreground/[0.03] text-[9px] font-mono text-muted-foreground/50">
          <Command className="w-2.5 h-2.5" />K
        </kbd>
      </button>

      {/* Right — status */}
      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-2 text-[10px] font-mono text-muted-foreground/70">
          <span className="w-1.5 h-1.5 rounded-full bg-accent" />
          <span>Open to internships</span>
        </div>

        <span className="hidden md:block h-3 w-px bg-hairline" />

        <button
          onClick={() => openWindow('settings')}
          className="p-1.5 rounded-md text-muted-foreground/70 hover:text-foreground/80 hover:bg-foreground/[0.04] transition-colors"
          aria-label="Open settings"
        >
          <Settings className="w-3.5 h-3.5" />
        </button>

        <div className="flex items-baseline gap-2.5 text-[11px] tabular">
          <span className="hidden sm:inline text-muted-foreground/45">{currentDate}</span>
          <span className="font-mono text-foreground/80 tracking-wide">{currentTime}</span>
        </div>
      </div>
    </motion.header>
  )
}
