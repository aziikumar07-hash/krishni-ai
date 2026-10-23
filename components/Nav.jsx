'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { useLang } from '../lib/LanguageProvider.jsx'
import { nav } from '../lib/site.js'

/**
 * Site navigation.
 *
 * The legacy page wrote the link list twice — once for desktop, once for the
 * mobile drawer — including all twelve data-en/data-hi attribute pairs, so every
 * copy change needed both copies. Here the list comes from lib/site.js and both
 * renderings map over it.
 */
export default function Nav() {
  const { lang, setLang, t } = useLang()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('')
  const toggleRef = useRef(null)

  useEffect(() => {
    // One passive listener doing both jobs. The legacy page registered three
    // separate unthrottled scroll handlers, one of which re-queried the DOM on
    // every event.
    const sections = Array.from(document.querySelectorAll('section[id]'))
    let frame = 0

    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        const y = window.scrollY
        setScrolled(y > 20)

        let current = ''
        for (const section of sections) {
          if (y >= section.offsetTop - 120) current = section.id
        }
        setActive(current)
      })
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  // Close the drawer on Escape and restore focus to the button that opened it.
  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false)
        toggleRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    // Stop the page scrolling behind the open drawer.
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open])

  const links = nav.map(({ key, href }) => {
    const id = href.split('#')[1]
    return (
      <Link
        key={key}
        href={href}
        className={active === id ? 'nav-link-active' : undefined}
        onClick={() => setOpen(false)}
      >
        {t(key)}
      </Link>
    )
  })

  const langToggle = (idSuffix) => (
    <div className="lang-toggle" role="group" aria-label={t('nav.langLabel')}>
      <button
        type="button"
        id={`lang-en-${idSuffix}`}
        className={lang === 'en' ? 'active' : undefined}
        aria-pressed={lang === 'en'}
        onClick={() => setLang('en')}
      >
        EN
      </button>
      <button
        type="button"
        id={`lang-hi-${idSuffix}`}
        className={lang === 'hi' ? 'active' : undefined}
        aria-pressed={lang === 'hi'}
        onClick={() => setLang('hi')}
      >
        हिन्दी
      </button>
    </div>
  )

  return (
    <nav className={scrolled ? 'nav scrolled' : 'nav'}>
      <div className="container nav-inner">
        <Link href="/" className="nav-logo" aria-label={`${t('chat.header')} — home`}>
          <span className="nav-logo-mark" aria-hidden="true">
            🌾
          </span>
          <span>{t('chat.header')}</span>
        </Link>

        {/* .nav-links is display:none below 900px; the drawer takes over there. */}
        <div className="nav-links">
          {links}
          {langToggle('d')}
          <Link href="/#contact" className="nav-cta">
            {t('nav.cta')}
          </Link>
        </div>

        <button
          ref={toggleRef}
          type="button"
          className={open ? 'nav-toggle active' : 'nav-toggle'}
          aria-expanded={open}
          aria-controls="nav-mobile"
          aria-label={open ? t('nav.closeMenu') : t('nav.openMenu')}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
        </button>
      </div>

      {/* No .container here — the drawer sets its own inset, and the container's
          max-width and padding would fight it. */}
      <div id="nav-mobile" className={open ? 'nav-mobile open' : 'nav-mobile'}>
        {links}
        {langToggle('m')}
        <Link href="/#contact" className="nav-cta" onClick={() => setOpen(false)}>
          {t('nav.cta')}
        </Link>
      </div>
    </nav>
  )
}
