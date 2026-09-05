<script setup>
import { computed, onMounted, ref } from 'vue'
import {
  clearAnalyticsAuth,
  fetchAnalyticsSummary,
  readAnalyticsAuth,
  saveAnalyticsAuth
} from '../services/analyticsDashboard'

const username = ref('')
const password = ref('')
const summary = ref(null)
const errorMessage = ref('')
const isLoading = ref(false)
const isAuthed = ref(false)
const latestSeenEventKey = ref('')
const hasNewEvents = ref(false)
const newEventsCount = ref(0)
const datePreset = ref('all')
const specificDate = ref(toDateInputValue(new Date()))
const rangeFromDate = ref(toDateInputValue(getDateDaysAgo(6)))
const rangeToDate = ref(toDateInputValue(new Date()))

const datePresetOptions = [
  { value: 'all', label: 'All' },
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This week' },
  { value: 'last7', label: 'Last 7 days' },
  { value: 'day', label: 'Specific day' },
  { value: 'range', label: 'Range' }
]

const totalCards = computed(() => summary.value?.totals || [])
const funnel = computed(() => summary.value?.funnel || [])
const recentEvents = computed(() => summary.value?.recentEvents || [])
const topPages = computed(() => summary.value?.topPages || [])
const topProducts = computed(() => summary.value?.topProducts || [])
const checkoutErrors = computed(() => summary.value?.checkoutErrors || [])
const topCities = computed(() => summary.value?.topCities || [])
const storageLabel = computed(() => {
  if (!summary.value?.storage?.enabled) return 'Storage file is not configured'
  return summary.value.storage.filePath
})
const activeDateLabel = computed(() => {
  if (datePreset.value === 'all') return 'All saved events'
  if (datePreset.value === 'today') return 'Today'
  if (datePreset.value === 'week') return 'This week'
  if (datePreset.value === 'last7') return 'Last 7 days'
  if (datePreset.value === 'day') return formatShortDate(specificDate.value)
  if (datePreset.value === 'range') return `${formatShortDate(rangeFromDate.value)} - ${formatShortDate(rangeToDate.value)}`
  return 'Filtered'
})

onMounted(() => {
  const savedAuth = readAnalyticsAuth()
  if (!savedAuth) return

  username.value = savedAuth.username
  password.value = savedAuth.password
  loadSummary(savedAuth)
})

async function login() {
  if (!username.value.trim() || !password.value) {
    errorMessage.value = 'Enter the dashboard user and password.'
    return
  }

  await loadSummary({
    username: username.value.trim(),
    password: password.value
  })
}

async function loadSummary(
  credentials = { username: username.value, password: password.value },
  options = {}
) {
  isLoading.value = true
  errorMessage.value = ''

  try {
    const nextSummary = await fetchAnalyticsSummary(credentials, getDateFilterPayload())
    updateNewEventsState(nextSummary, Boolean(options.detectNewEvents))
    summary.value = nextSummary
    saveAnalyticsAuth(credentials)
    isAuthed.value = true
  } catch (error) {
    summary.value = null
    isAuthed.value = false
    clearAnalyticsAuth()
    errorMessage.value = error?.code === 'invalid_credentials'
      ? 'User or password is incorrect.'
      : 'Could not load analytics right now.'
  } finally {
    isLoading.value = false
  }
}

function refreshSummary() {
  return loadSummary(undefined, { detectNewEvents: true })
}

function applyDatePreset(nextPreset) {
  datePreset.value = nextPreset
  hasNewEvents.value = false
  newEventsCount.value = 0
  latestSeenEventKey.value = ''

  if (nextPreset !== 'day' && nextPreset !== 'range' && isAuthed.value) {
    void loadSummary()
  }
}

function applyCustomDateFilter() {
  hasNewEvents.value = false
  newEventsCount.value = 0
  latestSeenEventKey.value = ''
  return loadSummary()
}

function logout() {
  clearAnalyticsAuth()
  summary.value = null
  password.value = ''
  isAuthed.value = false
  latestSeenEventKey.value = ''
  hasNewEvents.value = false
  newEventsCount.value = 0
}

function updateNewEventsState(nextSummary, detectNewEvents) {
  const nextEvents = nextSummary?.recentEvents || []
  const nextLatestKey = getEventKey(nextEvents[0])

  if (!detectNewEvents || !latestSeenEventKey.value) {
    hasNewEvents.value = false
    newEventsCount.value = 0
    latestSeenEventKey.value = nextLatestKey
    return
  }

  const previousLatestIndex = nextEvents.findIndex((event) => getEventKey(event) === latestSeenEventKey.value)
  const count = previousLatestIndex === -1 ? nextEvents.length : previousLatestIndex

  hasNewEvents.value = count > 0
  newEventsCount.value = count
  latestSeenEventKey.value = nextLatestKey
}

