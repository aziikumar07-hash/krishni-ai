/**
 * WhatsApp Cloud API helpers.
 *
 * Two things the legacy backend/server.js got wrong and this fixes:
 *
 * 1. Signature verification was a `// TODO: verify signature (X-Hub-Signature)`.
 *    The endpoint accepted any POST from anyone, so a stranger could forge inbound
 *    messages and spend the project's Gemini quota at will. Now enforced.
 * 2. The Graph API version was pinned to v18.0, which is past Meta's two-year
 *    support window. Configurable, defaulting to a current version.
 */

import crypto from 'node:crypto'

const GRAPH_VERSION = process.env.WHATSAPP_GRAPH_VERSION || 'v23.0'

export function isConfigured() {
  return Boolean(process.env.WHATSAPP_TOKEN && process.env.PHONE_NUMBER_ID)
}

/**
 * Verify Meta's X-Hub-Signature-256 header against the raw request body.
 *
 * Must be given the exact bytes Meta signed — re-serialising a parsed object
 * changes key order and whitespace and the HMAC will not match.
 *
 * @param {string} rawBody
 * @param {string|null} header  value of x-hub-signature-256, e.g. "sha256=abc..."
 * @returns {boolean}
 */
export function verifySignature(rawBody, header) {
  const secret = process.env.WHATSAPP_APP_SECRET
  // Fail closed. An unset secret means we cannot verify, so we do not accept.
  if (!secret || !header) return false

  const expected =
    'sha256=' + crypto.createHmac('sha256', secret).update(rawBody, 'utf8').digest('hex')

  const a = Buffer.from(header)
  const b = Buffer.from(expected)
  // timingSafeEqual throws on length mismatch, so check that first.
  if (a.length !== b.length) return false
  return crypto.timingSafeEqual(a, b)
}

/**
 * Send a text message back to a farmer.
 * Returns a boolean rather than throwing — the webhook has already ACKed Meta by
 * the time this runs, so a failure here is logged, not propagated.
 */
export async function sendText(to, text) {
  const token = process.env.WHATSAPP_TOKEN
  const phoneId = process.env.PHONE_NUMBER_ID
  if (!token || !phoneId) {
    console.error('[whatsapp] not configured; cannot send')
    return false
  }

  try {
    const res = await fetch(`https://graph.facebook.com/${GRAPH_VERSION}/${phoneId}/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to,
        type: 'text',
        // WhatsApp hard-caps a text body at 4096 chars.
        text: { body: text.slice(0, 4096), preview_url: false },
      }),
    })

    if (!res.ok) {
      const detail = await res.text().catch(() => '')
      console.error('[whatsapp] send failed:', res.status, detail.slice(0, 300))
      return false
    }
    return true
  } catch (err) {
    console.error('[whatsapp] send threw:', err?.message || err)
    return false
  }
}

/**
 * Pull the first inbound message out of a webhook payload.
 * Meta nests this deeply and sends many event shapes we do not handle (delivery
 * receipts, read receipts, status changes), so this returns null for anything
 * that is not an actual inbound message.
 */
export function extractMessage(payload) {
  const value = payload?.entry?.[0]?.changes?.[0]?.value
  const msg = value?.messages?.[0]
  if (!msg) return null

  return {
    from: msg.from,
    id: msg.id,
    type: msg.type,
    text: msg.type === 'text' ? (msg.text?.body ?? '') : '',
    // Profile name, when Meta includes it. Useful for logs, never trusted as input.
    profileName: value?.contacts?.[0]?.profile?.name ?? null,
  }
}

/**
 * Guess the language to reply in from the farmer's own message.
 * Devanagari anywhere means answer in Hindi; the model handles Hinglish either way.
 */
export function detectLang(text) {
  return /[ऀ-ॿ]/.test(text) ? 'hi' : 'en'
}
