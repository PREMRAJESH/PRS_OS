'use client'

import { motion } from 'framer-motion'
import { Award, CheckCircle, ExternalLink } from 'lucide-react'

interface CoreCertificate {
  title: string
  issuer: string
  date?: string
  description: string
  pdf?: string
}

const coreCertificates: CoreCertificate[] = [
  {
    title: '100xDevs Cohort 3 Certificate',
    issuer: '100xDevs',
    date: '25/08/2024',
    description: 'Web Development + DevOps + Blockchain Cohort — comprehensive knowledge of web application development, system deployment, and blockchain-based technologies.',
    pdf: '/Cohort.pdf'
  },
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

export function CertificationsWindow() {
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
                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-semibold font-mono">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Credential verified</span>
                  </div>
                  {cert.pdf && (
                    <a
                      href={cert.pdf}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-[10px] text-primary font-semibold font-mono hover:text-primary/80 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>View Certificate</span>
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border/50 bg-secondary/15">
        <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
          <span>{coreCertificates.length} Core Certificates</span>
          <span>Security status: SECURE</span>
        </div>
      </div>
    </div>
  )
}
