<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useAuth, useClerk } from '@clerk/vue'
import { useI18n } from 'vue-i18n'
import { fetchAccountOrders } from '../services/account'
import { mockPaidAccountOrder } from '../mocks/accountOrder'

const MOCK_ORDER_PREVIEW_KEY = 'mellorise:show-mock-order'

const { t } = useI18n({ useScope: 'global' })
const clerk = useClerk()
const { isLoaded, isSignedIn, getToken } = useAuth()
const isLoading = ref(false)
const errorMessage = ref('')
const orders = ref([])
const showMockOrder = ref(false)

const displayedOrders = computed(() => {
  if (!showMockOrder.value) return orders.value

  const hasMockOrder = orders.value.some((order) => order.id === mockPaidAccountOrder.id)
  return hasMockOrder ? orders.value : [mockPaidAccountOrder, ...orders.value]
})

const orderCountLabel = computed(() => {
  if (!displayedOrders.value.length) return ''
  return displayedOrders.value.length === 1 ? t('account.oneOrder') : t('account.manyOrders', { count: displayedOrders.value.length })
})

function hydrateMockOrderPreview() {
  const params = new URLSearchParams(window.location.search)
  if (params.get('mock') === '1') {
    window.localStorage.setItem(MOCK_ORDER_PREVIEW_KEY, '1')
  }

  showMockOrder.value = window.localStorage.getItem(MOCK_ORDER_PREVIEW_KEY) === '1'
}

async function loadOrders() {
  if (!isLoaded.value || !isSignedIn.value || isLoading.value) return

  isLoading.value = true
  errorMessage.value = ''

  try {
    const token = await getToken.value()
    const data = await fetchAccountOrders(token)
    orders.value = Array.isArray(data?.orders) ? data.orders : []
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : t('account.error')
  } finally {
    isLoading.value = false
  }
}

function openSignIn() {
  clerk.value?.openSignIn({
    fallbackRedirectUrl: '/account/orders',
    signUpFallbackRedirectUrl: '/account/orders',
  })
}

function formatOrderTotal(order) {
  const numeric = Number(order.total || 0)
  const currency = order.currency || 'USD'

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(Number.isFinite(numeric) ? numeric : 0)
}

function formatOrderDate(value) {
  if (!value) return ''

  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value))
}

function getOrderHref(order) {
  return `/account/orders/${encodeURIComponent(order.id)}`
}

onMounted(() => {
  hydrateMockOrderPreview()
  loadOrders()
})
watch([isLoaded, isSignedIn], loadOrders)
</script>

<template>
  <section class="mello-account">
    <article class="mello-account__card" aria-labelledby="mello-account-title">
      <header class="mello-account__header">
        <div>
          <h1 id="mello-account-title">{{ t('account.title') }}</h1>
          <p v-if="orderCountLabel">{{ orderCountLabel }}</p>
        </div>

        <button
          v-if="isLoaded && isSignedIn"
          class="mello-account__refresh"
          type="button"
          @click="loadOrders"
          :disabled="isLoading"
        >
          {{ t('account.refresh') }}
        </button>
      </header>

      <section v-if="!isLoaded" class="mello-account__state" aria-live="polite">
        <span class="mello-account__spinner" aria-hidden="true"></span>
        <h2>{{ t('account.loadingAuth') }}</h2>
      </section>

      <section v-else-if="!isSignedIn" class="mello-account__state">
        <h2>{{ t('account.signInTitle') }}</h2>
        <p>{{ t('account.signInText') }}</p>
        <button type="button" @click="openSignIn">{{ t('auth.signIn') }}</button>
      </section>

      <section v-else class="mello-account__content">
        <div v-if="isLoading" class="mello-account__state is-inline" aria-live="polite">
          <span class="mello-account__spinner" aria-hidden="true"></span>
          <h2>{{ t('account.loadingOrders') }}</h2>
        </div>

        <div v-else-if="errorMessage" class="mello-account__state is-error" role="alert">
          <h2>{{ t('account.errorTitle') }}</h2>
          <p>{{ t('account.error') }}</p>
          <button type="button" @click="loadOrders">{{ t('account.tryAgain') }}</button>
        </div>

        <div v-else-if="!displayedOrders.length" class="mello-account__empty">
          <h2>{{ t('account.emptyTitle') }}</h2>
        </div>

        <div v-else class="mello-account__orders">
          <a v-for="order in displayedOrders" :key="order.id" class="mello-account-order" :href="getOrderHref(order)">
            <header class="mello-account-order__head">
              <div>
                <span>{{ t('account.order') }} #{{ order.number }}</span>
                <strong>{{ order.statusLabel }}</strong>
              </div>
              <div>
                <b>{{ formatOrderTotal(order) }}</b>
                <small>{{ formatOrderDate(order.placedAt) }}</small>
              </div>
            </header>

            <div class="mello-account-order__items">
              <div v-for="item in order.items" :key="`${order.id}-${item.name}`">
                <img :src="item.image || '/assets/frasco.png'" alt="" loading="lazy">
                <p>{{ item.name }}</p>
                <span>x{{ item.quantity }}</span>
              </div>
            </div>

            <footer v-if="order.tracking" class="mello-account-order__tracking">
              <div>
                <span>{{ t('account.trackingReady') }}</span>
                <strong>{{ order.tracking.code }}</strong>
              </div>
              <span>{{ t('account.openDetails') }}</span>
            </footer>

            <footer v-else class="mello-account-order__pending">
              {{ t('account.trackingPending') }}
            </footer>
          </a>
        </div>
      </section>
    </article>
  </section>
