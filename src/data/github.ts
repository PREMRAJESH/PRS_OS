export interface GithubRepo {
  id: string
  name: string
  fullName: string
  description: string
  language: string
  languageColor: string
  forks: number
  watchers: number
  issues: number
  license: string
  defaultBranch: string
  branches: string[]
  lastPush: string
  createdAt: string
  topics: string[]
  homepage?: string
  readme: string
  contributors: Contributor[]
  commits: Commit[]
  deployments: Deployment[]
  files: RepoFile[]
}

export interface Contributor {
  name: string
  avatar: string
  commits: number
  role: string
}

export interface Commit {
  hash: string
  message: string
  author: string
  date: string
  additions: number
  deletions: number
}

export interface Deployment {
  env: string
  status: 'active' | 'inactive'
  url?: string
  provider: string
  lastDeploy: string
}

export interface RepoFile {
  name: string
  type: 'file' | 'dir'
  lang?: string
  size?: string
  children?: RepoFile[]
  content?: string
}

export const githubRepos: GithubRepo[] = [
  {
    id: 'neuroscan',
    name: 'NeuroScan',
    fullName: 'PREMRAJESH/NeuroScan',
    description: 'AI-powered brain tumor detection and classification web app for MRI scans, using EfficientNetB0 and ONNX Runtime.',
    language: 'Python',
    languageColor: '#3572A5',
    forks: 34,
    watchers: 12,
    issues: 2,
    license: 'MIT',
    defaultBranch: 'main',
    branches: ['main', 'dev', 'feature/onnx-inference'],
    lastPush: '2 hours ago',
    createdAt: 'May 2025',
    topics: ['onnx-runtime', 'mri-analysis', 'efficientnet', 'flask', 'python', 'deep-learning'],
    homepage: 'https://neuroscan-pink.vercel.app/',
    readme: `# 🧠 NeuroScan AI — Brain Tumor Detection System\n\nNeuroScan AI is a Flask web application designed for classifying brain MRI scans into four distinct categories: Glioma Tumor, Meningioma Tumor, Pituitary Tumor, or No Tumor.`,
    contributors: [
      { name: 'Prem Rajesh', avatar: 'PR', commits: 15, role: 'Creator' },
    ],
    commits: [
      { hash: 'e12e674', message: 'feat: add project structure visualization diagram', author: 'Prem Rajesh', date: '2 hours ago', additions: 120, deletions: 4 },
      { hash: '5ce4cbc', message: 'chore: replace project structure image with correct layout', author: 'Prem Rajesh', date: '4 hours ago', additions: 15, deletions: 80 },
    ],
    deployments: [
      { env: 'Production', status: 'active', url: 'https://neuroscan-pink.vercel.app/', provider: 'Vercel', lastDeploy: '2 hours ago' },
    ],
    files: [
      { name: 'README.md', type: 'file', lang: 'md', size: '6.4K', content: '# NeuroScan AI' }
    ],
  },
  {
    id: 'studyflow',
    name: 'StudyFlow',
    fullName: 'PREMRAJESH/StudyFlow',
    description: 'AI-powered study planner & productivity platform featuring smart scheduling with Google Gemini AI and Supabase.',
    language: 'TypeScript',
    languageColor: '#3178c6',
    forks: 22,
    watchers: 15,
    issues: 0,
    license: 'MIT',
    defaultBranch: 'main',
    branches: ['main', 'feature/gemini-scheduler'],
    lastPush: '3 weeks ago',
    createdAt: 'Apr 2025',
    topics: ['nextjs', 'google-gemini', 'supabase', 'typescript', 'tailwind-css', 'productivity'],
    homepage: 'https://studyflow-aii.vercel.app/',
    readme: `# 📚 StudyFlow\n\nAI-Powered Study Planner & Productivity Platform.`,
    contributors: [
      { name: 'Prem Rajesh', avatar: 'PR', commits: 19, role: 'Creator' },
    ],
    commits: [
      { hash: '60457b7', message: 'updated schedular logic and queries', author: 'Prem Rajesh', date: '3 weeks ago', additions: 18, deletions: 4 },
      { hash: 'cee50b7', message: 'deleted old temp specs', author: 'Prem Rajesh', date: '3 weeks ago', additions: 0, deletions: 120 },
    ],
    deployments: [
      { env: 'Production', status: 'active', url: 'https://studyflow-aii.vercel.app/', provider: 'Vercel', lastDeploy: '3 weeks ago' },
    ],
    files: [
      { name: 'README.md', type: 'file', lang: 'md', size: '23.9K', content: '# StudyFlow Planner' }
    ],
  },
  {
    id: 'nimbusx',
    name: 'NimbusX',
    fullName: 'PREMRAJESH/NimbusX',
    description: 'A real-time mobile messaging app built with React Native, TypeScript, Supabase, and Redux Toolkit.',
    language: 'TypeScript',
    languageColor: '#3178c6',
    forks: 0,
    watchers: 0,
    issues: 0,
    license: 'MIT',
    defaultBranch: 'main',
    branches: ['main'],
    lastPush: '5 days ago',
    createdAt: 'Jan 2025',
    topics: ['react-native', 'typescript', 'supabase', 'redux-toolkit', 'android', 'chat-app'],
    readme: `# Nimbus X 💬\n\nA real-time mobile messaging app built with React Native, TypeScript, Supabase, and Redux Toolkit.`,
    contributors: [
      { name: 'Prem Rajesh', avatar: 'PR', commits: 49, role: 'Creator' },
    ],
    commits: [
      { hash: '34c043f', message: 'chore(assets): add app logo and general static media assets', author: 'Prem Rajesh', date: '5 days ago', additions: 0, deletions: 0 },
      { hash: 'a1b2c3d', message: 'feat: migrate from Firebase/Cloudinary to Supabase', author: 'Prem Rajesh', date: '3 weeks ago', additions: 0, deletions: 0 },
    ],
    deployments: [],
    files: [
      { name: 'README.md', type: 'file', lang: 'md', size: '2.1K', content: '# Nimbus X Cloud Storage' }
    ],
  },
  {
    id: 'codeviz',
    name: 'CodeViz',
    fullName: 'PREMRAJESH/CodeViz',
    description: 'Interactive multi-language code and algorithm visualization platform, parsing scripts into dynamic trees.',
    language: 'TypeScript',
    languageColor: '#3178c6',
    forks: 18,
    watchers: 10,
    issues: 1,
    license: 'MIT',
    defaultBranch: 'main',
    branches: ['main', 'dev'],
    lastPush: '1 day ago',
    createdAt: 'Feb 2025',
    topics: ['nextjs', 'monaco-editor', 'd3js', 'algorithms', 'visualization'],
    homepage: 'https://code-visualizer.vercel.app/',
    readme: `# CodeViz 💻\n\nInteractive algorithm execution visualizer.`,
    contributors: [
      { name: 'Prem Rajesh', avatar: 'PR', commits: 95, role: 'Creator' },
    ],
    commits: [
      { hash: 'v1.4.2', message: 'chore: tag version 1.4.2, finalize Monaco autocomplete bindings', author: 'Prem Rajesh', date: 'Yesterday', additions: 45, deletions: 1 },
      { hash: 'c1d2e3f', message: 'feat: add python AST instrumentation engine', author: 'Prem Rajesh', date: '2 days ago', additions: 145, deletions: 12 },
    ],
    deployments: [
      { env: 'Production', status: 'active', url: 'https://code-visualizer.vercel.app/', provider: 'Vercel', lastDeploy: 'Yesterday' },
    ],
    files: [
      { name: 'README.md', type: 'file', lang: 'md', size: '3.5K', content: '# CodeViz Visualizer' }
    ],
  },
  {
    id: 'prs-os-portfolio',
    name: 'prs-os-portfolio',
    fullName: 'PREMRAJESH/prs-os-portfolio',
    description: 'AI-powered developer OS portfolio with window management, command palette, and integrated terminal.',
    language: 'TypeScript',
    languageColor: '#3178c6',
    forks: 28,
    watchers: 45,
    issues: 0,
    license: 'MIT',
    defaultBranch: 'main',
    branches: ['main', 'feat/window-manager'],
    lastPush: 'just now',
    createdAt: 'May 2025',
    topics: ['nextjs', 'portfolio', 'os-ui', 'zustand', 'framer-motion', 'typescript'],
    homepage: 'https://prs-os.dev',
    readme: `# PRS-OS ⚡\n\nAn AI-powered developer portfolio operating system.`,
    contributors: [
      { name: 'Prem Rajesh', avatar: 'PR', commits: 312, role: 'Creator' },
    ],
    commits: [
      { hash: 'x9y0z1a', message: 'feat: build GitHub workspace profile dashboard', author: 'Prem Rajesh', date: 'just now', additions: 890, deletions: 12 },
    ],
    deployments: [
      { env: 'Production', status: 'active', url: 'https://prs-os.dev', provider: 'Vercel', lastDeploy: 'just now' },
    ],
    files: [
      { name: 'README.md', type: 'file', lang: 'md', size: '1.8K', content: '# PRS-OS Workspace' }
    ],
  },
]
