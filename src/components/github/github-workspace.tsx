'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  GitBranch,
  GitFork,
  Circle,
  ExternalLink,
  MapPin,
  Link as LinkIcon,
  Users,
  BookOpen,
  ArrowUpRight,
} from 'lucide-react'

interface Repo {
  id: number
  name: string
  full_name: string
  description: string
  language: string
  forks_count: number
  html_url: string
  homepage: string
}

export function GithubWorkspace() {
  const [user, setUser] = useState<{ followers: number; following: number; public_repos: number } | null>(null)
  const [repos, setRepos] = useState<Repo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [userRes, reposRes] = await Promise.all([
          fetch('https://api.github.com/users/PREMRAJESH'),
          fetch('https://api.github.com/users/PREMRAJESH/repos?sort=updated&per_page=100'),
        ])
        const userData = await userRes.json()
        const reposData: Repo[] = await reposRes.json()

        setUser({
          followers: userData.followers ?? 0,
          following: userData.following ?? 0,
          public_repos: userData.public_repos ?? 0,
        })

        const pinnedRepos = ['NeuroScan', 'StudyFlow', 'NimbusX', 'CodeViz']
        const filtered = reposData
          .filter(r => pinnedRepos.includes(r.name))
          .sort((a, b) => b.forks_count - a.forks_count)
        setRepos(filtered)
      } catch {
        // Silently fail — component will show empty state
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  function openGithubProfile() {
    window.open('https://github.com/PREMRAJESH', '_blank', 'noopener,noreferrer')
  }

  const languageColors: Record<string, string> = {
    Python: '#3572A5',
    TypeScript: '#3178c6',
    JavaScript: '#f1e05a',
    HTML: '#e34c26',
    CSS: '#563d7c',
    Java: '#b07219',
    C: '#555555',
    'C++': '#f34b7d',
  }

  return (
    <div className="h-full flex flex-col bg-[#0a0a0b] overflow-y-auto custom-scrollbar font-sans select-none selection:bg-primary/20">
      
      {/* ─── Profile Header Bar ─── */}
      <div className="p-6 border-b border-white/5 bg-background/20">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Profile Avatar */}
          <div className="relative shrink-0">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-[#0a0a0b] shadow-2xl bg-[#0c0d12]">
              <img src="/avatar.png" alt="Prem Rajesh" className="w-full h-full object-cover" />
            </div>
            <div className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-[#0a0a0b] flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex-1 text-center md:text-left space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-center md:justify-start">
              <h1 className="text-xl font-bold text-white">Prem Rajesh</h1>
              <span className="text-xs text-muted-foreground font-mono">@PREMRAJESH</span>
            </div>
            
            <p className="text-xs text-muted-foreground/80 leading-relaxed max-w-xl">
              Software Engineering Student at GEC Dahod. Building intelligent applications, developer tools, and full-stack systems.
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-[11px] text-muted-foreground/50 font-mono">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-primary" />
                Gujarat, India
              </span>
              <span className="flex items-center gap-1.5">
                <LinkIcon className="w-3.5 h-3.5 text-primary" />
                <a href="https://github.com/PREMRAJESH" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">github.com/PREMRAJESH</a>
              </span>
              {user && (
                <span className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-primary" />
                  <span>{user.followers} followers • {user.following} following</span>
                </span>
              )}
            </div>
          </div>

          {/* Direct Link CTA */}
          <button
            onClick={openGithubProfile}
            className="px-4 py-2 rounded-xl text-xs font-bold border border-white/10 hover:border-primary/40 hover:bg-white/5 transition-all text-white shrink-0 flex items-center gap-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5 text-primary" />
            Visit Profile
          </button>
        </div>
      </div>

      {/* ─── Main Profile Body ─── */}
      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Stats Bar */}
          <div className="grid grid-cols-2 gap-4">
            <StatCard label="Public Repositories" value={loading ? '...' : user?.public_repos ?? 0} />
            <StatCard label="Total Repository Forks" value={loading ? '...' : repos.reduce((a, r) => a + r.forks_count, 0)} />
          </div>

          {/* Pinned Repositories Grid */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
              <BookOpen className="w-3.5 h-3.5 text-primary/70" />
              Pinned Repositories
            </h2>
            
            {loading ? (
              <div className="text-xs text-muted-foreground/60 text-center py-8 font-mono">Loading repositories...</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {repos.map((repo) => (
                  <div 
                    key={repo.id}
                    onClick={() => window.open(repo.homepage || repo.html_url, '_blank')}
                    className="p-4 rounded-xl border border-white/5 bg-white/[0.01] hover:border-primary/30 hover:bg-white/[0.03] transition-all cursor-pointer group flex flex-col justify-between space-y-3"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-primary/70">{repo.full_name}</span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground/20 group-hover:text-primary transition-colors" />
                      </div>
                      <h3 className="text-sm font-bold text-white group-hover:text-primary transition-colors">{repo.name}</h3>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">{repo.description || 'No description'}</p>
                    </div>
                    
                    <div className="flex items-center gap-4 text-[10px] font-mono text-muted-foreground/60 pt-2 border-t border-white/[0.02]">
                      {repo.language && (
                        <span className="flex items-center gap-1">
                          <Circle className="w-2 h-2" style={{ fill: languageColors[repo.language] || '#888', color: languageColors[repo.language] || '#888' }} />
                          {repo.language}
                        </span>
                      )}
                      <span className="flex items-center gap-0.5">
                        <GitFork className="w-3 h-3" />
                        {repo.forks_count}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>



        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01] text-center space-y-1.5">
      <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">{label}</span>
      <div className="text-xl font-black text-white">{value}</div>
    </div>
  )
}
