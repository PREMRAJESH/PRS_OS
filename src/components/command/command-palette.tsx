'use client'

import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useOSStore, type WindowType, type ThemeName } from '@/store/os-store'
import {
  Search,
  FolderOpen,
  Terminal,
  FileText,
  Cpu,
  GitBranch,
  Settings,
  Sparkles,
  User,
  Palette,
  Github,
  Command,
  CornerDownLeft,
  Zap,
  Globe,
  Code2,
} from 'lucide-react'

/* ─── Types ──────────────────────────────────────────────── */

type CommandCategory = 'ai' | 'apps' | 'navigation' | 'projects' | 'themes' | 'links'

interface CommandItem {
  id: string
  label: string
  description: string
  icon: any
  category: CommandCategory
  keywords: string[]
  shortcut?: string
  action: () => void
  accent?: string
}

const categoryLabels: Record<CommandCategory, string> = {
  ai: 'Intelligent AI',
  apps: 'Applications',
  navigation: 'Navigation',
  projects: 'Projects',
  themes: 'Appearance',
  links: 'External Systems',
}

const categoryOrder: CommandCategory[] = ['ai', 'apps', 'projects', 'navigation', 'themes', 'links']

/* ─── Fuzzy search scoring ───────────────────────────────── */

function fuzzyScore(needle: string, haystack: string): number {
  const n = needle.toLowerCase()
  const h = haystack.toLowerCase()
  if (h.startsWith(n)) return 100
  if (h.includes(n)) return 70
  
  let score = 0
  let hIdx = 0
  for (let i = 0; i < n.length; i++) {
    const found = h.indexOf(n[i], hIdx)
    if (found === -1) return 0
    score += found === hIdx ? 15 : 5
    hIdx = found + 1
  }
  return score
}

function scoreCommand(cmd: CommandItem, query: string): number {
  if (!query) return 0
  const cleanQuery = query.replace(/^>\s*/, '').trim()
  if (!cleanQuery) return 0
  
  const labelScore = fuzzyScore(cleanQuery, cmd.label)
  const descScore = fuzzyScore(cleanQuery, cmd.description) * 0.5
  const kwScore = Math.max(...cmd.keywords.map(k => fuzzyScore(cleanQuery, k))) * 0.8
  return Math.max(labelScore, descScore, kwScore)
}

/* ─── Recent commands store ──────────────────────────────── */

const RECENT_KEY = 'prs-os-recent-cmds'
const MAX_RECENT = 5

function getRecentIds(): string[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(sessionStorage.getItem(RECENT_KEY) || '[]')
  } catch {
    return []
  }
}

function pushRecentId(id: string) {
  const ids = getRecentIds().filter(x => x !== id)
  ids.unshift(id)
  sessionStorage.setItem(RECENT_KEY, JSON.stringify(ids.slice(0, MAX_RECENT)))
}

/* ─── Component ──────────────────────────────────────────── */

