'use client'

import { motion } from 'framer-motion'

interface EducationItem {
  institution: string
  degree: string
  period: string
  metric?: string
  areas: string[]
}

const educationData: EducationItem[] = [
  {
    institution: 'Government Engineering College, Dahod',
    degree: 'B.E. Computer Engineering',
    period: '2024 — 2027',
    areas: ['Web applications', 'Artificial intelligence', 'Software engineering'],
  },
  {
    institution: 'Government Polytechnic, Dahod',
    degree: 'Diploma in Computer Software Engineering',
    period: '2021 — 2024',
    metric: 'CPI 8.33',
    areas: ['Web development', 'Machine learning', 'Software engineering fundamentals'],
  },
]

export function EducationWindow() {
  return (
    <div className="h-full flex flex-col font-sans">
      {/* Header */}
      <div className="px-6 py-5 border-b border-hairline shrink-0">
        <p className="text-eyebrow">Education</p>
        <div className="mt-1.5 flex items-end justify-between gap-4">
          <h2 className="font-display text-[2rem] leading-none tracking-[-0.02em]">
            Where I studied
          </h2>
          <span className="hidden sm:block text-[9.5px] font-mono text-muted-foreground/40 pb-0.5">
            Gujarat, India
          </span>
        </div>
        <p className="mt-2 text-[11.5px] text-muted-foreground/60">
          Two programmes, one direction: building software that holds up outside a classroom.
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-2">
        {educationData.map((edu, idx) => (
          <motion.article
            key={edu.institution}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.07, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="py-5 border-b border-hairline last:border-b-0 grid grid-cols-1 sm:grid-cols-[110px_1fr] gap-x-6 gap-y-2"
          >
            <div className="sm:pt-0.5">
              <span className="font-mono text-[10px] text-muted-foreground/40 tabular">
                {edu.period}
              </span>
              {edu.metric && (
                <span className="mt-2 inline-flex items-center gap-1 px-1.5 py-0.5 rounded border border-accent/25 bg-accent/[0.06] text-[8.5px] font-mono tracking-[0.06em] uppercase text-accent">
                  {edu.metric}
                </span>
              )}
            </div>

            <div className="min-w-0">
              <h3 className="text-[15px] leading-snug text-foreground/90">{edu.degree}</h3>
              <p className="mt-1 text-[11.5px] text-muted-foreground/60">{edu.institution}</p>

              <div className="mt-3">
                <span className="text-[9px] font-mono tracking-[0.12em] uppercase text-muted-foreground/35">
                  Areas of study
                </span>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {edu.areas.map(area => (
                    <span
                      key={area}
                      className="px-2 py-0.5 rounded border border-hairline bg-foreground/[0.02] text-[10.5px] text-muted-foreground/70 edu-exp-content"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.article>
        ))}
      </div>

      {/* Footer */}
      <div className="px-6 py-3 border-t border-hairline shrink-0 flex items-center justify-between gap-4">
        <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground/50">
          <span className="w-1 h-1 rounded-full bg-accent" />
          AICTE / Gujarat Technological University
        </span>
        <span className="text-[9px] font-mono text-muted-foreground/30">2 programmes</span>
      </div>
    </div>
  )
}
