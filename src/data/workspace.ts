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
    id: 'neuroscan',
    name: 'NeuroScan AI',
    category: 'AI & Machine Learning',
    featured: true,
    liveUrl: 'https://neuroscan-pink.vercel.app/',
    tagline: 'ML-powered medical imaging analysis with 94.05% accuracy.',
    description: 'A Flask web application designed for classifying brain MRI scans into Glioma, Meningioma, Pituitary, or No Tumor classes. Employs EfficientNetB0 transfer learning and ONNX Runtime CPU inference for high-speed, serverless computation.',
    keyFeatures: [
      'ONNX Runtime Inference',
      'Clinical Input Guardrails',
      'EfficientNetB0 Architecture',
      'Confidence Scoring',
      'Serverless Flask API',
      'MRI Visualization UI'
    ],
    stack: ['Python', 'Flask', 'ONNX Runtime', 'EfficientNetB0', 'HTML5', 'CSS3', 'JavaScript'],
    architecture: 'EfficientNetB0 backbone trained with transfer learning, converted to ONNX format, executed with ONNX Runtime CPU.',
    engineeringChallenges: [
      'Supporting CPU-optimized ONNX on Vercel Serverless',
      'Grayscale contrast validation guardrails',
      'Bundle size reduction below 250MB'
    ],
    status: 'active',
    lastCommit: '2 hours ago',
    commitHash: 'e12e674',
    buildStatus: 'passing',
    language: 'Python',
    progress: 94,
    tags: ["ai", "machine-learning", "onnx-runtime", "flask", "medical-ai"]
  },
  {
    id: 'studyflow',
    name: 'StudyFlow',
    category: 'Full Stack & AI',
    featured: true,
    liveUrl: 'https://studyflow-aii.vercel.app/',
    tagline: 'AI-driven study scheduling and focus platform with Google Gemini AI.',
    description: 'A Next.js full-stack productivity companion that plans, tracks, and optimizes student study sessions. Implements Google Gemini API for adaptive, syllabus-aware scheduling, backed by Supabase DB, Auth, and Storage.',
    keyFeatures: [
      'AI Schedule Generator',
      'Study AI Chatbot',
      'Pomodoro Timer Tracker',
      'Supabase Database sync',
      'Syllabus PDF Parsing',
      'Row Level Security (RLS)'
    ],
    stack: ['Next.js 16', 'TypeScript', 'Tailwind CSS 4', 'Google Gemini AI', 'Supabase', 'Vercel AI SDK'],
    architecture: 'Next.js App Router coupled with Supabase Database, Auth, and Storage. Prompts structured via JSON schemas and validated using Zod.',
    engineeringChallenges: [
      'Enforcing strict JSON schema responses from LLM',
      'Supabase real-time multi-device sync',
      'PDF text extraction on serverless workers'
    ],
    status: 'active',
    lastCommit: '3 weeks ago',
    commitHash: '60457b7',
    buildStatus: 'passing',
    language: 'TypeScript',
    progress: 90,
    tags: ["nextjs", "gemini-ai", "supabase", "typescript", "productivity"]
  },
  {
    id: 'nimbusx',
    name: 'Nimbus X',
    category: 'Cloud Storage & Organization',
    featured: true,
    liveUrl: 'https://nimbusx.vercel.app',
    tagline: 'AI-powered cloud storage with intelligent organization.',
    description: 'A next-generation cloud drive featuring AI-assisted file classification, automated metadata extraction, and semantic file search. Built on React and Firebase infrastructure.',
    keyFeatures: [
      'Intelligent Auto-Tagging',
      'Semantic Concept Search',
      'Direct Cloud Uploading',
      'Firebase Auth Integration',
      'Real-time metadata sync',
      'Progressive Upload UI'
    ],
    stack: ['React', 'TypeScript', 'Tailwind CSS', 'Firebase Auth', 'Firestore', 'Firebase Storage'],
    architecture: 'React frontend synced with Firestore DB and Firebase Storage. Back-end functions analyze uploads and trigger semantic categorizations.',
    engineeringChallenges: [
      'Chunked uploading with instant progress feedback',
      'Dynamic search vector tag generation',
      'Multi-format preview canvas components'
    ],
    status: 'completed',
    lastCommit: '3 days ago',
    commitHash: 'a1b2c3d',
    buildStatus: 'passing',
    language: 'TypeScript',
    progress: 100,
    tags: ["react", "firebase", "cloud-storage", "typescript", "ai"]
  },
  {
    id: 'codeviz',
    name: 'CodeViz',
    category: 'Developer Tooling',
    featured: true,
    liveUrl: 'https://code-visualizer.vercel.app/',
    tagline: 'Interactive multi-language code and algorithm visualization platform.',
    description: 'An educational software playground that parses user-written code into Abstract Syntax Trees, generating step-by-step execution control flows, variable stack histories, and graphical traversals.',
    keyFeatures: [
      'Monaco Editor Integration',
      'Data Structure Tracing',
      'Call Stack Inspection',
      'Step Forward/Backward Controls',
      'Sandbox Execution Engine',
      'D3.js SVG Rendering'
    ],
    stack: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Monaco Editor', 'D3.js', 'Framer Motion'],
    architecture: 'Next.js client embedding Monaco Editor. Code execution is parsed, and steps are visualised using D3.js trees and custom React diagrams.',
    engineeringChallenges: [
      'Safe sandbox execution without eval() risk',
      'High frame-rate SVG tree updates at 60 FPS',
      'Language-agnostic telemetry tracking'
    ],
    status: 'completed',
    lastCommit: 'Yesterday',
    commitHash: 'v1.4.2',
    buildStatus: 'passing',
    language: 'TypeScript',
    progress: 100,
    tags: ["developer-tools", "algorithms", "monaco", "nextjs", "d3js"]
  }
]

