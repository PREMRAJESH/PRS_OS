'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Circle,
  ExternalLink,
  MapPin,
  Link as LinkIcon,
  Users,
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

const fallbackRepos: Repo[] = [
  {
    id: -1,
    name: 'NeuroScan',
    full_name: 'PREMRAJESH/NeuroScan',
    description: 'Brain tumour detection from MRI scans with an ONNX runtime and clinical guardrails.',
    language: 'Python',
    forks_count: 0,
    html_url: 'https://github.com/PREMRAJESH/NeuroScan',
    homepage: 'https://neuroscan-pink.vercel.app/',
  },
  {
    id: -2,
    name: 'StudyFlow',
    full_name: 'PREMRAJESH/StudyFlow',
    description: 'An AI study planner that turns a syllabus into a working weekly schedule.',
    language: 'TypeScript',
    forks_count: 0,
    html_url: 'https://github.com/PREMRAJESH/StudyFlow',
    homepage: 'https://studyflow-aii.vercel.app/',
  },
  {
    id: -3,
    name: 'NimbusX',
    full_name: 'PREMRAJESH/NimbusX',
    description: 'A real-time Android messaging app with private and group chats.',
    language: 'TypeScript',
    forks_count: 0,
    html_url: 'https://github.com/PREMRAJESH/NimbusX',
    homepage: '',
  },
  {
    id: -4,
    name: 'CodeViz',
    full_name: 'PREMRAJESH/CodeViz',
    description: 'A step-through code and algorithm visualiser running in a client sandbox.',
    language: 'TypeScript',
    forks_count: 0,
    html_url: 'https://github.com/PREMRAJESH/CodeViz',
    homepage: 'https://code-visualizer.vercel.app/',
  },
]

const languageColors: Record<string, string> = {
  Python: '#6f9bbd',
  TypeScript: '#7f9fc4',
  JavaScript: '#c9b978',
  HTML: '#b97a5c',
  CSS: '#8f7fa8',
  Java: '#b0875a',
  C: '#8a8a8a',
  'C++': '#b07a8a',
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

        if (userData && !userData.message) {
          setUser({
            followers: userData.followers ?? 0,
            following: userData.following ?? 0,
            public_repos: userData.public_repos ?? 0,
          })
        }

        if (Array.isArray(reposData)) {
          const pinnedRepos = ['NeuroScan', 'StudyFlow', 'NimbusX', 'CodeViz']
          setRepos(
            reposData
              .filter(r => pinnedRepos.includes(r.name))
              .sort((a, b) => b.forks_count - a.forks_count)
          )
        }
      } catch {
        // The fallback list below covers offline and rate-limited sessions.
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const displayRepos = repos.length > 0 ? repos : fallbackRepos

  return (
    <div className="h-full flex flex-col overflow-y-auto custom-scrollbar font-sans">
      {/* Header */}
      <div className="px-6 sm:px-8 py-5 border-b border-hairline shrink-0">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row sm:items-center gap-5">
          <div className="relative shrink-0">
            <div className="w-[64px] h-[64px] rounded-full overflow-hidden ring-1 ring-hairline-strong bg-surface">
              <img src="/avatar-small.jpg" alt="Prem Rajesh" className="w-full h-full object-cover object-top" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-accent ring-2 ring-window" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
              <h1 className="font-display text-[1.55rem] leading-none tracking-[-0.02em]">Prem Rajesh</h1>
              <span className="text-[10.5px] font-mono text-muted-foreground/45">@PREMRAJESH</span>
            </div>
            <p className="mt-1.5 text-[11.5px] text-muted-foreground/65 max-w-md">
              Building AI systems, developer tools and full-stack products.
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[9.5px] font-mono text-muted-foreground/45">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3 h-3" />
                Gujarat, India
              </span>
              <a
                href="https://github.com/PREMRAJESH"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-foreground transition-colors"
              >
                <LinkIcon className="w-3 h-3" />
                github.com/PREMRAJESH
              </a>
              {user && (
                <span className="flex items-center gap-1.5">
                  <Users className="w-3 h-3" />
                  {user.followers} followers · {user.following} following
                </span>
              )}
            </div>
          </div>

          <a
            href="https://github.com/PREMRAJESH"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-1.5 h-8 px-3 rounded-md border border-hairline-strong text-[11px] text-foreground/75 hover:text-foreground hover:bg-foreground/[0.035] transition-colors"
          >
            Visit profile
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 px-6 sm:px-8 py-6">
        <div className="max-w-3xl mx-auto">
          {/* Stats */}
          <div className="grid grid-cols-3 border-y border-hairline divide-x divide-hairline">
            <Stat label="Public repos" value={loading ? '—' : user?.public_repos ?? '—'} />
            <Stat label="Followers" value={loading ? '—' : user?.followers ?? '—'} />
            <Stat label="Pinned forks" value={loading ? '—' : displayRepos.reduce((a, r) => a + r.forks_count, 0)} />
          </div>

          {/* Repos */}
          <div className="mt-7">
            <div className="flex items-baseline justify-between">
              <h2 className="text-eyebrow">Selected repositories</h2>
              <span className="text-[9px] font-mono text-muted-foreground/30">
                {loading ? 'Syncing' : 'From GitHub'}
              </span>
            </div>

            <div className="mt-2">
              {loading ? (
                <div className="py-8 text-center text-[11px] font-mono text-muted-foreground/40">
                  Loading repositories…
                </div>
              ) : (
                displayRepos.map((repo, index) => (
                  <motion.a
                    key={repo.id}
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="group flex items-start gap-4 py-4 border-b border-hairline last:border-b-0"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline gap-2.5 flex-wrap">
                        <h3 className="text-[13px] text-foreground/90 group-hover:text-primary transition-colors">
                          {repo.name}
                        </h3>
                        <span className="text-[9px] font-mono text-muted-foreground/30">
                          {repo.full_name.split('/')[0].toLowerCase()}/{repo.full_name.split('/')[1]}
                        </span>
                      </div>
                      <p className="mt-1 text-[11.5px] leading-relaxed text-muted-foreground/60 line-clamp-2">
                        {repo.description || 'No description'}
                      </p>
                      <div className="mt-2 flex items-center gap-4 text-[9.5px] font-mono text-muted-foreground/40">
                        {repo.language && (
                          <span className="flex items-center gap-1.5">
                            <Circle
                              className="w-1.5 h-1.5"
                              style={{
                                fill: languageColors[repo.language] || '#a0988c',
                                color: languageColors[repo.language] || '#a0988c',
                              }}
                            />
                            {repo.language}
                          </span>
                        )}
                        <span>{repo.forks_count} forks</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2 shrink-0 pt-0.5">
                      {repo.homepage && (
                        <span className="text-[8.5px] font-mono tracking-[0.08em] uppercase px-1.5 py-0.5 rounded border border-accent/25 bg-accent/[0.06] text-accent/90">
                          Live
                        </span>
                      )}
                      <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground/25 group-hover:text-primary transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </div>
                  </motion.a>
                ))
              )}
            </div>
          </div>

          <p className="mt-6 text-[9.5px] font-mono text-muted-foreground/30 leading-relaxed">
            Repository metadata is read from the public GitHub API. The list above falls back
            to pinned projects if the request is rate-limited.
          </p>
        </div>
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="px-4 py-3 first:pl-0">
      <div className="font-display text-[1.45rem] leading-none text-foreground/85 tabular">{value}</div>
      <div className="mt-1 text-[8.5px] font-mono tracking-[0.1em] uppercase text-muted-foreground/40">
        {label}
      </div>
    </div>
  )
}
