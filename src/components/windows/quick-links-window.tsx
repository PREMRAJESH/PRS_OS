'use client'

import { motion } from 'framer-motion'
import { 
  Github, 
  Linkedin, 
  Mail, 
  FileText, 
  Code2, 
  ExternalLink,
  Globe,
  ArrowUpRight
} from 'lucide-react'
import { useOSStore } from '@/store/os-store'

interface LinkCard {
  title: string
  description: string
  icon: any
  href: string
  color: string
  actionLabel?: string
  isAppAction?: boolean
  appType?: 'resume'
}

export function QuickLinksWindow() {
  const { openWindow } = useOSStore()

  const links: LinkCard[] = [
    {
      title: 'GitHub Profile',
      description: 'Explore the full list of open source systems, AI applications, and codebases.',
      icon: Github,
      href: 'https://github.com/PREMRAJESH',
      color: 'hover:border-white/30 hover:bg-white/[0.04]',
      actionLabel: 'github.com/PREMRAJESH'
    },
    {
      title: 'LinkedIn Network',
      description: 'Connect with me for professional updates, collaborations, and internship opportunities.',
      icon: Linkedin,
      href: 'https://www.linkedin.com/in/gecdhd-comp-prem-sargara/',
      color: 'hover:border-blue-500/30 hover:bg-blue-500/[0.03]',
      actionLabel: 'linkedin.com/in/gecdhd-comp-prem-sargara'
    },
    {
      title: 'Direct Email',
      description: 'Inquire about roles, discuss projects, or reach out directly for technical questions.',
      icon: Mail,
      href: 'mailto:sargarapremrajesh@gmail.com',
      color: 'hover:border-emerald-500/30 hover:bg-emerald-500/[0.03]',
      actionLabel: 'sargarapremrajesh@gmail.com'
    },
    {
      title: 'LeetCode Algorithms',
      description: 'Check out solved data structures, sorting problems, and monthly challenge badges.',
      icon: Code2,
      href: 'https://leetcode.com/u/Sargara_Prem/',
      color: 'hover:border-yellow-500/30 hover:bg-yellow-500/[0.03]',
      actionLabel: 'leetcode.com/u/Sargara_Prem'
    },
    {
      title: 'Interactive Resume',
      description: 'View the technical resume directly inside the PRS-OS environment.',
      icon: FileText,
      href: '#',
      color: 'hover:border-amber-500/30 hover:bg-amber-500/[0.03]',
      actionLabel: 'Launch Resume App',
      isAppAction: true,
      appType: 'resume'
    },
    {
      title: 'Portfolio Source Code',
      description: 'Inspect the Next.js React 19 architecture, Zustand kernel, and floating window manager.',
      icon: Code2,
      href: 'https://github.com/PREMRAJESH/prs-os-portfolio',
      color: 'hover:border-purple-500/30 hover:bg-purple-500/[0.03]',
      actionLabel: 'Inspect Code'
    },
    {
      title: 'Live Deployments',
      description: 'Explore production links to NeuroScan, StudyFlow, NimbusX, and CodeViz.',
      icon: Globe,
      href: 'https://studyflow-aii.vercel.app/',
      color: 'hover:border-pink-500/30 hover:bg-pink-500/[0.03]',
      actionLabel: 'Explore Live Apps'
    }
  ]

  const handleCardClick = (card: LinkCard) => {
    if (card.isAppAction && card.appType === 'resume') {
      openWindow('resume')
    } else {
      window.open(card.href, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <div className="h-full bg-[#0a0a0b] overflow-y-auto custom-scrollbar p-6 select-none selection:bg-primary/20">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            ⚡ Quick Links
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Access social coordinates, check deployment outputs, or view system source codes.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {links.map((link, idx) => (
            <motion.div
              key={link.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05, type: 'spring', stiffness: 300, damping: 24 }}
              onClick={() => handleCardClick(link)}
              className={`p-4 rounded-xl border border-white/5 bg-white/[0.01] transition-all duration-300 cursor-pointer flex flex-col justify-between group ${link.color}`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-lg bg-white/5 text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-colors">
                    <link.icon className="w-4 h-4" />
                  </div>
                  {link.isAppAction ? (
                    <span className="text-[9px] font-bold uppercase tracking-wider text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full">OS App</span>
                  ) : (
                    <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground/30 group-hover:text-muted-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  )}
                </div>
                
                <h2 className="text-sm font-bold text-white tracking-tight group-hover:text-primary transition-colors">
                  {link.title}
                </h2>
                
                <p className="text-xs text-muted-foreground/70 leading-relaxed">
                  {link.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/[0.02] flex items-center justify-between text-[10px] font-mono text-muted-foreground/45 group-hover:text-muted-foreground/80 transition-colors">
                <span>{link.actionLabel}</span>
                {!link.isAppAction && <ExternalLink className="w-3 h-3" />}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
