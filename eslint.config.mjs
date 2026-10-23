// eslint-config-next 16 ships a flat config already, so it is imported directly.
// Do not wrap it in FlatCompat — that double-normalises the shared plugin objects
// and dies with "Converting circular structure to JSON".
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'

const config = [
  {
    // legacy/ is the untouched snapshot of the original static site, kept only as a
    // porting reference. It is gitignored and must never be linted or built.
    // server.js and backend/ are the superseded pre-Next stubs.
    ignores: ['legacy/**', '.next/**', 'node_modules/**', 'server.js', 'backend/**'],
  },
  ...nextCoreWebVitals,
]

export default config
