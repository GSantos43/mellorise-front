import { getBffUrl } from './bff'

const BFF_URL = getBffUrl()
const ANALYTICS_AUTH_KEY = 'mellorise-analytics-dashboard-auth-v1'

export function readAnalyticsAuth() {
  try {
    const savedAuth = JSON.parse(window.sessionStorage.getItem(ANALYTICS_AUTH_KEY) || 'null')
    return savedAuth?.username && savedAuth?.password ? savedAuth : null
  } catch {
    return null
  }
}

export function saveAnalyticsAuth(credentials) {
  window.sessionStorage.setItem(ANALYTICS_AUTH_KEY, JSON.stringify({
    username: credentials.username,
    password: credentials.password
  }))
}

export function clearAnalyticsAuth() {
  window.sessionStorage.removeItem(ANALYTICS_AUTH_KEY)
}

export async function fetchAnalyticsSummary(credentials, filters = {}) {
  const url = new URL(`${BFF_URL}/analytics/summary`)

  if (filters.from) url.searchParams.set('from', filters.from)
  if (filters.to) url.searchParams.set('to', filters.to)

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Basic ${window.btoa(`${credentials.username}:${credentials.password}`)}`
    }
  })

  if (response.status === 401) {
    throw createAnalyticsError('invalid_credentials', 'Invalid analytics credentials.')
  }

  if (!response.ok) {
    throw createAnalyticsError('analytics_unavailable', 'Analytics summary is unavailable.')
  }

  return response.json()
}

function createAnalyticsError(code, message) {
  const error = new Error(message)
  error.code = code
  return error
}
