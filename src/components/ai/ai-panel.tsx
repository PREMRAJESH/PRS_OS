'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useOSStore } from '@/store/os-store'
import { aiSuggestions } from '@/data/workspace'
import {
  Sparkles,
  MessageSquare,
  ChevronRight,
  ChevronLeft,
  Brain,
  Send,
  User,
  Bot,
  Command,
} from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export function AIPanel() {
  const [isExpanded, setIsExpanded] = useState(true)
  const [inputValue, setInputValue] = useState('')
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm your PRS-OS Assistant. I can help you explore projects, explain architectures, or answer questions about my engineering focus. What would you like to see?"
    }
  ])
  
  const scrollRef = useRef<HTMLDivElement>(null)
  const { openWindow } = useOSStore()

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = (text?: string) => {
    const content = text || inputValue
    if (!content.trim()) return

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content }
    setMessages(prev => [...prev, userMsg])
    setInputValue('')

    // Mock AI response
    setTimeout(() => {
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I'm analyzing your request about "${content}". I've indexed all project data and engineering focus areas. I can provide a deep dive into that specific area if you'd like.`
      }
      setMessages(prev => [...prev, assistantMsg])
    }, 800)
  }

  return (
    <motion.aside
      initial={false}
      animate={{ width: isExpanded ? 340 : 52 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      className="h-full border-l border-border/40 bg-background/40 backdrop-blur-xl flex flex-col relative z-20 shrink-0"
    >
      {/* Header */}
      <div className="h-14 flex items-center justify-between px-4 border-b border-border/30 shrink-0">
        <AnimatePresence mode="wait">
          {isExpanded && (
            <motion.div
              key="label"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex items-center gap-2.5"
            >
              <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                <Brain className="w-3.5 h-3.5 text-primary" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/80">Assistant</span>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1.5 rounded-lg hover:bg-secondary/50 transition-colors text-muted-foreground hover:text-foreground ml-auto shrink-0"
        >
          {isExpanded ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {isExpanded ? (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Messages Area */}
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar"
          >
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-6 h-6 rounded-full shrink-0 flex items-center justify-center border border-border/50 ${msg.role === 'assistant' ? 'bg-primary/10 text-primary' : 'bg-secondary/50 text-muted-foreground'}`}>
                  {msg.role === 'assistant' ? <Bot className="w-3 h-3" /> : <User className="w-3 h-3" />}
                </div>
                <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed border ${
                  msg.role === 'assistant' 
                    ? 'bg-secondary/20 border-border/40 text-foreground' 
                    : 'bg-primary border-primary/20 text-primary-foreground'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-border/30 bg-background/20 backdrop-blur-md">
            {/* Suggested Tags */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {aiSuggestions.map((s) => (
                <button
                  key={s.id}
                  onClick={() => handleSend(s.title)}
                  className="px-2.5 py-1.5 rounded-lg bg-secondary/30 border border-border/50 hover:border-primary/40 hover:bg-primary/5 transition-all text-[10px] text-muted-foreground hover:text-primary"
                >
                  {s.title}
                </button>
              ))}
            </div>

            <div className="relative group">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask PRS-OS anything..."
                className="w-full bg-secondary/20 border border-border/50 rounded-xl py-3 pl-4 pr-12 text-xs focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/50"
              />
              <button
                onClick={() => handleSend()}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity shadow-lg shadow-primary/20"
              >
                <Send className="w-3 h-3" />
              </button>
            </div>
            <div className="mt-2 flex items-center justify-center gap-1.5 opacity-30">
              <Command className="w-2.5 h-2.5" />
              <span className="text-[9px] font-medium tracking-widest uppercase">Enter to send</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 py-6 px-2">
          <IconButton icon={Brain} onClick={() => setIsExpanded(true)} active />
          <IconButton icon={MessageSquare} onClick={() => openWindow('ai-assistant')} />
          <IconButton icon={Sparkles} onClick={() => setIsExpanded(true)} />
        </div>
      )}
    </motion.aside>
  )
}

function IconButton({ icon: Icon, onClick, active }: { icon: any; onClick: () => void; active?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`p-2.5 rounded-xl transition-all border ${
        active
          ? 'bg-primary/10 text-primary border-primary/20 shadow-lg shadow-primary/5'
          : 'bg-secondary/20 text-muted-foreground border-border/50 hover:text-foreground hover:bg-secondary/40 hover:border-border'
      }`}
    >
      <Icon className="w-4 h-4" />
    </button>
  )
}
