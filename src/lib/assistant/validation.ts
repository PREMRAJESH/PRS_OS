import { z } from 'zod'
import {
  MAX_HISTORY_ITEM_LENGTH,
  MAX_HISTORY_ITEMS,
  MAX_MESSAGE_LENGTH,
} from './config'

const historyItemSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string().trim().min(1).max(MAX_HISTORY_ITEM_LENGTH),
})

export const assistantRequestSchema = z.object({
  message: z.string().trim().min(1).max(MAX_MESSAGE_LENGTH),
  history: z.array(historyItemSchema).max(MAX_HISTORY_ITEMS).optional(),
  stream: z.boolean().optional(),
})

export type AssistantRequest = z.infer<typeof assistantRequestSchema>

export interface GeminiTurn {
  role: 'user' | 'model'
  parts: Array<{ text: string }>
}

/** Strip control characters and collapse excessive blank lines. */
export function normalizeMessage(message: string): string {
  return message
    .replace(/\r\n/g, '\n')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

export function toGeminiTurns(
  history: Array<{ role: 'user' | 'assistant'; content: string }> | undefined,
  message: string,
): GeminiTurn[] {
  const turns: GeminiTurn[] = []

  for (const entry of history ?? []) {
    const mappedRole: 'user' | 'model' = entry.role === 'assistant' ? 'model' : 'user'
    const text = normalizeMessage(entry.content).slice(0, MAX_HISTORY_ITEM_LENGTH)
    if (!text) continue

    const last = turns[turns.length - 1]
    if (last && last.role === mappedRole) {
      last.parts[0].text += `\n\n${text}`
    } else {
      turns.push({ role: mappedRole, parts: [{ text }] })
    }
  }

  // Gemini expects a conversation that opens with a user turn.
  while (turns.length > 0 && turns[0].role !== 'user') turns.shift()

  turns.push({ role: 'user', parts: [{ text: normalizeMessage(message) }] })
  return turns
}

export function friendlyValidationError(error: z.ZodError): string {
  const issue = error.issues[0]
  if (!issue) return 'Invalid request.'

  if (issue.path[0] === 'message') {
    if (issue.code === 'too_small') return 'Ask a question first.'
    if (issue.code === 'too_big') return 'That question is a little too long.'
  }

  return 'Invalid request.'
}

/** Cap model output before it reaches the client. */
export function sanitizeAnswer(text: string, maxChars = 6_000): string {
  return text
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .trim()
    .slice(0, maxChars)
}
