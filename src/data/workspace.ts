import { type LucideIcon } from 'lucide-react'

export interface Project {
  id: string
  name: string
  category: string
  featured?: boolean
  liveUrl?: string
  tagline: string
  description: string
  keyFeatures: string[]
  stack: string[]
  architecture: string
  engineeringChallenges: string[]
  status: 'active' | 'completed' | 'paused'
  lastCommit: string
  commitHash: string
  buildStatus: 'passing' | 'failing' | 'pending'
  language: string
  progress: number
  tags: string[]
}

export interface ActivityLog {
  time: string
  message: string
  type: 'info' | 'success' | 'process' | 'warning' | 'error'
}

export interface AISuggestion {
  id: string
  title: string
  description: string
  type: 'refactor' | 'optimize' | 'feature' | 'fix'
}

export interface RecentBuild {
  id: string
  name: string
  duration: string
  status: 'success' | 'failed' | 'running'
  timestamp: string
}

export const projects: Project[] = [
  {
    id: 'prs-os',
    name: 'PRS-OS',
    category: 'Developer Operating System',
    tagline: 'Command-driven AI portfolio operating system inspired by modern developer tooling.',
    description: 'A high-performance virtual operating system built as an immersive engineering portfolio. Combines command-driven navigation, contextual AI interactions, floating application windows, runtime browser environments, semantic project search, and cinematic motion architecture into a unified developer workspace experience.',
    keyFeatures: [
      'Window manager',
      'Runtime browser',
      'Command palette',
      'Contextual AI system',
      'Semantic search',
      'Terminal workspace',
      'GitHub workspace',
      'Resume viewer'
    ],
    stack: ['Next.js', 'React', 'TypeScript', 'Zustand', 'Framer Motion', 'Tailwind CSS'],
    architecture: 'Command-driven OS architecture powered by centralized Zustand orchestration and modular window lifecycle management.',
    engineeringChallenges: [
      'Multi-window state synchronization',
      '60FPS motion performance orchestration',
      'Context-aware command parsing',
      'GPU-accelerated workspace rendering'
    ],
    status: 'active',
    lastCommit: '2 min ago',
    commitHash: 'a1b2c3d',
    buildStatus: 'passing',
    language: 'TypeScript',
    progress: 92,
    tags: ["developer-tools", "os-ui", "window-manager", "ai-interface", "nextjs", "motion-design"]
  },
  {
    id: 'codeviz',
    name: 'CodeViz',
    category: 'Developer Tooling',
    featured: true,
    liveUrl: 'https://code-visualizer.vercel.app/',
    tagline: 'Interactive multi-language code and algorithm visualization platform.',
    description: 'A modern algorithm visualization environment that enables developers and students to understand code execution step-by-step through animated visual systems, execution tracing, and interactive controls.',
    keyFeatures: [
      'Multi-language support',
      'Sorting/Searching visualizations',
      'Execution flow diagrams',
      'Real-time variable tracking',
      'Monaco editor integration',
      'Playback controls',
      'Performance-safe execution engine'
    ],
    stack: ['Next.js', 'React 19', 'TypeScript', 'Tailwind CSS', 'Monaco Editor', 'Framer Motion'],
    architecture: 'Modular visualization architecture using isolated execution engines and specialized visualization pipelines for sorting, searching, and flow analysis.',
    engineeringChallenges: [
      'Real-time execution synchronization',
      'Preventing excessive rerenders during animations',
      'Designing language-agnostic execution flows',
      'Performance optimization for visualization rendering'
    ],
    status: 'completed',
    lastCommit: 'Yesterday',
    commitHash: 'v1.4.2',
    buildStatus: 'passing',
    language: 'TypeScript',
    progress: 100,
    tags: ["developer-tools", "algorithms", "visualization", "monaco", "nextjs", "education"]
  },
  {
    id: 'brain-tumor',
    name: 'Brain Tumor Detection',
    category: 'AI & Machine Learning',
    tagline: 'Deep learning-based MRI brain tumor classification system with interactive medical visualization.',
    description: 'An AI-powered medical imaging system for detecting and classifying brain tumors from MRI scans using convolutional neural networks and an interactive deployment environment.',
    keyFeatures: [
      'MRI classification',
      'CNN-based prediction pipeline',
      'Grad-CAM visualization',
      'Confidence scoring',
      'Flask deployment',
      'Real-time predictions',
      'Medical-themed responsive interface'
    ],
    stack: ['Python', 'TensorFlow', 'Flask', 'OpenCV', 'NumPy'],
    architecture: 'CNN inference pipeline integrated with Flask serving architecture and image preprocessing workflow for real-time MRI classification.',
    engineeringChallenges: [
      'Dataset preprocessing consistency',
      'Improving model generalization',
      'Visualization of prediction confidence',
      'Real-time inference integration'
    ],
    status: 'completed',
    lastCommit: '2 weeks ago',
    commitHash: 'm1.b4.c',
    buildStatus: 'passing',
    language: 'Python',
    progress: 100,
    tags: ["ai", "machine-learning", "tensorflow", "cnn", "medical-ai", "flask"]
  },
  {
    id: 'nexus',
    name: 'Nexus',
    category: 'Full Stack System',
    tagline: 'Academic archive and publication management ecosystem for scholarly communities.',
    description: 'A research publication management platform designed for manuscript submission, editorial workflows, digital preservation, and institutional publication systems.',
    keyFeatures: [
      'Digital repository',
      'Manuscript submission workflow',
      'Editorial review system',
      'Researcher dashboards',
      'Role-based access control',
      'Administrative analytics'
    ],
    stack: ['PHP 8', 'MySQL', 'Tailwind CSS', 'JavaScript'],
    architecture: 'Session-based publication workflow architecture using RBAC authentication and modular administrative/researcher portal separation.',
    engineeringChallenges: [
      'Workflow state management',
      'Role-based authorization',
      'Secure manuscript handling',
      'Metadata organization'
    ],
    status: 'completed',
    lastCommit: '1 month ago',
    commitHash: 'n.8.4.1',
    buildStatus: 'passing',
    language: 'PHP',
    progress: 100,
    tags: ["fullstack", "research-system", "php", "mysql", "rbac", "publication-platform"]
  },
]

