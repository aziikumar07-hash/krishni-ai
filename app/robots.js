import { site } from '../lib/site.js'

/**
 * robots.txt as a route, not a static file.
 *
 * The legacy host answered /robots.txt with the homepage HTML, so crawlers got
 * a 200 and then failed to parse a directive out of it. Serving it from the app
 * guarantees the content type is text/plain and the sitemap URL is absolute.
 */
export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Thank-you is a post-submission confirmation, not a landing page.
        disallow: ['/thank-you'],
      },
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  }
}
