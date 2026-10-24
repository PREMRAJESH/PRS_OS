'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUp, Sparkles, Loader2 } from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const specializedResponses: Record<string, string> = {
  'explain architecture': 'PRS—OS is a small operating system built in the browser:\n\n• **Runtime:** Next.js 16 and React 19 render every window inside a single desktop shell.\n• **State:** a Zustand store owns window positions, focus order, minimisation and themes.\n• **Motion:** Framer Motion handles drag physics, focus transitions and the dock.\n• **Surfaces:** Tailwind CSS 4 tokens keep one warm palette across all windows.\n\nEach app is an isolated module, so the terminal, project explorer and assistant share the same shell without sharing state.',
  'explain neuroscan architecture': 'NeuroScan AI is a lightweight medical inference pipeline:\n\n• **Model:** an EfficientNetB0 backbone trained with transfer learning across four tumour classes, reaching 94.05% validation accuracy.\n• **Deployment:** exported to ONNX and compressed to roughly 35 MB, then executed on CPU through ONNX Runtime on Vercel serverless.\n• **Guardrails:** grayscale, contrast and border checks reject non-MRI inputs before inference.\n• **Interface:** a clinical workbench with confidence scoring and MRI visualisation. Inference stays under 150 ms.',
  'explain studyflow architecture': 'StudyFlow turns a syllabus into a working week:\n\n• **Interface:** Next.js 16 App Router, TypeScript and Tailwind CSS 4.\n• **Generation:** Google Gemini through the Vercel AI SDK, with JSON schemas validated by Zod.\n• **Data:** Supabase for auth, Postgres and storage, protected by row-level security.\n• **Result:** a 99.8% schedule generation success rate, with onboarding reduced from 20 minutes to under 45 seconds.',
  'show ai projects': 'Three projects sit closest to AI work:\n\n• **NeuroScan AI** — MRI tumour classification with an ONNX model and clinical guardrails.\n• **StudyFlow** — Gemini-generated study plans backed by Supabase.\n• **CodeViz** — a step-through visualiser for algorithms, data structures and call stacks.\n\nAsk about any of them and I can go deeper.',
  'what technologies does prs use': 'The working stack is deliberately small:\n\n• **Languages:** Python, TypeScript, Java, C++.\n• **Frontend:** React 19, Next.js 16, Tailwind CSS 4, Framer Motion.\n• **Backend:** Node.js, FastAPI, Firebase, Supabase.\n• **AI:** TensorFlow, PyTorch, ONNX Runtime, Gemini.\n• **Tools:** Git, Docker, Vercel.',
  availability: 'Prem is open to internships and early-career software roles, particularly around AI engineering, full-stack product work and developer tooling.\n\nThe fastest route is email: **sargarapremrajesh@gmail.com**. You can also use the contact window and the form will reach the same inbox.',
  contact: 'You can reach Prem at **sargarapremrajesh@gmail.com**, or open the Contact window to send a message directly. He is also on GitHub as **@PREMRAJESH** and LinkedIn at **in/gecdhd-comp-prem-sargara**.',
}

const suggestions = [
  'What has Prem built?',
  'Explain NeuroScan architecture',
  'What is his stack?',
  'Is he available?',
]

function getAIResponse(query: string): string {
  const lowerQuery = query.toLowerCase()

  for (const [key, response] of Object.entries(specializedResponses)) {
    if (lowerQuery.includes(key)) return response
  }

  if (lowerQuery.includes('available') || lowerQuery.includes('intern') || lowerQuery.includes('hire')) {
    return specializedResponses.availability
  }

  if (lowerQuery.includes('contact') || lowerQuery.includes('email') || lowerQuery.includes('reach')) {
    return specializedResponses.contact
  }

  if (lowerQuery.includes('project') || lowerQuery.includes('built') || lowerQuery.includes('work')) {
    return 'Prem has shipped four portfolio projects:\n\n• **NeuroScan AI** — brain tumour detection, 94.05% validation accuracy.\n• **StudyFlow** — an AI study planner built with Gemini and Supabase.\n• **Nimbus X** — a real-time Android messaging app.\n• **CodeViz** — a client-side algorithm visualiser.\n\nWhich one should I open up?'
  }

  return 'I can explain the projects, the stack, or how this workspace is built. Try asking about NeuroScan, StudyFlow, CodeViz or Nimbus X — or ask whether Prem is available for an internship.'
}

