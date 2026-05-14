'use client'

import { motion } from 'framer-motion'
import { useOSStore, type ThemeName } from '@/store/os-store'
import { Palette, Monitor, Check } from 'lucide-react'

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
    name: 'AI Lab',
    description: 'Default futuristic AI aesthetic',
    colors: { bg: '#0a0c14', primary: '#64b5f6', accent: '#26a69a' },
  },
  {
    id: 'matrix',
    name: 'Matrix',
    description: 'Classic green terminal vibes',
    colors: { bg: '#0d0d0d', primary: '#00ff00', accent: '#008800' },
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean and distraction-free',
    colors: { bg: '#1a1a1a', primary: '#ffffff', accent: '#888888' },
  },
  {
    id: 'cyber',
    name: 'Cyber Terminal',
    description: 'Neon-infused dark mode',
    colors: { bg: '#0f0f1a', primary: '#ff6b6b', accent: '#feca57' },
  },
  {
    id: 'synthwave',
    name: 'Synthwave',
    description: 'Retro 80s gradient feels',
    colors: { bg: '#1a1025', primary: '#ff71ce', accent: '#01cdfe' },
  },
  {
    id: 'ubuntu',
    name: 'Ubuntu',
    description: 'Classic Linux terminal',
    colors: { bg: '#300a24', primary: '#e95420', accent: '#77216f' },
  },
]

export function SettingsWindow() {
  const { currentTheme, setTheme } = useOSStore()

  return (
    <div className="h-full flex flex-col bg-background/50">
      {/* Header */}
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/20">
            <Monitor className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold">Settings</h2>
            <p className="text-xs text-muted-foreground">
              Customize your workspace
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Themes section */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Palette className="w-4 h-4 text-muted-foreground" />
            <h3 className="text-sm font-medium">Themes</h3>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {themes.map((theme, index) => (
              <motion.button
                key={theme.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setTheme(theme.id)}
                className={`
                  relative p-3 rounded-lg border text-left transition-all
                  ${currentTheme === theme.id 
                    ? 'border-primary bg-primary/10' 
                    : 'border-border/50 hover:border-border bg-secondary/20'
                  }
                `}
              >
                {/* Color preview */}
                <div className="flex items-center gap-2 mb-2">
                  <div 
                    className="w-6 h-6 rounded"
                    style={{ background: theme.colors.bg }}
                  />
                  <div 
                    className="w-4 h-4 rounded"
                    style={{ background: theme.colors.primary }}
                  />
                  <div 
                    className="w-4 h-4 rounded"
                    style={{ background: theme.colors.accent }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium">{theme.name}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {theme.description}
                    </p>
                  </div>

                  {currentTheme === theme.id && (
                    <div className="p-1 rounded-full bg-primary">
                      <Check className="w-3 h-3 text-primary-foreground" />
                    </div>
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        </section>

        {/* Other settings */}
        <section className="mt-8">
          <h3 className="text-sm font-medium mb-4">Preferences</h3>
          
          <div className="space-y-3">
            <SettingToggle 
              label="Show boot screen"
              description="Display startup animation on load"
              defaultChecked={true}
            />
            <SettingToggle 
              label="Enable animations"
              description="Smooth transitions and effects"
              defaultChecked={true}
            />
            <SettingToggle 
              label="Show dock labels"
              description="Display app names in dock"
              defaultChecked={false}
            />
            <SettingToggle 
              label="Auto-collapse sidebar"
              description="Minimize sidebar when not in use"
              defaultChecked={false}
            />
          </div>
        </section>

        {/* System info */}
        <section className="mt-8">
          <h3 className="text-sm font-medium mb-4">System</h3>
          <div className="p-4 rounded-lg bg-secondary/30 border border-border/50 font-mono text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Version</span>
              <span>PRS-OS v2.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Runtime</span>
              <span>Next.js 16.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Theme Engine</span>
              <span>Tailwind CSS 4.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Animation</span>
              <span>Framer Motion 12</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

function SettingToggle({ 
  label, 
  description, 
  defaultChecked 
}: { 
  label: string
  description: string
  defaultChecked: boolean 
}) {
  return (
    <label className="flex items-center justify-between p-3 rounded-lg bg-secondary/20 border border-border/50 cursor-pointer hover:border-border transition-colors">
      <div>
        <div className="text-sm font-medium">{label}</div>
        <div className="text-xs text-muted-foreground">{description}</div>
      </div>
      <input 
        type="checkbox" 
        defaultChecked={defaultChecked}
        className="w-4 h-4 rounded border-border bg-background checked:bg-primary"
      />
    </label>
  )
}
