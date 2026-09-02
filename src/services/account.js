import { getBffUrl } from './bff'

const BFF_URL = getBffUrl()

export async function fetchAccountOrders(token) {
  if (!token) {
    throw new Error('Sign in is required.')
  }

  const response = await fetch(`${BFF_URL}/account/orders`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    const message = await readErrorMessage(response)
    throw new Error(message || 'Could not load your orders.')
  }

  return response.json()
}

export async function fetchAccountOrder(token, orderId) {
  if (!token) {
    throw new Error('Sign in is required.')
  }

  if (!orderId) {
    throw new Error('Order is required.')
  }

  const response = await fetch(`${BFF_URL}/account/orders/${encodeURIComponent(orderId)}`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    const message = await readErrorMessage(response)
    throw new Error(message || 'Could not load your order.')
  }

  return response.json()
}

async function readErrorMessage(response) {
  try {
    const data = await response.json()
    return data?.message || data?.error || ''
  } catch {
    return ''
  }
}
