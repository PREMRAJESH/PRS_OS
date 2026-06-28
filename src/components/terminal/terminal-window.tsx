'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useOSStore, type ThemeName } from '@/store/os-store'
import {
  filesystem, resolvePath, getNode, appMap, allCommands,
  type FsNode,
} from '@/data/terminal'

/* ─── Types ──────────────────────────────────────────── */

interface TermLine {
  id: string
  type: 'input' | 'output' | 'error' | 'system' | 'blank'
  content: string
}

let lineId = 0
const lid = () => `l-${++lineId}`

/* ─── Prompt component ───────────────────────────────── */

function Prompt({ cwd }: { cwd: string }) {
  return (
    <span className="select-none shrink-0">
      <span className="text-terminal-green">developer@prs-os</span>
      <span className="text-muted-foreground/60">:</span>
      <span className="text-primary">{cwd}</span>
      <span className="text-muted-foreground/60">$ </span>
    </span>
  )
}

/* ─── Main component ─────────────────────────────────── */

export function TerminalWindow() {
  const { openWindow, setTheme, currentTheme } = useOSStore()

  const [lines, setLines] = useState<TermLine[]>([
    { id: lid(), type: 'system', content: '  PRS-OS Terminal v2.0' },
    { id: lid(), type: 'system', content: '  Type "help" for available commands.' },
    { id: lid(), type: 'blank', content: '' },
  ])
  const [input, setInput] = useState('')
  const [cwd, setCwd] = useState('~')
  const [cmdHistory, setCmdHistory] = useState<string[]>([])
  const [histIdx, setHistIdx] = useState(-1)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [selSuggestion, setSelSuggestion] = useState(0)

  const inputRef = useRef<HTMLInputElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Auto-scroll
  useEffect(() => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
    })
  }, [lines])

  // Focus input on click
  const focusInput = useCallback(() => inputRef.current?.focus(), [])

  /* ── Autocomplete ─────────────────────── */

  useEffect(() => {
    if (!input.trim()) { setSuggestions([]); return }

    const parts = input.split(' ')
    const cmd = parts[0].toLowerCase()

    if (parts.length === 1) {
      // Command autocomplete
      const matches = allCommands.filter(c => c.startsWith(cmd) && c !== cmd)
      setSuggestions(matches.slice(0, 5))
    } else if ((cmd === 'open' || cmd === 'launch') && parts.length === 2) {
      // App autocomplete
      const appName = parts[1].toLowerCase()
      const matches = Object.keys(appMap).filter(a => a.startsWith(appName) && a !== appName)
      setSuggestions(matches.slice(0, 5))
    } else if ((cmd === 'cd' || cmd === 'cat' || cmd === 'ls') && parts.length === 2) {
      // Path autocomplete
      const partial = parts[1]
      const node = getNode(cwd)
      if (node?.type === 'dir' && node.children) {
        const matches = Object.keys(node.children).filter(n => n.startsWith(partial) && n !== partial)
        setSuggestions(matches.slice(0, 5))
      } else {
        setSuggestions([])
      }
    } else if (cmd === 'theme' && parts.length === 2) {
      const partial = parts[1].toLowerCase()
      const themes = ['ai-lab', 'matrix', 'minimal', 'cyber', 'synthwave', 'ubuntu']
      setSuggestions(themes.filter(t => t.startsWith(partial) && t !== partial).slice(0, 5))
    } else {
      setSuggestions([])
    }
    setSelSuggestion(0)
  }, [input, cwd])

  const acceptSuggestion = useCallback((s?: string) => {
    const suggestion = s ?? suggestions[selSuggestion]
    if (!suggestion) return
    const parts = input.split(' ')
    if (parts.length <= 1) {
      setInput(suggestion + ' ')
    } else {
      parts[parts.length - 1] = suggestion
      setInput(parts.join(' '))
    }
    setSuggestions([])
  }, [suggestions, selSuggestion, input])

  /* ── Add lines helper ─────────────────── */

  const push = useCallback((...newLines: TermLine[]) => {
    setLines(prev => [...prev, ...newLines])
  }, [])

  const out = useCallback((content: string | string[], type: TermLine['type'] = 'output') => {
    const arr = Array.isArray(content) ? content : [content]
    push(...arr.map(c => ({ id: lid(), type, content: c })))
  }, [push])

  /* ── Execute command ──────────────────── */

  const execute = useCallback((raw: string) => {
    const trimmed = raw.trim()
    if (!trimmed) return

    // Record
    push({ id: lid(), type: 'input', content: `\x00CWD:${cwd}\x00${trimmed}` })
    setCmdHistory(prev => [trimmed, ...prev.filter(c => c !== trimmed)].slice(0, 50))
    setHistIdx(-1)

    const parts = trimmed.split(/\s+/)
    const cmd = parts[0].toLowerCase()
    const args = parts.slice(1)

    switch (cmd) {

      /* ── clear ── */
      case 'clear':
        setLines([])
        return

      /* ── help ── */
      case 'help':
        out([
          '',
          '  Available Commands',
          '  ─────────────────────────────────────',
          '',
          '  help              Show this help message',
          '  about             Display developer info',
          '  projects          List all projects',
          '  skills            Show technical skills',
          '  resume            Open resume viewer',
          '  contact           Show contact information',
          '  neofetch          System information',
          '',
          '  open <app>        Open an application',
          '  launch <app>      Alias for open',
          '  theme <name>      Switch color theme',
          '',
          '  ls [path]         List directory contents',
          '  cd <path>         Change directory',
          '  cat <file>        View file contents',
          '  pwd               Print working directory',
          '  tree              Show directory tree',
          '  whoami            Current user',
          '  date              Current date/time',
          '  echo <text>       Print text',
          '  history           Command history',
          '  clear             Clear terminal',
          '',
          '  Apps: projects, terminal, resume, skills,',
          '        timeline, settings, ai, about',
          '',
        ])
        return

      /* ── about ── */
      case 'about':
        out([
          '',
          '  Prem Rajesh is a Software Engineering student passionate about',
          '  Artificial Intelligence, Machine Learning, and Full Stack Development.',
          '',
          '  He enjoys building practical software solutions, experimenting with',
          '  new technologies, and creating products that solve real-world problems.',
          '',
        ])
        return

      /* ── projects ── */
      case 'projects':
        openWindow('projects')
        out([
          '',
          '  ◆ NeuroScan AI ─────── Python · Flask · ONNX Runtime',
          '  ◆ StudyFlow ────────── Next.js · Supabase · Gemini AI',
          '  ◆ Nimbus X ─────────── React Native · Supabase · Redux',
          '  ◆ CodeViz ──────────── Next.js · Monaco · D3.js',
          '',
          '  Opening project explorer...',
          '',
        ])
        return

      /* ── skills ── */
      case 'skills':
        openWindow('skills')
         out([
           '',
           '  Technical Skills Matrix',
           '  ─────────────────────────────────────',
           '',
           '  [PROGRAMMING]  Python · Java · C++ · JavaScript',
           '  [FRONTEND]     React · Next.js · Tailwind CSS',
           '  [BACKEND]      Node.js · FastAPI · Firebase',
           '  [AI / ML]      TensorFlow · PyTorch · Gemini API',
           '  [DEV TOOLS]    Git · GitHub · Docker · Vercel',
           '',
         ])
        return

      /* ── resume ── */
      case 'resume':
        openWindow('resume')
        out(['', '  Opening resume viewer...', ''])
        return

      /* ── education ── */
      case 'education':
        openWindow('education')
        out([
          '',
          '  Government Engineering College, Dahod',
          '  Bachelor of Engineering (2024 - 2027)',
          '',
          '  Government Polytechnic, Dahod',
          '  Diploma in Computer Software Engineering (2021 - 2024) [CPI: 8.33]',
          '',
          '  Opening Education screen...',
          '',
        ])
        return

      /* ── experience ── */
      case 'experience':
        openWindow('experience')
        out([
          '',
          '  CSRBOX × IBM SkillsBuild × AICTE',
          '  AI Automation & Intelligent Solutions Intern (June 2026 - Present)',
          '',
          '  BrainyBeam Technologies Pvt. Ltd.',
          '  Web Development Intern (September 2022)',
          '',
          '  Opening Experience screen...',
          '',
        ])
        return

      /* ── certifications ── */
      case 'certifications':
        openWindow('certifications')
        out([
          '',
          '  1. Diploma Completion Certificate',
          '  2. BrainyBeam Web Development Internship Certificate',
          '  3. Additional online credentials (Web, AI, ML, Cloud)',
          '',
          '  Opening Certifications screen...',
          '',
        ])
        return

      /* ── github ── */
      case 'github':
        openWindow('github')
        out(['', '  Opening GitHub Workspace profile dashboard...', ''])
        return

      /* ── contact ── */
      case 'contact':
        out([
          '',
          '  Contact Information',
          '  ───────────────────',
          '',
          '  Email     sargarapremrajesh@gmail.com',
          '  GitHub    github.com/PREMRAJESH',
          '  LinkedIn  linkedin.com/in/gecdhd-comp-prem-sargara',
          '  LeetCode  leetcode.com/u/Sargara_Prem',
          '',
        ])
        return

      /* ── open / launch ── */
      case 'open':
      case 'launch': {
        const app = args[0]?.toLowerCase()
        if (app && appMap[app]) {
          openWindow(appMap[app])
          out([`  Opening ${app}...`])
        } else {
          out([
            app ? `  Unknown app: ${app}` : '  Usage: open <app>',
            '  Apps: projects, terminal, resume, skills, timeline, settings, ai, about',
          ], 'error')
        }
        return
      }

      /* ── theme ── */
      case 'theme': {
        const valid: ThemeName[] = ['ai-lab', 'matrix', 'minimal', 'cyber', 'synthwave', 'ubuntu']
        const name = args[0]?.toLowerCase()
        if (name && valid.includes(name as ThemeName)) {
          setTheme(name as ThemeName)
          out([`  Theme switched to ${name}`])
        } else {
          out([
            name ? `  Unknown theme: ${name}` : `  Current theme: ${currentTheme}`,
            `  Available: ${valid.join(', ')}`,
          ], name ? 'error' : 'output')
        }
        return
      }

      /* ── neofetch ── */
      case 'neofetch':
        out([
          '',
          '       ████████████           developer@prs-os',
          '     ██            ██         ─────────────────',
          '   ██    ██████    ██         OS: PRS-OS v2.0',
          '   ██  ██      ██  ██         Host: Browser Runtime',
          '   ██  ██      ██  ██         Kernel: React 19.x',
          '   ██  ██      ██  ██         Shell: /bin/prs-shell',
          '   ██    ██████    ██         Resolution: Responsive',
          '     ██            ██         Theme: ' + currentTheme,
          '       ████████████           Terminal: PRS Terminal',
          '                              CPU: Neural Engine v3',
          '       ██████████             Uptime: ' + Math.floor(Math.random() * 4 + 1) + 'h ' + Math.floor(Math.random() * 59) + 'm',
          '',
        ])
        return

      /* ── whoami ── */
      case 'whoami':
        out(['  developer@prs-os'])
        return

      /* ── date ── */
      case 'date':
        out([`  ${new Date().toLocaleString()}`])
        return

      /* ── echo ── */
      case 'echo':
        out([`  ${args.join(' ')}`])
        return

      /* ── pwd ── */
      case 'pwd':
        out([`  /home/developer${cwd === '~' ? '' : cwd.replace('~', '')}`])
        return

      /* ── history ── */
      case 'history':
        out(['', ...cmdHistory.slice(0, 20).map((c, i) => `  ${String(i + 1).padStart(3)}  ${c}`), ''])
        return

      /* ── ls ── */
      case 'ls': {
        const target = args[0] ? resolvePath(cwd, args[0]) : cwd
        const node = getNode(target)
        if (!node || node.type !== 'dir') {
          out([`  ls: cannot access '${args[0] || target}': No such directory`], 'error')
          return
        }
        const entries = Object.values(node.children || {})
        if (entries.length === 0) {
          out(['  (empty directory)'])
          return
        }
        const formatted = entries.map(e =>
          e.type === 'dir'
            ? `  \x1bDIR\x1b${e.name}/`
            : `  ${e.name}${e.size ? `  ${e.size.padStart(6)}` : ''}`
        )
        out(['', ...formatted, ''])
        return
      }

      /* ── cd ── */
      case 'cd': {
        if (!args[0] || args[0] === '~') { setCwd('~'); return }
        const target = resolvePath(cwd, args[0])
        const node = getNode(target)
        if (!node || node.type !== 'dir') {
          out([`  cd: no such directory: ${args[0]}`], 'error')
          return
        }
        setCwd(target)
        return
      }

      /* ── cat ── */
      case 'cat': {
        if (!args[0]) { out(['  Usage: cat <file>'], 'error'); return }
        const target = resolvePath(cwd, args[0])
        const node = getNode(target)
        if (!node || node.type !== 'file') {
          out([`  cat: ${args[0]}: No such file`], 'error')
          return
        }
        if (node.content) {
          out(['', ...node.content.split('\n').map(l => `  ${l}`), ''])
        } else {
          out([`  (binary file: ${node.name})`])
        }
        return
      }

      /* ── tree ── */
      case 'tree': {
        const target = args[0] ? resolvePath(cwd, args[0]) : cwd
        const node = getNode(target)
        if (!node || node.type !== 'dir') {
          out([`  tree: '${args[0] || target}' is not a directory`], 'error')
          return
        }
        const result: string[] = [target]
        const walk = (children: Record<string, FsNode>, prefix: string) => {
          const keys = Object.keys(children)
          keys.forEach((key, i) => {
            const isLast = i === keys.length - 1
            const connector = isLast ? '└── ' : '├── '
            const entry = children[key]
            result.push(`${prefix}${connector}${entry.name}${entry.type === 'dir' ? '/' : ''}`)
            if (entry.type === 'dir' && entry.children) {
              walk(entry.children, prefix + (isLast ? '    ' : '│   '))
            }
          })
        }
        walk(node.children || {}, '  ')
        out(['', ...result.map(l => `  ${l}`), ''])
        return
      }

      /* ── unknown ── */
      default:
        out([`  Command not found: ${cmd}`, '  Type "help" for available commands.'], 'error')
    }
  }, [cwd, openWindow, setTheme, currentTheme, cmdHistory, out, push])

  /* ── Keyboard handler ─────────────────── */

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'Enter':
        e.preventDefault()
        setSuggestions([])
        execute(input)
        setInput('')
        break

      case 'ArrowUp':
        e.preventDefault()
        if (suggestions.length > 0) {
          setSelSuggestion(prev => (prev > 0 ? prev - 1 : suggestions.length - 1))
        } else if (cmdHistory.length > 0 && histIdx < cmdHistory.length - 1) {
          const ni = histIdx + 1
          setHistIdx(ni)
          setInput(cmdHistory[ni])
        }
        break

      case 'ArrowDown':
        e.preventDefault()
        if (suggestions.length > 0) {
          setSelSuggestion(prev => (prev < suggestions.length - 1 ? prev + 1 : 0))
        } else if (histIdx > 0) {
          const ni = histIdx - 1
          setHistIdx(ni)
          setInput(cmdHistory[ni])
        } else if (histIdx === 0) {
          setHistIdx(-1)
          setInput('')
        }
        break

      case 'Tab':
        e.preventDefault()
        if (suggestions.length > 0) {
          acceptSuggestion()
        } else {
          // Single-match autocomplete
          const parts = input.split(' ')
          const partial = parts[parts.length - 1].toLowerCase()
          if (!partial) break
          let pool: string[] = []
          if (parts.length === 1) pool = allCommands
          else if (['open', 'launch'].includes(parts[0])) pool = Object.keys(appMap)
          else if (['cd', 'ls', 'cat'].includes(parts[0])) {
            const node = getNode(cwd)
            if (node?.children) pool = Object.keys(node.children)
          }
          const matches = pool.filter(c => c.startsWith(partial))
          if (matches.length === 1) {
            parts[parts.length - 1] = matches[0]
            setInput(parts.join(' ') + (parts.length === 1 ? ' ' : ''))
          }
        }
        break

      case 'Escape':
        setSuggestions([])
        break

      case 'l':
        if (e.ctrlKey) { e.preventDefault(); setLines([]); }
        break
    }
  }

  /* ── Render a single line ─────────────── */

  const renderLine = (line: TermLine) => {
    if (line.type === 'blank') return <div className="h-2" />

    if (line.type === 'input') {
      // Extract cwd from encoded content
      const match = line.content.match(/\x00CWD:(.+?)\x00(.+)/)
      const lineCwd = match ? match[1] : '~'
      const lineCmd = match ? match[2] : line.content
      return (
        <div className="flex items-start">
          <Prompt cwd={lineCwd} />
          <span className="text-foreground">{lineCmd}</span>
        </div>
      )
    }

    // Output lines
    let content = line.content

    // Handle directory highlighting marker
    const hasDirMark = content.includes('\x1bDIR\x1b')
    if (hasDirMark) {
      const dirName = content.replace(/.*\x1bDIR\x1b/, '')
      return (
        <div className="whitespace-pre leading-relaxed">
          {'  '}
          <span className="text-primary font-medium">{dirName}</span>
        </div>
      )
    }

    return (
      <div
        className={`whitespace-pre leading-relaxed ${
          line.type === 'error' ? 'text-red-400' :
          line.type === 'system' ? 'text-primary/80' :
          'text-foreground/70'
        }`}
      >
        {content}
      </div>
    )
  }

  /* ── Render ────────────────────────────── */

  return (
    <div
      className="h-full flex flex-col bg-[#080a12] font-mono text-[13px] cursor-text selection:bg-primary/30 relative overflow-hidden"
      onClick={focusInput}
    >
      {/* Subtle scanline overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.03)_2px,rgba(255,255,255,0.03)_4px)]" />

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto custom-scrollbar px-4 py-3 relative z-10"
      >
        {/* History */}
        {lines.map((line) => (
          <motion.div
            key={line.id}
            initial={{ opacity: 0, y: 2 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.08 }}
          >
            {renderLine(line)}
          </motion.div>
        ))}

        {/* Active input line */}
        <div className="relative mt-0.5">
          <div className="flex items-start">
            <Prompt cwd={cwd} />
            <div className="relative flex-1 min-w-0">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full bg-transparent outline-none !outline-none ring-0 !ring-0 border-none text-foreground caret-current focus:outline-none focus:ring-0"
                style={{ caretColor: 'oklch(0.78 0.18 150)' }}
                autoFocus
                spellCheck={false}
                autoComplete="off"
                autoCapitalize="off"
              />
              {/* Ghost autocomplete */}
              {suggestions.length > 0 && (
                <span
                  className="absolute top-0 text-muted-foreground/25 pointer-events-none select-none"
                  style={{ left: `${input.split(' ').pop()?.length || 0}ch`, paddingLeft: `${(input.length - (input.split(' ').pop()?.length || 0))}ch` }}
                >
                  {/* Inline ghost of first suggestion */}
                </span>
              )}
            </div>
          </div>

          {/* Autocomplete dropdown */}
          {suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.1 }}
              className="absolute left-0 mt-1 z-50 py-1 rounded-lg bg-background/95 border border-border/60 shadow-lg min-w-48 overflow-hidden"
              style={{ marginLeft: `${(input.lastIndexOf(' ') + 1) * 0.6 + 1}rem` }}
            >
              {suggestions.map((s, i) => (
                <button
                  key={s}
                  onClick={(e) => { e.stopPropagation(); acceptSuggestion(s) }}
                  onMouseEnter={() => setSelSuggestion(i)}
                  className={`w-full text-left px-3 py-1.5 text-xs font-mono flex items-center gap-2 transition-colors ${
                    i === selSuggestion
                      ? 'bg-primary/15 text-primary'
                      : 'text-foreground/70 hover:bg-secondary/50'
                  }`}
                >
                  <span className="text-muted-foreground/40">→</span>
                  {s}
                  {i === selSuggestion && (
                    <span className="ml-auto text-[10px] text-muted-foreground/40 font-mono">tab</span>
                  )}
                </button>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
