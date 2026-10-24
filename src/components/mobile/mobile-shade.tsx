'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BatteryMedium,
  Bluetooth,
  Briefcase,
  CheckCircle2,
  ChevronUp,
  FolderOpen,
  Moon,
  Settings,
  Sun,
  Wifi,
  X,
  type LucideIcon,
} from 'lucide-react'
import { useOSStore, type ThemeName } from '@/store/os-store'
import type { MobileAppId } from './mobile-apps'

const PALETTES: { id: ThemeName; name: string; color: string }[] = [
  { id: 'ai-lab', name: 'Ember', color: '#d6a468' },
  { id: 'matrix', name: 'Moss', color: '#a9bd8c' },
  { id: 'minimal', name: 'Paper', color: '#e8e6e1' },
  { id: 'cyber', name: 'Clay', color: '#c98a63' },
  { id: 'synthwave', name: 'Slate', color: '#9bbad4' },
  { id: 'ubuntu', name: 'Dusk', color: '#c493a5' },
]

interface Notification {
  id: string
  app: MobileAppId
  title: string
  body: string
  time: string
  icon: LucideIcon
  accent?: boolean
}

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'availability',
    app: 'contact',
    title: 'Open to internships',
    body: 'Available for software engineering and AI internships. Based in Gujarat, open to remote.',
    time: 'now',
    icon: CheckCircle2,
    accent: true,
  },
  {
    id: 'neuroscan',
    app: 'projects',
    title: 'NeuroScan AI · 94.05%',
    body: 'Validation accuracy on clinical MRI datasets, running on a 35 MB ONNX model.',
    time: '2h',
    icon: FolderOpen,
  },
  {
    id: 'role',
    app: 'experience',
    title: 'AI automation intern',
    body: 'CSRBOX × IBM SkillsBuild × AICTE. Started June 2026.',
    time: '1d',
    icon: Briefcase,
  },
]

interface MobileShadeProps {
  time: string
  dateLabel: string
  brightness: number
  onBrightnessChange: (value: number) => void
  onClose: () => void
  onOpenApp: (app: MobileAppId) => void
}

