import { getBffUrl } from './bff'

const BFF_URL = getBffUrl()

export async function lookupOrderTracking({ email, identifier }) {
  const response = await fetch(`${BFF_URL}/tracking/lookup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email,
      identifier
    })
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    const message = Array.isArray(data.message) ? data.message.join(' ') : data.message
    throw new Error(message || 'Order was not found for this email.')
  }

  return data
}
