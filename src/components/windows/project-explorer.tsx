'use client'

import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { projectsData, categoryColors, type ProjectData, type FileNode } from '@/data/projects'
import {
  Folder,
  FolderOpen,
  FileText,
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
  Monitor,
} from 'lucide-react'

type TabId = string

interface Tab {
  id: TabId
  label: string
  projectId: string
  filePath: string
  fileContent: string
  fileLang: string
}

const statusColors: Record<string, string> = {
  active: 'text-green-400 bg-green-400/10 border-green-400/20',
  completed: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  archived: 'text-muted-foreground bg-muted/30 border-border/50',
}

// Simple markdown parsing helper for high-fidelity rendering
function renderMarkdown(text: string) {
  if (!text) return null
  const lines = text.split('\n')
  return (
    <div className="space-y-4 font-sans text-sm leading-relaxed text-foreground/80">
      {lines.map((line, i) => {
        const trimmed = line.trim()
        if (!trimmed) return <div key={i} className="h-2" />
        
        // Headers
        if (trimmed.startsWith('# ')) {
          return <h1 key={i} className="text-2xl font-black text-white tracking-tight border-b border-white/5 pb-2 mt-6">{trimmed.slice(2)}</h1>
        }
        if (trimmed.startsWith('## ')) {
          return <h2 key={i} className="text-lg font-bold text-white tracking-tight mt-5 flex items-center gap-2">{trimmed.slice(3)}</h2>
        }
        if (trimmed.startsWith('### ')) {
          return <h3 key={i} className="text-sm font-bold text-white/90 tracking-wide mt-4 uppercase tracking-wider">{trimmed.slice(4)}</h3>
        }
        
        // Bullet points
        if (trimmed.startsWith('- ')) {
          const itemText = trimmed.slice(2)
          return (
            <div key={i} className="flex gap-2 pl-2 text-foreground/70">
              <span className="text-primary font-bold select-none">•</span>
              <span dangerouslySetInnerHTML={{ 
                __html: itemText
                  .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
                  .replace(/\`(.*?)\`/g, '<code class="bg-white/5 px-1.5 py-0.5 rounded font-mono text-[11px] text-primary">$1</code>')
              }} />
            </div>
          )
        }

        // Standard paragraph
        return (
          <p key={i} dangerouslySetInnerHTML={{
            __html: trimmed
              .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
              .replace(/\`(.*?)\`/g, '<code class="bg-white/5 px-1.5 py-0.5 rounded font-mono text-[11px] text-primary">$1</code>')
          }} />
        )
      })}
    </div>
  )
}

export function ProjectExplorer() {
  const [selectedProject, setSelectedProject] = useState<ProjectData>(projectsData[0])
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['neuroscan', 'studyflow', 'nimbusx', 'codeviz']))
  
  const initialOverview = projectsData[0].files.find(f => f.name === 'Overview.md')!
  const [tabs, setTabs] = useState<Tab[]>([
    { 
      id: `file-${projectsData[0].id}-Overview.md`, 
      label: 'Overview.md', 
      projectId: projectsData[0].id,
      filePath: `/${projectsData[0].id}/Overview.md`,
      fileContent: initialOverview.content || '',
      fileLang: 'md'
    },
  ])
  const [activeTab, setActiveTab] = useState<TabId>(`file-${projectsData[0].id}-Overview.md`)

  const toggleFolder = (path: string) => {
    setExpandedFolders(prev => {
      const next = new Set(prev)
      next.has(path) ? next.delete(path) : next.add(path)
      return next
    })
  }

  const openFile = (node: FileNode, project: ProjectData) => {
    const tabId = `file-${project.id}-${node.name}`
    if (!tabs.find(t => t.id === tabId)) {
      setTabs(prev => [...prev, {
        id: tabId,
        label: node.name,
        projectId: project.id,
        filePath: `/${project.id}/${node.name}`,
        fileContent: node.content || '',
        fileLang: node.lang || 'md'
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
  const currentFileName = currentTab ? currentTab.label : 'Overview.md'

  return (
    <div className="h-full flex bg-background/50 overflow-hidden font-sans select-none">
      {/* ── Left: File explorer sidebar ──────── */}
      <div className="w-56 border-r border-border/50 flex flex-col shrink-0 bg-background/25">
        <div className="h-8 flex items-center px-3 border-b border-border/50">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">Explorer</span>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar py-1">
          {projectsData.map(project => (
            <div key={project.id}>
              {/* Project root folder */}
              <button
                onClick={() => {
                  setSelectedProject(project)
                  toggleFolder(project.id)
                }}
                className={`w-full flex items-center gap-2 px-2 py-1.5 text-left text-xs transition-colors ${
                  selectedProject.id === project.id
                    ? 'bg-primary/10 text-foreground'
                    : 'text-muted-foreground hover:bg-secondary/40 hover:text-foreground'
                }`}
              >
                <ChevronDown className={`w-3.5 h-3.5 shrink-0 text-muted-foreground/45 transition-transform ${expandedFolders.has(project.id) ? '' : '-rotate-90'}`} />
                <Folder className={`w-4 h-4 shrink-0 ${selectedProject.id === project.id ? 'text-primary' : 'text-muted-foreground/60'}`} />
                <span className="font-medium truncate">{project.name}</span>
                <Circle className={`w-1.5 h-1.5 ml-auto shrink-0 ${
                  project.status === 'active' ? 'fill-green-500 text-green-500' :
                  'fill-blue-500 text-blue-500'
                }`} />
              </button>

              {/* Six markdown files */}
              <AnimatePresence>
                {expandedFolders.has(project.id) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.12 }}
                    className="overflow-hidden"
                  >
                    <div className="py-0.5 space-y-[1px]">
                      {project.files.map(file => {
                        const fileTabId = `file-${project.id}-${file.name}`
                        const isTabActive = activeTab === fileTabId
                        return (
                          <button
                            key={file.name}
                            onClick={() => {
                              setSelectedProject(project)
                              openFile(file, project)
                            }}
                            className={`w-full flex items-center gap-2 py-1 text-left text-[11px] transition-colors ${
                              isTabActive
                                ? 'bg-secondary/55 text-foreground font-semibold border-r-2 border-primary'
                                : 'text-muted-foreground/80 hover:bg-secondary/25 hover:text-foreground'
                            }`}
                            style={{ paddingLeft: '28px' }}
                          >
                            <FileText className="w-3.5 h-3.5 text-muted-foreground/50 shrink-0" />
                            <span className="truncate">{file.name}</span>
                          </button>
                        )
                      })}
                    </div>
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
          {tabs.map(tab => {
            const isTabFocused = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id)
                  const proj = projectsData.find(p => p.id === tab.projectId)
                  if (proj) setSelectedProject(proj)
                }}
                className={`flex items-center gap-2 px-3 text-xs border-r border-border/30 shrink-0 max-w-44 transition-colors group ${
                  isTabFocused
                    ? 'bg-background text-foreground border-b-2 border-b-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/20 border-b-2 border-b-transparent'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 shrink-0 text-primary/70" />
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
            )
          })}
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
              className="max-w-4xl mx-auto space-y-8 pb-16"
            >
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-5">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h1 className="text-xl font-bold tracking-tight text-white">{currentProject.name}</h1>
                    <span className={`text-[9px] px-2 py-0.5 rounded-full border font-medium uppercase tracking-wider ${statusColors[currentProject.status]}`}>
                      {currentProject.status}
                    </span>
                    <div className="flex items-center gap-1 text-[11px] text-muted-foreground ml-2 font-mono">
                      <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                      {currentProject.stars} stars
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">{currentProject.tagline}</p>
                </div>
                
                <div className="flex items-center gap-2 shrink-0">
                  <a href={currentProject.github} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/50 text-[10px] font-mono text-foreground/80 hover:text-foreground hover:bg-white/5 transition-all">
                    <GitBranch className="w-3.5 h-3.5 text-primary" /> Source <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                  {currentProject.demo && (
                    <a href={currentProject.demo} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-[10px] font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/10">
                      Live Demo <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  )}
                </div>
              </div>

              {/* Main Content Sections */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left side: Markdown details */}
                <div className="lg:col-span-7 space-y-6">
                  {renderMarkdown(currentTab?.fileContent || '')}
                </div>

                {/* Right side: Interactive layout based on which file is open */}
                <div className="lg:col-span-5 space-y-6">
                  {currentFileName === 'Overview.md' && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-1">
                        <Monitor className="w-4 h-4 text-primary" />
                        <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Interface Preview</h2>
                      </div>
                      <ProjectPreviewMock projectId={currentProject.id} />
                    </div>
                  )}

                  {currentFileName === 'Problem.md' && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-1">
                        <AlertTriangle className="w-4 h-4 text-primary" />
                        <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Engineering Challenges</h2>
                      </div>
                      <div className="space-y-3">
                        {currentProject.challenges.map((c, i) => (
                          <div key={i} className="flex gap-3 p-4 rounded-xl bg-yellow-500/5 border border-yellow-500/10 text-xs text-foreground/80">
                            <span className="w-5 h-5 rounded bg-yellow-500/10 text-yellow-500 flex items-center justify-center shrink-0 font-bold">
                              {i + 1}
                            </span>
                            <span className="leading-relaxed">{c}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {currentFileName === 'Architecture.md' && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-1">
                        <Code2 className="w-4 h-4 text-primary" />
                        <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Architecture Flow</h2>
                      </div>
                      <ProjectArchitectureFlow projectId={currentProject.id} />
                    </div>
                  )}

                  {currentFileName === 'TechStack.md' && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-1">
                        <Layers className="w-4 h-4 text-primary" />
                        <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Technology Specs</h2>
                      </div>
                      <div className="p-4 rounded-xl bg-secondary/20 border border-border/30 space-y-4">
                        <div className="flex flex-wrap gap-2">
                          {currentProject.stack.map(t => (
                            <span key={t.name} className={`text-[10px] px-2.5 py-1 rounded border font-mono ${categoryColors[t.category]}`}>
                              {t.name}
                            </span>
                          ))}
                        </div>
                        <div className="pt-3 border-t border-border/30 space-y-2">
                          <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-wide block">Deployment Infrastructure</span>
                          <div className="flex flex-wrap gap-1.5">
                            {currentProject.deployment.map(d => (
                              <span key={d} className="text-[10px] px-2 py-0.5 rounded bg-secondary/60 text-muted-foreground font-mono">
                                {d}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {currentFileName === 'Results.md' && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-1">
                        <Lightbulb className="w-4 h-4 text-primary" />
                        <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Insights & Learnings</h2>
                      </div>
                      <div className="space-y-3">
                        {currentProject.learnings.map((l, i) => (
                          <div key={i} className="flex gap-3 p-4 rounded-xl bg-green-500/5 border border-green-500/10 text-xs text-foreground/80">
                            <span className="w-5 h-5 rounded bg-green-500/10 text-green-400 flex items-center justify-center shrink-0 font-bold">
                              ✓
                            </span>
                            <span className="leading-relaxed">{l}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {currentFileName === 'Links.md' && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-1">
                        <Cloud className="w-4 h-4 text-primary" />
                        <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Direct Resource Launch</h2>
                      </div>
                      <div className="grid grid-cols-1 gap-2.5">
                        <a
                          href={currentProject.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:border-primary/30 hover:bg-primary/[0.02] transition-all group/link"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded bg-white/5 text-muted-foreground group-hover/link:text-primary transition-colors">
                              <GitBranch className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="text-xs font-bold text-white">Repository</div>
                              <div className="text-[10px] text-muted-foreground font-mono truncate mt-0.5">{currentProject.github.replace('https://', '')}</div>
                            </div>
                          </div>
                          <ExternalLink className="w-3.5 h-3.5 text-muted-foreground/40 group-hover/link:text-primary transition-colors" />
                        </a>

                        {currentProject.demo && (
                          <a
                            href={currentProject.demo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:border-primary/30 hover:bg-primary/[0.02] transition-all group/link"
                          >
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded bg-white/5 text-muted-foreground group-hover/link:text-primary transition-colors">
                                <Monitor className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="text-xs font-bold text-white">Live URL</div>
                                <div className="text-[10px] text-muted-foreground font-mono truncate mt-0.5">{currentProject.demo.replace('https://', '')}</div>
                              </div>
                            </div>
                            <ExternalLink className="w-3.5 h-3.5 text-muted-foreground/40 group-hover/link:text-primary transition-colors" />
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

/* ─── Dynamic Interactive Mockups / Previews ──────────── */

function ProjectPreviewMock({ projectId }: { projectId: string }) {
  if (projectId === 'neuroscan') {
    return (
      <div className="relative w-full aspect-video rounded-xl bg-slate-950 border border-slate-800 overflow-hidden flex flex-col p-3 shadow-2xl font-sans text-xs">
        {/* Top Window Bar */}
        <div className="flex items-center gap-1.5 pb-2 border-b border-slate-900 mb-2">
          <div className="w-2 h-2 rounded-full bg-red-500/80" />
          <div className="w-2 h-2 rounded-full bg-yellow-500/80" />
          <div className="w-2 h-2 rounded-full bg-green-500/80" />
          <div className="ml-2 text-[9px] text-slate-500 font-mono">neuroscan-ai-workbench</div>
          <div className="ml-auto px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono text-[9px] border border-emerald-500/20">SYSTEM ONLINE</div>
        </div>
        {/* Workbench Layout */}
        <div className="flex-1 grid grid-cols-5 gap-3 min-h-0">
          {/* Left panel: Scan & Guardrails */}
          <div className="col-span-2 border border-slate-900 bg-slate-900/40 rounded-lg p-2.5 flex flex-col gap-2 overflow-y-auto">
            <span className="font-bold text-[9px] text-slate-400 uppercase tracking-wider">Clinical Guardrails</span>
            <div className="space-y-1.5 text-[9px]">
              <div className="flex justify-between items-center bg-slate-900/60 p-1.5 rounded border border-slate-800">
                <span className="text-slate-400">Grayscale Check</span>
                <span className="text-emerald-400 font-semibold font-mono">PASS (1.0)</span>
              </div>
              <div className="flex justify-between items-center bg-slate-900/60 p-1.5 rounded border border-slate-800">
                <span className="text-slate-400">Dark Border Check</span>
                <span className="text-emerald-400 font-semibold font-mono">PASS (38.4)</span>
              </div>
              <div className="flex justify-between items-center bg-slate-900/60 p-1.5 rounded border border-slate-800">
                <span className="text-slate-400">Tissue Structure</span>
                <span className="text-emerald-400 font-semibold font-mono">PASS (MRI)</span>
              </div>
            </div>
          </div>
          {/* Right panel: Live scan and classification chart */}
          <div className="col-span-3 border border-slate-900 bg-slate-900/40 rounded-lg p-2.5 flex flex-col justify-between relative overflow-hidden">
            {/* Scanning grid */}
            <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:10px_10px]" />
            
            {/* Scan visualization */}
            <div className="h-24 bg-slate-950/80 rounded border border-slate-900 flex items-center justify-center relative overflow-hidden group">
              {/* Glowing scan target */}
              <div className="w-16 h-16 rounded-full border border-primary/20 bg-primary/5 flex items-center justify-center relative">
                <div className="w-8 h-8 rounded-full bg-primary/20 blur-md animate-pulse" />
                <div className="absolute inset-0 border-t-2 border-primary animate-spin" style={{ animationDuration: '4s' }} />
              </div>
              {/* Laser beam scan line */}
              <div className="absolute left-0 right-0 h-[2px] bg-primary/60 shadow-[0_0_8px_oklch(var(--p))] top-0 animate-[scan_2.5s_ease-in-out_infinite]" />
              <span className="absolute bottom-1 right-2 text-[8px] font-mono text-slate-500">MRI_SCAN_09A.ONNX</span>
            </div>

            {/* Predictions list */}
            <div className="space-y-1 mt-2">
              <div className="flex items-center justify-between text-[10px]">
                <span className="font-medium text-slate-300">Glioma Tumor</span>
                <span className="font-mono text-primary font-bold">97.4%</span>
              </div>
              <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                <div className="bg-primary h-full rounded-full" style={{ width: '97.4%' }} />
              </div>
            </div>
          </div>
        </div>
        <style>{`
          @keyframes scan {
            0% { top: 0%; }
            50% { top: 100%; }
            100% { top: 0%; }
          }
        `}</style>
      </div>
    )
  }

  if (projectId === 'studyflow') {
    return (
      <div className="relative w-full aspect-video rounded-xl bg-neutral-950 border border-neutral-800 overflow-hidden flex flex-col p-3 shadow-2xl font-sans text-xs">
        {/* Top Window Bar */}
        <div className="flex items-center gap-1.5 pb-2 border-b border-neutral-900 mb-2">
          <div className="w-2 h-2 rounded-full bg-red-500/80" />
          <div className="w-2 h-2 rounded-full bg-yellow-500/80" />
          <div className="w-2 h-2 rounded-full bg-green-500/80" />
          <div className="ml-2 text-[9px] text-neutral-500 font-mono">studyflow-dashboard</div>
          <div className="ml-auto px-2 py-0.5 rounded bg-violet-500/10 text-violet-400 font-mono text-[9px] border border-violet-500/20">STUDY STREAK: 12 DAYS</div>
        </div>
        {/* Calendar & Chat Mockup */}
        <div className="flex-1 grid grid-cols-3 gap-3 min-h-0">
          {/* Left 2 cols: Schedule block */}
          <div className="col-span-2 border border-neutral-900 bg-neutral-900/40 rounded-lg p-2.5 flex flex-col gap-2 overflow-y-auto">
            <span className="font-bold text-[9px] text-neutral-400 uppercase tracking-wider">AI Study Schedule</span>
            <div className="space-y-1.5 text-[9px]">
              <div className="border-l-2 border-violet-500 bg-violet-500/5 p-2 rounded flex items-center justify-between">
                <div>
                  <div className="font-semibold text-neutral-200">Linear Algebra Review</div>
                  <div className="text-neutral-500 text-[8px] font-mono mt-0.5">09:00 AM - 09:45 AM</div>
                </div>
                <span className="text-[8px] bg-violet-500/20 text-violet-400 px-1.5 py-0.5 rounded-full font-bold uppercase">Active</span>
              </div>
              <div className="border-l-2 border-blue-500 bg-blue-500/5 p-2 rounded flex items-center justify-between opacity-60">
                <div>
                  <div className="font-semibold text-neutral-300">Pomodoro Focus: Matrix Proofs</div>
                  <div className="text-neutral-500 text-[8px] font-mono mt-0.5">10:00 AM - 10:25 AM</div>
                </div>
                <span className="text-[8px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded-full font-bold uppercase">Next</span>
              </div>
            </div>
          </div>
          {/* Right 1 col: AI Study chat */}
          <div className="border border-neutral-900 bg-neutral-900/40 rounded-lg p-2.5 flex flex-col justify-between min-w-0">
            <span className="font-bold text-[9px] text-neutral-400 uppercase tracking-wider mb-1">Study AI</span>
            <div className="flex-1 space-y-1.5 overflow-y-auto pr-1">
              <div className="bg-neutral-900/80 p-1.5 rounded text-[8px] text-neutral-400">
                How is your study plan going?
              </div>
              <div className="bg-violet-600/20 border border-violet-500/20 p-1.5 rounded text-[8px] text-violet-200 self-end ml-2">
                Generating topic breakdown...
              </div>
            </div>
            {/* Focus timer animation */}
            <div className="mt-2 pt-2 border-t border-neutral-900 flex items-center gap-2">
              <div className="w-4 h-4 rounded-full border border-violet-500 flex items-center justify-center shrink-0">
                <div className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-ping" />
              </div>
              <span className="text-[9px] text-neutral-300 font-mono font-bold">Timer: 24:18</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (projectId === 'nimbusx') {
    return (
      <div className="relative w-full aspect-video rounded-xl bg-zinc-950 border border-zinc-800 overflow-hidden flex flex-col p-3 shadow-2xl font-sans text-xs">
        {/* Top Window Bar */}
        <div className="flex items-center gap-1.5 pb-2 border-b border-zinc-900 mb-2">
          <div className="w-2 h-2 rounded-full bg-red-500/80" />
          <div className="w-2 h-2 rounded-full bg-yellow-500/80" />
          <div className="w-2 h-2 rounded-full bg-green-500/80" />
          <div className="ml-2 text-[9px] text-zinc-500 font-mono">nimbusx-drive</div>
          <div className="ml-auto px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono text-[9px] border border-emerald-500/20">UPLOAD ENGINE IDLE</div>
        </div>
        {/* Cloud Storage Dashboard Mockup */}
        <div className="flex-1 grid grid-cols-4 gap-3 min-h-0">
          {/* Left panel: categories */}
          <div className="col-span-1 border border-zinc-900 bg-zinc-900/40 rounded-lg p-2 flex flex-col gap-1.5">
            <span className="font-bold text-[8px] text-zinc-500 uppercase tracking-wider">Storage</span>
            <div className="bg-zinc-850 p-1 rounded border border-zinc-800 flex items-center gap-1.5 text-[8.5px] text-primary">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span className="truncate">All Files</span>
            </div>
            <div className="p-1 flex items-center gap-1.5 text-[8.5px] text-zinc-400 opacity-70">
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
              <span className="truncate">Documents</span>
            </div>
            <div className="p-1 flex items-center gap-1.5 text-[8.5px] text-zinc-400 opacity-70">
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
              <span className="truncate">Images</span>
            </div>
          </div>
          {/* File grid and search */}
          <div className="col-span-3 border border-zinc-900 bg-zinc-900/40 rounded-lg p-2 flex flex-col justify-between">
            <div className="border-b border-zinc-900 pb-1 flex items-center gap-1">
              <div className="w-full bg-zinc-950 rounded px-1.5 py-0.5 text-[8.5px] text-zinc-400">Search: "mri models"</div>
            </div>
            <div className="flex-1 space-y-1 mt-1.5 overflow-y-auto">
              <div className="p-1 bg-zinc-900/40 rounded flex items-center justify-between text-[8.5px]">
                <span className="text-zinc-200">efficientnet_weights.onnx</span>
                <span className="text-zinc-500">35.4 MB</span>
              </div>
              <div className="p-1 bg-zinc-900/40 rounded flex items-center justify-between text-[8.5px]">
                <span className="text-zinc-200">report_glioma.pdf</span>
                <span className="text-zinc-500">1.2 MB</span>
              </div>
            </div>
            {/* Storage capacity bar */}
            <div className="pt-1 border-t border-zinc-900 flex flex-col gap-1">
              <div className="flex items-center justify-between text-[8px] text-zinc-500">
                <span>Used: 36.6 MB</span>
                <span>Limit: 5 GB</span>
              </div>
              <div className="w-full bg-zinc-950 h-1 rounded-full overflow-hidden">
                <div className="bg-primary h-full" style={{ width: '1.2%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (projectId === 'codeviz') {
    return (
      <div className="relative w-full aspect-video rounded-xl bg-stone-950 border border-stone-800 overflow-hidden flex flex-col p-3 shadow-2xl font-sans text-xs">
        {/* Top Window Bar */}
        <div className="flex items-center gap-1.5 pb-2 border-b border-stone-900 mb-2">
          <div className="w-2 h-2 rounded-full bg-red-500/80" />
          <div className="w-2 h-2 rounded-full bg-yellow-500/80" />
          <div className="w-2 h-2 rounded-full bg-green-500/80" />
          <div className="ml-2 text-[9px] text-stone-500 font-mono">codeviz-editor</div>
          <div className="ml-auto px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 font-mono text-[9px] border border-amber-500/20">AST ENGINE ACTIVE</div>
        </div>
        {/* Editor & AST Graph Mockup */}
        <div className="flex-1 grid grid-cols-3 gap-3 min-h-0">
          {/* Code editor pane */}
          <div className="col-span-1 border border-stone-900 bg-stone-900/40 rounded-lg p-2 flex flex-col justify-between">
            <span className="font-bold text-[8px] text-stone-500 uppercase tracking-wider">binary_search.py</span>
            <pre className="font-mono text-[7px] text-stone-300 leading-snug flex-1 mt-1 overflow-y-auto">
{`def search(arr, x):
  low = 0
  high = len(arr) - 1
  while low <= high:
    mid = (low + high) // 2
    if arr[mid] < x:
      low = mid + 1
    ...`}
            </pre>
            <span className="text-[7.5px] text-amber-500 font-mono mt-1">Executing step 4...</span>
          </div>
          {/* Call stack / AST Visualizer */}
          <div className="col-span-2 border border-stone-900 bg-stone-900/40 rounded-lg p-2 flex flex-col justify-between relative">
            <span className="font-bold text-[8px] text-stone-400 uppercase tracking-wider">Visual Trace Tree</span>
            {/* SVG AST trace visualization representation */}
            <div className="flex-1 flex items-center justify-center relative">
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 rounded-full border border-primary bg-primary/10 flex items-center justify-center text-[8px] text-white">mid: 4</div>
                <div className="flex gap-4">
                  <div className="w-7 h-7 rounded-full border border-stone-700 bg-stone-900/60 flex items-center justify-center text-[8px] text-stone-500">low: 0</div>
                  <div className="w-7 h-7 rounded-full border border-stone-700 bg-stone-900/60 flex items-center justify-center text-[8px] text-stone-500">high: 8</div>
                </div>
              </div>
            </div>
            {/* Controls */}
            <div className="flex items-center justify-center gap-1.5 border-t border-stone-900 pt-1 text-[8px] text-stone-400">
              <button className="px-1 py-0.5 bg-stone-900 rounded">◀ Back</button>
              <button className="px-1 py-0.5 bg-stone-900 rounded text-amber-400 font-bold">⏸ Play</button>
              <button className="px-1 py-0.5 bg-stone-900 rounded">Next ▶</button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return null
}

/* ─── Architecture SVG Flowcharts ──────────────────────── */

function ProjectArchitectureFlow({ projectId }: { projectId: string }) {
  if (projectId === 'neuroscan') {
    return (
      <div className="flex flex-col gap-4 bg-background/60 rounded-lg border border-border/50 p-4 font-sans text-xs">
        <div className="flex items-center justify-around gap-2 text-center relative">
          <div className="flex flex-col items-center p-2 rounded-lg bg-primary/10 border border-primary/20 w-32 shrink-0">
            <span className="font-bold text-primary">Web Client</span>
            <span className="text-[9px] text-muted-foreground mt-0.5">MRI Upload UI</span>
          </div>
          <div className="text-primary animate-pulse text-lg">➔</div>
          <div className="flex flex-col items-center p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20 w-32 shrink-0">
            <span className="font-bold text-yellow-500">Guardrails API</span>
            <span className="text-[9px] text-muted-foreground mt-0.5">Grayscale/Contrast</span>
          </div>
          <div className="text-primary animate-pulse text-lg">➔</div>
          <div className="flex flex-col items-center p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 w-32 shrink-0">
            <span className="font-bold text-emerald-500">ONNX Engine</span>
            <span className="text-[9px] text-muted-foreground mt-0.5">EfficientNetB0 CPU</span>
          </div>
        </div>
      </div>
    )
  }

  if (projectId === 'studyflow') {
    return (
      <div className="flex flex-col gap-4 bg-background/60 rounded-lg border border-border/50 p-4 font-sans text-xs">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="flex flex-col justify-center items-center p-2.5 rounded-lg bg-primary/10 border border-primary/20">
            <span className="font-bold text-primary">Next.js Client</span>
            <span className="text-[9px] text-muted-foreground mt-0.5">RSC + Dashboard</span>
          </div>
          <div className="flex flex-col justify-center items-center p-2.5 rounded-lg bg-violet-500/10 border border-violet-500/20">
            <span className="font-bold text-violet-500">Vercel AI SDK</span>
            <span className="text-[9px] text-muted-foreground mt-0.5">Gemini 2.5 Engine</span>
          </div>
          <div className="flex flex-col justify-center items-center p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <span className="font-bold text-emerald-500">Supabase DB</span>
            <span className="text-[9px] text-muted-foreground mt-0.5">PostgreSQL & RLS</span>
          </div>
        </div>
      </div>
    )
  }

  if (projectId === 'nimbusx') {
    return (
      <div className="flex flex-col gap-4 bg-background/60 rounded-lg border border-border/50 p-4 font-sans text-xs">
        <div className="flex items-center justify-around gap-2 text-center relative">
          <div className="flex flex-col items-center p-2 rounded-lg bg-primary/10 border border-primary/20 w-32 shrink-0">
            <span className="font-bold text-primary">React Frontend</span>
            <span className="text-[9px] text-muted-foreground mt-0.5">Direct Storage S3</span>
          </div>
          <div className="text-primary animate-pulse text-lg">➔</div>
          <div className="flex flex-col items-center p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 w-32 shrink-0">
            <span className="font-bold text-blue-400">Firebase Sync</span>
            <span className="text-[9px] text-muted-foreground mt-0.5">Real-time Metadata</span>
          </div>
          <div className="text-primary animate-pulse text-lg">➔</div>
          <div className="flex flex-col items-center p-2 rounded-lg bg-pink-500/10 border border-pink-500/20 w-32 shrink-0">
            <span className="font-bold text-pink-400">AI Analyzer</span>
            <span className="text-[9px] text-muted-foreground mt-0.5">OCR / Tagging Trigger</span>
          </div>
        </div>
      </div>
    )
  }

  if (projectId === 'codeviz') {
    return (
      <div className="flex flex-col gap-4 bg-background/60 rounded-lg border border-border/50 p-4 font-sans text-xs">
        <div className="flex items-center justify-around gap-2 text-center relative">
          <div className="flex flex-col items-center p-2 rounded-lg bg-primary/10 border border-primary/20 w-32 shrink-0">
            <span className="font-bold text-primary">Monaco Input</span>
            <span className="text-[9px] text-muted-foreground mt-0.5">Acorn AST Parser</span>
          </div>
          <div className="text-primary animate-pulse text-lg">➔</div>
          <div className="flex flex-col items-center p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 w-32 shrink-0">
            <span className="font-bold text-amber-500">Web Worker</span>
            <span className="text-[9px] text-muted-foreground mt-0.5">Telemetry Tracing</span>
          </div>
          <div className="text-primary animate-pulse text-lg">➔</div>
          <div className="flex flex-col items-center p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20 w-32 shrink-0">
            <span className="font-bold text-yellow-500">D3 Canvas</span>
            <span className="text-[9px] text-muted-foreground mt-0.5">Step-Play Animation</span>
          </div>
        </div>
      </div>
    )
  }

  return null
}
