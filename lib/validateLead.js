/**
 * Lead validation, shared by the client form and the API route.
 *
 * The legacy page wrote these rules twice — once in the submit handler, once in
 * the blur handlers — four duplicated predicates that would inevitably drift.
 * Worse, all of it was client-side with `novalidate` on the form, so disabling
 * JavaScript disabled validation entirely and submitted straight through.
 *
 * One module, imported by both sides. The server re-runs it and does not trust
 * the client's verdict.
 */

import { cropOptions, indianStates } from './site.js'

// Indian mobile numbers are 10 digits starting 6–9.
const PHONE_RE = /^[6-9]\d{9}$/

const VALID_CROPS = new Set(cropOptions.map((c) => c.id))
const VALID_STATES = new Set(indianStates)

/**
 * @param {object} input  raw field values
 * @returns {{valid: boolean, errors: Record<string,string>, clean?: object}}
 *   `errors` maps field name to an i18n key, so the caller renders it in the
 *   farmer's language rather than receiving an English string from the server.
 */
export function validateLead(input) {
  const errors = {}

  const name = String(input?.name ?? '').trim()
  if (name.length < 2 || name.length > 80) errors.name = 'form.err.name'

  // Tolerate the ways people actually type a number: +91, 0, spaces, dashes.
  const rawPhone = String(input?.phone ?? '').replace(/[\s-()]/g, '')
  const phone = rawPhone.replace(/^(\+?91|0)/, '')
  if (!PHONE_RE.test(phone)) errors.phone = 'form.err.phone'

  const state = String(input?.state ?? '').trim()
  if (!VALID_STATES.has(state)) errors.state = 'form.err.state'

  const crop = String(input?.crop ?? '').trim()
  if (!VALID_CROPS.has(crop)) errors.crop = 'form.err.crop'

  // DPDP Act 2023 expects explicit, recorded consent before contacting someone.
  // The legacy form had no consent control at all despite being WhatsApp-delivered.
  const consent = input?.consent === true || input?.consent === 'on' || input?.consent === 'true'
  if (!consent) errors.consent = 'form.err.consent'

  const message = String(input?.message ?? '').trim().slice(0, 1000)
  const plan = String(input?.plan ?? '').trim().slice(0, 40)

  if (Object.keys(errors).length > 0) return { valid: false, errors }

  return {
    valid: true,
    errors: {},
    clean: { name, phone, state, crop, message, plan, consent: true },
  }
}
