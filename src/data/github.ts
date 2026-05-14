export interface GithubRepo {
  id: string
  name: string
  fullName: string
  description: string
  language: string
  languageColor: string
  stars: number
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
    id: 'nimbusx',
    name: 'nimbusx',
    fullName: 'prem/nimbusx',
    description: 'Real-time messaging platform with WhatsApp-style UX, powered by Firebase and WebRTC for voice/video calling.',
    language: 'TypeScript',
    languageColor: '#3178c6',
    stars: 234,
    forks: 42,
    watchers: 18,
    issues: 3,
    license: 'MIT',
    defaultBranch: 'main',
    branches: ['main', 'dev', 'feat/voice-calls', 'fix/media-upload'],
    lastPush: '3 days ago',
    createdAt: 'Jan 2025',
    topics: ['react', 'firebase', 'webrtc', 'chat', 'real-time', 'typescript'],
    homepage: 'https://nimbusx.vercel.app',
    readme: `# NimbusX 💬

A full-featured real-time messaging platform with WhatsApp-inspired UI.

## Features

- **Real-time messaging** — Instant sync via Firestore snapshots
- **Media sharing** — Images, videos, documents with preview
- **Voice & video calls** — WebRTC peer connections
- **Typing indicators** — Live presence detection
- **Read receipts** — Double-check mark system
- **Emoji & GIF support** — Inline picker with search

## Quick Start

\`\`\`bash
git clone https://github.com/prem/nimbusx.git
cd nimbusx
npm install
npm run dev
\`\`\`

## Architecture

The app uses a **Firebase-first** architecture:

- **Auth** → Firebase Authentication (Google + Email)
- **Database** → Cloud Firestore (real-time listeners)
- **Storage** → Firebase Storage (media uploads)
- **Hosting** → Vercel (SSR + Edge Functions)

## Tech Stack

| Category | Technology |
|----------|-----------|
| Frontend | React, TypeScript, Tailwind CSS |
| Backend  | Firebase Cloud Functions |
| Database | Cloud Firestore |
| Media    | Firebase Storage, WebRTC |
| Deploy   | Vercel, Firebase Hosting |`,
    contributors: [
      { name: 'Prem R.', avatar: 'PR', commits: 187, role: 'Creator' },
      { name: 'Alex K.', avatar: 'AK', commits: 34, role: 'Contributor' },
      { name: 'Sara M.', avatar: 'SM', commits: 12, role: 'Contributor' },
    ],
    commits: [
      { hash: 'a1b2c3d', message: 'feat: implement voice call UI with WebRTC', author: 'Prem R.', date: '3 days ago', additions: 342, deletions: 18 },
      { hash: 'e4f5g6h', message: 'fix: media upload progress not updating', author: 'Prem R.', date: '4 days ago', additions: 28, deletions: 12 },
      { hash: 'i7j8k9l', message: 'refactor: extract message hooks into separate module', author: 'Alex K.', date: '1 week ago', additions: 156, deletions: 198 },
      { hash: 'm0n1o2p', message: 'feat: add emoji picker with search', author: 'Prem R.', date: '1 week ago', additions: 234, deletions: 5 },
      { hash: 'q3r4s5t', message: 'chore: upgrade Firebase SDK to v10', author: 'Sara M.', date: '2 weeks ago', additions: 45, deletions: 38 },
      { hash: 'u6v7w8x', message: 'feat: implement typing indicators', author: 'Prem R.', date: '2 weeks ago', additions: 89, deletions: 3 },
    ],
    deployments: [
      { env: 'Production', status: 'active', url: 'https://nimbusx.vercel.app', provider: 'Vercel', lastDeploy: '3 days ago' },
      { env: 'Staging', status: 'active', url: 'https://staging.nimbusx.vercel.app', provider: 'Vercel', lastDeploy: '2 days ago' },
      { env: 'Firebase', status: 'active', provider: 'Firebase Hosting', lastDeploy: '1 week ago' },
    ],
    files: [
      { name: 'src', type: 'dir', children: [
        { name: 'components', type: 'dir', children: [
          { name: 'ChatWindow.tsx', type: 'file', lang: 'tsx', size: '4.2K', content: `import { useState, useRef, useEffect } from 'react'
import { useMessages } from '../hooks/useMessages'
import { MessageBubble } from './MessageBubble'
import { ChatInput } from './ChatInput'

interface ChatWindowProps {
  chatId: string
  recipientName: string
}

export function ChatWindow({ chatId, recipientName }: ChatWindowProps) {
  const { messages, sendMessage, markAsRead } = useMessages(chatId)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isAtBottom, setIsAtBottom] = useState(true)

  useEffect(() => {
    if (isAtBottom) {
      scrollRef.current?.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth',
      })
    }
  }, [messages, isAtBottom])

  useEffect(() => {
    markAsRead()
  }, [chatId, markAsRead])

  return (
    <div className="flex flex-col h-full bg-chat-bg">
      <header className="px-4 py-3 border-b flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-primary/20" />
        <div>
          <h3 className="font-medium text-sm">{recipientName}</h3>
          <p className="text-xs text-muted">online</p>
        </div>
      </header>
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
      </div>
      <ChatInput onSend={sendMessage} />
    </div>
  )
}` },
          { name: 'MessageBubble.tsx', type: 'file', lang: 'tsx', size: '2.1K' },
          { name: 'ChatInput.tsx', type: 'file', lang: 'tsx', size: '3.8K' },
          { name: 'ContactList.tsx', type: 'file', lang: 'tsx', size: '2.4K' },
          { name: 'EmojiPicker.tsx', type: 'file', lang: 'tsx', size: '1.9K' },
        ]},
        { name: 'hooks', type: 'dir', children: [
          { name: 'useMessages.ts', type: 'file', lang: 'ts', size: '1.8K' },
          { name: 'useAuth.ts', type: 'file', lang: 'ts', size: '1.2K' },
          { name: 'usePresence.ts', type: 'file', lang: 'ts', size: '0.9K' },
        ]},
        { name: 'services', type: 'dir', children: [
          { name: 'firebase.ts', type: 'file', lang: 'ts', size: '0.8K' },
          { name: 'webrtc.ts', type: 'file', lang: 'ts', size: '2.4K' },
        ]},
        { name: 'App.tsx', type: 'file', lang: 'tsx', size: '1.4K' },
        { name: 'index.tsx', type: 'file', lang: 'tsx', size: '0.3K' },
      ]},
      { name: 'public', type: 'dir', children: [
        { name: 'favicon.ico', type: 'file', size: '4K' },
      ]},
      { name: 'package.json', type: 'file', lang: 'json', size: '2.1K' },
      { name: 'tsconfig.json', type: 'file', lang: 'json', size: '0.7K' },
      { name: 'README.md', type: 'file', lang: 'md', size: '3.2K' },
      { name: '.gitignore', type: 'file', size: '0.2K' },
    ],
  },
  {
    id: 'braintumorai',
    name: 'brain-tumor-ai',
    fullName: 'prem/brain-tumor-ai',
    description: 'Deep learning system for brain tumor detection and classification from MRI scans, achieving 97.3% accuracy.',
    language: 'Python',
    languageColor: '#3572A5',
    stars: 189,
    forks: 67,
    watchers: 23,
    issues: 5,
    license: 'Apache-2.0',
    defaultBranch: 'main',
    branches: ['main', 'dev', 'experiment/attention-unet'],
    lastPush: '2 weeks ago',
    createdAt: 'Aug 2024',
    topics: ['deep-learning', 'medical-imaging', 'tensorflow', 'cnn', 'python', 'mri'],
    readme: `# BrainTumorAI 🧠

ML-powered brain tumor detection from MRI scans.

## Results

| Metric | Score |
|--------|-------|
| Accuracy | 97.3% |
| Precision | 96.8% |
| Recall | 97.1% |
| F1 Score | 96.9% |

## Model Architecture

Custom CNN built on ResNet50 backbone with:
- Transfer learning from ImageNet
- Global average pooling
- Dropout regularization (0.3, 0.2)
- Softmax classification (4 classes)

## Usage

\`\`\`python
from models.cnn_classifier import build_model

model = build_model(num_classes=4)
model.load_weights('checkpoints/best_model.h5')
prediction = model.predict(preprocessed_image)
\`\`\``,
    contributors: [
      { name: 'Prem R.', avatar: 'PR', commits: 134, role: 'Creator' },
      { name: 'Dr. Chen', avatar: 'DC', commits: 28, role: 'Medical Advisor' },
    ],
    commits: [
      { hash: 'b2c3d4e', message: 'feat: add GradCAM heatmap visualization', author: 'Prem R.', date: '2 weeks ago', additions: 189, deletions: 5 },
      { hash: 'f5g6h7i', message: 'perf: optimize inference pipeline for batch processing', author: 'Prem R.', date: '3 weeks ago', additions: 67, deletions: 23 },
      { hash: 'j8k9l0m', message: 'feat: implement FastAPI REST endpoints', author: 'Prem R.', date: '1 month ago', additions: 234, deletions: 0 },
      { hash: 'n1o2p3q', message: 'docs: add model architecture diagram', author: 'Dr. Chen', date: '1 month ago', additions: 45, deletions: 2 },
    ],
    deployments: [
      { env: 'Production API', status: 'active', url: 'https://api.braintumorai.dev', provider: 'AWS EC2 (GPU)', lastDeploy: '2 weeks ago' },
      { env: 'Model Registry', status: 'active', provider: 'AWS S3', lastDeploy: '3 weeks ago' },
    ],
    files: [
      { name: 'models', type: 'dir', children: [
        { name: 'cnn_classifier.py', type: 'file', lang: 'py', size: '2.8K', content: `import tensorflow as tf
from tensorflow.keras.applications import ResNet50
from tensorflow.keras.layers import Dense, Dropout, GlobalAveragePooling2D
from tensorflow.keras.models import Model

def build_model(num_classes: int = 4) -> Model:
    """Build tumor classification model with ResNet50 backbone."""
    base = ResNet50(
        weights='imagenet',
        include_top=False,
        input_shape=(224, 224, 3)
    )
    base.trainable = False

    x = base.output
    x = GlobalAveragePooling2D()(x)
    x = Dense(512, activation='relu')(x)
    x = Dropout(0.3)(x)
    x = Dense(256, activation='relu')(x)
    x = Dropout(0.2)(x)
    output = Dense(num_classes, activation='softmax')(x)

    model = Model(inputs=base.input, outputs=output)
    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=1e-4),
        loss='categorical_crossentropy',
        metrics=['accuracy']
    )
    return model` },
        { name: 'preprocessing.py', type: 'file', lang: 'py', size: '1.6K' },
        { name: 'gradcam.py', type: 'file', lang: 'py', size: '1.9K' },
      ]},
      { name: 'api', type: 'dir', children: [
        { name: 'main.py', type: 'file', lang: 'py', size: '1.2K' },
        { name: 'routes.py', type: 'file', lang: 'py', size: '0.8K' },
      ]},
      { name: 'requirements.txt', type: 'file', lang: 'txt', size: '0.4K' },
      { name: 'Dockerfile', type: 'file', lang: 'docker', size: '0.6K' },
      { name: 'README.md', type: 'file', lang: 'md', size: '2.8K' },
    ],
  },
  {
    id: 'prs-os',
    name: 'prs-os-portfolio',
    fullName: 'prem/prs-os-portfolio',
    description: 'AI-powered developer OS portfolio with window management, command palette, and integrated terminal.',
    language: 'TypeScript',
    languageColor: '#3178c6',
    stars: 312,
    forks: 28,
    watchers: 45,
    issues: 0,
    license: 'MIT',
    defaultBranch: 'main',
    branches: ['main', 'feat/window-manager', 'feat/command-palette'],
    lastPush: 'just now',
    createdAt: 'May 2025',
    topics: ['nextjs', 'portfolio', 'os-ui', 'zustand', 'framer-motion', 'typescript'],
    homepage: 'https://prs-os.dev',
    readme: `# PRS-OS ⚡

An AI-powered developer portfolio disguised as an operating system.

## Features

- 🖥️ Window management with drag, resize, z-index focus
- ⌨️ Raycast-inspired command palette (Ctrl+K)
- 📟 Interactive terminal with filesystem
- 🤖 AI assistant panel
- 🎨 6 premium themes
- 📂 IDE-style project explorer

## Stack

Next.js 16 • TypeScript • Tailwind CSS 4 • Zustand • Framer Motion 12`,
    contributors: [
      { name: 'Prem R.', avatar: 'PR', commits: 312, role: 'Creator' },
    ],
    commits: [
      { hash: 'x9y0z1a', message: 'feat: build GitHub workspace app', author: 'Prem R.', date: 'just now', additions: 890, deletions: 12 },
      { hash: 'b2c3d4e', message: 'feat: add IDE project explorer with code viewer', author: 'Prem R.', date: '10 min ago', additions: 620, deletions: 368 },
      { hash: 'f5g6h7i', message: 'feat: build cinematic terminal with filesystem', author: 'Prem R.', date: '25 min ago', additions: 445, deletions: 315 },
      { hash: 'j8k9l0m', message: 'feat: Raycast-style command palette', author: 'Prem R.', date: '40 min ago', additions: 380, deletions: 251 },
      { hash: 'n1o2p3q', message: 'feat: active workspace dashboard', author: 'Prem R.', date: '55 min ago', additions: 520, deletions: 120 },
    ],
    deployments: [
      { env: 'Production', status: 'active', url: 'https://prs-os.dev', provider: 'Vercel', lastDeploy: 'just now' },
    ],
    files: [
      { name: 'src', type: 'dir', children: [
        { name: 'app', type: 'dir', children: [
          { name: 'page.tsx', type: 'file', lang: 'tsx', size: '0.8K' },
          { name: 'layout.tsx', type: 'file', lang: 'tsx', size: '1.2K' },
          { name: 'globals.css', type: 'file', lang: 'css', size: '5.9K' },
        ]},
        { name: 'components', type: 'dir', children: [
          { name: 'os', type: 'dir', children: [
            { name: 'desktop.tsx', type: 'file', lang: 'tsx', size: '1.6K' },
            { name: 'os-window.tsx', type: 'file', lang: 'tsx', size: '4.8K' },
            { name: 'window-manager.tsx', type: 'file', lang: 'tsx', size: '1.6K' },
          ]},
          { name: 'terminal', type: 'dir', children: [
            { name: 'terminal-window.tsx', type: 'file', lang: 'tsx', size: '12K' },
          ]},
        ]},
        { name: 'store', type: 'dir', children: [
          { name: 'os-store.ts', type: 'file', lang: 'ts', size: '4.8K' },
        ]},
      ]},
      { name: 'package.json', type: 'file', lang: 'json', size: '2.3K' },
      { name: 'tsconfig.json', type: 'file', lang: 'json', size: '0.7K' },
      { name: 'README.md', type: 'file', lang: 'md', size: '1.8K' },
    ],
  },
]
