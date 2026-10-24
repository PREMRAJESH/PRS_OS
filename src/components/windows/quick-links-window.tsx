'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Github,
  Linkedin,
  Code2,
  FileText,
  Send,
  ArrowUpRight,
  Check,
  Loader2,
  AlertCircle,
} from 'lucide-react'

const contactLinks = [
  {
    title: 'GitHub',
    url: 'github.com/PREMRAJESH',
    href: 'https://github.com/PREMRAJESH',
    icon: Github,
  },
  {
    title: 'LinkedIn',
    url: 'linkedin.com/in/prem-sargara',
    href: 'https://www.linkedin.com/in/gecdhd-comp-prem-sargara/',
    icon: Linkedin,
  },
  {
    title: 'LeetCode',
    url: 'leetcode.com/u/Sargara_Prem',
    href: 'https://leetcode.com/u/Sargara_Prem/',
    icon: Code2,
  },
  {
    title: 'Résumé',
    url: 'Download PDF',
    href: '/Resume.pdf',
    icon: FileText,
  },
]

type Status = 'idle' | 'sending' | 'sent' | 'error'

export function QuickLinksWindow() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState<Status>('idle')

  const update = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [field]: e.target.value })
    if (status === 'error') setStatus('idle')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setStatus('error')
      return
    }

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
      }, 5000)
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="h-full flex flex-col font-sans">
      {/* Header */}
      <div className="px-6 py-5 border-b border-hairline shrink-0">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-eyebrow">Contact</p>
            <h2 className="font-display text-[1.9rem] leading-none tracking-[-0.02em] mt-1.5">
              Say hello.
            </h2>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-[9.5px] font-mono tracking-[0.08em] uppercase text-muted-foreground/55 mt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            Replies within 24h
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-y-auto custom-scrollbar md:overflow-hidden">
        {/* Links */}
        <div className="md:w-[38%] md:min-w-[200px] border-b md:border-b-0 md:border-r border-hairline flex flex-col shrink-0">
          <div className="px-5 py-3 border-b border-hairline hidden md:block">
            <span className="text-[9px] font-mono tracking-[0.13em] uppercase text-muted-foreground/40">
              Elsewhere
            </span>
          </div>

          <div className="grid grid-cols-2 gap-1.5 p-2.5 custom-scrollbar md:block md:flex-1 md:overflow-y-auto">
            {contactLinks.map((link, idx) => {
              const isResume = link.title === 'Résumé'
              return (
                <motion.a
                  key={link.title}
                  href={link.href}
                  target={isResume ? undefined : '_blank'}
                  rel={isResume ? undefined : 'noopener noreferrer'}
                  download={isResume ? 'P.R.S_Resume.pdf' : undefined}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.035, duration: 0.3 }}
                  className="group flex items-center gap-2.5 rounded-lg border border-hairline bg-foreground/[0.02] px-2.5 py-2 transition-colors hover:bg-foreground/[0.035] md:rounded-md md:border-0 md:bg-transparent md:px-2.5 md:py-2.5"
                >
                  <link.icon className="w-3.5 h-3.5 shrink-0 text-muted-foreground/40 group-hover:text-primary transition-colors" strokeWidth={1.7} />
                  <div className="min-w-0 flex-1">
                    <div className="text-[11.5px] text-foreground/80 group-hover:text-foreground transition-colors">
                      {link.title}
                    </div>
                    <div className="hidden text-[9.5px] font-mono text-muted-foreground/40 truncate mt-0.5 md:block">
                      {link.url}
                    </div>
                  </div>
                  <ArrowUpRight className="hidden w-3 h-3 shrink-0 text-muted-foreground/25 group-hover:text-primary transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 md:block" />
                </motion.a>
              )
            })}

            <div className="col-span-2 mt-1 border-t border-hairline px-1 pt-2.5 md:mx-2.5 md:mt-2 md:px-0 md:pt-3">
              <div className="text-[9px] font-mono tracking-[0.1em] uppercase text-muted-foreground/35">
                Direct
              </div>
              <a
                href="mailto:sargarapremrajesh@gmail.com"
                className="mt-1 block text-[10px] font-mono text-muted-foreground/60 hover:text-foreground transition-colors break-all"
              >
                sargarapremrajesh@gmail.com
              </a>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="flex-1 flex flex-col min-w-0 min-h-0">
          <AnimatePresence mode="wait">
            {status === 'sent' ? (
              <motion.div
                key="success"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex items-center justify-center p-7"
              >
                <div className="text-center max-w-[260px]">
                  <div className="mx-auto w-10 h-10 rounded-full border border-accent/30 bg-accent/10 flex items-center justify-center">
                    <Check className="w-4 h-4 text-accent" strokeWidth={2.5} />
                  </div>
                  <h3 className="mt-4 font-display text-[1.5rem] leading-none">Message sent</h3>
                  <p className="mt-2 text-[11.5px] leading-relaxed text-muted-foreground/65">
                    Thanks for reaching out. I usually reply within a day.
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col min-h-0"
              >
                <div className="px-5 py-4 space-y-3 custom-scrollbar md:flex-1 md:overflow-y-auto">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Field label="Name">
                      <input
                        type="text"
                        value={formData.name}
                        onChange={update('name')}
                        placeholder="Your name"
                        required
                        className={inputClass}
                      />
                    </Field>
                    <Field label="Email">
                      <input
                        type="email"
                        value={formData.email}
                        onChange={update('email')}
                        placeholder="you@example.com"
                        required
                        className={inputClass}
                      />
                    </Field>
                  </div>

                  <Field label="Subject">
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={update('subject')}
                      placeholder="What is this about?"
                      required
                      className={inputClass}
                    />
                  </Field>

                  <Field label="Message">
                    <textarea
                      value={formData.message}
                      onChange={update('message')}
                      rows={4}
                      placeholder="A few lines are plenty."
                      required
                      className={`${inputClass} resize-none`}
                    />
                  </Field>

                  <AnimatePresence>
                    {status === 'error' && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2 text-[10.5px] text-destructive"
                        role="alert"
                      >
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        Couldn&apos;t send that. Check your connection, or email me directly.
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="shrink-0 px-5 py-3 border-t border-hairline flex items-center justify-end gap-3 sm:justify-between">
                  <span className="hidden sm:block text-[9.5px] font-mono text-muted-foreground/35">
                    Or write to sargarapremrajesh@gmail.com
                  </span>
                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="flex h-9 w-full items-center justify-center gap-2 rounded-md bg-primary px-3.5 text-[11.5px] font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-55 sm:h-8 sm:w-auto"
                  >
                    {status === 'sending' ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Sending
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        Send message
                      </>
                    )}
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

const inputClass =
  'w-full px-2.5 py-1.5 rounded-md border border-hairline bg-foreground/[0.025] text-[12px] text-foreground/90 placeholder:text-muted-foreground/30 focus:border-primary/45 focus:bg-foreground/[0.04] focus:outline-none transition-colors'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1">
      <span className="text-[9px] font-mono tracking-[0.12em] uppercase text-muted-foreground/45">
        {label}
      </span>
      {children}
    </label>
  )
}
