'use client'

import Link from 'next/link'
import { useLang } from '../lib/LanguageProvider.jsx'
import { site } from '../lib/site.js'

/**
 * Footer.
 *
 * The legacy footer was entirely English even in Hindi mode, and carried four
 * href="#" dead links (two app-store badges, Twitter, LinkedIn). Unshipped
 * destinations are now plain text marked "coming soon" rather than anchors that
 * scroll the user to the top of the page.
 */
export default function Footer() {
  const { t } = useLang()
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="nav-logo">
              <span className="nav-logo-mark" aria-hidden="true">
                🌾
              </span>
              <span>{t('chat.header')}</span>
            </div>
            {/* .footer-brand p carries the tagline/contact styling in globals.css. */}
            <p>{t('footer.tagline')}</p>
            <p>
              <a href={`mailto:${site.email}`}>{site.email}</a>
              <br />
              <a href={site.whatsapp} target="_blank" rel="noopener noreferrer">
                {site.phoneDisplay}
              </a>
            </p>
          </div>

          <div className="footer-col">
            <h3>{t('footer.product')}</h3>
            <ul>
              <li>
                <Link href="/#features">{t('nav.features')}</Link>
              </li>
              <li>
                <Link href="/#pricing">{t('nav.pricing')}</Link>
              </li>
              <li>
                <Link href="/#how">{t('nav.how')}</Link>
              </li>
              <li>
                <Link href="/try">{t('try.eyebrow')}</Link>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h3>{t('footer.company')}</h3>
            <ul>
              <li>
                <Link href="/#about">{t('nav.about')}</Link>
              </li>
              <li>
                <Link href="/#faq">{t('nav.faq')}</Link>
              </li>
              <li>
                <Link href="/#contact">{t('nav.contact')}</Link>
              </li>
              <li>
                <Link href="/privacy">{t('footer.legal.privacy')}</Link>
              </li>
              <li>
                <Link href="/terms">{t('footer.legal.terms')}</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            © {year} {site.name}. {t('footer.rights')}
          </p>
          <p className="footer-made">
            {t('footer.madeIn')} <span aria-hidden="true">🇮🇳</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
