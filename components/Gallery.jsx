'use client'

import Image from 'next/image'
import { useLang } from '../lib/LanguageProvider.jsx'
import { crops } from '../lib/site.js'

/**
 * Marquee strip of crop photography.
 *
 * The list is rendered twice to make the CSS loop seamless. The second copy is
 * aria-hidden so screen readers hear each crop once — the legacy page duplicated
 * the markup by hand with identical alt text on both halves.
 */
export default function Gallery() {
  const { t } = useLang()

  const item = (crop, clone) => (
    <figure className="gallery-item" key={`${crop.id}${clone ? '-clone' : ''}`}>
      <Image
        src={crop.image}
        alt={clone ? '' : `${t(crop.labelKey)} — Krishni AI supported crop`}
        width={520}
        height={390}
        sizes="(max-width: 768px) 60vw, 320px"
        // Explicit dimensions and sizes: the legacy <img> tags had neither, so
        // the browser could not reserve space and the strip shifted on load.
        loading="lazy"
        quality={72}
      />
      <figcaption className="gallery-item-label">{t(crop.labelKey)}</figcaption>
    </figure>
  )

  return (
    <section className="gallery" aria-label={t('gallery.title')}>
      <div className="container gallery-header">
        <h2>{t('gallery.title')}</h2>
      </div>

      <div className="gallery-track">
        {crops.map((crop) => item(crop, false))}
        <div className="gallery-clone" aria-hidden="true">
          {crops.map((crop) => item(crop, true))}
        </div>
      </div>
    </section>
  )
}
