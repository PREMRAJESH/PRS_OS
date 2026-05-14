'use client'

import { AnimatePresence } from 'framer-motion'
import { useOSStore } from '@/store/os-store'
import { OSWindow } from './os-window'
import { ProjectExplorer } from '../windows/project-explorer'
import { TerminalWindow } from '../terminal/terminal-window'
import { ResumeViewer } from '../resume/resume-viewer'
import { SkillsWindow } from '../windows/skills-window'
import { TimelineWindow } from '../windows/timeline-window'
import { SettingsWindow } from '../windows/settings-window'
import { GithubWorkspace } from '../github/github-workspace'
import { AIAssistantWindow } from '../ai/ai-assistant-window'
import { AboutWindow } from '../windows/about-window'
import { RuntimeBrowser } from '../runtime/runtime-browser'

export function WindowManager() {
  const { windows } = useOSStore()

  return (
    <AnimatePresence mode="popLayout">
      {windows.map((window) => (
        <OSWindow key={window.id} window={window}>
          <WindowContent type={window.type} />
        </OSWindow>
      ))}
    </AnimatePresence>
  )
}

function WindowContent({ type }: { type: string }) {
  switch (type) {
    case 'projects':
      return <ProjectExplorer />
    case 'github':
      return <GithubWorkspace />
    case 'terminal':
      return <TerminalWindow />
    case 'resume':
      return <ResumeViewer />
    case 'skills':
      return <SkillsWindow />
    case 'timeline':
      return <TimelineWindow />
    case 'settings':
      return <SettingsWindow />
    case 'ai-assistant':
      return <AIAssistantWindow />
    case 'about':
      return <AboutWindow />
    case 'runtime':
      return <RuntimeBrowser />
    default:
      return (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          Unknown window type
        </div>
      )
  }
}
