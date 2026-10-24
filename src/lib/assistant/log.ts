/**
 * Operational logging for the assistant.
 *
 * Only timing, cache, and status metadata is recorded. Visitor questions,
 * answers, IP addresses, and credentials are never logged.
 */

export interface AssistantLogEntry {
  requestId: string
  mode: 'json' | 'stream'
  status: number
  durationMs: number
  providerMs?: number
  cache?: string
  rateLimit?: string
  model: string
  knowledgeVersion: string
  promptVersion: string
  errorCode?: string
}

export function logAssistant(entry: AssistantLogEntry) {
  try {
    console.log(
      JSON.stringify({
        ts: new Date().toISOString(),
        scope: 'assistant',
        ...entry,
      }),
    )
  } catch {
    // Logging must never break a request.
  }
}
