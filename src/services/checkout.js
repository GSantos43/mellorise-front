import { getBffUrl } from './bff'

const BFF_URL = getBffUrl()

export async function createCheckoutSession(item, options = {}) {
  if (!item?.id) {
    throw new Error('Cart item is required to create checkout.')
  }

  const origin = window.location.origin
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
          quantity: Number(item.quantity || 1)
        }
      ],
      successUrl: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${origin}/checkout`,
      customerEmail: options.customerEmail,
      couponCode: options.couponCode
    })
  })

  if (!response.ok) {
    throw new Error(`Checkout request failed: ${response.status}`)
  }

  const data = await response.json()
  const checkoutUrl = data.checkoutUrl || data.url || data.paymentUrl

  if (!checkoutUrl) {
    throw new Error('Checkout URL was not returned by the BFF.')
  }

  return checkoutUrl
}
