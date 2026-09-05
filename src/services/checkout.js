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

  const response = await fetch(`${BFF_URL}/checkout/session`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      cart: [
        {
          productId: Number(item.id),
          variationId: item.variationId ? Number(item.variationId) : undefined,
          quantity: checkoutQuantity
        }
      ],
      successUrl: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${origin}/checkout`,
      customerEmail: options.customerEmail,
      couponCode: options.couponCode,
      promotion,
      checkoutAnalytics: getAnalyticsContext()
    })
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw createCheckoutError(response, data)
  }

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

function createCheckoutError(response, data = {}) {
  const rawMessage = Array.isArray(data.message) ? data.message.join(' ') : data.message
  const message = data.userMessage || rawMessage || `Checkout request failed: ${response.status}`

  return new CheckoutRequestError(message, {
    status: response.status,
    code: data.code || data.errorCode || '',
    userMessage: data.userMessage || rawMessage || message
  })
}
