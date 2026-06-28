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
  | 'quick-links'
  | 'education'
  | 'experience'
  | 'certifications'

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

export interface WorkArea {
  /** absolute screen-space offset of the work area (left edge) */
  left: number
  /** absolute screen-space offset of the work area (top edge, below top bar) */
  top: number
  /** usable width (viewport minus sidebar) */
  width: number
  /** usable height (viewport minus top bar) */
  height: number
}

interface OSState {
  windows: Window[]
  activeWindow: string | null
  commandPaletteOpen: boolean
  sidebarCollapsed: boolean
  currentTheme: ThemeName
  maxZIndex: number
  /** Real usable area where windows may live (measured from the desktop <main>) */
  workArea: WorkArea

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
  minimizeAll: () => void
  setWorkArea: (area: WorkArea) => void
}

const defaultSizes: Record<WindowType, { width: number; height: number }> = {
  projects: { width: 1250, height: 825 },
  terminal: { width: 1000, height: 625 },
  resume: { width: 1125, height: 825 },
  skills: { width: 875, height: 688 },
  timeline: { width: 1000, height: 688 },
  settings: { width: 725, height: 562 },
  'ai-assistant': { width: 600, height: 825 },
  about: { width: 875, height: 625 },
  github: { width: 1312, height: 900 },
  runtime: { width: 1375, height: 950 },
  'quick-links': { width: 775, height: 600 },
  education: { width: 1000, height: 725 },
  experience: { width: 1000, height: 650 },
  certifications: { width: 1000, height: 750 },
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
  'quick-links': 'Quick Links',
  education: 'Education',
  experience: 'Experience',
  certifications: 'Certifications',
}

let windowIdCounter = 0

// Fallback when no work area has been measured yet (SSR / first paint)
const DEFAULT_WORKAREA: WorkArea = {
  left: 56,
  top: 44,
  width: typeof window !== 'undefined' ? window.innerWidth - 56 : 1920 - 56,
  height: typeof window !== 'undefined' ? window.innerHeight - 44 : 1080 - 44,
}

const TITLE_BAR_H = 40
// Minimum amount of a window that must stay visible when dragged around
const MIN_VISIBLE_W = 100

function getWorkArea(): WorkArea {
  // Default fallback covers the common collapsed-sidebar case (56px) + top bar (~44px)
  return useOSStore.getState().workArea ?? DEFAULT_WORKAREA
}

/**
 * Clamp a window position. Window x/y are LOCAL to the desktop <main>
 * (the window's offset parent), so the usable space is [0..area.width] × [0..area.height].
 */
function clampPosition(
  pos: { x: number; y: number },
  size: { width: number; height: number },
  area = getWorkArea(),
): { x: number; y: number } {
  return {
    // Keep at least MIN_VISIBLE_W px horizontally within the work area
    x: Math.min(Math.max(0, pos.x), Math.max(0, area.width - MIN_VISIBLE_W)),
    // Title bar must ALWAYS be visible at the top; clamp bottom within the work area.
    y: Math.min(Math.max(0, pos.y), Math.max(0, area.height - TITLE_BAR_H)),
  }
}

/**
 * Shrink a window's size so it never exceeds the usable work area
 * (prevents content from being clipped at the edges).
 */
function fitSize(
  size: { width: number; height: number },
  area = getWorkArea(),
): { width: number; height: number } {
  return {
    width: Math.min(size.width, area.width),
    height: Math.min(size.height, area.height),
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
  workArea: DEFAULT_WORKAREA,

  setWorkArea: (area) => {
    const prev = get().workArea
    // Avoid spurious updates (ResizeObserver fires continuously)
    if (
      prev.left === area.left &&
      prev.top === area.top &&
      prev.width === area.width &&
      prev.height === area.height
    ) {
      return
    }

    const { windows } = get()
    // Re-clamp every open, non-maximized window so it stays inside the new area
    const updated = windows.map((w) => {
      if (w.isMaximized) return w
      const size = fitSize(w.size, area)
      return {
        ...w,
        size,
        position: clampPosition(w.position, size, area),
      }
    })

    set({ workArea: area, windows: updated })
  },

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
    const area = get().workArea
    // Never let a fresh window be larger than the usable work area
    const size = fitSize(defaultSizes[type], area)

    const offset = (windows.length % 6) * 32
    const position = clampPosition(
      {
        x: (area.width - size.width) / 2 + offset,
        y: (area.height - size.height) / 2 + offset - 20,
      },
      size,
      area,
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
      const area = get().workArea
      // The restored size must still fit the current work area (the user may
      // have resized the window or the viewport/sidebar changed while maximized)
      const restoredSize = fitSize(prev?.size || target.size, area)
      const restoredPosition = clampPosition(prev?.position || target.position, restoredSize, area)
      set({
        windows: windows.map(w => 
          w.id === id
            ? {
                ...w,
                isMaximized: false,
                zIndex: newZ,
                position: restoredPosition,
                size: restoredSize,
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
    const area = get().workArea
    const fitted = fitSize(size, area)
    const { windows } = get()
    set({
      windows: windows.map(w => 
        w.id === id ? { ...w, size: fitted } : w
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

  minimizeAll: () => {
    const { windows } = get()
    set({
      windows: windows.map(w => ({ ...w, isMinimized: true })),
      activeWindow: null,
    })
  },
}))

