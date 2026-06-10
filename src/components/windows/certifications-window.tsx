'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Award, ChevronDown, ChevronUp, CheckCircle, ExternalLink, Bookmark } from 'lucide-react'

interface CoreCertificate {
  title: string
  issuer: string
  date?: string
  description: string
}

interface CertGroup {
  category: string
  items: string[]
}

const coreCertificates: CoreCertificate[] = [
  {
    title: 'Diploma Completion Certificate',
    issuer: 'Government Polytechnic, Dahod',
    description: 'Completed Computer Software Engineering Diploma program (CPI: 8.33).'
  },
  {
    title: 'Web Development Internship Certificate',
    issuer: 'BrainyBeam Technologies Pvt. Ltd.',
    date: 'September 2022',
    description: 'Completed internship program focusing on Front-End Development, Website Development, and Web Technologies.'
  }
]

const additionalCertGroups: CertGroup[] = [
  {
    category: 'Web Development Certifications',
    items: [
      'Responsive Web Design Certification — freeCodeCamp',
      'Front-End Developer Professional Certificate — Meta (Coursera)',
      'Advanced CSS and Sass: Flexbox, Grid, Animations — Udemy'
    ]
  },
  {
    category: 'AI Certifications',
    items: [
      'Generative AI Fundamentals — Google Cloud',
      'AI Product Manager Specialization — Udacity',
      'Prompt Engineering for ChatGPT — Vanderbilt University (Coursera)'
    ]
  },
  {
    category: 'Machine Learning Certifications',
    items: [
      'Supervised Machine Learning: Regression and Classification — DeepLearning.AI',
      'Machine Learning Specialization — Stanford University (Coursera)',
      'Neural Networks and Deep Learning — DeepLearning.AI'
    ]
  },
  {
    category: 'Cloud Certifications',
    items: [
      'Google Cloud Certified Associate Cloud Engineer — Coursera Path',
      'Introduction to Cloud Computing — IBM (Coursera)',
      'Firebase in Depth: Web App Deployment & Storage — Udemy'
    ]
  }
]

export function CertificationsWindow() {
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({})

  const toggleGroup = (category: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [category]: !prev[category]
    }))
  }

  return (
    <div className="h-full flex flex-col bg-[#0a0a0b] font-sans selection:bg-primary/30">
      {/* Header */}
      <div className="p-6 border-b border-border/50 bg-background/25">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/20 text-primary">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-bold text-white text-base tracking-tight">Credentials & Achievements</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Verified certifications, diplomas, and technical specializations
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
        
        {/* Core Certificates Grid */}
        <div className="space-y-3.5">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
            <Award className="w-3.5 h-3.5 text-primary/80" />
            Core Academic & Industry Certificates
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {coreCertificates.map((cert, index) => (
              <motion.div
                key={cert.title}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, type: 'spring', stiffness: 300, damping: 25 }}
                className="p-5 rounded-2xl bg-white/[0.01] border border-white/5 hover:border-primary/20 hover:bg-white/[0.02] transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.15)] flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="font-bold text-white text-sm leading-snug">
                      {cert.title}
                    </h4>
                    {cert.date && (
                      <span className="text-[9px] font-mono text-muted-foreground/60 bg-white/5 px-2 py-0.5 rounded">
                        {cert.date}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-primary/80 font-semibold">{cert.issuer}</p>
                  <p className="text-xs text-muted-foreground/85 leading-relaxed">
                    {cert.description}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-1.5 text-[10px] text-emerald-400 font-semibold font-mono">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Credential verified</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Additional Online Certificates (Expandable List) */}
        <div className="space-y-3.5 pt-2">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
            <Bookmark className="w-3.5 h-3.5 text-primary/80" />
            Additional Online Certificates
          </h3>

          <div className="space-y-3">
            {additionalCertGroups.map((group, index) => {
              const isExpanded = !!expandedGroups[group.category]
              return (
                <div
                  key={group.category}
                  className="rounded-xl border border-white/5 bg-white/[0.005] hover:bg-white/[0.01] transition-all duration-300"
                >
                  <button
                    onClick={() => toggleGroup(group.category)}
                    className="w-full flex items-center justify-between p-4 text-left font-semibold text-white/95 text-xs hover:text-primary transition-colors"
                  >
                    <span>{group.category}</span>
                    <div className="p-1 rounded-lg hover:bg-white/5 transition-colors text-muted-foreground">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 border-t border-white/5 pt-3 space-y-2.5">
                          {group.items.map((item, itemIdx) => (
                            <div
                              key={itemIdx}
                              className="flex items-start gap-2.5 p-2 rounded-lg bg-white/[0.01] border border-white/[0.02] text-xs text-muted-foreground"
                            >
                              <div className="w-1 h-1 rounded-full bg-primary mt-1.5 shrink-0" />
                              <span className="leading-relaxed">{item}</span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>
        </div>

      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border/50 bg-secondary/15">
        <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
          <span>{coreCertificates.length} Core • {additionalCertGroups.length} Categories</span>
          <span>Security status: SECURE</span>
        </div>
      </div>
    </div>
  )
}
