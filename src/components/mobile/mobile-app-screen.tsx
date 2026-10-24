'use client'

import { motion } from 'framer-motion'
import { ChevronLeft } from 'lucide-react'
import { AboutWindow } from '@/components/windows/about-window'
import { CertificationsWindow } from '@/components/windows/certifications-window'
import { EducationWindow } from '@/components/windows/education-window'
import { ExperienceWindow } from '@/components/windows/experience-window'
import { QuickLinksWindow } from '@/components/windows/quick-links-window'
import { SettingsWindow } from '@/components/windows/settings-window'
import { SkillsWindow } from '@/components/windows/skills-window'
import { TimelineWindow } from '@/components/windows/timeline-window'
import { GithubWorkspace } from '@/components/github/github-workspace'
import { AIAssistantWindow } from '@/components/ai/ai-assistant-window'
import { MobileProjectApp } from './mobile-project-app'
import { MobileResumeApp } from './mobile-resume-app'
import { getApp, type MobileAppId } from './mobile-apps'

interface MobileAppScreenProps {
  app: MobileAppId
  onHome: () => void
}

export function MobileAppScreen({ app, onHome }: MobileAppScreenProps) {
  const meta = getApp(app)
  const Icon = meta.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 22, scale: 0.99 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.995 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className="absolute inset-0 flex flex-col bg-window"
    >
      {/* Android app bar */}
      <header className="relative z-10 flex h-14 shrink-0 items-center gap-1 border-b border-hairline bg-window/92 px-2 backdrop-blur-md">
        <button
          onClick={onHome}
          aria-label="Back to home"
          className="flex h-10 w-10 items-center justify-center rounded-full text-foreground/70 transition-colors active:bg-foreground/[0.07]"
        >
          <ChevronLeft className="h-5 w-5" strokeWidth={1.8} />
        </button>
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <Icon className="h-3.5 w-3.5 shrink-0 text-muted-foreground/40" strokeWidth={1.7} />
          <span className="truncate text-[14.5px] font-medium tracking-[-0.01em] text-foreground/88">
            {meta.name}
          </span>
        </div>
        <div className="h-10 w-10" aria-hidden="true" />
      </header>

      {/* App content */}
      <div className="relative min-h-0 flex-1 overflow-hidden bg-window">
        <AppContent app={app} />
      </div>
    </motion.div>
  )
}

function AppContent({ app }: { app: MobileAppId }) {
  switch (app) {
    case 'about':
      return <AboutWindow />
    case 'projects':
      return <MobileProjectApp />
    case 'skills':
      return <SkillsWindow />
    case 'experience':
      return <ExperienceWindow />
    case 'education':
      return <EducationWindow />
    case 'certifications':
      return <CertificationsWindow />
    case 'contact':
      return <QuickLinksWindow />
    case 'resume':
      return <MobileResumeApp />
    case 'github':
      return <GithubWorkspace />
    case 'assistant':
      return <AIAssistantWindow />
    case 'timeline':
      return <TimelineWindow />
    case 'settings':
      return <SettingsWindow />
    default:
      return null
  }
}
