'use client'

import { motion } from 'framer-motion'
import { Layers, X } from 'lucide-react'
import { APP_TONES, getApp, type MobileAppId } from './mobile-apps'

interface MobileRecentsProps {
  recents: MobileAppId[]
  onOpenApp: (app: MobileAppId) => void
  onCloseApp: (app: MobileAppId) => void
  onClear: () => void
  onClose: () => void
}

export function MobileRecents({
  recents,
  onOpenApp,
  onCloseApp,
  onClear,
  onClose,
}: MobileRecentsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.985 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="absolute inset-0 flex flex-col"
    >
      <div className="flex items-center justify-between px-5 pb-3 pt-4 md:px-8">
        <div>
          <p className="text-[9px] font-mono uppercase tracking-[0.14em] text-muted-foreground/40">
            Overview
          </p>
          <h2 className="mt-0.5 text-[17px] font-medium tracking-[-0.01em] text-foreground/90">
            Recents
          </h2>
        </div>
        {recents.length > 0 ? (
          <button
            onClick={onClear}
            className="rounded-full border border-hairline px-3 py-1.5 text-[10px] text-muted-foreground/55 active:bg-foreground/[0.05]"
          >
            Clear all
          </button>
        ) : (
          <button
            onClick={onClose}
            className="rounded-full border border-hairline px-3 py-1.5 text-[10px] text-muted-foreground/55 active:bg-foreground/[0.05]"
          >
            Home
          </button>
        )}
      </div>

      {recents.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center px-10 pb-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-hairline bg-foreground/[0.03]">
            <Layers className="h-6 w-6 text-muted-foreground/30" strokeWidth={1.5} />
          </div>
          <p className="mt-4 text-[13px] text-foreground/70">No recent apps</p>
          <p className="mt-1 max-w-[220px] text-[11px] leading-relaxed text-muted-foreground/45">
            Apps you open will show up here, ready to pick up where you left off.
          </p>
        </div>
      ) : (
        <>
          <div className="no-scrollbar flex min-h-0 flex-1 snap-x snap-mandatory gap-3 overflow-x-auto overscroll-contain px-5 pb-2 md:px-8">
            {recents.map((id, index) => {
              const app = getApp(id)
              const tone = APP_TONES[app.tone]
              const Icon = app.icon
              return (
                <motion.div
                  key={id}
                  initial={{ opacity: 0, x: 18 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.04, duration: 0.3 }}
                  className="relative flex h-full min-h-[280px] w-[76vw] max-w-[310px] shrink-0 snap-center flex-col overflow-hidden rounded-3xl border border-hairline-strong bg-window/95 shadow-[var(--shadow-window-inactive)] md:w-[300px]"
                >
                  <div className="flex items-center gap-2.5 border-b border-hairline px-3.5 py-2.5">
                    <span
                      className={`android-tile flex h-7 w-7 items-center justify-center rounded-lg border ${tone.tile}`}
                    >
                      <Icon className={`h-3.5 w-3.5 ${tone.icon}`} strokeWidth={1.7} />
                    </span>
                    <span className="min-w-0 flex-1 truncate text-[12px] text-foreground/80">
                      {app.name}
                    </span>
                    <button
                      onClick={() => onCloseApp(id)}
                      aria-label={`Close ${app.name}`}
                      className="flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground/35 active:bg-foreground/[0.07]"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>

                  <button
                    onClick={() => onOpenApp(id)}
                    className="min-h-0 flex-1 overflow-hidden p-3 text-left active:bg-foreground/[0.02]"
                  >
                    <div className="relative h-full overflow-hidden rounded-xl border border-hairline bg-background/45 p-2.5">
                      <Icon
                        aria-hidden="true"
                        className="pointer-events-none absolute -bottom-4 -right-3 h-28 w-28 text-foreground/[0.028]"
                        strokeWidth={1}
                      />
                      <div className="relative h-full">
                        <RecentsPreview id={id} />
                      </div>
                    </div>
                  </button>

                  <div className="flex items-center justify-between border-t border-hairline px-3.5 py-2">
                    <span className="text-[8.5px] font-mono uppercase tracking-[0.12em] text-muted-foreground/30">
                      Tap to resume
                    </span>
                    <span className="h-1 w-1 rounded-full bg-primary/60" />
                  </div>
                </motion.div>
              )
            })}
          </div>
          <p className="pb-2 pt-1 text-center text-[8.5px] font-mono uppercase tracking-[0.12em] text-muted-foreground/25">
            Swipe cards · Tap to open
          </p>
        </>
      )}
    </motion.div>
  )
}

