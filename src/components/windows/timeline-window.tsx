'use client'

import { motion } from 'framer-motion'

interface Milestone {
  year: string
  title: string
  place: string
  description?: string
  kind: 'Work' | 'Study' | 'Build'
}

const milestones: Milestone[] = [
  {
    year: '2026',
    title: 'AI Automation & Intelligent Solutions intern',
    place: 'CSRBOX × IBM SkillsBuild × AICTE',
    description:
      'Agentic AI, workflow automation and hands-on projects through the IBM SkillsBuild learning path. AICTE certified.',
    kind: 'Work',
  },
  {
    year: '2026',
    title: 'Built Nimbus X',
    place: 'Real-time Android messaging',
    description:
      'Private and group chats, media sharing and a cloud/local storage toggle, built with React Native and Supabase.',
    kind: 'Build',
  },
  {
    year: '2026',
    title: 'Built CodeViz',
    place: 'Code and algorithm visualiser',
    description:
      'Step-through tracing for data structures and call stacks, running entirely inside locked client-side workers.',
    kind: 'Build',
  },
  {
    year: '2025',
    title: 'Built NeuroScan AI',
    place: 'Brain tumour detection',
    description:
      'EfficientNetB0 classifier exported to a 35 MB ONNX model, serving inference in under 150 ms on serverless CPU. 94.05% validation accuracy.',
    kind: 'Build',
  },
  {
    year: '2025',
    title: 'Built StudyFlow',
    place: 'AI study planner',
    description:
      'Turns a syllabus PDF into a working weekly schedule with Gemini structured outputs and Supabase row-level security.',
    kind: 'Build',
  },
  {
    year: '2024',
    title: 'Started B.E. Computer Engineering',
    place: 'Government Engineering College, Dahod',
    description: 'Admitted to the four-year Computer Engineering programme, 2024—2027.',
    kind: 'Study',
  },
  {
    year: '2024',
    title: 'Completed Computer Software Engineering diploma',
    place: 'Government Polytechnic, Dahod',
    description: 'Graduated with a CPI of 8.33.',
    kind: 'Study',
  },
  {
    year: '2022',
    title: 'Web Development intern',
    place: 'BrainyBeam Technologies',
    description: 'Front-end development and web technologies, with practical industry exposure.',
    kind: 'Work',
  },
  {
    year: '2021',
    title: 'Started Computer Software Engineering diploma',
    place: 'Government Polytechnic, Dahod',
    description: 'Began software engineering studies with a focus on web development and ML fundamentals.',
    kind: 'Study',
  },
]

const kindStyles: Record<Milestone['kind'], string> = {
  Work: 'text-accent/90 border-accent/25 bg-accent/[0.06]',
  Build: 'text-primary/90 border-primary/25 bg-primary/[0.06]',
  Study: 'text-muted-foreground/70 border-hairline bg-foreground/[0.03]',
}

export function TimelineWindow() {
  return (
    <div className="h-full flex flex-col font-sans">
      {/* Header */}
      <div className="px-6 py-5 border-b border-hairline shrink-0">
        <p className="text-eyebrow">Timeline</p>
        <div className="mt-1.5 flex items-end justify-between gap-4">
          <h2 className="font-display text-[2rem] leading-none tracking-[-0.02em]">
            The path so far
          </h2>
          <span className="hidden sm:block text-[9.5px] font-mono text-muted-foreground/40 pb-0.5">
            2021 — 2026
          </span>
        </div>
        <p className="mt-2 text-[11.5px] text-muted-foreground/60">
          Studies, internships and the projects that came out of them.
        </p>
      </div>

      {/* Entries */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-6 select-none">
        <div className="relative">
          {milestones.map((milestone, index) => (
            <motion.article
              key={`${milestone.year}-${milestone.title}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(index * 0.04, 0.32), duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="group grid grid-cols-[34px_14px_1fr] sm:grid-cols-[44px_16px_1fr] gap-x-3 py-4 border-b border-hairline last:border-b-0"
            >
              <span className="font-mono text-[10px] text-muted-foreground/40 pt-1 tabular">
                {milestone.year}
              </span>

              <span className="relative flex justify-center pt-1.5">
                <span className="absolute top-3 bottom-[-22px] w-px bg-hairline group-last:hidden" />
                <span
                  className={`relative z-10 w-[5px] h-[5px] rounded-full ${
                    milestone.kind === 'Work'
                      ? 'bg-accent'
                      : milestone.kind === 'Build'
                        ? 'bg-primary'
                        : 'bg-foreground/35'
                  }`}
                />
              </span>

              <div className="min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-[12.5px] leading-snug text-foreground/85 group-hover:text-foreground transition-colors timeline-entry-title">
                      {milestone.title}
                    </h3>
                    <p className="mt-0.5 text-[10.5px] text-muted-foreground/55">{milestone.place}</p>
                  </div>
                  <span className={`shrink-0 text-[8.5px] font-mono tracking-[0.08em] uppercase px-1.5 py-0.5 rounded border timeline-entry-desc ${kindStyles[milestone.kind]}`}>
                    {milestone.kind}
                  </span>
                </div>

                {milestone.description && (
                  <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground/65 max-w-lg timeline-entry-desc">
                    {milestone.description}
                  </p>
                )}
              </div>
            </motion.article>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-3 border-t border-hairline shrink-0 flex items-center justify-between gap-4">
        <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground/50">
          <span className="w-1 h-1 rounded-full bg-accent" />
          Currently in the CSRBOX internship
        </span>
        <span className="text-[9px] font-mono text-muted-foreground/30">{milestones.length} entries</span>
      </div>
    </div>
  )
}
