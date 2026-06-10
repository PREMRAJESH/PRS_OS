'use client'

import { motion } from 'framer-motion'
import { Calendar, Star, GraduationCap, Briefcase, Code, ShieldCheck } from 'lucide-react'

interface Milestone {
  year: string
  title: string
  institution: string
  description?: string
  icon: any
  iconColor: string
  tags?: string[]
}

const milestones: Milestone[] = [
  {
    year: '2026',
    title: 'Built Nimbus X',
    institution: 'Cloud Storage Platform',
    description: 'Developed Nimbus X featuring intelligent file organization and modern web architecture.',
    icon: Code,
    iconColor: 'bg-primary/20 text-primary border-primary/30',
    tags: ['project', 'nimbusx']
  },
  {
    year: '2026',
    title: 'Built CodeViz',
    institution: 'Code & Algorithm Visualization Platform',
    description: 'Designed interactive code and algorithm execution tracing playground for students.',
    icon: Code,
    iconColor: 'bg-primary/20 text-primary border-primary/30',
    tags: ['project', 'codeviz']
  },
  {
    year: '2025',
    title: 'Built NeuroScan AI',
    institution: 'Brain Tumor Detection System',
    description: 'Developed model inference tool with TensorFlow & ONNX achieving ~90% model accuracy.',
    icon: Code,
    iconColor: 'bg-primary/20 text-primary border-primary/30',
    tags: ['project', 'neuroscan']
  },
  {
    year: '2025',
    title: 'Built StudyFlow',
    institution: 'AI-Powered Study Planner',
    description: 'Developed adaptive schedule builder integrating Google Gemini API structured outputs.',
    icon: Code,
    iconColor: 'bg-primary/20 text-primary border-primary/30',
    tags: ['project', 'studyflow']
  },
  {
    year: '2024',
    title: 'Started Bachelor of Engineering',
    institution: 'Government Engineering College, Dahod',
    description: 'Admitted to the Bachelor of Engineering (BE) program in Computer Engineering.',
    icon: GraduationCap,
    iconColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    tags: ['education', 'gec-dahod']
  },
  {
    year: '2024',
    title: 'Completed Diploma in Computer Software Engineering',
    institution: 'Government Polytechnic, Dahod',
    description: 'Graduated with a CPI of 8.33.',
    icon: GraduationCap,
    iconColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    tags: ['education', '8.33 CPI']
  },
  {
    year: '2022',
    title: 'Completed Web Development Internship',
    institution: 'BrainyBeam Technologies',
    description: 'Finished professional web technologies and frontend development internship.',
    icon: Briefcase,
    iconColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    tags: ['internship', 'brainybeam']
  },
  {
    year: '2021',
    title: 'Started Diploma in Computer Software Engineering',
    institution: 'Government Polytechnic, Dahod',
    description: 'Began software engineering diploma studies.',
    icon: GraduationCap,
    iconColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    tags: ['education', 'gp-dahod']
  }
]

export function TimelineWindow() {
  return (
    <div className="h-full flex flex-col bg-[#0a0a0b] font-sans selection:bg-primary/30">
      {/* Header */}
      <div className="p-6 border-b border-border/50 bg-background/25">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/20 text-primary">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-bold text-white text-base tracking-tight">Milestone History</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Verified record of academic steps, internship experience, and key projects
            </p>
          </div>
        </div>
      </div>

      {/* Timeline List */}
      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar select-none">
        <div className="relative border-l border-white/5 ml-5 pl-6 space-y-6 py-2">
          {milestones.map((milestone, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: Math.min(index * 0.05, 0.4), type: 'spring', stiffness: 300, damping: 25 }}
              className="relative group"
            >
              {/* Timeline marker node */}
              <div className="absolute -left-[35px] top-1 z-10 w-4.5 h-4.5 rounded-full flex items-center justify-center bg-[#0a0a0b] border-2 border-white/10 group-hover:border-primary transition-colors duration-200">
                <milestone.icon className="w-2.5 h-2.5 text-muted-foreground group-hover:text-primary" />
              </div>

              {/* Card Container */}
              <div className="p-5 rounded-2xl bg-white/[0.01] border border-white/5 hover:border-primary/20 hover:bg-white/[0.02] transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.15)]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-white/5 pb-3 mb-3.5">
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-primary transition-colors timeline-entry-title">
                      {milestone.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{milestone.institution}</p>
                  </div>
                  <span className="text-[10px] font-bold text-primary font-mono bg-primary/10 px-2 py-0.5 rounded-md self-start sm:self-center">
                    {milestone.year}
                  </span>
                </div>

                {milestone.description && (
                  <p className="text-xs text-muted-foreground/80 leading-relaxed timeline-entry-desc">
                    {milestone.description}
                  </p>
                )}

                {milestone.tags && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {milestone.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[9px] font-mono font-medium text-foreground bg-white/5 px-2 py-0.5 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border/50 bg-secondary/15">
        <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
          <span className="flex items-center gap-1.5 font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Verified Student Achievements
          </span>
          <span>{milestones.length} Milestones</span>
        </div>
      </div>
    </div>
  )
}