function getEventKey(event) {
  if (!event) return ''

  return [
    event.timestamp || '',
    event.name || '',
    event.sessionId || '',
    event.pagePath || '',
    event.params?.sessionId || ''
  ].join('|')
}

function formatPercent(value) {
  return `${Number(value || 0).toFixed(1)}%`
}

function formatDate(value) {
  if (!value) return '-'

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(value))
}

function formatShortDate(value) {
  if (!value) return 'Select date'

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric'
  }).format(new Date(`${value}T12:00:00`))
}

function getDateFilterPayload() {
  const range = getDateRange()
  return {
    from: range.from ? range.from.toISOString() : '',
    to: range.to ? range.to.toISOString() : ''
  }
}

function getDateRange() {
  const now = new Date()

  if (datePreset.value === 'today') {
    return {
      from: startOfDay(now),
      to: endOfDay(now)
    }
  }

  if (datePreset.value === 'week') {
    return {
      from: startOfWeek(now),
      to: endOfDay(now)
    }
  }

  if (datePreset.value === 'last7') {
    return {
      from: startOfDay(getDateDaysAgo(6)),
      to: endOfDay(now)
    }
  }

  if (datePreset.value === 'day') {
    const selected = parseDateInput(specificDate.value)
    return selected
      ? { from: startOfDay(selected), to: endOfDay(selected) }
      : { from: null, to: null }
  }

  if (datePreset.value === 'range') {
    const from = parseDateInput(rangeFromDate.value)
    const to = parseDateInput(rangeToDate.value)
    return {
      from: from ? startOfDay(from) : null,
      to: to ? endOfDay(to) : null
    }
  }

  return { from: null, to: null }
}

function parseDateInput(value) {
  if (!value) return null
  const date = new Date(`${value}T12:00:00`)
  return Number.isNaN(date.getTime()) ? null : date
}

