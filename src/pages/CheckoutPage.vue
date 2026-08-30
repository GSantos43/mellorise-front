<script setup>
import { computed, onUnmounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { setLocale, supportedLocales } from '../i18n'
import { formatMoney } from '../services/products'

const props = defineProps({
  item: { type: Object, default: null },
  discount: { type: Object, default: null },
  isCheckoutLoading: { type: Boolean, default: false }
})

const emit = defineEmits(['checkout', 'update-quantity', 'remove'])
const { t, locale } = useI18n({ useScope: 'global' })

const customerEmail = ref(props.discount?.email || '')
const couponCode = ref(props.discount?.code || '')
const selectedPayment = ref('stripe')
const confettiPieces = ref([])
let confettiTimer = 0

const localeOptions = computed(() => supportedLocales.map((value) => ({
  value,
  flag: value === 'en' ? '/assets/flag-us.svg' : '/assets/flag-es.svg',
  label: t(`language.${value}`)
})))

const quantity = computed(() => Math.max(0, Number(props.item?.quantity || 0)))
const subtotal = computed(() => Number(props.item?.price || 0) * quantity.value)
const unitPrice = computed(() => Number(props.item?.unitPrice || props.item?.price || 0))
const bonusBottleCount = computed(() => {
  if (quantity.value >= 3) return 2
  if (quantity.value === 2) return 1
  return 0
})
const deliveredBottleCount = computed(() => quantity.value + bonusBottleCount.value)
const hasBundlePromotion = computed(() => bonusBottleCount.value > 0)
const activePromotion = computed(() => {
  if (quantity.value >= 3) {
    return {
      title: 'checkout.promo.buyThreeTitle',
      text: 'checkout.promo.buyThreeText'
    }
  }

  if (quantity.value === 2) {
    return {
      title: 'checkout.promo.buyTwoTitle',
      text: 'checkout.promo.buyTwoText'
    }
  }

  return null
})
const checkoutUpsell = computed(() => {
  if (quantity.value === 1) {
    return {
      quantity: 2,
      badge: 'checkout.upsell.buyTwoBadge',
      title: 'checkout.upsell.buyTwoTitle',
      text: 'checkout.upsell.buyTwoText',
      action: 'checkout.upsell.buyTwoAction'
    }
  }

  if (quantity.value === 2) {
    return {
      quantity: 3,
      badge: 'checkout.upsell.buyThreeBadge',
      title: 'checkout.upsell.buyThreeTitle',
      text: 'checkout.upsell.buyThreeText',
      action: 'checkout.upsell.buyThreeAction'
    }
  }

  return null
})
const discountPercent = computed(() => Math.max(0, Number(props.discount?.amount || 0)))
const normalizedCoupon = computed(() => couponCode.value.trim().toUpperCase())
const hasSavedDiscount = computed(() => Boolean(props.discount?.code && normalizedCoupon.value === props.discount.code))
const discountTotal = computed(() => props.item && hasSavedDiscount.value ? subtotal.value * (discountPercent.value / 100) : 0)
const total = computed(() => Math.max(0, subtotal.value - discountTotal.value))
const totalSavings = computed(() => discountTotal.value)
const canSubmit = computed(() => Boolean(props.item && customerEmail.value.trim() && !props.isCheckoutLoading))

watch(
  () => props.discount,
  (discount) => {
    if (!discount?.code) return
    customerEmail.value = discount.email || customerEmail.value
    couponCode.value = discount.code
  },
  { immediate: true }
)

function submitCheckout() {
  if (!canSubmit.value) return

  emit('checkout', {
    customerEmail: customerEmail.value.trim(),
    couponCode: normalizedCoupon.value || undefined,
  })
}

function changeLocale(value) {
  setLocale(value)
}

function setCheckoutQuantity(nextQuantity) {
  emit('update-quantity', Math.max(1, Number(nextQuantity || 1)))
}

function activateCheckoutUpsell() {
  if (!checkoutUpsell.value) return

  setCheckoutQuantity(checkoutUpsell.value.quantity)
  launchOfferConfetti()
}

function launchOfferConfetti() {
  if (typeof window === 'undefined') return

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    confettiPieces.value = []
    return
  }

  const colors = ['#31d6b0', '#77cdfa', '#fabd00', '#ff7733', '#173132']
  const timestamp = Date.now()
  confettiPieces.value = Array.from({ length: 34 }, (_, index) => ({
    id: `${timestamp}-${index}`,
    color: colors[index % colors.length],
    left: `${12 + Math.random() * 76}%`,
    drift: `${(Math.random() - 0.5) * 260}px`,
    rotation: `${Math.random() * 720 - 360}deg`,
    delay: `${Math.random() * 120}ms`,
    duration: `${780 + Math.random() * 520}ms`
  }))

  if (confettiTimer) {
    window.clearTimeout(confettiTimer)
  }

  confettiTimer = window.setTimeout(() => {
    confettiPieces.value = []
  }, 1450)
}

