'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  ArrowUpRight,
  ChevronRight,
  Github,
  Layers,
  Sparkles,
} from 'lucide-react'
import { projectsData, type ProjectData } from '@/data/projects'

const PROJECT_META: Record<string, { index: string; year: string; discipline: string }> = {
  neuroscan: { index: '01', year: '2025', discipline: 'AI / ML' },
  studyflow: { index: '02', year: '2025', discipline: 'Full stack / AI' },
  nimbusx: { index: '03', year: '2026', discipline: 'Mobile' },
  codeviz: { index: '04', year: '2026', discipline: 'Developer tooling' },
}

const STATUS_LABEL: Record<ProjectData['status'], string> = {
  active: 'In progress',
  completed: 'Shipped',
  archived: 'Archived',
}

export function MobileProjectApp() {
  const [activeId, setActiveId] = useState<string | null>(null)
  const scroller = useRef<HTMLDivElement>(null)

  const project = projectsData.find((p) => p.id === activeId) ?? null

  // Let the hardware back button step out of a case study before leaving the app.
  useEffect(() => {
    if (!activeId) return
    const onBack = (event: Event) => {
      event.preventDefault()
      setActiveId(null)
    }
    window.addEventListener('prs:mobile-back', onBack)
    return () => window.removeEventListener('prs:mobile-back', onBack)
  }, [activeId])

  useEffect(() => {
    scroller.current?.scrollTo({ top: 0 })
  }, [activeId])

  return (
    <div ref={scroller} className="h-full overflow-y-auto no-scrollbar overscroll-contain">
      {project ? (
        <ProjectDetail
          project={project}
          onBack={() => setActiveId(null)}
        />
      ) : (
        <ProjectList onOpen={setActiveId} />
      )}
    </div>
  )
}

function ProjectList({ onOpen }: { onOpen: (id: string) => void }) {
  return (
    <div className="px-5 pb-14 pt-5 md:px-8">
      <div className="mx-auto max-w-2xl">
        <p className="text-eyebrow">Selected work</p>
        <h2 className="font-display mt-2 text-[2.35rem] leading-[0.95] tracking-[-0.02em]">
          Things I&apos;ve built
        </h2>
        <p className="mt-3 max-w-md text-[12.5px] leading-relaxed text-muted-foreground/65">
          Four projects, each built to answer a question I couldn&apos;t answer quickly enough.
        </p>

        <div className="mt-7 space-y-2.5">
          {projectsData.map((project, i) => {
            const meta = PROJECT_META[project.id] ?? { index: `0${i + 1}`, year: '', discipline: '' }
            return (
              <motion.button
                key={project.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.045, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                onClick={() => onOpen(project.id)}
                className="group w-full rounded-2xl border border-hairline bg-foreground/[0.028] p-4 text-left transition-colors active:bg-foreground/[0.05]"
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] text-muted-foreground/35">
                    {meta.index}
                  </span>
                  <span className="h-2.5 w-px bg-hairline" />
                  <span className="text-[9px] font-mono uppercase tracking-[0.12em] text-muted-foreground/45">
                    {meta.discipline}
                  </span>
                  <span
                    className={`ml-auto inline-flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-[0.1em] ${
                      project.status === 'active' ? 'text-accent' : 'text-muted-foreground/45'
                    }`}
                  >
                    <span
                      className={`h-1 w-1 rounded-full ${
                        project.status === 'active' ? 'bg-accent' : 'bg-foreground/30'
                      }`}
                    />
                    {STATUS_LABEL[project.status]}
                  </span>
                </div>

                <div className="mt-3 flex items-start gap-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-[17px] leading-tight tracking-[-0.01em] text-foreground/90">
                      {project.name}
                    </h3>
                    <p className="mt-1 text-[11.5px] leading-relaxed text-muted-foreground/60">
                      {project.tagline.replace(/\s*\|\s*/g, ' · ')}
                    </p>
                  </div>
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-hairline text-muted-foreground/40 transition-colors group-active:text-primary">
                    <ChevronRight className="h-3.5 w-3.5" />
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1">
                  {project.stack.slice(0, 4).map((tech, ti) => (
                    <span key={tech.name} className="text-[9.5px] font-mono text-muted-foreground/45">
                      {tech.name}
                      {ti < Math.min(project.stack.length, 4) - 1 && (
                        <span className="ml-2 text-muted-foreground/20">·</span>
                      )}
                    </span>
                  ))}
                </div>
              </motion.button>
            )
          })}
        </div>

        <a
          href="https://github.com/PREMRAJESH"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 flex items-center justify-between rounded-2xl border border-hairline px-4 py-3 text-muted-foreground/60 transition-colors active:bg-foreground/[0.04]"
        >
          <span className="flex items-center gap-2.5 text-[12px]">
            <Github className="h-4 w-4" />
            More experiments on GitHub
          </span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  )
}

