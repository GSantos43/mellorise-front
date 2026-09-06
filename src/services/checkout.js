import { getBffUrl } from './bff'
import { getAnalyticsContext } from './analytics'

const BFF_URL = getBffUrl()

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
  if (!item?.id) {
    throw new Error('Cart item is required to create checkout.')
  }

  const origin = window.location.origin
  const checkoutSource = options.checkoutSource || options.source || 'direct_checkout'
  const checkoutPagePath = options.checkoutPagePath || '/checkout'
  const checkoutPageLocation = options.checkoutPageLocation || `${origin}${checkoutPagePath}`
  const quantity = Number(item.quantity || 1)
  const checkoutQuantity = Number(item.checkoutQuantity || quantity)
  const freeQuantity = quantity >= 3 ? 2 : quantity === 2 ? 1 : 0
  const promotion = item.promotion || (
    freeQuantity
      ? {
        code: quantity >= 3 ? 'BUY_3_GET_2' : 'BUY_2_GET_1',
        label: quantity >= 3 ? 'Buy 3 Get 5' : 'Buy 2 Get 3',
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

  if (!response.ok && shouldRetryWithoutNewestFields(response, data)) {
    const retryResponse = await postCheckoutSession(toLegacyCheckoutPayload(payload))
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
  const checkoutAnalytics = compactObject(getAnalyticsContext({
    pagePath: checkoutPagePath,
    pageLocation: checkoutPageLocation
  }))

  return compactObject({
    cart: [
      compactObject({
        productId: Number(item.id),
        variationId: item.variationId ? Number(item.variationId) : undefined,
        quantity: checkoutQuantity
      })
    ],
    successUrl: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancelUrl: `${origin}/products/${item.handle || 'mellorise-heightener-gummies-2026'}`,
    customerEmail: options.customerEmail,
    couponCode: options.couponCode,
    shippingProtection: options.shippingProtection,
    offerCode: options.offerCode,
    promotion,
    checkoutAnalytics
  })
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

function shouldRetryWithoutNewestFields(response, data = {}) {
  if (response.status !== 400) return false

  const message = Array.isArray(data.message) ? data.message.join(' ') : String(data.message || '')
  return /property (source|offerCode|promotion) should not exist/i.test(message)
}

function toLegacyCheckoutPayload(payload) {
  const nextPayload = {
    ...payload,
    checkoutAnalytics: payload.checkoutAnalytics
      ? { ...payload.checkoutAnalytics }
      : undefined
  }

  delete nextPayload.offerCode
  delete nextPayload.promotion
  if (nextPayload.checkoutAnalytics) {
    delete nextPayload.checkoutAnalytics.source
  }

  return compactObject(nextPayload)
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
  const message = data.userMessage || rawMessage || `Checkout request failed: ${response.status}`

  return new CheckoutRequestError(message, {
    status: response.status,
    code: data.code || data.errorCode || '',
    userMessage: data.userMessage || rawMessage || message
  })
}
