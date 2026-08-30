const PRODUCTION_BFF_URL = 'https://mello-api-rise.duckdns.org'

export function getBffUrl() {
  return (
    import.meta.env.VITE_BFF_URL ||
    import.meta.env.VITE_API_URL ||
    (import.meta.env.PROD ? PRODUCTION_BFF_URL : 'http://localhost:3000')
  ).replace(/\/$/, '')
}