export const activityLogs: ActivityLog[] = [
  { time: '16:42', message: 'Optimized render cycles in window manager', type: 'success' },
  { time: '15:30', message: 'Resolved z-index collision in multi-pane layouts', type: 'info' },
  { time: '14:15', message: 'Synchronized command palette intent mapping', type: 'process' },
  { time: 'Yesterday', message: 'Tuned spring physics for cinematic transitions', type: 'success' },
  { time: '2 days ago', message: 'Implemented modular runtime container system', type: 'info' },
]

export const aiSuggestions: AISuggestion[] = [
  {
    id: 's1',
    title: 'Show systems projects',
    description: 'Explore infrastructure and distributed systems.',
    type: 'feature',
  },
  {
    id: 's2',
    title: 'Explain system design',
    description: 'Deep dive into the architecture of PRS-OS.',
    type: 'optimize',
  },
  {
    id: 's3',
    title: 'Open resume',
    description: 'View technical experience and contributions.',
    type: 'refactor',
  },
]

export const recentBuilds: RecentBuild[] = [
  { id: 'b1', name: 'PRS-OS Core', duration: '11.2s', status: 'success', timestamp: '2 min ago' },
  { id: 'b2', name: 'Window Manager', duration: '8.9s', status: 'success', timestamp: '18 min ago' },
  { id: 'b3', name: 'Contextual AI', duration: '12.1s', status: 'success', timestamp: '42 min ago' },
]

export const developerStatus = {
  name: 'Prem R.',
  role: 'Systems Engineer',
  focus: 'Infrastructure & Developer Experience',
  mood: 'Engineering Focus',
  branch: 'main',
}

export const engineeringFocus = [
  { icon: 'Brain', label: 'Systems Thinking', description: 'Architecting scalable, modular software architectures.' },
  { icon: 'Search', label: 'Semantic Indexing', description: 'Context-aware retrieval and intelligent discovery.' },
  { icon: 'Layout', label: 'UI Orchestration', description: 'Managing complex application states and layouts.' },
  { icon: 'Zap', label: 'Developer Tooling', description: 'Building high-fidelity tools for improved workflows.' },
]
