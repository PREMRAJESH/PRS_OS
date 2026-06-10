'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useOSStore, type WindowType } from '@/store/os-store'
import {
  Home,
  User,
  Folder,
  Code,
  Briefcase,
  GraduationCap,
  Award,
  Mail,
  ChevronLeft,
  ChevronRight,
  Settings,
} from 'lucide-react'

interface SidebarItem {
  type: WindowType | 'home'
  icon: any
  label: string
}

const sidebarItems: SidebarItem[] = [
  { type: 'home', icon: Home, label: 'Home' },
  { type: 'about', icon: User, label: 'About Me' },
  { type: 'projects', icon: Folder, label: 'Projects' },
  { type: 'skills', icon: Code, label: 'Skills' },
  { type: 'experience', icon: Briefcase, label: 'Experience' },
  { type: 'education', icon: GraduationCap, label: 'Education' },
  { type: 'certifications', icon: Award, label: 'Certifications' },
  { type: 'quick-links', icon: Mail, label: 'Contact' },
]

export function Sidebar() {
  const { sidebarCollapsed, toggleSidebar, openWindow, windows, activeWindow, minimizeAll } = useOSStore()

  const handleItemClick = (item: SidebarItem) => {
    if (item.type === 'home') {
      minimizeAll()
    } else {
      openWindow(item.type as WindowType)
    }
  }

  return (
    <motion.aside
      initial={false}
      animate={{ width: sidebarCollapsed ? 56 : 210 }}
      transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
      className="h-full flex flex-col bg-[oklch(0.075_0.008_240/0.6)] backdrop-blur-sm border-r border-white/5 select-none"
    >
      {/* Header */}
      <div className="h-10 flex items-center justify-between px-3 border-b border-white/5">
        <AnimatePresence mode="wait">
          {!sidebarCollapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-[10px] font-bold text-foreground/25 uppercase tracking-[0.2em] font-sans"
            >
              PREM OS
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
      <nav className="flex-1 py-3 overflow-y-auto custom-scrollbar">
        <ul className="space-y-0.5 px-2">
          {sidebarItems.map((item, idx) => {
            // Determine active state
            let isActive = false
            let isOpen = false
            if (item.type === 'home') {
              isActive = windows.filter(w => !w.isMinimized).length === 0
            } else {
              isActive = windows.some(w => w.type === item.type && w.id === activeWindow && !w.isMinimized)
              isOpen = windows.some(w => w.type === item.type)
            }
            
            return (
              <li key={idx}>
                <button
                  onClick={() => handleItemClick(item)}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs
                    transition-all duration-200 group relative font-sans
                    ${isActive 
                      ? 'bg-primary/[0.08] text-primary' 
                      : 'text-foreground/45 hover:text-foreground/75 hover:bg-white/[0.03]'
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
                        className="truncate font-semibold tracking-wide sidebar-label"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  
                  {/* Active indicator bar */}
                  {isOpen && item.type !== 'home' && (
                    <motion.div
                      layoutId={`sidebar-indicator-${item.type}`}
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-4 rounded-r-full bg-primary"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}

                  {/* Tooltip for collapsed state */}
                  {sidebarCollapsed && (
                    <div className="absolute left-full ml-3 px-2.5 py-1.5 rounded-lg bg-[oklch(0.12_0.01_240/0.98)] backdrop-blur-xl text-[10px] font-black uppercase tracking-wider whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-[0_8px_32px_rgba(0,0,0,0.6)] text-white/90 border border-white/10">
                      {item.label}
                    </div>
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* System Status Panel at Bottom */}
      <div className="p-4 border-t border-white/5 font-mono text-[9px] space-y-3 shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
          {!sidebarCollapsed && <span className="text-muted-foreground/60 font-semibold tracking-wide">All systems operational</span>}
        </div>
        {!sidebarCollapsed && (
          <div className="space-y-0.5">
            <span className="block text-muted-foreground/30 font-bold uppercase tracking-wider text-[8px]">Uptime</span>
            <span className="block text-muted-foreground/50 font-bold">12d 14h 32m</span>
          </div>
        )}
      </div>
    </motion.aside>
  )
}
