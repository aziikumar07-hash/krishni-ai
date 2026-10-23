'use client'

import { useEffect, useRef, useState } from 'react'
import { useLang } from '../lib/LanguageProvider.jsx'

/**
 * Live chat against /api/chat.
 *
 * This is the one genuinely functional surface on the site: the legacy page's
 * chat was a scripted mock with no input field, and the legacy /api/chat returned
 * a hardcoded Hindi placeholder string.
 *
 * History is kept in component state only — deliberately not persisted. Farm
 * questions can carry personal detail, and storing them in localStorage would
 * leave that on a shared phone with no way to clear it.
 */
export default function ChatClient() {
  const { t, lang } = useLang()
  const [turns, setTurns] = useState([])
  const [draft, setDraft] = useState('')
  const [status, setStatus] = useState('idle') // idle | sending | error | limited | down
  const listRef = useRef(null)
  const inputRef = useRef(null)

  // Keep the newest message in view as the thread grows.
  useEffect(() => {
    const node = listRef.current
    if (node) node.scrollTop = node.scrollHeight
  }, [turns, status])

  const send = async (event) => {
    event.preventDefault()
    const message = draft.trim()
    if (!message || status === 'sending') return

    const history = turns.map((turn) => ({ role: turn.role, text: turn.text }))

    setTurns((prev) => [...prev, { id: `u${Date.now()}`, role: 'user', text: message }])
    setDraft('')
    setStatus('sending')

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, history, lang }),
      })

      if (res.status === 429) {
        setStatus('limited')
        return
      }
      if (res.status === 503) {
        // Operator has not configured a key — distinct from a transient fault.
        setStatus('down')
        return
      }
      if (!res.ok) {
        setStatus('error')
        return
      }

      const body = await res.json()
      setTurns((prev) => [
        ...prev,
        { id: `m${Date.now()}`, role: 'model', text: body.reply },
      ])
      setStatus('idle')
      inputRef.current?.focus()
    } catch {
      setStatus('error')
    }
  }

  const notice =
    status === 'limited'
      ? t('try.rateLimit')
      : status === 'down'
        ? t('try.error')
        : status === 'error'
          ? t('try.error')
          : null

  return (
    <div className="chat-live">
      <div
        className="chat-live-body"
        ref={listRef}
        // Announce replies as they arrive without interrupting typing.
        aria-live="polite"
        aria-atomic="false"
        role="log"
      >
        {turns.length === 0 && <p className="chat-live-empty">{t('try.empty')}</p>}

        {turns.map((turn) => (
          <div key={turn.id} className={`bubble bubble-${turn.role === 'user' ? 'out' : 'in'}`}>
            <span className="sr-only">
              {turn.role === 'user' ? t('try.you') : t('try.assistant')}:{' '}
            </span>
            {/* Rendered as text, never as HTML — model output is untrusted. */}
            {turn.text}
          </div>
        ))}

        {status === 'sending' && (
          <p className="typing-bubble" aria-label={t('try.sending')}>
            <span className="typing-dot" />
            <span className="typing-dot" />
            <span className="typing-dot" />
          </p>
        )}
      </div>

      {notice && (
        // .form-error is display:none until .visible — legacy toggled it via JS.
        <p className="form-error visible" role="alert">
          {notice}
        </p>
      )}

      <form className="chat-live-form" onSubmit={send}>
        <label className="sr-only" htmlFor="chat-input">
          {t('try.placeholder')}
        </label>
        <input
          id="chat-input"
          ref={inputRef}
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={t('try.placeholder')}
          maxLength={1000}
          autoComplete="off"
        />
        <button type="submit" className="btn btn-primary" disabled={status === 'sending' || !draft.trim()}>
          {status === 'sending' ? t('try.sending') : t('try.send')}
        </button>
      </form>

      <div className="chat-live-footer">
        {/* Non-negotiable: this is advice about money and crops from a model that
            can be confidently wrong. */}
        <p className="form-note">{t('try.disclaimer')}</p>
        {turns.length > 0 && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              setTurns([])
              setStatus('idle')
            }}
          >
            {t('try.clear')}
          </button>
        )}
      </div>
    </div>
  )
}
