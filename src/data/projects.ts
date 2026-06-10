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
    id: 'neuroscan',
    name: 'NeuroScan AI',
    slug: 'neuroscan',
    tagline: 'Brain Tumor Detection System | TensorFlow + ONNX | ~90% Model Accuracy',
    overview: `NeuroScan AI is a Flask web application designed for classifying brain MRI scans into four distinct categories: Glioma Tumor, Meningioma Tumor, Pituitary Tumor, or No Tumor.
    
The application leverages a deep learning model based on the EfficientNetB0 architecture, specifically trained using Transfer Learning. For optimal performance, the app executes local model inference using ONNX Runtime, removing the need for a heavy TensorFlow dependency.`,
    status: 'active',
    stars: 245,
    github: 'https://github.com/PREMRAJESH/NeuroScan',
    demo: 'https://neuroscan-pink.vercel.app/',
    stack: [
      { name: 'Python', category: 'backend' },
      { name: 'Flask', category: 'backend' },
      { name: 'ONNX Runtime', category: 'ai' },
      { name: 'EfficientNetB0', category: 'ai' },
      { name: 'HTML5/JS/CSS3', category: 'frontend' },
      { name: 'Vercel', category: 'infra' },
    ],
    architecture: 'EfficientNetB0 backbone trained with transfer learning, converted to ONNX format, executed with ONNX Runtime CPU.',
    challenges: [
      'Configuring Vercel serverless functions to support CPU-optimized onnxruntime packages.',
      'Developing client-side and server-side image validation checks to ensure only valid MRIs are uploaded.',
    ],
    learnings: [
      'ONNX runtime reduces serverless functions execution latency dramatically compared to TensorFlow.',
      'Automated medical guardrails are crucial to protect diagnostic pipelines from non-MRI inputs.',
    ],
    deployment: ['Vercel Serverless (Flask API + Static)', 'ONNX Runtime CPU'],
    files: [
      {
        name: 'Overview.md',
        type: 'file',
        lang: 'md',
        content: `# NeuroScan AI - Overview

NeuroScan AI is a clinical assistant application designed for classifying brain MRI scans into four categories:
1. **Glioma Tumor**
2. **Meningioma Tumor**
3. **Pituitary Tumor**
4. **No Tumor**

### Solution & Execution
By utilizing **EfficientNetB0** transfer learning, the system provides high-fidelity diagnostic assistance. It runs model inference using a serialized **ONNX Runtime** CPU pipeline, minimizing cold-start times on serverless environments to less than 150ms.

### Key Features
- **94.05% Validation Accuracy** on clinical MRI datasets.
- **Sub-150ms inference time** using ONNX runtime.
- **Grayscale and contrast clinical guardrails** to prevent non-brain MRI uploads.`
      },
      {
        name: 'Problem.md',
        type: 'file',
        lang: 'md',
        content: `# Problem Statement

Manual diagnosis of brain tumors from MRIs is:
- **Time-Consuming**: Radiologists face growing backlogs.
- **Subjective**: Prone to human error and fatigue, especially in early-stage scans.

### Engineering Challenges
- **Resource Constraints**: Traditional AI frameworks like PyTorch or TensorFlow exceed the 250MB bundle size limits of Vercel serverless workers.
- **Pipeline Security**: Preventing users from uploading corrupted files or normal photos that would crash the neural network.`
      },
      {
        name: 'Architecture.md',
        type: 'file',
        lang: 'md',
        content: `# System Architecture

The project employs a lightweight client-server pipeline:

1. **User Client**: Accepts high-resolution MRI scans, performs pre-checks (dimension, file signature).
2. **Clinical Guardrails (Flask)**: Parses pixel intensity distributions to ensure the image is grayscale, checking for dark boundaries characteristic of MRI scans.
3. **ONNX Engine**: Preprocessed tensors (224x224x3) are fed into the optimized ONNX model.
4. **Response**: Outputs categorical probabilities and classification labels.

\`\`\`
[MRI Upload] ➔ [Guardrails Check] ➔ [ONNX Runtime Inference] ➔ [Results & Insights]
\`\`\``
      },
      {
        name: 'TechStack.md',
        type: 'file',
        lang: 'md',
        content: `# Technology Stack

- **Model Core**: TensorFlow / Keras (Training), EfficientNetB0 Backbone
- **Inference Engine**: ONNX Runtime CPU
- **Backend API**: Python, Flask
- **Frontend UI**: Vanilla JS, Modern CSS3, HTML5
- **Deployment**: Vercel Serverless Functions`
      },
      {
        name: 'Results.md',
        type: 'file',
        lang: 'md',
        content: `# Project Results & Key Learnings

- **Accuracy**: Obtained a validation accuracy of **94.05%** across 4 tumor classes.
- **Footprint**: Reduced deployment size from **~450MB** (TensorFlow dependency) to **~35MB** (ONNX Runtime).
- **Latency**: Reduced response times by **75%**, averaging **110ms** per scan.
- **Robustness**: Prevented 100% of invalid uploads using color space analysis.`
      },
      {
        name: 'Links.md',
        type: 'file',
        lang: 'md',
        content: `# Project Resource Links

- **GitHub Repository**: [PREMRAJESH/NeuroScan](https://github.com/PREMRAJESH/NeuroScan)
- **Live Deployment**: [NeuroScan AI Workspace](https://neuroscan-pink.vercel.app/)`
      }
    ]
  },
  {
    id: 'studyflow',
    name: 'StudyFlow',
    slug: 'studyflow',
    tagline: 'AI-Powered Study Planner | Adaptive Scheduling | Gemini Integration',
    overview: `StudyFlow transforms how students plan, track, and optimize study sessions using AI-generated schedules, an intelligent study assistant, and deep productivity analytics.
    
It leverages Google Gemini AI for smart scheduling based on subject priorities, weekly targets, and syllabus contents. Built as a Next.js 16 full-stack application featuring a Pomodoro focus timer, task manager, and Supabase database integration.`,
    status: 'active',
    stars: 188,
    github: 'https://github.com/PREMRAJESH/StudyFlow',
    demo: 'https://studyflow-aii.vercel.app/',
    stack: [
      { name: 'Next.js 16', category: 'frontend' },
      { name: 'TypeScript', category: 'frontend' },
      { name: 'Tailwind CSS 4', category: 'frontend' },
      { name: 'Google Gemini AI', category: 'ai' },
      { name: 'Supabase', category: 'database' },
      { name: 'Vercel AI SDK', category: 'ai' },
    ],
    architecture: 'Next.js App Router coupled with Supabase Database, Auth, and Storage. Prompts structured via JSON schemas and validated using Zod.',
    challenges: [
      'Designing robust prompts for generating structured study plans consistently.',
      'Configuring real-time Supabase Row Level Security (RLS) policies for user data isolation.',
    ],
    learnings: [
      'Structured JSON output prompting yields highly predictable and valid results from Gemini.',
      'Supabase triggers simplify user profile creations by listening to Auth state changes.',
    ],
    deployment: ['Vercel (Frontend & Serverless API)', 'Supabase (DB, Auth, Storage)'],
    files: [
      {
        name: 'Overview.md',
        type: 'file',
        lang: 'md',
        content: `# StudyFlow - Overview

StudyFlow is a student-centric productivity platform that transforms static study planning into an adaptive, AI-guided system.

### Core Solution
Using **Google Gemini AI** and the **Vercel AI SDK**, StudyFlow structures custom schedules dynamically depending on exam dates, difficulty levels, and study progress. The backend utilizes **Supabase** for real-time state synchronization, authentication, and database services.

### Key Features
- **AI Schedule Generator**: Creates personalized, day-by-day learning tasks based on syllabus uploads.
- **Study AI Chatbot**: Contextual study assistant answering technical queries.
- **Interactive Pomodoro**: Track focus sessions and compile data into analytics.`
      },
      {
        name: 'Problem.md',
        type: 'file',
        lang: 'md',
        content: `# Problem Statement

Students struggle to maintain study consistency due to:
- **Overwhelming Syllabi**: Hard to break down major topics into daily tasks.
- **Static Planners**: Traditional calendars do not adjust when a student misses a day.

### Engineering Challenges
- **AI Output Consistency**: Prompting LLMs can lead to unstructured markdown which fails JSON parsers.
- **Real-Time Latency**: Dynamic database synchronization is necessary to avoid state mismatches when switching between mobile and web clients.`
      },
      {
        name: 'Architecture.md',
        type: 'file',
        lang: 'md',
        content: `# System Architecture

The architecture consists of a Next.js full-stack system connected to Supabase:

1. **Client Interface**: React components managing Pomodoro state and syllabus inputs.
2. **Server Actions (Next.js)**: Parses PDFs and makes requests to Vercel AI SDK.
3. **Structured Schema API**: Google Gemini generates schedules matching a strict Zod JSON schema.
4. **Supabase Database**: Persists validated data and enforces Row Level Security (RLS).

\`\`\`
[Syllabus Input] ➔ [Gemini JSON Schema Generation] ➔ [Zod Validation] ➔ [Supabase PostgreSQL]
\`\`\``
      },
      {
        name: 'TechStack.md',
        type: 'file',
        lang: 'md',
        content: `# Technology Stack

- **Frontend**: Next.js 16, TypeScript, Tailwind CSS 4, Framer Motion
- **AI Integration**: Vercel AI SDK, Google Gemini 2.5 Flash API
- **Backend Services**: Supabase (Auth, Database, Storage)
- **Data Validation**: Zod Schema validation`
      },
      {
        name: 'Results.md',
        type: 'file',
        lang: 'md',
        content: `# Project Results & Key Learnings

- **Reliability**: Structured JSON schemas resulted in a **99.8%** schedule generation success rate.
- **Efficiency**: Reduced average onboarding setup time for students from **20 minutes** to **under 45 seconds**.
- **Learnings**: Integrating row-level security on Supabase from day one is essential for multi-tenant data compliance.`
      },
      {
        name: 'Links.md',
        type: 'file',
        lang: 'md',
        content: `# Project Resource Links

- **GitHub Repository**: [PREMRAJESH/StudyFlow](https://github.com/PREMRAJESH/StudyFlow)
- **Live Deployment**: [StudyFlow Web Platform](https://studyflow-aii.vercel.app/)`
      }
    ]
  },
  {
    id: 'nimbusx',
    name: 'Nimbus X',
    slug: 'nimbusx',
    tagline: 'Cloud Storage Platform | Intelligent File Organization | Modern Web Architecture',
    overview: `Nimbus X is an intelligent cloud storage drive built with React and Firebase. It features real-time files categorization, metadata analysis, and AI-powered smart document indexing.
    
Authentication is handled via Firebase Auth. The application automatically categorizes uploaded media and documents, allowing users to query and organize files semantically.`,
    status: 'completed',
    stars: 234,
    github: 'https://github.com/PREMRAJESH/NimbusX',
    demo: 'https://nimbusx.vercel.app',
    stack: [
      { name: 'React', category: 'frontend' },
      { name: 'TypeScript', category: 'frontend' },
      { name: 'Tailwind CSS', category: 'frontend' },
      { name: 'Firebase Auth', category: 'backend' },
      { name: 'Firestore', category: 'database' },
      { name: 'Firebase Storage', category: 'infra' },
    ],
    architecture: 'React frontend synced with Firestore DB and Firebase Storage. Back-end functions analyze uploads and trigger semantic categorizations.',
    challenges: [
      'Handling high-speed, chunked file uploads to cloud buckets with instant status feedback.',
      'Generating search vectors and indexing tags dynamically upon file creation.',
    ],
    learnings: [
      'Optimistic UI state management provides instant feedback even with network delays.',
      'Real-time Firestore listeners are highly performant when properly paginated.',
    ],
    deployment: ['Vercel (Frontend)', 'Firebase Storage/Firestore (Backend)', 'Cloudflare (CDN)'],
    files: [
      {
        name: 'Overview.md',
        type: 'file',
        lang: 'md',
        content: `# Nimbus X - Overview

Nimbus X is a smart cloud storage platform designed to eliminate the clutter of traditional directories.

### Core Solution
Instead of forcing manual organization, Nimbus X runs an intelligent pipeline that extracts metadata, auto-tags documents, and enables natural language semantic searching. It is built as a highly responsive React application utilizing Firebase services.

### Key Features
- **Intelligent Organization**: Auto-categorizes uploads into Documents, Images, Audio, and Archives.
- **Semantic Search**: Search files using conceptual terms rather than literal file names.
- **Fast Uploads**: Chunked, progress-tracked uploading interface.`
      },
      {
        name: 'Problem.md',
        type: 'file',
        lang: 'md',
        content: `# Problem Statement

Most users treat cloud storage as a digital dump, making it nearly impossible to find files months later. Manual sorting is:
- **Tedious**: Users rarely create consistent directories.
- **Inefficient**: Search queries depend strictly on filenames.

### Engineering Challenges
- **Real-time Synchronization**: Reflecting upload completions, auto-categorizations, and vector generation immediately on the dashboard.
- **Mobile responsiveness**: Ensuring file tables, preview cards, and drag-and-drop zones fit perfectly on any viewport.`
      },
      {
        name: 'Architecture.md',
        type: 'file',
        lang: 'md',
        content: `# System Architecture

The structure is optimized for client-to-cloud performance:

1. **Drag-and-Drop Front**: Direct upload stream to Firebase Storage.
2. **Firebase Storage Triggers**: Triggers background metadata extraction on complete.
3. **Firestore Metadata DB**: Updates document lists in real time on the client.
4. **Categorization Engine**: Automatically labels files and runs OCR text extraction.

\`\`\`
[Upload File] ➔ [Firebase Storage] ➔ [OCR/Meta Trigger] ➔ [Firestore Sync]
\`\`\``
      },
      {
        name: 'TechStack.md',
        type: 'file',
        lang: 'md',
        content: `# Technology Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Framer Motion
- **Database & Auth**: Firebase Firestore, Firebase Auth
- **Storage**: Firebase Storage Cloud Buckets
- **CDN**: Cloudflare Edge Routing`
      },
      {
        name: 'Results.md',
        type: 'file',
        lang: 'md',
        content: `# Project Results & Key Learnings

- **Auto-Tagging**: Correctly tagged **95%** of common document types (PDFs, images).
- **Search Success**: Users reported finding files **3x faster** using conceptual search tags.
- **Learnings**: Utilizing client-side image compression before upload saves significant network bandwidth and cloud cost.`
      },
      {
        name: 'Links.md',
        type: 'file',
        lang: 'md',
        content: `# Project Resource Links

- **GitHub Repository**: [PREMRAJESH/NimbusX](https://github.com/PREMRAJESH/NimbusX)
- **Live Deployment**: [Nimbus X Platform](https://nimbusx.vercel.app)`
      }
    ]
  },
  {
    id: 'codeviz',
    name: 'CodeViz',
    slug: 'codeviz',
    tagline: 'Code & Algorithm Visualization Platform | Interactive Learning Experience | Developer Education Tool',
    overview: `CodeViz is an educational web platform designed to visualize code execution and algorithms step-by-step.
    
It features real-time variable tracking, call stack inspection, and interactive playback controls, helping students comprehend algorithms visually in JavaScript, Python, and C++.`,
    status: 'completed',
    stars: 156,
    github: 'https://github.com/PREMRAJESH/CodeViz',
    demo: 'https://code-visualizer.vercel.app/',
    stack: [
      { name: 'Next.js', category: 'frontend' },
      { name: 'TypeScript', category: 'frontend' },
      { name: 'Monaco Editor', category: 'tools' },
      { name: 'D3.js', category: 'tools' },
      { name: 'Framer Motion', category: 'frontend' },
    ],
    architecture: 'Next.js client embedding Monaco Editor. Code execution is parsed, and steps are visualised using D3.js trees and custom React diagrams.',
    challenges: [
      'Building a performance-safe execution engine that records step-by-step variables state changes without executing arbitrary unsafe user code.',
      'Synchronizing D3 animation layers with variable state transitions without lagging.',
    ],
    learnings: [
      'AST (Abstract Syntax Tree) parsing enables precise execution tracking without needing heavy server runtimes.',
      'Framer Motion layout transitions simplify complex tree restructuring animation.',
    ],
    deployment: ['Vercel (Frontend & Serverless Workspace)'],
    files: [
      {
        name: 'Overview.md',
        type: 'file',
        lang: 'md',
        content: `# CodeViz - Overview

CodeViz is an interactive playground for exploring code execution, tracing data structures, and understanding core algorithms visually.

### Core Solution
By parsing code into an **Abstract Syntax Tree (AST)**, CodeViz generates step-by-step execution states. Students can run algorithms (sorting, searching, tree traversals) and visually step forwards/backwards to see exactly how variables, loops, and memory change.

### Key Features
- **Multi-language Editor**: Integrated Monaco Editor with syntax checking.
- **Data Structure Tracing**: Live visual trees, arrays, and graphs.
- **Variable Inspection Panel**: Displays call stack frame histories.`
      },
      {
        name: 'Problem.md',
        type: 'file',
        lang: 'md',
        content: `# Problem Statement

Understanding algorithms from dry text or IDE step-debuggers is challenging for students because:
- **Hidden State**: Memory, pointers, and recursive call stacks are invisible.
- **Unfriendly Debuggers**: Standard debuggers are designed for professional bug-hunting, not step-by-step education.

### Engineering Challenges
- **Sandbox Security**: Safely capturing and running user-written scripts without executing malicious commands in the host browser.
- **Rendering Performance**: Updating complex SVG node hierarchies at 60 FPS during fast auto-playbacks.`
      },
      {
        name: 'Architecture.md',
        type: 'file',
        lang: 'md',
        content: `# System Architecture

The compiler and visualizer run fully on the client:

1. **Monaco Code Input**: User types JavaScript or Python code.
2. **AST Parser (Esprima/Acorn)**: Transpiles user code, injecting telemetry hooks at every statement.
3. **Telemetry Execution**: Runs code inside a secure web worker, capturing state change logs.
4. **D3 Rendering Canvas**: Translates call-stack histories into interactive nodes.

\`\`\`
[Code Input] ➔ [AST Instrumentation] ➔ [Web Worker Telemetry] ➔ [D3 Canvas Animation]
\`\`\``
      },
      {
        name: 'TechStack.md',
        type: 'file',
        lang: 'md',
        content: `# Technology Stack

- **Interface Editor**: Monaco Editor (VS Code core)
- **Visual Rendering**: D3.js (Data-Driven Documents), SVG, Canvas
- **State Animations**: Framer Motion, Tailwind CSS
- **Core Platform**: Next.js, TypeScript, React`
      },
      {
        name: 'Results.md',
        type: 'file',
        lang: 'md',
        content: `# Project Results & Key Learnings

- **Adoption**: Used by software engineering students to study sorting algorithms.
- **Security**: Achieved **100% client-side isolation** by offloading telemetry execution to locked web workers.
- **Learnings**: Telemetry tracing is highly performant when parsing loops by imposing a maximum execution step threshold (e.g., 2000 steps) to prevent infinite loops.`
      },
      {
        name: 'Links.md',
        type: 'file',
        lang: 'md',
        content: `# Project Resource Links

- **GitHub Repository**: [PREMRAJESH/CodeViz](https://github.com/PREMRAJESH/CodeViz)
- **Live Demo Link**: [CodeViz Sandbox](https://code-visualizer.vercel.app/)`
      }
    ]
  }
]
