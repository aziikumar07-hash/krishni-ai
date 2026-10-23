'use client'

import Link from 'next/link'
import { useLang } from '../../lib/LanguageProvider.jsx'

/**
 * Post-submission landing page.
 *
 * Kept as a real route because next.config.mjs redirects the legacy
 * /thank-you.html here, and because Formspree's own redirect target points at it.
 * The React form itself shows an inline success state instead of navigating, so
 * most users will never see this page — it is the no-JS / external-redirect path.
 *
 * The legacy version was a standalone HTML file with its own 90-line copy of the
 * design tokens and its own Google Fonts <link>. This uses the shared stylesheet.
 */
export default function ThankYouPage() {
  const { t } = useLang()

  return (
    <main id="main" className="thanks-page">
      <div className="thanks-card">
        <div className="thanks-icon" aria-hidden="true">
          ✅
        </div>
        <h1>{t('thanks.title')}</h1>
        <p>{t('thanks.body')}</p>
        <p className="thanks-note">{t('thanks.note')}</p>

        <div className="thanks-actions">
          <Link href="/" className="btn btn-primary">
            {t('thanks.back')}
          </Link>
          {/* Better than a dead end: the assistant is live and free to try. */}
          <Link href="/try" className="btn btn-secondary">
            {t('thanks.tryCta')}
          </Link>
        </div>
      </div>
    </main>
  )
}
