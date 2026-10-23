'use client'

import { useState } from 'react'
import { useLang } from '../lib/LanguageProvider.jsx'
import { pricingTiers } from '../lib/site.js'
import Reveal from './Reveal.jsx'

/**
 * Pricing. Selecting a tier writes the plan id into the contact form via a
 * callback rather than reaching across the DOM, and scrolls to it.
 */
export default function Pricing({ onSelectPlan }) {
  const { t } = useLang()
  const [annual, setAnnual] = useState(false)

  const choose = (tierId) => {
    onSelectPlan?.(tierId)
    const target = document.getElementById('contact')
    if (target) {
      // Honour reduced motion here too — an instant jump is the accessible default.
      const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
      target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
    }
  }

  return (
    <section className="section pricing" id="pricing">
      <div className="container">
        <Reveal className="section-header">
          <p className="section-kicker">{t('pricing.eyebrow')}</p>
          <h2>{t('pricing.title')}</h2>
        </Reveal>

        <div className="billing-toggle">
          <span id="billing-monthly-label">{t('pricing.monthly')}</span>
          <button
            type="button"
            className={annual ? 'toggle-switch active' : 'toggle-switch'}
            role="switch"
            aria-checked={annual}
            aria-labelledby="billing-monthly-label"
            onClick={() => setAnnual((v) => !v)}
          >
            <span className="toggle-knob" aria-hidden="true" />
          </button>
          <span>{t('pricing.annual')}</span>
          <span className="billing-save">{t('pricing.save')}</span>
        </div>

        <div className="pricing-grid">
          {pricingTiers.map((tier, i) => {
            const amount = annual ? tier.annual : tier.monthly
            const isFree = amount === 0

            return (
              <Reveal
                key={tier.id}
                className={tier.featured ? 'price-card featured' : 'price-card'}
                delay={i + 1}
              >
                {tier.featured && (
                  <span className="price-badge">{t('pricing.recommended')}</span>
                )}

                <h3 className="price-name">{t(tier.nameKey)}</h3>
                <p className="price-tagline">{t(tier.taglineKey)}</p>

                <p className="price-amount">
                  {isFree ? (
                    t('pricing.free.price')
                  ) : (
                    <>
                      ₹{amount.toLocaleString('en-IN')}
                      <span className="price-period">{t('pricing.perMonth')}</span>
                    </>
                  )}
                </p>

                <ul className="price-features">
                  {tier.featureKeys.map((key) => (
                    <li key={key}>
                      <span aria-hidden="true">✓</span> {t(key)}
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  className={tier.featured ? 'btn btn-primary price-cta' : 'btn btn-secondary price-cta'}
                  onClick={() => choose(tier.id)}
                >
                  {t(tier.ctaKey)}
                </button>
              </Reveal>
            )
          })}
        </div>

        <p className="pricing-note">{t('pricing.note')}</p>
      </div>
    </section>
  )
}
