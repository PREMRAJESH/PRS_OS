import type { WindowType } from '@/store/os-store'

/* ─── Filesystem ─────────────────────────────────────── */

export interface FsNode {
  type: 'file' | 'dir'
  name: string
  children?: Record<string, FsNode>
  content?: string
  size?: string
  modified?: string
}

const mdFiles = (pName: string) => ({
  'Overview.md': { type: 'file' as const, name: 'Overview.md', size: '1.2K', modified: 'today', content: `# ${pName} - Overview\n` },
  'Problem.md': { type: 'file' as const, name: 'Problem.md', size: '950B', modified: 'today', content: `# ${pName} - Problem Statement\n` },
  'Architecture.md': { type: 'file' as const, name: 'Architecture.md', size: '1.5K', modified: 'today', content: `# ${pName} - System Architecture\n` },
  'TechStack.md': { type: 'file' as const, name: 'TechStack.md', size: '800B', modified: 'today', content: `# ${pName} - Technology Stack\n` },
  'Results.md': { type: 'file' as const, name: 'Results.md', size: '1.1K', modified: 'today', content: `# ${pName} - Results & Learnings\n` },
  'Links.md': { type: 'file' as const, name: 'Links.md', size: '400B', modified: 'today', content: `# ${pName} - Resource Links\n` },
})

export const filesystem: Record<string, FsNode> = {
  'projects': {
    type: 'dir', name: 'projects',
    children: {
      'neuroscan': { type: 'dir', name: 'neuroscan', children: mdFiles('NeuroScan AI') },
      'studyflow': { type: 'dir', name: 'studyflow', children: mdFiles('StudyFlow') },
      'nimbusx': { type: 'dir', name: 'nimbusx', children: mdFiles('Nimbus X') },
      'codeviz': { type: 'dir', name: 'codeviz', children: mdFiles('CodeViz') },
    },
  },
  'documents': { type: 'dir', name: 'documents', children: {
    'resume_prem_rajesh.pdf': { type: 'file', name: 'resume_prem_rajesh.pdf', size: '210K', modified: 'yesterday' },
  }},
  '.bashrc': { type: 'file', name: '.bashrc', size: '64B', modified: '2 weeks ago', content: '# PRS-OS Shell Config\nexport PS1="prem@prs-os:~$ "\nexport EDITOR=nano\n' },
}

/* ─── Navigating the FS ──────────────────────────────── */

export function resolvePath(cwd: string, target: string): string {
  if (target === '/') return '~'
  if (target === '~') return '~'

  let parts = cwd === '~' ? [] : cwd.replace('~/', '').split('/').filter(Boolean)

  for (const seg of target.split('/')) {
    if (seg === '..') parts.pop()
    else if (seg !== '.' && seg !== '') parts.push(seg)
  }

  return parts.length === 0 ? '~' : `~/${parts.join('/')}`
}

export function getNode(path: string): FsNode | null {
  if (path === '~' || path === '') return { type: 'dir', name: '~', children: filesystem }
  const parts = path.replace('~/', '').split('/').filter(Boolean)
  let current: Record<string, FsNode> = filesystem
  for (let i = 0; i < parts.length; i++) {
    const node = current[parts[i]]
    if (!node) return null
    if (i === parts.length - 1) return node
    if (node.type === 'dir' && node.children) current = node.children
    else return null
  }
  return null
}

export const appMap: Record<string, WindowType> = {
  projects: 'projects',
  terminal: 'terminal',
  resume: 'resume',
  skills: 'skills',
  timeline: 'timeline',
  settings: 'settings',
  ai: 'ai-assistant',
  assistant: 'ai-assistant',
  about: 'about',
  github: 'github',
  neuroscan: 'projects',
  studyflow: 'projects',
  nimbusx: 'projects',
  codeviz: 'projects',
  education: 'education',
  experience: 'experience',
  certifications: 'certifications',
}

/* ─── All known commands (for autocomplete) ──────────── */

export const allCommands = [
  'help', 'about', 'projects', 'skills', 'resume', 'contact',
  'clear', 'open', 'launch', 'whoami', 'date', 'neofetch',
  'echo', 'pwd', 'ls', 'cd', 'cat', 'tree', 'history', 'theme',
  'education', 'experience', 'github', 'certifications',
]
