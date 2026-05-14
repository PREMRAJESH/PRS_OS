'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { githubRepos, type GithubRepo, type RepoFile } from '@/data/github'
import { useOSStore } from '@/store/os-store'
import {
  GitBranch, Star, GitFork, Eye, Circle, ExternalLink, Search,
  FileCode, FileText, File, FileJson, Folder, FolderOpen,
  ChevronRight, ChevronDown, X, BookOpen, Clock, Users,
  Cloud, Code2, Sparkles, AlertCircle, Plus, Minus,
} from 'lucide-react'

type TabKind = 'readme' | 'code' | 'commits' | 'deploy' | 'ai-explain'

interface Tab { id: string; label: string; kind: TabKind; repoId: string; filePath?: string; fileContent?: string; fileLang?: string }

const langColors: Record<string, string> = { tsx: 'text-blue-400', ts: 'text-blue-400', py: 'text-yellow-400', go: 'text-cyan-400', json: 'text-yellow-500', md: 'text-gray-400', css: 'text-pink-400' }

export function GithubWorkspace() {
  const { openWindow } = useOSStore()
  const [selectedRepo, setSelectedRepo] = useState(githubRepos[0])
  const [searchQuery, setSearchQuery] = useState('')
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['src', 'components', 'models', 'app', 'os', 'hooks', 'pkg', 'cmd', 'services', 'api', 'terminal']))
  const [tabs, setTabs] = useState<Tab[]>([{ id: `readme-${githubRepos[0].id}`, label: 'README.md', kind: 'readme', repoId: githubRepos[0].id }])
  const [activeTab, setActiveTab] = useState(`readme-${githubRepos[0].id}`)
  const [activeBranch, setActiveBranch] = useState(githubRepos[0].defaultBranch)

  const filteredRepos = useMemo(() => {
    if (!searchQuery) return githubRepos
    const q = searchQuery.toLowerCase()
    return githubRepos.filter(r => r.name.includes(q) || r.description.toLowerCase().includes(q) || r.topics.some(t => t.includes(q)))
  }, [searchQuery])

  const selectRepo = (repo: GithubRepo) => {
    setSelectedRepo(repo)
    setActiveBranch(repo.defaultBranch)
    const id = `readme-${repo.id}`
    if (!tabs.find(t => t.id === id)) setTabs(p => [...p, { id, label: 'README.md', kind: 'readme', repoId: repo.id }])
    setActiveTab(id)
  }

  const openTab = (kind: TabKind, label: string, extra?: Partial<Tab>) => {
    const id = `${kind}-${selectedRepo.id}${extra?.filePath || ''}`
    if (!tabs.find(t => t.id === id)) setTabs(p => [...p, { id, label, kind, repoId: selectedRepo.id, ...extra }])
    setActiveTab(id)
  }

  const closeTab = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const nt = tabs.filter(t => t.id !== id)
    setTabs(nt)
    if (activeTab === id && nt.length) setActiveTab(nt[nt.length - 1].id)
  }

  const openFile = (node: RepoFile, path: string) => {
    openTab('code', node.name, { filePath: path, fileContent: node.content, fileLang: node.lang })
  }

  const currentTab = tabs.find(t => t.id === activeTab)
  const tabRepo = githubRepos.find(r => r.id === currentTab?.repoId) || selectedRepo

  return (
    <div className="h-full flex bg-background/50 overflow-hidden">
      {/* Left: Repo list */}
      <div className="w-56 border-r border-border/50 flex flex-col shrink-0">
        <div className="p-2 border-b border-border/50">
          <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-secondary/30 border border-border/50">
            <Search className="w-3 h-3 text-muted-foreground/50" />
            <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Find a repository..." className="flex-1 bg-transparent outline-none text-xs text-foreground placeholder:text-muted-foreground/40" spellCheck={false} />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar py-1">
          {filteredRepos.map(repo => (
            <button key={repo.id} onClick={() => selectRepo(repo)} className={`w-full text-left px-3 py-2.5 border-l-2 transition-colors ${selectedRepo.id === repo.id ? 'bg-primary/10 border-primary text-foreground' : 'border-transparent text-muted-foreground hover:bg-secondary/30 hover:text-foreground'}`}>
              <div className="text-xs font-medium truncate">{repo.name}</div>
              <div className="text-[10px] text-muted-foreground/60 truncate mt-0.5">{repo.description.slice(0, 50)}...</div>
              <div className="flex items-center gap-3 mt-1.5 text-[10px] text-muted-foreground/50">
                <span className="flex items-center gap-1"><Circle className="w-2 h-2" style={{ fill: repo.languageColor, color: repo.languageColor }} />{repo.language}</span>
                <span className="flex items-center gap-0.5"><Star className="w-2.5 h-2.5" />{repo.stars}</span>
                <span className="flex items-center gap-0.5"><GitFork className="w-2.5 h-2.5" />{repo.forks}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Right: Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Repo header bar */}
        <div className="px-4 py-2.5 border-b border-border/50 flex items-center gap-3 shrink-0 bg-background/40">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">{selectedRepo.fullName.split('/')[0]}</span>
              <span className="text-muted-foreground/40">/</span>
              <span className="font-semibold">{selectedRepo.name}</span>
              <span className={`text-[9px] px-1.5 py-0.5 rounded-full border font-medium ${selectedRepo.issues === 0 ? 'text-green-400 bg-green-400/10 border-green-400/20' : 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'}`}>Public</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-muted-foreground shrink-0">
            <span className="flex items-center gap-1 px-2 py-1 rounded-md bg-secondary/40 border border-border/50"><Eye className="w-3 h-3" />{selectedRepo.watchers}</span>
            <span className="flex items-center gap-1 px-2 py-1 rounded-md bg-secondary/40 border border-border/50"><GitFork className="w-3 h-3" />{selectedRepo.forks}</span>
            <span className="flex items-center gap-1 px-2 py-1 rounded-md bg-secondary/40 border border-border/50"><Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />{selectedRepo.stars}</span>
          </div>
        </div>

        {/* Nav pills */}
        <div className="px-4 py-1.5 border-b border-border/50 flex items-center gap-1 shrink-0 bg-background/30 overflow-x-auto">
          <NavPill icon={Code2} label="Code" active={currentTab?.kind === 'readme' || currentTab?.kind === 'code'} onClick={() => openTab('readme', 'README.md')} />
          <NavPill icon={Clock} label="Commits" count={selectedRepo.commits.length} active={currentTab?.kind === 'commits'} onClick={() => openTab('commits', 'Commits')} />
          <NavPill icon={Cloud} label="Deployments" active={currentTab?.kind === 'deploy'} onClick={() => openTab('deploy', 'Deploy')} />
          <NavPill icon={Sparkles} label="Explain Repo" active={currentTab?.kind === 'ai-explain'} onClick={() => openTab('ai-explain', 'AI Explain')} primary />
          <div className="ml-auto flex items-center gap-1.5 text-xs text-muted-foreground">
            <GitBranch className="w-3 h-3" />
            <select value={activeBranch} onChange={e => setActiveBranch(e.target.value)} className="bg-secondary/40 border border-border/50 rounded px-1.5 py-0.5 text-[10px] outline-none">
              {selectedRepo.branches.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
        </div>

        {/* Tab bar */}
        <div className="h-7 flex items-stretch border-b border-border/50 bg-background/60 overflow-x-auto custom-scrollbar shrink-0">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-1.5 px-3 text-[11px] border-r border-border/30 shrink-0 max-w-36 transition-colors group ${activeTab === tab.id ? 'bg-background text-foreground border-b-2 border-b-primary' : 'text-muted-foreground hover:text-foreground border-b-2 border-b-transparent'}`}>
              <span className="truncate">{tab.label}</span>
              {tabs.length > 1 && <span onClick={e => closeTab(tab.id, e)} className="ml-auto opacity-0 group-hover:opacity-100 hover:text-destructive shrink-0"><X className="w-2.5 h-2.5" /></span>}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex">
          {(currentTab?.kind === 'readme' || currentTab?.kind === 'code') && (
            <div className="w-52 border-r border-border/50 overflow-y-auto custom-scrollbar py-1 shrink-0">
              <FileTree items={selectedRepo.files} expanded={expanded} toggle={n => setExpanded(p => { const s = new Set(p); s.has(n) ? s.delete(n) : s.add(n); return s })} onFileClick={openFile} depth={0} path="" />
            </div>
          )}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <AnimatePresence mode="wait">
              <motion.div key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.12 }}>
                {currentTab?.kind === 'readme' && <ReadmeView repo={tabRepo} />}
                {currentTab?.kind === 'code' && <CodeView content={currentTab.fileContent} lang={currentTab.fileLang} path={currentTab.filePath || ''} />}
                {currentTab?.kind === 'commits' && <CommitsView repo={tabRepo} />}
                {currentTab?.kind === 'deploy' && <DeployView repo={tabRepo} />}
                {currentTab?.kind === 'ai-explain' && <AIExplainView repo={tabRepo} />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Sub-views ─────────────────────────────────────── */

function ReadmeView({ repo }: { repo: GithubRepo }) {
  return (
    <div className="p-6 max-w-3xl">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border/40">
        <BookOpen className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm font-medium">README.md</span>
      </div>
      <div className="prose-terminal text-sm leading-relaxed whitespace-pre-line text-foreground/80">{repo.readme}</div>
      {repo.homepage && (
        <div className="mt-6 p-4 rounded-xl glass border border-border/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Live Demo</span>
            <a href={repo.homepage} target="_blank" rel="noopener noreferrer" className="text-xs text-primary flex items-center gap-1 hover:underline">Open <ExternalLink className="w-3 h-3" /></a>
          </div>
          <div className="h-48 rounded-lg bg-background/80 border border-border/50 flex items-center justify-center text-muted-foreground/30 text-xs">
            <div className="text-center"><div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-2"><ExternalLink className="w-4 h-4 text-primary" /></div>{repo.homepage}</div>
          </div>
        </div>
      )}
      {/* Contributors */}
      <div className="mt-6">
        <div className="flex items-center gap-2 mb-3"><Users className="w-3.5 h-3.5 text-primary" /><span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Contributors</span></div>
        <div className="flex gap-2">
          {repo.contributors.map(c => (
            <div key={c.name} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/30 border border-border/50">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary/30 to-accent/20 flex items-center justify-center text-[10px] font-bold text-primary">{c.avatar}</div>
              <div><div className="text-xs font-medium">{c.name}</div><div className="text-[10px] text-muted-foreground">{c.commits} commits · {c.role}</div></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function CommitsView({ repo }: { repo: GithubRepo }) {
  return (
    <div className="p-6 max-w-3xl">
      <div className="flex items-center gap-2 mb-4"><Clock className="w-4 h-4 text-primary" /><span className="text-sm font-semibold">Commit History</span><span className="text-xs text-muted-foreground ml-auto">{repo.commits.length} commits</span></div>
      <div className="space-y-1">
        {repo.commits.map((c, i) => (
          <motion.div key={c.hash} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }} className="flex items-start gap-3 p-3 rounded-lg hover:bg-secondary/20 transition-colors group">
            <div className="w-8 h-8 rounded-full bg-secondary/50 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold text-muted-foreground">{c.author.split(' ').map(w => w[0]).join('')}</div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate group-hover:text-primary transition-colors">{c.message}</div>
              <div className="flex items-center gap-3 mt-1 text-[10px] text-muted-foreground">
                <span>{c.author}</span>
                <span className="font-mono text-muted-foreground/50">{c.hash}</span>
                <span>{c.date}</span>
                <span className="ml-auto flex items-center gap-2"><span className="text-green-400">+{c.additions}</span><span className="text-red-400">-{c.deletions}</span></span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function DeployView({ repo }: { repo: GithubRepo }) {
  return (
    <div className="p-6 max-w-3xl">
      <div className="flex items-center gap-2 mb-4"><Cloud className="w-4 h-4 text-primary" /><span className="text-sm font-semibold">Deployments</span></div>
      <div className="space-y-3">
        {repo.deployments.map(d => (
          <div key={d.env} className="flex items-center justify-between p-4 rounded-xl glass border border-border/50 hover:border-primary/20 transition-colors">
            <div className="flex items-center gap-3">
              <div className={`w-2.5 h-2.5 rounded-full ${d.status === 'active' ? 'bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.5)]' : 'bg-gray-500'}`} />
              <div><div className="text-sm font-medium">{d.env}</div><div className="text-[10px] text-muted-foreground">{d.provider} · {d.lastDeploy}</div></div>
            </div>
            {d.url && <a href={d.url} target="_blank" rel="noopener noreferrer" className="text-[10px] text-primary flex items-center gap-1 hover:underline">{d.url.replace('https://', '')} <ExternalLink className="w-3 h-3" /></a>}
          </div>
        ))}
      </div>
      <div className="mt-6"><div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Topics</div>
        <div className="flex flex-wrap gap-1.5">{repo.topics.map(t => <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-mono">{t}</span>)}</div>
      </div>
    </div>
  )
}

function AIExplainView({ repo }: { repo: GithubRepo }) {
  const lines = [
    `## Repository Analysis: ${repo.name}`,
    '',
    `**${repo.fullName}** is a ${repo.language}-based project with ${repo.stars} stars.`,
    '',
    `### Purpose`,
    repo.description,
    '',
    `### Architecture`,
    `The repository follows a modular structure with ${repo.files.length} top-level entries.`,
    `Primary language: ${repo.language} | License: ${repo.license}`,
    `Active branches: ${repo.branches.join(', ')}`,
    '',
    `### Activity`,
    `${repo.commits.length} recent commits by ${repo.contributors.length} contributor(s).`,
    `Last push: ${repo.lastPush} | Created: ${repo.createdAt}`,
    '',
    `### Deployment`,
    ...repo.deployments.map(d => `- **${d.env}**: ${d.provider} (${d.status})`),
    '',
    `### Key Technologies`,
    repo.topics.map(t => `\`${t}\``).join(' · '),
  ]

  return (
    <div className="p-6 max-w-3xl">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-6 h-6 rounded-lg bg-primary/20 flex items-center justify-center"><Sparkles className="w-3.5 h-3.5 text-primary" /></div>
        <span className="text-sm font-semibold">AI Repository Analysis</span>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">Auto-generated</span>
      </div>
      <div className="glass rounded-xl border border-primary/20 p-5 space-y-1 text-sm leading-relaxed">
        {lines.map((line, i) => (
          <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className={`${line.startsWith('##') ? 'text-lg font-bold mt-4 text-foreground' : line.startsWith('###') ? 'text-sm font-semibold mt-3 text-foreground' : line.startsWith('- ') ? 'text-foreground/70 pl-4' : line.startsWith('**') ? 'text-foreground/80' : 'text-foreground/60'}`}>
            {line || <br />}
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function CodeView({ content, lang, path }: { content?: string; lang?: string; path: string }) {
  if (!content) return <div className="flex items-center justify-center h-full text-muted-foreground/30 text-sm"><div className="text-center"><FileCode className="w-8 h-8 mx-auto mb-2 opacity-30" /><p>No preview for this file</p></div></div>
  const lines = content.split('\n')
  return (
    <div className="font-mono text-[12px] leading-relaxed">
      <div className="px-4 py-1.5 border-b border-border/40 text-[10px] text-muted-foreground/40 flex items-center gap-1">{path.split('/').filter(Boolean).map((s, i, a) => <span key={i} className="flex items-center gap-1">{i > 0 && <ChevronRight className="w-2.5 h-2.5" />}<span className={i === a.length - 1 ? 'text-foreground/70' : ''}>{s}</span></span>)}</div>
      <table className="w-full"><tbody>{lines.map((line, i) => (
        <tr key={i} className="hover:bg-secondary/15"><td className="text-right pr-3 pl-3 py-0 select-none text-muted-foreground/20 w-10 text-[11px]">{i + 1}</td><td className="pr-4 py-0 whitespace-pre text-foreground/75">{line}</td></tr>
      ))}</tbody></table>
    </div>
  )
}

/* ── Shared ─────────────────────────────────────────── */

function NavPill({ icon: Icon, label, count, active, onClick, primary }: { icon: any; label: string; count?: number; active: boolean; onClick: () => void; primary?: boolean }) {
  return (
    <button onClick={onClick} className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors shrink-0 ${active ? 'bg-primary/15 text-primary' : primary ? 'text-primary/70 hover:bg-primary/10' : 'text-muted-foreground hover:bg-secondary/40 hover:text-foreground'}`}>
      <Icon className="w-3.5 h-3.5" />{label}{count !== undefined && <span className="text-[9px] px-1 rounded-full bg-secondary/50">{count}</span>}
    </button>
  )
}

function FileTree({ items, expanded, toggle, onFileClick, depth, path }: { items: RepoFile[]; expanded: Set<string>; toggle: (n: string) => void; onFileClick: (n: RepoFile, p: string) => void; depth: number; path: string }) {
  const sorted = [...items].sort((a, b) => a.type === b.type ? a.name.localeCompare(b.name) : a.type === 'dir' ? -1 : 1)
  return (
    <>
      {sorted.map(item => {
        const p = `${path}/${item.name}`
        const isExp = expanded.has(item.name)
        if (item.type === 'dir') return (
          <div key={p}>
            <button onClick={() => toggle(item.name)} className="w-full flex items-center gap-1 py-[3px] text-[11px] hover:bg-secondary/25 transition-colors text-left group" style={{ paddingLeft: `${depth * 10 + 4}px` }}>
              {isExp ? <ChevronDown className="w-3 h-3 text-muted-foreground/40" /> : <ChevronRight className="w-3 h-3 text-muted-foreground/40" />}
              {isExp ? <FolderOpen className="w-3.5 h-3.5 text-primary/70" /> : <Folder className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary/50" />}
              <span className="text-foreground/70 ml-0.5">{item.name}</span>
            </button>
            <AnimatePresence>{isExp && item.children && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.12 }} className="overflow-hidden"><FileTree items={item.children} expanded={expanded} toggle={toggle} onFileClick={onFileClick} depth={depth + 1} path={p} /></motion.div>}</AnimatePresence>
          </div>
        )
        const color = langColors[item.lang || ''] || 'text-muted-foreground'
        return <button key={p} onClick={() => onFileClick(item, p)} className="w-full flex items-center gap-1.5 py-[3px] text-[11px] hover:bg-secondary/25 transition-colors text-left text-muted-foreground hover:text-foreground" style={{ paddingLeft: `${depth * 10 + 18}px` }}><FileCode className={`w-3.5 h-3.5 ${color}`} />{item.name}{item.size && <span className="ml-auto pr-2 text-[9px] text-muted-foreground/30">{item.size}</span>}</button>
      })}
    </>
  )
}
