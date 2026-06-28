'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Briefcase, Calendar, CheckCircle, Image as ImageIcon, ZoomIn, X, Award, ExternalLink } from 'lucide-react'

export function ExperienceWindow() {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)

  const csrboxResponsibilities = [
    'AI Automation & Intelligent Solutions',
    'IBM SkillsBuild Learning Path',
    'Agentic AI & Workflow Automation',
    'Hands-on AI Projects',
    'Industry Mentorship',
    'AICTE Certified Program',
  ]

  const responsibilities = [
    'Front-End Development',
    'Website Development',
    'Web Technologies',
    'Practical Industry Exposure',
  ]

  return (
    <div className="h-full flex flex-col bg-[#0a0a0b] font-sans selection:bg-primary/30 relative">
      {/* Header */}
      <div className="p-6 border-b border-border/50 bg-background/25">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/20 text-primary">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-bold text-white text-base tracking-tight">Professional Experience</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Verified industry experience and practical internships
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
        {/* CSRBOX × IBM SkillsBuild × AICTE Internship */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="p-6 rounded-2xl bg-white/[0.01] border border-white/5 hover:border-primary/20 hover:bg-white/[0.02] transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.2)] flex flex-col md:flex-row gap-6"
        >
          {/* Left panel: Info */}
          <div className="flex-1 space-y-5">
            <div className="border-b border-white/5 pb-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-bold text-white text-lg">
                  CSRBOX × IBM SkillsBuild × AICTE
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono bg-white/5 px-3 py-1 rounded-lg">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>June 2026 – Present</span>
                </div>
              </div>
              <p className="text-sm font-semibold text-primary/80 mt-1 edu-exp-content">
                AI Automation & Intelligent Solutions Intern
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                Responsibilities & Exposure
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {csrboxResponsibilities.map((resp) => (
                  <li
                    key={resp}
                    className="flex items-center gap-2 p-2.5 rounded-lg bg-white/[0.02] border border-white/5 text-xs text-foreground/90 font-medium edu-exp-content"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right panel: Certificate Thumbnail */}
          <div className="w-full md:w-56 shrink-0 flex flex-col justify-center items-center md:items-end">
            <div className="space-y-2 w-full max-w-[200px]">
              <span className="block text-[10px] font-black uppercase tracking-wider text-muted-foreground/60 text-center md:text-left">
                Active Program
              </span>
              <a
                href="/csrbox-offerletter.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative w-full aspect-[4/3] rounded-xl overflow-hidden border border-white/10 hover:border-primary/40 bg-[#121318] shadow-lg flex items-center justify-center transition-all duration-300 no-underline"
              >
                <div className="w-full h-full flex items-center justify-center bg-[#121318]">
                  <ImageIcon className="w-8 h-8 text-primary/60 group-hover:scale-110 transition-transform" />
                </div>

                <div className="absolute inset-0 flex flex-col items-center justify-center p-3 text-center bg-black/40 group-hover:bg-black/20 transition-all duration-300">
                  <span className="text-[10px] font-bold text-white tracking-wider flex items-center gap-1">
                    View Offer Letter <ExternalLink className="w-3 h-3 text-primary" />
                  </span>
                </div>
              </a>
            </div>
          </div>
        </motion.div>

        {/* BrainyBeam Technologies Internship */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="p-6 rounded-2xl bg-white/[0.01] border border-white/5 hover:border-primary/20 hover:bg-white/[0.02] transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.2)] flex flex-col md:flex-row gap-6"
        >
          {/* Left panel: Info */}
          <div className="flex-1 space-y-5">
            <div className="border-b border-white/5 pb-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-bold text-white text-lg">
                  BrainyBeam Technologies Pvt. Ltd.
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono bg-white/5 px-3 py-1 rounded-lg">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>September 2022</span>
                </div>
              </div>
              <p className="text-sm font-semibold text-primary/80 mt-1 edu-exp-content">
                Web Development Intern
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                Responsibilities & Exposure
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {responsibilities.map((resp) => (
                  <li
                    key={resp}
                    className="flex items-center gap-2 p-2.5 rounded-lg bg-white/[0.02] border border-white/5 text-xs text-foreground/90 font-medium edu-exp-content"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right panel: Certificate Thumbnail */}
          <div className="w-full md:w-56 shrink-0 flex flex-col justify-center items-center md:items-end">
            <div className="space-y-2 w-full max-w-[200px]">
              <span className="block text-[10px] font-black uppercase tracking-wider text-muted-foreground/60 text-center md:text-left">
                Complete Internship
              </span>
              <button
                onClick={() => setIsLightboxOpen(true)}
                className="group relative w-full aspect-[4/3] rounded-xl overflow-hidden border border-white/10 hover:border-primary/40 bg-[#121318] shadow-lg flex items-center justify-center transition-all duration-300"
              >
                {/* Background Offer Letter Image */}
                <img
                  src="/offerletter.jpg"
                  alt="BrainyBeam Internship Offer Letter"
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-85 transition-opacity duration-300"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
                
                {/* Fallback & Overlay info */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-3 text-center bg-black/40 group-hover:bg-black/20 transition-all duration-300">
                  <ImageIcon className="w-6 h-6 text-primary group-hover:scale-110 transition-transform mb-1" />
                  <span className="text-[10px] font-bold text-white tracking-wider flex items-center gap-1">
                    View Offer Letter <ZoomIn className="w-3 h-3 text-primary" />
                  </span>
                </div>
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border/50 bg-secondary/15">
        <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
          <span className="flex items-center gap-1.5 font-bold">
            <Award className="w-4 h-4 text-emerald-400" />
            CSRBOX & BrainyBeam Certified
          </span>
          <span>Verified profile</span>
        </div>
      </div>

      {/* Full screen Lightbox for Certificate */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-6"
            onClick={() => setIsLightboxOpen(false)}
          >
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative max-w-4xl max-h-[85vh] overflow-hidden rounded-2xl border border-white/10 bg-[#121318] shadow-2xl flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src="/offerletter.jpg"
                alt="BrainyBeam Internship Offer Letter"
                className="w-full h-full object-contain max-h-[80vh]"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
