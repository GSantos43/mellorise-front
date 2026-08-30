import { createI18n } from 'vue-i18n'
import { messages } from './messages'

export const supportedLocales = ['es', 'en']
const defaultLocale = 'en'

function normalizeLocale(locale) {
  const baseLocale = String(locale || '').split('-')[0].toLowerCase()
  return supportedLocales.includes(baseLocale) ? baseLocale : defaultLocale
}

function getInitialLocale() {
  if (typeof window === 'undefined') return defaultLocale

  const savedLocale = window.localStorage.getItem('mellorise-locale')
  if (savedLocale) return normalizeLocale(savedLocale)

  return defaultLocale
}

export const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: getInitialLocale(),
  fallbackLocale: defaultLocale,
  messages
})

export function setLocale(locale) {
  const normalizedLocale = normalizeLocale(locale)
  i18n.global.locale.value = normalizedLocale

  if (typeof window !== 'undefined') {
    window.localStorage.setItem('mellorise-locale', normalizedLocale)
  }

  if (typeof document !== 'undefined') {
    document.documentElement.lang = normalizedLocale
  }
}

setLocale(i18n.global.locale.value)
