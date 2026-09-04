import { getBffUrl } from './bff'

const BFF_URL = getBffUrl()

const VISITOR_STORAGE_KEY = 'mellorise-visitor-id-v1'

export class DiscountRequestError extends Error {
  constructor(message, options = {}) {
    super(message)
    this.name = 'DiscountRequestError'
    this.status = options.status || 0
    this.code = options.code || ''
    this.userMessage = options.userMessage || message
  }
}

export async function createWelcomeDiscount(options = {}) {
  const response = await fetch(`${BFF_URL}/discounts/welcome`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {})
    },
    body: JSON.stringify({
      customerEmail: options.email,
      visitorId: getVisitorId()
    })
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    const message = Array.isArray(data.message) ? data.message.join(' ') : data.message
    throw new DiscountRequestError(message || 'Could not create welcome discount.', {
      status: response.status,
      code: data.code || data.errorCode || '',
      userMessage: data.userMessage || message
    })
  }

  return data
}

export async function validateWelcomeDiscount({ code, email }) {
  const response = await fetch(`${BFF_URL}/discounts/validate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      couponCode: code,
      customerEmail: email
    })
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    const message = Array.isArray(data.message) ? data.message.join(' ') : data.message
    throw new DiscountRequestError(message || 'Coupon is invalid or expired.', {
      status: response.status,
      code: data.code || data.errorCode || '',
      userMessage: data.userMessage || message
    })
  }

  return data
}

function getVisitorId() {
  if (typeof window === 'undefined') return ''

  const existingVisitorId = window.localStorage.getItem(VISITOR_STORAGE_KEY)

  if (existingVisitorId) return existingVisitorId

  const visitorId = window.crypto?.randomUUID?.() || `visitor-${Date.now()}-${Math.random().toString(16).slice(2)}`
  window.localStorage.setItem(VISITOR_STORAGE_KEY, visitorId)

  return visitorId
}