export function MobileShade({
  time,
  dateLabel,
  brightness,
  onBrightnessChange,
  onClose,
  onOpenApp,
}: MobileShadeProps) {
  const { currentTheme, setTheme } = useOSStore()
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS)
  const [toggles, setToggles] = useState({
    wifi: true,
    bluetooth: false,
    dnd: false,
    saver: false,
  })

  const flip = (key: keyof typeof toggles) =>
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }))

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="absolute inset-0 z-[60]"
      role="dialog"
      aria-modal="true"
      aria-label="Quick settings and notifications"
    >
      <button
        aria-label="Close quick settings"
        onClick={onClose}
        className="absolute inset-0 bg-background/65 backdrop-blur-md"
      />

      <motion.div
        initial={{ y: '-100%' }}
        animate={{ y: 0 }}
        exit={{ y: '-100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 32, mass: 0.9 }}
        className="no-scrollbar absolute inset-x-0 top-0 max-h-[94%] overflow-y-auto overscroll-contain rounded-b-[30px] border-b border-hairline-strong bg-window/97 px-5 pb-5 pt-[calc(0.5rem+env(safe-area-inset-top))] shadow-[var(--shadow-elevated)] backdrop-blur-2xl"
      >
        <div className="mx-auto mb-3 h-1 w-9 rounded-full bg-foreground/15" />

        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="tabular text-[26px] font-light leading-none tracking-[-0.03em] text-foreground/95">
              {time || '--:--'}
            </p>
            <p className="mt-1 text-[10.5px] text-muted-foreground/50">{dateLabel}</p>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onOpenApp('settings')}
              aria-label="Open settings"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-hairline bg-foreground/[0.04] text-muted-foreground/60 active:bg-foreground/[0.08]"
            >
              <Settings className="h-4 w-4" />
            </button>
            <button
              onClick={onClose}
              aria-label="Close quick settings"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-hairline bg-foreground/[0.04] text-muted-foreground/60 active:bg-foreground/[0.08]"
            >
              <ChevronUp className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Quick tiles */}
        <div className="mt-5 grid grid-cols-2 gap-2">
          <QuickTile
            icon={Wifi}
            label={toggles.wifi ? 'Wi-Fi · Home' : 'Wi-Fi off'}
            active={toggles.wifi}
            onClick={() => flip('wifi')}
          />
          <QuickTile
            icon={Bluetooth}
            label={toggles.bluetooth ? 'Bluetooth on' : 'Bluetooth'}
            active={toggles.bluetooth}
            onClick={() => flip('bluetooth')}
          />
          <QuickTile
            icon={Moon}
            label={toggles.dnd ? 'Do not disturb' : 'Do not disturb'}
            active={toggles.dnd}
            onClick={() => flip('dnd')}
          />
          <QuickTile
            icon={BatteryMedium}
            label="Battery saver"
            active={toggles.saver}
            onClick={() => flip('saver')}
          />
        </div>

        {/* Brightness */}
        <div className="mt-4 rounded-2xl border border-hairline bg-foreground/[0.03] px-3.5 py-3">
          <div className="flex items-center gap-3">
            <Sun className="h-3.5 w-3.5 shrink-0 text-muted-foreground/45" />
            <input
              type="range"
              min={35}
              max={100}
              value={brightness}
              onChange={(event) => onBrightnessChange(Number(event.target.value))}
              aria-label="Display brightness"
              className="mobile-range min-w-0 flex-1"
              style={{ ['--fill' as string]: `${brightness}%` }}
            />
            <Sun className="h-4 w-4 shrink-0 text-foreground/55" />
          </div>
        </div>

        {/* Palette */}
        <div className="mt-4 rounded-2xl border border-hairline bg-foreground/[0.03] px-3.5 py-3">
          <div className="flex items-baseline justify-between">
            <p className="text-[9px] font-mono uppercase tracking-[0.13em] text-muted-foreground/40">
              Palette
            </p>
            <p className="text-[9px] font-mono text-muted-foreground/35">
              {PALETTES.find((p) => p.id === currentTheme)?.name ?? 'Ember'}
            </p>
          </div>
          <div className="mt-2.5 grid grid-cols-6 gap-1.5">
            {PALETTES.map((palette) => {
              const selected = palette.id === currentTheme
              return (
                <button
                  key={palette.id}
                  onClick={() => setTheme(palette.id)}
                  aria-label={`${palette.name} palette`}
                  aria-pressed={selected}
                  className={`flex flex-col items-center gap-1 rounded-lg py-1.5 transition-colors ${
                    selected ? 'bg-foreground/[0.06]' : 'active:bg-foreground/[0.04]'
                  }`}
                >
                  <span
                    className={`h-5 w-5 rounded-full border ${
                      selected ? 'border-foreground/60' : 'border-hairline-strong'
                    }`}
                    style={{ background: palette.color }}
                  />
                  <span
                    className={`text-[8px] font-mono ${
                      selected ? 'text-foreground/75' : 'text-muted-foreground/40'
                    }`}
                  >
                    {palette.name}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Notifications */}
        <div className="mt-5 flex items-baseline justify-between">
          <h3 className="text-[9px] font-mono uppercase tracking-[0.13em] text-muted-foreground/40">
            Notifications
          </h3>
          {notifications.length > 0 && (
            <button
              onClick={() => setNotifications([])}
              className="text-[10px] text-muted-foreground/45 active:text-foreground"
            >
              Clear all
            </button>
          )}
        </div>

        <div className="mt-2.5 space-y-2">
          <AnimatePresence initial={false}>
            {notifications.map((notification) => {
              const Icon = notification.icon
              return (
                <motion.div
                  key={notification.id}
                  layout
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden rounded-2xl border border-hairline bg-foreground/[0.035]"
                >
                  <div className="flex items-start gap-3 p-3">
                    <button
                      onClick={() => onOpenApp(notification.app)}
                      className="flex min-w-0 flex-1 items-start gap-3 text-left"
                    >
                      <span
                        className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border ${
                          notification.accent
                            ? 'border-accent/25 bg-accent/[0.09] text-accent'
                            : 'border-hairline bg-foreground/[0.04] text-muted-foreground/55'
                        }`}
                      >
                        <Icon className="h-3.5 w-3.5" strokeWidth={1.8} />
                      </span>
                      <span className="min-w-0">
                        <span className="flex items-baseline gap-2">
                          <span className="truncate text-[11.5px] text-foreground/85">
                            {notification.title}
                          </span>
                          <span className="ml-auto shrink-0 font-mono text-[8.5px] text-muted-foreground/35">
                            {notification.time}
                          </span>
                        </span>
                        <span className="mt-0.5 block text-[10.5px] leading-relaxed text-muted-foreground/55">
                          {notification.body}
                        </span>
                      </span>
                    </button>
                    <button
                      onClick={() =>
                        setNotifications((prev) => prev.filter((n) => n.id !== notification.id))
                      }
                      aria-label={`Dismiss ${notification.title}`}
                      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-muted-foreground/30 active:bg-foreground/[0.06]"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>

          {notifications.length === 0 && (
            <div className="rounded-2xl border border-dashed border-hairline px-4 py-6 text-center">
              <p className="text-[11px] text-muted-foreground/40">You&apos;re all caught up.</p>
            </div>
          )}
        </div>

        <p className="mt-5 text-center text-[8.5px] font-mono uppercase tracking-[0.12em] text-muted-foreground/25">
          PRS—OS 2.0 · Android edition
        </p>
      </motion.div>
    </motion.div>
  )
}

function QuickTile({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: LucideIcon
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`flex h-[52px] items-center gap-2.5 rounded-2xl border px-3 text-left transition-colors active:scale-[0.99] ${
        active
          ? 'border-primary/30 bg-primary/[0.13] text-primary'
          : 'border-hairline bg-foreground/[0.035] text-muted-foreground/60'
      }`}
    >
      <Icon className="h-4 w-4 shrink-0" strokeWidth={1.7} />
      <span className="min-w-0 truncate text-[10.5px]">{label}</span>
    </button>
  )
}
