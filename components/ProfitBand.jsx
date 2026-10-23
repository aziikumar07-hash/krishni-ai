'use client'

import { useEffect, useRef, useState } from 'react'
import { useLang } from '../lib/LanguageProvider.jsx'
import Reveal from './Reveal.jsx'

/**
 * The "why it matters" band, with a scripted WhatsApp exchange beside it.
 *
 * The legacy version started a 4-step timed sequence on first visibility and then
 * re-ran it on a setInterval every 8 seconds forever — including while scrolled
 * away and while the tab was backgrounded. Here it plays once when seen, and the
 * timers are cleared on unmount.
 */

const SCRIPT = [
  { key: 'chat.msg.1', dir: 'out', delay: 400 },
  { key: 'chat.msg.2', dir: 'in', delay: 1500 },
  { key: 'chat.msg.3', dir: 'out', delay: 2900 },
  { key: 'chat.msg.4', dir: 'in', delay: 4100 },
]

export default function ProfitBand() {
  const { t } = useLang()

  return (
    <section className="section profit-band" aria-labelledby="profit-title">
      <div className="container profit-grid">
        <Reveal className="profit-text">
          <p className="section-kicker">{t('profit.eyebrow')}</p>
          <h2 id="profit-title">{t('profit.title')}</h2>
          <p>{t('profit.body')}</p>

          <ul className="profit-points">
            {['profit.point.1', 'profit.point.2', 'profit.point.3'].map((key) => (
              <li className="profit-point" key={key}>
                <span className="profit-point-icon" aria-hidden="true">
                  ✓
                </span>
                {t(key)}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={2}>
          <ChatMock />
        </Reveal>
      </div>
    </section>
  )
}

function ChatMock() {
  const { t } = useLang()
  const ref = useRef(null)
  const [visibleCount, setVisibleCount] = useState(0)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    // Show the whole conversation at once rather than animating it in. Scheduled
    // on a frame rather than called inline: a synchronous setState in an effect
    // body cascades renders.
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      const frame = requestAnimationFrame(() => setVisibleCount(SCRIPT.length))
      return () => cancelAnimationFrame(frame)
    }

    const timers = []

    const play = () => {
      SCRIPT.forEach((step, i) => {
        timers.push(setTimeout(() => setVisibleCount(i + 1), step.delay))
      })
    }

    if (typeof IntersectionObserver === 'undefined') {
      play()
    } else {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            play()
            observer.disconnect()
          }
        },
        { threshold: 0.4 },
      )
      observer.observe(node)
      // Clearing both the observer and any pending timeouts.
      timers.push(() => observer.disconnect())
    }

    return () => {
      for (const item of timers) {
        if (typeof item === 'function') item()
        else clearTimeout(item)
      }
    }
  }, [])

  return (
    <div className="chat-mock" ref={ref}>
      <div className="chat-header">
        <span className="chat-avatar" aria-hidden="true">
          🌾
        </span>
        <div>
          <strong>{t('chat.header')}</strong>
          <span>{t('chat.status')}</span>
        </div>
      </div>

      {/* Decorative illustration of a WhatsApp thread, not a live conversation. */}
      <div className="chat-body">
        {SCRIPT.slice(0, visibleCount).map((step) => (
          <p key={step.key} className={`bubble bubble-${step.dir}`}>
            {t(step.key)}
          </p>
        ))}
      </div>
    </div>
  )
}