export const activityLogs: ActivityLog[] = [
  { time: '16:15', message: 'Pushed updates to Nimbus X', type: 'success' },
  { time: '13:00', message: 'Improved model accuracy in NeuroScan AI', type: 'info' },
  { time: 'Yesterday', message: 'Optimized CodeViz visualization engine', type: 'success' },
  { time: '2 days ago', message: 'Updated StudyFlow AI planner', type: 'process' },
  { time: '3 days ago', message: 'Deployed new version of Nimbus X', type: 'info' },
]

export const aiSuggestions: AISuggestion[] = [
  {
    id: 's1',
    title: 'Explore projects',
    description: 'Investigate AI and Full-Stack systems.',
    type: 'feature',
  },
  {
    id: 's2',
    title: 'Open resume',
    description: 'Inspect academic details and certificates.',
    type: 'refactor',
  },
  {
    id: 's3',
    title: 'Open Terminal',
    description: 'Navigate workspace via developer shell.',
    type: 'optimize',
  },
]

export const recentBuilds: RecentBuild[] = [
  { id: 'b1', name: 'NeuroScan Model ONNX', duration: '5.2s', status: 'success', timestamp: '2 hours ago' },
  { id: 'b2', name: 'StudyFlow Engine', duration: '9.4s', status: 'success', timestamp: '1 day ago' },
  { id: 'b3', name: 'CodeViz Sandbox', duration: '11.8s', status: 'success', timestamp: 'Yesterday' },
]

export const developerStatus = {
  name: 'Prem Rajesh',
  role: 'Software Engineering Student',
  focus: 'AI Developer • Full Stack Developer • ML Enthusiast',
  mood: 'Engineering Focus',
  branch: 'main',
}

export const engineeringFocus = [
  { icon: 'Brain', label: 'Artificial Intelligence', description: 'Training transfer-learning models and optimizing inference.' },
  { icon: 'Layout', label: 'Full Stack Development', description: 'Building responsive, reactive client-server architectures.' },
  { icon: 'Zap', label: 'Developer Tooling', description: 'Creating interactive visual sandboxes for complex systems.' },
  { icon: 'Search', label: 'Problem Solving', description: 'Applying algorithmic analysis to deliver optimized tools.' },
]
