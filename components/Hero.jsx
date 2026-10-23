'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useLang } from '../lib/LanguageProvider.jsx'
import { crops } from '../lib/site.js'

const ROTATOR_KEYS = ['hero.rotator.1', 'hero.rotator.2', 'hero.rotator.3', 'hero.rotator.4']
const ROTATE_MS = 3600

export default function Hero() {
  const { t } = useLang()
  const [index, setIndex] = useState(0)

  useEffect(() => {
    // The legacy rotator held a hardcoded English array, so it stayed English
    // after switching to हिन्दी. Rotating over keys keeps it in the active
    // language for free.
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduce) return

    const id = setInterval(() => setIndex((i) => (i + 1) % ROTATOR_KEYS.length), ROTATE_MS)
    // Cleared on unmount. The legacy page left two setIntervals running forever,
    // including while the tab was backgrounded.
    return () => clearInterval(id)
  }, [])

  return (
    <section className="hero" id="hero">
      <div className="hero-bg" aria-hidden="true" />
      <div className="hero-grid-pattern" aria-hidden="true" />

      <div className="container hero-content">
        <div className="hero-content">
          <p className="hero-eyebrow">
            <span className="hero-eyebrow-dot" aria-hidden="true" />
            {t('hero.eyebrow')}
          </p>

          <h1>
            {t('hero.title.a')} <em>{t('hero.title.em')}</em> {t('hero.title.b')}
          </h1>

          <div className="hero-type-wrap">
            {/* aria-live so the rotation is announced once, not on every frame. */}
            <p className="hero-type active" aria-live="polite">
              {t(ROTATOR_KEYS[index])}
            </p>
          </div>

          <p className="hero-subtitle">{t('hero.subtitle')}</p>

          <div className="hero-actions">
            <Link href="/#contact" className="btn btn-primary">
              {t('hero.ctaPrimary')}
              <span className="btn-arrow" aria-hidden="true">
                →
              </span>
            </Link>
            <Link href="/try" className="btn btn-secondary">
              {t('try.eyebrow')}
            </Link>
          </div>

          <div className="hero-social-proof">
            <span className="hero-social-label">{t('hero.socialLabel')}</span>
            <div className="hero-crops">
              {crops.map((crop) => (
                <span key={crop.id} className="hero-crop-tag">
                  <span aria-hidden="true">{crop.emoji}</span>
                  {t(crop.labelKey)}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="hero-card">
          <HeroDashboard />
        </div>
      </div>
    </section>
  )
}

/**
 * The mock console. Explicitly decorative: it illustrates what the WhatsApp
 * assistant reports back, and none of these numbers are live.
 */
function HeroDashboard() {
  const { t } = useLang()

  const costs = [
    { key: 'dash.cost.seed', value: '₹4,200' },
    { key: 'dash.cost.fertiliser', value: '₹3,850' },
    { key: 'dash.cost.labour', value: '₹2,900' },
    { key: 'dash.cost.irrigation', value: '₹1,450' },
  ]

  return (
    <div className="dashboard">
      <div className="dash-header">
        <span className="dash-title">{t('dash.title')}</span>
        <span className="dash-badge">
          <span className="dash-badge-dot" aria-hidden="true" />
          {t('dash.live')}
        </span>
      </div>

      <div className="dash-body">
        <div className="dash-panel">
          <p className="dash-panel-title">{t('dash.costs')}</p>
          {costs.map((row) => (
            <div key={row.key} className="dash-item">
              <span className="dash-item-label">{t(row.key)}</span>
              <span className="dash-item-value">{row.value}</span>
            </div>
          ))}
        </div>

        <div className="dash-panel dash-panel-alert">
          <p className="dash-alert">{t('dash.alert')}</p>
        </div>
      </div>

      <div className="dash-footer">
        <div className="dash-stat">
          <p className="dash-stat-value">₹18.4K</p>
          <p className="dash-stat-label">{t('dash.stat.margin')}</p>
        </div>
        <div className="dash-stat">
          <p className="dash-stat-value">14.2q</p>
          <p className="dash-stat-label">{t('dash.stat.breakeven')}</p>
        </div>
        <div className="dash-stat">
          <p className="dash-stat-value">21.0q</p>
          <p className="dash-stat-label">{t('dash.stat.yield')}</p>
        </div>
      </div>
    </div>
  )
}
