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
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react'

interface SidebarItem {
  type: WindowType | 'home'
  icon: typeof Home
  label: string
}

const primaryItems: SidebarItem[] = [
  { type: 'home', icon: Home, label: 'Overview' },
  { type: 'about', icon: User, label: 'About' },
  { type: 'projects', icon: Folder, label: 'Projects' },
  { type: 'skills', icon: Code, label: 'Skills & stack' },
  { type: 'experience', icon: Briefcase, label: 'Experience' },
]

const secondaryItems: SidebarItem[] = [
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

  const renderItem = (item: SidebarItem, idx: number) => {
    let isActive = false
    let isOpen = false

    if (item.type === 'home') {
      isActive = windows.filter(w => !w.isMinimized).length === 0
    } else {
      isActive = windows.some(w => w.type === item.type && w.id === activeWindow && !w.isMinimized)
      isOpen = windows.some(w => w.type === item.type)
    }

    return (
      <li key={`${item.type}-${idx}`}>
        <button
          onClick={() => handleItemClick(item)}
          aria-current={isActive ? 'page' : undefined}
          className={`
            w-full flex items-center gap-2.5 px-2.5 py-[7px] rounded-md text-[12.5px]
            transition-colors duration-150 group relative
            ${isActive
              ? 'bg-foreground/[0.055] text-foreground'
              : 'text-foreground/50 hover:text-foreground/80 hover:bg-foreground/[0.03]'
            }
          `}
        >
          <item.icon
            className={`w-[15px] h-[15px] flex-shrink-0 transition-colors ${
              isActive ? 'text-primary' : 'text-foreground/40 group-hover:text-foreground/60'
            }`}
            strokeWidth={1.7}
          />

          <AnimatePresence initial={false}>
            {!sidebarCollapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.1 }}
                className="truncate flex-1 text-left"
              >
                {item.label}
              </motion.span>
            )}
          </AnimatePresence>

          {!sidebarCollapsed && isOpen && item.type !== 'home' && (
            <span className={`w-1 h-1 rounded-full shrink-0 ${isActive ? 'bg-primary' : 'bg-foreground/25'}`} />
          )}

          {sidebarCollapsed && isOpen && item.type !== 'home' && (
            <span className="absolute right-1.5 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-primary/80" />
          )}

          {sidebarCollapsed && (
            <div className="absolute left-full ml-2.5 px-2.5 py-1 rounded-md bg-popover text-[11px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none z-50 shadow-[0_10px_30px_rgba(10,7,4,0.6)] text-foreground/90 border border-hairline">
              {item.label}
            </div>
          )}
        </button>
      </li>
    )
  }

  return (
    <motion.aside
      initial={false}
      animate={{ width: sidebarCollapsed ? 54 : 208 }}
      transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
      className="h-full flex flex-col bg-sidebar/55 border-r border-hairline select-none shrink-0"
    >
      {/* Header */}
      <div className="h-12 flex items-center justify-between px-3 border-b border-hairline shrink-0">
        <AnimatePresence initial={false}>
          {!sidebarCollapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-[10px] font-medium tracking-[0.16em] uppercase text-muted-foreground/60 font-mono"
            >
              Workspace
            </motion.span>
          )}
        </AnimatePresence>
        <button
          onClick={toggleSidebar}
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className={`p-1.5 rounded-md text-foreground/35 hover:text-foreground/70 hover:bg-foreground/[0.05] transition-colors ${
            sidebarCollapsed ? 'mx-auto' : ''
          }`}
        >
          {sidebarCollapsed ? <PanelLeftOpen className="w-3.5 h-3.5" /> : <PanelLeftClose className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-2.5 overflow-y-auto custom-scrollbar overflow-x-visible">
        <ul className="space-y-px px-1.5">
          {primaryItems.map(renderItem)}
        </ul>

        <div className="my-2.5 mx-2.5 h-px bg-hairline" />

        <ul className="space-y-px px-1.5">
          {secondaryItems.map(renderItem)}
        </ul>
      </nav>

      {/* Identity footer */}
      <div className="shrink-0 border-t border-hairline p-2">
        <button
          onClick={() => openWindow('about')}
          className="w-full flex items-center gap-2.5 p-1.5 rounded-md hover:bg-foreground/[0.035] transition-colors group text-left"
        >
          <span className="relative shrink-0">
            <span className="block w-7 h-7 rounded-full overflow-hidden border border-hairline-strong bg-surface">
              <img src="/avatar-small.jpg" alt="Prem Rajesh" className="w-full h-full object-cover object-top" />
            </span>
            <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-accent ring-2 ring-sidebar" />
          </span>

          <AnimatePresence initial={false}>
            {!sidebarCollapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="min-w-0 flex-1"
              >
                <span className="block text-[11.5px] leading-tight text-foreground/85 truncate group-hover:text-foreground transition-colors">
                  Prem Rajesh
                </span>
                <span className="block text-[9.5px] leading-tight text-muted-foreground/60 truncate mt-0.5">
                  Open to internships
                </span>
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.aside>
  )
}
