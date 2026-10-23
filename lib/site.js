/**
 * Site-wide constants and structured content.
 *
 * Kept out of the components so a copy change or a new pricing tier is a data
 * edit, not a JSX edit. Text that differs by language lives in i18n.js and is
 * referenced here by key.
 */

export const site = {
  name: 'Krishni AI',
  // Absolute base URL, needed for canonical tags and og:image. Falls back to
  // the production host so metadata is still valid in a local build.
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://krishniai.online',
  email: 'hello@krishniai.online',
  phone: '+918626886672',
  phoneDisplay: '+91 86268 86672',
  whatsapp: 'https://wa.me/918626886672',
  // Single place to bump the year in the footer.
  foundedYear: 2026,
}

// The accuracy figure appeared as 94% in two places and 93% in a third in the
// legacy page. One constant, one number, quoted everywhere from here.
export const metrics = {
  accuracyPct: 93,
  villages: 500,
  avgProfitPerAcre: 22000,
  farmersInIndia: '60M+',
  cropsSupported: 12,
}

export const nav = [
  { key: 'nav.features', href: '/#features' },
  { key: 'nav.how', href: '/#how' },
  { key: 'nav.about', href: '/#about' },
  { key: 'nav.pricing', href: '/#pricing' },
  { key: 'nav.faq', href: '/#faq' },
  { key: 'nav.contact', href: '/#contact' },
]

// `icon` is a key into components/Icon.jsx, not a glyph. Emoji rendered
// differently on every platform, which is a problem when most of the audience is
// on budget Android. `id` stays as-is — it is a lookup key, not display.
export const crops = [
  { id: 'wheat', icon: 'wheat', labelKey: 'gallery.wheat', image: '/images/wheat-field.webp' },
  { id: 'cotton', icon: 'seedling', labelKey: 'gallery.cotton', image: '/images/cotton-field.webp' },
  { id: 'tomato', icon: 'tomato', labelKey: 'gallery.tomato', image: '/images/crops-tomatoes.webp' },
  { id: 'mixed', icon: 'tractor', labelKey: 'gallery.farmland', image: '/images/hero-farmland.webp' },
]

/**
 * Form crop options. `id` is the submitted value and must never change — it is
 * the stable key in the lead data. `labelKey` is what the farmer sees and is
 * free to be translated. The legacy <option> elements had no value attribute at
 * all, so the submitted value was the visible label and would have broken the
 * moment those labels were translated.
 */
export const cropOptions = [
  { id: 'wheat', labelKey: 'gallery.wheat' },
  { id: 'cotton', labelKey: 'gallery.cotton' },
  { id: 'tomato', labelKey: 'gallery.tomato' },
  { id: 'rice', labelEn: 'Rice / Paddy', labelHi: 'धान' },
  { id: 'sugarcane', labelEn: 'Sugarcane', labelHi: 'गन्ना' },
  { id: 'soybean', labelEn: 'Soybean', labelHi: 'सोयाबीन' },
  { id: 'onion', labelEn: 'Onion', labelHi: 'प्याज़' },
  { id: 'pulses', labelEn: 'Pulses / Dal', labelHi: 'दालें' },
  { id: 'other', labelEn: 'Something else', labelHi: 'कोई और' },
]

// Free-text state with a 2-char minimum meant "xx" passed validation. A closed
// list is easier for the farmer and gives clean lead data.
export const indianStates = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa',
  'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
  'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland',
  'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana',
  'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu & Kashmir', 'Ladakh', 'Puducherry', 'Chandigarh',
  'Andaman & Nicobar Islands', 'Dadra & Nagar Haveli and Daman & Diu', 'Lakshadweep',
]

export const features = [
  { id: 'cost', icon: 'ledger', titleKey: 'features.cost.title', bodyKey: 'features.cost.body', status: 'live' },
  { id: 'disease', icon: 'magnifier', titleKey: 'features.disease.title', bodyKey: 'features.disease.body', status: 'live' },
  { id: 'profit', icon: 'chart', titleKey: 'features.profit.title', bodyKey: 'features.profit.body', status: 'live' },
  { id: 'hindi', icon: 'speech', titleKey: 'features.hindi.title', bodyKey: 'features.hindi.body', status: 'live' },
  { id: 'weather', icon: 'weather', titleKey: 'features.weather.title', bodyKey: 'features.weather.body', status: 'soon' },
  { id: 'yield', icon: 'scale', titleKey: 'features.yield.title', bodyKey: 'features.yield.body', status: 'soon' },
]

