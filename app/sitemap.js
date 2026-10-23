import { site } from '../lib/site.js'

/**
 * Static sitemap. Only the pages that exist as routes, with the confirmation
 * page left out — it is disallowed in robots.js.
 *
 * The legacy site had no sitemap at all, so this is the first crawlable index of
 * the site. Paths are absolute because site.url is the canonical host.
 */
const ROUTES = [
  { path: '/', changeFrequency: 'monthly', priority: 1 },
  { path: '/try', changeFrequency: 'monthly', priority: 0.9 },
  { path: '/privacy', changeFrequency: 'yearly', priority: 0.3 },
  { path: '/terms', changeFrequency: 'yearly', priority: 0.3 },
]

export default function sitemap() {
  // One timestamp for the whole build rather than five slightly different ones.
  const lastModified = new Date()

  return ROUTES.map(({ path, changeFrequency, priority }) => ({
    url: `${site.url}${path === '/' ? '' : path}`,
    lastModified,
    changeFrequency,
    priority,
  }))
}
