<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useAuth, useClerk, useUser } from '@clerk/vue'
import { useI18n } from 'vue-i18n'
import { fetchAccountOrders } from '../services/account'

const { t } = useI18n({ useScope: 'global' })
const clerk = useClerk()
const { isLoaded, isSignedIn, getToken } = useAuth()
const { user } = useUser()
const isLoading = ref(false)
const errorMessage = ref('')
const orders = ref([])
const customer = ref(null)

const displayName = computed(() => (
  user.value?.firstName ||
  user.value?.fullName ||
  customer.value?.name ||
  t('account.title')
))

async function loadOrders() {
  if (!isLoaded.value || !isSignedIn.value || isLoading.value) return

  isLoading.value = true
  errorMessage.value = ''

  try {
    const token = await getToken.value()
    const data = await fetchAccountOrders(token)
    orders.value = Array.isArray(data?.orders) ? data.orders : []
    customer.value = data?.customer || null
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

onMounted(loadOrders)
watch([isLoaded, isSignedIn], loadOrders)
</script>

<template>
  <section class="mello-account">
    <div class="mello-account__shell">
      <div class="mello-account__intro">
        <p>{{ t('account.eyebrow') }}</p>
        <h1>{{ t('account.title') }}</h1>
        <span>{{ t('account.subtitle') }}</span>
      </div>

      <section v-if="!isLoaded" class="mello-account__panel">
        <span class="mello-account__spinner" aria-hidden="true"></span>
        <h2>{{ t('account.loadingAuth') }}</h2>
      </section>

      <section v-else-if="!isSignedIn" class="mello-account__panel">
        <h2>{{ t('account.signInTitle') }}</h2>
        <p>{{ t('account.signInText') }}</p>
        <button type="button" @click="openSignIn">{{ t('auth.signIn') }}</button>
      </section>

      <section v-else class="mello-account__grid">
        <aside class="mello-account__summary">
          <span>{{ t('account.signedInAs') }}</span>
          <strong>{{ displayName }}</strong>
          <small>{{ customer?.email || user?.primaryEmailAddress?.emailAddress }}</small>
          <button type="button" @click="loadOrders" :disabled="isLoading">{{ t('account.refresh') }}</button>
        </aside>

        <div class="mello-account__orders">
          <div v-if="isLoading" class="mello-account__panel">
            <span class="mello-account__spinner" aria-hidden="true"></span>
            <h2>{{ t('account.loadingOrders') }}</h2>
          </div>

          <div v-else-if="errorMessage" class="mello-account__panel is-error" role="alert">
            <h2>{{ t('account.errorTitle') }}</h2>
            <p>{{ t('account.error') }}</p>
            <button type="button" @click="loadOrders">{{ t('account.tryAgain') }}</button>
          </div>

          <div v-else-if="!orders.length" class="mello-account__panel">
            <h2>{{ t('account.emptyTitle') }}</h2>
            <p>{{ t('account.emptyText') }}</p>
            <a href="/products/wondernest-heightener-gummies-2026#comprar">{{ t('account.emptyAction') }}</a>
          </div>

          <article v-for="order in orders" v-else :key="order.id" class="mello-account-order">
            <div class="mello-account-order__head">
              <div>
                <span>{{ t('account.order') }} #{{ order.number }}</span>
                <strong>{{ order.statusLabel }}</strong>
              </div>
              <div>
                <b>{{ formatOrderTotal(order) }}</b>
                <small>{{ formatOrderDate(order.placedAt) }}</small>
              </div>
            </div>

            <div class="mello-account-order__items">
              <div v-for="item in order.items" :key="`${order.id}-${item.name}`">
                <img :src="item.image || '/assets/frasco.png'" alt="" loading="lazy">
                <p>{{ item.name }}</p>
                <span>x{{ item.quantity }}</span>
              </div>
            </div>

            <div v-if="order.tracking" class="mello-account-order__tracking">
              <span>{{ t('account.trackingReady') }}</span>
              <strong>{{ order.tracking.code }}</strong>
              <a v-if="order.tracking.url" :href="order.tracking.url" target="_blank" rel="noopener">
                {{ t('tracking.result.openCarrier') }}
              </a>
            </div>

            <div v-else class="mello-account-order__pending">
              {{ t('account.trackingPending') }}
            </div>
          </article>
        </div>
      </section>
    </div>
  </section>
</template>

<style>
.mello-account {
  background:
    radial-gradient(circle at 12% 12%, rgba(119, 205, 250, 0.16), transparent 30%),
    radial-gradient(circle at 88% 10%, rgba(49, 214, 176, 0.1), transparent 28%),
    linear-gradient(180deg, #ffffff 0%, #f6fbfb 55%, #fff8eb 100%);
  color: #102829;
  font-family: var(--font-body-family);
  padding: clamp(30px, 4vw, 62px) 20px clamp(42px, 6vw, 82px);
}

.mello-account * {
  box-sizing: border-box;
  letter-spacing: 0;
}

.mello-account__shell {
  margin: 0 auto;
  max-width: 1180px;
}

.mello-account__intro {
  max-width: 760px;
}

.mello-account__intro p {
  color: #2093d7;
  font-size: 12px;
  font-weight: 900;
  line-height: 1.2;
  margin: 0 0 8px;
  text-transform: uppercase;
}

.mello-account__intro h1 {
  color: #102829;
  font-size: clamp(42px, 5vw, 68px);
  font-weight: 950;
  letter-spacing: -0.03em;
  line-height: 0.98;
  margin: 0;
}

.mello-account__intro span {
  color: #5f7073;
  display: block;
  font-size: clamp(16px, 1.45vw, 20px);
  font-weight: 560;
  line-height: 1.45;
  margin-top: 12px;
  max-width: 58ch;
}

.mello-account__grid {
  align-items: start;
  display: grid;
  gap: 24px;
  grid-template-columns: minmax(260px, 0.34fr) minmax(0, 0.66fr);
  margin-top: clamp(24px, 3.5vw, 42px);
}

.mello-account__summary,
.mello-account__panel,
.mello-account-order {
  background: rgba(255, 255, 255, 0.94);
  border: 1px solid rgba(23, 49, 50, 0.1);
  border-radius: 16px;
  box-shadow: 0 24px 70px rgba(23, 49, 50, 0.08);
}

.mello-account__summary {
  display: grid;
  gap: 8px;
  padding: 24px;
  position: sticky;
  top: 104px;
}

.mello-account__summary span,
.mello-account-order__head span,
.mello-account-order__tracking span {
  color: #5f7073;
  font-size: 12px;
  font-weight: 900;
  text-transform: uppercase;
}

.mello-account__summary strong {
  font-size: 24px;
  font-weight: 930;
  letter-spacing: -0.02em;
  line-height: 1.05;
}

.mello-account__summary small,
.mello-account-order__head small {
  color: #5f7073;
  font-size: 14px;
  font-weight: 650;
}

.mello-account__summary button,
.mello-account__panel button,
.mello-account__panel a,
.mello-account-order__tracking a {
  align-items: center;
  appearance: none;
  background: #173132;
  border: 0;
  border-radius: 999px;
  color: #ffffff;
  cursor: pointer;
  display: inline-flex;
  font: 900 14px/1 var(--font-body-family);
  justify-content: center;
  margin-top: 12px;
  min-height: 44px;
  padding: 0 18px;
  text-decoration: none;
}

.mello-account__summary button:disabled {
  cursor: wait;
  opacity: 0.72;
}

.mello-account__orders {
  display: grid;
  gap: 16px;
}

.mello-account__panel {
  display: grid;
  justify-items: start;
  min-height: 220px;
  padding: clamp(24px, 3vw, 34px);
}

.mello-account__panel h2 {
  font-size: 28px;
  font-weight: 930;
  letter-spacing: -0.02em;
  line-height: 1.08;
  margin: 0;
}

.mello-account__panel p {
  color: #5f7073;
  font-size: 16px;
  font-weight: 560;
  line-height: 1.5;
  margin: 8px 0 0;
  max-width: 48ch;
}

.mello-account__panel.is-error {
  border-color: rgba(190, 30, 77, 0.22);
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

.mello-account-order {
  display: grid;
  gap: 18px;
  padding: clamp(20px, 3vw, 28px);
}

.mello-account-order__head {
  align-items: flex-start;
  border-bottom: 1px solid rgba(23, 49, 50, 0.1);
  display: flex;
  gap: 18px;
  justify-content: space-between;
  padding-bottom: 18px;
}

.mello-account-order__head strong {
  display: block;
  font-size: 24px;
  font-weight: 930;
  letter-spacing: -0.02em;
  line-height: 1.08;
  margin-top: 4px;
}

.mello-account-order__head b {
  display: block;
  font-size: 24px;
  font-weight: 900;
  text-align: right;
}

.mello-account-order__items {
  display: grid;
  gap: 10px;
}

.mello-account-order__items div {
  align-items: center;
  background: #f6fbfb;
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
  font-weight: 820;
  line-height: 1.2;
  margin: 0;
}

.mello-account-order__items span {
  color: #5f7073;
  font-size: 14px;
  font-weight: 900;
}

.mello-account-order__tracking,
.mello-account-order__pending {
  border-radius: 14px;
  padding: 16px;
}

.mello-account-order__tracking {
  background: #e7fbf6;
  display: grid;
  gap: 6px;
}

.mello-account-order__tracking strong {
  font-size: 22px;
  font-weight: 930;
}

.mello-account-order__tracking a {
  background: #31d6b0;
  color: #102829;
  justify-self: start;
  margin-top: 6px;
}

.mello-account-order__pending {
  background: #fff8eb;
  color: #5f7073;
  font-size: 15px;
  font-weight: 760;
}

@keyframes mello-account-spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 820px) {
  .mello-account {
    padding: 24px 14px 58px;
  }

  .mello-account__intro h1 {
    font-size: clamp(38px, 11vw, 50px);
  }

  .mello-account__grid {
    grid-template-columns: 1fr;
  }

  .mello-account__summary {
    position: static;
  }

  .mello-account-order__head {
    display: grid;
  }

  .mello-account-order__head b {
    text-align: left;
  }
}
</style>
