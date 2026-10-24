import { randomUUID } from 'node:crypto'
import {
  MAX_BODY_BYTES,
  MODEL,
  PROMPT_VERSION,
  RATE_LIMIT_MAX,
} from '@/lib/assistant/config'
import {
  EMPTY_REPLY,
  KNOWLEDGE_VERSION,
  MIDSTREAM_FALLBACK,
  NOT_COVERED_REPLY,
  SCOPE_REFUSAL,
  UNRELATED_REFUSAL,
  buildSystemPrompt,
  needsLiveInfo,
  referencesPrem,
} from '@/lib/assistant/knowledge'
import { formatLiveData, getGitHubSnapshot } from '@/lib/assistant/github'
import {
  AssistantError,
  generateAssistant,
  streamAssistant,
} from '@/lib/assistant/provider'
import { logAssistant } from '@/lib/assistant/log'
import { clientIp, corsHeaders, isAllowedOrigin } from '@/lib/assistant/origin'
import { acquireConcurrency, checkRateLimit } from '@/lib/assistant/rate-limit'
import {
  assistantRequestSchema,
  friendlyValidationError,
  sanitizeAnswer,
  toGeminiTurns,
  type GeminiTurn,
} from '@/lib/assistant/validation'

export const runtime = 'nodejs'
export const maxDuration = 30

/* ─────────────────────────────────────────────────────────────
   PRS—OS Assistant endpoint.

   The browser never sees a credential. This route validates input,
   applies per-IP and concurrency limits, optionally enriches the
   prompt with cached public GitHub data, and calls Gemini. Streaming
   is proxied as plain text so the client stays small.
   ───────────────────────────────────────────────────────────── */

function json(
  body: unknown,
  status: number,
  request: Request,
  extra?: Record<string, string>,
) {
  const headers = corsHeaders(request)
  headers.set('Content-Type', 'application/json; charset=utf-8')
  headers.set('Cache-Control', 'no-store')
  headers.set('X-Content-Type-Options', 'nosniff')

  for (const [key, value] of Object.entries(extra ?? {})) {
    headers.set(key, value)
  }

  return new Response(JSON.stringify(body), { status, headers })
}

function toAssistantError(error: unknown): AssistantError {
  return error instanceof AssistantError
    ? error
    : new AssistantError('upstream', 502, 'upstream')
}

function errorResponse(error: AssistantError, request: Request) {
  switch (error.code) {
    case 'rate_limit':
      return json(
        { error: 'The assistant is busy right now. Try again in a moment.' },
        429,
        request,
        { 'Retry-After': '20' },
      )
    case 'auth':
      return json(
        {
          error:
            'The assistant is temporarily unavailable because its credentials or model configuration were rejected. Please use the links below to reach Prem directly.',
        },
        503,
        request,
      )
    case 'timeout':
      return json(
        {
          error:
            'The assistant took too long to respond. Please try again, or use the links below to reach Prem directly.',
        },
        504,
        request,
      )
    case 'aborted':
      return json({ error: 'Request cancelled.' }, 499, request)
    case 'blocked':
      return json({ text: SCOPE_REFUSAL }, 200, request)
    default:
      return json(
        {
          error:
            'The assistant is unreachable right now. Use the links below to reach Prem directly.',
        },
        502,
        request,
      )
  }
}

function rateLimitHeaders(limit: number, remaining: number, resetAt: number, backend: string) {
  return {
    'X-RateLimit-Limit': String(limit),
    'X-RateLimit-Remaining': String(remaining),
    'X-RateLimit-Reset': String(Math.ceil(resetAt / 1000)),
    'X-RateLimit-Backend': backend,
  }
}

export async function OPTIONS(request: Request) {
  if (!isAllowedOrigin(request)) {
    return new Response(null, { status: 403 })
  }

  const headers = corsHeaders(request)
  headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS')
  headers.set('Access-Control-Allow-Headers', 'Content-Type')
  headers.set('Access-Control-Max-Age', '86400')
  return new Response(null, { status: 204, headers })
}

