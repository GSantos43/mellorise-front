import { getBffUrl } from './bff'

const BFF_URL = getBffUrl()

export async function createCheckoutSession(item, options = {}) {
  if (!item?.id) {
    throw new Error('Cart item is required to create checkout.')
  }

  const origin = window.location.origin
  const quantity = Number(item.quantity || 1)
  const freeQuantity = quantity >= 3 ? 2 : quantity === 2 ? 1 : 0
  const promotion = freeQuantity
    ? {
        code: quantity >= 3 ? 'BUY_3_GET_2' : 'BUY_2_GET_1',
        label: quantity >= 3 ? 'Buy 3 Get 2' : 'Buy 2 Get 1',
        paidQuantity: quantity,
        freeQuantity,
        deliveredQuantity: quantity + freeQuantity
      }
    : undefined

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
          quantity
        }
      ],
      successUrl: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${origin}/checkout`,
      customerEmail: options.customerEmail,
      couponCode: options.couponCode,
      promotion
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
