'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { githubRepos, type GithubRepo } from '@/data/github'
import {
  GitBranch,
  Star,
  GitFork,
  Eye,
  Circle,
  ExternalLink,
  MapPin,
  Link as LinkIcon,
  Users,
  Grid,
  Calendar,
  BookOpen,
  ArrowUpRight,
} from 'lucide-react'

export function GithubWorkspace() {
  const [selectedRepo, setSelectedRepo] = useState<GithubRepo | null>(null)

  // Calculate total statistics
  const totalStars = githubRepos.reduce((acc, r) => acc + r.stars, 0)
  const totalForks = githubRepos.reduce((acc, r) => acc + r.forks, 0)
  const publicReposCount = githubRepos.length

  // Generate a mock contribution graph data (53 weeks * 7 days = 371 cells)
  // Let's create an array of contribution levels (0-4)
  const contributionGrid = useMemo(() => {
    const arr = []
    for (let i = 0; i < 371; i++) {
      // Create some patterns (higher contributions on weekdays, occasional streaks)
      const day = i % 7
      let level = 0
      const rand = Math.random()
      if (day === 0 || day === 6) {
        // Weekends
        level = rand > 0.85 ? 2 : rand > 0.7 ? 1 : 0
      } else {
        // Weekdays
        level = rand > 0.9 ? 4 : rand > 0.7 ? 3 : rand > 0.4 ? 2 : rand > 0.15 ? 1 : 0
      }
      arr.push(level)
    }
    return arr
  }, [])

  // Aggregate commits across all repos
  const allCommits = useMemo(() => {
    const list: { repoName: string; hash: string; message: string; date: string }[] = []
    githubRepos.forEach(repo => {
      repo.commits.forEach(commit => {
        list.push({
          repoName: repo.name,
          hash: commit.hash,
          message: commit.message,
          date: commit.date,
        })
      })
    })
    return list.slice(0, 5) // top 5 commits
  }, [])

  function openGithubProfile() {
    window.open('https://github.com/PREMRAJESH', '_blank', 'noopener,noreferrer')
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
              <span className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-primary" />
                <span>84 followers • 110 following</span>
              </span>
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
          <div className="grid grid-cols-3 gap-4">
            <StatCard label="Public Repositories" value={publicReposCount} />
            <StatCard label="Total Repository Stars" value={totalStars} />
            <StatCard label="Total Repository Forks" value={totalForks} />
          </div>

          {/* Pinned Repositories Grid */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
              <BookOpen className="w-3.5 h-3.5 text-primary/70" />
              Pinned Repositories
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {githubRepos.slice(0, 4).map((repo) => (
                <div 
                  key={repo.id}
                  onClick={() => window.open(repo.homepage || repo.fullName, '_blank')}
                  className="p-4 rounded-xl border border-white/5 bg-white/[0.01] hover:border-primary/30 hover:bg-white/[0.03] transition-all cursor-pointer group flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-primary/70">{repo.fullName}</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground/20 group-hover:text-primary transition-colors" />
                    </div>
                    <h3 className="text-sm font-bold text-white group-hover:text-primary transition-colors">{repo.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">{repo.description}</p>
                  </div>
                  
                  <div className="flex items-center gap-4 text-[10px] font-mono text-muted-foreground/60 pt-2 border-t border-white/[0.02]">
                    <span className="flex items-center gap-1">
                      <Circle className="w-2 h-2" style={{ fill: repo.languageColor, color: repo.languageColor }} />
                      {repo.language}
                    </span>
                    <span className="flex items-center gap-0.5">
                      <Star className="w-3 h-3 fill-yellow-500/20 text-yellow-500" />
                      {repo.stars}
                    </span>
                    <span className="flex items-center gap-0.5">
                      <GitFork className="w-3 h-3" />
                      {repo.forks}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contribution Graph representation */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
              <Grid className="w-3.5 h-3.5 text-primary/70" />
              Contribution Graph
            </h2>
            <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01] overflow-x-auto custom-scrollbar">
              <div className="min-w-[700px] space-y-2">
                <div className="text-[10px] text-muted-foreground/50 font-mono flex items-center justify-between pb-2 border-b border-white/[0.02]">
                  <span>842 contributions in the last year</span>
                  <div className="flex items-center gap-1">
                    <span>Less</span>
                    <div className="w-2 h-2 bg-stone-900 rounded-sm" />
                    <div className="w-2 h-2 bg-emerald-950 rounded-sm" />
                    <div className="w-2 h-2 bg-emerald-800 rounded-sm" />
                    <div className="w-2 h-2 bg-emerald-600 rounded-sm" />
                    <div className="w-2 h-2 bg-emerald-400 rounded-sm" />
                    <span>More</span>
                  </div>
                </div>
                {/* SVG/Div Grid layout */}
                <div className="grid grid-cols-[repeat(53,minmax(0,1fr))] gap-[3px]">
                  {contributionGrid.map((level, idx) => {
                    const colors = [
                      'bg-stone-900/60',       // 0
                      'bg-emerald-950/80',      // 1
                      'bg-emerald-800/80',      // 2
                      'bg-emerald-600/80',      // 3
                      'bg-emerald-400/90'       // 4
                    ]
                    return (
                      <div 
                        key={idx} 
                        className={`aspect-square rounded-[1px] transition-colors hover:ring-1 hover:ring-white/40 ${colors[level]}`} 
                        title={`Level ${level} contributions`}
                      />
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Latest Commits Activity Stream */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-primary/70" />
              Recent Commits Activity
            </h2>
            
            <div className="space-y-2">
              {allCommits.map((commit, index) => (
                <div 
                  key={index}
                  className="p-3.5 rounded-xl border border-white/5 bg-white/[0.01] flex items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-white leading-relaxed">{commit.message}</div>
                    <div className="text-[10px] text-muted-foreground/60 flex items-center gap-2 font-mono">
                      <span className="text-primary/70">{commit.repoName}</span>
                      <span>•</span>
                      <span>{commit.hash}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground/50 shrink-0">{commit.date}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01] text-center space-y-1.5">
      <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">{label}</span>
      <div className="text-xl font-black text-white">{value}</div>
    </div>
  )
}
