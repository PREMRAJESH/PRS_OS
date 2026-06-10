'use client'

import { motion } from 'framer-motion'
import { GraduationCap, Calendar, BookOpen, Award } from 'lucide-react'

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
    degree: 'Bachelor of Engineering (BE)',
    period: '2024 – 2027',
    areas: ['Web Applications', 'Artificial Intelligence', 'Software Engineering'],
  },
  {
    institution: 'Government Polytechnic, Dahod',
    degree: 'Diploma in Computer Software Engineering',
    period: '2021 – 2024',
    metric: 'CPI: 8.33',
    areas: ['Web Development', 'Machine Learning', 'Software Engineering Fundamentals'],
  }
]

export function EducationWindow() {
  return (
    <div className="h-full flex flex-col bg-[#0a0a0b] font-sans selection:bg-primary/30">
      {/* Header */}
      <div className="p-6 border-b border-border/50 bg-background/25">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/20 text-primary">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-bold text-white text-base tracking-tight">Academic History</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Verified educational background and core technical tracks
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
        <div className="relative border-l border-white/5 ml-4 pl-6 space-y-8 py-2">
          {educationData.map((edu, idx) => (
            <motion.div
              key={edu.institution}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1, type: 'spring', stiffness: 300, damping: 25 }}
              className="relative group"
            >
              {/* Timeline marker */}
              <div className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full bg-primary border-2 border-[#0a0a0b] group-hover:scale-125 transition-transform duration-200 shadow-[0_0_8px_rgba(56,189,248,0.5)]" />

              <div className="p-5 rounded-2xl bg-white/[0.01] border border-white/5 hover:border-primary/20 hover:bg-white/[0.02] transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.2)]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3.5 mb-4">
                  <div>
                    <h3 className="font-bold text-white text-base group-hover:text-primary transition-colors duration-200">
                      {edu.institution}
                    </h3>
                    <p className="text-sm font-semibold text-primary/80 mt-1 flex items-center gap-2 edu-exp-content">
                      {edu.degree}
                      {edu.metric && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-black">
                          {edu.metric}
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono bg-white/5 px-3 py-1 rounded-lg self-start sm:self-center">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{edu.period}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                    <BookOpen className="w-3.5 h-3.5 text-primary/70" />
                    <span>Relevant Areas of Study</span>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {edu.areas.map((area) => (
                      <span
                        key={area}
                        className="px-3 py-1 rounded-lg text-xs font-medium text-foreground bg-white/[0.03] border border-white/5 group-hover:border-primary/10 transition-colors edu-exp-content"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border/50 bg-secondary/15">
        <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
          <span className="flex items-center gap-1.5 font-bold">
            <Award className="w-4 h-4 text-emerald-400" />
            Accreditation: AICTE / Gujarat Technological University
          </span>
          <span>Verified profile</span>
        </div>
      </div>
    </div>
  )
}