const TOO_LARGE = Symbol('body_too_large')

/**
 * Read the request body with a hard byte cap. Content-Length is checked
 * first for the fast path; the streaming read also covers chunked requests
 * that omit it.
 */
async function readLimitedJson(request: Request): Promise<unknown | typeof TOO_LARGE> {
  const declared = Number(request.headers.get('content-length') || 0)
  if (declared > MAX_BODY_BYTES) return TOO_LARGE
  if (!request.body) return null

  const reader = request.body.getReader()
  const chunks: Uint8Array[] = []
  let total = 0

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      total += value.byteLength
      if (total > MAX_BODY_BYTES) {
        await reader.cancel().catch(() => {})
        return TOO_LARGE
      }

      chunks.push(value)
    }
  } finally {
    reader.releaseLock()
  }

  if (total === 0) return null

  const bytes = new Uint8Array(total)
  let offset = 0
  for (const chunk of chunks) {
    bytes.set(chunk, offset)
    offset += chunk.byteLength
  }

  return JSON.parse(new TextDecoder().decode(bytes))
}

export async function POST(request: Request) {
  const startedAt = Date.now()
  const requestId = randomUUID()

  if (!isAllowedOrigin(request)) {
    return json(
      { error: 'This endpoint is only available from the PRS—OS portfolio.' },
      403,
      request,
    )
  }

  let raw: unknown
  try {
    raw = await readLimitedJson(request)
  } catch {
    return json({ error: 'Invalid request.' }, 400, request)
  }

  if (raw === TOO_LARGE) {
    return json({ error: 'That request is too large.' }, 413, request)
  }

  if (raw === null) {
    return json({ error: 'Invalid request.' }, 400, request)
  }

  const parsed = assistantRequestSchema.safeParse(raw)
  if (!parsed.success) {
    return json({ error: friendlyValidationError(parsed.error) }, 400, request)
  }

  const { message, history, stream } = parsed.data

  if (!process.env.GEMINI_API_KEY) {
    return json(
      { error: 'The assistant is not configured yet. Add GEMINI_API_KEY to the environment.' },
      503,
      request,
    )
  }

  const rate = await checkRateLimit(clientIp(request))
  const headers = rateLimitHeaders(
    RATE_LIMIT_MAX,
    rate.remaining,
    rate.resetAt,
    rate.backend,
  )

  if (!rate.allowed) {
    return json(
      { error: 'Too many questions in a short time. Try again in a minute.' },
      429,
      request,
      {
        ...headers,
        'Retry-After': String(
          Math.max(1, Math.ceil((rate.resetAt - Date.now()) / 1000)),
        ),
      },
    )
  }

  const release = acquireConcurrency()
  if (!release) {
    return json(
      {
        error:
          'The assistant is handling several questions right now. Try again in a moment.',
      },
      429,
      request,
      { ...headers, 'Retry-After': '5' },
    )
  }

  const premRelated = referencesPrem(message)
  const wantsLive = needsLiveInfo(message)

  let liveBlock: string | null = null
  let cacheStatus = 'none'
  let system: string
  let turns: GeminiTurn[]

  try {
    if (wantsLive) {
      const github = await getGitHubSnapshot()
      liveBlock = formatLiveData(github)
      cacheStatus = github.cache
    }

    system = buildSystemPrompt({ liveBlock, premRelated })
    turns = toGeminiTurns(history, message)
  } catch {
    release()
    return json(
      {
        error:
          'The assistant is unreachable right now. Use the links below to reach Prem directly.',
      },
      502,
      request,
    )
  }

  if (stream) {
    try {
      return await streamResponse({
        request,
        requestId,
        startedAt,
        system,
        turns,
        premRelated,
        cacheStatus,
        rateBackend: rate.backend,
        rateHeaders: headers,
        release,
      })
    } catch {
      release()
      return errorResponse(
        new AssistantError('upstream', 502, 'stream_setup'),
        request,
      )
    }
  }

  const providerStartedAt = Date.now()

  try {
    const result = await generateAssistant({
      system,
      turns,
      signal: request.signal,
    })
    const providerMs = Date.now() - providerStartedAt

    if (result.blocked) {
      logAssistant({
        requestId,
        mode: 'json',
        status: 200,
        durationMs: Date.now() - startedAt,
        providerMs,
        cache: cacheStatus,
        rateLimit: rate.backend,
        model: MODEL,
        knowledgeVersion: KNOWLEDGE_VERSION,
        promptVersion: PROMPT_VERSION,
      })
      return json({ text: SCOPE_REFUSAL }, 200, request, headers)
    }

    const text = sanitizeAnswer(result.text)

    if (!text) {
      logAssistant({
        requestId,
        mode: 'json',
        status: 200,
        durationMs: Date.now() - startedAt,
        providerMs,
        cache: cacheStatus,
        rateLimit: rate.backend,
        model: MODEL,
        knowledgeVersion: KNOWLEDGE_VERSION,
        promptVersion: PROMPT_VERSION,
      })
      return json({ text: EMPTY_REPLY }, 200, request, headers)
    }

    // A Prem-referencing question must never get the unrelated refusal.
    if (premRelated && UNRELATED_REFUSAL.test(text)) {
      const cleaned = text
        .split(/\n{2,}/)
        .filter((paragraph) => !UNRELATED_REFUSAL.test(paragraph))
        .join('\n\n')
        .trim()

      return json(
        { text: cleaned.length > 60 ? cleaned : NOT_COVERED_REPLY },
        200,
        request,
        headers,
      )
    }

    logAssistant({
      requestId,
      mode: 'json',
      status: 200,
      durationMs: Date.now() - startedAt,
      providerMs,
      cache: cacheStatus,
      rateLimit: rate.backend,
      model: MODEL,
      knowledgeVersion: KNOWLEDGE_VERSION,
      promptVersion: PROMPT_VERSION,
    })

    return json({ text }, 200, request, headers)
  } catch (error) {
    const mapped = toAssistantError(error)
    const providerMs = Date.now() - providerStartedAt

    logAssistant({
      requestId,
      mode: 'json',
      status: mapped.httpStatus,
      durationMs: Date.now() - startedAt,
      providerMs,
      cache: cacheStatus,
      rateLimit: rate.backend,
      model: MODEL,
      knowledgeVersion: KNOWLEDGE_VERSION,
      promptVersion: PROMPT_VERSION,
      errorCode: mapped.code,
    })

    return errorResponse(mapped, request)
  } finally {
    release()
  }
}

