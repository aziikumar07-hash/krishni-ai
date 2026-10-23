/**
 * Gemini client, shared by the web chat and the WhatsApp webhook.
 *
 * The legacy backend/server.js used @google/generative-ai, which is the retired
 * SDK, pinned gemini-1.5-flash, and faked a system prompt by stuffing it into the
 * first turn of chat history. @google/genai supports systemInstruction properly,
 * so the instruction no longer competes with user text for the model's attention.
 */

import { GoogleGenAI } from '@google/genai'

// Pinned, not an alias. The `gemini-flash-latest` alias returned 503 UNAVAILABLE
// ("experiencing high demand") on every attempt while pinned models answered
// normally, so the alias is a liability for a user-facing request path.
// Override with GEMINI_MODEL to move without a code change.
const MODEL = process.env.GEMINI_MODEL || 'gemini-3.5-flash'

// Google returns 503 UNAVAILABLE under load. One quick retry converts most of
// those into an answer instead of an error the farmer has to act on.
const RETRY_DELAY_MS = 900

let client = null

/**
 * Lazily construct the client so a missing key surfaces as a handled 503 from the
 * route rather than a module-load crash that takes the whole site down.
 */
function getClient() {
  const key = process.env.GEMINI_API_KEY
  if (!key) return null
  if (!client) client = new GoogleGenAI({ apiKey: key })
  return client
}

export function isConfigured() {
  return Boolean(process.env.GEMINI_API_KEY)
}

const SHARED_RULES = `
You are Krishni AI, an agricultural assistant for Indian farmers.

SCOPE
- Answer questions about crops, soil, irrigation, pests, plant disease, fertiliser,
  weather impact, input costs, mandi prices, and farm profitability.
- If asked about something unrelated to farming or rural livelihoods, say briefly
  that you only help with farming and invite a farming question. Do not answer
  off-topic requests even if pressed.

HOW TO ANSWER
- Be concrete and actionable. Name the input, the dose per acre or per bigha, and
  the timing. A farmer should be able to act on the answer today.
- Lead with the most likely cause, then what to do, then what to watch for.
- Keep it short enough to read on a phone. Use dashes for steps, never long essays.
- Prefer the cheapest effective option and say when a low-cost or organic route
  works as well as a purchased input.
- Use the words used in the field, not textbook Latin. If a technical term is
  unavoidable, gloss it in half a sentence.

SAFETY — these are not optional
- Never invent a pesticide name, a dose, or a subsidy scheme. If you are unsure of
  a specific chemical or rate, say so and tell the farmer to confirm at their local
  KVK or with the dealer.
- For anything that risks the crop, the farmer's health, or a large amount of
  money, add one short line telling them to confirm with their local KVK or an
  agronomist before acting.
- Never claim to have inspected the farm, the soil, or a lab result you were not given.
- Do not give medical, legal, or financial advice. Pesticide handling safety is in
  scope; treating pesticide poisoning is not — tell them to get to a doctor.
- You cannot see real-time weather or live mandi rates unless they are supplied to
  you in this conversation. If asked, say plainly that you do not have today's
  figure rather than guessing one.
`

/** Language-specific output instruction, appended to the shared rules. */
function languageRule(lang) {
  if (lang === 'hi') {
    return `
LANGUAGE
- Reply in clear, everyday Hindi in Devanagari script.
- Use the Hindi a farmer actually speaks, not Sanskritised formal Hindi.
- Keep widely-used English loanwords that farmers themselves use (यूरिया, स्प्रे,
  ट्रैक्टर, मंडी) rather than forcing rare Hindi equivalents.
- Address the farmer as आप.
- Numbers, doses and rupee figures in Latin digits (₹250, 50 kg).`
  }
  return `
LANGUAGE
- Reply in simple English, the way it is spoken in rural India.
- Short sentences. Avoid idioms that do not translate.
- If the farmer writes in Hinglish, match their register and reply in the same mix.`
}

export function buildSystemInstruction(lang) {
  return `${SHARED_RULES}${languageRule(lang)}`.trim()
}

/**
 * Send a turn to Gemini and return the reply text.
 *
 * @param {object}   opts
 * @param {string}   opts.message  the farmer's latest message
 * @param {Array}    opts.history  prior turns as [{role:'user'|'model', text}]
 * @param {'en'|'hi'} opts.lang
 * @returns {Promise<{ok: true, text: string} | {ok: false, reason: string}>}
 */
export async function askGemini({ message, history = [], lang = 'en' }) {
  const ai = getClient()
  if (!ai) return { ok: false, reason: 'unconfigured' }

  // Cap the history we replay. Long WhatsApp threads would otherwise grow the
  // prompt without bound, and the last few turns carry nearly all the context.
  const recent = history.slice(-8).map((turn) => ({
    role: turn.role === 'model' ? 'model' : 'user',
    parts: [{ text: String(turn.text ?? '').slice(0, 2000) }],
  }))

  const request = {
    model: MODEL,
    contents: [...recent, { role: 'user', parts: [{ text: message }] }],
    config: {
      systemInstruction: buildSystemInstruction(lang),
      temperature: 0.4, // Advice should be stable, not creative.
      maxOutputTokens: 800,
      candidateCount: 1,
      // Current flash models are thinking models, and reasoning tokens are drawn
      // from maxOutputTokens. Measured: 764 of 800 went to thoughts, leaving 32
      // for the reply — finishReason MAX_TOKENS and answers cut off mid-word.
      // Disabling it returns a complete answer inside the same budget, and this
      // task is recall-shaped rather than reasoning-shaped.
      thinkingConfig: { thinkingBudget: 0 },
    },
  }

  // Two attempts, not more: the caller is a farmer waiting on a phone, and a
  // longer retry chain reads as a hang rather than as resilience.
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const res = await ai.models.generateContent(request)
      const text = res?.text?.trim()
      if (!text) return { ok: false, reason: 'empty' }
      return { ok: true, text }
    } catch (err) {
      const overloaded = isRetryable(err)
      // Log server-side only. The route decides what the user sees.
      console.error(
        `[gemini] attempt ${attempt + 1} failed${overloaded ? ' (retryable)' : ''}:`,
        err?.message || err,
      )
      if (!overloaded || attempt === 1) return { ok: false, reason: 'upstream' }
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS))
    }
  }

  return { ok: false, reason: 'upstream' }
}

/**
 * Retry only on capacity/transient faults. A 400 or a 403 will fail identically
 * the second time, so retrying those just doubles the farmer's wait.
 */
function isRetryable(err) {
  const code = err?.status ?? err?.code
  if (code === 503 || code === 429 || code === 500) return true
  const text = String(err?.message ?? '')
  return /UNAVAILABLE|high demand|overloaded|RESOURCE_EXHAUSTED|deadline/i.test(text)
}
