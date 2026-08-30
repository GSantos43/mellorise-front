import { getBffUrl } from './bff'

const BFF_URL = getBffUrl()

const VISITOR_STORAGE_KEY = 'mellorise-visitor-id-v1'

export async function createWelcomeDiscount(email) {
  const response = await fetch(`${BFF_URL}/discounts/welcome`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email,
      visitorId: getVisitorId()
    })
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    const message = Array.isArray(data.message) ? data.message.join(' ') : data.message
    throw new Error(message || 'Could not create welcome discount.')
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