interface StreamOptions {
  request: Request
  requestId: string
  startedAt: number
  system: string
  turns: GeminiTurn[]
  premRelated: boolean
  cacheStatus: string
  rateBackend: string
  rateHeaders: Record<string, string>
  release: () => void
}

/**
 * Await the first token before committing to a 200 response. This keeps
 * early provider failures (quota, auth, timeout) as proper HTTP errors
 * instead of a misleading empty stream.
 */
async function streamResponse(options: StreamOptions): Promise<Response> {
  const iterator = streamAssistant({
    system: options.system,
    turns: options.turns,
    signal: options.request.signal,
  })

  const providerStartedAt = Date.now()
  let first: IteratorResult<string>

  try {
    first = await iterator.next()
  } catch (error) {
    options.release()
    const mapped = toAssistantError(error)

    logAssistant({
      requestId: options.requestId,
      mode: 'stream',
      status: mapped.httpStatus,
      durationMs: Date.now() - options.startedAt,
      providerMs: Date.now() - providerStartedAt,
      cache: options.cacheStatus,
      rateLimit: options.rateBackend,
      model: MODEL,
      knowledgeVersion: KNOWLEDGE_VERSION,
      promptVersion: PROMPT_VERSION,
      errorCode: mapped.code,
    })

    return errorResponse(mapped, options.request)
  }

  if (first.done) {
    options.release()
    return json({ text: EMPTY_REPLY }, 200, options.request, options.rateHeaders)
  }

  const firstTokenMs = Date.now() - providerStartedAt
  const encoder = new TextEncoder()
  let closed = false

  const body = new ReadableStream<Uint8Array>({
    async start(controller) {
      // A mutable object avoids TypeScript narrowing the union across the
      // processChunk closure.
      const state: {
        guard: 'buffer' | 'pass' | 'replaced'
        head: string
        total: number
      } = {
        guard: options.premRelated ? 'buffer' : 'pass',
        head: '',
        total: 0,
      }

      const enqueue = (text: string) => {
        if (closed || !text || state.total >= 8_000) return
        state.total += text.length
        try {
          controller.enqueue(encoder.encode(text))
        } catch {
          closed = true
        }
      }

      const processChunk = (chunk: string): string => {
        if (state.guard === 'replaced') return ''
        if (state.guard === 'pass') return chunk

        state.head += chunk
        if (state.head.length < 80 && !/[.!?]\s/.test(state.head)) return ''

        if (UNRELATED_REFUSAL.test(state.head)) {
          state.guard = 'replaced'
          return NOT_COVERED_REPLY
        }

        state.guard = 'pass'
        return state.head
      }

      // Read through a function so TypeScript cannot narrow the mutable union.
      const guardState = (): 'buffer' | 'pass' | 'replaced' => state.guard

      try {
        enqueue(processChunk(first.value))

        if (guardState() !== 'replaced') {
          for await (const chunk of iterator) {
            enqueue(processChunk(chunk))
            if (guardState() === 'replaced' || state.total >= 8_000 || closed) {
              await iterator.return?.(undefined)
              break
            }
          }
        }

        // The stream ended while the guard was still buffering.
        if (guardState() === 'buffer') {
          enqueue(
            UNRELATED_REFUSAL.test(state.head) ? NOT_COVERED_REPLY : state.head,
          )
        }
      } catch (error) {
        const mapped = toAssistantError(error)
        if (mapped.code !== 'aborted' && !closed) {
          enqueue(`\n\n${MIDSTREAM_FALLBACK}`)
        }
      } finally {
        if (!closed) {
          closed = true
          try {
            controller.close()
          } catch {
            // Already closed by cancellation.
          }
        }
        options.release()
        logAssistant({
          requestId: options.requestId,
          mode: 'stream',
          status: 200,
          durationMs: Date.now() - options.startedAt,
          providerMs: firstTokenMs,
          cache: options.cacheStatus,
          rateLimit: options.rateBackend,
          model: MODEL,
          knowledgeVersion: KNOWLEDGE_VERSION,
          promptVersion: PROMPT_VERSION,
        })
      }
    },
    cancel() {
      closed = true
      options.release()
      void iterator.return?.(undefined)
    },
  })

  const responseHeaders = corsHeaders(options.request)
  responseHeaders.set('Content-Type', 'text/plain; charset=utf-8')
  responseHeaders.set('Cache-Control', 'no-store')
  responseHeaders.set('X-Content-Type-Options', 'nosniff')
  responseHeaders.set('X-Assistant-Mode', 'stream')

  for (const [key, value] of Object.entries(options.rateHeaders)) {
    responseHeaders.set(key, value)
  }

  logAssistant({
    requestId: options.requestId,
    mode: 'stream',
    status: 200,
    durationMs: Date.now() - options.startedAt,
    providerMs: firstTokenMs,
    cache: options.cacheStatus,
    rateLimit: options.rateBackend,
    model: MODEL,
    knowledgeVersion: KNOWLEDGE_VERSION,
    promptVersion: PROMPT_VERSION,
  })

  return new Response(body, { status: 200, headers: responseHeaders })
}