onUnmounted(() => {
  if (confettiTimer) {
    window.clearTimeout(confettiTimer)
  }
})
</script>

<template>
  <section class="mello-checkout" aria-labelledby="mello-checkout-title">
    <div v-if="confettiPieces.length" class="mello-checkout-confetti" aria-hidden="true">
      <span
        v-for="piece in confettiPieces"
        :key="piece.id"
        :style="{
          '--confetti-left': piece.left,
          '--confetti-drift': piece.drift,
          '--confetti-rotation': piece.rotation,
          '--confetti-delay': piece.delay,
          '--confetti-duration': piece.duration,
          '--confetti-color': piece.color
        }"
      ></span>
    </div>

    <header class="mello-checkout-top">
      <div class="mello-checkout-top__inner">
        <div class="mello-checkout-top__main">
          <a class="mello-checkout-top__back" href="/products/wondernest-heightener-gummies-2026" :aria-label="t('checkout.back')">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>
          </a>
          <a class="mello-checkout-top__logo" href="/" aria-label="MelloRise">
            <img src="/assets/logo-oficial.png" alt="MelloRise" width="1268" height="500" loading="eager">
          </a>
        </div>

        <div class="mello-page-header__locale mello-checkout-locale" :aria-label="t('language.label')" role="group">
          <span class="mello-page-header__locale-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z"/><path d="M3.6 9h16.8"/><path d="M3.6 15h16.8"/><path d="M12 3c2.2 2.5 3.3 5.5 3.3 9s-1.1 6.5-3.3 9c-2.2-2.5-3.3-5.5-3.3-9S9.8 5.5 12 3Z"/></svg>
          </span>
          <button
            v-for="option in localeOptions"
            :key="option.value"
            class="mello-page-header__locale-option"
            :class="{ 'is-active': locale === option.value }"
            type="button"
            :aria-pressed="locale === option.value"
            @click="changeLocale(option.value)"
          >
            <img class="mello-page-header__locale-flag" :src="option.flag" alt="" width="18" height="18" loading="eager">
            <span>{{ option.label }}</span>
          </button>
        </div>
      </div>
    </header>

    <div v-if="!item" class="mello-checkout-empty">
      <img src="/assets/frasco.png" alt="" width="220" height="220" loading="eager">
      <h2>{{ t('checkout.empty.title') }}</h2>
      <p>{{ t('checkout.empty.text') }}</p>
      <a href="/products/wondernest-heightener-gummies-2026">{{ t('checkout.empty.action') }}</a>
    </div>

    <form v-else class="mello-checkout-body" @submit.prevent="submitCheckout">
      <main class="mello-checkout-flow">
        <section class="mello-checkout-heading">
          <h1 id="mello-checkout-title">{{ t('checkout.title') }}</h1>
        </section>

        <section class="mello-checkout-product" :aria-label="t('checkout.product.label')">
          <img :src="item.image" :alt="item.title" width="76" height="76" loading="eager">
          <div>
            <span>{{ t('checkout.product.badge') }}</span>
            <h2>{{ item.title }}</h2>
            <p>{{ item.bundleLabel }}</p>
          </div>
          <strong>{{ formatMoney(subtotal) }}</strong>
        </section>

        <section class="mello-checkout-section" aria-labelledby="checkout-quantity">
          <div class="mello-checkout-section__head">
            <h2 id="checkout-quantity">{{ t('checkout.quantity.title') }}</h2>
            <span>{{ t('checkout.quantity.unitPrice', { price: formatMoney(unitPrice) }) }}</span>
          </div>

          <div class="mello-checkout-quantity-row">
            <div>
              <strong>{{ t('checkout.quantity.current', { count: quantity }) }}</strong>
              <small>{{ t('checkout.quantity.help') }}</small>
            </div>
            <div class="mello-checkout-quantity-control" :aria-label="t('checkout.quantity.title')">
              <button type="button" :aria-label="t('checkout.quantity.decrease')" @click="setCheckoutQuantity(quantity - 1)">-</button>
              <output>{{ quantity }}</output>
              <button type="button" :aria-label="t('checkout.quantity.increase')" @click="setCheckoutQuantity(quantity + 1)">+</button>
            </div>
          </div>

          <article v-if="activePromotion" class="mello-checkout-promo-active">
            <span>{{ t('checkout.promo.activeBadge') }}</span>
            <h3>{{ t(activePromotion.title) }}</h3>
            <p>{{ t(activePromotion.text, { paid: quantity, free: bonusBottleCount, total: deliveredBottleCount }) }}</p>
          </article>

          <article v-if="checkoutUpsell" class="mello-checkout-upsell">
            <div>
              <span>{{ t(checkoutUpsell.badge) }}</span>
              <h3>{{ t(checkoutUpsell.title) }}</h3>
              <p>{{ t(checkoutUpsell.text) }}</p>
            </div>
            <button type="button" @click="activateCheckoutUpsell">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M13.5 4.5c1.7-.9 3.5-1.3 5.4-1.2.1 1.9-.3 3.7-1.2 5.4a14.5 14.5 0 0 1-4.4 5.2l-3.2-3.2a14.5 14.5 0 0 1 3.4-6.2Z"/>
                <path d="m10.1 10.7-4.4.8-1.4 3.4 4.5-.6"/>
                <path d="m13.3 13.9-.6 4.5 3.4-1.4.8-4.4"/>
                <path d="M8.6 15.4 7 17"/>
                <path d="M15.6 6.8h.01"/>
              </svg>
              <span>{{ t(checkoutUpsell.action) }}</span>
            </button>
          </article>
        </section>

        <section class="mello-checkout-section" aria-labelledby="checkout-payment">
          <div class="mello-checkout-section__head">
            <h2 id="checkout-payment">{{ t('checkout.payment.title') }}</h2>
            <span>{{ t('checkout.payment.secure') }}</span>
          </div>

          <label class="mello-checkout-radio mello-checkout-radio--payment is-selected">
            <input v-model="selectedPayment" type="radio" value="stripe">
            <span class="mello-checkout-radio__control"></span>
            <span class="mello-checkout-payment-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24"><path d="M5 8h14v8H5z"/><path d="M5 11h14"/><path d="M8 15h3"/></svg>
            </span>
            <span class="mello-checkout-radio__content">
              <strong>{{ t('checkout.payment.stripe') }}</strong>
              <small>{{ t('checkout.payment.stripeText') }}</small>
            </span>
          </label>
        </section>

        <section class="mello-checkout-section" aria-labelledby="checkout-billing">
          <div class="mello-checkout-section__head">
            <h2 id="checkout-billing">{{ t('checkout.billing.title') }}</h2>
          </div>
          <label class="mello-checkout-field">
            <span>{{ t('checkout.contact.email') }}</span>
            <input v-model="customerEmail" type="email" autocomplete="email" :placeholder="t('checkout.contact.emailPlaceholder')" required>
          </label>
          <p class="mello-checkout-help">{{ t('checkout.contact.help') }}</p>
        </section>

        <section class="mello-checkout-section" aria-labelledby="checkout-coupon">
          <div class="mello-checkout-coupon-line">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9V6h16v3a3 3 0 0 0 0 6v3H4v-3a3 3 0 0 0 0-6Z"/><path d="M9 9h.01M15 15h.01M15 9l-6 6"/></svg>
            <h2 id="checkout-coupon">{{ t('checkout.coupon.title') }}</h2>
          </div>
          <label class="mello-checkout-field mello-checkout-field--coupon">
            <span>{{ t('checkout.coupon.label') }}</span>
            <input v-model="couponCode" type="text" autocomplete="off" :placeholder="t('checkout.coupon.placeholder')">
          </label>
          <p v-if="hasSavedDiscount" class="mello-checkout-coupon-applied">{{ t('checkout.coupon.applied', { percent: discountPercent }) }}</p>
          <p v-else class="mello-checkout-help">{{ t('checkout.coupon.help') }}</p>
        </section>
      </main>

      <aside class="mello-checkout-summary" :aria-label="t('checkout.summary.title')">
        <div class="mello-checkout-summary__inner">
          <h2>{{ t('checkout.summary.title') }}</h2>

          <dl class="mello-checkout-totals">
            <div>
              <dt>{{ t('checkout.summary.product') }}</dt>
              <dd>{{ formatMoney(subtotal) }}</dd>
            </div>
            <div v-if="hasBundlePromotion">
              <dt>{{ t('checkout.summary.freeBonus') }}</dt>
              <dd class="is-saving">{{ t('checkout.summary.freeBonusValue', { count: bonusBottleCount }) }}</dd>
            </div>
            <div v-if="hasBundlePromotion">
              <dt>{{ t('checkout.summary.delivered') }}</dt>
              <dd>{{ t('checkout.summary.deliveredValue', { count: deliveredBottleCount }) }}</dd>
            </div>
            <div v-if="discountTotal">
              <dt>{{ t('checkout.summary.productDiscount') }}</dt>
              <dd class="is-saving">-{{ formatMoney(discountTotal) }}</dd>
            </div>
          </dl>

          <div class="mello-checkout-total">
            <span>{{ t('checkout.summary.total') }}</span>
            <strong>{{ formatMoney(total) }}</strong>
          </div>

          <p v-if="totalSavings" class="mello-checkout-savings">{{ t('checkout.summary.saved', { amount: formatMoney(totalSavings) }) }}</p>

          <button class="mello-checkout-submit" type="submit" :disabled="!canSubmit">
            {{ isCheckoutLoading ? t('checkout.summary.loading') : t('checkout.summary.pay') }}
          </button>
        </div>
      </aside>

    </form>
  </section>
