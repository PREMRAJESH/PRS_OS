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
}

const categoryLabels: Record<CommandCategory, string> = {
  ai: 'Assistant',
  apps: 'Applications',
  navigation: 'Go to',
  projects: 'Projects',
  themes: 'Palette',
  links: 'Elsewhere',
}

const themeLabels: Record<ThemeName, string> = {
  'ai-lab': 'Ember',
  matrix: 'Moss',
  minimal: 'Paper',
  cyber: 'Clay',
  synthwave: 'Slate',
  ubuntu: 'Dusk',
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
        label: q.startsWith('>') ? 'Ask the assistant' : 'Search the workspace',
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
        label: 'Projects',
        description: 'Selected work and case studies',
        icon: FolderOpen,
        category: 'apps',
        keywords: ['projects', 'work', 'code', 'explorer'],
        action: execute('projects'),
      },
      {
        id: 'terminal',
        label: 'Terminal',
        description: 'Shell for the workspace',
        icon: Terminal,
        category: 'apps',
        keywords: ['terminal', 'bash', 'shell', 'cmd'],
        action: execute('terminal'),
      },
      {
        id: 'resume',
        label: 'Résumé',
        description: 'Background, experience and education',
        icon: FileText,
        category: 'apps',
        keywords: ['resume', 'cv', 'experience', 'career'],
        action: execute('resume'),
      },
      {
        id: 'runtime',
        label: 'Runtime',
        description: 'Open live project demos',
        icon: Globe,
        category: 'apps',
        keywords: ['runtime', 'demo', 'live', 'browser', 'launch'],
        action: execute('runtime'),
      },
      {
        id: 'github',
        label: 'GitHub',
        description: 'Repositories and recent commits',
        icon: Github,
        category: 'apps',
        keywords: ['github', 'git', 'repo', 'source'],
        action: execute('github'),
      },
      // Navigation
      {
        id: 'nav-skills',
        label: 'Skills & stack',
        description: 'Tools used across projects',
        icon: Cpu,
        category: 'navigation',
        keywords: ['skills', 'tech', 'stack'],
        action: execute('skills'),
      },
      {
        id: 'nav-timeline',
        label: 'Timeline',
        description: 'Studies, internships and projects',
        icon: GitBranch,
        category: 'navigation',
        keywords: ['timeline', 'history'],
        action: execute('timeline'),
      },
      // Projects (Semantic results)
      {
        id: 'p-prs-os',
        label: 'PRS—OS',
        description: 'This portfolio, built as a desktop workspace',
        icon: Code2,
        category: 'projects',
        keywords: ['prs-os', 'portfolio', 'architecture', 'window manager'],
        action: execute('projects', 'PRS—OS', 'prsos'),
      },
      {
        id: 'p-nimbusx',
        label: 'Nimbus X',
        description: 'Real-time Android messaging',
        icon: FileText,
        category: 'projects',
        keywords: ['nimbusx', 'chat', 'supabase', 'react native'],
        action: execute('projects', 'Nimbus X', 'nimbusx'),
      },
      {
        id: 'p-nimbusx-demo',
        label: 'Launch Nimbus X',
        description: 'Open the live app in Runtime',
        icon: Zap,
        category: 'projects',
        keywords: ['demo', 'launch', 'nimbusx', 'live', 'open nimbusx'],
        action: () => {
          openWindow('runtime', 'Nimbus X · Runtime', 'https://nimbusx.vercel.app')
          toggleCommandPalette()
        },
      },
      {
        id: 'p-neuroscan',
        label: 'NeuroScan AI',
        description: 'MRI tumour classification with ONNX',
        icon: Cpu,
        category: 'projects',
        keywords: ['ai', 'ml', 'medical', 'brain tumor', 'neuroscan', 'onnx', 'flask'],
        action: execute('projects', 'NeuroScan AI', 'neuroscan'),
      },
      {
        id: 'p-neuroscan-demo',
        label: 'Launch NeuroScan AI',
        description: 'Open the live demo in Runtime',
        icon: Zap,
        category: 'projects',
        keywords: ['demo', 'launch', 'neuroscan', 'live', 'open neuroscan'],
        action: () => {
          openWindow('runtime', 'NeuroScan AI · Runtime', 'https://neuroscan-pink.vercel.app/')
          toggleCommandPalette()
        },
      },
      {
        id: 'p-studyflow',
        label: 'StudyFlow',
        description: 'AI study planning from a syllabus',
        icon: FileText,
        category: 'projects',
        keywords: ['studyflow', 'gemini', 'schedule', 'supabase', 'nextjs'],
        action: execute('projects', 'StudyFlow', 'studyflow'),
      },
      {
        id: 'p-studyflow-demo',
        label: 'Launch StudyFlow',
        description: 'Open the live app in Runtime',
        icon: Zap,
        category: 'projects',
        keywords: ['demo', 'launch', 'studyflow', 'live', 'open studyflow'],
        action: () => {
          openWindow('runtime', 'StudyFlow · Runtime', 'https://studyflow-aii.vercel.app/')
          toggleCommandPalette()
        },
      },
      {
        id: 'p-codeviz',
        label: 'CodeViz',
        description: 'Step-through algorithm visualiser',
        icon: FileText,
        category: 'projects',
        keywords: ['codeviz', 'monaco', 'd3js', 'algorithms', 'visualization'],
        action: execute('projects', 'CodeViz', 'codeviz'),
      },
      {
        id: 'p-codeviz-demo',
        label: 'Launch CodeViz',
        description: 'Open the live app in Runtime',
        icon: Zap,
        category: 'projects',
        keywords: ['demo', 'launch', 'codeviz', 'live', 'open codeviz'],
        action: () => {
          openWindow('runtime', 'CodeViz · Runtime', 'https://code-visualizer.vercel.app/')
          toggleCommandPalette()
        },
      },
    ]

    // Themes
    const themeCommands = (['ai-lab', 'matrix', 'minimal', 'cyber', 'synthwave', 'ubuntu'] as ThemeName[]).map(t => ({
      id: `theme-${t}`,
      label: themeLabels[t],
      description: currentTheme === t ? 'Active palette' : 'Switch palette',
      icon: Palette,
      category: 'themes' as CommandCategory,
      keywords: ['theme', 'palette', t, themeLabels[t].toLowerCase()],
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
        label: 'Assistant',
        items: [{
          id: 'ai-prompt',
          label: aiIntent.label,
          description: `"${aiIntent.query}"`,
          icon: aiIntent.icon,
          isAI: true,
          action: () => {
            openWindow('ai-assistant', 'AI assistant', aiIntent.query)
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
          className="absolute inset-0 bg-background/60 backdrop-blur-[2px]"
        />

        {/* Palette */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: -6, filter: 'blur(6px)' }}
          animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, scale: 0.98, y: -6, filter: 'blur(6px)' }}
          transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-[600px] mx-4 rounded-xl bg-window/95 backdrop-blur-xl border border-hairline shadow-[var(--shadow-elevated)] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="px-4 py-3.5 flex items-center gap-3 border-b border-hairline">
            <Search className="w-4 h-4 text-muted-foreground/45 shrink-0" />
            <input
              ref={inputRef}
              autoFocus
              className="flex-1 bg-transparent border-none outline-none text-[13px] text-foreground placeholder:text-muted-foreground/35"
              placeholder="Search projects, sections, or ask a question…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              spellCheck={false}
            />
            <kbd className="px-1.5 py-0.5 rounded border border-hairline bg-foreground/[0.03] text-[9px] font-mono text-muted-foreground/40">
              esc
            </kbd>
          </div>

          {/* List */}
          <div ref={listRef} className="max-h-[400px] overflow-y-auto custom-scrollbar p-2">
            {groups.map((group) => (
              <div key={group.label} className="mb-1 last:mb-0">
                <div className="px-2.5 pt-2.5 pb-1.5 text-[9px] font-mono tracking-[0.14em] uppercase text-muted-foreground/35">
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
                        backgroundColor: isSelected ? 'rgba(255,248,236,0.045)' : 'rgba(0,0,0,0)',
                      }}
                      transition={{ duration: 0.1 }}
                      className="w-full flex items-center gap-3 px-2.5 py-2 rounded-md text-left transition-colors"
                    >
                      <div className={`
                        w-7 h-7 rounded-md flex items-center justify-center transition-colors shrink-0
                        ${isSelected
                          ? 'bg-primary/10 text-primary'
                          : 'bg-foreground/[0.03] text-muted-foreground/40'
                        }
                      `}>
                        <Icon className="w-3.5 h-3.5" strokeWidth={1.7} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`text-[12.5px] truncate transition-colors ${isSelected ? 'text-foreground' : 'text-foreground/70'}`}>
                          {cmd.label}
                        </div>
                        <div className="text-[10px] text-muted-foreground/40 truncate mt-0.5">{cmd.description}</div>
                      </div>
                      {isSelected && (
                        <motion.div
                          initial={{ opacity: 0, x: -3 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-center gap-1.5 text-[9.5px] text-muted-foreground/45 shrink-0"
                        >
                          Open <CornerDownLeft className="w-3 h-3" />
                        </motion.div>
                      )}
                    </motion.button>
                  )
                })}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="px-3.5 py-2.5 border-t border-hairline flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="flex items-center gap-1 text-[9px] text-muted-foreground/35">
                <kbd className="px-1 py-0.5 rounded border border-hairline bg-foreground/[0.03] font-mono">↑↓</kbd>
                Navigate
              </div>
              <div className="flex items-center gap-1 text-[9px] text-muted-foreground/35">
                <kbd className="px-1 py-0.5 rounded border border-hairline bg-foreground/[0.03] font-mono">↵</kbd>
                Open
              </div>
            </div>
            <span className="text-[9px] font-mono tracking-[0.1em] uppercase text-muted-foreground/25">
              PRS—OS
            </span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
