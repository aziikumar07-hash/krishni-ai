/**
 * Generates the WebP assets that lib/site.js and app/layout.jsx reference.
 *
 * The PNGs in images/ are the masters and stay out of the web root; everything
 * the browser can request lives in public/images/. Run with `npm run images`
 * after replacing a master photo.
 */

import { mkdir, stat } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const ROOT = path.resolve(import.meta.dirname, '..')
const SRC = path.join(ROOT, 'images')
const OUT = path.join(ROOT, 'public', 'images')

// Displayed at 520x390 in the marquee, so 1040 wide covers 2x without shipping
// the 2.6 MB master.
const CROPS = [
  ['wheat-field.png', 'wheat-field.webp'],
  ['cotton-field.png', 'cotton-field.webp'],
  ['crops-tomatoes.png', 'crops-tomatoes.webp'],
  ['hero-farmland.png', 'hero-farmland.webp'],
]

const OG = { file: 'hero-farmland.png', width: 1200, height: 630 }

async function kb(file) {
  const { size } = await stat(path.join(OUT, file))
  return `${Math.round(size / 1024)} KB`
}

await mkdir(OUT, { recursive: true })

for (const [from, to] of CROPS) {
  await sharp(path.join(SRC, from))
    .resize({ width: 1040, withoutEnlargement: true })
    .webp({ quality: 78 })
    .toFile(path.join(OUT, to))
  console.log(`${to.padEnd(24)} ${await kb(to)}`)
}

// Open Graph wants a fixed 1200x630 box; cover crops rather than letterboxing.
await sharp(path.join(SRC, OG.file))
  .resize({ width: OG.width, height: OG.height, fit: 'cover', position: 'centre' })
  .webp({ quality: 80 })
  .toFile(path.join(OUT, 'og-cover.webp'))
console.log(`${'og-cover.webp'.padEnd(24)} ${await kb('og-cover.webp')}`)
