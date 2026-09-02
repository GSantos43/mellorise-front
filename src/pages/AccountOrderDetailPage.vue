<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useAuth, useClerk } from '@clerk/vue'
import { useI18n } from 'vue-i18n'
import { fetchAccountOrder } from '../services/account'

const props = defineProps({
  orderId: {
    type: String,
    required: true
  }
})

const { t } = useI18n({ useScope: 'global' })
const clerk = useClerk()
const { isLoaded, isSignedIn, getToken } = useAuth()
const isLoading = ref(false)
const errorMessage = ref('')
const order = ref(null)

const orderTitle = computed(() => {
  if (!order.value) return t('accountDetail.title')
  return t('accountDetail.orderTitle', { number: order.value.number })
})

const hasPromotion = computed(() => Boolean(order.value?.promotion?.label || order.value?.promotion?.code))
const hasCoupon = computed(() => Boolean(order.value?.coupon?.code))
const hasDiscount = computed(() => Number(order.value?.discountTotal || 0) > 0)

async function loadOrder() {
  if (!isLoaded.value || !isSignedIn.value || isLoading.value || !props.orderId) return

  isLoading.value = true
  errorMessage.value = ''

  try {
    const token = await getToken.value()
    const data = await fetchAccountOrder(token, props.orderId)
    order.value = data?.order || null
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : t('accountDetail.error')
    order.value = null
  } finally {
    isLoading.value = false
  }
}

function openSignIn() {
  const fallbackRedirectUrl = `/account/orders/${encodeURIComponent(props.orderId)}`
  clerk.value?.openSignIn({
    fallbackRedirectUrl,
    signUpFallbackRedirectUrl: fallbackRedirectUrl,
  })
}

function formatMoney(value, currency = 'USD') {
  const numeric = Number(value || 0)

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(Number.isFinite(numeric) ? numeric : 0)
}

