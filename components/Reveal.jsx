'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Scroll-reveal wrapper. One IntersectionObserver per element, unobserved after
 * it fires — same approach the legacy page used, just scoped to a component.
 *
 * Falls back to visible when IntersectionObserver is missing or reduced motion is
 * requested, so content is never trapped at opacity:0.
 */
export default function Reveal({ children, delay = 0, as: Tag = 'div', className = '', ...rest }) {
  const ref = useRef(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    // Reduced motion is already handled in CSS (.reveal is forced visible), so
    // this branch exists for the no-IntersectionObserver case — without it the
    // content would stay stuck at opacity:0. Scheduled on a frame rather than
    // called inline: a synchronous setState in an effect body cascades renders.
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduce || typeof IntersectionObserver === 'undefined') {
      const frame = requestAnimationFrame(() => setShown(true))
      return () => cancelAnimationFrame(frame)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true)
            observer.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const delayClass = delay > 0 ? ` reveal-delay-${delay}` : ''

  return (
    <Tag
      ref={ref}
      className={`reveal${shown ? ' visible' : ''}${delayClass}${className ? ` ${className}` : ''}`}
      {...rest}
    >
      {children}
    </Tag>
  )
}
