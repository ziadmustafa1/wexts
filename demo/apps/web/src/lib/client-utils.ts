import 'client-only'

/**
 * Client-only utilities
 * This code will throw error if imported in server components
 */

// Extend Window interface for gtag
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

export function trackEvent(name: string, properties?: Record<string, unknown>) {
  if (typeof window !== 'undefined' && window.gtag) {
    // Analytics tracking
    window.gtag('event', name, properties)
  }
}

export function getLocalStorage(key: string) {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(key)
  }
  return null
}

export function playSound(src: string) {
  if (typeof window !== 'undefined') {
    const audio = new Audio(src)
    audio.play()
  }
}
