'use client'

import { motion } from 'framer-motion'
import {
  ArrowUpRight,
  Briefcase,
  MapPin,
  Search,
  Sparkles,
} from 'lucide-react'
import { APP_TONES, DOCK_APPS, HOME_APPS, getApp, type MobileAppId } from './mobile-apps'
import { projectsData } from '@/data/projects'

const PROJECT_META: Record<string, { index: string; discipline: string }> = {
  neuroscan: { index: '01', discipline: 'AI / ML' },
  studyflow: { index: '02', discipline: 'Full stack / AI' },
  nimbusx: { index: '03', discipline: 'Mobile' },
  codeviz: { index: '04', discipline: 'Developer tooling' },
}

interface MobileHomeProps {
  time: string
  dateLabel: string
  onOpenApp: (app: MobileAppId) => void
  onOpenDrawer: (focusSearch?: boolean) => void
}

export function MobileHome({ time, dateLabel, onOpenApp, onOpenDrawer }: MobileHomeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.99 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.995 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="absolute inset-0 flex flex-col"
    >
      <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-5 pt-1 md:px-10">
        <div className="mx-auto w-full max-w-md md:max-w-2xl">
          {/* Clock widget */}
          <div className="pb-4 pt-0.5">
            <p className="text-[11px] font-medium text-foreground/55">{dateLabel}</p>
            <div className="mt-0.5 flex items-end gap-2.5">
              <span className="tabular text-[54px] font-light leading-none tracking-[-0.045em] text-foreground/95 md:text-[68px]">
                {time || '--:--'}
              </span>
              <span className="mb-1.5 text-[9px] font-mono uppercase tracking-[0.14em] text-muted-foreground/40">
                IST
              </span>
            </div>
            <p className="mt-1.5 flex items-center gap-1.5 text-[10px] text-muted-foreground/45">
              <MapPin className="h-3 w-3" />
              Gujarat, India
            </p>
          </div>

          {/* Identity widget */}
          <div className="rounded-[26px] border border-hairline bg-glass p-3.5 shadow-[var(--shadow-ambient)] backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <button
                onClick={() => onOpenApp('about')}
                className="flex min-w-0 flex-1 items-center gap-3 text-left"
                aria-label="Open About"
              >
                <span className="h-12 w-12 shrink-0 overflow-hidden rounded-full ring-1 ring-hairline-strong">
                  <img
                    src="/avatar-small.jpg"
                    alt="Prem Rajesh"
                    className="h-full w-full object-cover object-top"
                  />
                </span>
                <span className="min-w-0">
                  <span className="font-display block truncate text-[21px] leading-tight tracking-[-0.02em] text-foreground">
                    Prem Rajesh
                  </span>
                  <span className="mt-0.5 block truncate text-[10.5px] text-muted-foreground/60">
                    AI systems · full stack
                  </span>
                </span>
              </button>
              <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-accent/25 bg-accent/[0.08] px-2 py-1 text-[8.5px] font-mono uppercase tracking-[0.1em] text-accent">
                <span className="h-1 w-1 rounded-full bg-accent" />
                Open
              </span>
            </div>

            <div className="mt-2.5 grid grid-cols-2 gap-2">
              <button
                onClick={() => onOpenApp('projects')}
                className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl bg-primary text-[11.5px] font-medium text-primary-foreground transition-colors active:bg-primary/90"
              >
                View work
                <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => onOpenApp('contact')}
                className="inline-flex h-9 items-center justify-center rounded-xl border border-hairline-strong text-[11.5px] text-foreground/75 transition-colors active:bg-foreground/[0.06]"
              >
                Get in touch
              </button>
            </div>

            <button
              onClick={() => onOpenApp('experience')}
              className="mt-2.5 flex w-full items-center gap-2.5 border-t border-hairline pt-2.5 text-left"
            >
              <Briefcase className="h-3.5 w-3.5 shrink-0 text-primary/80" strokeWidth={1.7} />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[10.5px] text-foreground/75">
                  AI automation intern
                </span>
                <span className="block truncate text-[9px] font-mono text-muted-foreground/40">
                  CSRBOX × IBM SkillsBuild · 2026
                </span>
              </span>
              <ArrowUpRight className="h-3 w-3 shrink-0 text-muted-foreground/30" />
            </button>
          </div>

          {/* App grid */}
          <div className="mt-5 grid grid-cols-4 gap-x-2 gap-y-4 md:grid-cols-8 md:gap-x-3">
            {HOME_APPS.map((id, index) => {
              const app = getApp(id)
              const tone = APP_TONES[app.tone]
              const Icon = app.icon
              return (
                <motion.button
                  key={id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.04 + index * 0.025, duration: 0.35 }}
                  onClick={() => onOpenApp(id)}
                  className="group flex flex-col items-center gap-1.5"
                >
                  <span
                    className={`android-tile flex h-[54px] w-[54px] items-center justify-center rounded-[17px] border ${tone.tile} transition-transform duration-150 group-active:scale-95`}
                  >
                    <Icon className={`h-[21px] w-[21px] ${tone.icon}`} strokeWidth={1.6} />
                  </span>
                  <span className="w-full truncate text-center text-[10px] leading-none text-foreground/70">
                    {app.short}
                  </span>
                </motion.button>
              )
            })}
          </div>

          {/* Tablets have the vertical room for a work shelf. */}
          <div className="mt-8 hidden md:block">
            <div className="flex items-baseline justify-between">
              <h2 className="text-eyebrow">Selected work</h2>
              <button
                onClick={() => onOpenApp('projects')}
                className="text-[10px] text-muted-foreground/50 active:text-foreground"
              >
                All projects
              </button>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2.5">
              {projectsData.map((project) => {
                const meta = PROJECT_META[project.id] ?? { index: '01', discipline: '' }
                return (
                  <button
                    key={project.id}
                    onClick={() => onOpenApp('projects')}
                    className="group flex flex-col rounded-2xl border border-hairline bg-foreground/[0.025] p-3.5 text-left transition-colors active:bg-foreground/[0.05]"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[9px] text-muted-foreground/30">
                        {meta.index}
                      </span>
                      <span className="h-2.5 w-px bg-hairline" />
                      <span className="text-[8.5px] font-mono uppercase tracking-[0.12em] text-muted-foreground/45">
                        {meta.discipline}
                      </span>
                      <ArrowUpRight className="ml-auto h-3 w-3 text-muted-foreground/30" />
                    </div>
                    <span className="mt-2 text-[15px] leading-tight tracking-[-0.01em] text-foreground/90">
                      {project.name}
                    </span>
                    <span className="mt-1 line-clamp-1 text-[10.5px] text-muted-foreground/50">
                      {project.tagline.replace(/\s*\|\s*/g, ' · ')}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Search + dock */}
      <div className="relative z-20 shrink-0 px-5 pb-3 pt-4 md:px-10">
        <button
          onClick={() => onOpenDrawer(true)}
          aria-label="Search apps and work"
          className="mx-auto flex h-11 w-full max-w-md items-center gap-2.5 rounded-full border border-hairline-strong bg-glass px-4 text-left shadow-[var(--shadow-ambient)] backdrop-blur-xl active:bg-foreground/[0.05]"
        >
          <Search className="h-4 w-4 shrink-0 text-muted-foreground/45" />
          <span className="flex-1 text-[12px] text-muted-foreground/50">Search apps and work</span>
          <Sparkles className="h-3.5 w-3.5 text-primary/60" />
        </button>

        <div className="mx-auto mt-2 w-full max-w-md">
          <div className="flex items-center justify-around rounded-[26px] border border-hairline-strong bg-glass px-2 py-2 shadow-[0_20px_50px_-24px_rgba(10,7,4,0.9)] backdrop-blur-xl">
            {DOCK_APPS.map((id) => {
              const app = getApp(id)
              const tone = APP_TONES[app.tone]
              const Icon = app.icon
              return (
                <button
                  key={id}
                  onClick={() => onOpenApp(id)}
                  aria-label={`Open ${app.name}`}
                  className={`android-tile flex h-12 w-12 items-center justify-center rounded-[16px] border transition-transform active:scale-95 ${tone.tile}`}
                >
                  <Icon className={`h-[21px] w-[21px] ${tone.icon}`} strokeWidth={1.6} />
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
