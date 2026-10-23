'use client'

import { useLang } from '../lib/LanguageProvider.jsx'
import { howSteps } from '../lib/site.js'
import Reveal from './Reveal.jsx'
import Icon from './Icon.jsx'

export default function HowItWorks() {
  const { t } = useLang()

  return (
    <section className="section how-it-works" id="how">
      <div className="container">
        <Reveal className="section-header">
          <p className="section-kicker">{t('how.eyebrow')}</p>
          <h2>{t('how.title')}</h2>
        </Reveal>

        {/* An ordered list, because the order is the point. The legacy page used
            plain divs, so the sequence was visual only. */}
        <ol className="steps-grid">
          {howSteps.map((step, i) => (
            <Reveal as="li" key={step.n} className="step-card" delay={i + 1}>
              <span className="step-number" aria-hidden="true">
                {step.n}
              </span>
              <span className="feature-icon" aria-hidden="true">
                <Icon name={step.icon} />
              </span>
              <h3>{t(step.titleKey)}</h3>
              <p>{t(step.bodyKey)}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
