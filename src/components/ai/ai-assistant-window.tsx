'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUp, Sparkles, Loader2, Square } from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  state?: 'streaming' | 'cancelled'
}

const WELCOME =
  "Ask me about Prem's projects, stack, experience or availability. I answer from his portfolio — and point you to his links when a question needs the latest information."

const suggestions = [
  "What's Prem's latest project?",
  'What has Prem built?',
  'Explain NeuroScan architecture',
  'How do I contact Prem?',
]

const FALLBACK =
  'I could not reach the assistant service just now. You can still browse Prem’s latest work at **https://github.com/PREMRAJESH**, connect on **https://www.linkedin.com/in/gecdhd-comp-prem-sargara/**, or email **sargarapremrajesh@gmail.com**.'

const STREAM_ERROR =
  'The connection was interrupted before the answer finished. Please try again, or use the links above.'

interface AIAssistantWindowProps {
  initialQuery?: string | null
}

export function AIAssistantWindow({ initialQuery }: AIAssistantWindowProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: WELCOME,
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const lastQuery = useRef<string | null>(null)
  const inFlight = useRef(false)
  const abortRef = useRef<AbortController | null>(null)

  // Token updates are coalesced so a fast stream cannot re-render per token.
  const streamBuffer = useRef<{ id: string; text: string } | null>(null)
  const streamTimer = useRef<number | null>(null)

  const busy = isTyping || isStreaming

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  // Abort any in-flight request when the window or app screen unmounts.
  useEffect(() => {
    return () => {
      abortRef.current?.abort()
      if (streamTimer.current) window.clearTimeout(streamTimer.current)
    }
  }, [])

  const flushStreamBuffer = useCallback(() => {
    const pending = streamBuffer.current
    if (!pending) return
    streamBuffer.current = null
    setMessages((prev) =>
      prev.map((message) =>
        message.id === pending.id ? { ...message, content: pending.text } : message,
      ),
    )
  }, [])

  const queueStreamUpdate = useCallback(
    (id: string, text: string) => {
      streamBuffer.current = { id, text }
      if (streamTimer.current) return

      streamTimer.current = window.setTimeout(() => {
        streamTimer.current = null
        flushStreamBuffer()
      }, 80)
    },
    [flushStreamBuffer],
  )

  const finishStreamBuffer = useCallback(() => {
    if (streamTimer.current) {
      window.clearTimeout(streamTimer.current)
      streamTimer.current = null
    }
    flushStreamBuffer()
  }, [flushStreamBuffer])

  const setMessage = useCallback((id: string, patch: Partial<Message>) => {
    setMessages((prev) =>
      prev.map((message) => (message.id === id ? { ...message, ...patch } : message)),
    )
  }, [])

  const handleProcessQuery = useCallback(
    async (query: string) => {
      const trimmed = query.trim()
      // Ref guard blocks duplicate submits before React re-renders `busy`.
      if (!trimmed || inFlight.current) return
      inFlight.current = true

      abortRef.current?.abort()
      const controller = new AbortController()
      abortRef.current = controller

      const history = messages
        .filter(
          (message) =>
            message.id !== 'welcome' &&
            message.content.trim().length > 0 &&
            message.state !== 'cancelled',
        )
        .map((message) => ({ role: message.role, content: message.content }))

      const userId = `u-${Date.now()}`
      const assistantId = `a-${Date.now()}`

      setMessages((prev) => [
        ...prev,
        {
          id: userId,
          role: 'user',
          content: trimmed,
          timestamp: new Date(),
        },
        {
          id: assistantId,
          role: 'assistant',
          content: '',
          timestamp: new Date(),
          state: 'streaming',
        },
      ])
      setIsTyping(true)
      setIsStreaming(false)

      try {
        const response = await fetch('/api/assistant', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: trimmed, history, stream: true }),
          signal: controller.signal,
        })

        const contentType = response.headers.get('content-type') || ''

        if (!response.ok) {
          const data = (await response.json().catch(() => null)) as
            | { error?: string }
            | null

          const content = data?.error
            ? `${data.error}\n\nFor the latest details, check **https://github.com/PREMRAJESH**, or email **sargarapremrajesh@gmail.com**.`
            : FALLBACK

          setMessage(assistantId, { content, state: undefined })
          return
        }

        // Graceful fallback when streaming is unavailable.
        if (contentType.includes('application/json') || !response.body) {
          const data = (await response.json().catch(() => null)) as
            | { text?: string }
            | null
          setMessage(assistantId, {
            content: data?.text || FALLBACK,
            state: undefined,
          })
          return
        }

        setIsTyping(false)
        setIsStreaming(true)

        const reader = response.body.getReader()
        const decoder = new TextDecoder()
        let acc = ''

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          acc += decoder.decode(value, { stream: true })
          queueStreamUpdate(assistantId, acc)
        }

        acc += decoder.decode()
        finishStreamBuffer()
        setMessage(assistantId, { content: acc || FALLBACK, state: undefined })
      } catch (error) {
        const aborted =
          error instanceof DOMException && error.name === 'AbortError'

        finishStreamBuffer()

        if (aborted) {
          setMessages((prev) =>
            prev.map((message) =>
              message.id === assistantId
                ? {
                    ...message,
                    content: message.content || 'Response stopped.',
                    state: 'cancelled',
                  }
                : message,
            ),
          )
        } else {
          setMessages((prev) =>
            prev.map((message) =>
              message.id === assistantId
                ? {
                    ...message,
                    content: message.content
                      ? `${message.content}\n\n${STREAM_ERROR}`
                      : FALLBACK,
                    state: undefined,
                  }
                : message,
            ),
          )
        }
      } finally {
        inFlight.current = false
        setIsTyping(false)
        setIsStreaming(false)
        if (abortRef.current === controller) abortRef.current = null
      }
    },
    [messages, setMessage, queueStreamUpdate, finishStreamBuffer],
  )

  useEffect(() => {
    if (initialQuery && initialQuery !== lastQuery.current) {
      lastQuery.current = initialQuery
      handleProcessQuery(initialQuery)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery])

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!input.trim() || busy) return
    const query = input.trim()
    setInput('')
    handleProcessQuery(query)
  }

  const stopResponse = () => {
    abortRef.current?.abort()
  }

  const showSuggestions = messages.length === 1 && !busy

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
            <p className="text-[11.5px] text-foreground/75 mt-1 leading-none">
              Prem&apos;s workspace guide
            </p>
          </div>
        </div>
        <span className="flex items-center gap-1.5 text-[9px] font-mono tracking-[0.08em] uppercase text-muted-foreground/40">
          <span className="w-1 h-1 rounded-full bg-accent" />
          Scoped to Prem
        </span>
      </div>

      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto px-5 py-5 custom-scrollbar"
        aria-live="polite"
        aria-atomic="false"
      >
        <AnimatePresence initial={false}>
          {messages.map((message) => {
            // The placeholder stays invisible until the first token arrives.
            if (
              message.role === 'assistant' &&
              !message.content &&
              message.state === 'streaming'
            ) {
              return null
            }

            return (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className={`mb-5 flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.role === 'assistant' ? (
                  <div className="max-w-[95%]">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <Sparkles className="w-2.5 h-2.5 text-primary/70" />
                      <span className="text-[8.5px] font-mono tracking-[0.12em] uppercase text-muted-foreground/35">
                        PRS—OS
                      </span>
                      {message.state === 'cancelled' && (
                        <span className="text-[8px] font-mono tracking-[0.1em] uppercase text-muted-foreground/30">
                          · stopped
                        </span>
                      )}
                    </div>
                    <div className="text-[12.5px] md:text-[12px] leading-[1.7] text-muted-foreground/85">
                      {message.content.split('\n').map((line, i) => (
                        <span key={i} className="block min-h-[2px]">
                          {renderInline(line)}
                        </span>
                      ))}
                      {message.state === 'streaming' && (
                        <span
                          aria-hidden="true"
                          className="mt-1 inline-block h-3 w-[2px] animate-pulse bg-primary/60 align-middle"
                        />
                      )}
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
            )
          })}
        </AnimatePresence>

        {showSuggestions && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-2 flex flex-wrap gap-1.5"
          >
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => handleProcessQuery(suggestion)}
                className="px-2 py-1 rounded border border-hairline bg-foreground/[0.02] text-[10px] text-muted-foreground/65 hover:text-foreground hover:border-hairline-strong hover:bg-foreground/[0.04] transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </motion.div>
        )}

        {isTyping && !isStreaming && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground/40"
          >
            <Loader2 className="w-3 h-3 animate-spin" />
            Checking Prem&apos;s context…
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
            onChange={(event) => setInput(event.target.value)}
            placeholder={isStreaming ? 'Streaming answer…' : 'Ask about Prem…'}
            className="w-full h-10 rounded-md bg-foreground/[0.025] border border-hairline pl-3 pr-11 text-[12px] text-foreground/90 placeholder:text-muted-foreground/35 focus:border-primary/40 focus:bg-foreground/[0.04] outline-none transition-colors"
            disabled={busy}
          />

          {busy ? (
            <button
              type="button"
              onClick={stopResponse}
              aria-label="Stop response"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded flex items-center justify-center bg-primary/90 text-primary-foreground hover:bg-primary transition-all"
            >
              <Square className="w-2.5 h-2.5" strokeWidth={2.4} />
            </button>
          ) : (
            <button
              type="submit"
              disabled={!input.trim()}
              aria-label="Send message"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded flex items-center justify-center bg-primary text-primary-foreground disabled:opacity-25 hover:bg-primary/90 transition-all"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          )}
        </form>
        <p className="mt-2 text-[9px] font-mono text-muted-foreground/30 text-center">
          Prem-related questions only · live details come from his links
        </p>
      </div>
    </div>
  )
}

/* ── Tiny renderer: **bold**, URLs and email addresses become links ── */

const INLINE_TOKEN =
  /(\*\*[^*]+\*\*|https?:\/\/[^\s<>()]+|[\w.+-]+@[\w-]+\.[\w.-]+)/g

function renderInline(line: string) {
  return line.split(INLINE_TOKEN).map((token, index) => {
    if (token.startsWith('**') && token.endsWith('**') && token.length > 4) {
      return (
        <strong key={index} className="text-foreground/90 font-medium">
          {token.slice(2, -2)}
        </strong>
      )
    }

    if (/^https?:\/\//.test(token)) {
      const trailing = token.match(/[.,;:!?]+$/)?.[0] ?? ''
      const href = trailing ? token.slice(0, -trailing.length) : token
      return (
        <span key={index}>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary/90 underline decoration-primary/30 underline-offset-2 break-words hover:decoration-primary"
          >
            {href}
          </a>
          {trailing}
        </span>
      )
    }

    if (/^[\w.+-]+@[\w-]+\.[\w.-]+$/.test(token)) {
      return (
        <a
          key={index}
          href={`mailto:${token}`}
          className="text-primary/90 underline decoration-primary/30 underline-offset-2 break-words hover:decoration-primary"
        >
          {token}
        </a>
      )
    }

    return token
  })
}