export const pricingTiers = [
  {
    id: 'starter',
    nameKey: 'pricing.free.name',
    taglineKey: 'pricing.free.tagline',
    monthly: 0,
    annual: 0,
    freeKey: 'pricing.free.price',
    featureKeys: ['pricing.free.f1', 'pricing.free.f2', 'pricing.free.f3', 'pricing.free.f4'],
    ctaKey: 'pricing.free.cta',
    featured: false,
  },
  {
    id: 'harvest',
    nameKey: 'pricing.harvest.name',
    taglineKey: 'pricing.harvest.tagline',
    monthly: 299,
    annual: 199,
    featureKeys: [
      'pricing.harvest.f1', 'pricing.harvest.f2', 'pricing.harvest.f3',
      'pricing.harvest.f4', 'pricing.harvest.f5',
    ],
    ctaKey: 'pricing.harvest.cta',
    featured: true,
  },
  {
    id: 'coop',
    nameKey: 'pricing.coop.name',
    taglineKey: 'pricing.coop.tagline',
    monthly: 1499,
    annual: 999,
    featureKeys: ['pricing.coop.f1', 'pricing.coop.f2', 'pricing.coop.f3', 'pricing.coop.f4'],
    ctaKey: 'pricing.coop.cta',
    featured: false,
  },
]

export const faqs = [
  { q: 'faq.q1', a: 'faq.a1' },
  { q: 'faq.q2', a: 'faq.a2' },
  { q: 'faq.q3', a: 'faq.a3' },
  { q: 'faq.q4', a: 'faq.a4' },
  { q: 'faq.q5', a: 'faq.a5' },
  { q: 'faq.q6', a: 'faq.a6' },
]

export const howSteps = [
  { n: 1, icon: 'contactCard', titleKey: 'how.step1.title', bodyKey: 'how.step1.body' },
  { n: 2, icon: 'chat', titleKey: 'how.step2.title', bodyKey: 'how.step2.body' },
  { n: 3, icon: 'seedling', titleKey: 'how.step3.title', bodyKey: 'how.step3.body' },
]

/**
 * Testimonial copy, carried across from the legacy page unchanged.
 *
 * Flagged, not edited: these are named, located, rupee-specific quotes for a
 * product the FAQ says is still in pilot. If they are illustrative rather than
 * verbatim, they need labelling — unlabelled invented testimonials with
 * real-sounding attributions are an exposure under CCPA 2019, not just a copy
 * problem. A `testimonials.disclaimer` string is rendered under the carousel as
 * a stopgap; the copy itself is yours to confirm or replace.
 */
export const testimonials = [
  {
    id: 't1', name: 'Rajesh Patil', role: 'Tomato farmer, Sangli',
    quote:
      "I caught leaf blight in my tomatoes three days before it spread. The AI suggested a copper spray and I saved 80% of my crop. My neighbours couldn't believe it.",
  },
  {
    id: 't2', name: 'Sunita Devi', role: 'Cotton farmer, Jalgaon',
    quote:
      'The weather alert came on WhatsApp at 6 AM — heavy rain warning. I delayed my pesticide spray by one day and saved ₹4,000 worth of inputs.',
  },
  {
    id: 't3', name: 'Gurpreet Singh', role: 'Rice farmer, Ludhiana',
    quote:
      'I used to guess when to sow. Now Krishni tells me the exact week based on my soil and weather. My yield went up 30% this season.',
  },
  {
    id: 't4', name: 'Amit Kumar', role: 'Wheat farmer, Amritsar',
    quote:
      'Maine voice note bheja — "khaad pe ₹800 diye" — aur Krishni ne khud log kar liya. Week mein report aayi toh pata chala main budget se ₹2,000 kam tha. Pehle kabhi nahi pata chalta tha.',
  },
  {
    id: 't5', name: 'Meena Sharma', role: 'Potato farmer, Agra',
    quote:
      "Disease detection saved my potato crop twice this season. I just take a photo and in 30 seconds I know exactly what's wrong and what spray to use.",
  },
  {
    id: 't6', name: 'Harish Yadav', role: 'Wheat farmer, Kanpur',
    quote:
      'The profit forecast was just ₹200 off from the actual number. It is incredibly accurate. I now use it to decide whether to sell immediately or store for a better price.',
  },
]

/**
 * Stats band. `label` is an i18n key; the numbers come from `metrics` so the
 * accuracy figure cannot drift from the FAQ and the About section again.
 */
export const stats = [
  { id: 'farmers', target: 60, suffix: 'M+', labelKey: 'stats.farmers' },
  { id: 'accuracy', target: metrics.accuracyPct, suffix: '%', labelKey: 'stats.accuracy' },
  { id: 'profit', target: 22, prefix: '₹', suffix: 'K+', labelKey: 'stats.profit' },
  { id: 'villages', target: metrics.villages, suffix: '+', labelKey: 'stats.villages' },
]
