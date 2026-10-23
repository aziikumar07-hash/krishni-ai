'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useLang } from '../lib/LanguageProvider.jsx'
import { testimonials } from '../lib/site.js'
import Reveal from './Reveal.jsx'

const PER_SLIDE = 3
const AUTOPLAY_MS = 5000

/**
 * First letter of the first two words — "Rajesh Patil" → "RP".
 * Works for the Devanagari names this list will eventually carry, since it slices
 * code points rather than assuming ASCII.
 */
function initials(name) {
  return [...name.trim().split(/\s+/).slice(0, 2)]
    .map((word) => [...word][0] ?? '')
    .join('')
    .toUpperCase()
}

const slides = []
for (let i = 0; i < testimonials.length; i += PER_SLIDE) {
  slides.push(testimonials.slice(i, i + PER_SLIDE))
}

export default function Testimonials() {
  const { t } = useLang()
  const [index, setIndex] = useState(0)
  // Autoplay is paused on hover, on focus within, and once the reader has taken
  // manual control. WCAG 2.2.2 wants a way to stop moving content; the legacy
  // carousel paused on hover only, which a keyboard user cannot do.
  const [paused, setPaused] = useState(false)
  const touchStart = useRef(null)

  const go = useCallback((next) => {
    setIndex(((next % slides.length) + slides.length) % slides.length)
  }, [])

  useEffect(() => {
    if (paused || slides.length < 2) return

    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduce) return

    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), AUTOPLAY_MS)
    return () => clearInterval(id)
  }, [paused])

  const onTouchStart = (e) => {
    touchStart.current = e.touches[0].clientX
  }

  const onTouchEnd = (e) => {
    if (touchStart.current === null) return
    const delta = e.changedTouches[0].clientX - touchStart.current
    if (Math.abs(delta) > 50) go(index + (delta < 0 ? 1 : -1))
    touchStart.current = null
  }

  return (
    <section className="section testimonials" id="testimonials">
      <div className="container">
        <Reveal className="section-header">
          <p className="section-kicker">{t('testimonials.eyebrow')}</p>
          <h2>{t('testimonials.title')}</h2>
        </Reveal>

        <div
          className="testimonials-carousel-wrap"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          role="group"
          aria-roledescription="carousel"
          aria-label={t('testimonials.title')}
        >
          <div className="testimonials-track-outer">
            <div
              className="testimonials-track"
              style={{ transform: `translateX(-${index * 100}%)` }}
            >
              {slides.map((group, slideIndex) => (
                <div
                  className="testimonial-card"
                  key={`slide-${slideIndex}`}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${slideIndex + 1} of ${slides.length}`}
                  // Keep off-screen slides out of the tab order and the a11y tree.
                  aria-hidden={slideIndex !== index}
                >
                  {group.map((item) => (
                    <figure className="t-item" key={item.id}>
                      <blockquote className="t-quote">{item.quote}</blockquote>
                      <figcaption className="t-author">
                        {/* Initials, not an emoji. A wheat glyph standing in for
                            a person's face read as a missing asset. */}
                        <span className="t-avatar" aria-hidden="true">
                          {initials(item.name)}
                        </span>
                        <span className="t-info">
                          <strong>{item.name}</strong>
                          <span>{item.role}</span>
                        </span>
                      </figcaption>
                    </figure>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="carousel-controls">
            <button
              type="button"
              className="carousel-btn"
              aria-label={t('testimonials.prev')}
              onClick={() => {
                setPaused(true)
                go(index - 1)
              }}
            >
              <span aria-hidden="true">←</span>
            </button>

            <div className="carousel-dots">
              {slides.map((_, dotIndex) => (
                <button
                  key={`dot-${dotIndex}`}
                  type="button"
                  className={dotIndex === index ? 'carousel-dot active' : 'carousel-dot'}
                  aria-label={`${dotIndex + 1} of ${slides.length}`}
                  aria-current={dotIndex === index}
                  onClick={() => {
                    setPaused(true)
                    go(dotIndex)
                  }}
                />
              ))}
            </div>

            <button
              type="button"
              className="carousel-btn"
              aria-label={t('testimonials.next')}
              onClick={() => {
                setPaused(true)
                go(index + 1)
              }}
            >
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>

        {/* Added, not in the legacy page: these quotes describe a product still in
            pilot. Labelling them is the minimum; confirming or replacing the copy
            is a decision for the owner. */}
        <p className="pricing-note">{t('testimonials.disclaimer')}</p>
      </div>
    </section>
  )
}
