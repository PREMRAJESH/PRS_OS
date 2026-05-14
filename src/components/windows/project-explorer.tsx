'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { projectsData, categoryColors, type ProjectData, type FileNode } from '@/data/projects'
import {
  Folder,
  FolderOpen,
  FileCode,
  FileJson,
  FileText,
  File,
  ChevronRight,
  ChevronDown,
  ExternalLink,
  GitBranch,
  Star,
  Circle,
  X,
  Code2,
  Layers,
  AlertTriangle,
  Lightbulb,
  Cloud,
  BookOpen,
} from 'lucide-react'

/* ─── Tab types ──────────────────────────────────────── */

type TabId = string
type TabKind = 'overview' | 'code'

interface Tab {
  id: TabId
  label: string
  kind: TabKind
  projectId: string
  filePath?: string
  fileContent?: string
  fileLang?: string
}

/* ─── Language colors ────────────────────────────────── */

const langColors: Record<string, string> = {
  tsx: 'text-blue-400',
  ts: 'text-blue-400',
  jsx: 'text-yellow-300',
  js: 'text-yellow-300',
  py: 'text-yellow-400',
  go: 'text-cyan-400',
  json: 'text-yellow-500',
  md: 'text-gray-400',
  docker: 'text-blue-300',
  makefile: 'text-orange-400',
  txt: 'text-muted-foreground',
}

const statusColors: Record<string, string> = {
  active: 'text-green-400 bg-green-400/10 border-green-400/20',
  completed: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  archived: 'text-muted-foreground bg-muted/30 border-border/50',
}

/* ─── Main component ─────────────────────────────────── */

