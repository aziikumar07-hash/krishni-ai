'use client'

import { useLang } from '../lib/LanguageProvider.jsx'

/**
 * Visible only on keyboard focus (see .skip-link in globals.css). The legacy page
 * defined .sr-only but never shipped a skip link, so keyboard users had to tab
 * through the whole nav on every page.
 */
export default function SkipLink() {
  const { t } = useLang()
  return (
    <a href="#main" className="skip-link">
      {t('nav.skipToContent')}
    </a>
  )
}