</template>

<style>
.mello-checkout {
  --checkout-blue: #3483fa;
  --checkout-green: #00a650;
  --checkout-ink: #1d1d1f;
  --checkout-muted: #666f78;
  --checkout-line: #e7e7e7;
  background: #f5f5f5;
  color: var(--checkout-ink);
  font-family: var(--font-body-family);
  min-height: 100vh;
  padding-bottom: 42px;
}

.mello-checkout * { box-sizing: border-box; letter-spacing: 0; }

.mello-checkout-confetti {
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  position: fixed;
  z-index: 80;
}

.mello-checkout-confetti span {
  animation: melloCheckoutConfetti var(--confetti-duration) cubic-bezier(0.16, 1, 0.3, 1) var(--confetti-delay) forwards;
  background: var(--confetti-color);
  border-radius: 2px;
  height: 12px;
  left: var(--confetti-left);
  opacity: 0;
  position: absolute;
  top: 18vh;
  transform: translate3d(0, -18px, 0) rotate(0deg);
  width: 7px;
}

.mello-checkout-top {
  align-items: center;
  background: rgba(255, 255, 255, 0.98);
  border-bottom: 1px solid rgba(9, 31, 32, 0.08);
  box-shadow: 0 12px 34px rgba(23, 49, 50, 0.07);
  display: flex;
  min-height: 82px;
  position: sticky;
  top: 0;
  z-index: 45;
}