</template>

<style>
.mello-account {
  background: linear-gradient(180deg, #f6fcff 0%, #f8fbf8 52%, #fffaf2 100%);
  color: var(--mello-ink);
  font-family: var(--font-body-family);
  min-height: calc(100vh - 78px);
  min-height: calc(100svh - 78px);
  padding: clamp(22px, 4vw, 44px) 20px clamp(38px, 6vw, 68px);
}

.mello-account * {
  box-sizing: border-box;
  letter-spacing: 0;
}

.mello-account__card {
  background: var(--mello-surface);
  border: 1px solid var(--mello-line);
  border-radius: var(--mello-radius);
  box-shadow: var(--mello-shadow);
  display: grid;
  gap: clamp(16px, 2.2vw, 24px);
  margin: 0 auto;
  max-width: 980px;
  min-height: min(430px, calc(100svh - 150px));
  overflow: hidden;
  padding: clamp(20px, 3vw, 34px);
}

.mello-account__header {
  align-items: flex-start;
  display: flex;
  gap: 24px;
  justify-content: space-between;
}

.mello-account-order__head span,
.mello-account-order__tracking span {
  color: #5f7073;
  display: block;
  font-size: 12px;
  font-weight: 800;
  line-height: 1.2;
  text-transform: uppercase;
}

.mello-account__header h1 {
  color: var(--mello-ink);
  font-family: var(--font-heading-family);
  font-size: clamp(32px, 4.2vw, 50px);
  font-weight: 760;
  letter-spacing: -0.018em;
  line-height: 1.03;
  margin: 0;
}

.mello-account__header p {
  color: #53686b;
  font-size: 14px;
  font-weight: 520;
  line-height: 1.35;
  margin: 8px 0 0;
}

.mello-account__refresh,
.mello-account__state button,
.mello-account__empty a,
.mello-account-order__tracking span:last-child {
  align-items: center;
  appearance: none;
  background: #173132;
  border: 0;
  border-radius: 999px;
  color: #ffffff;
  cursor: pointer;
  display: inline-flex;
  font: 720 14px/1 var(--font-body-family);
  justify-content: center;
  min-height: 46px;
  padding: 0 20px;
  text-decoration: none;
  transition: background 180ms ease, box-shadow 180ms ease, color 180ms ease, transform 180ms ease;
  white-space: nowrap;
}

.mello-account__refresh {
  flex: 0 0 auto;
  margin-top: 4px;
}

.mello-account__refresh:disabled {
  cursor: wait;
  opacity: 0.72;
}

.mello-account__refresh:hover:not(:disabled),
.mello-account__refresh:focus-visible,
.mello-account__state button:hover,
.mello-account__state button:focus-visible,
.mello-account__empty a:hover,
.mello-account__empty a:focus-visible,
.mello-account-order:hover .mello-account-order__tracking span:last-child,
.mello-account-order:focus-visible .mello-account-order__tracking span:last-child {
  background: #102829;
  box-shadow: 0 14px 30px rgba(16, 40, 41, 0.14);
  color: #ffffff;
  outline: 0;
  transform: translateY(-1px);
}

.mello-account__content {
  display: grid;
  gap: 18px;
}

.mello-account__state,
.mello-account__empty {
  align-content: center;
  display: grid;
  justify-items: center;
  min-height: 220px;
  padding: clamp(22px, 4vw, 40px) 18px;
  text-align: center;
}

.mello-account__state.is-inline {
  min-height: 220px;
}

.mello-account__state h2,
.mello-account__empty h2 {
  color: var(--mello-ink);
  font-size: clamp(24px, 3vw, 34px);
  font-family: var(--font-heading-family);
  font-weight: 760;
  letter-spacing: -0.012em;
  line-height: 1.12;
  margin: 0;
  max-width: 18ch;
}

.mello-account__state p,
.mello-account__empty p {
  color: #53686b;
  font-size: 16px;
  font-weight: 500;
  line-height: 1.5;
  margin: 12px auto 0;
  max-width: 45ch;
}

.mello-account__state button,
.mello-account__empty a {
  margin-top: 22px;
}

.mello-account__state.is-error h2 {
  color: #8e1c3a;
}

.mello-account__spinner {
  animation: mello-account-spin 850ms linear infinite;
  border: 3px solid rgba(23, 49, 50, 0.14);
  border-radius: 50%;
  border-top-color: #77cdfa;
  height: 32px;
  margin-bottom: 18px;
  width: 32px;
}

.mello-account__orders {
  border-top: 1px solid rgba(23, 49, 50, 0.1);
  display: grid;
}

.mello-account-order {
  border-bottom: 1px solid rgba(23, 49, 50, 0.1);
  color: inherit;
  display: grid;
  gap: 14px;
  padding: 20px 0;
  text-decoration: none;
  transition: background 180ms ease, box-shadow 180ms ease;
}

.mello-account-order:hover,
.mello-account-order:focus-visible {
  background: #f7fbfb;
  box-shadow: 0 0 0 12px #f7fbfb;
  outline: 0;
}

.mello-account-order:last-child {
  border-bottom: 0;
  padding-bottom: 0;
}

.mello-account-order__head {
  align-items: flex-start;
  display: flex;
  gap: 18px;
  justify-content: space-between;
}

.mello-account-order__head > div {
  min-width: 0;
}

.mello-account-order__head > div:last-child {
  flex: 0 0 auto;
}

.mello-account-order__head strong {
  display: block;
  font-family: var(--font-heading-family);
  font-size: 22px;
  font-weight: 760;
  letter-spacing: -0.012em;
  line-height: 1.1;
  margin-top: 4px;
}

.mello-account-order__head b {
  color: #102829;
  display: block;
  font-size: 24px;
  font-weight: 760;
  text-align: right;
}

.mello-account-order__head small {
  color: #53686b;
  display: block;
  font-size: 14px;
  font-weight: 520;
  margin-top: 3px;
}

.mello-account-order__items {
  display: grid;
  gap: 10px;
}

.mello-account-order__items div {
  align-items: center;
  background: #ffffff;
  border: 1px solid rgba(16, 40, 41, 0.07);
  border-radius: 12px;
  display: grid;
  gap: 12px;
  grid-template-columns: 54px 1fr auto;
  padding: 10px 12px;
}

.mello-account-order__items img {
  height: 54px;
  object-fit: contain;
  width: 54px;
}

.mello-account-order__items p {
  font-size: 15px;
  font-weight: 720;
  line-height: 1.2;
  margin: 0;
}

.mello-account-order__items span {
  color: #5f7073;
  font-size: 14px;
  font-weight: 700;
}

.mello-account-order__tracking,
.mello-account-order__pending {
  border-radius: 14px;
  padding: 16px;
}

.mello-account-order__tracking {
  align-items: center;
  background: var(--mello-mint-soft);
  display: flex;
  gap: 16px;
  justify-content: space-between;
}

.mello-account-order__tracking strong {
  color: #102829;
  display: block;
  font-size: 22px;
  font-weight: 760;
  margin-top: 4px;
}

.mello-account-order__tracking span:last-child {
  background: #31d6b0;
  color: #102829;
}

.mello-account-order__pending {
  background: #fff8eb;
  color: #5f7073;
  font-size: 15px;
  font-weight: 620;
}

@keyframes mello-account-spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 820px) {
  .mello-account {
    min-height: calc(100svh - 74px);
    padding: 14px 10px 34px;
  }

  .mello-account__card {
    border-radius: 16px;
    gap: 14px;
    min-height: 0;
    padding: 18px;
  }

  .mello-account__header {
    display: grid;
    gap: 16px;
  }

  .mello-account__header h1 {
    font-size: 34px;
  }

  .mello-account__refresh {
    justify-self: start;
    margin-top: 0;
  }

  .mello-account-order__head {
    display: flex;
    gap: 12px;
  }

  .mello-account-order__head strong {
    font-size: 19px;
  }

  .mello-account-order__head b {
    text-align: left;
    font-size: 20px;
  }

  .mello-account-order__items div {
    grid-template-columns: 48px 1fr auto;
  }

  .mello-account-order__items img {
    height: 48px;
    width: 48px;
  }

  .mello-account-order__tracking {
    align-items: flex-start;
    display: grid;
  }

  .mello-account-order__tracking span:last-child {
    justify-self: start;
  }
}

@media (max-width: 420px) {
  .mello-account__state,
  .mello-account__empty {
    min-height: 190px;
    padding-inline: 4px;
  }

  .mello-account__state h2,
  .mello-account__empty h2 {
    font-size: 28px;
  }
}
</style>
