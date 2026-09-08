<script setup>
import { computed, onUnmounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { formatMoney } from '../services/products'
import { translateProductTitle } from '../i18n/productText'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  item: {
    type: Object,
    default: null
  },
  discount: {
    type: Object,
    default: null
  },
  isCheckoutLoading: {
    type: Boolean,
    default: false
  },
  purchaseEligibility: {
    type: Object,
    default: () => ({
      allowed: true,
      countryCode: null,
      allowedCountries: ['US']
    })
  }
})

const emit = defineEmits(['close', 'update-quantity', 'remove', 'checkout'])
const { t, locale } = useI18n({ useScope: 'global' })

const quantity = computed(() => props.item?.quantity || 0)
const subtotal = computed(() => Number(props.item?.lineTotal ?? props.item?.bundleTotal ?? (Number(props.item?.price || 0) * quantity.value)))
const discountPercent = computed(() => Math.max(0, Number(props.discount?.amount || 0)))
const discountTotal = computed(() => props.item && props.discount?.code ? subtotal.value * (discountPercent.value / 100) : 0)
const isShippingProtectionEnabled = ref(true)
const standardShippingPrice = 3.99
const shippingProtectionPrice = 0
const hasBundleFreeShipping = computed(() => quantity.value > 1)
const shippingTotal = computed(() => props.item && !hasBundleFreeShipping.value ? standardShippingPrice : 0)
const shippingProtectionTotal = computed(() => props.item && isShippingProtectionEnabled.value ? shippingProtectionPrice : 0)
const checkoutTotal = computed(() => Math.max(0, subtotal.value - discountTotal.value) + shippingTotal.value + shippingProtectionTotal.value)
const itemCountLabel = computed(() => quantity.value === 1 ? t('cart.oneItem') : t('cart.manyItems', { count: quantity.value }))
const localizedItemTitle = computed(() => translateProductTitle(props.item?.title, locale.value))
const isPurchaseAllowed = computed(() => props.purchaseEligibility?.allowed !== false)
const checkoutDisabled = computed(() => !props.item || props.isCheckoutLoading || !isPurchaseAllowed.value)
const bundleValueLabel = computed(() => {
  if (quantity.value >= 3) return t('cart.bundleValue.buyThree')
  if (quantity.value === 2) return t('cart.bundleValue.buyTwo')
  return t('cart.bundleValue.buyOne')
})
const quickAnswerItems = ['shipping', 'bundle', 'security', 'support']
const cartUpsell = computed(() => {
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

function checkout() {
  if (checkoutDisabled.value) return

  emit('checkout', {
    shippingProtection: {
      enabled: isShippingProtectionEnabled.value
    }
  })
}

function activateCartUpsell() {
  if (!cartUpsell.value) return

  emit('update-quantity', cartUpsell.value.quantity)
}

watch(
  () => props.isOpen,
  (isOpen) => {
    document.documentElement.classList.toggle('mello-cart-lock', isOpen)
  },
  { immediate: true }
)

onUnmounted(() => {
  document.documentElement.classList.remove('mello-cart-lock')
})
</script>

<template>
  <Teleport to="body">
    <div class="mello-cart-drawer" :class="{ 'is-open': isOpen }" :aria-hidden="!isOpen">
      <button class="mello-cart-drawer__overlay" type="button" :aria-label="t('cart.close')" @click="emit('close')"></button>

      <aside class="mello-cart-drawer__panel" role="dialog" aria-modal="true" aria-labelledby="mello-cart-title">
        <header class="mello-cart-drawer__header">
          <h2 id="mello-cart-title">{{ t('cart.title') }} • {{ itemCountLabel }}</h2>
          <button class="mello-cart-drawer__close" type="button" :aria-label="t('cart.close')" @click="emit('close')">
            <span></span>
          </button>
        </header>

        <div class="mello-cart-drawer__notice">{{ t('cart.ready') }}</div>

        <div v-if="item" class="mello-cart-drawer__body">
          <article class="mello-cart-item">
            <a class="mello-cart-item__media" :href="`/products/${item.handle}`" @click="emit('close')">
              <img :src="item.image" :alt="localizedItemTitle" width="76" height="76" loading="eager">
            </a>

            <div class="mello-cart-item__details">
              <a class="mello-cart-item__title" :href="`/products/${item.handle}`" @click="emit('close')">{{ localizedItemTitle }}</a>
              <span class="mello-cart-item__price">{{ formatMoney(item.unitPrice || item.price) }}</span>
              <span class="mello-cart-item__variant">{{ item.bundleLabel }}</span>
              <span class="mello-cart-item__shipping" :class="{ 'is-locked': !hasBundleFreeShipping }">
                {{ hasBundleFreeShipping ? t('cart.freeShippingUnlocked') : t('cart.freeShippingPrompt') }}
              </span>

              <div class="mello-cart-item__actions">
                <div class="mello-cart-quantity" :aria-label="t('cart.quantity')">
                  <button type="button" :aria-label="t('cart.decrease')" @click="emit('update-quantity', Math.max(1, quantity - 1))">−</button>
                  <span>{{ quantity }}</span>
                  <button type="button" :disabled="quantity >= 3" :aria-label="t('cart.increase')" @click="emit('update-quantity', Math.min(3, quantity + 1))">+</button>
                </div>

                <button class="mello-cart-item__remove" type="button" :aria-label="t('cart.remove')" @click="emit('remove')">
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 15H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>
                </button>
              </div>
            </div>

            <strong class="mello-cart-item__total">{{ formatMoney(subtotal) }}</strong>
          </article>

          <article v-if="cartUpsell" class="mello-cart-upsell">
            <div class="mello-cart-upsell__copy">
              <span>{{ t(cartUpsell.badge) }}</span>
              <h3>{{ t(cartUpsell.title) }}</h3>
              <p>{{ t(cartUpsell.text) }}</p>
              <strong>{{ t('cart.upsellFreeShipping') }}</strong>
            </div>
            <button class="mello-cart-upsell__button" type="button" @click="activateCartUpsell">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 12h14" />
                <path d="M12 5v14" />
              </svg>
              <span>{{ t(cartUpsell.action) }}</span>
            </button>
          </article>

          <div class="mello-cart-bundle-proof" :class="{ 'is-unlocked': hasBundleFreeShipping }">
            <span aria-hidden="true">
              <svg viewBox="0 0 24 24"><path d="M5 12.5 9 16l10-10"/><path d="M3 7h13v10H3z"/><path d="M16 10h3l2 3v4h-5z"/><path d="M7 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/><path d="M18 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/></svg>
            </span>
            <div>
              <strong>{{ bundleValueLabel }}</strong>
              <small>{{ hasBundleFreeShipping ? t('cart.freeShippingStripe') : t('cart.freeShippingNudge') }}</small>
            </div>
          </div>
        </div>

        <div v-else class="mello-cart-drawer__empty">
          <p>{{ t('cart.empty') }}</p>
          <a href="/products/mellorise-heightener-gummies-2026" @click="emit('close')">{{ t('cart.viewProduct') }}</a>
        </div>

        <footer class="mello-cart-drawer__footer">
          <details class="mello-cart-note">
            <summary>
              <span>{{ t('cart.note') }}</span>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>
            </summary>
            <textarea rows="3" :placeholder="t('cart.notePlaceholder')"></textarea>
          </details>

          <div v-if="item" class="mello-shipping-protection">
            <img
              class="mello-shipping-protection__icon"
              src="/assets/shipping-protection.png"
              :alt="t('cart.shippingProtection.title')"
              width="62"
              height="62"
              loading="eager"
            >
            <div class="mello-shipping-protection__content">
              <div class="mello-shipping-protection__heading">
                <strong>{{ t('cart.shippingProtection.title') }}</strong>
                <span>{{ formatMoney(shippingProtectionPrice) }}</span>
              </div>
              <p>{{ t('cart.shippingProtection.text') }}</p>
            </div>
            <button
              class="mello-shipping-protection__toggle"
              type="button"
              :class="{ 'is-active': isShippingProtectionEnabled }"
              :aria-label="t('cart.shippingProtection.toggle')"
              :aria-pressed="isShippingProtectionEnabled"
              @click="isShippingProtectionEnabled = !isShippingProtectionEnabled"
            >
              <span></span>
            </button>
          </div>

          <p v-if="item && !isPurchaseAllowed" class="mello-cart-region-lock" role="status">
            {{ t('cart.regionLock') }}
          </p>

          <section v-if="item" class="mello-cart-answers" :aria-label="t('cart.quickAnswers.title')">
            <h3>{{ t('cart.quickAnswers.title') }}</h3>
            <ul>
              <li v-for="answer in quickAnswerItems" :key="answer">
                <span aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path d="m20 6-11 11-5-5" />
                  </svg>
                </span>
                <div>
                  <strong>{{ t(`cart.quickAnswers.${answer}.title`) }}</strong>
                  <small>{{ t(`cart.quickAnswers.${answer}.text`) }}</small>
                </div>
              </li>
            </ul>
          </section>

          <button class="mello-cart-checkout" type="button" :disabled="checkoutDisabled" @click="checkout">
            {{ isCheckoutLoading ? t('cart.checkoutLoading') : `${t('cart.checkout')} • ${formatMoney(checkoutTotal)}` }}
          </button>

          <div class="mello-cart-stripe" aria-hidden="true">
            <span>Payment with <strong>Stripe</strong></span>
          </div>
        </footer>
      </aside>
    </div>
  </Teleport>
</template>

<style>
.mello-cart-lock,
.mello-cart-lock body {
  overscroll-behavior: none;
  overflow: hidden;
}

.mello-cart-drawer {
  --mcart-ink: var(--mello-ink);
  --mcart-teal: #5f9690;
  --mcart-line: rgba(16, 40, 41, 0.12);
  --mcart-muted: var(--mello-muted);
  font-family: var(--font-body-family);
  inset: 0;
  opacity: 0;
  pointer-events: none;
  position: fixed;
  transition: opacity 180ms ease;
  z-index: 120;
}

.mello-cart-drawer.is-open {
  opacity: 1;
  pointer-events: auto;
}

.mello-cart-drawer * {
  box-sizing: border-box;
  letter-spacing: 0;
}

.mello-cart-drawer__overlay {
  appearance: none;
  backdrop-filter: blur(5px);
  background: rgba(7, 20, 21, 0.42);
  border: 0;
  cursor: pointer;
  inset: 0;
  margin: 0;
  padding: 0;
  position: absolute;
  touch-action: none;
}

.mello-cart-drawer__panel {
  background: #ffffff;
  color: var(--mcart-ink);
  display: grid;
  grid-template-rows: auto auto 1fr auto;
  height: 100%;
  max-width: 100%;
  overscroll-behavior: contain;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  position: absolute;
  right: 0;
  top: 0;
  touch-action: pan-y;
  transform: translateX(100%);
  transition: transform 220ms cubic-bezier(.22, 1, .36, 1);
  width: 400px;
}

.mello-cart-drawer.is-open .mello-cart-drawer__panel {
  transform: translateX(0);
}

.mello-cart-drawer__header {
  align-items: center;
  display: flex;
  gap: 18px;
  justify-content: space-between;
  min-height: 88px;
  padding: 18px 16px 17px;
}

.mello-cart-drawer__header h2 {
  color: #071415;
  font-family: var(--font-heading-family);
  font-size: 29px;
  font-weight: 740;
  line-height: 1.08;
  margin: 0;
}

.mello-cart-drawer__close {
  appearance: none;
  background: transparent;
  border: 0;
  color: #071415;
  cursor: pointer;
  display: grid;
  height: 42px;
  margin: 0 -2px 0 0;
  padding: 0;
  place-items: center;
  width: 42px;
}

.mello-cart-drawer__close span,
.mello-cart-drawer__close span::after {
  background: currentColor;
  content: "";
  display: block;
  height: 2px;
  width: 32px;
}

.mello-cart-drawer__close span {
  transform: rotate(45deg);
}

.mello-cart-drawer__close span::after {
  transform: rotate(90deg);
}

.mello-cart-drawer__notice {
  align-items: center;
  background: #050505;
  color: #ffffff;
  display: flex;
  font-size: 15px;
  font-weight: 720;
  justify-content: center;
  min-height: 48px;
  text-align: center;
}

.mello-cart-drawer__body {
  -webkit-overflow-scrolling: touch;
  min-height: 0;
  overscroll-behavior: contain;
  overflow: auto;
  padding: 16px 15px;
  touch-action: pan-y;
}

.mello-cart-item {
  display: grid;
  gap: 10px;
  grid-template-columns: 76px minmax(0, 1fr);
  position: relative;
}

.mello-cart-item__media {
  background: #fffaf0;
  border-radius: 4px;
  display: block;
  height: 76px;
  overflow: hidden;
  width: 76px;
}

.mello-cart-item__media img {
  display: block;
  height: 100%;
  object-fit: cover;
  width: 100%;
}

.mello-cart-item__details {
  min-width: 0;
  padding-right: 0;
}

.mello-cart-item__title {
  color: #071415;
  display: block;
  font-size: 18px;
  font-family: var(--font-heading-family);
  font-weight: 700;
  line-height: 1.04;
  max-width: 236px;
  text-decoration: none;
}

.mello-cart-item__price,
.mello-cart-item__variant,
.mello-cart-item__shipping {
  color: var(--mcart-muted);
  display: block;
  font-size: 12px;
  line-height: 1.35;
  margin-top: 6px;
}

.mello-cart-item__variant {
  margin-top: 2px;
}

.mello-cart-item__shipping {
  color: #007a3d;
  font-weight: 760;
  margin-top: 4px;
}

.mello-cart-item__shipping.is-locked {
  color: #775200;
}

.mello-cart-item__actions {
  align-items: center;
  display: flex;
  gap: 14px;
  margin-top: 10px;
}

.mello-cart-quantity {
  align-items: center;
  border: 1px solid rgba(7, 20, 21, 0.32);
  border-radius: 4px;
  display: inline-grid;
  grid-template-columns: 31px 33px 31px;
  height: 31px;
}

.mello-cart-quantity button {
  appearance: none;
  background: transparent;
  border: 0;
  color: #071415;
  cursor: pointer;
  font: inherit;
  font-size: 17px;
  height: 100%;
  line-height: 1;
  padding: 0;
}

.mello-cart-quantity span {
  color: #071415;
  font-size: 13px;
  font-weight: 700;
  text-align: center;
}

.mello-cart-item__remove {
  appearance: none;
  background: transparent;
  border: 0;
  color: #071415;
  cursor: pointer;
  display: inline-flex;
  padding: 3px;
}

.mello-cart-item__remove svg {
  fill: none;
  height: 15px;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.8;
  width: 15px;
}

.mello-cart-item__total {
  color: #071415;
  font-size: 18px;
  font-weight: 760;
  line-height: 1.1;
  position: absolute;
  right: 0;
  text-align: right;
  top: 131px;
  white-space: nowrap;
}

.mello-cart-upsell {
  background:
    radial-gradient(circle at 14% 0%, rgba(119, 205, 250, 0.18), transparent 36%),
    linear-gradient(135deg, #fbffff 0%, #eefcf9 58%, #f7fbff 100%);
  border: 1px solid rgba(27, 209, 189, 0.72);
  border-radius: 8px;
  box-shadow: 0 14px 30px rgba(18, 179, 161, 0.13);
  color: #102829;
  display: grid;
  gap: 13px;
  margin-top: 18px;
  overflow: hidden;
  padding: 14px;
  position: relative;
}

.mello-cart-upsell::before {
  background: linear-gradient(135deg, rgba(49, 214, 176, 0.11), rgba(119, 205, 250, 0) 56%);
  content: "";
  inset: 0;
  pointer-events: none;
  position: absolute;
}

.mello-cart-upsell::after {
  animation: melloCartUpsellShine 5.6s cubic-bezier(0.16, 1, 0.3, 1) infinite;
  background: linear-gradient(115deg, transparent 0%, rgba(255, 255, 255, 0) 34%, rgba(255, 255, 255, 0.78) 48%, rgba(119, 205, 250, 0.22) 54%, rgba(255, 255, 255, 0) 68%, transparent 100%);
  content: "";
  inset: -42% -34%;
  pointer-events: none;
  position: absolute;
  transform: translateX(-94%) rotate(2deg);
}

.mello-cart-upsell__copy,
.mello-cart-upsell__button {
  position: relative;
  z-index: 1;
}

.mello-cart-upsell__copy span {
  background: #77cdfa;
  border-radius: 999px;
  color: #0f2a2c;
  display: inline-flex;
  font-size: 10px;
  font-weight: 850;
  line-height: 1;
  margin-bottom: 8px;
  padding: 6px 9px;
  text-transform: uppercase;
}

.mello-cart-upsell h3 {
  color: #102829;
  font-family: var(--font-heading-family);
  font-size: 18px;
  font-weight: 760;
  line-height: 1.08;
  margin: 0;
}

.mello-cart-upsell p {
  color: rgba(16, 40, 41, 0.72);
  font-size: 13px;
  line-height: 1.38;
  margin: 6px 0 0;
}

.mello-cart-upsell__copy strong {
  color: #007a3d;
  display: block;
  font-size: 12px;
  font-weight: 820;
  line-height: 1.25;
  margin-top: 8px;
}

.mello-cart-upsell__button {
  align-items: center;
  appearance: none;
  background: #31d6b0;
  border: 0;
  border-radius: 999px;
  color: #062626;
  cursor: pointer;
  display: inline-flex;
  font: inherit;
  font-size: 13px;
  font-weight: 850;
  gap: 8px;
  justify-content: center;
  min-height: 42px;
  padding: 0 16px;
  text-align: center;
  transition: background 160ms ease, box-shadow 160ms ease, transform 160ms ease;
  width: 100%;
}

.mello-cart-upsell__button svg {
  fill: none;
  flex: 0 0 auto;
  height: 17px;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 2.2;
  width: 17px;
}

.mello-cart-upsell__button:hover,
.mello-cart-upsell__button:focus-visible {
  background: #47e6c3;
  box-shadow: 0 12px 24px rgba(20, 155, 128, 0.24), 0 0 0 4px rgba(49, 214, 176, 0.16);
  outline: 0;
  transform: translateY(-1px);
}

.mello-cart-upsell__button:active {
  transform: translateY(0) scale(0.99);
}

.mello-cart-bundle-proof {
  align-items: center;
  background: #fff8e8;
  border: 1px solid rgba(245, 166, 35, 0.32);
  border-radius: 8px;
  color: #102829;
  display: grid;
  gap: 11px;
  grid-template-columns: 38px minmax(0, 1fr);
  margin-top: 12px;
  padding: 12px;
}

.mello-cart-bundle-proof.is-unlocked {
  background: #effaf6;
  border-color: rgba(0, 122, 61, 0.18);
}

.mello-cart-bundle-proof > span {
  align-items: center;
  background: #ffffff;
  border-radius: 999px;
  color: #c47a00;
  display: inline-flex;
  height: 38px;
  justify-content: center;
  width: 38px;
}

.mello-cart-bundle-proof.is-unlocked > span {
  color: #007a3d;
}

.mello-cart-bundle-proof svg {
  fill: none;
  height: 22px;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.9;
  width: 22px;
}

.mello-cart-bundle-proof strong,
.mello-cart-bundle-proof small {
  display: block;
  min-width: 0;
}

.mello-cart-bundle-proof strong {
  color: #102829;
  font-size: 13px;
  font-weight: 820;
  line-height: 1.18;
}

.mello-cart-bundle-proof small {
  color: rgba(16, 40, 41, 0.68);
  font-size: 12px;
  font-weight: 560;
  line-height: 1.3;
  margin-top: 3px;
}

.mello-cart-drawer__empty {
  align-items: center;
  color: #071415;
  display: flex;
  flex-direction: column;
  gap: 16px;
  justify-content: center;
  min-height: 0;
  padding: 26px;
  text-align: center;
}

.mello-cart-drawer__empty p {
  font-size: 18px;
  font-weight: 680;
  margin: 0;
}

.mello-cart-drawer__empty a {
  color: var(--mcart-teal);
  font-weight: 720;
  text-decoration: none;
}

.mello-cart-drawer__footer {
  background: #ffffff;
  border-top: 1px solid var(--mcart-line);
  overscroll-behavior: contain;
  padding: 0 15px 18px;
  position: sticky;
  bottom: 0;
  z-index: 2;
  touch-action: pan-y;
}

.mello-cart-note {
  border-bottom: 1px solid var(--mcart-line);
}

.mello-cart-note summary {
  align-items: center;
  color: #1a2426;
  cursor: pointer;
  display: flex;
  font-size: 15.5px;
  font-weight: 400;
  justify-content: space-between;
  line-height: 1.2;
  list-style: none;
  min-height: 44px;
}

.mello-cart-note summary::-webkit-details-marker {
  display: none;
}

.mello-cart-note summary svg {
  fill: none;
  height: 15px;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.8;
  width: 15px;
}

.mello-cart-note[open] summary svg {
  transform: rotate(180deg);
}

.mello-cart-note textarea {
  border: 1px solid var(--mcart-line);
  border-radius: 4px;
  color: #071415;
  font: inherit;
  margin-bottom: 12px;
  padding: 10px;
  resize: vertical;
  width: 100%;
}

.mello-cart-subtotal {
  align-items: center;
  color: #071415;
  display: flex;
  font-size: 20px;
  font-weight: 720;
  justify-content: space-between;
  line-height: 1.1;
  padding: 17px 0 15px;
}

.mello-cart-subtotal strong {
  font-size: 20px;
  font-weight: 760;
}

.mello-shipping-protection {
  align-items: center;
  background: #f6fbfb;
  border: 1px solid rgba(16, 40, 41, 0.07);
  border-radius: 12px;
  display: grid;
  gap: 9px;
  grid-template-columns: 62px minmax(0, 1fr) 42px;
  margin: 16px -7px 12px;
  min-height: 83px;
  padding: 12px 8px;
}

.mello-shipping-protection__icon {
  display: block;
  height: 62px;
  object-fit: contain;
  width: 62px;
}

.mello-shipping-protection__content {
  min-width: 0;
}

.mello-shipping-protection__heading {
  align-items: baseline;
  color: #050505;
  display: flex;
  gap: 10px;
  justify-content: space-between;
  line-height: 1.08;
}

.mello-shipping-protection__heading strong,
.mello-shipping-protection__heading span {
  color: #050505;
  font-size: 16px;
  font-weight: 720;
  white-space: nowrap;
}

.mello-shipping-protection__heading strong {
  min-width: 0;
  overflow-wrap: anywhere;
  white-space: normal;
}

.mello-shipping-protection__content p {
  color: #667374;
  font-size: 13px;
  font-weight: 500;
  line-height: 1.18;
  margin: 4px 0 0;
}

.mello-shipping-protection__toggle {
  align-items: center;
  appearance: none;
  background: #e4e4e4;
  border: 0;
  border-radius: 999px;
  cursor: pointer;
  display: inline-flex;
  height: 28px;
  justify-content: flex-start;
  margin: 0;
  padding: 3px;
  transition: background 160ms ease;
  width: 44px;
}

.mello-shipping-protection__toggle span {
  background: #ffffff;
  border-radius: 999px;
  box-shadow: 0 1px 3px rgba(7, 20, 21, 0.2);
  display: block;
  height: 22px;
  transform: translateX(0);
  transition: transform 160ms ease;
  width: 22px;
}

.mello-shipping-protection__toggle.is-active {
  background: #2f8deb;
}

.mello-shipping-protection__toggle.is-active span {
  transform: translateX(16px);
}

.mello-cart-region-lock {
  background: #fff6df;
  border: 1px solid rgba(199, 133, 0, 0.22);
  border-radius: 6px;
  color: #755000;
  font-size: 12px;
  font-weight: 680;
  line-height: 1.35;
  margin: 0 0 10px;
  padding: 9px 11px;
}

.mello-cart-answers {
  border-top: 1px solid var(--mcart-line);
  margin: 0 0 12px;
  padding-top: 12px;
}

.mello-cart-answers h3 {
  color: #102829;
  font-size: 13px;
  font-weight: 850;
  letter-spacing: 0;
  line-height: 1.15;
  margin: 0 0 9px;
}

.mello-cart-answers ul {
  display: grid;
  gap: 7px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.mello-cart-answers li {
  align-items: flex-start;
  display: grid;
  gap: 8px;
  grid-template-columns: 22px minmax(0, 1fr);
}

.mello-cart-answers li > span {
  align-items: center;
  background: #e9fbf5;
  border-radius: 999px;
  color: #007a3d;
  display: inline-flex;
  height: 22px;
  justify-content: center;
  margin-top: 1px;
  width: 22px;
}

.mello-cart-answers svg {
  fill: none;
  height: 13px;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 2.3;
  width: 13px;
}

.mello-cart-answers strong,
.mello-cart-answers small {
  display: block;
  min-width: 0;
}

.mello-cart-answers strong {
  color: #102829;
  font-size: 12px;
  font-weight: 820;
  line-height: 1.18;
}

.mello-cart-answers small {
  color: rgba(16, 40, 41, 0.66);
  font-size: 11px;
  font-weight: 560;
  line-height: 1.28;
  margin-top: 2px;
}

.mello-cart-checkout {
  align-items: center;
  appearance: none;
  background: #006f12;
  border: 0;
  border-radius: 12px;
  color: #ffffff;
  cursor: pointer;
  display: inline-flex;
  font: inherit;
  font-size: 16px;
  font-weight: 720;
  justify-content: center;
  letter-spacing: 0;
  line-height: 1;
  min-height: 48px;
  padding: 0 20px;
  text-transform: none;
  width: 100%;
}

.mello-cart-checkout:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.mello-cart-stripe {
  align-items: center;
  display: flex;
  justify-content: center;
  min-height: 34px;
  padding-top: 10px;
}

.mello-cart-stripe span {
  color: rgba(23, 49, 50, 0.66);
  display: inline-flex;
  font-size: 13px;
  font-weight: 560;
  gap: 4px;
  line-height: 1.2;
}

.mello-cart-stripe strong {
  color: #635bff;
  font-weight: 850;
}

@keyframes melloCartUpsellShine {
  0%, 46% {
    transform: translateX(-94%) rotate(2deg);
  }

  72%, 100% {
    transform: translateX(94%) rotate(2deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .mello-cart-upsell::after {
    animation: none;
    display: none;
  }
}

@media (max-width: 520px) {
  .mello-cart-drawer__overlay {
    background: rgba(7, 20, 21, 0.28);
    backdrop-filter: blur(3px);
  }

  .mello-cart-drawer__panel {
    border-radius: 22px 22px 0 0;
    bottom: 0;
    box-shadow: 0 -18px 56px rgba(7, 20, 21, 0.2);
    grid-template-rows: auto auto minmax(0, 1fr) auto;
    height: min(96vh, 820px);
    height: min(96dvh, 820px);
    max-height: calc(100dvh - 4px);
    min-height: min(720px, calc(100dvh - 4px));
    right: 0;
    top: auto;
    transform: translateY(105%);
    width: 100%;
  }

  .mello-cart-drawer.is-open .mello-cart-drawer__panel {
    transform: translateY(0);
  }

  .mello-cart-drawer__header {
    min-height: 64px;
    padding: 14px 15px 12px;
  }

  .mello-cart-drawer__header h2 {
    font-size: 24px;
    line-height: 1.08;
  }

  .mello-cart-drawer__close {
    height: 40px;
    width: 40px;
  }

  .mello-cart-drawer__close span,
  .mello-cart-drawer__close span::after {
    width: 27px;
  }

  .mello-cart-drawer__notice {
    font-size: 13px;
    min-height: 40px;
  }

  .mello-cart-drawer__body {
    padding: 14px 15px 14px;
  }

  .mello-cart-item {
    gap: 10px;
    grid-template-columns: 68px minmax(0, 1fr) auto;
  }

  .mello-cart-item__media {
    height: 68px;
    width: 68px;
  }

  .mello-cart-item__title {
    font-size: 15px;
    line-height: 1.08;
    max-width: none;
  }

  .mello-cart-item__price,
  .mello-cart-item__variant,
  .mello-cart-item__shipping {
    font-size: 11px;
    margin-top: 4px;
  }

  .mello-cart-item__actions {
    gap: 12px;
    margin-top: 9px;
  }

  .mello-cart-quantity {
    grid-template-columns: 31px 34px 31px;
    height: 31px;
  }

  .mello-cart-item__total {
    align-self: end;
    font-size: 17px;
    grid-column: 3;
    line-height: 1;
    position: static;
    text-align: right;
  }

  .mello-cart-upsell {
    gap: 11px;
    margin-top: 14px;
    padding: 12px;
  }

  .mello-cart-upsell__copy span {
    font-size: 9px;
    padding: 6px 8px;
  }

  .mello-cart-upsell h3 {
    font-size: 16px;
  }

  .mello-cart-upsell p {
    font-size: 12px;
  }

  .mello-cart-upsell__button {
    font-size: 12px;
    min-height: 40px;
    padding: 0 12px;
  }

  .mello-cart-drawer__footer {
    box-shadow: 0 -14px 28px rgba(7, 20, 21, 0.08);
    padding: 0 15px max(12px, env(safe-area-inset-bottom));
  }

  .mello-cart-note summary {
    font-size: 14px;
    min-height: 40px;
  }

  .mello-cart-subtotal {
    font-size: 18px;
    padding: 13px 0 12px;
  }

  .mello-cart-subtotal strong {
    font-size: 18px;
  }

  .mello-shipping-protection {
    grid-template-columns: 54px minmax(0, 1fr) 42px;
    margin: 13px -7px 10px;
    min-height: 76px;
    padding: 10px 8px;
  }

  .mello-shipping-protection__icon {
    height: 54px;
    width: 54px;
  }

  .mello-shipping-protection__heading strong,
  .mello-shipping-protection__heading span {
    font-size: 14px;
  }

  .mello-shipping-protection__content p {
    font-size: 12px;
  }

  .mello-cart-answers {
    margin-bottom: 10px;
    padding-top: 10px;
  }

  .mello-cart-answers h3 {
    font-size: 12px;
    margin-bottom: 7px;
  }

  .mello-cart-answers ul {
    gap: 6px;
  }

  .mello-cart-answers li {
    gap: 7px;
    grid-template-columns: 20px minmax(0, 1fr);
  }

  .mello-cart-answers li > span {
    height: 20px;
    width: 20px;
  }

  .mello-cart-answers strong {
    font-size: 11.5px;
  }

  .mello-cart-answers small {
    font-size: 10.5px;
  }

  .mello-cart-checkout {
    min-height: 46px;
  }

  .mello-cart-stripe {
    min-height: 28px;
    padding-top: 8px;
  }

  .mello-cart-stripe span {
    font-size: 12px;
  }
}

@media (max-width: 520px) and (max-height: 760px) {
  .mello-cart-drawer__panel {
    height: calc(100dvh - 4px);
    min-height: 0;
  }
}
</style>