.mello-checkout-top__inner {
  align-items: center;
  display: flex;
  gap: 18px;
  justify-content: space-between;
  margin: 0 auto;
  padding: 0 20px;
  width: min(1180px, 100%);
}

.mello-checkout-top__main {
  align-items: center;
  display: flex;
  gap: 14px;
  min-width: 0;
}

.mello-checkout-top__back {
  align-items: center;
  border: 1px solid rgba(23, 49, 50, 0.12);
  border-radius: 50%;
  color: #173132;
  display: inline-flex;
  height: 44px;
  justify-content: center;
  text-decoration: none;
  width: 44px;
}

.mello-checkout-top__back:hover {
  background: rgba(239, 249, 255, 0.95);
}

.mello-checkout-top__back svg {
  fill: none;
  height: 30px;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.8;
  width: 30px;
}

.mello-checkout-top__logo {
  align-items: center;
  display: inline-flex;
  flex: 0 0 auto;
  height: 44px;
  text-decoration: none;
}

.mello-checkout-top__logo img {
  display: block;
  height: 31px;
  object-fit: contain;
  width: auto;
}

.mello-checkout-locale {
  box-shadow: 0 10px 24px rgba(23, 49, 50, 0.06);
}

.mello-checkout-body {
  display: grid;
  gap: 24px;
  grid-template-columns: minmax(0, 1fr) 380px;
  margin: 0 auto;
  padding: 24px 0;
  width: min(1180px, calc(100% - 40px));
}

