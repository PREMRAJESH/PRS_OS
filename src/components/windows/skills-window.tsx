'use client'

import { motion } from 'framer-motion'

interface Skill {
  name: string
  version?: string
}

interface SkillGroup {
  category: string
  note: string
  skills: Skill[]
}

const skillGroups: SkillGroup[] = [
  {
    category: 'Languages',
    note: 'Day to day',
    skills: [
      { name: 'Python', version: '3.11' },
      { name: 'TypeScript', version: 'ES2023' },
      { name: 'Java', version: '17' },
      { name: 'C++', version: 'C++17' },
    ],
  },
  {
    category: 'Frontend',
    note: 'Interfaces',
    skills: [
      { name: 'React', version: '19' },
      { name: 'Next.js', version: '16' },
      { name: 'Tailwind CSS', version: '4' },
      { name: 'Framer Motion', version: '12' },
    ],
  },
  {
    category: 'Backend',
    note: 'Services & data',
    skills: [
      { name: 'Node.js', version: '22' },
      { name: 'FastAPI', version: '0.110' },
      { name: 'Firebase', version: '11' },
      { name: 'Supabase' },
    ],
  },
  {
    category: 'AI / ML',
    note: 'Models & inference',
    skills: [
      { name: 'TensorFlow', version: '2.18' },
      { name: 'PyTorch', version: '2.5' },
      { name: 'ONNX Runtime' },
      { name: 'Gemini API' },
    ],
  },
  {
    category: 'Tools',
    note: 'Shipping',
    skills: [
      { name: 'Git', version: '2.47' },
      { name: 'Docker', version: '26' },
      { name: 'Vercel' },
      { name: 'VS Code' },
    ],
  },
]

export function SkillsWindow() {
  return (
    <div className="h-full flex flex-col font-sans">
      {/* Header */}
      <div className="px-6 py-5 border-b border-hairline shrink-0">
        <p className="text-eyebrow">Skills & stack</p>
        <div className="mt-1.5 flex items-end justify-between gap-4">
          <h2 className="font-display text-[2rem] leading-none tracking-[-0.02em]">
            What I build with
          </h2>
          <span className="hidden sm:block text-[9.5px] font-mono text-muted-foreground/40 pb-0.5">
            {skillGroups.reduce((n, g) => n + g.skills.length, 0)} tools
          </span>
        </div>
        <p className="mt-2 text-[11.5px] text-muted-foreground/60 max-w-md">
          A working set, not a wishlist. Everything here has shipped in a project or is in
          active use.
        </p>
      </div>

      {/* Groups */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-2 select-none">
        {skillGroups.map((group, gIdx) => (
          <motion.section
            key={group.category}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: gIdx * 0.045, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="grid grid-cols-1 sm:grid-cols-[124px_1fr] gap-x-6 gap-y-2 py-4 border-b border-hairline last:border-b-0"
          >
            <div className="sm:pt-1">
              <h3 className="text-[12px] text-foreground/85 leading-none">{group.category}</h3>
              <p className="mt-1.5 text-[9px] font-mono tracking-[0.08em] uppercase text-muted-foreground/35">
                {group.note}
              </p>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {group.skills.map(skill => (
                <span
                  key={skill.name}
                  className="inline-flex items-baseline gap-1.5 px-2 py-1 rounded border border-hairline bg-foreground/[0.02] text-[11px] text-foreground/75 hover:border-hairline-strong hover:bg-foreground/[0.04] transition-colors cursor-default"
                >
                  {skill.name}
                  {skill.version && (
                    <span className="text-[8.5px] font-mono text-muted-foreground/40">
                      {skill.version}
                    </span>
                  )}
                </span>
              ))}
            </div>
          </motion.section>
        ))}
      </div>

      {/* Footer */}
      <div className="px-6 py-3 border-t border-hairline shrink-0 flex items-center justify-between gap-4">
        <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground/50">
          <span className="w-1 h-1 rounded-full bg-accent" />
          Currently learning agentic workflows and evaluation
        </span>
        <span className="hidden sm:block text-[9px] font-mono text-muted-foreground/30">
          Updated 2026
        </span>
      </div>
    </div>
  )
}