export function CommandPalette() {
  const { toggleCommandPalette, openWindow, setTheme, currentTheme } = useOSStore()
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  /* ── Intelligent AI Detection ─────────── */

  const aiIntent = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return null
    
    const isExplicit = q.startsWith('>')
    const isQuestion = q.match(/^(what|how|who|can|explain|show|search|tell)/)
    const hasLongQuery = q.split(' ').length > 2

    if (isExplicit || isQuestion || hasLongQuery) {
      return {
        query: q.startsWith('>') ? q.slice(1).trim() : q,
        label: q.startsWith('>') ? 'Ask PRS-AI' : 'Intelligent Search',
        icon: Sparkles
      }
    }
    return null
  }, [query])

  /* ── Build Command List ──────────────── */

  const commands: CommandItem[] = useMemo(() => {
    const execute = (type: WindowType, title?: string, q?: string) => () => {
      openWindow(type, title, q)
      toggleCommandPalette()
    }

    const baseCommands: CommandItem[] = [
      {
        id: 'projects',
        label: 'Project Explorer',
        description: 'Explore engineering work and systems',
        icon: FolderOpen,
        category: 'apps',
        keywords: ['projects', 'work', 'code', 'explorer'],
        action: execute('projects'),
        accent: 'text-sky-400',
      },
      {
        id: 'terminal',
        label: 'Terminal',
        description: 'High-fidelity system shell',
        icon: Terminal,
        category: 'apps',
        keywords: ['terminal', 'bash', 'shell', 'cmd'],
        action: execute('terminal'),
        accent: 'text-emerald-400',
      },
      {
        id: 'resume',
        label: 'Resume Viewer',
        description: 'Technical background and experience',
        icon: FileText,
        category: 'apps',
        keywords: ['resume', 'cv', 'experience', 'career'],
        action: execute('resume'),
        accent: 'text-amber-400',
      },
      {
        id: 'runtime',
        label: 'Runtime Browser',
        description: 'Execute live project demonstrations',
        icon: Globe,
        category: 'apps',
        keywords: ['runtime', 'demo', 'live', 'browser', 'launch'],
        action: execute('runtime'),
        accent: 'text-violet-400',
      },
      {
        id: 'github',
        label: 'GitHub Workspace',
        description: 'Integrated source control metrics',
        icon: Github,
        category: 'apps',
        keywords: ['github', 'git', 'repo', 'source'],
        action: execute('github'),
      },
      // Navigation
      {
        id: 'nav-skills',
        label: 'Technical Matrix',
        description: 'View competency and tech stack',
        icon: Cpu,
        category: 'navigation',
        keywords: ['skills', 'tech', 'stack'],
        action: execute('skills'),
      },
      {
        id: 'nav-timeline',
        label: 'Development History',
        description: 'Chronological project log',
        icon: GitBranch,
        category: 'navigation',
        keywords: ['timeline', 'history'],
        action: execute('timeline'),
      },
      // Projects (Semantic results)
      {
        id: 'p-prs-os',
        label: 'Project: PRS-OS',
        description: 'System orchestration and virtual workspace',
        icon: Code2,
        category: 'projects',
        keywords: ['prs-os', 'portfolio', 'architecture', 'window manager'],
        action: execute('projects', 'PRS-OS Explorer'),
      },
      {
        id: 'p-nimbusx',
        label: 'Project: NimbusX',
        description: 'Real-time messaging platform with WhatsApp-style UX',
        icon: FileText,
        category: 'projects',
        keywords: ['nimbusx', 'chat', 'firebase', 'webrtc', 'react'],
        action: execute('projects', 'NimbusX Explorer'),
      },
      {
        id: 'p-nimbusx-demo',
        label: 'Launch: NimbusX Live',
        description: 'Execute NimbusX in PRS-OS Runtime',
        icon: Zap,
        category: 'projects',
        keywords: ['demo', 'launch', 'nimbusx', 'live', 'open nimbusx'],
        action: () => {
          openWindow('runtime', 'NimbusX Runtime', 'https://nimbusx.vercel.app')
          toggleCommandPalette()
        },
        accent: 'text-violet-400',
      },
      {
        id: 'p-neuroscan',
        label: 'Project: NeuroScan AI',
        description: 'AI-powered MRI scan classification and validation',
        icon: Cpu,
        category: 'projects',
        keywords: ['ai', 'ml', 'medical', 'brain tumor', 'neuroscan', 'onnx', 'flask'],
        action: execute('projects', 'NeuroScan AI Explorer'),
      },
      {
        id: 'p-neuroscan-demo',
        label: 'Launch: NeuroScan Live',
        description: 'Execute NeuroScan AI in PRS-OS Runtime',
        icon: Zap,
        category: 'projects',
        keywords: ['demo', 'launch', 'neuroscan', 'live', 'open neuroscan'],
        action: () => {
          openWindow('runtime', 'NeuroScan AI Runtime', 'https://neuroscan-pink.vercel.app/')
          toggleCommandPalette()
        },
        accent: 'text-violet-400',
      },
      {
        id: 'p-studyflow',
        label: 'Project: StudyFlow',
        description: 'AI-driven study scheduling platform',
        icon: FileText,
        category: 'projects',
        keywords: ['studyflow', 'gemini', 'schedule', 'supabase', 'nextjs'],
        action: execute('projects', 'StudyFlow Explorer'),
      },
      {
        id: 'p-studyflow-demo',
        label: 'Launch: StudyFlow Live',
        description: 'Execute StudyFlow in PRS-OS Runtime',
        icon: Zap,
        category: 'projects',
        keywords: ['demo', 'launch', 'studyflow', 'live', 'open studyflow'],
        action: () => {
          openWindow('runtime', 'StudyFlow Runtime', 'https://studyflow-aii.vercel.app/')
          toggleCommandPalette()
        },
        accent: 'text-violet-400',
      },
      {
        id: 'p-codeviz',
        label: 'Project: CodeViz',
        description: 'Interactive code and algorithm visualization platform',
        icon: FileText,
        category: 'projects',
        keywords: ['codeviz', 'monaco', 'd3js', 'algorithms', 'visualization'],
        action: execute('projects', 'CodeViz Explorer'),
      },
      {
        id: 'p-codeviz-demo',
        label: 'Launch: CodeViz Live',
        description: 'Execute CodeViz in PRS-OS Runtime',
        icon: Zap,
        category: 'projects',
        keywords: ['demo', 'launch', 'codeviz', 'live', 'open codeviz'],
        action: () => {
          openWindow('runtime', 'CodeViz Runtime', 'https://code-visualizer.vercel.app/')
          toggleCommandPalette()
        },
        accent: 'text-violet-400',
      },
    ]

    // Themes
    const themeCommands = (['ai-lab', 'matrix', 'minimal', 'cyber', 'synthwave', 'ubuntu'] as ThemeName[]).map(t => ({
      id: `theme-${t}`,
      label: `Theme: ${t.charAt(0).toUpperCase() + t.slice(1)}`,
      description: currentTheme === t ? 'Active' : 'Switch',
      icon: Palette,
      category: 'themes' as CommandCategory,
      keywords: ['theme', t],
      action: () => { setTheme(t); toggleCommandPalette() },
    }))

    return [...baseCommands, ...themeCommands]
  }, [openWindow, toggleCommandPalette, setTheme, currentTheme])

  /* ── Filtering ────────────────────────── */

  const { results, recentResults } = useMemo(() => {
    if (!query.trim()) {
      const recentIds = getRecentIds()
      const recentResults = recentIds
        .map(id => commands.find(c => c.id === id))
        .filter(Boolean) as CommandItem[]
      return { results: commands.filter(c => c.category === 'apps'), recentResults }
    }

    const scored = commands
      .map(cmd => ({ cmd, score: scoreCommand(cmd, query) }))
      .filter(s => s.score > 0)
      .sort((a, b) => b.score - a.score)

    return { results: scored.map(s => s.cmd), recentResults: [] }
  }, [commands, query])

  /* ── UI Groups ────────────────────────── */

  const groups = useMemo(() => {
    const out: { label: string; items: any[] }[] = []

    // AI Intent is ALWAYS first if it exists
    if (aiIntent) {
      out.push({
        label: 'Intelligence',
        items: [{
          id: 'ai-prompt',
          label: aiIntent.label,
          description: `"${aiIntent.query}"`,
          icon: aiIntent.icon,
          isAI: true,
          accent: 'text-violet-400',
          action: () => {
            openWindow('ai-assistant', 'AI Assistant', aiIntent.query)
            toggleCommandPalette()
          }
        }]
      })
    }

    if (!query.trim() && recentResults.length > 0) {
      out.push({ label: 'Recent', items: recentResults })
    }

    if (query.trim()) {
      const bestResults = results.slice(0, 8)
      if (bestResults.length > 0) {
        out.push({ label: 'Results', items: bestResults })
      }
    } else {
      for (const cat of categoryOrder) {
        const items = results.filter(r => r.category === cat)
        if (items.length > 0) {
          out.push({ label: categoryLabels[cat], items })
        }
      }
    }

    return out
  }, [results, recentResults, query, aiIntent, openWindow, toggleCommandPalette])

  const flatItems = useMemo(() => groups.flatMap(g => g.items), [groups])

  /* ── Keyboard Nav ────────────────────── */

  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  const executeSelected = useCallback(() => {
    const cmd = flatItems[selectedIndex]
    if (cmd) {
      if (!cmd.isAI) pushRecentId(cmd.id)
      cmd.action()
    }
  }, [flatItems, selectedIndex])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') toggleCommandPalette()
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex(prev => (prev < flatItems.length - 1 ? prev + 1 : 0))
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : flatItems.length - 1))
      }
      if (e.key === 'Enter') {
        e.preventDefault()
        executeSelected()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [flatItems, selectedIndex, executeSelected, toggleCommandPalette])

  /* ── Render ──────────────────────────── */

  let globalIdx = -1

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[14vh]">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={toggleCommandPalette}
          className="absolute inset-0 bg-background/50"
        />

        {/* Palette */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: -8, filter: 'blur(8px)' }}
          animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, scale: 0.96, y: -8, filter: 'blur(8px)' }}
          transition={{ type: 'spring', stiffness: 500, damping: 35 }}
          className="relative w-full max-w-[620px] rounded-2xl bg-[oklch(0.09_0.01_240/0.95)] shadow-[0_40px_120px_-20px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.05)] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="px-5 py-4 flex items-center gap-4 shadow-[0_1px_0_rgba(255,255,255,0.03)]">
            <div className="flex items-center justify-center w-5 h-5">
              <Command className="w-4 h-4 text-primary/60" />
            </div>
            <input
              ref={inputRef}
              autoFocus
              className="flex-1 bg-transparent border-none outline-none text-base text-foreground placeholder:text-foreground/20"
              placeholder="Type a command or search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              spellCheck={false}
            />
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/[0.04]">
              <span className="text-[10px] font-bold text-foreground/25 tracking-widest uppercase">esc</span>
            </div>
          </div>

          {/* List */}
          <div ref={listRef} className="max-h-[420px] overflow-y-auto custom-scrollbar p-2">
            {groups.map((group) => (
              <div key={group.label} className="mb-1">
                <div className="px-3 py-2 text-[10px] font-black text-foreground/20 uppercase tracking-[0.2em]">
                  {group.label}
                </div>
                {group.items.map((cmd: any) => {
                  globalIdx++
                  const isSelected = globalIdx === selectedIndex
                  const Icon = cmd.icon
                  return (
                    <motion.button
                      key={cmd.id}
                      onMouseEnter={() => setSelectedIndex(flatItems.indexOf(cmd))}
                      onClick={() => {
                        if (!cmd.isAI) pushRecentId(cmd.id)
                        cmd.action()
                      }}
                      initial={false}
                      animate={{
                        backgroundColor: isSelected ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0)',
                      }}
                      transition={{ duration: 0.1 }}
                      className={`
                        w-full flex items-center gap-4 px-3 py-2.5 rounded-xl text-left transition-colors
                        ${isSelected ? '' : 'text-foreground/50'}
                      `}
                    >
                      <div className={`
                        w-8 h-8 rounded-lg flex items-center justify-center transition-colors
                        ${isSelected 
                          ? `bg-primary/15 ${cmd.accent || 'text-primary'}` 
                          : 'bg-white/[0.03] text-foreground/30'
                        }
                      `}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`text-sm font-semibold truncate ${isSelected ? 'text-foreground' : ''}`}>{cmd.label}</div>
                        <div className="text-[11px] text-foreground/25 truncate font-mono mt-0.5">{cmd.description}</div>
                      </div>
                      {isSelected && (
                        <motion.div
                          initial={{ opacity: 0, x: -4 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-center gap-1.5 text-[10px] text-primary/70 font-bold uppercase tracking-wider"
                        >
                          Run <CornerDownLeft className="w-3 h-3" />
                        </motion.div>
                      )}
                    </motion.button>
                  )
                })}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="px-4 py-2.5 bg-white/[0.02] flex items-center justify-between shadow-[0_-1px_0_rgba(255,255,255,0.03)]">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-[9px] font-bold text-foreground/20 uppercase tracking-widest">
                <kbd className="px-1 py-0.5 rounded bg-white/[0.04]">↑↓</kbd> Navigate
              </div>
              <div className="flex items-center gap-1 text-[9px] font-bold text-foreground/20 uppercase tracking-widest">
                <kbd className="px-1 py-0.5 rounded bg-white/[0.04]">↵</kbd> Execute
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-3 h-3 text-primary/30" />
              <span className="text-[9px] font-bold text-primary/30 uppercase tracking-[0.2em]">PRS-OS Command Hub</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
