import { getBffUrl } from './bff'
import { getAnalyticsContext } from './analytics'

const BFF_URL = getBffUrl()
const PRIMARY_PRODUCT_HANDLE = 'mellorise-heightener-gummies-2026'
const LEGACY_PRODUCT_HANDLES = new Set([
  'wondernest-heightener-gummies-2026',
  '9-in-1-natural-growth-bone-support-gummies-for-kids-teens'
])

export class CheckoutRequestError extends Error {
  constructor(message, options = {}) {
    super(message)
    this.name = 'CheckoutRequestError'
    this.status = options.status || 0
    this.code = options.code || ''
    this.userMessage = options.userMessage || message
  }
}

export async function createCheckoutSession(item, options = {}) {
  const productId = getCheckoutProductId(item)

  if (!productId) {
    throw new Error('Cart item is required to create checkout.')
  }

  const origin = window.location.origin
  const checkoutSource = options.checkoutSource || options.source || 'direct_checkout'
  const checkoutPagePath = options.checkoutPagePath || '/checkout'
  const checkoutPageLocation = options.checkoutPageLocation || `${origin}${checkoutPagePath}`
  const quantity = Math.min(3, Math.max(1, Number(item.quantity || 1)))
  const checkoutQuantity = Math.min(3, Math.max(1, Number(item.checkoutQuantity || quantity)))
  const freeQuantity = quantity === 3 ? 2 : quantity === 2 ? 1 : 0
  const promotion = item.promotion || (
    freeQuantity
      ? {
        code: quantity === 3 ? 'BUY_3_GET_2' : 'BUY_2_GET_1',
        label: quantity === 3 ? 'Buy 3 Get 5' : 'Buy 2 Get 3',
        paidQuantity: quantity,
        freeQuantity,
        deliveredQuantity: quantity + freeQuantity
      }
      : undefined
  )

  const payload = buildCheckoutPayload({
    item,
    options,
    origin,
    checkoutPagePath,
    checkoutPageLocation,
    checkoutSource,
    checkoutQuantity,
    promotion
  })

  const response = await postCheckoutSession(payload)
  let data = await response.json().catch(() => ({}))

  if (!response.ok && shouldRetryWithoutNewestFields(response, data, payload)) {
    const retryResponse = await postCheckoutSession(toCompatibleCheckoutPayload(payload, data))
    data = await retryResponse.json().catch(() => ({}))

    if (!retryResponse.ok) {
      throw createCheckoutError(retryResponse, data)
    }

    return normalizeCheckoutResponse(data)
  }

  if (!response.ok) {
    throw createCheckoutError(response, data)
  }

  return normalizeCheckoutResponse(data)
}

function buildCheckoutPayload({
  item,
  options,
  origin,
  checkoutPagePath,
  checkoutPageLocation,
  checkoutSource,
  checkoutQuantity,
  promotion
}) {
  const productId = getCheckoutProductId(item)
  const checkoutAnalytics = compactObject(getAnalyticsContext({
    pagePath: checkoutPagePath,
    pageLocation: checkoutPageLocation
  }))

  return compactObject({
    cart: [
      compactObject({
        productId,
        variationId: item.variationId ? Number(item.variationId) : undefined,
        quantity: checkoutQuantity
      })
    ],
    successUrl: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancelUrl: `${origin}/products/${getCheckoutCancelHandle(item)}`,
    customerEmail: options.customerEmail,
    couponCode: options.couponCode,
    shippingProtection: options.shippingProtection,
    offerCode: options.offerCode,
    promotion,
    checkoutAnalytics
  })
}

function getCheckoutProductId(item) {
  const productId = Number(item?.id ?? item?.productId ?? item?.product?.id ?? 0)

  return Number.isFinite(productId) && productId > 0 ? productId : 0
}

function postCheckoutSession(payload) {
  return fetch(`${BFF_URL}/checkout/session`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })
}

function getCheckoutCancelHandle(item) {
  const handle = String(item?.handle || '').trim()

  if (!handle || LEGACY_PRODUCT_HANDLES.has(handle)) {
    return PRIMARY_PRODUCT_HANDLE
  }

  return handle
}

function normalizeCheckoutResponse(data = {}) {
  const checkoutUrl = data.checkoutUrl || data.url || data.paymentUrl

  if (!checkoutUrl) {
    throw new Error('Checkout URL was not returned by the BFF.')
  }

  return {
    ...data,
    checkoutUrl,
    url: checkoutUrl
  }
}

function shouldRetryWithoutNewestFields(response, data = {}, payload = {}) {
  if (response.status !== 400) return false

  const rejectedProperties = getRejectedPayloadProperties(data)

  if (payload.promotion && rejectedProperties.has('promotion')) {
    return false
  }

  return ['source', 'offerCode', 'promotion'].some((property) => rejectedProperties.has(property))
}

function toCompatibleCheckoutPayload(payload, data = {}) {
  const rejectedProperties = getRejectedPayloadProperties(data)
  const nextPayload = {
    ...payload,
    checkoutAnalytics: payload.checkoutAnalytics
      ? { ...payload.checkoutAnalytics }
      : undefined
  }

  if (rejectedProperties.has('offerCode')) {
    delete nextPayload.offerCode
  }

  if (!payload.promotion && rejectedProperties.has('promotion')) {
    delete nextPayload.promotion
  }

  if (nextPayload.checkoutAnalytics) {
    delete nextPayload.checkoutAnalytics.source
  }

  return compactObject(nextPayload)
}

function getRejectedPayloadProperties(data = {}) {
  const message = Array.isArray(data.message) ? data.message.join(' ') : String(data.message || '')
  const properties = new Set()
  const pattern = /property ([a-zA-Z0-9_]+) should not exist/gi
  let match = pattern.exec(message)

  while (match) {
    properties.add(match[1])
    match = pattern.exec(message)
  }

  return properties
}

function compactObject(value) {
  return Object.fromEntries(
    Object.entries(value).filter(([, entryValue]) => (
      entryValue !== undefined &&
      entryValue !== null &&
      entryValue !== ''
    ))
  )
}

function createCheckoutError(response, data = {}) {
  const rawMessage = Array.isArray(data.message) ? data.message.join(' ') : data.message
  const compatibilityMessage = /property promotion should not exist/i.test(String(rawMessage || ''))
    ? 'Secure checkout is being updated. Please try again in a minute.'
    : ''
  const message = data.userMessage || compatibilityMessage || rawMessage || `Checkout request failed: ${response.status}`

  return new CheckoutRequestError(message, {
    status: response.status,
    code: data.code || data.errorCode || '',
    userMessage: data.userMessage || compatibilityMessage || rawMessage || message
  })
}
