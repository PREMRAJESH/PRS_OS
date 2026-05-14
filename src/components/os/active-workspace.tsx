import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useOSStore } from '@/store/os-store'
import { projects, activityLogs, engineeringFocus, developerStatus } from '@/data/workspace'
import {
  Activity,
  GitBranch,
  Box,
  Brain,
  Terminal as TerminalIcon,
  Sparkles,
  ChevronRight,
  ArrowUpRight,
  Loader2,
} from 'lucide-react'

const logDotColors = {
  success: 'bg-emerald-400',
  info: 'bg-sky-400',
  process: 'bg-amber-400',
  warning: 'bg-orange-400',
  error: 'bg-red-400',
}

const stagger = {
  container: {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.06, delayChildren: 0.15 },
    },
  },
  item: {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 26 } },
  },
}

export function ActiveWorkspace() {
  const { windows, openWindow, toggleCommandPalette } = useOSStore()
  const hasActiveWindows = windows.filter(w => !w.isMinimized).length > 0
  const [isInitializing, setIsInitializing] = useState(false)

  const handleInitialize = useCallback(() => {
    setIsInitializing(true)
    // Cinematic system action: staggered window opens
    setTimeout(() => openWindow('projects'), 200)
    setTimeout(() => openWindow('terminal'), 600)
    setTimeout(() => setIsInitializing(false), 1000)
  }, [openWindow])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{
        opacity: hasActiveWindows ? 0.08 : 1,
        scale: hasActiveWindows ? 0.97 : 1,
        filter: hasActiveWindows ? 'blur(6px)' : 'blur(0px)',
      }}
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      className="absolute inset-0 overflow-y-auto pb-32 custom-scrollbar selection:bg-primary/20"
    >
      <motion.div
        variants={stagger.container}
        initial="hidden"
        animate="show"
        className="p-12 max-w-5xl mx-auto space-y-16"
      >
        {/* ── Header ── */}
        <motion.div variants={stagger.item} className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_16px_rgba(52,211,153,0.5)]" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/50">System Active</span>
          </div>
          <h1 className="text-5xl font-black tracking-tight text-white">
            {developerStatus.name}
          </h1>
          <div className="flex items-center gap-6 text-sm font-medium">
            <span className="text-primary">{developerStatus.role}</span>
            <div className="w-1 h-1 rounded-full bg-white/15" />
            <span className="text-foreground/50">{developerStatus.focus}</span>
            <div className="w-1 h-1 rounded-full bg-white/15" />
            <span className="font-mono text-xs text-foreground/30">{developerStatus.branch}</span>
          </div>
        </motion.div>

        {/* ── Core Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-8 space-y-14">

            {/* ── Active System Card ── */}
            <motion.div variants={stagger.item}>
              <SectionLabel icon={Box} label="Active System" />
              <div className="group relative">
                {/* Hover glow */}
                <div className="absolute -inset-3 rounded-[28px] bg-gradient-to-br from-primary/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                
                <div className="relative space-y-8">
                  <div className="flex items-start justify-between">
                    <div className="space-y-3">
                      <h2 className="text-2xl font-bold text-white tracking-tight">{projects[0].name}</h2>
                      <p className="text-foreground/50 max-w-lg leading-relaxed text-[15px]">{projects[0].description}</p>
                    </div>

                    {/* Initialize Workspace – SYSTEM ACTION */}
                    <motion.button 
                      onClick={handleInitialize}
                      disabled={isInitializing}
                      whileHover={{ scale: 1.03, y: -1 }}
                      whileTap={{ scale: 0.97 }}
                      className="relative px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all overflow-hidden group/btn
                        bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20
                        hover:from-primary/30 hover:via-primary/15 hover:to-primary/30
                        shadow-[0_4px_24px_-4px_rgba(120,200,255,0.15),0_0_0_1px_rgba(120,200,255,0.1)]
                        hover:shadow-[0_8px_40px_-4px_rgba(120,200,255,0.25),0_0_0_1px_rgba(120,200,255,0.2)]
                        text-primary disabled:opacity-50
                      "
                    >
                      {/* Shimmer sweep */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent btn-shimmer" />
                      
                      <span className="relative flex items-center gap-2.5">
                        {isInitializing ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            Initializing...
                          </>
                        ) : (
                          <>
                            <TerminalIcon className="w-3.5 h-3.5" />
                            Initialize Workspace
                            <ArrowUpRight className="w-3 h-3 opacity-50 group-hover/btn:opacity-100 transition-opacity" />
                          </>
                        )}
                      </span>
                    </motion.button>
                  </div>
                  
                  {/* Project metadata */}
                  <div className="flex gap-16 font-mono text-[10px] uppercase tracking-widest">
                    <div className="space-y-1.5">
                      <span className="block text-primary/60 font-bold">Status</span>
                      <span className="text-white/70 font-semibold">Stable Build</span>
                    </div>
                    <div className="space-y-1.5">
                      <span className="block text-primary/60 font-bold">Runtime</span>
                      <span className="text-white/70 font-semibold">{projects[0].stack.slice(0, 2).join(' + ')}</span>
                    </div>
                    <div className="space-y-1.5">
                      <span className="block text-primary/60 font-bold">Commit</span>
                      <span className="text-white/70 font-semibold">{projects[0].commitHash}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* ── Engineering Competencies ── */}
            <motion.div variants={stagger.item}>
              <SectionLabel icon={Brain} label="Competencies" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {engineeringFocus.map((focus, i) => (
                  <div key={i} className="space-y-2 group">
                    <div className="text-sm font-bold text-white/90 group-hover:text-primary transition-colors duration-300">{focus.label}</div>
                    <p className="text-xs text-foreground/45 leading-relaxed">{focus.description}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* ── Keyboard Shortcut Hint ── */}
            <motion.div variants={stagger.item}>
              <button
                onClick={toggleCommandPalette}
                className="group flex items-center gap-4 py-4 text-left w-full"
              >
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.03] group-hover:bg-white/[0.06] transition-colors">
                  <kbd className="text-[10px] font-mono font-bold text-foreground/30 group-hover:text-primary/60 transition-colors">⌘K</kbd>
                </div>
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-foreground/40 group-hover:text-foreground/70 transition-colors">Command Palette</div>
                  <div className="text-[10px] text-foreground/20 group-hover:text-foreground/40 transition-colors">Search, navigate, or launch any app</div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-foreground/10 group-hover:text-primary/50 ml-auto transition-colors" />
              </button>
            </motion.div>
          </div>

          {/* ── Right: Activity Log ── */}
          <div className="md:col-span-4 space-y-14">
            <motion.div variants={stagger.item}>
              <SectionLabel icon={Activity} label="Activity Log" />
              <div className="space-y-5 font-mono text-[10px]">
                {activityLogs.map((log, i) => (
                  <motion.div
                    key={i}
                    variants={stagger.item}
                    className="flex gap-4 group"
                  >
                    <div className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${logDotColors[log.type]} shadow-[0_0_8px_currentColor]`} />
                    <div className="space-y-1">
                      <div className="text-foreground/60 leading-snug group-hover:text-foreground/80 transition-colors">{log.message}</div>
                      <div className="text-foreground/20">{log.time}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ─── Sub-components ─────────────────────────────────────────────────── */

function SectionLabel({
  icon: Icon,
  label,
  action,
}: {
  icon: any
  label: string
  action?: { label: string; onClick: () => void }
}) {
  return (
    <div className="flex items-center justify-between mb-5 px-1">
      <div className="flex items-center gap-2.5">
        <Icon className="w-3.5 h-3.5 text-primary/80" />
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40">{label}</span>
      </div>
      {action && (
        <button
          onClick={action.onClick}
          className="text-[10px] font-bold uppercase tracking-widest text-foreground/30 hover:text-primary transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  )
}
