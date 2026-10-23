'use client'

import Image from 'next/image'
import { useLang } from '../lib/LanguageProvider.jsx'
import { metrics } from '../lib/site.js'
import Reveal from './Reveal.jsx'
import Icon from './Icon.jsx'

export default function About() {
  const { t } = useLang()

  const stats = [
    { id: 'accuracy', value: `${metrics.accuracyPct}%`, labelKey: 'about.stat.accuracy' },
    { id: 'villages', value: `${metrics.villages}+`, labelKey: 'about.stat.villages' },
    { id: 'crops', value: `${metrics.cropsSupported}`, labelKey: 'about.stat.crops' },
  ]

  return (
    <section className="section about" id="about">
      <div className="container about-grid">
        <Reveal className="about-text">
          <p className="section-kicker">{t('about.eyebrow')}</p>
          <h2>{t('about.title')}</h2>
          <p>{t('about.body.1')}</p>
          <p>{t('about.body.2')}</p>

          <div className="about-stats">
            {stats.map((stat) => (
              <div className="about-stat" key={stat.id}>
                <p className="stat-value">{stat.value}</p>
                <p className="stat-label">{t(stat.labelKey)}</p>
              </div>
            ))}
          </div>

          {/* The one honest hedge on the legacy page. Kept, and now it sits with
              the single accuracy constant rather than one of three figures. */}
          <p className="form-note">{t('about.disclaimer')}</p>
        </Reveal>

        <Reveal className="about-image-stack" delay={2}>
          <div className="about-image">
            <Image
              src="/images/hero-farmland.webp"
              alt="Mixed farmland at golden hour, the kind of smallholding Krishni AI is built for"
              width={640}
              height={480}
              sizes="(max-width: 900px) 90vw, 480px"
              quality={74}
            />
          </div>

          <WeatherCard />
        </Reveal>
      </div>
    </section>
  )
}

/**
 * Illustrative forecast card. Static by design — the weather feature is marked
 * "coming soon" in the features list, so live data here would misrepresent it.
 */
function WeatherCard() {
  const { t } = useLang()

  return (
    <div className="weather-card">
      <div className="weather-card-header">
        <strong>{t('about.weather.title')}</strong>
      </div>

      <div className="weather-body">
        <div className="weather-main">
          <Icon name="weather" className="weather-main-icon" />
          <div className="weather-info">
            <p className="weather-temp">32°C</p>
            <p>{t('about.weather.temp')}</p>
          </div>
        </div>

        <p className="weather-alert">
          <span className="weather-alert-icon" aria-hidden="true">
            <Icon name="alert" />
          </span>
          {t('about.weather.rain')} · {t('about.weather.advice')}
        </p>
      </div>
    </div>
  )
}