.mello-checkout-flow,
.mello-checkout-summary__inner,
.mello-checkout-empty {
  background: #ffffff;
  border-radius: 2px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
}

.mello-checkout-flow { overflow: hidden; }

.mello-checkout-heading {
  background: #ffffff;
  border-bottom: 1px solid var(--checkout-line);
  padding: 26px 24px 20px;
}

.mello-checkout-heading h1 {
  color: rgba(0, 0, 0, 0.72);
  font-family: "Inter", var(--font-body-family), system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.14em;
  line-height: 1.2;
  margin: 0;
  text-transform: uppercase;
}

.mello-checkout-product,
.mello-checkout-section {
  background: #ffffff;
  border-bottom: 1px solid var(--checkout-line);
  padding: 22px 24px;
}

.mello-checkout-product {
  align-items: center;
  display: grid;
  gap: 16px;
  grid-template-columns: 76px minmax(0, 1fr) auto;
}

.mello-checkout-product img {
  border: 1px solid #eeeeee;
  border-radius: 4px;
  height: 76px;
  object-fit: cover;
  width: 76px;
}

.mello-checkout-product span {
  background: #ff7733;
  border-radius: 4px;
  color: #ffffff;
  display: inline-flex;
  font-size: 12px;
  font-weight: 850;
  margin-bottom: 5px;
  padding: 3px 6px;
  text-transform: uppercase;
}

