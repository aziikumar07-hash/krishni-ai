/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // The legacy single-file site lives in legacy/ purely as a porting reference.
  // Nothing imports it; keep it out of the build graph.
  outputFileTracingExcludes: {
    '*': ['./legacy/**'],
  },

  images: {
    // Local WebP only — no remote patterns, so no third-party image hosts.
    formats: ['image/webp'],
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'DENY' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ]
  },

  async redirects() {
    return [
      // The legacy site shipped these as flat .html files; keep old links alive.
      { source: '/index.html', destination: '/', permanent: true },
      { source: '/privacy-policy.html', destination: '/privacy', permanent: true },
      { source: '/terms-of-service.html', destination: '/terms', permanent: true },
      { source: '/thank-you.html', destination: '/thank-you', permanent: true },
    ]
  },
}

export default nextConfig
