import { create } from 'zustand'

export type WindowType = 
  | 'projects' 
  | 'terminal' 
  | 'resume' 
  | 'skills' 
  | 'timeline' 
  | 'settings'
  | 'ai-assistant'
  | 'about'
  | 'github'
  | 'runtime'

export type WindowState = 'open' | 'focused' | 'minimized' | 'maximized' | 'hidden'

export interface Window {
  id: string
  type: WindowType
  title: string
  isMinimized: boolean
  isMaximized: boolean
  zIndex: number
  position: { x: number; y: number }
  size: { width: number; height: number }
  /** Position/size before maximize, for restore */
  preMaximize?: { position: { x: number; y: number }; size: { width: number; height: number } }
  triggerPosition?: { x: number; y: number }
  /** Dock icon rect for minimize/restore animation anchor */
  dockRect?: { x: number; y: number; width: number; height: number }
  initialQuery?: string | null
  lastFocusedAt: number
}

export type ThemeName = 'ai-lab' | 'matrix' | 'minimal' | 'cyber' | 'synthwave' | 'ubuntu'

interface OSState {
  windows: Window[]
  activeWindow: string | null
  commandPaletteOpen: boolean
  sidebarCollapsed: boolean
  currentTheme: ThemeName
  maxZIndex: number
  
  openWindow: (type: WindowType, title?: string, query?: string, triggerPosition?: { x: number; y: number }) => void
  closeWindow: (id: string) => void
  focusWindow: (id: string) => void
  minimizeWindow: (id: string) => void
  maximizeWindow: (id: string) => void
  restoreWindow: (id: string) => void
  toggleMinimize: (id: string) => void
  toggleCommandPalette: () => void
  toggleSidebar: () => void
  setTheme: (theme: ThemeName) => void
  updateWindowPosition: (id: string, position: { x: number; y: number }) => void
  updateWindowSize: (id: string, size: { width: number; height: number }) => void
  setDockRect: (id: string, rect: { x: number; y: number; width: number; height: number }) => void
  reorderWindows: (id: string) => void
}

const defaultSizes: Record<WindowType, { width: number; height: number }> = {
  projects: { width: 900, height: 600 },
  terminal: { width: 700, height: 450 },
  resume: { width: 800, height: 600 },
  skills: { width: 600, height: 500 },
  timeline: { width: 700, height: 500 },
  settings: { width: 500, height: 400 },
  'ai-assistant': { width: 400, height: 600 },
  about: { width: 600, height: 450 },
  github: { width: 950, height: 650 },
  runtime: { width: 1000, height: 700 },
}

const defaultTitles: Record<WindowType, string> = {
  projects: 'Project Explorer',
  terminal: 'Terminal',
  resume: 'Resume Viewer',
  skills: 'Technical Matrix',
  timeline: 'Development History',
  settings: 'Settings',
  'ai-assistant': 'Contextual AI Assistant',
  about: 'About System',
  github: 'GitHub Workspace',
  runtime: 'Runtime Browser',
}

let windowIdCounter = 0

function clampPosition(
  pos: { x: number; y: number },
  size: { width: number; height: number },
): { x: number; y: number } {
  if (typeof window === 'undefined') return pos
  const vw = window.innerWidth
  const vh = window.innerHeight
  const TITLE_BAR_H = 40
  const MIN_VISIBLE = 100 // Amount of window that must remain on screen

  return {
    // Keep at least MIN_VISIBLE px horizontally on screen
    x: Math.min(Math.max(-(size.width - MIN_VISIBLE), pos.x), vw - MIN_VISIBLE),
    // Top edge: Title bar must ALWAYS be visible. 
    // Bottom edge: Keep at least TITLE_BAR_H visible.
    y: Math.min(Math.max(0, pos.y), vh - TITLE_BAR_H),
  }
}

/** Find next best window to focus after removing/minimizing one */
function findTopWindow(windows: Window[], excludeId?: string): string | null {
  const visible = windows.filter(w => !w.isMinimized && w.id !== excludeId)
  if (visible.length === 0) return null
  return visible.reduce((a, b) => (a.lastFocusedAt > b.lastFocusedAt ? a : b)).id
}