function formatDate(value) {
  if (!value) return t('accountDetail.unavailable')

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return t('accountDetail.unavailable')

  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

function getPromotionText(promotion) {
  if (!promotion) return t('accountDetail.noPromotion')

  if (promotion.paidQuantity && promotion.freeQuantity && promotion.deliveredQuantity) {
    return t('accountDetail.promotionQuantity', {
      paid: promotion.paidQuantity,
      free: promotion.freeQuantity,
      total: promotion.deliveredQuantity,
    })
  }

  return promotion.label || promotion.code || t('accountDetail.noPromotion')
}

onMounted(loadOrder)
watch([isLoaded, isSignedIn, () => props.orderId], loadOrder)
</script>

<template>
  <section class="mello-order-detail">
    <article class="mello-order-detail__card" aria-labelledby="mello-order-detail-title">
      <a class="mello-order-detail__back" href="/account/orders">{{ t('accountDetail.back') }}</a>

      <section v-if="!isLoaded" class="mello-order-detail__state" aria-live="polite">
        <span class="mello-order-detail__spinner" aria-hidden="true"></span>
        <h1 id="mello-order-detail-title">{{ t('account.loadingAuth') }}</h1>
      </section>

      <section v-else-if="!isSignedIn" class="mello-order-detail__state">
        <h1 id="mello-order-detail-title">{{ t('account.signInTitle') }}</h1>
        <p>{{ t('account.signInText') }}</p>
        <button type="button" @click="openSignIn">{{ t('auth.signIn') }}</button>
      </section>

      <section v-else-if="isLoading" class="mello-order-detail__state" aria-live="polite">
        <span class="mello-order-detail__spinner" aria-hidden="true"></span>
        <h1 id="mello-order-detail-title">{{ t('accountDetail.loading') }}</h1>
      </section>

      <section v-else-if="errorMessage || !order" class="mello-order-detail__state is-error" role="alert">
        <h1 id="mello-order-detail-title">{{ t('accountDetail.errorTitle') }}</h1>
        <p>{{ t('accountDetail.error') }}</p>
        <button type="button" @click="loadOrder">{{ t('account.tryAgain') }}</button>
      </section>

      <template v-else>
        <header class="mello-order-detail__header">
          <div>
            <span>{{ t('account.order') }}</span>
            <h1 id="mello-order-detail-title">{{ orderTitle }}</h1>
          </div>
          <strong>{{ order.statusLabel }}</strong>
        </header>

        <div class="mello-order-detail__summary" aria-label="Order summary">
          <div>
            <span>{{ t('accountDetail.total') }}</span>
            <strong>{{ formatMoney(order.total, order.currency) }}</strong>
          </div>
          <div>
            <span>{{ t('accountDetail.date') }}</span>
            <strong>{{ formatDate(order.placedAt) }}</strong>
          </div>
          <div>
            <span>{{ t('accountDetail.promotion') }}</span>
            <strong>{{ hasPromotion ? (order.promotion.label || order.promotion.code) : t('accountDetail.noPromotion') }}</strong>
          </div>
          <div>
            <span>{{ t('accountDetail.coupon') }}</span>
            <strong>{{ hasCoupon ? order.coupon.code : t('accountDetail.noCoupon') }}</strong>
          </div>
        </div>

        <section class="mello-order-detail__section">
          <h2>{{ t('accountDetail.items') }}</h2>
          <div class="mello-order-detail__items">
            <div v-for="item in order.items" :key="`${order.id}-${item.name}`" class="mello-order-detail__item">
              <img :src="item.image || '/assets/frasco.png'" alt="" loading="lazy">
              <div>
                <p>{{ item.name }}</p>
                <span>x{{ item.quantity }}</span>
              </div>
              <strong>{{ formatMoney(item.total, order.currency) }}</strong>
            </div>
          </div>
        </section>

        <section class="mello-order-detail__grid">
          <div class="mello-order-detail__panel">
            <h2>{{ t('accountDetail.payment') }}</h2>
            <dl>
              <div>
                <dt>{{ t('accountDetail.subtotal') }}</dt>
                <dd>{{ order.subtotal ? formatMoney(order.subtotal, order.currency) : formatMoney(order.total, order.currency) }}</dd>
              </div>
              <div>
                <dt>{{ t('accountDetail.discount') }}</dt>
                <dd>{{ hasDiscount ? `-${formatMoney(order.discountTotal, order.currency)}` : formatMoney(0, order.currency) }}</dd>
              </div>
              <div>
                <dt>{{ t('accountDetail.shipping') }}</dt>
                <dd>{{ formatMoney(order.shippingTotal, order.currency) }}</dd>
              </div>
              <div>
                <dt>{{ t('accountDetail.paid') }}</dt>
                <dd>{{ formatMoney(order.total, order.currency) }}</dd>
              </div>
            </dl>
          </div>

          <div class="mello-order-detail__panel">
            <h2>{{ t('accountDetail.benefits') }}</h2>
            <dl>
              <div>
                <dt>{{ t('accountDetail.promotion') }}</dt>
                <dd>{{ getPromotionText(order.promotion) }}</dd>
              </div>
              <div>
                <dt>{{ t('accountDetail.coupon') }}</dt>
                <dd>{{ hasCoupon ? order.coupon.code : t('accountDetail.noCoupon') }}</dd>
              </div>
              <div>
                <dt>{{ t('accountDetail.couponDiscount') }}</dt>
                <dd>{{ hasCoupon ? formatMoney(order.coupon.discount, order.currency) : formatMoney(0, order.currency) }}</dd>
              </div>
            </dl>
          </div>
        </section>

        <section class="mello-order-detail__tracking" :class="{ 'is-ready': order.tracking }">
          <div>
            <span>{{ t('accountDetail.tracking') }}</span>
            <h2>{{ order.tracking ? order.tracking.code : t('accountDetail.trackingPendingTitle') }}</h2>
            <p>{{ order.tracking ? t('accountDetail.trackingReadyText') : t('account.trackingPending') }}</p>
          </div>
          <a v-if="order.tracking?.url" :href="order.tracking.url" target="_blank" rel="noopener">
            {{ t('tracking.result.openCarrier') }}
          </a>
        </section>
      </template>
    </article>
  </section>
</template>

<style>
.mello-order-detail {
  background:
    radial-gradient(circle at 12% 10%, rgba(119, 205, 250, 0.18), transparent 30%),
    linear-gradient(180deg, #f7fcff 0%, #f7fbfa 48%, #fffaf1 100%);
  color: #102829;
  font-family: var(--font-body-family);
  min-height: calc(100vh - 78px);
  min-height: calc(100svh - 78px);
  padding: clamp(24px, 4vw, 48px) 20px clamp(42px, 6vw, 72px);
}

.mello-order-detail * {
  box-sizing: border-box;
  letter-spacing: 0;
}

.mello-order-detail__card {
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 18px 54px rgba(23, 49, 50, 0.08);
  display: grid;
  gap: 24px;
  margin: 0 auto;
  max-width: 1040px;
  min-height: min(520px, calc(100svh - 150px));
  padding: clamp(22px, 3.4vw, 40px);
}

.mello-order-detail__back,
.mello-order-detail__state button,
.mello-order-detail__tracking a {
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
  justify-self: start;
  min-height: 44px;
  padding: 0 18px;
  text-decoration: none;
  transition: background 180ms ease, box-shadow 180ms ease, transform 180ms ease;
}

.mello-order-detail__back {
  background: #eff9ff;
  color: #173132;
}

.mello-order-detail__back:hover,
.mello-order-detail__back:focus-visible,
.mello-order-detail__state button:hover,
.mello-order-detail__state button:focus-visible,
.mello-order-detail__tracking a:hover,
.mello-order-detail__tracking a:focus-visible {
  background: #102829;
  box-shadow: 0 16px 36px rgba(23, 49, 50, 0.16);
  color: #ffffff;
  outline: 0;
  transform: translateY(-1px);
}

.mello-order-detail__header {
  align-items: flex-start;
  display: flex;
  gap: 20px;
  justify-content: space-between;
}

.mello-order-detail__header span,
.mello-order-detail__summary span,
.mello-order-detail__tracking span {
  color: #5f7073;
  display: block;
  font-size: 12px;
  font-weight: 900;
  line-height: 1.2;
  text-transform: uppercase;
}

.mello-order-detail__header h1 {
  color: #102829;
  font-size: clamp(32px, 4vw, 52px);
  font-weight: 950;
  letter-spacing: -0.03em;
  line-height: 1;
  margin: 4px 0 0;
}

.mello-order-detail__header > strong {
  background: #e7fbf6;
  border-radius: 999px;
  color: #0c6757;
  flex: 0 0 auto;
  font-size: 14px;
  font-weight: 900;
  padding: 12px 16px;
}

.mello-order-detail__summary,
.mello-order-detail__grid {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.mello-order-detail__summary div,
.mello-order-detail__panel,
.mello-order-detail__tracking {
  background: #f7fbfb;
  border-radius: 14px;
  padding: 18px;
}

.mello-order-detail__summary strong {
  display: block;
  font-size: 18px;
  font-weight: 920;
  line-height: 1.2;
  margin-top: 8px;
  overflow-wrap: anywhere;
}

.mello-order-detail__section,
.mello-order-detail__panel {
  display: grid;
  gap: 14px;
}

.mello-order-detail__section h2,
.mello-order-detail__panel h2,
.mello-order-detail__tracking h2 {
  color: #102829;
  font-size: 22px;
  font-weight: 930;
  letter-spacing: -0.02em;
  line-height: 1.1;
  margin: 0;
}

.mello-order-detail__items {
  display: grid;
  gap: 10px;
}

.mello-order-detail__item {
  align-items: center;
  background: #f6fbfb;
  border-radius: 12px;
  display: grid;
  gap: 12px;
  grid-template-columns: 58px minmax(0, 1fr) auto;
  padding: 12px;
}

.mello-order-detail__item img {
  height: 58px;
  object-fit: contain;
  width: 58px;
}

.mello-order-detail__item p {
  font-size: 15px;
  font-weight: 850;
  line-height: 1.2;
  margin: 0;
}

.mello-order-detail__item span {
  color: #5f7073;
  display: block;
  font-size: 14px;
  font-weight: 850;
  margin-top: 4px;
}

.mello-order-detail__item strong {
  font-size: 16px;
  font-weight: 900;
  text-align: right;
}

.mello-order-detail__grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.mello-order-detail__panel dl {
  display: grid;
  gap: 10px;
  margin: 0;
}

.mello-order-detail__panel dl div {
  align-items: baseline;
  display: flex;
  gap: 14px;
  justify-content: space-between;
}

.mello-order-detail__panel dt {
  color: #5f7073;
  font-size: 14px;
  font-weight: 760;
}

.mello-order-detail__panel dd {
  font-size: 15px;
  font-weight: 900;
  margin: 0;
  overflow-wrap: anywhere;
  text-align: right;
}

.mello-order-detail__tracking {
  align-items: center;
  background: #fff8eb;
  display: flex;
  gap: 18px;
  justify-content: space-between;
}

.mello-order-detail__tracking.is-ready {
  background: #e7fbf6;
}

.mello-order-detail__tracking h2 {
  margin-top: 6px;
  overflow-wrap: anywhere;
}

.mello-order-detail__tracking p {
  color: #53686b;
  font-size: 15px;
  font-weight: 650;
  line-height: 1.4;
  margin: 8px 0 0;
}

.mello-order-detail__state {
  align-content: center;
  display: grid;
  justify-items: center;
  min-height: 360px;
  padding: clamp(24px, 4vw, 46px) 18px;
  text-align: center;
}

.mello-order-detail__state h1 {
  color: #102829;
  font-size: clamp(28px, 4vw, 42px);
  font-weight: 930;
  letter-spacing: -0.02em;
  line-height: 1.1;
  margin: 0;
}

.mello-order-detail__state p {
  color: #53686b;
  font-size: 16px;
  font-weight: 580;
  line-height: 1.5;
  margin: 12px auto 0;
  max-width: 45ch;
}

.mello-order-detail__state button {
  margin-top: 22px;
}

.mello-order-detail__state.is-error h1 {
  color: #8e1c3a;
}

.mello-order-detail__spinner {
  animation: mello-order-detail-spin 850ms linear infinite;
  border: 3px solid rgba(23, 49, 50, 0.14);
  border-radius: 50%;
  border-top-color: #77cdfa;
  height: 32px;
  margin-bottom: 18px;
  width: 32px;
}

@keyframes mello-order-detail-spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 820px) {
  .mello-order-detail {
    min-height: calc(100svh - 74px);
    padding: 16px 12px 44px;
  }

  .mello-order-detail__card {
    gap: 18px;
    min-height: 0;
    padding: 22px 18px;
  }

  .mello-order-detail__header,
  .mello-order-detail__tracking {
    display: grid;
  }

  .mello-order-detail__summary,
  .mello-order-detail__grid {
    grid-template-columns: 1fr;
  }

  .mello-order-detail__item {
    grid-template-columns: 48px minmax(0, 1fr);
  }

  .mello-order-detail__item img {
    height: 48px;
    width: 48px;
  }

  .mello-order-detail__item strong {
    grid-column: 2;
    text-align: left;
  }

  .mello-order-detail__tracking a {
    justify-self: start;
  }
}
</style>
