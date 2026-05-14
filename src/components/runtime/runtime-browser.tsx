'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useOSStore } from '@/store/os-store'
import { 
  Globe, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  X, 
  ExternalLink,
  ShieldCheck,
  Zap,
  LayoutGrid,
  Search,
  MoreVertical,
  Lock,
  Loader2,
  Settings
} from 'lucide-react'

interface Tab {
  id: string
  url: string
  title: string
  icon: any
  isLoading: boolean
}

const DEFAULT_TABS: Tab[] = [
  { id: 'codeviz-live', url: 'https://code-visualizer.vercel.app/', title: 'CodeViz Production', icon: Zap, isLoading: false },
  { id: 'prs-os-github', url: 'https://github.com/prs-os/core', title: 'PRS-OS Source', icon: Globe, isLoading: false },
]

export function RuntimeBrowser() {
  const { windows, activeWindow } = useOSStore()
  const win = windows.find(w => w.id === activeWindow)
  
  const [tabs, setTabs] = useState<Tab[]>(DEFAULT_TABS)
  const [activeTabId, setActiveTabId] = useState(DEFAULT_TABS[0].id)
  const [urlInput, setUrlInput] = useState(DEFAULT_TABS[0].url)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  
  const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0]

  // Sync with initialQuery from window manager
  useEffect(() => {
    if (win?.type === 'runtime' && win.initialQuery && win.initialQuery.startsWith('http')) {
      const url = win.initialQuery
      const existingTab = tabs.find(t => t.url === url)
      
      if (existingTab) {
        setActiveTabId(existingTab.id)
      } else {
        const newTab: Tab = {
          id: `tab-${Date.now()}`,
          url,
          title: win.title || 'Live Demo',
          icon: Zap,
          isLoading: true
        }
        setTabs(prev => [...prev, newTab])
        setActiveTabId(newTab.id)
      }
    }
  }, [win?.id, win?.initialQuery])

  useEffect(() => {
    setUrlInput(activeTab.url)
  }, [activeTabId, activeTab.url])

  const handleRefresh = () => {
    if (iframeRef.current) {
      setTabs(prev => prev.map(t => t.id === activeTabId ? { ...t, isLoading: true } : t))
      iframeRef.current.src = activeTab.url
    }
  }

  const onIframeLoad = () => {
    setTabs(prev => prev.map(t => t.id === activeTabId ? { ...t, isLoading: false } : t))
  }

  const closeTab = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (tabs.length === 1) return
    const newTabs = tabs.filter(t => t.id !== id)
    setTabs(newTabs)
    if (activeTabId === id) {
      setActiveTabId(newTabs[0].id)
    }
  }

  const addTab = () => {
    const newTab: Tab = {
      id: `tab-${Date.now()}`,
      url: 'https://google.com',
      title: 'New Tab',
      icon: Search,
      isLoading: false
    }
    setTabs([...tabs, newTab])
    setActiveTabId(newTab.id)
  }

  return (
    <div className="flex h-full bg-[#0a0a0b] text-foreground overflow-hidden font-sans">
      
      {/* ── Arc-style Sidebar ───────────────── */}
      <motion.aside
        animate={{ width: isSidebarCollapsed ? 0 : 240, opacity: isSidebarCollapsed ? 0 : 1 }}
        className="flex flex-col border-r border-white/5 bg-[#121214] z-20"
      >
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-black uppercase tracking-widest text-muted-foreground/40">Runtime</span>
          </div>
          <button onClick={addTab} className="p-1.5 rounded-lg hover:bg-white/5 text-muted-foreground transition-colors">
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-2 space-y-1 custom-scrollbar">
          {tabs.map((tab) => {
            const isActive = tab.id === activeTabId
            return (
              <div
                key={tab.id}
                role="button"
                tabIndex={0}
                onClick={() => setActiveTabId(tab.id)}
                onKeyDown={(e) => e.key === 'Enter' && setActiveTabId(tab.id)}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all group relative cursor-pointer
                  ${isActive 
                    ? 'bg-white/10 text-white shadow-[0_4px_12px_rgba(0,0,0,0.5)]' 
                    : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
                  }
                `}
              >
                <div className={`
                  w-6 h-6 rounded-lg flex items-center justify-center shrink-0
                  ${isActive ? 'bg-primary/20 text-primary' : 'bg-white/5 text-muted-foreground/40 group-hover:text-muted-foreground'}
                `}>
                  <tab.icon className="w-3.5 h-3.5" />
                </div>
                <span className="flex-1 text-[11px] font-bold truncate tracking-tight">{tab.title}</span>
                <button 
                  onClick={(e) => closeTab(tab.id, e)}
                  className={`p-1 rounded-md hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity ${isActive ? 'opacity-100' : ''}`}
                >
                  <X className="w-3 h-3" />
                </button>
                {isActive && (
                  <motion.div layoutId="active-tab-indicator" className="absolute left-0 w-1 h-4 bg-primary rounded-r-full" />
                )}
              </div>
            )
          })}
        </div>

        <div className="p-4 border-t border-white/5 flex items-center justify-between">
          <button className="p-2 rounded-lg hover:bg-white/5 text-muted-foreground transition-colors">
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-lg hover:bg-white/5 text-muted-foreground transition-colors">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </motion.aside>

      {/* ── Main Browser Area ───────────────── */}
      <main className="flex-1 flex flex-col relative bg-background">
        
        {/* Navigation Bar */}
        <header className="h-12 border-b border-white/5 flex items-center gap-4 px-4 bg-[#0a0a0b]/80 backdrop-blur-md z-10">
          <div className="flex items-center gap-1">
            <button className="p-2 rounded-lg hover:bg-white/5 text-muted-foreground/40 transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="p-2 rounded-lg hover:bg-white/5 text-muted-foreground/40 transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
            <button onClick={handleRefresh} className="p-2 rounded-lg hover:bg-white/5 text-muted-foreground transition-colors">
              <RotateCcw className={`w-3.5 h-3.5 ${activeTab.isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          <div className="flex-1 relative group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
              <Lock className="w-3 h-3 text-emerald-500/60" />
            </div>
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="w-full bg-white/5 border border-white/5 rounded-xl py-1.5 pl-9 pr-4 text-[11px] font-mono text-muted-foreground/80 focus:text-foreground focus:bg-white/10 outline-none transition-all"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              {activeTab.isLoading && <Loader2 className="w-3 h-3 animate-spin text-primary" />}
              <ExternalLink className="w-3 h-3 text-muted-foreground/20 group-hover:text-muted-foreground/60 cursor-pointer" />
            </div>
          </div>

          <button className="p-2 rounded-lg hover:bg-white/5 text-muted-foreground transition-colors">
            <MoreVertical className="w-4 h-4" />
          </button>
        </header>

        {/* Browser Content */}
        <div className="flex-1 relative bg-[#0a0a0b]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTabId}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0"
            >
              <iframe
                ref={iframeRef}
                src={activeTab.url}
                className={`w-full h-full border-none transition-opacity duration-500 ${activeTab.isLoading ? 'opacity-0' : 'opacity-100'}`}
                onLoad={onIframeLoad}
                title={activeTab.title}
                sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
              />

              {activeTab.isLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[#0a0a0b] z-10">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-2xl border-2 border-primary/20 animate-pulse" />
                    <Loader2 className="absolute inset-0 m-auto w-5 h-5 text-primary animate-spin" />
                  </div>
                  <div className="flex flex-col items-center gap-1 text-center">
                    <span className="text-[10px] font-black tracking-[0.2em] uppercase text-muted-foreground/40">Initializing Container</span>
                    <span className="text-[9px] font-mono text-muted-foreground/20 max-w-[200px] truncate">{activeTab.url}</span>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Runtime Metrics */}
          <div className="absolute bottom-6 right-6 flex items-center gap-3">
            <div className="px-4 py-2 rounded-full bg-black/40 backdrop-blur-xl border border-white/5 flex items-center gap-3 shadow-2xl">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[9px] font-black text-emerald-500/80 uppercase tracking-widest">Isolated</span>
              </div>
              <div className="w-px h-3 bg-white/10" />
              <div className="flex items-center gap-1.5">
                <Zap className="w-3 h-3 text-primary" />
                <span className="text-[9px] font-mono font-bold text-white/60">12.8ms</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
