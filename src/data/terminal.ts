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

export const filesystem: Record<string, FsNode> = {
  'projects': {
    type: 'dir', name: 'projects',
    children: {
      'prs-os': { type: 'dir', name: 'prs-os', children: {
        'package.json': { type: 'file', name: 'package.json', size: '2.3K', modified: 'today' },
        'tsconfig.json': { type: 'file', name: 'tsconfig.json', size: '695B', modified: 'today' },
        'src': { type: 'dir', name: 'src', children: {} },
        'README.md': { type: 'file', name: 'README.md', size: '1.1K', modified: '2 days ago', content: '# PRS-OS Portfolio\nAI-powered developer OS built with Next.js and Zustand.\n' },
      }},
      'nimbusx': { type: 'dir', name: 'nimbusx', children: {
        'README.md': { type: 'file', name: 'README.md', size: '820B', modified: '3 days ago' },
      }},
      'timeforge': { type: 'dir', name: 'timeforge', children: {
        'README.md': { type: 'file', name: 'README.md', size: '540B', modified: '1 week ago' },
      }},
    },
  },
  'documents': { type: 'dir', name: 'documents', children: {
    'resume.pdf': { type: 'file', name: 'resume.pdf', size: '245K', modified: '1 week ago' },
    'notes.md': { type: 'file', name: 'notes.md', size: '1.2K', modified: '3 days ago', content: '# Dev Notes\n- Finish window manager\n- Polish command palette\n- Add terminal autocomplete\n' },
  }},
  '.config': { type: 'dir', name: '.config', children: {
    'theme.json': { type: 'file', name: 'theme.json', size: '128B', modified: 'today' },
  }},
  '.bashrc': { type: 'file', name: '.bashrc', size: '64B', modified: '2 weeks ago', content: '# PRS-OS Shell Config\nexport PS1="developer@prs-os:~$ "\nexport EDITOR=vim\n' },
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

/* ─── App map ────────────────────────────────────────── */

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
  nimbusx: 'projects',
}

/* ─── All known commands (for autocomplete) ──────────── */

export const allCommands = [
  'help', 'about', 'projects', 'skills', 'resume', 'contact',
  'clear', 'open', 'launch', 'whoami', 'date', 'neofetch',
  'echo', 'pwd', 'ls', 'cd', 'cat', 'mkdir', 'tree',
  'history', 'theme',
]
