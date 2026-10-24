'use client'

import { motion } from 'framer-motion'
import { useOSStore, type ThemeName } from '@/store/os-store'
import { Check } from 'lucide-react'

interface Theme {
  id: ThemeName
  name: string
  description: string
  colors: {
    bg: string
    primary: string
    accent: string
  }
}

const themes: Theme[] = [
  {
    id: 'ai-lab',
    name: 'Ember',
    description: 'Warm graphite with an amber accent.',
    colors: { bg: '#211d19', primary: '#d6a468', accent: '#8fa692' },
  },
  {
    id: 'matrix',
    name: 'Moss',
    description: 'Deep olive and soft sage.',
    colors: { bg: '#1b211a', primary: '#a9bd8c', accent: '#cbb47e' },
  },
  {
    id: 'minimal',
    name: 'Paper',
    description: 'Neutral graphite, ivory highlights.',
    colors: { bg: '#202020', primary: '#e8e6e1', accent: '#b3b1ac' },
  },
  {
    id: 'cyber',
    name: 'Clay',
    description: 'Umber base with terracotta.',
    colors: { bg: '#241c17', primary: '#c98a63', accent: '#d6b98c' },
  },
  {
    id: 'synthwave',
    name: 'Slate',
    description: 'Cool graphite and steel blue.',
    colors: { bg: '#191f26', primary: '#9bbad4', accent: '#93bfc0' },
  },
  {
    id: 'ubuntu',
    name: 'Dusk',
    description: 'Plum graphite with rosewood.',
    colors: { bg: '#231b22', primary: '#c493a5', accent: '#cbb08b' },
  },
]

const shortcuts = [
  { keys: '⌘ K', action: 'Command palette' },
  { keys: 'Esc', action: 'Dismiss overlays' },
  { keys: '⌘ /', action: 'Toggle sidebar' },
]

export function SettingsWindow() {
  const { currentTheme, setTheme } = useOSStore()
  const activeTheme = themes.find(t => t.id === currentTheme) ?? themes[0]

  return (
    <div className="h-full flex flex-col font-sans">
      {/* Header */}
      <div className="px-6 py-5 border-b border-hairline shrink-0">
        <p className="text-eyebrow">Workspace</p>
        <div className="mt-1.5 flex items-baseline justify-between gap-4">
          <h2 className="font-display text-[1.9rem] leading-none tracking-[-0.02em]">Settings</h2>
          <span className="text-[10px] font-mono text-muted-foreground/45">{activeTheme.name}</span>
        </div>
        <p className="mt-2 text-[11.5px] text-muted-foreground/60">
          Choose a palette for the desktop. Window layout and content stay the same.
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-5">
        <section>
          <div className="flex items-baseline justify-between mb-3">
            <h3 className="text-eyebrow">Palette</h3>
            <span className="text-[9.5px] font-mono text-muted-foreground/35">Six presets</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {themes.map((theme, index) => {
              const selected = currentTheme === theme.id
              return (
                <motion.button
                  key={theme.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.035, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  onClick={() => setTheme(theme.id)}
                  aria-pressed={selected}
                  className={`
                    group relative p-3 rounded-lg border text-left transition-colors
                    ${selected
                      ? 'border-primary/40 bg-primary/[0.055]'
                      : 'border-hairline hover:border-hairline-strong hover:bg-foreground/[0.025]'
                    }
                  `}
                >
                  <div className="flex items-center gap-1.5 mb-2.5">
                    <span
                      className="w-7 h-7 rounded border border-hairline"
                      style={{ background: theme.colors.bg }}
                    />
                    <span
                      className="w-4 h-7 rounded-sm"
                      style={{ background: theme.colors.primary }}
                    />
                    <span
                      className="w-4 h-7 rounded-sm"
                      style={{ background: theme.colors.accent }}
                    />
                    {selected && (
                      <span className="ml-auto w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 text-primary-foreground" strokeWidth={3} />
                      </span>
                    )}
                  </div>

                  <h4 className="text-[12.5px] text-foreground/90">{theme.name}</h4>
                  <p className="mt-0.5 text-[10.5px] leading-snug text-muted-foreground/55">
                    {theme.description}
                  </p>
                </motion.button>
              )
            })}
          </div>
        </section>

        <section className="mt-7">
          <h3 className="text-eyebrow mb-3">Keyboard</h3>
          <div className="rounded-lg border border-hairline overflow-hidden">
            {shortcuts.map(shortcut => (
              <div
                key={shortcut.keys}
                className="flex items-center justify-between px-3 py-2 border-b border-hairline last:border-b-0"
              >
                <span className="text-[11.5px] text-muted-foreground/75">{shortcut.action}</span>
                <kbd className="text-[9.5px] font-mono px-1.5 py-0.5 rounded border border-hairline bg-foreground/[0.03] text-muted-foreground/60">
                  {shortcut.keys}
                </kbd>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-7">
          <h3 className="text-eyebrow mb-3">System</h3>
          <div className="text-[10.5px] font-mono">
            <SystemRow label="Version" value="PRS-OS 2.0" />
            <SystemRow label="Runtime" value="Next.js 16" />
            <SystemRow label="Styling" value="Tailwind CSS 4" />
            <SystemRow label="Motion" value="Framer Motion 12" />
          </div>
        </section>

        <p className="mt-7 text-[10px] text-muted-foreground/35 leading-relaxed">
          Colors are tuned for contrast in dark environments. Selections reset when the page
          reloads.
        </p>
      </div>
    </div>
  )
}

function SystemRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-hairline last:border-b-0">
      <span className="text-muted-foreground/50">{label}</span>
      <span className="text-foreground/70">{value}</span>
    </div>
  )
}
