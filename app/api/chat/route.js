import { NextResponse } from 'next/server'
import { askGemini, isConfigured } from '../../../lib/gemini.js'
import { clientKey, rateLimit } from '../../../lib/rateLimit.js'

// Needs the Node runtime for the Gemini SDK, and must never be statically cached.
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const MAX_MESSAGE_CHARS = 1000
const MAX_HISTORY_TURNS = 12

export async function POST(request) {
  // Rate limit before doing any work — the point is to not spend money.
  const limit = rateLimit(`chat:${clientKey(request)}`)
  if (!limit.allowed) {
    return NextResponse.json(
      { error: 'rate_limited', retryAfter: limit.retryAfter },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfter) } },
    )
  }

  if (!isConfigured()) {
    // Distinct from a transient failure: the operator has not set a key.
    return NextResponse.json({ error: 'unconfigured' }, { status: 503 })
  }

  let body
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'bad_json' }, { status: 400 })
  }

  const message = typeof body?.message === 'string' ? body.message.trim() : ''
  if (!message) {
    return NextResponse.json({ error: 'empty_message' }, { status: 400 })
  }
  if (message.length > MAX_MESSAGE_CHARS) {
    return NextResponse.json({ error: 'message_too_long' }, { status: 413 })
  }

  const lang = body?.lang === 'hi' ? 'hi' : 'en'

  // Trust nothing about client-supplied history beyond its shape. It is replayed
  // into the prompt, so a malformed or oversized array is a cost problem.
  const history = Array.isArray(body?.history)
    ? body.history
        .slice(-MAX_HISTORY_TURNS)
        .filter((t) => t && typeof t.text === 'string' && t.text.trim())
        .map((t) => ({ role: t.role === 'model' ? 'model' : 'user', text: t.text }))
    : []

  const result = await askGemini({ message, history, lang })

  if (!result.ok) {
    const status = result.reason === 'unconfigured' ? 503 : 502
    return NextResponse.json({ error: result.reason }, { status })
  }

  return NextResponse.json({ reply: result.text })
}

// Explicit 405 so a stray GET gets a clear answer instead of Next's default.
export function GET() {
  return NextResponse.json({ error: 'method_not_allowed' }, { status: 405 })
}
