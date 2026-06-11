export interface ProjectData {
  id: string
  name: string
  slug: string
  tagline: string
  overview: string
  status: 'active' | 'completed' | 'archived'
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
        content: `**Repository**\ngithub.com/PREMRAJESH/NeuroScan\n\n**Live Deployment**\nneuroscan-pink.vercel.app`
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
        content: `**Repository**\ngithub.com/PREMRAJESH/StudyFlow\n\n**Live Deployment**\nstudyflow-aii.vercel.app`
      }
    ]
  },
  {
    id: 'nimbusx',
    name: 'Nimbus X',
    slug: 'nimbusx',
    tagline: 'Real-time Mobile Messaging App | React Native | Cloud & Local Storage',
    overview: `Nimbus X is a real-time mobile messaging app built with React Native, TypeScript, Supabase, and Redux Toolkit. It features authentication, private and group chats, status updates, media/file support, and persistent cloud and local storage with a toggle between cloud and local storing.`,
    status: 'completed',
    github: 'https://github.com/PREMRAJESH/NimbusX',
    stack: [
      { name: 'React Native', category: 'frontend' },
      { name: 'TypeScript', category: 'frontend' },
      { name: 'Redux Toolkit', category: 'frontend' },
      { name: 'Supabase', category: 'backend' },
    ],
    architecture: 'React Native mobile app with Redux Toolkit for state management, Supabase for backend services including auth, real-time messaging, and file storage with cloud/local toggle.',
    challenges: [
      'Implementing real-time messaging with private and group chat support.',
      'Building a toggle system for cloud vs local file storage.',
      'Ensuring persistent message and media storage across sessions.',
    ],
    learnings: [
      'Supabase provides excellent real-time subscriptions for chat features.',
      'Redux Toolkit simplifies complex state management in React Native.',
    ],
    deployment: ['Google Play Store (Android)'],
    files: [
      {
        name: 'Overview.md',
        type: 'file',
        lang: 'md',
        content: `# Nimbus X - Overview

Nimbus X is a real-time mobile messaging app built with React Native.

### Core Features
- **Private & Group Chats**: Real-time messaging with authentication.
- **Status Updates**: Share status updates with contacts.
- **Media/File Support**: Send and receive files with cloud/local storage toggle.
- **Persistent Storage**: Messages and media stored both locally and in the cloud.

### Tech Stack
- React Native, TypeScript, Redux Toolkit, Supabase`
      },
      {
        name: 'TechStack.md',
        type: 'file',
        lang: 'md',
        content: `# Technology Stack

- **Frontend**: React Native, TypeScript, Redux Toolkit
- **Backend**: Supabase (Auth, Database, Real-time, Storage)
- **Platform**: Android (iOS support planned)`
      },
      {
        name: 'Links.md',
        type: 'file',
        lang: 'md',
        content: `**Repository**\ngithub.com/PREMRAJESH/NimbusX`
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
        content: `**Repository**\ngithub.com/PREMRAJESH/CodeViz\n\n**Live Demo**\ncode-visualizer.vercel.app`
      }
    ]
  }
]
