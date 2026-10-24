import {
  GEMINI_API_BASE,
  MAX_OUTPUT_TOKENS,
  MODEL,
  UPSTREAM_TIMEOUT_MS,
} from './config'
import type { GeminiTurn } from './validation'

export type AssistantErrorCode =
  | 'rate_limit'
  | 'auth'
  | 'upstream'
  | 'timeout'
  | 'aborted'
  | 'blocked'
  | 'config'

export class AssistantError extends Error {
  constructor(
    public readonly code: AssistantErrorCode,
    public readonly httpStatus: number,
    message: string,
  ) {
    super(message)
    this.name = 'AssistantError'
  }
}

interface ProviderOptions {
  system: string
  turns: GeminiTurn[]
  signal?: AbortSignal
}

function generationConfig(): Record<string, unknown> {
  const config: Record<string, unknown> = {
    temperature: 0.35,
    topP: 0.9,
    maxOutputTokens: MAX_OUTPUT_TOKENS,
  }
  // Keep portfolio answers snappy on 2.5 Flash.
  if (MODEL.includes('2.5-flash')) {
    config.thinkingConfig = { thinkingBudget: 0 }
  }
  return config
}

function requestBody(options: ProviderOptions) {
  return {
    systemInstruction: { parts: [{ text: options.system }] },
    contents: options.turns,
    generationConfig: generationConfig(),
  }
}

function mapStatus(status: number): AssistantError {
  if (status === 429) return new AssistantError('rate_limit', 429, 'rate_limit')
  if (status === 400 || status === 401 || status === 403) {
    return new AssistantError('auth', 503, 'auth')
  }
  return new AssistantError('upstream', 502, `upstream_${status}`)
}

function mapFetchError(error: unknown): AssistantError {
  if (error instanceof AssistantError) return error

  const name = error instanceof Error ? error.name : ''
  if (name === 'TimeoutError') {
    return new AssistantError('timeout', 504, 'timeout')
  }
  if (name === 'AbortError') {
    return new AssistantError('aborted', 499, 'aborted')
  }

  return new AssistantError('upstream', 502, 'upstream')
}

/**
 * Combine an optional caller signal with the upstream timeout.
 * Avoids depending on AbortSignal.any for older Node runtimes.
 */
function createSignal(external?: AbortSignal) {
  const controller = new AbortController()

  const timer = setTimeout(() => {
    controller.abort(new DOMException('Assistant request timed out', 'TimeoutError'))
  }, UPSTREAM_TIMEOUT_MS)

  const onAbort = () => controller.abort(external?.reason)

  if (external) {
    if (external.aborted) controller.abort(external.reason)
    else external.addEventListener('abort', onAbort, { once: true })
  }

  return {
    signal: controller.signal,
    cleanup: () => {
      clearTimeout(timer)
      external?.removeEventListener('abort', onAbort)
    },
  }
}

interface GeminiPart {
  text?: string
  thought?: boolean
}

interface GeminiPayload {
  candidates?: Array<{
    content?: { parts?: GeminiPart[] }
    finishReason?: string
  }>
  promptFeedback?: { blockReason?: string }
}

function extractText(payload: GeminiPayload): string {
  return (payload.candidates?.[0]?.content?.parts ?? [])
    .filter((part) => !part.thought && typeof part.text === 'string')
    .map((part) => part.text as string)
    .join('')
}

function isBlocked(payload: GeminiPayload): boolean {
  if (payload.promptFeedback?.blockReason) return true
  return payload.candidates?.[0]?.finishReason === 'SAFETY'
}

export async function generateAssistant(
  options: ProviderOptions,
): Promise<{ text: string; blocked: boolean }> {
  const { signal, cleanup } = createSignal(options.signal)

  try {
    const response = await fetch(
      `${GEMINI_API_BASE}/models/${encodeURIComponent(MODEL)}:generateContent`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Key travels in a header, never in the URL or logs.
          'x-goog-api-key': process.env.GEMINI_API_KEY || '',
        },
        body: JSON.stringify(requestBody(options)),
        signal,
      },
    )

    if (!response.ok) throw mapStatus(response.status)

    const payload = (await response.json()) as GeminiPayload
    if (isBlocked(payload)) return { text: '', blocked: true }

    return { text: extractText(payload), blocked: false }
  } catch (error) {
    throw mapFetchError(error)
  } finally {
    cleanup()
  }
}

/**
 * Streams plain text deltas from Gemini's SSE endpoint.
 * The route decides how to expose these chunks to the browser.
 */
export async function* streamAssistant(
  options: ProviderOptions,
): AsyncGenerator<string> {
  const { signal, cleanup } = createSignal(options.signal)

  let reader: ReadableStreamDefaultReader<Uint8Array> | null = null

  try {
    const response = await fetch(
      `${GEMINI_API_BASE}/models/${encodeURIComponent(MODEL)}:streamGenerateContent?alt=sse`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'text/event-stream',
          'x-goog-api-key': process.env.GEMINI_API_KEY || '',
        },
        body: JSON.stringify(requestBody(options)),
        signal,
      },
    )

    if (!response.ok) throw mapStatus(response.status)
    if (!response.body) {
      throw new AssistantError('upstream', 502, 'no_response_body')
    }

    reader = response.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''

    const parseLine = (rawLine: string): string | null => {
      const line = rawLine.trim()
      if (!line.startsWith('data:')) return null

      const payload = line.slice(5).trim()
      if (!payload || payload === '[DONE]') return null

      let parsed: GeminiPayload
      try {
        parsed = JSON.parse(payload) as GeminiPayload
      } catch {
        return null
      }

      if (isBlocked(parsed)) {
        throw new AssistantError('blocked', 200, 'blocked')
      }

      return extractText(parsed) || null
    }

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })

      let newline = buffer.indexOf('\n')
      while (newline >= 0) {
        const line = buffer.slice(0, newline)
        buffer = buffer.slice(newline + 1)

        const text = parseLine(line)
        if (text) yield text

        newline = buffer.indexOf('\n')
      }
    }

    // Flush a final line that arrived without a trailing newline.
    if (buffer.trim()) {
      const text = parseLine(buffer)
      if (text) yield text
    }
  } catch (error) {
    throw mapFetchError(error)
  } finally {
    if (reader) {
      try {
        await reader.cancel()
      } catch {
        // The stream may already be closed.
      }
    }
    cleanup()
  }
}