function toDateInputValue(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function getDateDaysAgo(days) {
  const date = new Date()
  date.setDate(date.getDate() - days)
  return date
}

function startOfDay(date) {
  const nextDate = new Date(date)
  nextDate.setHours(0, 0, 0, 0)
  return nextDate
}

function endOfDay(date) {
  const nextDate = new Date(date)
  nextDate.setHours(23, 59, 59, 999)
  return nextDate
}

function startOfWeek(date) {
  const nextDate = startOfDay(date)
  const day = nextDate.getDay()
  nextDate.setDate(nextDate.getDate() - day)
  return nextDate
}

function getEventDetail(event) {
  if (event.name === 'checkout_error') {
    return event.params?.message || event.params?.code || 'Checkout failed'
  }

  if (event.params?.items?.[0]?.item_name) {
    return event.params.items[0].item_name
  }

  return event.pagePath || event.params?.provider || '-'
}

function getEventLocation(event) {
  const geo = event.geo || {}
  const location = [
    geo.city,
    geo.region,
    geo.countryCode || geo.country
  ]
    .filter(Boolean)
    .join(', ')

  return location || 'Unknown'
}
</script>

<template>
  <section class="mello-analytics">
    <div class="mello-analytics__shell">
      <header class="mello-analytics__header">
        <a class="mello-analytics__brand" href="/">
          <img src="/assets/logo-oficial.png" alt="MelloRise">
        </a>
        <div>
          <p>MelloRise intelligence</p>
          <h1>Analytics</h1>
        </div>
        <button v-if="isAuthed" class="mello-analytics__ghost" type="button" @click="logout">
          Sign out
        </button>
      </header>

      <form v-if="!isAuthed" class="mello-analytics-login" @submit.prevent="login">
        <span class="mello-analytics-login__badge">Private dashboard</span>
        <h2>Sign in to view store signals</h2>
        <p>Sessions, product views, carts, checkout starts, abandoned checkouts, and purchases are pulled from the BFF event log.</p>
        <label>
          <span>User</span>
          <input v-model="username" autocomplete="username" placeholder="Dashboard user">
        </label>
        <label>
          <span>Password</span>
          <input v-model="password" type="password" autocomplete="current-password" placeholder="Password">
        </label>
        <p v-if="errorMessage" class="mello-analytics__error" role="alert">{{ errorMessage }}</p>
        <button class="mello-analytics__primary" type="submit" :disabled="isLoading">
          {{ isLoading ? 'Checking...' : 'Open analytics' }}
        </button>
      </form>

      <main v-else class="mello-analytics-dashboard" aria-live="polite">
        <section class="mello-analytics-hero">
          <div>
            <p>Generated {{ formatDate(summary?.generatedAt) }}</p>
            <h2>Store pulse</h2>
            <span>{{ activeDateLabel }} · {{ summary?.storage?.eventCount || 0 }} events shown of {{ summary?.storage?.totalEventCount || summary?.storage?.eventCount || 0 }} saved</span>
            <span>{{ storageLabel }}</span>
          </div>
          <button class="mello-analytics__primary" type="button" :disabled="isLoading" @click="refreshSummary">
            {{ isLoading ? 'Refreshing...' : 'Refresh' }}
          </button>
        </section>

        <section class="mello-analytics-filters" aria-label="Date filters">
          <div class="mello-analytics-filters__presets">
            <button
              v-for="option in datePresetOptions"
              :key="option.value"
              type="button"
              :class="{ 'is-active': datePreset === option.value }"
              @click="applyDatePreset(option.value)"
            >
              {{ option.label }}
            </button>
          </div>

          <div v-if="datePreset === 'day'" class="mello-analytics-filters__custom">
            <label>
              <span>Day</span>
              <input v-model="specificDate" type="date">
            </label>
            <button class="mello-analytics__primary" type="button" :disabled="isLoading" @click="applyCustomDateFilter">
              Apply day
            </button>
          </div>

          <div v-else-if="datePreset === 'range'" class="mello-analytics-filters__custom">
            <label>
              <span>From</span>
              <input v-model="rangeFromDate" type="date">
            </label>
            <label>
              <span>To</span>
              <input v-model="rangeToDate" type="date">
            </label>
            <button class="mello-analytics__primary" type="button" :disabled="isLoading" @click="applyCustomDateFilter">
              Apply range
            </button>
          </div>
        </section>

        <p v-if="errorMessage" class="mello-analytics__error" role="alert">{{ errorMessage }}</p>

        <section class="mello-analytics-grid">
          <article v-for="card in totalCards" :key="card.key" class="mello-analytics-stat">
            <span>{{ card.label }}</span>
            <strong>{{ card.value }}</strong>
          </article>
        </section>

        <section class="mello-analytics-split">
          <article class="mello-analytics-panel">
            <div class="mello-analytics-panel__head">
              <h3>Checkout funnel</h3>
              <span>{{ formatPercent(summary?.conversionRate) }} conversion</span>
            </div>
            <ol class="mello-analytics-funnel">
              <li v-for="step in funnel" :key="step.key">
                <span>{{ step.label }}</span>
                <strong>{{ step.value }}</strong>
                <em v-if="step.rateFromPrevious !== null">{{ formatPercent(step.rateFromPrevious) }}</em>
              </li>
            </ol>
          </article>

          <article class="mello-analytics-panel">
            <div class="mello-analytics-panel__head">
              <h3>Checkout risk</h3>
              <span>{{ formatPercent(summary?.checkoutAbandonmentRate) }} abandoned</span>
            </div>
            <div class="mello-analytics-risk">
              <strong>{{ formatPercent(summary?.checkoutAbandonmentRate) }}</strong>
              <p>Visitors who started checkout but left or had an expired payment session.</p>
            </div>
          </article>
        </section>

        <section class="mello-analytics-columns">
          <article class="mello-analytics-panel">
            <h3>Top pages</h3>
            <ul class="mello-analytics-list">
              <li v-for="item in topPages" :key="item.key">
                <span>{{ item.label }}</span>
                <strong>{{ item.value }}</strong>
              </li>
              <li v-if="!topPages.length" class="is-empty">No page views yet.</li>
            </ul>
          </article>

          <article class="mello-analytics-panel">
            <h3>Top products</h3>
            <ul class="mello-analytics-list">
              <li v-for="item in topProducts" :key="item.key">
                <span>{{ item.label }}</span>
                <strong>{{ item.value }}</strong>
              </li>
              <li v-if="!topProducts.length" class="is-empty">No product events yet.</li>
            </ul>
          </article>

          <article class="mello-analytics-panel">
            <h3>Checkout errors</h3>
            <ul class="mello-analytics-list">
              <li v-for="item in checkoutErrors" :key="item.key">
                <span>{{ item.label }}</span>
                <strong>{{ item.value }}</strong>
              </li>
              <li v-if="!checkoutErrors.length" class="is-empty">No checkout errors logged.</li>
            </ul>
          </article>

          <article class="mello-analytics-panel">
            <h3>Top cities</h3>
            <ul class="mello-analytics-list">
              <li v-for="item in topCities" :key="item.key">
                <span>{{ item.label }}</span>
                <strong>{{ item.value }}</strong>
              </li>
              <li v-if="!topCities.length" class="is-empty">No city data yet.</li>
            </ul>
          </article>
        </section>

        <section class="mello-analytics-panel mello-analytics-events-panel" :class="{ 'has-new-events': hasNewEvents }">
          <div class="mello-analytics-panel__head">
            <h3>Recent events</h3>
            <span>{{ hasNewEvents ? `${newEventsCount} new` : `${recentEvents.length} latest` }}</span>
          </div>
          <div class="mello-analytics-table" role="table" aria-label="Recent analytics events">
            <div class="mello-analytics-table__row is-head" role="row">
              <span role="columnheader">Time</span>
              <span role="columnheader">Event</span>
              <span role="columnheader">Detail</span>
              <span role="columnheader">Location</span>
              <span role="columnheader">IP</span>
              <span role="columnheader">Session</span>
            </div>
            <div v-for="event in recentEvents" :key="`${event.timestamp}-${event.name}-${event.sessionId}`" class="mello-analytics-table__row" role="row">
              <span role="cell">{{ formatDate(event.timestamp) }}</span>
              <strong role="cell">{{ event.name }}</strong>
              <span role="cell">{{ getEventDetail(event) }}</span>
              <span role="cell">{{ getEventLocation(event) }}</span>
              <span role="cell">{{ event.ip || '-' }}</span>
              <span role="cell">{{ event.sessionId || '-' }}</span>
            </div>
            <p v-if="!recentEvents.length" class="mello-analytics-empty">No events saved yet.</p>
          </div>
        </section>
      </main>
    </div>
  </section>
</template>

<style>
.mello-analytics {
  background:
    radial-gradient(circle at 12% 10%, rgba(119, 205, 250, 0.26), transparent 28%),
    radial-gradient(circle at 92% 2%, rgba(49, 214, 176, 0.16), transparent 26%),
    linear-gradient(180deg, #f5fbff 0%, #fffaf2 100%);
  color: #102829;
  font-family: var(--font-body-family);
  min-height: 100vh;
  padding: 28px;
}

.mello-analytics * {
  box-sizing: border-box;
  letter-spacing: 0;
}

.mello-analytics__shell {
  margin: 0 auto;
  max-width: 1180px;
}

.mello-analytics__header,
.mello-analytics-hero,
.mello-analytics-panel,
.mello-analytics-login,
.mello-analytics-stat {
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(16, 40, 41, 0.08);
  border-radius: 8px;
  box-shadow: 0 20px 54px rgba(16, 40, 41, 0.08);
}

.mello-analytics__header {
  align-items: center;
  display: grid;
  gap: 18px;
  grid-template-columns: auto 1fr auto;
  margin-bottom: 20px;
  padding: 18px 20px;
}

.mello-analytics__brand img {
  display: block;
  height: 34px;
  object-fit: contain;
  width: auto;
}

.mello-analytics__header p,
.mello-analytics-hero p,
.mello-analytics-hero span,
.mello-analytics-panel__head span,
.mello-analytics-stat span,
.mello-analytics-login__badge {
  color: #5b7071;
  font-size: 0.78rem;
  font-weight: 750;
  margin: 0;
  text-transform: uppercase;
}

.mello-analytics__header h1,
.mello-analytics-hero h2,
.mello-analytics-login h2 {
  color: #102829;
  font-size: clamp(2.2rem, 6vw, 4.6rem);
  font-weight: 850;
  line-height: 0.95;
  margin: 4px 0 0;
}

.mello-analytics-login {
  display: grid;
  gap: 16px;
  margin: 82px auto 0;
  max-width: 480px;
  padding: 28px;
}

.mello-analytics-login p {
  color: #4f6364;
  font-size: 1rem;
  font-weight: 560;
  line-height: 1.48;
  margin: 0;
}

.mello-analytics-login label {
  display: grid;
  gap: 8px;
}

.mello-analytics-login label span {
  color: #102829;
  font-size: 0.9rem;
  font-weight: 820;
}

.mello-analytics-login input {
  background: #ffffff;
  border: 1px solid rgba(16, 40, 41, 0.16);
  border-radius: 8px;
  color: #102829;
  font: inherit;
  font-size: 1rem;
  min-height: 50px;
  padding: 0 14px;
}

.mello-analytics-login input:focus-visible,
.mello-analytics-filters input:focus-visible,
.mello-analytics__primary:focus-visible,
.mello-analytics__ghost:focus-visible,
.mello-analytics-filters__presets button:focus-visible {
  outline: 3px solid rgba(119, 205, 250, 0.44);
  outline-offset: 2px;
}

.mello-analytics__primary,
.mello-analytics__ghost {
  align-items: center;
  appearance: none;
  border: 0;
  border-radius: 8px;
  cursor: pointer;
  display: inline-flex;
  font: inherit;
  font-weight: 850;
  justify-content: center;
  min-height: 48px;
  padding: 0 18px;
}

.mello-analytics__primary {
  background: #133130;
  color: #ffffff;
}

.mello-analytics__primary:disabled {
  cursor: wait;
  opacity: 0.68;
}

.mello-analytics__ghost {
  background: #eef9ff;
  color: #133130;
}

.mello-analytics__error {
  background: #fff4f2;
  border: 1px solid rgba(179, 38, 30, 0.2);
  border-radius: 8px;
  color: #9c1c15;
  font-weight: 780;
  margin: 0;
  padding: 12px 14px;
}

.mello-analytics-dashboard {
  display: grid;
  gap: 18px;
}

.mello-analytics-hero {
  align-items: end;
  display: grid;
  gap: 18px;
  grid-template-columns: 1fr auto;
  padding: 24px;
}

.mello-analytics-hero h2 {
  font-size: clamp(2.4rem, 7vw, 5.2rem);
}

.mello-analytics-hero span {
  display: block;
  margin-top: 10px;
  overflow-wrap: anywhere;
  text-transform: none;
}

.mello-analytics-filters {
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(16, 40, 41, 0.08);
  border-radius: 8px;
  box-shadow: 0 16px 42px rgba(16, 40, 41, 0.06);
  display: grid;
  gap: 14px;
  padding: 16px;
}

.mello-analytics-filters__presets {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.mello-analytics-filters__presets button {
  appearance: none;
  background: #f6fbfb;
  border: 1px solid rgba(16, 40, 41, 0.08);
  border-radius: 999px;
  color: #345051;
  cursor: pointer;
  font: inherit;
  font-size: 0.9rem;
  font-weight: 780;
  min-height: 40px;
  padding: 0 14px;
  transition:
    background-color 160ms ease,
    border-color 160ms ease,
    color 160ms ease;
}

.mello-analytics-filters__presets button.is-active {
  background: #133130;
  border-color: #133130;
  color: #ffffff;
}

.mello-analytics-filters__custom {
  align-items: end;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.mello-analytics-filters__custom label {
  display: grid;
  gap: 6px;
  min-width: 180px;
}

.mello-analytics-filters__custom label span {
  color: #102829;
  font-size: 0.78rem;
  font-weight: 850;
  text-transform: uppercase;
}

.mello-analytics-filters input {
  background: #ffffff;
  border: 1px solid rgba(16, 40, 41, 0.16);
  border-radius: 8px;
  color: #102829;
  font: inherit;
  font-size: 0.96rem;
  font-weight: 650;
  min-height: 48px;
  padding: 0 12px;
}

.mello-analytics-grid {
  display: grid;
  gap: 14px;
  grid-template-columns: repeat(6, minmax(0, 1fr));
}

.mello-analytics-stat {
  display: grid;
  gap: 10px;
  min-height: 116px;
  padding: 18px;
}

.mello-analytics-stat strong {
  color: #102829;
  font-size: clamp(1.9rem, 4vw, 3rem);
  font-weight: 830;
  line-height: 1;
}

.mello-analytics-split,
.mello-analytics-columns {
  display: grid;
  gap: 18px;
}

.mello-analytics-split {
  grid-template-columns: minmax(0, 1.5fr) minmax(280px, 0.75fr);
}

.mello-analytics-columns {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.mello-analytics-panel {
  padding: 20px;
}

.mello-analytics-events-panel {
  position: relative;
  transition:
    background-color 180ms ease,
    border-color 180ms ease,
    box-shadow 180ms ease;
}

.mello-analytics-events-panel.has-new-events {
  animation: mello-new-events-pulse 1050ms ease-in-out infinite;
  background: #fff9e9;
  border-color: rgba(224, 130, 21, 0.42);
}

.mello-analytics-events-panel.has-new-events .mello-analytics-panel__head span {
  background: #f59f24;
  border-radius: 999px;
  color: #3a2505;
  padding: 6px 10px;
}

@keyframes mello-new-events-pulse {
  0%,
  100% {
    box-shadow: 0 20px 54px rgba(16, 40, 41, 0.08);
  }

  45% {
    box-shadow: 0 24px 64px rgba(224, 130, 21, 0.3);
  }
}

.mello-analytics-panel h3 {
  color: #102829;
  font-size: 1.15rem;
  font-weight: 850;
  margin: 0;
}

.mello-analytics-panel__head {
  align-items: center;
  display: flex;
  gap: 12px;
  justify-content: space-between;
  margin-bottom: 16px;
}

.mello-analytics-funnel,
.mello-analytics-list {
  display: grid;
  gap: 10px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.mello-analytics-funnel li,
.mello-analytics-list li {
  align-items: center;
  background: #f6fbfb;
  border-radius: 8px;
  display: grid;
  gap: 10px;
  grid-template-columns: minmax(0, 1fr) auto auto;
  padding: 13px 14px;
}

.mello-analytics-funnel span,
.mello-analytics-list span,
.mello-analytics-table__row span {
  color: #4f6364;
  font-size: 0.92rem;
  font-weight: 620;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
}

.mello-analytics-funnel strong,
.mello-analytics-list strong {
  color: #102829;
  font-size: 1rem;
  font-weight: 850;
}

.mello-analytics-funnel em {
  background: #dff7f1;
  border-radius: 999px;
  color: #08775e;
  font-size: 0.78rem;
  font-style: normal;
  font-weight: 850;
  padding: 5px 9px;
}

.mello-analytics-risk {
  background: #f6fbfb;
  border-radius: 8px;
  min-height: 190px;
  padding: 18px;
}

.mello-analytics-risk strong {
  color: #b3261e;
  display: block;
  font-size: clamp(2.6rem, 8vw, 5rem);
  font-weight: 820;
  line-height: 0.95;
}

.mello-analytics-risk p {
  color: #4f6364;
  font-weight: 620;
  line-height: 1.42;
  margin: 14px 0 0;
}

.mello-analytics-list .is-empty,
.mello-analytics-empty {
  color: #5b7071;
  font-weight: 720;
}

.mello-analytics-table {
  border: 1px solid rgba(16, 40, 41, 0.08);
  border-radius: 8px;
  overflow: hidden;
}

.mello-analytics-table__row {
  align-items: center;
  border-top: 1px solid rgba(16, 40, 41, 0.07);
  display: grid;
  gap: 14px;
  grid-template-columns: 130px 170px minmax(180px, 1fr) 190px 150px 220px;
  min-height: 50px;
  padding: 0 14px;
}

.mello-analytics-table__row.is-head {
  background: #eef9ff;
  border-top: 0;
}

.mello-analytics-table__row.is-head span {
  color: #102829;
  font-size: 0.74rem;
  font-weight: 850;
  text-transform: uppercase;
}

.mello-analytics-table__row strong {
  color: #102829;
  font-size: 0.92rem;
  font-weight: 820;
}

.mello-analytics-empty {
  margin: 0;
  padding: 22px 14px;
}

@media (max-width: 980px) {
  .mello-analytics-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .mello-analytics-split,
  .mello-analytics-columns {
    grid-template-columns: 1fr;
  }

  .mello-analytics-table {
    overflow-x: auto;
  }

  .mello-analytics-table__row {
    min-width: 1040px;
  }
}

@media (max-width: 640px) {
  .mello-analytics {
    padding: 14px;
  }

  .mello-analytics__header,
  .mello-analytics-hero {
    align-items: start;
    grid-template-columns: 1fr;
  }

  .mello-analytics__header h1,
  .mello-analytics-hero h2,
  .mello-analytics-login h2 {
    font-size: 2.55rem;
  }

  .mello-analytics-login {
    margin-top: 26px;
    padding: 22px;
  }

  .mello-analytics-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .mello-analytics-filters {
    padding: 14px;
  }

  .mello-analytics-filters__presets {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .mello-analytics-filters__presets button,
  .mello-analytics-filters__custom .mello-analytics__primary,
  .mello-analytics-filters__custom label {
    width: 100%;
  }

  .mello-analytics-stat {
    min-height: 96px;
    padding: 15px;
  }
}
</style>
