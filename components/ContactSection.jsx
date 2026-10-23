'use client'

import { useLang } from '../lib/LanguageProvider.jsx'
import { site } from '../lib/site.js'
import ContactForm from './ContactForm.jsx'
import Reveal from './Reveal.jsx'
import Icon from './Icon.jsx'

export default function ContactSection({ plan }) {
  const { t } = useLang()

  const channels = [
    { id: 'email', icon: 'mail', label: t('contact.email'), value: site.email, href: `mailto:${site.email}` },
    { id: 'phone', icon: 'phone', label: t('contact.phone'), value: site.phoneDisplay, href: `tel:${site.phone}` },
    { id: 'whatsapp', icon: 'chat', label: t('contact.whatsapp'), value: site.phoneDisplay, href: site.whatsapp, external: true },
  ]

  return (
    <section className="section cta-section" id="contact">
      <div className="container cta-grid">
        <Reveal className="cta-text">
          <p className="section-kicker">{t('contact.eyebrow')}</p>
          <h2>{t('contact.title')}</h2>
          <p>{t('contact.body')}</p>

          <ul className="cta-contact-list">
            {channels.map((channel) => (
              <li className="cta-contact-item" key={channel.id}>
                <span className="cta-contact-icon" aria-hidden="true">
                  <Icon name={channel.icon} />
                </span>
                <span>
                  <strong>{channel.label}</strong>
                  <br />
                  <a
                    href={channel.href}
                    {...(channel.external
                      ? { target: '_blank', rel: 'noopener noreferrer' }
                      : {})}
                  >
                    {channel.value}
                  </a>
                </span>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={2}>
          <ContactForm plan={plan} />
        </Reveal>
      </div>
    </section>
  )
}