function ProjectDetail({ project, onBack }: { project: ProjectData; onBack: () => void }) {
  const meta = PROJECT_META[project.id] ?? { index: '01', year: '', discipline: '' }
  const overview = project.overview
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)

  return (
    <div className="px-5 pb-16 pt-4 md:px-8">
      <div className="mx-auto max-w-2xl">
        <button
          onClick={onBack}
          className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-hairline px-3 py-1.5 text-[11px] text-muted-foreground/65 transition-colors active:bg-foreground/[0.05]"
        >
          <ArrowLeft className="h-3 w-3" />
          All projects
        </button>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex items-center gap-2 text-[9px] font-mono uppercase tracking-[0.13em] text-muted-foreground/45">
            <span>Case study</span>
            <span className="text-muted-foreground/20">/</span>
            <span>{meta.index}</span>
            <span className="text-muted-foreground/20">/</span>
            <span>{meta.year}</span>
            <span
              className={`ml-auto inline-flex items-center gap-1.5 ${
                project.status === 'active' ? 'text-accent' : 'text-muted-foreground/45'
              }`}
            >
              <span
                className={`h-1 w-1 rounded-full ${
                  project.status === 'active' ? 'bg-accent' : 'bg-foreground/30'
                }`}
              />
              {STATUS_LABEL[project.status]}
            </span>
          </div>

          <h2 className="font-display mt-3 text-[2.6rem] leading-[0.92] tracking-[-0.025em]">
            {project.name}
          </h2>
          <p className="mt-3 text-[12.5px] leading-relaxed text-muted-foreground/70">
            {project.tagline.replace(/\s*\|\s*/g, ' · ')}
          </p>

          <div className="mt-5 grid grid-cols-2 gap-2">
            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-3 text-[12px] font-medium text-primary-foreground active:bg-primary/90"
              >
                Live demo
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            )}
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-hairline-strong text-[12px] text-foreground/75 active:bg-foreground/[0.05] ${
                project.demo ? '' : 'col-span-2'
              }`}
            >
              <Github className="h-3.5 w-3.5" />
              Source
            </a>
          </div>
        </motion.div>

        <section className="mt-8 border-t border-hairline pt-6">
          <h3 className="text-eyebrow">Overview</h3>
          <div className="mt-3 space-y-3">
            {overview.map((paragraph) => (
              <p key={paragraph.slice(0, 24)} className="text-[13px] leading-[1.75] text-muted-foreground/80">
                {paragraph}
              </p>
            ))}
          </div>
        </section>

        <section className="mt-7 border-t border-hairline pt-6">
          <div className="flex items-center gap-2">
            <Layers className="h-3.5 w-3.5 text-muted-foreground/40" />
            <h3 className="text-eyebrow">Stack</h3>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {project.stack.map((tech) => (
              <span
                key={tech.name}
                className="rounded-full border border-hairline bg-foreground/[0.025] px-2.5 py-1 text-[10.5px] font-mono text-muted-foreground/65"
              >
                {tech.name}
              </span>
            ))}
          </div>
        </section>

        <section className="mt-7 border-t border-hairline pt-6">
          <h3 className="text-eyebrow">Architecture</h3>
          <p className="mt-3 rounded-xl border border-hairline bg-foreground/[0.025] p-3.5 font-mono text-[11px] leading-relaxed text-muted-foreground/70">
            {project.architecture}
          </p>
        </section>

        <section className="mt-7 border-t border-hairline pt-6">
          <h3 className="text-eyebrow">Challenges</h3>
          <div className="mt-3 space-y-2.5">
            {project.challenges.map((item, i) => (
              <div key={item} className="flex gap-3">
                <span className="mt-0.5 font-mono text-[9.5px] text-muted-foreground/30">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p className="text-[12px] leading-relaxed text-muted-foreground/70">{item}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-7 border-t border-hairline pt-6">
          <div className="flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-primary/70" />
            <h3 className="text-eyebrow">What I learned</h3>
          </div>
          <div className="mt-3 space-y-2.5">
            {project.learnings.map((item) => (
              <div key={item} className="flex gap-2.5">
                <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-primary/70" />
                <p className="text-[12px] leading-relaxed text-muted-foreground/70">{item}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-7 border-t border-hairline pt-6">
          <h3 className="text-eyebrow">Deployment</h3>
          <div className="mt-3 space-y-0">
            {project.deployment.map((item) => (
              <div
                key={item}
                className="flex items-center justify-between border-b border-hairline py-2.5 last:border-b-0"
              >
                <span className="text-[11.5px] text-muted-foreground/70">{item}</span>
                <span className="h-1 w-1 rounded-full bg-foreground/25" />
              </div>
            ))}
          </div>
        </section>

        <button
          onClick={onBack}
          className="mt-8 flex w-full items-center justify-center gap-1.5 rounded-xl border border-hairline py-3 text-[12px] text-muted-foreground/60 active:bg-foreground/[0.04]"
        >
          <ArrowLeft className="h-3 w-3" />
          Back to all projects
        </button>
      </div>
    </div>
  )
}
