import { getBffUrl } from './bff'

const BFF_URL = getBffUrl()

export async function fetchCheckoutEligibility() {
  const response = await fetch(`${BFF_URL}/geo/checkout-eligibility`)

  if (!response.ok) {
    throw new Error(`Geo eligibility request failed: ${response.status}`)
  }

  return response.json()
}
