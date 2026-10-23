'use client'

import { useState } from 'react'
import { useLang } from '../lib/LanguageProvider.jsx'
import { features } from '../lib/site.js'
import Reveal from './Reveal.jsx'
import Icon from './Icon.jsx'

const TABS = [
  { id: 'all', labelKey: 'features.tab.all' },
  { id: 'live', labelKey: 'features.tab.live' },
  { id: 'soon', labelKey: 'features.tab.soon' },
]

export default function Features() {
  const { t } = useLang()
  const [tab, setTab] = useState('all')

  const shown = tab === 'all' ? features : features.filter((f) => f.status === tab)

  return (
    <section className="section features" id="features">
      <div className="container">
        <Reveal className="section-header">
          <p className="section-kicker">{t('features.eyebrow')}</p>
          <h2>{t('features.title')}</h2>
          <p>{t('features.subtitle')}</p>
        </Reveal>

        <div className="feature-tabs" role="tablist" aria-label={t('features.eyebrow')}>
          {TABS.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              id={`feature-tab-${item.id}`}
              aria-selected={tab === item.id}
              aria-controls="feature-panel"
              className={tab === item.id ? 'feature-tab active' : 'feature-tab'}
              onClick={() => setTab(item.id)}
            >
              {t(item.labelKey)}
            </button>
          ))}
        </div>

        {/* One panel whose contents swap, rather than three panels. The filter is
            a view of the same list, so a single labelled region is honest. */}
        <div
          className="features-grid"
          id="feature-panel"
          role="region"
          aria-labelledby={`feature-tab-${tab}`}
        >
          {shown.map((feature, i) => (
            <Reveal
              key={feature.id}
              className="feature-card"
              delay={Math.min(4, (i % 3) + 1)}
            >
              <div className="feature-card-body">
                <span className="feature-icon" aria-hidden="true">
                  <Icon name={feature.icon} />
                </span>
                <h3>{t(feature.titleKey)}</h3>
                <p>{t(feature.bodyKey)}</p>
                {feature.status === 'soon' && (
                  <span className="feature-badge badge-soon">{t('features.badge.soon')}</span>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
