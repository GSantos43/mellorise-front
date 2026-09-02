import { getBffUrl } from './bff'

const BFF_URL = getBffUrl()

export async function sendContactMessage({ name, email, phone, comment }) {
  const response = await fetch(`${BFF_URL}/contact`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name,
      email,
      phone,
      comment
    })
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    const message = Array.isArray(data.message) ? data.message.join(' ') : data.message
    throw new Error(message || 'Could not send your message right now.')
  }

  return data
}