/* ─── Tiny, honest previews of each app for the recents stack ─── */

function Line({
  width = '100%',
  height = 6,
  className = '',
}: {
  width?: string | number
  height?: number
  className?: string
}) {
  return (
    <div
      className={`rounded-full bg-foreground/[0.075] ${className}`}
      style={{ width, height }}
    />
  )
}

function MiniBlock({
  title,
  lines = 2,
}: {
  title: string
  lines?: number
}) {
  return (
    <div className="rounded-lg border border-hairline bg-foreground/[0.02] p-2">
      <div className="text-[7px] font-mono uppercase tracking-[0.1em] text-muted-foreground/35">
        {title}
      </div>
      <div className="mt-1.5 space-y-1">
        {Array.from({ length: lines }).map((_, i) => (
          <Line key={i} width={`${88 - i * 18}%`} height={4} />
        ))}
      </div>
    </div>
  )
}

function RecentsPreview({ id }: { id: MobileAppId }) {
  switch (id) {
    case 'about':
      return (
        <div className="flex h-full flex-col">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full bg-foreground/10 ring-1 ring-hairline">
              <img
                src="/avatar-small.jpg"
                alt=""
                className="h-full w-full object-cover object-top"
              />
            </div>
            <div className="min-w-0 flex-1 space-y-1.5">
              <Line width="58%" height={7} className="bg-foreground/15" />
              <Line width="42%" height={4} />
            </div>
          </div>
          <div className="mt-3.5 space-y-1.5">
            <Line />
            <Line width="94%" />
            <Line width="88%" />
            <Line width="72%" />
          </div>
          <div className="mt-auto flex gap-1.5 pt-3">
            {['7.5rem', '5rem', '4rem'].map((w, i) => (
              <div
                key={i}
                className="h-4 rounded-full border border-hairline bg-foreground/[0.03]"
                style={{ width: w }}
              />
            ))}
          </div>
        </div>
      )

    case 'projects':
      return (
        <div className="h-full">
          <div className="flex items-center justify-between">
            <Line width="42%" height={5} />
            <span className="h-1.5 w-1.5 rounded-full bg-accent/80" />
          </div>
          <div className="mt-3 space-y-2">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="flex items-center gap-2 rounded-lg border border-hairline bg-foreground/[0.02] px-2 py-1.5"
              >
                <span className="font-mono text-[6px] text-muted-foreground/30">
                  0{n}
                </span>
                <div className="min-w-0 flex-1 space-y-1">
                  <Line width={`${70 - n * 6}%`} height={4} className="bg-foreground/12" />
                  <Line width={`${52 - n * 4}%`} height={3} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )

    case 'skills':
      return (
        <div className="h-full">
          <Line width="34%" height={5} />
          <div className="mt-3 grid grid-cols-3 gap-1.5">
            {['4.2rem', '3.4rem', '3.8rem', '3rem', '4.6rem', '3.2rem'].map(
              (w, i) => (
                <div
                  key={i}
                  className="h-5 rounded-md border border-hairline bg-foreground/[0.025]"
                  style={{ width: w }}
                />
              ),
            )}
          </div>
          <div className="mt-3 space-y-1.5">
            <Line width="92%" height={4} />
            <Line width="78%" height={4} />
            <Line width="85%" height={4} />
          </div>
        </div>
      )

    case 'experience':
      return (
        <div className="h-full space-y-2">
          <Line width="38%" height={5} />
          <MiniBlock title="CSRBOX · IBM · AICTE" lines={3} />
          <MiniBlock title="BrainyBeam Technologies" lines={2} />
          <MiniBlock title="Ongoing" lines={1} />
        </div>
      )

    case 'education':
      return (
        <div className="h-full space-y-2">
          <Line width="34%" height={5} />
          <MiniBlock title="B.E. · 2024—2027" lines={3} />
          <MiniBlock title="Diploma · 2021—2024" lines={2} />
          <div className="h-4 w-14 rounded-full border border-hairline" />
        </div>
      )

    case 'certifications':
      return (
        <div className="h-full">
          <Line width="44%" height={5} />
          <div className="mt-3 grid grid-cols-2 gap-1.5">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="rounded-lg border border-hairline bg-foreground/[0.02] p-2"
              >
                <Line width="70%" height={4} className="bg-foreground/12" />
                <div className="mt-1.5 space-y-1">
                  <Line width="92%" height={3} />
                  <Line width="64%" height={3} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )

    case 'contact':
      return (
        <div className="flex h-full flex-col">
          <div className="grid grid-cols-2 gap-1.5">
            <div className="h-5 rounded-md border border-hairline bg-foreground/[0.025]" />
            <div className="h-5 rounded-md border border-hairline bg-foreground/[0.025]" />
          </div>
          <div className="mt-1.5 h-5 rounded-md border border-hairline bg-foreground/[0.025]" />
          <div className="mt-1.5 h-14 rounded-md border border-hairline bg-foreground/[0.025]" />
          <div className="mt-auto flex items-center justify-between pt-3">
            <Line width="40%" height={3} />
            <div className="h-6 w-20 rounded-md bg-primary/80" />
          </div>
        </div>
      )

    case 'resume':
      return (
        <div className="flex h-full flex-col rounded-lg bg-foreground/[0.04] p-3">
          <Line width="46%" height={6} className="bg-foreground/15" />
          <Line width="30%" height={3} className="mt-1.5" />
          <div className="mt-3 space-y-1.5">
            <Line width="96%" height={3} />
            <Line width="88%" height={3} />
            <Line width="92%" height={3} />
          </div>
          <div className="mt-3 space-y-1">
            <Line width="40%" height={4} className="bg-foreground/12" />
            <Line width="90%" height={3} />
            <Line width="82%" height={3} />
          </div>
          <div className="mt-3 space-y-1">
            <Line width="36%" height={4} className="bg-foreground/12" />
            <Line width="86%" height={3} />
            <Line width="74%" height={3} />
          </div>
        </div>
      )

    case 'github':
      return (
        <div className="h-full">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-full bg-foreground/[0.08]" />
            <div className="space-y-1">
              <Line width="4.5rem" height={5} />
              <Line width="3rem" height={3} />
            </div>
          </div>
          <div className="mt-3 space-y-1.5">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="flex items-center gap-2 rounded-md border border-hairline px-2 py-1.5"
              >
                <span className="h-1 w-1 rounded-full bg-primary/50" />
                <Line width={`${66 - n * 5}%`} height={3} />
              </div>
            ))}
          </div>
        </div>
      )

    case 'assistant':
      return (
        <div className="flex h-full flex-col">
          <div className="flex items-start gap-1.5">
            <span className="mt-0.5 h-4 w-4 shrink-0 rounded-full bg-accent/20" />
            <div className="w-[78%] space-y-1 rounded-xl rounded-tl-sm bg-foreground/[0.05] p-2">
              <Line width="92%" height={3} />
              <Line width="70%" height={3} />
            </div>
          </div>
          <div className="mt-2 flex justify-end">
            <div className="h-7 w-[58%] rounded-xl rounded-tr-sm bg-primary/15" />
          </div>
          <div className="mt-2 flex items-start gap-1.5">
            <span className="mt-0.5 h-4 w-4 shrink-0 rounded-full bg-accent/20" />
            <div className="w-[86%] space-y-1 rounded-xl rounded-tl-sm bg-foreground/[0.05] p-2">
              <Line width="96%" height={3} />
              <Line width="82%" height={3} />
              <Line width="58%" height={3} />
            </div>
          </div>
          <div className="mt-auto h-7 rounded-full border border-hairline bg-foreground/[0.025]" />
        </div>
      )

    case 'timeline':
      return (
        <div className="h-full">
          <Line width="32%" height={5} />
          <div className="mt-3 space-y-3 border-l border-hairline pl-3">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="relative">
                <span className="absolute -left-[16px] top-1 h-1.5 w-1.5 rounded-full border border-background bg-primary/60" />
                <Line width={`${64 - n * 4}%`} height={4} className="bg-foreground/12" />
                <Line width={`${82 - n * 5}%`} height={3} className="mt-1" />
              </div>
            ))}
          </div>
        </div>
      )

    case 'settings':
      return (
        <div className="h-full">
          <Line width="30%" height={5} />
          <div className="mt-3 flex gap-1.5">
            {['#d6a468', '#a9bd8c', '#e8e6e1', '#c98a63', '#9bbad4', '#c493a5'].map(
              (color) => (
                <span
                  key={color}
                  className="h-5 w-5 rounded-full border border-hairline-strong"
                  style={{ background: color }}
                />
              ),
            )}
          </div>
          <div className="mt-3 space-y-1.5">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="flex items-center justify-between rounded-md border border-hairline px-2 py-1.5"
              >
                <Line width={`${36 + n * 5}%`} height={3} />
                <span className="h-1.5 w-1.5 rounded-full bg-foreground/20" />
              </div>
            ))}
          </div>
        </div>
      )

    default:
      return (
        <div className="space-y-2">
          <Line width="48%" height={5} />
          <Line />
          <Line width="84%" />
          <Line width="70%" />
        </div>
      )
  }
}
