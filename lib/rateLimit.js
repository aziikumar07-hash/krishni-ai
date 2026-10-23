/**
 * In-process sliding-window rate limiter.
 *
 * /api/chat spends money on every call, so it cannot ship open to the internet.
 *
 * Deliberately in-memory: no Redis, no external service, no new infrastructure.
 * The tradeoff is that limits are per-instance, so a multi-instance or serverless
 * deployment enforces them per lambda rather than globally. That is acceptable as
 * a first line against casual abuse and accidental loops, but it is NOT a billing
 * guarantee — set a hard spend cap in Google AI Studio as well. If this ever needs
 * to be authoritative, swap the Map for Upstash or Vercel KV behind the same
 * function signature.
 */

const WINDOW_MS = 60_000
const MAX_PER_WINDOW = 8 // Generous for a farmer asking questions, tight for a script.

const DAY_MS = 86_400_000
const MAX_PER_DAY = 60

/** key -> { minute: number[], day: number[] } of request timestamps */
const hits = new Map()

// Bound the map so a stream of unique IPs cannot grow it without limit.
const MAX_TRACKED_KEYS = 5000

function prune(list, now, window) {
  // Timestamps are appended in order, so drop from the front while stale.
  let i = 0
  while (i < list.length && now - list[i] > window) i += 1
  return i === 0 ? list : list.slice(i)
}

function sweep(now) {
  for (const [key, rec] of hits) {
    const day = prune(rec.day, now, DAY_MS)
    if (day.length === 0) {
      hits.delete(key)
    } else {
      rec.day = day
      rec.minute = prune(rec.minute, now, WINDOW_MS)
    }
  }
}

/**
 * @param {string} key  caller identity — IP, or phone number for WhatsApp
 * @returns {{allowed: boolean, retryAfter: number, scope?: 'minute'|'day'}}
 */
export function rateLimit(key) {
  const now = Date.now()

  if (hits.size > MAX_TRACKED_KEYS) sweep(now)

  const rec = hits.get(key) || { minute: [], day: [] }
  rec.minute = prune(rec.minute, now, WINDOW_MS)
  rec.day = prune(rec.day, now, DAY_MS)

  if (rec.minute.length >= MAX_PER_WINDOW) {
    hits.set(key, rec)
    const oldest = rec.minute[0]
    return {
      allowed: false,
      scope: 'minute',
      retryAfter: Math.max(1, Math.ceil((WINDOW_MS - (now - oldest)) / 1000)),
    }
  }

  if (rec.day.length >= MAX_PER_DAY) {
    hits.set(key, rec)
    const oldest = rec.day[0]
    return {
      allowed: false,
      scope: 'day',
      retryAfter: Math.max(1, Math.ceil((DAY_MS - (now - oldest)) / 1000)),
    }
  }

  rec.minute.push(now)
  rec.day.push(now)
  hits.set(key, rec)
  return { allowed: true, retryAfter: 0 }
}

/**
 * Best-effort caller identity. Trusts x-forwarded-for, which is only meaningful
 * behind a proxy that sets it — the usual case on Vercel, Netlify and nginx.
 * Falls back to a shared bucket so a missing header fails closed-ish rather than
 * handing every caller its own quota.
 */
export function clientKey(request) {
  const fwd = request.headers.get('x-forwarded-for')
  if (fwd) return fwd.split(',')[0].trim()
  return request.headers.get('x-real-ip') || 'unknown'
}
