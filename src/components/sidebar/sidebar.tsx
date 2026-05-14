'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useOSStore, type WindowType } from '@/store/os-store'
import {
  FolderOpen,
  Terminal,
  FileText,
  Cpu,
  GitBranch,
  Settings,
  User,
  ChevronLeft,
  ChevronRight,
  Github,
} from 'lucide-react'

const sidebarItems: { type: WindowType; icon: typeof FolderOpen; label: string }[] = [
  { type: 'projects', icon: FolderOpen, label: 'Projects' },
  { type: 'terminal', icon: Terminal, label: 'Terminal' },
  { type: 'resume', icon: FileText, label: 'Resume' },
  { type: 'skills', icon: Cpu, label: 'Skills' },
  { type: 'timeline', icon: GitBranch, label: 'Timeline' },
  { type: 'github', icon: Github, label: 'GitHub' },
  { type: 'about', icon: User, label: 'About' },
]

export function Sidebar() {
  const { sidebarCollapsed, toggleSidebar, openWindow, windows, activeWindow } = useOSStore()

  return (
    <motion.aside
      initial={false}
      animate={{ width: sidebarCollapsed ? 56 : 210 }}
      transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
      className="h-full flex flex-col bg-[oklch(0.075_0.008_240/0.6)] backdrop-blur-sm"
    >
      {/* Header */}
      <div className="h-10 flex items-center justify-between px-3">
        <AnimatePresence mode="wait">
          {!sidebarCollapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-[10px] font-bold text-foreground/25 uppercase tracking-[0.2em]"
            >
              Explorer
            </motion.span>
          )}
        </AnimatePresence>
        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded-lg hover:bg-white/[0.04] transition-colors text-foreground/25 hover:text-foreground/60"
        >
          {sidebarCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Navigation items */}
      <nav className="flex-1 py-2 overflow-y-auto">
        <ul className="space-y-0.5 px-2">
          {sidebarItems.map((item) => {
            const isActive = windows.some(w => w.type === item.type && w.id === activeWindow)
            const isOpen = windows.some(w => w.type === item.type)
            
            return (
              <li key={item.type}>
                <button
                  onClick={() => openWindow(item.type)}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm
                    transition-all duration-200 group relative
                    ${isActive 
                      ? 'bg-primary/[0.08] text-primary' 
                      : 'text-foreground/35 hover:text-foreground/70 hover:bg-white/[0.03]'
                    }
                  `}
                >
                  <item.icon className={`w-4 h-4 flex-shrink-0 transition-colors ${isActive ? 'text-primary' : 'group-hover:text-foreground/60'}`} />
                  <AnimatePresence mode="wait">
                    {!sidebarCollapsed && (
                      <motion.span
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -8 }}
                        transition={{ duration: 0.12 }}
                        className="truncate font-medium"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  
                  {/* Active indicator – thin accent bar */}
                  {isOpen && (
                    <motion.div
                      layoutId={`sidebar-indicator-${item.type}`}
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-4 rounded-r-full bg-primary"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}

                  {/* Tooltip for collapsed state */}
                  {sidebarCollapsed && (
                    <div className="absolute left-full ml-3 px-2.5 py-1.5 rounded-lg bg-[oklch(0.12_0.01_240/0.95)] backdrop-blur-xl text-[11px] font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-[0_8px_32px_rgba(0,0,0,0.6)] text-foreground/80">
                      {item.label}
                    </div>
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Settings at bottom */}
      <div className="p-2">
        <button
          onClick={() => openWindow('settings')}
          className={`
            w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm
            transition-all duration-200 group relative
            text-foreground/25 hover:text-foreground/60 hover:bg-white/[0.03]
          `}
        >
          <Settings className="w-4 h-4 flex-shrink-0" />
          <AnimatePresence mode="wait">
            {!sidebarCollapsed && (
              <motion.span
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.12 }}
                className="font-medium"
              >
                Settings
              </motion.span>
            )}
          </AnimatePresence>
          {sidebarCollapsed && (
            <div className="absolute left-full ml-3 px-2.5 py-1.5 rounded-lg bg-[oklch(0.12_0.01_240/0.95)] backdrop-blur-xl text-[11px] font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-[0_8px_32px_rgba(0,0,0,0.6)] text-foreground/80">
              Settings
            </div>
          )}
        </button>
      </div>
    </motion.aside>
  )
}
