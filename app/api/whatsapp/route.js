import { NextResponse } from 'next/server'
import { askGemini, isConfigured as geminiReady } from '../../../lib/gemini.js'
import { rateLimit } from '../../../lib/rateLimit.js'
import {
  detectLang,
  extractMessage,
  sendText,
  verifySignature,
} from '../../../lib/whatsapp.js'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * GET — Meta's webhook handshake. Called once when you set the callback URL in the
 * App Dashboard, and occasionally re-verified afterwards.
 */
export async function GET(request) {
  const url = new URL(request.url)
  const mode = url.searchParams.get('hub.mode')
  const token = url.searchParams.get('hub.verify_token')
  const challenge = url.searchParams.get('hub.challenge')

  const expected = process.env.VERIFY_TOKEN
  if (!expected) {
    console.error('[whatsapp] VERIFY_TOKEN not set; refusing handshake')
    return new NextResponse('not configured', { status: 503 })
  }

  if (mode === 'subscribe' && token === expected) {
    // Must echo the challenge as bare text, not JSON, or Meta rejects it.
    return new NextResponse(challenge ?? '', {
      status: 200,
      headers: { 'Content-Type': 'text/plain' },
    })
  }

  return new NextResponse('forbidden', { status: 403 })
}

/**
 * POST — inbound messages.
 *
 * Meta retries any webhook it does not see a 200 for within a few seconds, so we
 * verify, ACK, and only then do the slow work. The legacy implementation ACKed
 * before processing too, which was right, but it never verified the signature at
 * all — so anyone who found the URL could forge messages and burn Gemini quota.
 */
export async function POST(request) {
  // Read the raw bytes: the HMAC is over exactly what Meta sent.
  const raw = await request.text()

  if (!verifySignature(raw, request.headers.get('x-hub-signature-256'))) {
    console.warn('[whatsapp] rejected unsigned or mis-signed webhook')
    return new NextResponse('forbidden', { status: 403 })
  }

  let payload
  try {
    payload = JSON.parse(raw)
  } catch {
    return new NextResponse('bad request', { status: 400 })
  }

  const msg = extractMessage(payload)

  // Not an inbound message — a delivery or read receipt. ACK so Meta stops.
  if (!msg) return new NextResponse('ok', { status: 200 })

  // Fire-and-forget the reply. Meta gets its 200 immediately either way.
  handleMessage(msg).catch((err) =>
    console.error('[whatsapp] handler failed:', err?.message || err),
  )

  return new NextResponse('ok', { status: 200 })
}

async function handleMessage(msg) {
  // Per-sender limit, so one farmer (or one compromised number) cannot drain the
  // quota for everyone else.
  const limit = rateLimit(`wa:${msg.from}`)
  if (!limit.allowed) {
    await sendText(
      msg.from,
      'आपने बहुत ज़्यादा सवाल भेज दिए हैं। कृपया थोड़ी देर रुककर दोबारा भेजें।\n\nToo many messages. Please wait a little and try again.',
    )
    return
  }

  if (msg.type !== 'text' || !msg.text.trim()) {
    // Photo diagnosis needs the media download endpoint and is not built yet.
    // Say so plainly rather than silently ignoring the farmer.
    await sendText(
      msg.from,
      'अभी मैं सिर्फ़ लिखे हुए सवालों का जवाब दे सकती हूँ। फ़ोटो से बीमारी पहचानने की सुविधा जल्द आ रही है।\n\nI can only answer text messages right now. Photo-based crop checks are coming soon.',
    )
    return
  }

  if (!geminiReady()) {
    await sendText(
      msg.from,
      'क्षमा करें, सेवा अभी उपलब्ध नहीं है। कृपया थोड़ी देर बाद कोशिश करें।\n\nSorry, the service is unavailable right now.',
    )
    return
  }

  const lang = detectLang(msg.text)
  const result = await askGemini({ message: msg.text, lang, history: [] })

  await sendText(
    msg.from,
    result.ok
      ? result.text
      : 'क्षमा करें, अभी कुछ तकनीकी समस्या है। कृपया थोड़ी देर बाद पुनः प्रयास करें।\n\nSorry, a technical problem. Please try again shortly.',
  )
}