interface AIAssistantWindowProps {
  initialQuery?: string | null
}

export function AIAssistantWindow({ initialQuery }: AIAssistantWindowProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        "I'm a small assistant for this portfolio. Ask about a project, the stack, or how PRS—OS is put together.",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const lastQuery = useRef<string | null>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  useEffect(() => {
    if (initialQuery && initialQuery !== lastQuery.current) {
      lastQuery.current = initialQuery
      handleProcessQuery(initialQuery)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

    await new Promise(resolve => setTimeout(resolve, 650 + Math.random() * 450))

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: getAIResponse(query),
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

  const showSuggestions = messages.length === 1 && !isTyping

  return (
    <div className="flex flex-col h-full font-sans">
      {/* Header */}
      <div className="px-5 py-3.5 border-b border-hairline shrink-0 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="w-6 h-6 rounded-md border border-hairline bg-foreground/[0.03] flex items-center justify-center">
            <Sparkles className="w-3 h-3 text-primary" strokeWidth={1.8} />
          </span>
          <div>
            <p className="text-[9px] font-mono tracking-[0.13em] uppercase text-muted-foreground/40 leading-none">
              Assistant
            </p>
            <p className="text-[11.5px] text-foreground/75 mt-1 leading-none">Workspace guide</p>
          </div>
        </div>
        <span className="flex items-center gap-1.5 text-[9px] font-mono tracking-[0.08em] uppercase text-muted-foreground/40">
          <span className="w-1 h-1 rounded-full bg-accent" />
          Local context
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-5 custom-scrollbar">
        <AnimatePresence initial={false}>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className={`mb-5 flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'assistant' ? (
                <div className="max-w-[95%]">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Sparkles className="w-2.5 h-2.5 text-primary/70" />
                    <span className="text-[8.5px] font-mono tracking-[0.12em] uppercase text-muted-foreground/35">
                      PRS—OS
                    </span>
                  </div>
                  <div className="text-[12px] leading-[1.7] text-muted-foreground/85">
                    {message.content.split('\n').map((line, i) => (
                      <span key={i} className="block min-h-[2px]">
                        {line.split(/(\*\*.*?\*\*)/g).map((part, j) => {
                          if (part.startsWith('**') && part.endsWith('**')) {
                            return <strong key={j} className="text-foreground/90 font-medium">{part.slice(2, -2)}</strong>
                          }
                          return part
                        })}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="max-w-[85%] rounded-lg rounded-br-sm bg-primary/[0.09] border border-primary/15 px-3.5 py-2.5">
                  <p className="text-[12px] leading-relaxed text-foreground/90 whitespace-pre-wrap">
                    {message.content}
                  </p>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {showSuggestions && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-2 flex flex-wrap gap-1.5"
          >
            {suggestions.map(s => (
              <button
                key={s}
                onClick={() => handleProcessQuery(s)}
                className="px-2 py-1 rounded border border-hairline bg-foreground/[0.02] text-[10px] text-muted-foreground/65 hover:text-foreground hover:border-hairline-strong hover:bg-foreground/[0.04] transition-colors"
              >
                {s}
              </button>
            ))}
          </motion.div>
        )}

        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground/40"
          >
            <Loader2 className="w-3 h-3 animate-spin" />
            Reading the workspace…
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3.5 border-t border-hairline shrink-0">
        <form onSubmit={handleSubmit} className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about a project or the stack…"
            className="w-full h-10 rounded-md bg-foreground/[0.025] border border-hairline pl-3 pr-11 text-[12px] text-foreground/90 placeholder:text-muted-foreground/35 focus:border-primary/40 focus:bg-foreground/[0.04] outline-none transition-colors"
            disabled={isTyping}
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            aria-label="Send message"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded flex items-center justify-center bg-primary text-primary-foreground disabled:opacity-25 hover:bg-primary/90 transition-all"
          >
            {isTyping ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ArrowUp className="w-3.5 h-3.5" />}
          </button>
        </form>
        <p className="mt-2 text-[9px] font-mono text-muted-foreground/30 text-center">
          Answers come from the portfolio&apos;s local context
        </p>
      </div>
    </div>
  )
}