export function ProjectExplorer() {
  const [selectedProject, setSelectedProject] = useState<ProjectData>(projectsData[0])
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['src', 'app', 'cmd', 'models', 'pkg', 'components']))
  const [tabs, setTabs] = useState<Tab[]>([
    { id: `overview-${projectsData[0].id}`, label: `${projectsData[0].name}`, kind: 'overview', projectId: projectsData[0].id },
  ])
  const [activeTab, setActiveTab] = useState<TabId>(`overview-${projectsData[0].id}`)

  const toggleFolder = (path: string) => {
    setExpandedFolders(prev => {
      const next = new Set(prev)
      next.has(path) ? next.delete(path) : next.add(path)
      return next
    })
  }

  const selectProject = (project: ProjectData) => {
    setSelectedProject(project)
    const overviewId = `overview-${project.id}`
    if (!tabs.find(t => t.id === overviewId)) {
      setTabs(prev => [...prev, { id: overviewId, label: project.name, kind: 'overview', projectId: project.id }])
    }
    setActiveTab(overviewId)
  }

  const openFile = (node: FileNode, path: string) => {
    const tabId = `file-${selectedProject.id}-${path}`
    if (!tabs.find(t => t.id === tabId)) {
      setTabs(prev => [...prev, {
        id: tabId,
        label: node.name,
        kind: 'code',
        projectId: selectedProject.id,
        filePath: path,
        fileContent: node.content,
        fileLang: node.lang,
      }])
    }
    setActiveTab(tabId)
  }

  const closeTab = (id: TabId, e: React.MouseEvent) => {
    e.stopPropagation()
    const newTabs = tabs.filter(t => t.id !== id)
    setTabs(newTabs)
    if (activeTab === id && newTabs.length > 0) {
      setActiveTab(newTabs[newTabs.length - 1].id)
    }
  }

  const currentTab = tabs.find(t => t.id === activeTab)
  const currentProject = projectsData.find(p => p.id === currentTab?.projectId) || selectedProject

  return (
    <div className="h-full flex bg-background/50 overflow-hidden">
      {/* ── Left: File explorer sidebar ──────── */}
      <div className="w-56 border-r border-border/50 flex flex-col shrink-0">
        <div className="h-8 flex items-center px-3 border-b border-border/50">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">Explorer</span>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar py-1">
          {projectsData.map(project => (
            <div key={project.id}>
              {/* Project root */}
              <button
                onClick={() => selectProject(project)}
                className={`w-full flex items-center gap-2 px-2 py-1.5 text-left text-xs transition-colors ${
                  selectedProject.id === project.id
                    ? 'bg-primary/10 text-foreground'
                    : 'text-muted-foreground hover:bg-secondary/40 hover:text-foreground'
                }`}
              >
                <ChevronDown className={`w-3 h-3 shrink-0 transition-transform ${selectedProject.id === project.id ? '' : '-rotate-90'}`} />
                <Folder className={`w-3.5 h-3.5 shrink-0 ${selectedProject.id === project.id ? 'text-primary' : ''}`} />
                <span className="font-medium truncate">{project.name}</span>
                <Circle className={`w-1.5 h-1.5 ml-auto shrink-0 ${
                  project.status === 'active' ? 'fill-green-500 text-green-500' :
                  project.status === 'completed' ? 'fill-blue-500 text-blue-500' :
                  'fill-gray-500 text-gray-500'
                }`} />
              </button>

              {/* File tree (only for selected project) */}
              <AnimatePresence>
                {selectedProject.id === project.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <FileTree
                      items={project.files}
                      expanded={expandedFolders}
                      toggle={toggleFolder}
                      onFileClick={openFile}
                      path=""
                      depth={1}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right: Tab area + content ──────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Tab bar */}
        <div className="h-8 flex items-stretch border-b border-border/50 bg-background/60 overflow-x-auto custom-scrollbar shrink-0">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 text-xs border-r border-border/30 shrink-0 max-w-40 transition-colors group ${
                activeTab === tab.id
                  ? 'bg-background text-foreground border-b-2 border-b-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/30 border-b-2 border-b-transparent'
              }`}
            >
              {tab.kind === 'overview' ? (
                <BookOpen className="w-3 h-3 shrink-0 text-primary" />
              ) : (
                <FileIcon lang={tab.fileLang} />
              )}
              <span className="truncate">{tab.label}</span>
              {tabs.length > 1 && (
                <span
                  onClick={(e) => closeTab(tab.id, e)}
                  className="ml-auto pl-1 opacity-0 group-hover:opacity-100 hover:text-destructive transition-opacity shrink-0"
                >
                  <X className="w-3 h-3" />
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <AnimatePresence mode="wait">
            {currentTab?.kind === 'overview' ? (
              <motion.div
                key={currentTab.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
              >
                <ProjectOverview project={currentProject} />
              </motion.div>
            ) : currentTab?.kind === 'code' ? (
              <motion.div
                key={currentTab.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
              >
                <CodeView
                  content={currentTab.fileContent}
                  lang={currentTab.fileLang}
                  path={currentTab.filePath || ''}
                />
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

/* ─── Project Overview Tab ───────────────────────────── */

function ProjectOverview({ project }: { project: ProjectData }) {
  return (
    <div className="p-6 max-w-3xl space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-xl font-bold">{project.name}</h1>
          <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${statusColors[project.status]}`}>
            {project.status}
          </span>
          <div className="flex items-center gap-1 text-xs text-muted-foreground ml-auto">
            <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
            {project.stars}
          </div>
        </div>
        <p className="text-sm text-muted-foreground">{project.tagline}</p>
        <div className="flex items-center gap-3 mt-3">
          <a href={project.github} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
            <GitBranch className="w-3.5 h-3.5" /> GitHub <ExternalLink className="w-3 h-3" />
          </a>
          {project.demo && (
            <a href={project.demo} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
              Live Demo <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>

      {/* Tech stack */}
      <Section icon={Layers} title="Tech Stack">
        <div className="flex flex-wrap gap-1.5">
          {project.stack.map(t => (
            <span key={t.name} className={`text-[11px] px-2 py-0.5 rounded-full border font-mono ${categoryColors[t.category]}`}>
              {t.name}
            </span>
          ))}
        </div>
      </Section>

      {/* Overview */}
      <Section icon={BookOpen} title="Overview">
        <div className="text-sm text-foreground/80 leading-relaxed whitespace-pre-line">
          {project.overview}
        </div>
      </Section>

      {/* Architecture */}
      <Section icon={Code2} title="Architecture">
        <div className="text-sm text-foreground/80 leading-relaxed font-mono bg-background/60 rounded-lg border border-border/50 p-4 whitespace-pre-line">
          {project.architecture}
        </div>
      </Section>

      {/* Challenges */}
      <Section icon={AlertTriangle} title="Challenges">
        <ul className="space-y-2">
          {project.challenges.map((c, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-foreground/70">
              <span className="w-5 h-5 rounded-full bg-yellow-400/10 text-yellow-400 flex items-center justify-center shrink-0 text-[10px] font-bold mt-0.5">
                {i + 1}
              </span>
              {c}
            </li>
          ))}
        </ul>
      </Section>

      {/* Learnings */}
      <Section icon={Lightbulb} title="Key Learnings">
        <ul className="space-y-2">
          {project.learnings.map((l, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-foreground/70">
              <span className="text-green-400 mt-1 shrink-0">→</span>
              {l}
            </li>
          ))}
        </ul>
      </Section>

      {/* Deployment */}
      <Section icon={Cloud} title="Deployment Stack">
        <div className="flex flex-wrap gap-2">
          {project.deployment.map(d => (
            <span key={d} className="text-xs px-3 py-1.5 rounded-lg bg-secondary/40 border border-border/50 text-muted-foreground font-mono">
              {d}
            </span>
          ))}
        </div>
      </Section>
    </div>
  )
}

function Section({ icon: Icon, title, children }: { icon: any; title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-4 h-4 text-primary" />
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</h2>
      </div>
      {children}
    </div>
  )
}

/* ─── Code View Tab ──────────────────────────────────── */

function CodeView({ content, lang, path }: { content?: string; lang?: string; path: string }) {
  if (!content) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground/40 text-sm">
        <div className="text-center">
          <FileCode className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p>No preview available for this file</p>
          <p className="text-xs mt-1">{path}</p>
        </div>
      </div>
    )
  }

  const lines = content.split('\n')

  return (
    <div className="font-mono text-[13px] leading-relaxed">
      {/* Breadcrumb */}
      <div className="px-4 py-2 border-b border-border/40 text-[11px] text-muted-foreground/50 flex items-center gap-1">
        {path.split('/').filter(Boolean).map((seg, i, arr) => (
          <span key={i} className="flex items-center gap-1">
            {i > 0 && <ChevronRight className="w-3 h-3" />}
            <span className={i === arr.length - 1 ? 'text-foreground/80' : ''}>{seg}</span>
          </span>
        ))}
      </div>

      {/* Code with line numbers */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <tbody>
            {lines.map((line, i) => (
              <tr key={i} className="hover:bg-secondary/20 transition-colors">
                <td className="text-right pr-4 pl-4 py-0 select-none text-muted-foreground/30 w-12 text-xs align-top">
                  {i + 1}
                </td>
                <td className="pr-4 py-0 whitespace-pre">
                  <SyntaxLine line={line} lang={lang} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/* ─── Simple syntax highlighting ─────────────────────── */

function SyntaxLine({ line, lang }: { line: string; lang?: string }) {
  // Basic keyword-based highlighting
  if (!lang) return <span className="text-foreground/80">{line}</span>

  const isPython = lang === 'py'
  const isGo = lang === 'go'
  const isTsx = ['tsx', 'ts', 'jsx', 'js'].includes(lang)

  // Comments
  if (line.trimStart().startsWith('//') || line.trimStart().startsWith('#')) {
    return <span className="text-muted-foreground/50 italic">{line}</span>
  }

  // Simple token coloring
  let result = line

  const keywords = isTsx
    ? ['import', 'from', 'export', 'function', 'const', 'let', 'return', 'if', 'else', 'interface', 'type', 'async', 'await', 'new', 'class', 'extends', 'default']
    : isPython
    ? ['import', 'from', 'def', 'class', 'return', 'if', 'else', 'for', 'in', 'with', 'as', 'try', 'except', 'raise']
    : isGo
    ? ['package', 'import', 'func', 'return', 'if', 'else', 'for', 'range', 'type', 'struct', 'var', 'const', 'defer', 'go']
    : []

  // Crude but functional: wrap in spans
  const parts: { text: string; color: string }[] = []
  const tokens = result.split(/(\s+|[(){}[\],.:;=<>!&|+\-*/]+|"[^"]*"|'[^']*'|`[^`]*`)/)

  for (const token of tokens) {
    if (!token) continue
    if ((token.startsWith('"') && token.endsWith('"')) || (token.startsWith("'") && token.endsWith("'")) || (token.startsWith('`') && token.endsWith('`'))) {
      parts.push({ text: token, color: 'text-green-400' })
    } else if (keywords.includes(token)) {
      parts.push({ text: token, color: 'text-purple-400' })
    } else if (/^\d+$/.test(token)) {
      parts.push({ text: token, color: 'text-orange-400' })
    } else if (token.match(/^[A-Z][a-zA-Z]*$/)) {
      parts.push({ text: token, color: 'text-yellow-300' })
    } else {
      parts.push({ text: token, color: 'text-foreground/80' })
    }
  }

  return (
    <span>
      {parts.map((p, i) => (
        <span key={i} className={p.color}>{p.text}</span>
      ))}
    </span>
  )
}

/* ─── File tree ──────────────────────────────────────── */

function FileTree({
  items, expanded, toggle, onFileClick, path, depth,
}: {
  items: FileNode[]
  expanded: Set<string>
  toggle: (p: string) => void
  onFileClick: (node: FileNode, path: string) => void
  path: string
  depth: number
}) {
  const sorted = useMemo(() => {
    return [...items].sort((a, b) => {
      if (a.type !== b.type) return a.type === 'dir' ? -1 : 1
      return a.name.localeCompare(b.name)
    })
  }, [items])

  return (
    <>
      {sorted.map(item => {
        const itemPath = `${path}/${item.name}`
        const isExpanded = expanded.has(item.name)

        if (item.type === 'dir') {
          return (
            <div key={itemPath}>
              <button
                onClick={() => toggle(item.name)}
                className="w-full flex items-center gap-1 py-[3px] text-xs hover:bg-secondary/30 transition-colors text-left group"
                style={{ paddingLeft: `${depth * 12 + 4}px` }}
              >
                {isExpanded ? <ChevronDown className="w-3 h-3 text-muted-foreground/50" /> : <ChevronRight className="w-3 h-3 text-muted-foreground/50" />}
                {isExpanded ? <FolderOpen className="w-3.5 h-3.5 text-primary/80" /> : <Folder className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary/60" />}
                <span className="text-foreground/80 ml-0.5">{item.name}</span>
              </button>
              <AnimatePresence>
                {isExpanded && item.children && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="overflow-hidden"
                  >
                    <FileTree items={item.children} expanded={expanded} toggle={toggle} onFileClick={onFileClick} path={itemPath} depth={depth + 1} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        }

        return (
          <button
            key={itemPath}
            onClick={() => onFileClick(item, itemPath)}
            className="w-full flex items-center gap-1.5 py-[3px] text-xs hover:bg-secondary/30 transition-colors text-left text-muted-foreground hover:text-foreground"
            style={{ paddingLeft: `${depth * 12 + 20}px` }}
          >
            <FileIcon lang={item.lang} />
            <span>{item.name}</span>
          </button>
        )
      })}
    </>
  )
}

/* ─── File icon ──────────────────────────────────────── */

function FileIcon({ lang }: { lang?: string }) {
  const color = langColors[lang || ''] || 'text-muted-foreground'

  switch (lang) {
    case 'tsx':
    case 'ts':
    case 'jsx':
    case 'js':
    case 'py':
    case 'go':
      return <FileCode className={`w-3.5 h-3.5 ${color}`} />
    case 'json':
      return <FileJson className={`w-3.5 h-3.5 ${color}`} />
    case 'md':
      return <FileText className={`w-3.5 h-3.5 ${color}`} />
    default:
      return <File className={`w-3.5 h-3.5 ${color}`} />
  }
}
