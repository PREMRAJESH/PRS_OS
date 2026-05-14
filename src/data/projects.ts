export interface ProjectData {
  id: string
  name: string
  slug: string
  tagline: string
  overview: string
  status: 'active' | 'completed' | 'archived'
  stars: number
  github: string
  demo?: string
  stack: TechItem[]
  architecture: string
  challenges: string[]
  learnings: string[]
  deployment: string[]
  files: FileNode[]
}

export interface TechItem {
  name: string
  category: 'frontend' | 'backend' | 'database' | 'infra' | 'ai' | 'tools'
}

export interface FileNode {
  name: string
  type: 'file' | 'dir'
  lang?: string
  children?: FileNode[]
  content?: string
}

const categoryColors: Record<string, string> = {
  frontend: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  backend: 'text-green-400 bg-green-400/10 border-green-400/20',
  database: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  infra: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
  ai: 'text-pink-400 bg-pink-400/10 border-pink-400/20',
  tools: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
}

export { categoryColors }

export const projectsData: ProjectData[] = [
  {
    id: 'nimbusx',
    name: 'NimbusX',
    slug: 'nimbusx',
    tagline: 'Real-time messaging platform with WhatsApp-style UX',
    overview: `NimbusX is a full-featured real-time messaging platform built with React and Firebase. It supports text, media, and voice messaging with a WhatsApp-inspired interface.

The app features real-time message synchronization, typing indicators, read receipts, and a dual-mode media attachment system with emoji, GIF, and sticker support.

Authentication is handled via Firebase Auth with Google Sign-In and email/password flows. All messages are stored in Firestore with optimistic UI updates for instant feedback.`,
    status: 'completed',
    stars: 234,
    github: 'https://github.com/developer/nimbusx',
    demo: 'https://nimbusx.vercel.app',
    stack: [
      { name: 'React', category: 'frontend' },
      { name: 'TypeScript', category: 'frontend' },
      { name: 'Tailwind CSS', category: 'frontend' },
      { name: 'Firebase Auth', category: 'backend' },
      { name: 'Firestore', category: 'database' },
      { name: 'Firebase Storage', category: 'infra' },
      { name: 'WebRTC', category: 'backend' },
      { name: 'Vercel', category: 'infra' },
    ],
    architecture: `The app follows a modular component architecture with a centralized Firebase service layer.

**State Management:** React Context + useReducer for local UI state, Firestore snapshots for real-time data sync.

**Message Flow:**
1. User sends message → optimistic update to local state
2. Write to Firestore → triggers onSnapshot listeners
3. All connected clients receive update in <100ms

**Media Pipeline:**
- Files uploaded to Firebase Storage with progress tracking
- Thumbnails generated client-side before upload
- URLs stored as message metadata in Firestore`,
    challenges: [
      'Handling offline message queuing with Firestore persistence',
      'Implementing smooth keyboard-aware input on mobile',
      'Managing WebRTC peer connections for voice calling',
      'Optimizing Firestore reads with pagination and caching',
    ],
    learnings: [
      'Deep understanding of Firebase real-time architecture',
      'Mobile-first input handling with virtual keyboard detection',
      'WebRTC signaling and TURN server configuration',
      'Optimistic UI patterns for perceived performance',
    ],
    deployment: ['Vercel (Frontend)', 'Firebase (Backend + DB)', 'Cloudflare (CDN)'],
    files: [
      { name: 'src', type: 'dir', children: [
        { name: 'components', type: 'dir', children: [
          { name: 'ChatWindow.tsx', type: 'file', lang: 'tsx', content: `import { useState, useRef, useEffect } from 'react'
import { useMessages } from '../hooks/useMessages'
import { MessageBubble } from './MessageBubble'
import { ChatInput } from './ChatInput'

export function ChatWindow({ chatId }: { chatId: string }) {
  const { messages, sendMessage } = useMessages(chatId)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    })
  }, [messages])

  return (
    <div className="flex flex-col h-full">
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
      </div>
      <ChatInput onSend={sendMessage} />
    </div>
  )
}` },
          { name: 'MessageBubble.tsx', type: 'file', lang: 'tsx' },
          { name: 'ChatInput.tsx', type: 'file', lang: 'tsx' },
          { name: 'ContactList.tsx', type: 'file', lang: 'tsx' },
        ]},
        { name: 'hooks', type: 'dir', children: [
          { name: 'useMessages.ts', type: 'file', lang: 'ts' },
          { name: 'useAuth.ts', type: 'file', lang: 'ts' },
        ]},
        { name: 'services', type: 'dir', children: [
          { name: 'firebase.ts', type: 'file', lang: 'ts' },
        ]},
        { name: 'App.tsx', type: 'file', lang: 'tsx' },
      ]},
      { name: 'package.json', type: 'file', lang: 'json' },
      { name: 'README.md', type: 'file', lang: 'md' },
    ],
  },
  {
    id: 'braintumorai',
    name: 'BrainTumorAI',
    slug: 'braintumorai',
    tagline: 'ML-powered medical imaging analysis with 97.3% accuracy',
    overview: `BrainTumorAI is a deep learning system for detecting and classifying brain tumors from MRI scans. It achieves 97.3% accuracy using a custom CNN architecture trained on 7,000+ annotated medical images.

The system provides a REST API via FastAPI, enabling hospitals and research institutions to integrate tumor detection into their existing imaging workflows.

A web-based dashboard visualizes predictions with confidence scores, heatmaps, and patient history tracking.`,
    status: 'completed',
    stars: 189,
    github: 'https://github.com/developer/braintumorai',
    stack: [
      { name: 'Python', category: 'backend' },
      { name: 'TensorFlow', category: 'ai' },
      { name: 'Keras', category: 'ai' },
      { name: 'FastAPI', category: 'backend' },
      { name: 'PostgreSQL', category: 'database' },
      { name: 'Docker', category: 'infra' },
      { name: 'AWS EC2', category: 'infra' },
      { name: 'NumPy', category: 'tools' },
    ],
    architecture: `Custom CNN with transfer learning from ResNet50.

**Model Pipeline:**
1. DICOM → preprocessing (normalization, augmentation)
2. Feature extraction via frozen ResNet50 base
3. Custom classification head (3 dense layers + dropout)
4. Output: tumor type + confidence + GradCAM heatmap

**API Design:** RESTful endpoints with async processing for large batch scans.`,
    challenges: [
      'Handling class imbalance in medical imaging datasets',
      'Generating clinically meaningful GradCAM visualizations',
      'Optimizing model inference time for real-time use',
      'Ensuring HIPAA-compliant data handling in the pipeline',
    ],
    learnings: [
      'Transfer learning dramatically reduces training time',
      'Data augmentation is critical for small medical datasets',
      'Model interpretability matters more than raw accuracy in healthcare',
      'Async processing patterns for compute-heavy API endpoints',
    ],
    deployment: ['AWS EC2 (GPU)', 'Docker', 'Nginx', 'PostgreSQL RDS'],
    files: [
      { name: 'models', type: 'dir', children: [
        { name: 'cnn_classifier.py', type: 'file', lang: 'py', content: `import tensorflow as tf
from tensorflow.keras.applications import ResNet50
from tensorflow.keras.layers import Dense, Dropout, GlobalAvgPool2D
from tensorflow.keras.models import Model

def build_model(num_classes: int = 4) -> Model:
    """Build tumor classification model with ResNet50 backbone."""
    base = ResNet50(weights='imagenet', include_top=False,
                    input_shape=(224, 224, 3))
    base.trainable = False

    x = base.output
    x = GlobalAvgPool2D()(x)
    x = Dense(512, activation='relu')(x)
    x = Dropout(0.3)(x)
    x = Dense(256, activation='relu')(x)
    x = Dropout(0.2)(x)
    output = Dense(num_classes, activation='softmax')(x)

    model = Model(inputs=base.input, outputs=output)
    model.compile(
        optimizer=tf.keras.optimizers.Adam(1e-4),
        loss='categorical_crossentropy',
        metrics=['accuracy']
    )
    return model` },
        { name: 'preprocessing.py', type: 'file', lang: 'py' },
        { name: 'gradcam.py', type: 'file', lang: 'py' },
      ]},
      { name: 'api', type: 'dir', children: [
        { name: 'main.py', type: 'file', lang: 'py' },
        { name: 'routes.py', type: 'file', lang: 'py' },
      ]},
      { name: 'requirements.txt', type: 'file', lang: 'txt' },
      { name: 'Dockerfile', type: 'file', lang: 'docker' },
    ],
  },
  {
    id: 'smartstudyplanner',
    name: 'SmartStudyPlanner',
    slug: 'smartstudyplanner',
    tagline: 'AI-driven academic scheduling that adapts to your learning',
    overview: `SmartStudyPlanner uses OpenAI's API to create adaptive study schedules based on course difficulty, learning patterns, and upcoming deadlines.

The app analyzes past study sessions to optimize future scheduling — allocating more time for difficult subjects and spacing reviews using evidence-based techniques.

Built as a full-stack Next.js application with Supabase for auth and database, featuring a calendar view, task management, and productivity analytics.`,
    status: 'active',
    stars: 156,
    github: 'https://github.com/developer/smartstudyplanner',
    demo: 'https://smartstudy.vercel.app',
    stack: [
      { name: 'Next.js', category: 'frontend' },
      { name: 'TypeScript', category: 'frontend' },
      { name: 'Tailwind CSS', category: 'frontend' },
      { name: 'OpenAI API', category: 'ai' },
      { name: 'Supabase', category: 'database' },
      { name: 'Prisma', category: 'tools' },
      { name: 'Vercel', category: 'infra' },
    ],
    architecture: `Next.js App Router with server actions for API calls.

**AI Scheduling Engine:**
1. Collect course data, difficulty ratings, deadlines
2. Build prompt with structured JSON schema
3. OpenAI generates optimized weekly schedule
4. Validate and persist to Supabase
5. Display in interactive calendar component

**Spaced Repetition:** Custom algorithm tracking retention curves per subject.`,
    challenges: [
      'Designing effective prompts for consistent schedule generation',
      'Building a responsive drag-and-drop calendar component',
      'Implementing spaced repetition with variable intervals',
      'Handling timezone differences for global users',
    ],
    learnings: [
      'Structured output prompting yields much better AI results',
      'Supabase Row Level Security simplifies auth dramatically',
      'Server actions are cleaner than API routes for mutations',
      'Progressive enhancement improves perceived performance',
    ],
    deployment: ['Vercel (Frontend + API)', 'Supabase (DB + Auth)', 'OpenAI API'],
    files: [
      { name: 'app', type: 'dir', children: [
        { name: 'page.tsx', type: 'file', lang: 'tsx' },
        { name: 'layout.tsx', type: 'file', lang: 'tsx' },
        { name: 'api', type: 'dir', children: [
          { name: 'schedule', type: 'dir', children: [
            { name: 'route.ts', type: 'file', lang: 'ts' },
          ]},
        ]},
      ]},
      { name: 'components', type: 'dir', children: [
        { name: 'Calendar.tsx', type: 'file', lang: 'tsx' },
        { name: 'TaskList.tsx', type: 'file', lang: 'tsx' },
        { name: 'Analytics.tsx', type: 'file', lang: 'tsx' },
      ]},
      { name: 'lib', type: 'dir', children: [
        { name: 'ai-scheduler.ts', type: 'file', lang: 'ts' },
        { name: 'supabase.ts', type: 'file', lang: 'ts' },
      ]},
    ],
  },
  {
    id: 'devopsdebugger',
    name: 'DevOpsDebugger',
    slug: 'devopsdebugger',
    tagline: 'Automated infrastructure debugging with intelligent log analysis',
    overview: `DevOpsDebugger is a CLI and web tool that automates infrastructure debugging by parsing logs from Kubernetes clusters, identifying anomalies, and suggesting fixes.

It connects to Prometheus and Elasticsearch to aggregate metrics and logs, then uses pattern matching and heuristic analysis to pinpoint root causes of outages.

Built in Go for performance, with a Grafana dashboard plugin for visualization.`,
    status: 'archived',
    stars: 98,
    github: 'https://github.com/developer/devopsdebugger',
    stack: [
      { name: 'Go', category: 'backend' },
      { name: 'Prometheus', category: 'tools' },
      { name: 'Grafana', category: 'tools' },
      { name: 'Elasticsearch', category: 'database' },
      { name: 'Kubernetes', category: 'infra' },
      { name: 'Docker', category: 'infra' },
      { name: 'gRPC', category: 'backend' },
    ],
    architecture: `Event-driven pipeline processing architecture.

**Pipeline:**
1. Log collector agents → Kafka topics
2. Stream processor parses and normalizes logs
3. Anomaly detector compares against baseline metrics
4. Alert generator creates actionable incidents
5. Grafana plugin visualizes timeline and correlations

**CLI:** Cobra-based Go CLI for direct cluster debugging.`,
    challenges: [
      'Processing high-volume log streams without dropping events',
      'Building accurate anomaly detection without ML overhead',
      'Correlating events across distributed microservices',
      'Designing a Grafana plugin with the panel SDK',
    ],
    learnings: [
      'Go channels are excellent for pipeline architectures',
      'Statistical anomaly detection can outperform ML for structured logs',
      'Grafana plugin development requires understanding React + Angular',
      'gRPC streaming is ideal for real-time log forwarding',
    ],
    deployment: ['Kubernetes (Self-hosted)', 'Docker', 'Helm Charts'],
    files: [
      { name: 'cmd', type: 'dir', children: [
        { name: 'main.go', type: 'file', lang: 'go', content: `package main

import (
    "fmt"
    "os"

    "github.com/spf13/cobra"
    "devopsdebugger/pkg/analyzer"
    "devopsdebugger/pkg/collector"
)

func main() {
    rootCmd := &cobra.Command{
        Use:   "debugger",
        Short: "Automated infrastructure debugging tool",
    }

    analyzeCmd := &cobra.Command{
        Use:   "analyze [namespace]",
        Short: "Analyze logs for anomalies",
        Args:  cobra.ExactArgs(1),
        RunE: func(cmd *cobra.Command, args []string) error {
            c := collector.New(args[0])
            logs, err := c.Collect()
            if err != nil {
                return fmt.Errorf("collection failed: %w", err)
            }

            a := analyzer.New()
            results := a.Analyze(logs)
            results.Print(os.Stdout)
            return nil
        },
    }

    rootCmd.AddCommand(analyzeCmd)
    rootCmd.Execute()
}` },
      ]},
      { name: 'pkg', type: 'dir', children: [
        { name: 'analyzer', type: 'dir', children: [
          { name: 'log_parser.go', type: 'file', lang: 'go' },
          { name: 'anomaly_detector.go', type: 'file', lang: 'go' },
        ]},
        { name: 'collector', type: 'dir', children: [
          { name: 'k8s.go', type: 'file', lang: 'go' },
          { name: 'prometheus.go', type: 'file', lang: 'go' },
        ]},
      ]},
      { name: 'go.mod', type: 'file', lang: 'go' },
      { name: 'Makefile', type: 'file', lang: 'makefile' },
    ],
  },
]
