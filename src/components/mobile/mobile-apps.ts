import {
  Award,
  Briefcase,
  Code2,
  FileText,
  FolderOpen,
  Github,
  GraduationCap,
  History,
  Mail,
  Settings,
  Sparkles,
  User,
  type LucideIcon,
} from 'lucide-react'

export type MobileAppId =
  | 'about'
  | 'projects'
  | 'skills'
  | 'experience'
  | 'education'
  | 'certifications'
  | 'contact'
  | 'resume'
  | 'github'
  | 'assistant'
  | 'timeline'
  | 'settings'

export interface MobileApp {
  id: MobileAppId
  name: string
  /** Short label used under the icon on the home screen. */
  short: string
  description: string
  icon: LucideIcon
  /** Tile treatment — one accent per app, never a rainbow. */
  tone: 'ember' | 'sage' | 'bone' | 'graphite'
}

export const MOBILE_APPS: MobileApp[] = [
  {
    id: 'about',
    name: 'About',
    short: 'About',
    description: 'The person behind the work',
    icon: User,
    tone: 'ember',
  },
  {
    id: 'projects',
    name: 'Projects',
    short: 'Projects',
    description: 'Selected work and case studies',
    icon: FolderOpen,
    tone: 'sage',
  },
  {
    id: 'skills',
    name: 'Skills',
    short: 'Skills',
    description: 'Languages, frameworks and tools',
    icon: Code2,
    tone: 'bone',
  },
  {
    id: 'experience',
    name: 'Experience',
    short: 'Experience',
    description: 'Internships and shipped work',
    icon: Briefcase,
    tone: 'graphite',
  },
  {
    id: 'education',
    name: 'Education',
    short: 'Education',
    description: 'Programmes and coursework',
    icon: GraduationCap,
    tone: 'ember',
  },
  {
    id: 'certifications',
    name: 'Certifications',
    short: 'Credentials',
    description: 'Verified programmes and records',
    icon: Award,
    tone: 'sage',
  },
  {
    id: 'contact',
    name: 'Contact',
    short: 'Contact',
    description: 'Say hello, or send a note',
    icon: Mail,
    tone: 'bone',
  },
  {
    id: 'resume',
    name: 'Résumé',
    short: 'Résumé',
    description: 'One-page background and PDF',
    icon: FileText,
    tone: 'graphite',
  },
  {
    id: 'github',
    name: 'GitHub',
    short: 'GitHub',
    description: 'Repositories and recent commits',
    icon: Github,
    tone: 'ember',
  },
  {
    id: 'assistant',
    name: 'Assistant',
    short: 'Assistant',
    description: 'Ask about projects or the stack',
    icon: Sparkles,
    tone: 'sage',
  },
  {
    id: 'timeline',
    name: 'Timeline',
    short: 'Timeline',
    description: 'Studies, internships and projects',
    icon: History,
    tone: 'bone',
  },
  {
    id: 'settings',
    name: 'Settings',
    short: 'Settings',
    description: 'Palette and workspace details',
    icon: Settings,
    tone: 'graphite',
  },
]

/** Apps shown on the first home screen (2 rows of four). */
export const HOME_APPS: MobileAppId[] = [
  'about',
  'projects',
  'skills',
  'experience',
  'education',
  'contact',
  'assistant',
  'timeline',
]

/** Always-visible dock. */
export const DOCK_APPS: MobileAppId[] = ['projects', 'assistant', 'contact', 'settings']

export const APP_TONES: Record<MobileApp['tone'], { tile: string; icon: string }> = {
  ember: {
    tile: 'bg-primary/[0.13] border-primary/25 android-tile',
    icon: 'text-primary',
  },
  sage: {
    tile: 'bg-accent/[0.12] border-accent/25 android-tile',
    icon: 'text-accent',
  },
  bone: {
    tile: 'bg-foreground/[0.07] border-hairline-strong android-tile',
    icon: 'text-foreground/80',
  },
  graphite: {
    tile: 'bg-foreground/[0.035] border-hairline android-tile',
    icon: 'text-muted-foreground',
  },
}

export function getApp(id: MobileAppId): MobileApp {
  return MOBILE_APPS.find((app) => app.id === id) ?? MOBILE_APPS[0]
}

/** Map desktop window types onto their mobile app equivalents. */
export const WINDOW_TO_APP: Partial<Record<string, MobileAppId>> = {
  about: 'about',
  projects: 'projects',
  skills: 'skills',
  experience: 'experience',
  education: 'education',
  certifications: 'certifications',
  'quick-links': 'contact',
  resume: 'resume',
  github: 'github',
  'ai-assistant': 'assistant',
  timeline: 'timeline',
  settings: 'settings',
  terminal: 'timeline',
  runtime: 'projects',
}
