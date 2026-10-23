/**
 * Inline SVG icon set.
 *
 * Replaces the emoji the legacy page used for every icon. Emoji are a font, not
 * artwork: 🌾 is a different drawing on Android, Windows and iOS, and the
 * variation-selector glyphs the page used (🗣️ 🌦️ ⚠️) fall back to monochrome
 * text presentation on some Android builds. For an audience overwhelmingly on
 * budget Android handsets, the rendering was unpredictable.
 *
 * These inherit currentColor and the font size of their container, so a single
 * CSS rule controls colour and scale.
 *
 * A server component — no hooks, no state, no client bundle cost.
 */

// 24x24 grid, 1.75 stroke, round caps. Matches the geometric weight of the UI.
const PATHS = {
  // ── Crops / gallery ────────────────────────────────────────────
  wheat: (
    <>
      <path d="M12 21V10" />
      <path d="M12 10c0-2 1.5-3.5 3.5-3.5C15.5 8.5 14 10 12 10Z" />
      <path d="M12 10c0-2-1.5-3.5-3.5-3.5C8.5 8.5 10 10 12 10Z" />
      <path d="M12 15c0-2 1.5-3.5 3.5-3.5C15.5 13.5 14 15 12 15Z" />
      <path d="M12 15c0-2-1.5-3.5-3.5-3.5C8.5 13.5 10 15 12 15Z" />
      <path d="M12 6.5c0-2 1-3.5 0-4.5-1 1-1 2.5 0 4.5Z" />
    </>
  ),
  seedling: (
    <>
      <path d="M12 21v-8" />
      <path d="M12 13C12 9 9 6.5 5 6.5c0 4 3 6.5 7 6.5Z" />
      <path d="M12 13c0-3.5 2.5-6 6-6 0 3.5-2.5 6-6 6Z" />
    </>
  ),
  tomato: (
    <>
      <circle cx="12" cy="14" r="6.5" />
      <path d="M12 7.5V6" />
      <path d="M9 6.2c1 .6 2 .9 3 .9s2-.3 3-.9" />
    </>
  ),
  tractor: (
    <>
      <circle cx="7" cy="16.5" r="3.5" />
      <circle cx="17.5" cy="17.5" r="2.5" />
      <path d="M10.5 16.5h4.5" />
      <path d="M7 13V8h5l2 4.5" />
      <path d="M12 8h4v4.5" />
    </>
  ),
  leaf: (
    <>
      <path d="M4 20c0-8 5-14 16-15 0 10-6 15-13 15H4Z" />
      <path d="M9 20c1.5-5 4-8 8-10" />
    </>
  ),

  // ── Features ───────────────────────────────────────────────────
  ledger: (
    <>
      <path d="M6 3h11a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6Z" />
      <path d="M6 3v18" />
      <path d="M9.5 8h6M9.5 12h6M9.5 16h3.5" />
    </>
  ),
  magnifier: (
    <>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="M15.5 15.5 21 21" />
    </>
  ),
  chart: (
    <>
      <path d="M3 21h18" />
      <path d="M4 17V9.5M9.5 17V4.5M15 17v-9M20.5 17v-5" />
    </>
  ),
  speech: (
    <>
      <path d="M20 14a2 2 0 0 1-2 2H8l-4 4V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2Z" />
      <path d="M8.5 10h7" />
      <path d="M8.5 13h4" />
    </>
  ),
  weather: (
    <>
      <path d="M17 14a3.5 3.5 0 0 0-.5-7 5 5 0 0 0-9.4 1.6A3.2 3.2 0 0 0 7.5 14Z" />
      <path d="M9 18l-1 2.5M13 18l-1 2.5M17 18l-1 2.5" />
    </>
  ),
  scale: (
    <>
      <path d="M12 3v18" />
      <path d="M7 21h10" />
      <path d="M4 8h16" />
      <path d="M4 8l-2 5a3 3 0 0 0 4 0Z" />
      <path d="M20 8l2 5a3 3 0 0 1-4 0Z" />
    </>
  ),

  // ── How it works ───────────────────────────────────────────────
  contactCard: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <circle cx="9" cy="11" r="2" />
      <path d="M6 16c.6-1.5 1.7-2.2 3-2.2s2.4.7 3 2.2" />
      <path d="M15.5 10h3M15.5 13.5h3" />
    </>
  ),
  chat: (
    <>
      <path d="M20.5 12c0 4-3.8 7-8.5 7a10 10 0 0 1-2.6-.3L4 20.5l1.2-3.4A6.6 6.6 0 0 1 3.5 12c0-4 3.8-7 8.5-7s8.5 3 8.5 7Z" />
      <path d="M9 11.5h6" />
      <path d="M9 14h3.5" />
    </>
  ),

  // ── Contact ────────────────────────────────────────────────────
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3.5 7 8.5 6 8.5-6" />
    </>
  ),
  phone: (
    <path d="M7 3.5c1 0 1.6.5 2 1.5l1 2.2c.3.8.1 1.4-.5 1.9l-1 .8c.8 1.9 2.2 3.3 4.1 4.1l.8-1c.5-.6 1.1-.8 1.9-.5l2.2 1c1 .4 1.5 1 1.5 2v1.3c0 1.3-1 2.2-2.4 2.2C10 19 5 14 5 6.2 5 4.6 5.8 3.5 7 3.5Z" />
  ),

  // ── Status / misc ──────────────────────────────────────────────
  alert: (
    <>
      <path d="M12 3.5 21.5 20H2.5Z" />
      <path d="M12 9.5v5" />
      <path d="M12 17.5v.01" />
    </>
  ),
  check: <path d="m4.5 12.5 5 5 10-11" />,
  rupee: (
    <>
      <path d="M7 4h10" />
      <path d="M7 9h10" />
      <path d="M15 4c0 3.5-2.5 5-6 5l7 11" />
    </>
  ),
}

export const ICON_IDS = Object.keys(PATHS)

/**
 * @param {object} props
 * @param {keyof typeof PATHS} props.name
 * @param {string} [props.className]
 * @param {string} [props.title] accessible name; omit for decorative icons,
 *   which are then hidden from assistive tech.
 */
export default function Icon({ name, className = '', title, ...rest }) {
  const path = PATHS[name]

  // Render nothing rather than an empty box if a name is ever wrong. Loud in dev,
  // silent in production — an icon is never load-bearing for meaning here.
  if (!path) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`[Icon] unknown name: ${name}`)
    }
    return null
  }

  return (
    <svg
      className={`icon ${className}`.trim()}
      viewBox="0 0 24 24"
      // Scales with the container's font-size, so existing font-size rules on
      // the emoji spans keep working.
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : 'true'}
      focusable="false"
      {...rest}
    >
      {title && <title>{title}</title>}
      {path}
    </svg>
  )
}
