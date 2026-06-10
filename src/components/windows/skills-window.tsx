'use client'

import { motion } from 'framer-motion'
import {
  Cpu,
  Database,
  Brain,
  Code,
  Server,
  Wrench,
  CheckCircle2,
} from 'lucide-react'

interface Skill {
  name: string
  version?: string
}

interface SkillGroup {
  category: string
  icon: any
  skills: Skill[]
}

const skillGroups: SkillGroup[] = [
  {
    category: 'Programming Languages',
    icon: Code,
    skills: [
      { name: 'Python', version: '3.11' },
      { name: 'Java', version: '17' },
      { name: 'C++', version: 'c++17' },
      { name: 'JavaScript', version: 'ES2023' }
    ]
  },
  {
    category: 'Frontend',
    icon: Code,
    skills: [
      { name: 'React', version: '19.0' },
      { name: 'Next.js', version: '16.0' },
      { name: 'Tailwind CSS', version: '4.0' }
    ]
  },
  {
    category: 'Backend',
    icon: Server,
    skills: [
      { name: 'Node.js', version: '22.0' },
      { name: 'FastAPI', version: '0.110' },
      { name: 'Firebase', version: '11.0' }
    ]
  },
  {
    category: 'AI / ML',
    icon: Brain,
    skills: [
      { name: 'TensorFlow', version: '2.18' },
      { name: 'PyTorch', version: '2.5' },
      { name: 'Gemini API', version: 'v1beta' }
    ]
  },
  {
    category: 'Developer Tools',
    icon: Wrench,
    skills: [
      { name: 'Git', version: '2.47' },
      { name: 'GitHub', version: 'Cloud' },
      { name: 'Docker', version: '26.0' },
      { name: 'Vercel', version: 'Production' }
    ]
  }
]

export function SkillsWindow() {
  return (
    <div className="h-full flex flex-col bg-[#0a0a0b] font-sans selection:bg-primary/30">
      {/* Header */}
      <div className="p-5 border-b border-border/50 bg-background/25">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/20 text-primary">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-white tracking-tight">System Modules</h2>
            <p className="text-xs text-muted-foreground">
              Technical stack modules verified & active in environment.
            </p>
          </div>
        </div>
      </div>

      {/* Skills Group Grid */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6 select-none">
        {skillGroups.map((group, gIdx) => (
          <div key={group.category} className="space-y-3">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
              <group.icon className="w-3.5 h-3.5 text-primary/70" />
              {group.category}
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {group.skills.map((skill, idx) => (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (gIdx * 3 + idx) * 0.03, type: 'spring', stiffness: 300, damping: 24 }}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.01] border border-white/5 hover:border-primary/30 hover:bg-white/[0.03] transition-all group"
                >
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span className="text-sm font-bold text-white group-hover:text-primary transition-colors">
                      {skill.name}
                    </span>
                  </div>
                  {skill.version && (
                    <span className="text-[10px] font-mono text-muted-foreground/60 bg-white/5 px-2 py-0.5 rounded-md">
                      v{skill.version}
                    </span>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border/50 bg-secondary/15">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5 font-medium">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Integrity check: PASS
          </span>
          <span className="font-mono text-[10px]">All dependencies synchronized</span>
        </div>
      </div>
    </div>
  )
}