.mello-checkout-product h2 {
  color: #2d3338;
  font-size: 18px;
  font-weight: 500;
  line-height: 1.25;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mello-checkout-product p {
  color: #737373;
  font-size: 14px;
  margin: 4px 0 0;
}

.mello-checkout-product strong {
  font-size: 17px;
  font-weight: 650;
  white-space: nowrap;
}

.mello-checkout-quantity-row {
  align-items: center;
  display: flex;
  gap: 18px;
  justify-content: space-between;
}

.mello-checkout-quantity-row > div:first-child {
  display: grid;
  gap: 4px;
}

.mello-checkout-quantity-row strong {
  color: #173132;
  font-size: 18px;
  font-weight: 750;
}

.mello-checkout-quantity-row small {
  color: var(--checkout-muted);
  font-size: 14px;
  line-height: 1.35;
}

.mello-checkout-quantity-control {
  align-items: center;
  border: 1px solid rgba(23, 49, 50, 0.16);
  border-radius: 999px;
  display: inline-grid;
  flex: 0 0 auto;
  grid-template-columns: 42px 42px 42px;
  min-height: 44px;
  overflow: hidden;
}

.mello-checkout-quantity-control button {
  align-items: center;
  appearance: none;
  background: #ffffff;
  border: 0;
  color: #173132;
  cursor: pointer;
  display: inline-flex;
  font: inherit;
  font-size: 23px;
  font-weight: 520;
  height: 44px;
  justify-content: center;
}

.mello-checkout-quantity-control button:hover,
.mello-checkout-quantity-control button:focus-visible {
  background: rgba(239, 249, 255, 0.95);
  outline: 0;
}

.mello-checkout-quantity-control output {
  align-items: center;
  border-left: 1px solid rgba(23, 49, 50, 0.12);
  border-right: 1px solid rgba(23, 49, 50, 0.12);
  color: #173132;
  display: inline-flex;
  font-size: 16px;
  font-weight: 850;
  height: 44px;
  justify-content: center;
}

.mello-checkout-promo-active {
  background: linear-gradient(135deg, #eff9f3 0%, #ffffff 62%);
  border: 1px solid rgba(0, 166, 80, 0.24);
  border-radius: 12px;
  margin-top: 18px;
  padding: 18px;
}

.mello-checkout-promo-active span {
  background: rgba(0, 166, 80, 0.12);
  border-radius: 999px;
  color: #006b35;
  display: inline-flex;
  font-size: 11px;
  font-weight: 850;
  line-height: 1;
  margin-bottom: 9px;
  padding: 7px 10px;
  text-transform: uppercase;
}

.mello-checkout-promo-active h3 {
  color: #173132;
  font-size: 20px;
  font-weight: 850;
  line-height: 1.15;
  margin: 0;
}

.mello-checkout-promo-active p {
  color: #425154;
  font-size: 14px;
  line-height: 1.45;
  margin: 7px 0 0;
  max-width: 62ch;
}

.mello-checkout-upsell {
  align-items: center;
  background: #f5f8f7;
  border: 1px solid rgba(10, 15, 15, 0.72);
  border-radius: 8px;
  color: #102829;
  display: grid;
  gap: 16px;
  grid-template-columns: minmax(0, 1fr) auto;
  margin-top: 18px;
  overflow: hidden;
  padding: 18px;
  position: relative;
}

.mello-checkout-upsell::before {
  background: linear-gradient(135deg, rgba(49, 214, 176, 0.16), rgba(119, 205, 250, 0));
  content: "";
  inset: 0;
  pointer-events: none;
  position: absolute;
}

.mello-checkout-upsell span {
  background: #77cdfa;
  border-radius: 999px;
  color: #0f2a2c;
  display: inline-flex;
  font-size: 11px;
  font-weight: 850;
  line-height: 1;
  margin-bottom: 9px;
  padding: 7px 10px;
  text-transform: uppercase;
}

.mello-checkout-upsell h3 {
  color: #102829;
  font-size: 20px;
  font-weight: 850;
  line-height: 1.15;
  margin: 0;
}

.mello-checkout-upsell p {
  color: rgba(16, 40, 41, 0.74);
  font-size: 14px;
  line-height: 1.4;
  margin: 6px 0 0;
  max-width: 54ch;
}

.mello-checkout-upsell button {
  align-items: center;
  appearance: none;
  background: #31d6b0;
  border: 0;
  border-radius: 999px;
  color: #062626;
  cursor: pointer;
  display: inline-flex;
  font: inherit;
  font-size: 14px;
  font-weight: 850;
  gap: 8px;
  justify-content: center;
  min-height: 44px;
  padding: 0 20px;
  position: relative;
  text-decoration: none;
  transition: background 160ms ease, box-shadow 160ms ease, transform 160ms ease;
  white-space: nowrap;
  z-index: 1;
}

.mello-checkout-upsell > div {
  position: relative;
  z-index: 1;
}

.mello-checkout-upsell button svg {
  fill: none;
  height: 18px;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 2;
  width: 18px;
}

.mello-checkout-upsell button span {
  background: transparent;
  border-radius: 0;
  color: inherit;
  display: inline;
  font-size: inherit;
  font-weight: inherit;
  line-height: inherit;
  margin: 0;
  padding: 0;
  text-transform: none;
}

.mello-checkout-upsell button:hover,
.mello-checkout-upsell button:focus-visible {
  background: #47e6c3;
  box-shadow: 0 14px 28px rgba(20, 155, 128, 0.24);
  outline: 0;
  transform: translateY(-1px);
}

.mello-checkout-upsell button:active {
  transform: translateY(0) scale(0.99);
}

.mello-checkout-section__head {
  align-items: center;
  display: flex;
  gap: 12px;
  justify-content: space-between;
  margin-bottom: 14px;
}

.mello-checkout-section h2,
.mello-checkout-section__head h2 {
  font-size: 22px;
  font-weight: 650;
  line-height: 1.2;
  margin: 0;
}

.mello-checkout-section__head span {
  color: var(--checkout-blue);
  font-size: 14px;
  font-weight: 650;
}

.mello-checkout-coupon-line svg,
.mello-checkout-payment-icon svg {
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.9;
}

.mello-checkout-radio__content strong,
.mello-checkout-radio__content small {
  display: block;
}

.mello-checkout-option-list { display: grid; gap: 2px; }

.mello-checkout-radio {
  align-items: center;
  cursor: pointer;
  display: grid;
  gap: 14px;
  grid-template-columns: 26px minmax(0, 1fr) auto;
  min-height: 54px;
  padding: 8px 0;
}

.mello-checkout-radio input {
  height: 1px;
  opacity: 0;
  position: absolute;
  width: 1px;
}

.mello-checkout-radio__control {
  border: 2px solid #d8d8d8;
  border-radius: 50%;
  display: block;
  height: 22px;
  position: relative;
  width: 22px;
}

.mello-checkout-radio.is-selected .mello-checkout-radio__control { border-color: var(--checkout-blue); }

.mello-checkout-radio.is-selected .mello-checkout-radio__control::after {
  background: var(--checkout-blue);
  border-radius: 50%;
  content: "";
  height: 10px;
  left: 4px;
  position: absolute;
  top: 4px;
  width: 10px;
}

.mello-checkout-radio__content strong {
  color: #263238;
  font-size: 16px;
  font-weight: 450;
}

.mello-checkout-radio.is-selected .mello-checkout-radio__content strong {
  color: var(--checkout-green);
  font-weight: 700;
}

.mello-checkout-radio__content small {
  color: #6d6d6d;
  font-size: 13px;
  margin-top: 3px;
}

.mello-checkout-radio b {
  color: var(--checkout-green);
  font-size: 15px;
  font-weight: 700;
  white-space: nowrap;
}

.mello-checkout-radio--payment {
  grid-template-columns: 26px 52px minmax(0, 1fr);
  min-height: 74px;
}

.mello-checkout-payment-icon {
  align-items: center;
  background: #ffffff;
  border: 1px solid #eeeeee;
  border-radius: 50%;
  color: var(--checkout-blue);
  display: inline-flex;
  height: 52px;
  justify-content: center;
  width: 52px;
}

.mello-checkout-payment-icon svg { height: 26px; width: 26px; }

.mello-checkout-field {
  display: grid;
  gap: 7px;
  margin-top: 12px;
}

.mello-checkout-field span {
  color: #333333;
  font-size: 13px;
  font-weight: 650;
}

.mello-checkout-field input {
  appearance: none;
  background: #ffffff;
  border: 1px solid #d8d8d8;
  border-radius: 6px;
  color: #1d1d1f;
  font: inherit;
  font-size: 16px;
  min-height: 44px;
  outline: 0;
  padding: 0 12px;
  width: 100%;
}

.mello-checkout-field input:focus {
  border-color: var(--checkout-blue);
  box-shadow: 0 0 0 2px rgba(52, 131, 250, 0.18);
}

.mello-checkout-coupon-line {
  align-items: center;
  color: var(--checkout-blue);
  display: flex;
  gap: 8px;
}

.mello-checkout-coupon-line svg { height: 22px; width: 22px; }

.mello-checkout-coupon-line h2 {
  color: var(--checkout-blue);
  font-size: 17px;
  font-weight: 650;
}

.mello-checkout-field--coupon { margin-top: 14px; }

.mello-checkout-coupon-applied,
.mello-checkout-help {
  font-size: 13px;
  font-weight: 650;
  line-height: 1.35;
  margin: 10px 0 0;
}

.mello-checkout-coupon-applied { color: var(--checkout-green); }
.mello-checkout-help { color: var(--checkout-muted); }

.mello-checkout-summary {
  position: sticky;
  top: 100px;
}

.mello-checkout-summary__inner { padding: 22px; }

.mello-checkout-summary h2 {
  border-bottom: 1px solid var(--checkout-line);
  font-size: 22px;
  font-weight: 650;
  margin: 0 0 14px;
  padding-bottom: 14px;
}

.mello-checkout-totals {
  display: grid;
  gap: 9px;
  margin: 0;
}

.mello-checkout-totals div,
.mello-checkout-total {
  align-items: baseline;
  display: flex;
  gap: 12px;
  justify-content: space-between;
}

.mello-checkout-totals dt,
.mello-checkout-totals dd {
  color: #333333;
  font-size: 15px;
  margin: 0;
}

.mello-checkout-totals dd {
  font-weight: 520;
  text-align: right;
}

.mello-checkout-totals .is-saving { color: var(--checkout-green); }

.mello-checkout-total {
  border-top: 1px solid var(--checkout-line);
  margin-top: 16px;
  padding-top: 16px;
}

.mello-checkout-total span {
  font-size: 22px;
  font-weight: 650;
}

.mello-checkout-total strong {
  font-size: 30px;
  font-weight: 520;
  line-height: 1;
}

.mello-checkout-savings {
  color: var(--checkout-green);
  font-size: 14px;
  font-weight: 650;
  margin: 12px 0 0;
  text-align: right;
}

.mello-checkout-submit,
.mello-checkout-empty a {
  align-items: center;
  appearance: none;
  background: var(--checkout-blue);
  border: 0;
  border-radius: 7px;
  color: #ffffff;
  cursor: pointer;
  display: inline-flex;
  font: inherit;
  font-size: 17px;
  font-weight: 650;
  justify-content: center;
  min-height: 56px;
  padding: 0 18px;
  text-decoration: none;
  width: 100%;
}

.mello-checkout-summary .mello-checkout-submit { margin-top: 22px; }
.mello-checkout-submit:disabled {
  background: #b9d5ff;
  color: rgba(255, 255, 255, 0.88);
  cursor: not-allowed;
  opacity: 1;
}
.mello-checkout-empty {
  align-items: center;
  display: flex;
  flex-direction: column;
  margin: 28px auto;
  max-width: 520px;
  padding: 34px 24px;
  text-align: center;
  width: min(100% - 32px, 520px);
}

.mello-checkout-empty img { height: 150px; object-fit: contain; width: 150px; }
.mello-checkout-empty h2 { font-size: 28px; margin: 14px 0 8px; }
.mello-checkout-empty p { color: var(--checkout-muted); font-size: 15px; line-height: 1.4; margin: 0 0 20px; }

@media (max-width: 900px) {
  .mello-checkout {
    padding-bottom: 28px;
  }

  .mello-checkout-top {
    min-height: 72px;
  }

  .mello-checkout-top__inner {
    gap: 10px;
    padding: 0 14px;
  }

  .mello-checkout-top__main {
    gap: 10px;
  }

  .mello-checkout-top__back {
    height: 40px;
    width: 40px;
  }

  .mello-checkout-top__logo img {
    height: 28px;
  }

  .mello-checkout-locale .mello-page-header__locale-icon {
    display: none;
  }

  .mello-checkout-body {
    display: block;
    padding: 0;
    width: 100%;
  }

  .mello-checkout-flow {
    border-radius: 0;
    box-shadow: none;
  }

  .mello-checkout-heading {
    padding: 22px 16px 16px;
  }

  .mello-checkout-product,
  .mello-checkout-section {
    padding: 18px 16px;
  }

  .mello-checkout-product {
    grid-template-columns: 64px minmax(0, 1fr);
  }

  .mello-checkout-product img {
    height: 64px;
    width: 64px;
  }

  .mello-checkout-product strong {
    display: none;
  }

  .mello-checkout-product h2 {
    font-size: 16px;
  }

  .mello-checkout-quantity-row {
    align-items: stretch;
    flex-direction: column;
  }

  .mello-checkout-quantity-control {
    grid-template-columns: 1fr 1fr 1fr;
    width: 100%;
  }

  .mello-checkout-upsell {
    grid-template-columns: 1fr;
  }

  .mello-checkout-upsell button {
    width: 100%;
  }

  .mello-checkout-summary {
    margin: 16px;
    position: static;
  }
}

@media (max-width: 520px) {
  .mello-checkout-section h2,
  .mello-checkout-section__head h2 { font-size: 21px; }
  .mello-checkout-radio { grid-template-columns: 26px minmax(0, 1fr) auto; }
  .mello-checkout-radio--payment { grid-template-columns: 26px 52px minmax(0, 1fr); }
}

@keyframes melloCheckoutConfetti {
  0% {
    opacity: 0;
    transform: translate3d(0, -18px, 0) rotate(0deg) scale(0.8);
  }

  12% {
    opacity: 1;
  }

  100% {
    opacity: 0;
    transform: translate3d(var(--confetti-drift), 76vh, 0) rotate(var(--confetti-rotation)) scale(1);
  }
}

@media (prefers-reduced-motion: reduce) {
  .mello-checkout-confetti {
    display: none;
  }

  .mello-checkout-upsell button {
    transition: background 160ms ease, box-shadow 160ms ease;
  }

  .mello-checkout-upsell button:hover,
  .mello-checkout-upsell button:focus-visible {
    transform: none;
  }
}
</style>
