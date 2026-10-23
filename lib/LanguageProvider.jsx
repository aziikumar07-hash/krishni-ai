'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useSyncExternalStore } from 'react'
import { DEFAULT_LANG, LANGS, LANG_STORAGE_KEY, translate } from './i18n.js'

const LanguageContext = createContext(null)

/* ---------------------------------------------------------------------------
 * The chosen language lives in localStorage, which is an external system, so it
 * is read through useSyncExternalStore instead of "useState(default) + read it
 * back in an effect". That gets the server snapshot (always the default, so the
 * SSR HTML and the first client paint agree) and the client snapshot from one
 * primitive, with no setState inside an effect body.
 * ------------------------------------------------------------------------- */

const listeners = new Set()

// getSnapshot must return a referentially stable value or React re-renders
// forever, so the parsed value is cached and only recomputed on a real write.
let cached = null

function readStorage() {
  try {
    const stored = window.localStorage.getItem(LANG_STORAGE_KEY)
    return stored && LANGS.includes(stored) ? stored : DEFAULT_LANG
  } catch {
    // Private browsing or blocked storage — fall through to the default.
    return DEFAULT_LANG
  }
}

function getSnapshot() {
  if (cached === null) cached = readStorage()
  return cached
}

function getServerSnapshot() {
  return DEFAULT_LANG
}

function emit() {
  for (const listener of listeners) listener()
}

// A language switch in another tab should follow here as well. The handler is
// attached once for the whole set, not once per subscriber, so N mounted
// consumers cause N notifications rather than N².
function onStorage(event) {
  if (event.key !== null && event.key !== LANG_STORAGE_KEY) return
  cached = readStorage()
  emit()
}

function subscribe(listener) {
  if (listeners.size === 0) window.addEventListener('storage', onStorage)
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
    if (listeners.size === 0) window.removeEventListener('storage', onStorage)
  }
}

function writeLang(next) {
  if (!LANGS.includes(next) || next === getSnapshot()) return
  cached = next
  try {
    window.localStorage.setItem(LANG_STORAGE_KEY, next)
  } catch {
    // Persistence is a nicety; the toggle still works for this session.
  }
  emit()
}

export function LanguageProvider({ children }) {
  const lang = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  // Keep <html lang> honest for screen readers and for the browser's own
  // hyphenation and translation heuristics. This is an effect pushing state
  // out to the DOM, which is what effects are for.
  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const setLang = useCallback((next) => writeLang(next), [])

  const value = useMemo(
    () => ({
      lang,
      setLang,
      // Synchronous lookup. No await, no fetch, no loading state.
      t: (key) => translate(lang, key),
    }),
    [lang, setLang],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLang() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLang must be used inside <LanguageProvider>')
  return ctx
}
