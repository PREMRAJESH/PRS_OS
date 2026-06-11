'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Github, 
  Linkedin, 
  Code2, 
  FileText,
  Send,
  Terminal,
  ExternalLink,
  CheckCircle2,
  Loader2
} from 'lucide-react'

const contactLinks = [
  {
    title: 'GitHub',
    desc: 'Explore open source systems, AI applications, and full-stack codebases.',
    url: 'github.com/PREMRAJESH',
    href: 'https://github.com/PREMRAJESH',
    icon: Github,
    color: 'hover:border-white/30',
  },
  {
    title: 'LinkedIn',
    desc: 'Connect professionally for opportunities, collaborations, and tech discussions.',
    url: 'linkedin.com/in/prem-sargara',
    href: 'https://www.linkedin.com/in/gecdhd-comp-prem-sargara/',
    icon: Linkedin,
    color: 'hover:border-blue-500/30',
  },
  {
    title: 'LeetCode',
    desc: 'View solved DSA problems, sorting algorithms, and challenge badges.',
    url: 'leetcode.com/u/Sargara_Prem',
    href: 'https://leetcode.com/u/Sargara_Prem/',
    icon: Code2,
    color: 'hover:border-yellow-500/30',
  },
  {
    title: 'Resume',
    desc: 'Download the full technical resume and credentials document.',
    url: 'Download PDF',
    href: '/Resume.pdf',
    icon: FileText,
    color: 'hover:border-amber-500/30',
  },
]

