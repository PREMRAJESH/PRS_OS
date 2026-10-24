'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, Search, X } from 'lucide-react'
import { projectsData } from '@/data/projects'
import { APP_TONES, MOBILE_APPS, type MobileAppId } from './mobile-apps'

const PROJECT_META: Record<string, { index: string; discipline: string }> = {
  neuroscan: { index: '01', discipline: 'AI / ML' },
  studyflow: { index: '02', discipline: 'Full stack / AI' },
  nimbusx: { index: '03', discipline: 'Mobile' },
  codeviz: { index: '04', discipline: 'Developer tooling' },
}

interface MobileDrawerProps {
  focusSearch: boolean
  onClose: () => void
  onOpenApp: (app: MobileAppId) => void
}

export function MobileDrawer({ focusSearch, onClose, onOpenApp }: MobileDrawerProps) {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!focusSearch) return
    const timer = window.setTimeout(() => inputRef.current?.focus(), 260)
    return () => window.clearTimeout(timer)
  }, [focusSearch])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return MOBILE_APPS
    return MOBILE_APPS.filter(
      (app) =>
        app.name.toLowerCase().includes(q) ||
        app.short.toLowerCase().includes(q) ||
        app.description.toLowerCase().includes(q),
    )
  }, [query])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="absolute inset-0 z-50"
      role="dialog"
      aria-modal="true"
      aria-label="All apps"
    >
      <button
        aria-label="Close app drawer"
        onClick={onClose}
        className="absolute inset-0 bg-background/55 backdrop-blur-[2px]"
      />

      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 320, damping: 34, mass: 0.9 }}
        className="absolute inset-x-0 bottom-0 top-9 flex flex-col overflow-hidden rounded-t-[30px] border-t border-hairline-strong bg-window/97 backdrop-blur-2xl md:top-auto md:max-h-[92%]"
      >
        <div className="mx-auto mt-2.5 h-1 w-9 shrink-0 rounded-full bg-foreground/15" />

        <div className="px-5 pb-2 pt-3 md:px-8">
          <div className="mx-auto flex w-full max-w-3xl items-center justify-between">
            <div>
              <p className="text-[9px] font-mono uppercase tracking-[0.14em] text-muted-foreground/40">
                App drawer
              </p>
              <h2 className="mt-0.5 text-[17px] font-medium tracking-[-0.01em] text-foreground/90">
                All apps
              </h2>
            </div>
            <button
              onClick={onClose}
              aria-label="Close"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-hairline bg-foreground/[0.03] text-muted-foreground/60 active:bg-foreground/[0.07]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="px-5 pb-3 md:px-8">
          <div className="mx-auto flex h-10 w-full max-w-3xl items-center gap-2.5 rounded-full border border-hairline bg-foreground/[0.035] px-3.5">
            <Search className="h-3.5 w-3.5 shrink-0 text-muted-foreground/40" />
            <input
              ref={inputRef}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search apps"
              className="min-w-0 flex-1 bg-transparent text-[12.5px] text-foreground outline-none placeholder:text-muted-foreground/35"
              spellCheck={false}
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                aria-label="Clear search"
                className="flex h-5 w-5 items-center justify-center rounded-full bg-foreground/10 text-muted-foreground/60"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>

        <div className="no-scrollbar flex-1 overflow-y-auto overscroll-contain px-5 pb-4 md:px-8">
          <div className="mx-auto w-full max-w-3xl">
            {results.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <p className="text-[12px] text-muted-foreground/55">No apps match “{query}”.</p>
                <button
                  onClick={() => setQuery('')}
                  className="mt-2 text-[11px] text-primary/80"
                >
                  Clear search
                </button>
              </div>
            ) : (
              <div className="md:grid md:grid-cols-[1.05fr_0.95fr] md:items-start md:gap-10">
                <div className="grid grid-cols-4 gap-x-2 gap-y-5 pb-4 pt-1 md:gap-y-7">
                  {results.map((app, index) => {
                    const tone = APP_TONES[app.tone]
                    const Icon = app.icon
                    return (
                      <motion.button
                        key={app.id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: Math.min(index * 0.02, 0.16), duration: 0.25 }}
                        onClick={() => onOpenApp(app.id)}
                        className="group flex flex-col items-center gap-1.5"
                      >
                        <span
                          className={`android-tile flex h-14 w-14 items-center justify-center rounded-[18px] border transition-transform active:scale-95 md:h-[72px] md:w-[72px] md:rounded-[21px] ${tone.tile}`}
                        >
                          <Icon className={`h-[22px] w-[22px] md:h-7 md:w-7 ${tone.icon}`} strokeWidth={1.6} />
                        </span>
                        <span className="w-full truncate text-center text-[10px] text-foreground/70 md:text-[11px]">
                          {app.short}
                        </span>
                      </motion.button>
                    )
                  })}
                </div>

                {/* Selected work balances the drawer on taller screens. */}
                {!query && (
                  <div className="mt-1 border-t border-hairline pt-4 md:mt-0 md:border-l md:border-t-0 md:pb-2 md:pl-8 md:pt-1">
                    <div className="flex items-baseline justify-between">
                      <h3 className="text-[9px] font-mono uppercase tracking-[0.13em] text-muted-foreground/40">
                        Selected work
                      </h3>
                      <span className="text-[9px] font-mono text-muted-foreground/25">
                        2025 — 26
                      </span>
                    </div>

                    <div className="mt-1.5">
                      {projectsData.map((project) => {
                        const meta = PROJECT_META[project.id] ?? {
                          index: '01',
                          discipline: '',
                        }
                        return (
                          <button
                            key={project.id}
                            onClick={() => onOpenApp('projects')}
                            className="flex w-full items-center gap-3 border-b border-hairline py-3 text-left last:border-b-0 active:opacity-70 md:py-2.5"
                          >
                            <span className="font-mono text-[9.5px] text-muted-foreground/30">
                              {meta.index}
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-[12.5px] text-foreground/85">
                                {project.name}
                              </span>
                              <span className="mt-0.5 block truncate text-[9px] font-mono uppercase tracking-[0.1em] text-muted-foreground/40">
                                {meta.discipline}
                              </span>
                            </span>
                            <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground/30" />
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="shrink-0 border-t border-hairline px-5 py-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] md:px-8">
          <div className="mx-auto flex w-full max-w-3xl items-center justify-between">
            <span className="text-[8.5px] font-mono uppercase tracking-[0.12em] text-muted-foreground/30">
              PRS—OS · Android edition
            </span>
            <span className="text-[8.5px] font-mono uppercase tracking-[0.12em] text-muted-foreground/25">
              {MOBILE_APPS.length} apps
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
