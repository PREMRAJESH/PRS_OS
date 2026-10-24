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
  active: 'text-accent bg-accent/[0.07] border-accent/20',
  completed: 'text-muted-foreground bg-foreground/[0.04] border-hairline',
  archived: 'text-muted-foreground/60 bg-muted/30 border-hairline',
}

// Simple markdown parsing helper for high-fidelity rendering
function renderMarkdown(text: string) {
  if (!text) return null
  const lines = text.split('\n')
  return (
    <div className="space-y-3 font-sans text-[12.5px] leading-relaxed text-muted-foreground/80">
      {lines.map((line, i) => {
        const trimmed = line.trim()
        if (!trimmed) return <div key={i} className="h-2" />
        
        // Headers
        if (trimmed.startsWith('# ')) {
          return <h1 key={i} className="font-display text-[1.75rem] leading-tight text-foreground tracking-[-0.015em] border-b border-hairline pb-2 mt-4">{trimmed.slice(2)}</h1>
        }
        if (trimmed.startsWith('## ')) {
          return <h2 key={i} className="text-[14px] font-medium text-foreground/90 tracking-[-0.01em] mt-5 flex items-center gap-2">{trimmed.slice(3)}</h2>
        }
        if (trimmed.startsWith('### ')) {
          return <h3 key={i} className="text-[9px] font-mono tracking-[0.13em] uppercase text-muted-foreground/45 mt-4">{trimmed.slice(4)}</h3>
        }
        
        // Bullet points
        if (trimmed.startsWith('- ')) {
          const itemText = trimmed.slice(2)
          return (
            <div key={i} className="flex gap-2.5 pl-0.5 text-muted-foreground/75">
              <span className="text-primary/70 select-none mt-[1px]">·</span>
              <span dangerouslySetInnerHTML={{ 
                __html: itemText
                  .replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground/90 font-medium">$1</strong>')
                  .replace(/\`(.*?)\`/g, '<code class="bg-foreground/[0.05] px-1.5 py-0.5 rounded font-mono text-[10.5px] text-primary/90">$1</code>')
              }} />
            </div>
          )
        }

        // Standard paragraph
        return (
          <p key={i} dangerouslySetInnerHTML={{
            __html: trimmed
              .replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground/90 font-medium">$1</strong>')
              .replace(/\`(.*?)\`/g, '<code class="bg-foreground/[0.05] px-1.5 py-0.5 rounded font-mono text-[10.5px] text-primary/90">$1</code>')
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
    <div className="h-full flex bg-transparent overflow-hidden font-sans select-none">
      {/* ── Left: File explorer sidebar ──────── */}
      <div className="w-56 border-r border-hairline flex flex-col shrink-0 bg-window-chrome/25">
        <div className="h-8 flex items-center px-3 border-b border-hairline">
          <span className="text-[9px] font-mono uppercase tracking-[0.13em] text-muted-foreground/40">Explorer</span>
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
                    ? 'bg-primary/[0.08] text-foreground'
                    : 'text-muted-foreground hover:bg-foreground/[0.04] hover:text-foreground'
                }`}
              >
                <ChevronDown className={`w-3.5 h-3.5 shrink-0 text-muted-foreground/45 transition-transform ${expandedFolders.has(project.id) ? '' : '-rotate-90'}`} />
                <Folder className={`w-4 h-4 shrink-0 ${selectedProject.id === project.id ? 'text-primary' : 'text-muted-foreground/60'}`} />
                <span className="font-medium truncate">{project.name}</span>
                <Circle className={`w-1.5 h-1.5 ml-auto shrink-0 ${
                  project.status === 'active' ? 'fill-accent text-accent' :
                  'fill-foreground/30 text-foreground/30'
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
                                ? 'bg-foreground/[0.055] text-foreground border-r-2 border-primary'
                                : 'text-muted-foreground/75 hover:bg-foreground/[0.025] hover:text-foreground'
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
        <div className="h-8 flex items-stretch border-b border-hairline bg-window-chrome/20 overflow-x-auto custom-scrollbar shrink-0">
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
                    ? 'bg-window text-foreground border-b-2 border-b-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-foreground/[0.025] border-b-2 border-b-transparent'
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
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-hairline pb-5">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h1 className="font-display text-[1.8rem] leading-none tracking-[-0.02em] text-foreground">{currentProject.name}</h1>
                    <span className={`text-[9px] px-2 py-0.5 rounded-full border font-medium uppercase tracking-wider ${statusColors[currentProject.status]}`}>
                      {currentProject.status}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{currentProject.tagline}</p>
                </div>
                <div />
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
                        <h2 className="text-[9px] font-mono uppercase tracking-[0.13em] text-muted-foreground/40">Interface preview</h2>
                      </div>
                      <ProjectPreviewMock projectId={currentProject.id} />
                    </div>
                  )}

                  {currentFileName === 'Problem.md' && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-1">
                        <AlertTriangle className="w-4 h-4 text-primary" />
                        <h2 className="text-[9px] font-mono uppercase tracking-[0.13em] text-muted-foreground/40">Engineering challenges</h2>
                      </div>
                      <div className="space-y-3">
                        {currentProject.challenges.map((c, i) => (
                          <div key={i} className="flex gap-3 p-3.5 rounded-lg bg-foreground/[0.02] border border-hairline text-[11.5px] text-muted-foreground/75">
                            <span className="w-5 h-5 rounded bg-foreground/[0.05] text-primary/80 flex items-center justify-center shrink-0 font-mono text-[10px]">
                              {String(i + 1).padStart(2, '0')}
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
                        <h2 className="text-[9px] font-mono uppercase tracking-[0.13em] text-muted-foreground/40">Architecture flow</h2>
                      </div>
                      <ProjectArchitectureFlow projectId={currentProject.id} />
                    </div>
                  )}

                  {currentFileName === 'TechStack.md' && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-1">
                        <Layers className="w-4 h-4 text-primary" />
                        <h2 className="text-[9px] font-mono uppercase tracking-[0.13em] text-muted-foreground/40">Technology</h2>
                      </div>
                      <div className="p-4 rounded-lg bg-foreground/[0.02] border border-hairline space-y-4">
                        <div className="flex flex-wrap gap-2">
                          {currentProject.stack.map(t => (
                            <span key={t.name} className={`text-[10px] px-2.5 py-1 rounded border font-mono ${categoryColors[t.category]}`}>
                              {t.name}
                            </span>
                          ))}
                        </div>
                        <div className="pt-3 border-t border-hairline space-y-2">
                          <span className="text-[9px] font-mono uppercase text-muted-foreground/40 tracking-[0.1em] block">Deployment</span>
                          <div className="flex flex-wrap gap-1.5">
                            {currentProject.deployment.map(d => (
                              <span key={d} className="text-[10px] px-2 py-0.5 rounded border border-hairline bg-foreground/[0.02] text-muted-foreground/70 font-mono">
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
                        <h2 className="text-[9px] font-mono uppercase tracking-[0.13em] text-muted-foreground/40">Results</h2>
                      </div>
                      <div className="space-y-3">
                        {currentProject.learnings.map((l, i) => (
                          <div key={i} className="flex gap-3 p-3.5 rounded-lg bg-accent/[0.035] border border-accent/15 text-[11.5px] text-muted-foreground/75">
                            <span className="w-5 h-5 rounded bg-accent/10 text-accent flex items-center justify-center shrink-0 text-[10px]">
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
                        <h2 className="text-[9px] font-mono uppercase tracking-[0.13em] text-muted-foreground/40">Links</h2>
                      </div>
                      <div className="grid grid-cols-1 gap-2.5">
                        <a
                          href={currentProject.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-3.5 rounded-lg border border-hairline bg-foreground/[0.02] hover:border-hairline-strong hover:bg-foreground/[0.04] transition-colors group/link"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded bg-foreground/[0.04] text-muted-foreground/60 group-hover/link:text-primary transition-colors">
                              <GitBranch className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="text-[11.5px] text-foreground/85">Repository</div>
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
                            className="flex items-center justify-between p-3.5 rounded-lg border border-hairline bg-foreground/[0.02] hover:border-hairline-strong hover:bg-foreground/[0.04] transition-colors group/link"
                          >
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded bg-foreground/[0.04] text-muted-foreground/60 group-hover/link:text-primary transition-colors">
                                <Monitor className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="text-[11.5px] text-foreground/85">Live URL</div>
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
          <div className="w-2 h-2 rounded-full bg-foreground/20" />
          <div className="w-2 h-2 rounded-full bg-foreground/15" />
          <div className="w-2 h-2 rounded-full bg-foreground/10" />
          <div className="ml-2 text-[9px] text-slate-500 font-mono">neuroscan-ai-workbench</div>
          <div className="ml-auto px-2 py-0.5 rounded bg-accent/[0.07] text-accent font-mono text-[9px] border border-accent/20">SYSTEM ONLINE</div>
        </div>
        {/* Workbench Layout */}
        <div className="flex-1 grid grid-cols-5 gap-3 min-h-0">
          {/* Left panel: Scan & Guardrails */}
          <div className="col-span-2 border border-slate-900 bg-slate-900/40 rounded-lg p-2.5 flex flex-col gap-2 overflow-y-auto">
            <span className="font-bold text-[9px] text-slate-400 uppercase tracking-wider">Clinical Guardrails</span>
            <div className="space-y-1.5 text-[9px]">
              <div className="flex justify-between items-center bg-slate-900/60 p-1.5 rounded border border-slate-800">
                <span className="text-slate-400">Grayscale Check</span>
                <span className="text-accent font-semibold font-mono">PASS (1.0)</span>
              </div>
              <div className="flex justify-between items-center bg-slate-900/60 p-1.5 rounded border border-slate-800">
                <span className="text-slate-400">Dark Border Check</span>
                <span className="text-accent font-semibold font-mono">PASS (38.4)</span>
              </div>
              <div className="flex justify-between items-center bg-slate-900/60 p-1.5 rounded border border-slate-800">
                <span className="text-slate-400">Tissue Structure</span>
                <span className="text-accent font-semibold font-mono">PASS (MRI)</span>
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
          <div className="w-2 h-2 rounded-full bg-foreground/20" />
          <div className="w-2 h-2 rounded-full bg-foreground/15" />
          <div className="w-2 h-2 rounded-full bg-foreground/10" />
          <div className="ml-2 text-[9px] text-neutral-500 font-mono">studyflow-dashboard</div>
          <div className="ml-auto px-2 py-0.5 rounded bg-primary/[0.07] text-primary font-mono text-[9px] border border-primary/20">STUDY STREAK: 12 DAYS</div>
        </div>
        {/* Calendar & Chat Mockup */}
        <div className="flex-1 grid grid-cols-3 gap-3 min-h-0">
          {/* Left 2 cols: Schedule block */}
          <div className="col-span-2 border border-neutral-900 bg-neutral-900/40 rounded-lg p-2.5 flex flex-col gap-2 overflow-y-auto">
            <span className="font-bold text-[9px] text-neutral-400 uppercase tracking-wider">AI Study Schedule</span>
            <div className="space-y-1.5 text-[9px]">
              <div className="border-l-2 border-primary/50 bg-primary/[0.04] p-2 rounded flex items-center justify-between">
                <div>
                  <div className="font-semibold text-neutral-200">Linear Algebra Review</div>
                  <div className="text-neutral-500 text-[8px] font-mono mt-0.5">09:00 AM - 09:45 AM</div>
                </div>
                <span className="text-[8px] bg-primary/15 text-primary px-1.5 py-0.5 rounded-full font-bold uppercase">Active</span>
              </div>
              <div className="border-l-2 border-foreground/15 bg-foreground/[0.03] p-2 rounded flex items-center justify-between opacity-60">
                <div>
                  <div className="font-semibold text-neutral-300">Pomodoro Focus: Matrix Proofs</div>
                  <div className="text-neutral-500 text-[8px] font-mono mt-0.5">10:00 AM - 10:25 AM</div>
                </div>
                <span className="text-[8px] bg-foreground/[0.06] text-muted-foreground px-1.5 py-0.5 rounded-full font-bold uppercase">Next</span>
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
              <div className="bg-primary/10 border border-primary/20 p-1.5 rounded text-[8px] text-primary/80 self-end ml-2">
                Generating topic breakdown...
              </div>
            </div>
            {/* Focus timer animation */}
            <div className="mt-2 pt-2 border-t border-neutral-900 flex items-center gap-2">
              <div className="w-4 h-4 rounded-full border border-primary/50 flex items-center justify-center shrink-0">
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
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
          <div className="w-2 h-2 rounded-full bg-foreground/20" />
          <div className="w-2 h-2 rounded-full bg-foreground/15" />
          <div className="w-2 h-2 rounded-full bg-foreground/10" />
          <div className="ml-2 text-[9px] text-zinc-500 font-mono">nimbusx-drive</div>
          <div className="ml-auto px-2 py-0.5 rounded bg-primary/[0.07] text-primary font-mono text-[9px] border border-primary/20">UPLOAD ENGINE IDLE</div>
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
          <div className="w-2 h-2 rounded-full bg-foreground/20" />
          <div className="w-2 h-2 rounded-full bg-foreground/15" />
          <div className="w-2 h-2 rounded-full bg-foreground/10" />
          <div className="ml-2 text-[9px] text-stone-500 font-mono">codeviz-editor</div>
          <div className="ml-auto px-2 py-0.5 rounded bg-primary/[0.07] text-primary font-mono text-[9px] border border-primary/20">AST ENGINE ACTIVE</div>
        </div>
        {/* Editor & AST Graph Mockup */}
        <div className="flex-1 grid grid-cols-3 gap-3 min-h-0">
          {/* Code editor pane */}
          <div className="col-span-1 border border-stone-900 bg-foreground/10/40 rounded-lg p-2 flex flex-col justify-between">
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
            <span className="text-[7.5px] text-primary font-mono mt-1">Executing step 4...</span>
          </div>
          {/* Call stack / AST Visualizer */}
          <div className="col-span-2 border border-stone-900 bg-foreground/10/40 rounded-lg p-2 flex flex-col justify-between relative">
            <span className="font-bold text-[8px] text-stone-400 uppercase tracking-wider">Visual Trace Tree</span>
            {/* SVG AST trace visualization representation */}
            <div className="flex-1 flex items-center justify-center relative">
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 rounded-full border border-primary bg-primary/10 flex items-center justify-center text-[8px] text-foreground/80">mid: 4</div>
                <div className="flex gap-4">
                  <div className="w-7 h-7 rounded-full border border-stone-700 bg-foreground/10/60 flex items-center justify-center text-[8px] text-stone-500">low: 0</div>
                  <div className="w-7 h-7 rounded-full border border-stone-700 bg-foreground/10/60 flex items-center justify-center text-[8px] text-stone-500">high: 8</div>
                </div>
              </div>
            </div>
            {/* Controls */}
            <div className="flex items-center justify-center gap-1.5 border-t border-stone-900 pt-1 text-[8px] text-stone-400">
              <button className="px-1 py-0.5 bg-foreground/10 rounded">◀ Back</button>
              <button className="px-1 py-0.5 bg-foreground/10 rounded text-primary font-bold">⏸ Play</button>
              <button className="px-1 py-0.5 bg-foreground/10 rounded">Next ▶</button>
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
          <div className="flex flex-col items-center p-2 rounded-lg bg-primary/[0.07] border border-primary/20 w-32 shrink-0">
            <span className="font-bold text-primary">Guardrails API</span>
            <span className="text-[9px] text-muted-foreground mt-0.5">Grayscale/Contrast</span>
          </div>
          <div className="text-primary animate-pulse text-lg">➔</div>
          <div className="flex flex-col items-center p-2 rounded-lg bg-accent/[0.07] border border-accent/20 w-32 shrink-0">
            <span className="font-bold text-accent">ONNX Engine</span>
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
          <div className="flex flex-col justify-center items-center p-2.5 rounded-lg bg-primary/[0.07] border border-primary/20">
            <span className="font-bold text-primary">Vercel AI SDK</span>
            <span className="text-[9px] text-muted-foreground mt-0.5">Gemini 2.5 Engine</span>
          </div>
          <div className="flex flex-col justify-center items-center p-2.5 rounded-lg bg-accent/[0.07] border border-accent/20">
            <span className="font-bold text-accent">Supabase DB</span>
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
          <div className="flex flex-col items-center p-2 rounded-lg bg-foreground/[0.04] border border-hairline w-32 shrink-0">
            <span className="font-bold text-muted-foreground">Firebase Sync</span>
            <span className="text-[9px] text-muted-foreground mt-0.5">Real-time Metadata</span>
          </div>
          <div className="text-primary animate-pulse text-lg">➔</div>
          <div className="flex flex-col items-center p-2 rounded-lg bg-accent/[0.07] border border-accent/20 w-32 shrink-0">
            <span className="font-bold text-accent">AI Analyzer</span>
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
          <div className="flex flex-col items-center p-2 rounded-lg bg-primary/[0.07] border border-primary/20 w-32 shrink-0">
            <span className="font-bold text-primary">Web Worker</span>
            <span className="text-[9px] text-muted-foreground mt-0.5">Telemetry Tracing</span>
          </div>
          <div className="text-primary animate-pulse text-lg">➔</div>
          <div className="flex flex-col items-center p-2 rounded-lg bg-primary/[0.07] border border-primary/20 w-32 shrink-0">
            <span className="font-bold text-primary">D3 Canvas</span>
            <span className="text-[9px] text-muted-foreground mt-0.5">Step-Play Animation</span>
          </div>
        </div>
      </div>
    )
  }

  return null
}
