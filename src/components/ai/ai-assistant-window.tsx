'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Sparkles, User, Loader2, Code2, Cpu, Globe, Info } from 'lucide-react'
import { useOSStore } from '@/store/os-store'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const specializedResponses: Record<string, string> = {
  'explain architecture': "The PRS-OS architecture is built on a **Modular Micro-Kernel** philosophy:\n\n• **Core Runtime:** Next.js 15 + React 19 for reactive UI state.\n• **State Management:** Zustand-based OS store for windowing, themes, and global events.\n• **Component Matrix:** Isolated, lazy-loaded window modules (Project Explorer, Terminal, etc.).\n• **Intelligence Layer:** Context-aware command palette and semantic search integration.\n\nEverything is designed for **low latency** and **high intentionality**.",
  'explain neuroscan architecture': "NeuroScan AI is structured as a **Lightweight Medical Inference** pipeline:\n\n• **Clinical Guardrails:** Preprocessing checks (grayscale, contrast, borders) to filter non-MRI images.\n• **Inference Engine:** Optimized local runtime using ONNX Runtime (`onnxruntime-cpu`) for sub-50ms predictions.\n• **Frontend Workbench:** Dark clinical interface with glassmorphic visualizations for training results.",
  'explain studyflow architecture': "StudyFlow follows a **Serverless Next.js + BaaS** architecture:\n\n• **AI Scheduler:** Vercel AI SDK integrations with Google Gemini AI (`gemini-2.5-flash`) for structured scheduling plans.\n• **Backend Layer:** Supabase for Auth, PostgreSQL (triggers + RLS), and Storage (PDF parsing context).\n• **Styling System:** Modern design built on Next.js 16.2 App Router and Tailwind CSS 4.",
  'show ai projects': "I've developed several AI-driven systems:\n\n• **BrainTumorAI:** ML-powered medical imaging analysis using TensorFlow.\n• **PRS-OS Assistant:** The current contextual intelligence system you're using.\n• **SmartStudyPlanner:** Adaptive scheduling based on learning velocity algorithms.\n\nWould you like to explore the source code for any of these?",
  'what technologies does prs use': "The core stack consists of:\n\n• **Frontend:** TypeScript, React 19, Tailwind CSS, Framer Motion.\n• **Backend:** Node.js, Go (for high-concurrency microservices).\n• **Infra:** Docker, Kubernetes, AWS Lambda.\n• **Database:** PostgreSQL (Relational), Redis (Caching), Pinecone (Vector Search).",
}

function getAIResponse(query: string): string {
  const lowerQuery = query.toLowerCase()
  
  for (const [key, response] of Object.entries(specializedResponses)) {
    if (lowerQuery.includes(key)) {
      return response
    }
  }

  if (lowerQuery.includes('project') || lowerQuery.includes('work')) {
    return "This developer focuses on high-performance web systems and AI integration. Key projects include **NeuroScan AI**, **StudyFlow**, and this **PRS-OS** workspace. Which one should we dive into?"
  }
  
  return "I've analyzed your query. Based on the developer's workspace context, I can explain system architectures, tech stacks, or project details. What specific part of the system interests you?"
}

export function AIAssistantWindow() {
  const { initialQuery } = useOSStore()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "System Intelligence Online. I'm ready to assist with project analysis or technical questions.",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const hasInitalized = useRef(false)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Handle initial query from Command Palette
  useEffect(() => {
    if (initialQuery && !hasInitalized.current) {
      hasInitalized.current = true
      handleProcessQuery(initialQuery)
    }
  }, [initialQuery])

  const handleProcessQuery = async (query: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: query,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setIsTyping(true)

    // Simulate AI thinking
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 500))

    const response = getAIResponse(query)
    
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: response,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, assistantMessage])
    setIsTyping(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isTyping) return
    const q = input.trim()
    setInput('')
    handleProcessQuery(q)
  }

  return (
    <div className="flex flex-col h-full bg-background/40">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        <AnimatePresence initial={false}>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className={`flex gap-4 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              {/* Avatar */}
              <div className={`
                flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center border shadow-sm
                ${message.role === 'assistant' 
                  ? 'bg-primary/10 border-primary/20 text-primary' 
                  : 'bg-secondary/40 border-border/40 text-foreground'
                }
              `}>
                {message.role === 'assistant' ? <Sparkles className="w-5 h-5" /> : <User className="w-5 h-5" />}
              </div>

              {/* Message bubble */}
              <div className={`
                max-w-[85%] rounded-2xl px-5 py-3.5 shadow-sm border
                ${message.role === 'assistant'
                  ? 'bg-secondary/20 border-border/30 text-foreground'
                  : 'bg-primary border-primary/20 text-primary-foreground'
                }
              `}>
                <div className="text-[13px] whitespace-pre-wrap leading-relaxed tracking-wide font-medium">
                  {message.content.split('\n').map((line, i) => {
                    const parts = line.split(/(\*\*.*?\*\*)/g)
                    return (
                      <span key={i}>
                        {parts.map((part, j) => {
                          if (part.startsWith('**') && part.endsWith('**')) {
                            return <strong key={j} className={message.role === 'assistant' ? 'text-primary' : 'text-white'}>{part.slice(2, -2)}</strong>
                          }
                          return part
                        })}
                        {i < message.content.split('\n').length - 1 && <br />}
                      </span>
                    )
                  })}
                </div>
                <div className={`
                  text-[9px] mt-2 opacity-40 font-mono font-bold uppercase tracking-tighter
                  ${message.role === 'user' ? 'text-right' : ''}
                `}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-4"
          >
            <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div className="bg-secondary/20 border border-border/30 rounded-2xl px-5 py-4 flex items-center gap-3">
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
              <span className="text-[12px] text-muted-foreground font-medium">Analyzing system context...</span>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-6 border-t border-border/20 bg-background/20">
        <form onSubmit={handleSubmit} className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Follow up or ask a new question..."
            className="w-full bg-secondary/30 rounded-2xl pl-5 pr-12 py-3.5 border border-border/40 focus:border-primary/50 focus:bg-secondary/50 outline-none text-sm transition-all shadow-inner"
            disabled={isTyping}
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-primary text-primary-foreground disabled:opacity-30 hover:scale-105 active:scale-95 transition-all shadow-lg"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <div className="mt-3 flex items-center justify-center gap-4 text-[10px] text-muted-foreground/30 font-bold uppercase tracking-[0.1em]">
          <div className="flex items-center gap-1.5"><Info className="w-3 h-3" /> Workspace Sync Active</div>
          <div className="w-1 h-1 rounded-full bg-border/40" />
          <div className="flex items-center gap-1.5"><Code2 className="w-3 h-3" /> Architecture Context Online</div>
        </div>
      </div>
    </div>
  )
}
