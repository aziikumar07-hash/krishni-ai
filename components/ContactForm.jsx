'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import { useLang } from '../lib/LanguageProvider.jsx'
import { cropOptions, indianStates, site } from '../lib/site.js'
import { validateLead } from '../lib/validateLead.js'
import Reveal from './Reveal.jsx'

/**
 * Early-access form.
 *
 * Fixes carried over from the report: validation lives in one shared module
 * (lib/validateLead.js) instead of being written twice; the submit goes to our own
 * /api/lead route which re-validates server-side, so a JS-disabled or forged POST
 * cannot bypass the rules; state is a closed list rather than free text with a
 * 2-char minimum; there is a consent checkbox; there is a honeypot; errors are
 * announced and focus moves.
 */
export default function ContactForm({ plan }) {
  const { t, lang } = useLang()
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | done | error
  const formRef = useRef(null)
  const successRef = useRef(null)

  const cropLabel = (crop) => {
    if (crop.labelKey) return t(crop.labelKey)
    return lang === 'hi' ? crop.labelHi : crop.labelEn
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    if (status === 'sending') return

    const data = Object.fromEntries(new FormData(formRef.current).entries())
    const payload = { ...data, consent: data.consent === 'on', plan: plan || '' }

    const { valid, errors: found } = validateLead(payload)
    if (!valid) {
      setErrors(found)
      setStatus('idle')
      // Move focus to the first offending field so the failure is discoverable
      // without sight. The legacy form moved focus nowhere.
      const firstKey = ['name', 'phone', 'state', 'crop', 'consent'].find((k) => found[k])
      if (firstKey) formRef.current.elements[firstKey]?.focus()
      return
    }

    setErrors({})
    setStatus('sending')

    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        if (res.status === 422 && body.fields) {
          setErrors(body.fields)
          setStatus('idle')
          return
        }
        setStatus('error')
        return
      }

      setStatus('done')
      // Announce success by moving focus to it, rather than relying on the
      // visual swap alone.
      requestAnimationFrame(() => successRef.current?.focus())
    } catch {
      setStatus('error')
    }
  }

  if (status === 'done') {
    return (
      <div className="form-success" ref={successRef} tabIndex={-1}>
        <p className="feature-icon" aria-hidden="true">
          ✅
        </p>
        <h3>{t('form.success.title')}</h3>
        <p>{t('form.success.body')}</p>
      </div>
    )
  }

  const fieldError = (name) =>
    errors[name] ? (
      // .visible is required — .form-error alone is display:none.
      <p className="form-error visible" id={`err-${name}`}>
        {t(errors[name])}
      </p>
    ) : null

  const aria = (name) => ({
    'aria-invalid': errors[name] ? 'true' : undefined,
    'aria-describedby': errors[name] ? `err-${name}` : undefined,
  })

  return (
    <form className="cta-form" ref={formRef} onSubmit={onSubmit} noValidate>
      {/* Honeypot. Hidden from sight and from screen readers; bots fill it anyway. */}
      <div className="sr-only" aria-hidden="true">
        <label htmlFor="f-website">Leave this empty</label>
        <input id="f-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="form-group">
        <label htmlFor="f-name">{t('form.name')}</label>
        <input
          id="f-name"
          name="name"
          type="text"
          required
          minLength={2}
          maxLength={80}
          autoComplete="name"
          placeholder={t('form.name.placeholder')}
          {...aria('name')}
        />
        {fieldError('name')}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="f-phone">{t('form.phone')}</label>
          <input
            id="f-phone"
            name="phone"
            type="tel"
            required
            inputMode="numeric"
            autoComplete="tel-national"
            pattern="[6-9][0-9]{9}"
            placeholder={t('form.phone.placeholder')}
            {...aria('phone')}
          />
          {fieldError('phone')}
        </div>

        <div className="form-group">
          <label htmlFor="f-state">{t('form.state')}</label>
          <select id="f-state" name="state" required defaultValue="" {...aria('state')}>
            <option value="" disabled>
              {t('form.state.placeholder')}
            </option>
            {indianStates.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
          {fieldError('state')}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="f-crop">{t('form.crop')}</label>
        {/* value is the stable id, never the visible label — the legacy options
            had no value attribute, so translating a label changed the data. */}
        <select id="f-crop" name="crop" required defaultValue="" {...aria('crop')}>
          <option value="" disabled>
            {t('form.crop.placeholder')}
          </option>
          {cropOptions.map((crop) => (
            <option key={crop.id} value={crop.id}>
              {cropLabel(crop)}
            </option>
          ))}
        </select>
        {fieldError('crop')}
      </div>

      <div className="form-group">
        <label htmlFor="f-msg">{t('form.message')}</label>
        <textarea
          id="f-msg"
          name="message"
          rows={3}
          maxLength={1000}
          placeholder={t('form.message.placeholder')}
        />
      </div>

      <div className="form-group form-consent">
        <label htmlFor="f-consent">
          <input id="f-consent" name="consent" type="checkbox" {...aria('consent')} />
          <span>
            {t('form.consent')}{' '}
            <Link href="/privacy" target="_blank">
              {t('footer.legal.privacy')}
            </Link>
          </span>
        </label>
        {fieldError('consent')}
      </div>

      <button type="submit" className="btn btn-primary form-submit" disabled={status === 'sending'}>
        {status === 'sending' ? t('form.submitting') : t('form.submit')}
      </button>

      {/* Replaces the legacy alert() — jarring beside the inline error styling. */}
      {status === 'error' && (
        <p className="form-error visible" role="alert">
          {t('form.err.network')}{' '}
          <a href={site.whatsapp} target="_blank" rel="noopener noreferrer">
            {t('contact.whatsapp')}
          </a>
        </p>
      )}

      <p className="form-note">{t('form.note')}</p>
    </form>
  )
}
