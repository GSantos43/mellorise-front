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
  }
})

const emit = defineEmits(['close', 'update-quantity', 'remove', 'checkout'])
const { t, locale } = useI18n({ useScope: 'global' })

const quantity = computed(() => props.item?.quantity || 0)
const subtotal = computed(() => Number(props.item?.price || 0) * quantity.value)
const discountPercent = computed(() => Math.max(0, Number(props.discount?.amount || 0)))
const discountTotal = computed(() => props.item && props.discount?.code ? subtotal.value * (discountPercent.value / 100) : 0)
const isShippingProtectionEnabled = ref(false)
const shippingProtectionPrice = 3.5
const shippingProtectionTotal = computed(() => props.item && isShippingProtectionEnabled.value ? shippingProtectionPrice : 0)
const checkoutTotal = computed(() => Math.max(0, subtotal.value - discountTotal.value) + shippingProtectionTotal.value)
const itemCountLabel = computed(() => quantity.value === 1 ? t('cart.oneItem') : t('cart.manyItems', { count: quantity.value }))
const localizedItemTitle = computed(() => translateProductTitle(props.item?.title, locale.value))

function checkout() {
  emit('checkout')
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

              <div class="mello-cart-item__actions">
                <div class="mello-cart-quantity" :aria-label="t('cart.quantity')">
                  <button type="button" :aria-label="t('cart.decrease')" @click="emit('update-quantity', Math.max(1, quantity - 1))">−</button>
                  <span>{{ quantity }}</span>
                  <button type="button" :aria-label="t('cart.increase')" @click="emit('update-quantity', quantity + 1)">+</button>
                </div>

                <button class="mello-cart-item__remove" type="button" :aria-label="t('cart.remove')" @click="emit('remove')">
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 15H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>
                </button>
              </div>
            </div>

            <strong class="mello-cart-item__total">{{ formatMoney(subtotal) }}</strong>
          </article>
        </div>

        <div v-else class="mello-cart-drawer__empty">
          <p>{{ t('cart.empty') }}</p>
          <a href="/products/wondernest-heightener-gummies-2026" @click="emit('close')">{{ t('cart.viewProduct') }}</a>
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

          <div v-if="item && discount?.code" class="mello-cart-discount">
            <span>{{ t('cart.discount.label') }} <strong>{{ discount.code }}</strong></span>
            <b>-{{ formatMoney(discountTotal) }}</b>
          </div>

          <button class="mello-cart-checkout" type="button" :disabled="!item || isCheckoutLoading" @click="checkout">
            {{ isCheckoutLoading ? t('cart.checkoutLoading') : `${t('cart.checkout')} • ${formatMoney(checkoutTotal)}` }}
          </button>

          <div class="mello-cart-paypal" aria-hidden="true">
            <span>P</span>
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
  --mcart-ink: #071415;
  --mcart-teal: #5f9690;
  --mcart-line: rgba(7, 20, 21, 0.14);
  --mcart-muted: #667374;
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
  font-size: 31px;
  font-weight: 900;
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
  font-weight: 900;
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
  font-weight: 900;
  line-height: 1.04;
  max-width: 236px;
  text-decoration: none;
}

.mello-cart-item__price,
.mello-cart-item__variant {
  color: var(--mcart-muted);
  display: block;
  font-size: 12px;
  line-height: 1.35;
  margin-top: 6px;
}

.mello-cart-item__variant {
  margin-top: 2px;
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
  font-weight: 800;
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
  font-weight: 900;
  line-height: 1.1;
  position: absolute;
  right: 0;
  text-align: right;
  top: 131px;
  white-space: nowrap;
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
  font-weight: 800;
  margin: 0;
}

.mello-cart-drawer__empty a {
  color: var(--mcart-teal);
  font-weight: 900;
  text-decoration: none;
}

.mello-cart-drawer__footer {
  background: #ffffff;
  border-top: 1px solid var(--mcart-line);
  overscroll-behavior: contain;
  padding: 0 15px 18px;
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
  font-weight: 900;
  justify-content: space-between;
  line-height: 1.1;
  padding: 17px 0 15px;
}

.mello-cart-subtotal strong {
  font-size: 20px;
  font-weight: 900;
}

.mello-shipping-protection {
  align-items: center;
  background: #f4f4f4;
  border-radius: 0;
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
  font-weight: 900;
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

.mello-cart-discount {
  align-items: center;
  background: #effaf6;
  border: 1px solid rgba(47, 141, 92, 0.16);
  color: #12312a;
  display: flex;
  font-size: 13px;
  font-weight: 800;
  gap: 12px;
  justify-content: space-between;
  margin: 0 -7px 12px;
  min-height: 42px;
  padding: 10px 12px;
}

.mello-cart-discount strong {
  color: #006f12;
  font-weight: 950;
}

.mello-cart-discount b {
  color: #006f12;
  font-size: 14px;
  font-weight: 950;
  white-space: nowrap;
}

.mello-cart-checkout {
  align-items: center;
  appearance: none;
  background: #006f12;
  border: 0;
  border-radius: 4px;
  color: #ffffff;
  cursor: pointer;
  display: inline-flex;
  font: inherit;
  font-size: 16px;
  font-weight: 900;
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

.mello-cart-paypal {
  align-items: center;
  display: flex;
  justify-content: center;
  min-height: 39px;
  padding-top: 12px;
}

.mello-cart-paypal span {
  align-items: center;
  background: #f7f7f7;
  border: 1px solid rgba(7, 20, 21, 0.08);
  border-radius: 4px;
  color: #003087;
  display: inline-flex;
  font-size: 16px;
  font-weight: 900;
  height: 24px;
  justify-content: center;
  width: 38px;
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
    height: min(84vh, 720px);
    height: min(84dvh, 720px);
    max-height: calc(100dvh - 10px);
    min-height: min(620px, calc(100dvh - 10px));
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
    padding: 14px 15px 10px;
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
  .mello-cart-item__variant {
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

  .mello-cart-drawer__footer {
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

  .mello-cart-checkout {
    min-height: 46px;
  }

  .mello-cart-paypal {
    min-height: 28px;
    padding-top: 8px;
  }

  .mello-cart-paypal span {
    height: 22px;
    width: 36px;
  }
}
</style>
