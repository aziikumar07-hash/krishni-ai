import { Inter, Instrument_Serif, Mukta, Noto_Serif_Devanagari } from 'next/font/google'
import { LanguageProvider } from '../lib/LanguageProvider.jsx'
import { site, metrics } from '../lib/site.js'
import './globals.css'

/**
 * Fonts via next/font instead of the legacy <link> to fonts.googleapis.com.
 * They are self-hosted at build time, which removes two preconnects, a
 * render-blocking stylesheet, and the layout shift the swap caused.
 */
const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-inter',
  display: 'swap',
})

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-instrument',
  display: 'swap',
})

/**
 * Devanagari. Neither Inter nor Instrument Serif ships a devanagari subset —
 * verified against Next's font catalog — so every Hindi string was falling back
 * to whatever the OS substituted. That is half the audience and the default
 * language for the farmers this is built for.
 *
 * These are listed AFTER the Latin faces in the CSS stacks, so the browser only
 * reaches them for glyphs the Latin face lacks. Latin text is untouched; Hindi
 * text now has a chosen face instead of a platform accident.
 */
const mukta = Mukta({
  subsets: ['devanagari', 'latin'],
  // Mukta has no 500; 600 covers the medium-weight UI text.
  weight: ['400', '600', '700', '800'],
  variable: '--font-mukta',
  display: 'swap',
})

const notoSerifDevanagari = Noto_Serif_Devanagari({
  subsets: ['devanagari', 'latin'],
  weight: '400',
  variable: '--font-noto-serif-dev',
  display: 'swap',
})

const title = 'Krishni AI — Know Your Farm Profit Before Harvest'
const description =
  'Track farm expenses, catch crop risk early and see your profit forecast before harvest — all inside WhatsApp. No app to install.'

export const metadata = {
  // Makes every relative URL below absolute, which the legacy page's relative
  // og:image needed and lacked — most crawlers dropped the preview entirely.
  metadataBase: new URL(site.url),
  title: {
    default: title,
    template: `%s — ${site.name}`,
  },
  description,
  applicationName: site.name,
  keywords: [
    'farm profit tracker',
    'WhatsApp farming assistant',
    'crop disease detection India',
    'kisan app',
    'farm expense tracking',
    'Hindi agriculture assistant',
  ],
  authors: [{ name: site.name }],
  alternates: {
    canonical: '/',
    languages: { 'en-IN': '/', 'hi-IN': '/' },
  },
  openGraph: {
    type: 'website',
    siteName: site.name,
    title,
    description,
    url: '/',
    locale: 'en_IN',
    images: [
      {
        url: '/images/og-cover.webp',
        width: 1200,
        height: 630,
        alt: 'Krishni AI — a WhatsApp farm assistant for Indian farmers',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['/images/og-cover.webp'],
  },
  robots: {
    index: true,
    follow: true,
  },
  // app/icon.svg is picked up automatically by Next's file conventions.
  // No apple-touch icon yet — a missing file is worse than an absent tag.
}

export const viewport = {
  themeColor: '#16a34a',
  width: 'device-width',
  initialScale: 1,
}

/**
 * Structured data. The legacy page had a six-question FAQ and no JSON-LD, so it
 * was ineligible for FAQ rich results. Organization + FAQPage emitted here.
 *
 * Every claim below is sourced from lib/site.js so it cannot drift from the
 * visible copy — the legacy page quoted 94% accuracy twice and 93% once.
 */
function StructuredData() {
  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${site.url}/#organization`,
        name: site.name,
        url: site.url,
        email: site.email,
        telephone: site.phone,
        description,
        address: { '@type': 'PostalAddress', addressCountry: 'IN' },
      },
      {
        '@type': 'WebSite',
        '@id': `${site.url}/#website`,
        url: site.url,
        name: site.name,
        publisher: { '@id': `${site.url}/#organization` },
        inLanguage: ['en-IN', 'hi-IN'],
      },
      {
        '@type': 'FAQPage',
        '@id': `${site.url}/#faq`,
        mainEntity: [
          {
            q: 'Do I need to install anything?',
            a: 'No. Krishni AI works inside WhatsApp, which you already have. Save the number and send a message.',
          },
          {
            q: 'Is it available right now?',
            a: 'The WhatsApp assistant is in pilot with a limited group of farms. Join the early-access list and we will send the number as we widen the pilot.',
          },
          {
            q: 'Which languages does it understand?',
            a: 'Hindi and English today, including mixed Hinglish sentences. More regional languages are planned.',
          },
          {
            q: 'How accurate is the crop disease check?',
            a: `On our internal test set it reaches ${metrics.accuracyPct}% accuracy. That is a lab measurement, not a field trial, and it is not a substitute for an agronomist on a serious outbreak.`,
          },
          {
            q: 'What happens to my farm data?',
            a: 'It stays yours. We use it to answer your questions and improve the assistant. We do not sell it to input companies or traders, and you can ask us to delete it at any time.',
          },
          {
            q: 'How much data does it use?',
            a: 'Almost none for text. A crop photo costs about the same as sending one to a friend.',
          },
        ].map(({ q, a }) => ({
          '@type': 'Question',
          name: q,
          acceptedAnswer: { '@type': 'Answer', text: a },
        })),
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      // Content is a literal built above, not user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  )
}

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${instrumentSerif.variable} ${mukta.variable} ${notoSerifDevanagari.variable}`}
    >
      <head>
        <StructuredData />
      </head>
      <body>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  )
}
