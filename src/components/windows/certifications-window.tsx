'use client'

import { motion } from 'framer-motion'
import { ArrowUpRight, Check } from 'lucide-react'

interface CoreCertificate {
  title: string
  issuer: string
  date?: string
  description: string
  pdf?: string
}

const coreCertificates: CoreCertificate[] = [
  {
    title: '100xDevs Cohort 3',
    issuer: '100xDevs',
    date: 'Aug 2024',
    description:
      'Web development, DevOps and blockchain cohort covering application architecture, deployment and on-chain fundamentals.',
    pdf: '/Cohort.pdf',
  },
  {
    title: 'Diploma completion',
    issuer: 'Government Polytechnic, Dahod',
    description:
      'Completed the Computer Software Engineering diploma with a CPI of 8.33.',
  },
  {
    title: 'AI Automation & Intelligent Solutions',
    issuer: 'CSRBOX × IBM SkillsBuild × AICTE',
    date: '2026 — present',
    description:
      'AICTE certified programme covering agentic AI, workflow automation, the IBM SkillsBuild path and supervised projects.',
  },
  {
    title: 'Web development internship',
    issuer: 'BrainyBeam Technologies',
    date: 'Sep 2022',
    description:
      'Front-end development, website delivery and practical exposure to production web technologies.',
  },
]

export function CertificationsWindow() {
  return (
    <div className="h-full flex flex-col font-sans">
      {/* Header */}
      <div className="px-6 py-5 border-b border-hairline shrink-0">
        <p className="text-eyebrow">Certifications</p>
        <div className="mt-1.5 flex items-end justify-between gap-4">
          <h2 className="font-display text-[2rem] leading-none tracking-[-0.02em]">
            Credentials
          </h2>
          <span className="hidden sm:block text-[9.5px] font-mono text-muted-foreground/40 pb-0.5">
            {coreCertificates.length} records
          </span>
        </div>
        <p className="mt-2 text-[11.5px] text-muted-foreground/60">
          Academic records and programmes completed alongside them.
        </p>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {coreCertificates.map((cert, index) => (
            <motion.article
              key={cert.title}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="group p-4 rounded-lg border border-hairline bg-foreground/[0.015] hover:bg-foreground/[0.03] hover:border-hairline-strong transition-colors flex flex-col"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-[12.5px] leading-snug text-foreground/90">{cert.title}</h3>
                {cert.date && (
                  <span className="shrink-0 text-[8.5px] font-mono text-muted-foreground/40 pt-0.5">
                    {cert.date}
                  </span>
                )}
              </div>

              <p className="mt-1 text-[10px] font-mono text-muted-foreground/55">{cert.issuer}</p>

              <p className="mt-2.5 text-[11px] leading-relaxed text-muted-foreground/65 flex-1">
                {cert.description}
              </p>

              <div className="mt-3.5 pt-2.5 border-t border-hairline flex items-center justify-between gap-3">
                <span className="flex items-center gap-1.5 text-[9px] font-mono tracking-[0.06em] uppercase text-accent/90">
                  <Check className="w-2.5 h-2.5" strokeWidth={2.5} />
                  Verified
                </span>

                {cert.pdf ? (
                  <a
                    href={cert.pdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/link inline-flex items-center gap-1 text-[10px] text-muted-foreground/60 hover:text-foreground transition-colors"
                  >
                    View certificate
                    <ArrowUpRight className="w-3 h-3 transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
                  </a>
                ) : (
                  <span className="text-[9px] font-mono text-muted-foreground/25">On record</span>
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
          Accreditation: AICTE / GTU
        </span>
        <span className="text-[9px] font-mono text-muted-foreground/30">Updated 2026</span>
      </div>
    </div>
  )
}