export const useOSStore = create<OSState>((set, get) => ({
  windows: [],
  activeWindow: null,
  commandPaletteOpen: false,
  sidebarCollapsed: false,
  currentTheme: 'ai-lab',
  maxZIndex: 100,

  reorderWindows: (id) => {
    const { windows } = get()
    const sorted = [...windows].sort((a, b) => a.zIndex - b.zIndex)
    const targetIdx = sorted.findIndex(w => w.id === id)
    if (targetIdx === -1) return

    const target = sorted.splice(targetIdx, 1)[0]
    sorted.push(target)

    const updated = windows.map(w => {
      const newIdx = sorted.findIndex(sw => sw.id === w.id)
      return { ...w, zIndex: 10 + newIdx }
    })

    set({ windows: updated, maxZIndex: 10 + sorted.length })
  },

  openWindow: (type, title, query, triggerPosition) => {
    const { windows } = get()
    const existingWindow = windows.find(w => w.type === type)
    
    if (existingWindow) {
      get().focusWindow(existingWindow.id)
      if (query) {
        set({
          windows: windows.map(w => 
            w.id === existingWindow.id ? { ...w, initialQuery: query } : w
          )
        })
      }
      return
    }

    const id = `window-${++windowIdCounter}`
    const size = defaultSizes[type]
    const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1400
    const screenHeight = typeof window !== 'undefined' ? window.innerHeight : 900
    
    const offset = (windows.length % 6) * 32
    const position = clampPosition(
      {
        x: (screenWidth - size.width) / 2 + offset,
        y: (screenHeight - size.height) / 2 + offset - 40,
      },
      size,
    )

    const newWindow: Window = {
      id,
      type,
      title: title || defaultTitles[type],
      isMinimized: false,
      isMaximized: false,
      zIndex: get().maxZIndex + 1,
      position,
      size,
      triggerPosition,
      initialQuery: query || null,
      lastFocusedAt: Date.now(),
    }

    set({
      windows: [...windows, newWindow],
      activeWindow: id,
      maxZIndex: get().maxZIndex + 1,
    })
  },

  closeWindow: (id) => {
    const { windows, activeWindow } = get()
    const remaining = windows.filter(w => w.id !== id)
    
    set({
      windows: remaining,
      activeWindow: activeWindow === id ? findTopWindow(remaining) : activeWindow,
    })
  },

  focusWindow: (id) => {
    const { windows, activeWindow } = get()
    const target = windows.find(w => w.id === id)
    if (!target) return

    // If minimized, restore it first
    if (target.isMinimized) {
      get().restoreWindow(id)
      return
    }

    if (activeWindow === id) return

    const newZ = get().maxZIndex + 1
    const updatedWindows = windows.map(w => 
      w.id === id
        ? { ...w, zIndex: newZ, lastFocusedAt: Date.now() }
        : w
    )

    set({
      windows: updatedWindows,
      activeWindow: id,
      maxZIndex: newZ,
    })
  },

  minimizeWindow: (id) => {
    const { windows, activeWindow } = get()
    const updated = windows.map(w => 
      w.id === id ? { ...w, isMinimized: true } : w
    )

    set({
      windows: updated,
      activeWindow: activeWindow === id ? findTopWindow(updated, id) : activeWindow,
    })
  },

  restoreWindow: (id) => {
    const { windows } = get()
    const newZ = get().maxZIndex + 1

    set({
      windows: windows.map(w => 
        w.id === id ? { ...w, isMinimized: false, zIndex: newZ, lastFocusedAt: Date.now() } : w
      ),
      activeWindow: id,
      maxZIndex: newZ,
    })
  },

  toggleMinimize: (id) => {
    const { windows, activeWindow } = get()
    const target = windows.find(w => w.id === id)
    if (!target) return

    if (target.isMinimized) {
      get().restoreWindow(id)
    } else if (activeWindow === id) {
      get().minimizeWindow(id)
    } else {
      get().focusWindow(id)
    }
  },

  maximizeWindow: (id) => {
    const { windows } = get()
    const target = windows.find(w => w.id === id)
    if (!target) return

    const newZ = get().maxZIndex + 1

    if (target.isMaximized) {
      const prev = target.preMaximize
      set({
        windows: windows.map(w => 
          w.id === id
            ? {
                ...w,
                isMaximized: false,
                zIndex: newZ,
                position: prev?.position || w.position,
                size: prev?.size || w.size,
                preMaximize: undefined,
                lastFocusedAt: Date.now(),
              }
            : w
        ),
        activeWindow: id,
        maxZIndex: newZ,
      })
    } else {
      set({
        windows: windows.map(w => 
          w.id === id
            ? {
                ...w,
                isMaximized: true,
                zIndex: newZ,
                preMaximize: { position: w.position, size: w.size },
                lastFocusedAt: Date.now(),
              }
            : w
        ),
        activeWindow: id,
        maxZIndex: newZ,
      })
    }
  },

  toggleCommandPalette: () => {
    set(state => ({ commandPaletteOpen: !state.commandPaletteOpen }))
  },

  toggleSidebar: () => {
    set(state => ({ sidebarCollapsed: !state.sidebarCollapsed }))
  },

  setTheme: (theme) => {
    set({ currentTheme: theme })
  },

  updateWindowPosition: (id, position) => {
    const { windows } = get()
    const target = windows.find(w => w.id === id)
    if (!target) return

    const clamped = clampPosition(position, target.size)
    set({
      windows: windows.map(w => 
        w.id === id ? { ...w, position: clamped } : w
      ),
    })
  },

  updateWindowSize: (id, size) => {
    const { windows } = get()
    set({
      windows: windows.map(w => 
        w.id === id ? { ...w, size } : w
      ),
    })
  },

  setDockRect: (id, rect) => {
    const { windows } = get()
    set({
      windows: windows.map(w =>
        w.id === id ? { ...w, dockRect: rect } : w
      ),
    })
  },
}))

