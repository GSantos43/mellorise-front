import { getBffUrl } from './bff'

const BFF_URL = getBffUrl()
const CLIENT_ID_KEY = 'mellorise-analytics-client-id-v1'
const SESSION_ID_KEY = 'mellorise-analytics-session-id-v1'
const SESSION_STARTED_AT_KEY = 'mellorise-analytics-session-started-at-v1'
const SESSION_TTL_MS = 30 * 60 * 1000
const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || ''
const GTM_ID = import.meta.env.VITE_GTM_ID || ''

let scriptsLoaded = false

export function initAnalytics() {
  if (typeof window === 'undefined' || scriptsLoaded) return

  const clientId = getClientId()
  const sessionId = getSessionId()
  window.dataLayer = window.dataLayer || []

  if (GTM_ID) {
    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(GTM_ID)}`
    document.head.appendChild(script)
    window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' })
  }

  if (GA_MEASUREMENT_ID) {
    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_MEASUREMENT_ID)}`
    document.head.appendChild(script)
    window.gtag = function gtag() {
      window.dataLayer.push(arguments)
    }
    window.gtag('js', new Date())
    window.gtag('config', GA_MEASUREMENT_ID, {
      send_page_view: false,
      client_id: clientId,
      session_id: sessionId
    })
  }

  scriptsLoaded = true
}

export function trackPageView(path, title = document.title) {
  trackEvent('page_view', {
    page_path: path,
    page_title: title,
    page_location: window.location.href
  }, { sendToBackend: true })
}

export function trackProductView(product) {
  if (!product?.id) return

  trackEvent('view_item', {
    currency: 'USD',
    value: Number(product.price || 0),
    items: [toAnalyticsItem(product, { quantity: 1 })]
  }, { sendToBackend: true })
}

export function trackAddToCart(item) {
  if (!item?.id) return

  trackEvent('add_to_cart', {
    currency: 'USD',
    value: Number(item.price || 0) * Number(item.quantity || 1),
    items: [toAnalyticsItem(item)]
  }, { sendToBackend: true })
}

export function trackViewCart(item) {
  if (!item?.id) return

  trackEvent('view_cart', {
    currency: 'USD',
    value: Number(item.price || 0) * Number(item.quantity || 1),
    items: [toAnalyticsItem(item)]
  }, { sendToBackend: true })
}

export function trackBeginCheckout(item, options = {}) {
  if (!item?.id) return

  trackEvent('begin_checkout', {
    currency: 'USD',
    value: Number(item.price || 0) * Number(item.quantity || 1),
    coupon: options.couponCode || '',
    items: [toAnalyticsItem(item)]
  }, { sendToBackend: true })
}

export function trackCheckoutRedirect(item, response = {}) {
  trackEvent('checkout_redirect', {
    provider: response.provider || 'stripe',
    session_id: response.sessionId || '',
    order_id: response.orderId || '',
    value: Number(response.total || 0),
    currency: response.currency || 'USD',
    items: item?.id ? [toAnalyticsItem(item)] : []
  }, { sendToBackend: true })
}

export function trackCheckoutError(error, item) {
  trackEvent('checkout_error', {
    code: error?.code || '',
    status: error?.status || 0,
    message: error?.userMessage || error?.message || 'Checkout failed',
    items: item?.id ? [toAnalyticsItem(item)] : []
  }, { sendToBackend: true })
}

export function trackCheckoutAbandoned(item, reason = 'left_checkout') {
  if (!item?.id) return

  trackEvent('checkout_abandoned', {
    reason,
    currency: 'USD',
    value: Number(item.price || 0) * Number(item.quantity || 1),
    items: [toAnalyticsItem(item)]
  }, { sendToBackend: true, beacon: true })
}

export function trackPurchase(params = {}) {
  trackEvent('purchase', {
    transaction_id: params.sessionId || params.orderId || '',
    provider: params.provider || '',
    currency: 'USD',
    value: Number(params.value || 0)
  }, { sendToBackend: true })
}

export function trackEvent(name, params = {}, options = {}) {
  if (typeof window === 'undefined' || !name) return

  initAnalytics()

  const eventParams = {
    ...params,
    client_id: getClientId(),
    session_id: getSessionId()
  }

  if (typeof window.gtag === 'function') {
    window.gtag('event', name, eventParams)
  }

  if (window.dataLayer) {
    window.dataLayer.push({
      event: name,
      ecommerce: params.items ? { ...params } : undefined,
      ...eventParams
    })
  }

  if (options.sendToBackend) {
    sendBackendEvent(name, eventParams, Boolean(options.beacon))
  }
}

function sendBackendEvent(name, params, beacon = false) {
  const payload = JSON.stringify({
    name,
    clientId: params.client_id,
    sessionId: params.session_id,
    pagePath: window.location.pathname,
    pageLocation: window.location.href,
    referrer: document.referrer,
    params
  })

  if (beacon && navigator.sendBeacon) {
    navigator.sendBeacon(`${BFF_URL}/analytics/events`, new Blob([payload], { type: 'application/json' }))
    return
  }

  fetch(`${BFF_URL}/analytics/events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: payload,
    keepalive: beacon
  }).catch(() => {})
}

function toAnalyticsItem(item, overrides = {}) {
  return {
    item_id: String(item.id),
    item_name: item.title || 'MelloRise Heightener Gummies',
    item_variant: item.bundleLabel || '',
    price: Number(item.unitPrice || item.price || 0),
    quantity: Number(item.quantity || 1),
    promotion_name: item.promotion?.label || item.promotion?.code || '',
    ...overrides
  }
}

function getClientId() {
  return getOrCreateStorageValue(CLIENT_ID_KEY, 'client')
}

function getSessionId() {
  const now = Date.now()
  const startedAt = Number(window.sessionStorage.getItem(SESSION_STARTED_AT_KEY) || 0)
  const existing = window.sessionStorage.getItem(SESSION_ID_KEY)

  if (existing && startedAt && now - startedAt < SESSION_TTL_MS) {
    window.sessionStorage.setItem(SESSION_STARTED_AT_KEY, String(now))
    return existing
  }

  const sessionId = createId('session')
  window.sessionStorage.setItem(SESSION_ID_KEY, sessionId)
  window.sessionStorage.setItem(SESSION_STARTED_AT_KEY, String(now))
  return sessionId
}

function getOrCreateStorageValue(key, prefix) {
  const existing = window.localStorage.getItem(key)
  if (existing) return existing

  const value = createId(prefix)
  window.localStorage.setItem(key, value)
  return value
}

function createId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`
}
