import { NextResponse } from 'next/server'
import { clientKey, rateLimit } from '../../../lib/rateLimit.js'
import { validateLead } from '../../../lib/validateLead.js'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const FORMSPREE_ID = process.env.FORMSPREE_FORM_ID || 'maqzyrvy'

export async function POST(request) {
  // Lower ceiling than chat: nobody legitimately submits a lead 8 times a minute.
  const limit = rateLimit(`lead:${clientKey(request)}`)
  if (!limit.allowed) {
    return NextResponse.json(
      { error: 'rate_limited', retryAfter: limit.retryAfter },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfter) } },
    )
  }

  let body
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'bad_json' }, { status: 400 })
  }

  // Honeypot. A real farmer never fills a field they cannot see; bots fill
  // everything. Accept silently so the bot records a success and moves on.
  if (String(body?.website ?? '').trim() !== '') {
    return NextResponse.json({ ok: true })
  }

  // Re-validate server-side. The client runs the same module, but a POST can
  // arrive from anywhere.
  const { valid, errors, clean } = validateLead(body)
  if (!valid) {
    return NextResponse.json({ error: 'invalid', fields: errors }, { status: 422 })
  }

  // Forward to Formspree, the same destination the legacy page used. Moving the
  // call server-side means validation and consent are enforced before the lead
  // is stored, and the form id is no longer baked into the client bundle.
  try {
    const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        _subject: `Krishni AI early access — ${clean.name}`,
        name: clean.name,
        phone: `+91${clean.phone}`,
        state: clean.state,
        crop: clean.crop,
        plan: clean.plan || 'not specified',
        message: clean.message,
        // Record the consent event itself, not just the flag — DPDP compliance
        // rests on being able to show when and to what the farmer agreed.
        consent: 'yes — agreed to WhatsApp contact about early access',
        consentAt: new Date().toISOString(),
      }),
    })

    if (!res.ok) {
      console.error('[lead] formspree rejected:', res.status)
      return NextResponse.json({ error: 'upstream' }, { status: 502 })
    }
  } catch (err) {
    console.error('[lead] forward failed:', err?.message || err)
    return NextResponse.json({ error: 'upstream' }, { status: 502 })
  }

  return NextResponse.json({ ok: true })
}

export function GET() {
  return NextResponse.json({ error: 'method_not_allowed' }, { status: 405 })
}
