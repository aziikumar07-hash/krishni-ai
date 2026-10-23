'use client'

import Nav from '../../components/Nav.jsx'
import Footer from '../../components/Footer.jsx'
import SkipLink from '../../components/SkipLink.jsx'
import ChatClient from '../../components/ChatClient.jsx'
import { useLang } from '../../lib/LanguageProvider.jsx'

export default function TryPage() {
  const { t } = useLang()

  return (
    <>
      <SkipLink />
      <Nav />

      <main id="main">
        <section className="section">
          <div className="container container-narrow">
            {/* .section-header styles h2, but this page's heading must be the h1. */}
            <div className="section-header">
              <p className="section-kicker">{t('try.eyebrow')}</p>
              <h1>{t('try.title')}</h1>
              <p>{t('try.body')}</p>
            </div>

            <ChatClient />
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
