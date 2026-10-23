'use client'

import { useState } from 'react'
import { useLang } from '../lib/LanguageProvider.jsx'
import { faqs } from '../lib/site.js'
import Reveal from './Reveal.jsx'

/**
 * Single-open accordion.
 *
 * Two legacy fixes: the panels are now linked to their buttons with
 * aria-controls/aria-labelledby, and collapsed answers are removed from the
 * accessibility tree with `hidden` instead of being merely clipped by
 * max-height:0, which left them focusable and searchable while invisible.
 *
 * The legacy version also added a keydown handler for Enter/Space on a <button>,
 * which already fires click for both — so Space could double-fire. Dropped.
 */
export default function Faq() {
  const { t } = useLang()
  const [open, setOpen] = useState(null)

  return (
    <section className="section faq" id="faq">
      <div className="container">
        <Reveal className="section-header">
          <p className="section-kicker">{t('faq.eyebrow')}</p>
          <h2>{t('faq.title')}</h2>
        </Reveal>

        <div className="faq-list">
          {faqs.map((item, i) => {
            const isOpen = open === i
            const btnId = `faq-q-${i}`
            const panelId = `faq-a-${i}`

            return (
              <Reveal key={item.q} className={isOpen ? 'faq-item open' : 'faq-item'}>
                <h3>
                  <button
                    type="button"
                    id={btnId}
                    className="faq-question"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpen(isOpen ? null : i)}
                  >
                    <span>{t(item.q)}</span>
                    <span className="faq-chevron" aria-hidden="true">
                      ⌄
                    </span>
                  </button>
                </h3>

                <div
                  id={panelId}
                  className="faq-answer"
                  role="region"
                  aria-labelledby={btnId}
                  hidden={!isOpen}
                >
                  <p>{t(item.a)}</p>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
