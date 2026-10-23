'use client'

import { useEffect, useRef, useState } from 'react'
import { useLang } from '../lib/LanguageProvider.jsx'
import { stats } from '../lib/site.js'

const DURATION_MS = 1400

/** Cubic ease-out, matching the legacy counter's feel. */
const easeOut = (p) => 1 - (1 - p) ** 3

export default function StatsBand() {
  const { t } = useLang()
  const ref = useRef(null)
  const [run, setRun] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    // Counter() already renders the target value whenever run is false, so this
    // branch only decides whether the tween plays. Scheduled on a frame rather
    // than called inline: a synchronous setState in an effect body cascades.
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduce || typeof IntersectionObserver === 'undefined') {
      if (reduce) return // leave run false — the final number is already on screen
      const frame = requestAnimationFrame(() => setRun(true))
      return () => cancelAnimationFrame(frame)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setRun(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="stats-band" aria-label="Key statistics" ref={ref}>
      <div className="container">
        <div className="stats-grid">
          {stats.map((stat) => (
            <div className="stat-item" key={stat.id}>
              <p className="stat-value">
                {stat.prefix}
                <Counter target={stat.target} run={run} />
                <span className="stat-suffix">{stat.suffix}</span>
              </p>
              <p className="stat-label">{t(stat.labelKey)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Counter({ target, run }) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!run) return

    let frame = 0
    const start = performance.now()

    const tick = (now) => {
      const progress = Math.min(1, (now - start) / DURATION_MS)
      setValue(Math.round(target * easeOut(progress)))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [run, target])

  // Render the final value immediately when not animating so the number is
  // never stuck at 0 for users who never trigger the observer.
  return <>{run ? value : target}</>
}
