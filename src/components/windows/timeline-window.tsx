'use client'

import { motion } from 'framer-motion'
import { GitCommit, GitBranch, GitMerge, Star } from 'lucide-react'

interface Commit {
  id: string
  hash: string
  message: string
  description?: string
  date: string
  type: 'commit' | 'merge' | 'milestone'
  tags?: string[]
}

const commits: Commit[] = [
  {
    id: '1',
    hash: 'a8f21c3',
    message: 'feat: Launched PRS-OS Portfolio v2.0',
    description: 'Complete redesign with AI-powered operating system interface',
    date: '2026',
    type: 'milestone',
    tags: ['release', 'v2.0'],
  },
  {
    id: '2',
    hash: 'd4e9b1f',
    message: 'feat: Implemented real-time AI assistant',
    description: 'Integrated conversational AI for portfolio interactions',
    date: '2025',
    type: 'commit',
    tags: ['ai', 'feature'],
  },
  {
    id: '3',
    hash: 'b2c7a9e',
    message: 'chore: Completed AWS Solutions Architect certification',
    description: 'Professional level cloud architecture certification',
    date: '2025',
    type: 'milestone',
    tags: ['certification'],
  },
  {
    id: '4',
    hash: 'f1d8c4a',
    message: 'feat: Built NimbusX cloud platform',
    description: 'Launched cloud-native development platform with 10K+ users',
    date: '2024',
    type: 'commit',
    tags: ['project', 'cloud'],
  },
  {
    id: '5',
    hash: 'e3b2a7c',
    message: 'merge: Joined TechCorp as Senior Engineer',
    description: 'Leading AI-powered analytics platform development',
    date: '2024',
    type: 'merge',
    tags: ['career'],
  },
  {
    id: '6',
    hash: 'c9f4e2b',
    message: 'feat: Developed BrainTumorAI medical imaging system',
    description: 'Achieved 97.3% accuracy in tumor detection',
    date: '2023',
    type: 'commit',
    tags: ['ai', 'healthcare'],
  },
  {
    id: '7',
    hash: 'a7d1c8f',
    message: 'chore: Obtained Google Cloud ML Engineer certification',
    description: 'Machine learning specialization on GCP',
    date: '2023',
    type: 'milestone',
    tags: ['certification'],
  },
  {
    id: '8',
    hash: 'b5e3d9a',
    message: 'merge: Started at StartupXYZ',
    description: 'Full-stack developer role focusing on real-time features',
    date: '2022',
    type: 'merge',
    tags: ['career'],
  },
  {
    id: '9',
    hash: 'd2f7a4c',
    message: 'feat: Graduated M.S. Computer Science from Stanford',
    description: 'Specialized in AI and Machine Learning',
    date: '2021',
    type: 'milestone',
    tags: ['education'],
  },
  {
    id: '10',
    hash: 'f8c1b6e',
    message: 'init: Started software development journey',
    description: 'First line of code and the beginning of everything',
    date: '2017',
    type: 'commit',
    tags: ['origin'],
  },
]

export function TimelineWindow() {
  return (
    <div className="h-full flex flex-col bg-background/50">
      {/* Header */}
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/20">
            <GitBranch className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold">Git Timeline</h2>
            <p className="text-xs text-muted-foreground">
              Developer journey commits
            </p>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-[19px] top-0 bottom-0 w-px bg-border" />

          {/* Commits */}
          <div className="space-y-4">
            {commits.map((commit, index) => (
              <motion.div
                key={commit.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="relative flex gap-4"
              >
                {/* Icon */}
                <div className={`
                  relative z-10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0
                  ${commit.type === 'milestone' ? 'bg-yellow-500/20 text-yellow-500' :
                    commit.type === 'merge' ? 'bg-purple-500/20 text-purple-500' :
                    'bg-primary/20 text-primary'}
                `}>
                  {commit.type === 'milestone' ? (
                    <Star className="w-4 h-4" />
                  ) : commit.type === 'merge' ? (
                    <GitMerge className="w-4 h-4" />
                  ) : (
                    <GitCommit className="w-4 h-4" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 pb-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-muted-foreground">
                          {commit.hash}
                        </span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">{commit.date}</span>
                      </div>
                      <h3 className="text-sm font-medium mt-1">{commit.message}</h3>
                      {commit.description && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {commit.description}
                        </p>
                      )}
                      {commit.tags && (
                        <div className="flex items-center gap-2 mt-2">
                          {commit.tags.map((tag) => (
                            <span
                              key={tag}
                              className={`
                                px-2 py-0.5 rounded text-[10px] font-mono
                                ${tag === 'release' ? 'bg-green-500/20 text-green-400' :
                                  tag === 'certification' ? 'bg-yellow-500/20 text-yellow-400' :
                                  tag === 'career' ? 'bg-purple-500/20 text-purple-400' :
                                  tag === 'education' ? 'bg-blue-500/20 text-blue-400' :
                                  'bg-secondary text-muted-foreground'}
                              `}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border/50 bg-secondary/20">
        <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
          <span>{commits.length} commits</span>
          <span>main branch</span>
        </div>
      </div>
    </div>
  )
}
