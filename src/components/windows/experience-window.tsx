'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Image as ImageIcon, ZoomIn, X, ArrowUpRight } from 'lucide-react'

interface Role {
  company: string
  role: string
  period: string
  current?: boolean
  points: string[]
  artifact?: {
    label: string
    href?: string
    image?: string
    kind: 'pdf' | 'image'
  }
}

const roles: Role[] = [
  {
    company: 'CSRBOX × IBM SkillsBuild × AICTE',
    role: 'AI Automation & Intelligent Solutions intern',
    period: 'June 2026 — present',
    current: true,
    points: [
      'Agentic AI and workflow automation',
      'IBM SkillsBuild learning path',
      'Hands-on AI projects with industry mentorship',
      'AICTE certified programme',
    ],
    artifact: {
      label: 'Offer letter',
      href: '/csrbox-offerletter.pdf',
      kind: 'pdf',
    },
  },
  {
    company: 'BrainyBeam Technologies',
    role: 'Web development intern',
    period: 'September 2022',
    points: [
      'Front-end development',
      'Website build and iteration',
      'Practical exposure to production web technologies',
    ],
    artifact: {
      label: 'Offer letter',
      image: '/offerletter.jpg',
      kind: 'image',
    },
  },
]

export function ExperienceWindow() {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)

  return (
    <div className="h-full flex flex-col font-sans relative">
      {/* Header */}
      <div className="px-6 py-5 border-b border-hairline shrink-0">
        <p className="text-eyebrow">Experience</p>
        <div className="mt-1.5 flex items-end justify-between gap-4">
          <h2 className="font-display text-[2rem] leading-none tracking-[-0.02em]">
            Where I&apos;ve worked
          </h2>
          <span className="hidden sm:flex items-center gap-1.5 text-[9.5px] font-mono tracking-[0.08em] uppercase text-muted-foreground/55 pb-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            1 active
          </span>
        </div>
        <p className="mt-2 text-[11.5px] text-muted-foreground/60">
          Two internships, four years apart. Both changed how I think about shipping software.
        </p>
      </div>

      {/* Roles */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-6">
        {roles.map((role, idx) => (
          <motion.article
            key={role.company}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.07, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="py-5 border-b border-hairline last:border-b-0 grid grid-cols-1 md:grid-cols-[1fr_168px] gap-x-7 gap-y-4"
          >
            <div className="min-w-0">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h3 className="text-[15px] leading-snug text-foreground/90">{role.role}</h3>
                {role.current && (
                  <span className="inline-flex items-center gap-1 text-[8.5px] font-mono tracking-[0.08em] uppercase text-accent">
                    <span className="w-1 h-1 rounded-full bg-accent" />
                    Current
                  </span>
                )}
              </div>
              <p className="mt-1 text-[11.5px] text-muted-foreground/60">
                {role.company} <span className="text-muted-foreground/25 mx-1.5">·</span>
                <span className="font-mono text-[10px]">{role.period}</span>
              </p>

              <ul className="mt-3.5 space-y-1.5">
                {role.points.map(point => (
                  <li key={point} className="flex items-start gap-2.5 text-[11.5px] leading-relaxed text-muted-foreground/70 edu-exp-content">
                    <span className="mt-[7px] w-[3px] h-[3px] rounded-full bg-foreground/30 shrink-0" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            {/* Artifact */}
            {role.artifact && (
              <div className="md:pt-1">
                <span className="block text-[9px] font-mono tracking-[0.1em] uppercase text-muted-foreground/35 mb-1.5">
                  {role.artifact.label}
                </span>

                {role.artifact.kind === 'pdf' ? (
                  <a
                    href={role.artifact.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative flex flex-col justify-between w-full max-w-[168px] aspect-[4/3] rounded-md border border-hairline hover:border-hairline-strong bg-foreground/[0.02] p-3 transition-colors no-underline"
                  >
                    <div className="flex items-start justify-between">
                      <ImageIcon className="w-4 h-4 text-muted-foreground/35 group-hover:text-primary transition-colors" />
                      <ArrowUpRight className="w-3 h-3 text-muted-foreground/25 group-hover:text-primary transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </div>
                    <div>
                      <p className="text-[11px] text-foreground/70 group-hover:text-foreground transition-colors">
                        View PDF
                      </p>
                      <p className="text-[8.5px] font-mono text-muted-foreground/35 mt-0.5">
                        csrbox-offerletter.pdf
                      </p>
                    </div>
                  </a>
                ) : (
                  <button
                    onClick={() => setIsLightboxOpen(true)}
                    className="group relative w-full max-w-[168px] aspect-[4/3] rounded-md overflow-hidden border border-hairline hover:border-hairline-strong bg-surface transition-colors"
                    aria-label="Open BrainyBeam offer letter"
                  >
                    <img
                      src={role.artifact.image}
                      alt="BrainyBeam internship offer letter"
                      className="w-full h-full object-cover object-top opacity-65 group-hover:opacity-90 transition-opacity duration-300"
                      onError={(e) => { e.currentTarget.style.display = 'none' }}
                    />
                    <span className="absolute inset-0 flex items-center justify-center gap-1.5 bg-background/40 group-hover:bg-background/20 transition-colors text-[10px] text-foreground/80">
                      <ZoomIn className="w-3 h-3" />
                      Enlarge
                    </span>
                  </button>
                )}
              </div>
            )}
          </motion.article>
        ))}
      </div>

      {/* Footer */}
      <div className="px-6 py-3 border-t border-hairline shrink-0 flex items-center justify-between gap-4">
        <span className="text-[10px] text-muted-foreground/50">
          CSRBOX and BrainyBeam certified
        </span>
        <span className="text-[9px] font-mono text-muted-foreground/30">2 internships</span>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[2000] flex items-center justify-center bg-background/92 backdrop-blur-sm p-6"
            onClick={() => setIsLightboxOpen(false)}
          >
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-md border border-hairline bg-popover text-foreground/70 hover:text-foreground transition-colors"
              aria-label="Close preview"
            >
              <X className="w-4 h-4" />
            </button>
            <motion.div
              initial={{ scale: 0.97, y: 8 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.97, y: 8 }}
              className="relative max-w-3xl w-full max-h-[85vh] overflow-hidden rounded-lg border border-hairline bg-window shadow-[var(--shadow-elevated)]"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src="/offerletter.jpg"
                alt="BrainyBeam internship offer letter"
                className="w-full h-full object-contain max-h-[85vh]"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
