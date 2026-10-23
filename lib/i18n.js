/**
 * Static bilingual dictionary.
 *
 * The legacy page fired 34 sequential awaited POSTs to /api/translate on every
 * switch to Hindi, then fell back to data-hi attributes that were already in the
 * DOM. The endpoint echoed its input back unchanged, so the network round trips
 * bought nothing but latency and a multi-second stall on static hosting.
 *
 * Translation is a build-time concern for fixed marketing copy. Everything the
 * page renders is resolved from this object synchronously. The only text that
 * still crosses the network is AI chat output, which Gemini is instructed to
 * produce in the requested language directly.
 */

import { hi } from './i18n.hi.js'

export const LANGS = ['en', 'hi']
export const DEFAULT_LANG = 'en'

// Persisted so the choice survives navigation — the legacy page reset to
// English on every page load, including the trip back from the privacy policy.
export const LANG_STORAGE_KEY = 'krishni-lang'

export const dict = {
  en: {
    // ── Navigation ────────────────────────────────────────────────
    'nav.features': 'Features',
    'nav.how': 'How It Works',
    'nav.about': 'About',
    'nav.pricing': 'Pricing',
    'nav.faq': 'FAQ',
    'nav.contact': 'Contact',
    'nav.cta': 'Get Early Access',
    'nav.openMenu': 'Open menu',
    'nav.closeMenu': 'Close menu',
    'nav.skipToContent': 'Skip to main content',
    'nav.langLabel': 'Language',

    // ── Hero ──────────────────────────────────────────────────────
    'hero.eyebrow': 'Built for Indian farmers',
    'hero.title.a': 'Know your farm',
    'hero.title.em': 'profit',
    'hero.title.b': 'before harvest',
    'hero.subtitle':
      'Track every expense, catch crop risk early, and see your profit forecast — all inside WhatsApp. No app to install, no forms to fill.',
    'hero.ctaPrimary': 'Get Early Access',
    'hero.ctaSecondary': 'See How It Works',
    'hero.socialLabel': 'Supports',
    'hero.rotator.1': 'Ask in Hindi, get answers in Hindi.',
    'hero.rotator.2': 'Send a photo, learn what is wrong.',
    'hero.rotator.3': 'Log a cost, watch your margin move.',
    'hero.rotator.4': 'Know your break-even before you sow.',

    // ── Hero dashboard mock ───────────────────────────────────────
    'dash.title': 'Farm Console',
    'dash.live': 'Live',
    'dash.costs': 'Season costs',
    'dash.cost.seed': 'Seed',
    'dash.cost.fertiliser': 'Fertiliser',
    'dash.cost.labour': 'Labour',
    'dash.cost.irrigation': 'Irrigation',
    'dash.alert': 'Leaf spot risk is high this week. Scout the north block first.',
    'dash.stat.margin': 'Est. margin',
    'dash.stat.breakeven': 'Break-even',
    'dash.stat.yield': 'Est. yield',
    'dash.float.weather': 'Rain in 2 days',
    'dash.float.price': 'Mandi price up 4%',

    // ── Gallery ───────────────────────────────────────────────────
    'gallery.title': 'Crops we cover',
    'gallery.wheat': 'Wheat',
    'gallery.cotton': 'Cotton',
    'gallery.tomato': 'Tomato',
    'gallery.farmland': 'Mixed farmland',

    // ── Stats band ────────────────────────────────────────────────
    'stats.farmers': 'Farmers in India',
    'stats.accuracy': 'Test-set accuracy',
    'stats.profit': 'Avg. profit tracked / acre',
    'stats.villages': 'Villages in pilot',

    // ── Features ──────────────────────────────────────────────────
    'features.eyebrow': 'What it does',
    'features.title': 'Everything runs inside WhatsApp',
    'features.subtitle':
      'No download, no login, no data plan burned on an app. Send a message the way you already do.',
    'features.tab.all': 'All',
    'features.tab.live': 'Available now',
    'features.tab.soon': 'Coming soon',
    'features.cost.title': 'Cost tracking',
    'features.cost.body':
      'Type "500 urea" and it lands in the right category, on the right plot, with the right date. Ask for a total any time.',
    'features.disease.title': 'Crop risk from a photo',
    'features.disease.body':
      'Send a picture of a leaf. Get the likely problem, how far along it is, and what to do about it this week.',
    'features.profit.title': 'Profit forecast',
    'features.profit.body':
      'Costs so far plus expected yield plus current mandi rates gives you a margin you can plan around.',
    'features.hindi.title': 'Real Hindi, not translation',
    'features.hindi.body':
      'Ask in Hindi, in Hinglish, or mid-sentence code-switch. Answers come back in the language you used.',
    'features.weather.title': 'Weather alerts',
    'features.weather.body':
      'Rain, heat and frost warnings for your block, pushed before they matter rather than after.',
    'features.yield.title': 'Yield prediction',
    'features.yield.body':
      'Sowing date, variety and weather so far, turned into a harvest estimate you can sell against.',
    'features.badge.soon': 'Coming soon',

    // ── Profit band ───────────────────────────────────────────────
    'profit.eyebrow': 'Why it matters',
    'profit.title': 'Most farms find out too late',
    'profit.body':
      'Costs get remembered, not recorded. By the time the crop is sold, the margin is a guess. Krishni AI keeps a running number so the decision to spend more, or stop, happens while it still changes the outcome.',
    'profit.point.1': 'Every rupee logged the moment it is spent',
    'profit.point.2': 'Break-even yield known before sowing',
    'profit.point.3': 'Margin updated as mandi rates move',

    // ── Chat mock ─────────────────────────────────────────────────
    'chat.header': 'Krishni AI',
    'chat.status': 'online',
    'chat.msg.1': 'गेहूं में पीले पत्ते दिख रहे हैं, क्या करूं?',
    'chat.msg.2': 'यह नाइट्रोजन की कमी लग रही है। तीन काम करें:',
    'chat.msg.3': '250 रुपये यूरिया डाला',
    'chat.msg.4': 'दर्ज कर लिया। इस सीज़न का कुल खर्च ₹12,400 है।',

    // ── How it works ──────────────────────────────────────────────
    'how.eyebrow': 'Three steps',
    'how.title': 'Start in under a minute',
    'how.step1.title': 'Save the number',
    'how.step1.body': 'One contact. No install, no signup form, no password to forget.',
    'how.step2.title': 'Send your first message',
    'how.step2.body': 'Tell it your crop and plot size in whatever language you think in.',
    'how.step3.title': 'Keep messaging as you farm',
    'how.step3.body': 'Log costs, send photos, ask questions. The numbers build themselves.',

    // ── About ─────────────────────────────────────────────────────
    'about.eyebrow': 'About us',
    'about.title': 'Built with farmers, not for them',
    'about.body.1':
      'Krishni AI started from a simple observation: the tooling for Indian agriculture assumes a smartphone app, a data plan, and patience for forms. Most of the farms it targets have none of the three, but all of them have WhatsApp.',
    'about.body.2':
      'So the whole product is a conversation. Ask a question the way you would ask a neighbour, and the answer comes back in the language you asked it in.',
    'about.stat.accuracy': 'Test-set accuracy',
    'about.stat.villages': 'Villages in pilot',
    'about.stat.crops': 'Crops supported',
    'about.disclaimer':
      'Accuracy figure measured on our internal crop-disease test set, not a field trial. Field performance will differ.',
    'about.weather.title': 'This week',
    'about.weather.rain': 'Rain expected',
    'about.weather.temp': 'Max temp',
    'about.weather.advice': 'Hold off on spraying until Thursday.',

    // ── Pricing ───────────────────────────────────────────────────
    'pricing.eyebrow': 'Pricing',
    'pricing.title': 'Start free, pay when it pays for itself',
    'pricing.monthly': 'Monthly',
    'pricing.annual': 'Annual',
    'pricing.save': 'Save 33%',
    'pricing.perMonth': '/month',
    'pricing.recommended': '★ Recommended',
    'pricing.free.name': 'Starter',
    'pricing.free.tagline': 'For trying it on one plot',
    'pricing.free.price': 'Free',
    'pricing.free.f1': 'Cost tracking, one plot',
    'pricing.free.f2': '5 crop photo checks a month',
    'pricing.free.f3': 'Hindi and English',
    'pricing.free.f4': 'Profit summary at harvest',
    'pricing.free.cta': 'Start free',
    'pricing.harvest.name': 'Harvest',
    'pricing.harvest.tagline': 'For a working farm',
    'pricing.harvest.f1': 'Unlimited plots and costs',
    'pricing.harvest.f2': 'Unlimited photo checks',
    'pricing.harvest.f3': 'Live profit forecast',
    'pricing.harvest.f4': 'Weather alerts when they ship',
    'pricing.harvest.f5': 'Mandi price tracking',
    'pricing.harvest.cta': 'Get early access',
    'pricing.coop.name': 'Co-op',
    'pricing.coop.tagline': 'For groups and FPOs',
    'pricing.coop.f1': 'Up to 50 member farms',
    'pricing.coop.f2': 'Group dashboard and exports',
    'pricing.coop.f3': 'Shared advisory broadcasts',
    'pricing.coop.f4': 'Onboarding support in person',
    'pricing.coop.cta': 'Talk to us',
    'pricing.note': 'Prices in INR. Early-access pricing is locked for the first year.',

    // ── Testimonials ──────────────────────────────────────────────
    'testimonials.eyebrow': 'Pilot feedback',
    'testimonials.title': 'What pilot farmers told us',
    'testimonials.disclaimer':
      'Illustrative examples from our pilot programme, shared with permission. Names shortened. Individual results vary.',
    'testimonials.prev': 'Previous testimonials',
    'testimonials.next': 'Next testimonials',

    // ── FAQ ───────────────────────────────────────────────────────
    'faq.eyebrow': 'Questions',
    'faq.title': 'Things farmers ask us first',
    'faq.q1': 'Do I need to install anything?',
    'faq.a1':
      'No. It works inside WhatsApp, which you already have. Save the number and send a message.',
    'faq.q2': 'Is it available right now?',
    'faq.a2':
      'The WhatsApp assistant is in pilot with a limited group of farms. Join the early-access list and we will send you the number as we widen the pilot.',
    'faq.q3': 'Which languages does it understand?',
    'faq.a3':
      'Hindi and English today, including mixed Hinglish sentences. More regional languages are planned once the Hindi experience is solid.',
    'faq.q4': 'How accurate is the crop disease check?',
    'faq.a4':
      'On our internal test set it reaches the accuracy quoted above. That is a lab number, not a field trial, and it is not a substitute for an agronomist on a serious outbreak. Treat it as a fast first opinion.',
    'faq.q5': 'What happens to my farm data?',
    'faq.a5':
      'It stays yours. We use it to answer your questions and improve the assistant. We do not sell it to input companies or traders. You can ask us to delete it at any time.',
    'faq.q6': 'How much data does it use?',
    'faq.a6':
      'Almost none for text. A crop photo costs about the same as sending one to a friend, because that is exactly what it is.',

    // ── Contact + form ────────────────────────────────────────────
    'contact.eyebrow': 'Early access',
    'contact.title': 'Get the number before the pilot widens',
    'contact.body':
      'Leave your details and we will reach out on WhatsApp as we open the next group of farms.',
    'contact.email': 'Email us',
    'contact.phone': 'Call us',
    'contact.whatsapp': 'Message on WhatsApp',
    'form.name': 'Your name',
    'form.name.placeholder': 'e.g. Ramesh Patil',
    'form.phone': 'WhatsApp number',
    'form.phone.placeholder': '10-digit mobile number',
    'form.state': 'State',
    'form.state.placeholder': 'Select your state',
    'form.crop': 'Main crop',
    'form.crop.placeholder': 'Select a crop',
    'form.message': 'Anything else? (optional)',
    'form.message.placeholder': 'Plot size, current problem, questions…',
    'form.consent':
      'I agree to be contacted on WhatsApp about early access, and I have read the privacy policy.',
    'form.submit': 'Request early access',
    'form.submitting': 'Sending…',
    'form.note': 'We reply within 48 hours. No spam, no reselling your number.',
    'form.err.name': 'Please enter your name (at least 2 characters).',
    'form.err.phone': 'Enter a 10-digit Indian mobile number starting 6–9.',
    'form.err.state': 'Please choose your state.',
    'form.err.crop': 'Please choose your main crop.',
    'form.err.consent': 'We need your consent before we can message you.',
    'form.err.network': 'Could not send just now. Please try again, or message us on WhatsApp.',
    'form.success.title': 'You are on the list',
    'form.success.body':
      'We will message you on WhatsApp as the pilot widens. Nothing else to do for now.',

    // ── Footer ────────────────────────────────────────────────────
    'footer.tagline': 'A WhatsApp farm assistant for Indian agriculture.',
    'footer.product': 'Product',
    'footer.company': 'Company',
    'footer.legal.privacy': 'Privacy Policy',
    'footer.legal.terms': 'Terms of Service',
    'footer.rights': 'All rights reserved.',
    'footer.madeIn': 'Made in India',
    'footer.comingSoon': 'Coming soon',

    // ── Chat page ─────────────────────────────────────────────────
    'try.eyebrow': 'Try it here',
    'try.title': 'Ask Krishni AI a farming question',
    'try.body':
      'This is the same assistant that answers on WhatsApp. Ask about a crop, a cost, or a disease — in Hindi or English.',
    'try.placeholder': 'e.g. गेहूं में पीले पत्ते क्यों?',
    'try.send': 'Send',
    'try.sending': 'Thinking…',
    'try.empty': 'Ask a question to start.',
    'try.error': 'Something went wrong. Please try again.',
    'try.rateLimit': 'Too many messages. Please wait a moment and try again.',
    'try.disclaimer':
      'AI answers can be wrong. Check anything costly with your local KVK or an agronomist before acting.',
    'try.clear': 'Clear chat',
    'try.you': 'You',
    'try.assistant': 'Krishni AI',

    // ── Thank-you page ────────────────────────────────────────────
    'thanks.title': 'Thank you',
    'thanks.body':
      "Your interest has been submitted successfully. We'll review your details and get back to you within 48 hours.",
    'thanks.note': 'Our team is excited to help you farm smarter.',
    'thanks.back': 'Back to homepage',
    'thanks.tryCta': 'Ask a question while you wait',
  },

  hi,
}

/**
 * Resolve a key for a language, falling back to English rather than rendering a
 * raw key if a Hindi string is ever missing. Returns the key itself only when
 * both maps lack it, which makes the omission obvious in dev.
 */
export function translate(lang, key) {
  const table = dict[lang] ?? dict[DEFAULT_LANG]
  return table[key] ?? dict[DEFAULT_LANG][key] ?? key
}