export function QuickLinksWindow() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.subject || !formData.message) return
    
    setStatus('sending')
    
    try {
      const res = await fetch('/api/send-mail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      
      if (!res.ok) throw new Error('Failed to send')
      
      setStatus('sent')
      setTimeout(() => {
        setStatus('idle')
        setFormData({ name: '', email: '', subject: '', message: '' })
      }, 4000)
    } catch {
      setStatus('idle')
    }
  }

  return (
    <div className="h-full flex flex-col bg-[#0a0a0b] font-mono selection:bg-primary/30">
      {/* Title Bar */}
      <div className="h-9 flex items-center justify-between px-3 border-b border-white/10 bg-[#0c0c0e] shrink-0">
        <div className="flex items-center gap-2">
          <Terminal className="w-3 h-3 text-primary" />
          <span className="text-[10px] font-bold text-white tracking-wider">CONTACT SYSTEM</span>
        </div>
        <div className="text-[8px] text-muted-foreground font-mono">
          PRS-MAIL v1.0 — <span className="text-emerald-400">Online</span>
        </div>
      </div>

      {/* Split View Content */}
      <div className="flex-1 flex min-h-0">
        {/* Left Panel — Contact Network */}
        <div className="w-[40%] border-r border-white/10 flex flex-col">
          <div className="px-3 py-2 border-b border-white/5 bg-white/[0.01] shrink-0">
            <h2 className="text-[11px] font-bold text-white tracking-wider">CONTACT NETWORK</h2>
            <p className="text-[9px] text-muted-foreground mt-0.5">Connect through any platform</p>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
            {contactLinks.map((link, idx) => (
              <motion.a
                key={link.title}
                href={link.href}
                target={link.title === 'Resume' ? undefined : '_blank'}
                rel={link.title === 'Resume' ? undefined : 'noopener noreferrer'}
                download={link.title === 'Resume' ? 'P.R.S_Resume.pdf' : undefined}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.04 }}
                className={`block p-2.5 rounded-lg border border-white/5 bg-white/[0.01] transition-all group ${link.color}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-2.5">
                    <div className="p-1.5 rounded-lg bg-white/5 text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-colors shrink-0">
                      <link.icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-xs font-bold text-white group-hover:text-primary transition-colors">{link.title}</h3>
                      <p className="text-[9px] text-muted-foreground leading-relaxed mt-0.5">{link.desc}</p>
                      <span className="text-[8px] text-muted-foreground/60 font-mono mt-1 block">{link.url}</span>
                    </div>
                  </div>
                  <ExternalLink className="w-3 h-3 text-muted-foreground/30 group-hover:text-primary transition-colors shrink-0 mt-1.5" />
                </div>
              </motion.a>
            ))}
          </div>
        </div>

        {/* Right Panel — PRS-MAIL Client */}
        <div className="flex-[60%] flex flex-col min-w-0">
          <AnimatePresence mode="wait">
            {status === 'sent' ? (
              <motion.div
                key="success"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex items-center justify-center"
              >
                <div className="text-center space-y-4 p-6">
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  >
                    <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                  </motion.div>
                  <div>
                    <h3 className="text-sm font-bold text-emerald-400 tracking-wider mb-1">
                      TRANSMISSION SENT
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Message successfully delivered to Prem Rajesh.
                    </p>
                  </div>
                  <div className="inline-block text-left text-[10px] text-muted-foreground/60 space-y-0.5 font-mono p-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5">
                    <p>Status: <span className="text-emerald-400">Delivered</span></p>
                    <p>Protocol: <span className="text-emerald-400">PRS-MAIL</span></p>
                    <p>Encryption: <span className="text-emerald-400">AES-256</span></p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col min-h-0"
              >
                {/* Compact horizontal status bar */}
                <div className="shrink-0 flex items-center gap-3 px-4 py-1.5 border-b border-white/5 bg-white/[0.01] text-[9px] text-muted-foreground font-mono">
                  <div className="flex items-center gap-1.5 shrink-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(52,211,153,0.5)]" />
                    <span className="text-primary font-bold text-[10px] tracking-wider">PRS-MAIL v1.0</span>
                  </div>
                  <span className="text-white/10">|</span>
                  <span className="shrink-0">Online</span>
                  <span className="text-white/10">|</span>
                  <span className="truncate">Accepting Opportunities</span>
                  <span className="text-white/10 max-md:hidden">|</span>
                  <span className="max-md:hidden shrink-0">Response: <span className="text-primary font-bold">&lt;24h</span></span>
                </div>

                {/* Form with scrollable fields and sticky send button */}
                <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0">
                  <div className="flex-1 overflow-y-auto space-y-2.5 px-4 py-3">
                    <div className="space-y-1">
                      <label className="text-[10px] text-muted-foreground font-bold tracking-wider">&gt; NAME_</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-white/10 bg-white/[0.02] text-xs text-white font-mono focus:border-primary/50 focus:outline-none transition-colors placeholder:text-muted-foreground/40"
                        placeholder="Enter your name"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-muted-foreground font-bold tracking-wider">&gt; EMAIL_</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-white/10 bg-white/[0.02] text-xs text-white font-mono focus:border-primary/50 focus:outline-none transition-colors placeholder:text-muted-foreground/40"
                        placeholder="your@email.com"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-muted-foreground font-bold tracking-wider">&gt; SUBJECT_</label>
                      <input
                        type="text"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-white/10 bg-white/[0.02] text-xs text-white font-mono focus:border-primary/50 focus:outline-none transition-colors placeholder:text-muted-foreground/40"
                        placeholder="What is this about?"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-muted-foreground font-bold tracking-wider">&gt; MESSAGE_</label>
                      <textarea
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        rows={4}
                        className="w-full px-3 py-2 rounded-lg border border-white/10 bg-white/[0.02] text-xs text-white font-mono focus:border-primary/50 focus:outline-none transition-colors resize-none placeholder:text-muted-foreground/40"
                        placeholder="Type your message..."
                        required
                      />
                    </div>
                  </div>

                  <div className="shrink-0 px-4 py-2.5 border-t border-white/5">
                    <button
                      type="submit"
                      disabled={status === 'sending'}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-black text-xs font-bold tracking-wider hover:bg-primary/90 transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(0,255,255,0.15)]"
                    >
                      {status === 'sending' ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          TRANSMITTING...
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          SEND TRANSMISSION
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
