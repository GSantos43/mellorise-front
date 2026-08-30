<script setup>
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { formatMoney } from '../services/products'

const props = defineProps({
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

const emit = defineEmits(['checkout', 'update-quantity', 'remove'])
const { t } = useI18n({ useScope: 'global' })

const customerEmail = ref(props.discount?.email || '')
const couponCode = ref(props.discount?.code || '')
const customerNote = ref('')
const isShippingProtectionEnabled = ref(false)
const shippingProtectionPrice = 3.5

const quantity = computed(() => Math.max(0, Number(props.item?.quantity || 0)))
const subtotal = computed(() => Number(props.item?.price || 0) * quantity.value)
const discountPercent = computed(() => Math.max(0, Number(props.discount?.amount || 0)))
const normalizedCoupon = computed(() => couponCode.value.trim().toUpperCase())
const hasSavedDiscount = computed(() => Boolean(props.discount?.code && normalizedCoupon.value === props.discount.code))
const discountTotal = computed(() => {
  if (!props.item || !hasSavedDiscount.value) return 0
  return subtotal.value * (discountPercent.value / 100)
})
const shippingProtectionTotal = computed(() => props.item && isShippingProtectionEnabled.value ? shippingProtectionPrice : 0)
const total = computed(() => Math.max(0, subtotal.value - discountTotal.value) + shippingProtectionTotal.value)
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
    customerNote: customerNote.value.trim(),
    couponCode: normalizedCoupon.value || undefined,
    shippingProtection: {
      enabled: isShippingProtectionEnabled.value,
      amount: shippingProtectionPrice
    }
  })
}
</script>

<template>
  <section class="mello-checkout" aria-labelledby="mello-checkout-title">
    <div class="mello-checkout__shell">
      <div class="mello-checkout__header">
        <a class="mello-checkout__back" href="/products/wondernest-heightener-gummies-2026">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>
          <span>{{ t('checkout.back') }}</span>
        </a>
        <p>{{ t('checkout.secure') }}</p>
      </div>

      <div v-if="!item" class="mello-checkout-empty">
        <img src="/assets/frasco.png" alt="" width="220" height="220" loading="eager">
        <h1 id="mello-checkout-title">{{ t('checkout.empty.title') }}</h1>
        <p>{{ t('checkout.empty.text') }}</p>
        <a href="/products/wondernest-heightener-gummies-2026">{{ t('checkout.empty.action') }}</a>
      </div>

      <form v-else class="mello-checkout__grid" @submit.prevent="submitCheckout">
        <div class="mello-checkout__main">
          <div class="mello-checkout__eyebrow">{{ t('checkout.eyebrow') }}</div>
          <h1 id="mello-checkout-title">{{ t('checkout.title') }}</h1>
          <p class="mello-checkout__intro">{{ t('checkout.intro') }}</p>

          <section class="mello-checkout-card" aria-labelledby="mello-checkout-contact">
            <div class="mello-checkout-card__head">
              <span>1</span>
              <h2 id="mello-checkout-contact">{{ t('checkout.contact.title') }}</h2>
            </div>
            <label class="mello-checkout-field">
              <span>{{ t('checkout.contact.email') }}</span>
              <input v-model="customerEmail" type="email" autocomplete="email" :placeholder="t('checkout.contact.emailPlaceholder')" required>
            </label>
            <p class="mello-checkout-help">{{ t('checkout.contact.help') }}</p>
          </section>

          <section class="mello-checkout-card" aria-labelledby="mello-checkout-coupon">
            <div class="mello-checkout-card__head">
              <span>2</span>
              <h2 id="mello-checkout-coupon">{{ t('checkout.coupon.title') }}</h2>
            </div>
            <label class="mello-checkout-field">
              <span>{{ t('checkout.coupon.label') }}</span>
              <input v-model="couponCode" type="text" autocomplete="off" :placeholder="t('checkout.coupon.placeholder')">
            </label>
            <div v-if="hasSavedDiscount" class="mello-checkout-coupon">
              <strong>{{ props.discount.code }}</strong>
              <span>{{ t('checkout.coupon.applied', { percent: discountPercent }) }}</span>
            </div>
            <p v-else class="mello-checkout-help">{{ t('checkout.coupon.help') }}</p>
          </section>

          <section class="mello-checkout-card" aria-labelledby="mello-checkout-delivery">
            <div class="mello-checkout-card__head">
              <span>3</span>
              <h2 id="mello-checkout-delivery">{{ t('checkout.delivery.title') }}</h2>
            </div>
            <div class="mello-checkout-option">
              <div>
                <strong>{{ t('checkout.delivery.standard') }}</strong>
                <p>{{ t('checkout.delivery.standardText') }}</p>
              </div>
              <b>{{ t('checkout.delivery.calculated') }}</b>
            </div>
            <button
              class="mello-checkout-protection"
              type="button"
              :class="{ 'is-active': isShippingProtectionEnabled }"
              :aria-pressed="isShippingProtectionEnabled"
              @click="isShippingProtectionEnabled = !isShippingProtectionEnabled"
            >
              <img src="/assets/shipping-protection.png" alt="" width="62" height="62" loading="eager">
              <span>
                <strong>{{ t('cart.shippingProtection.title') }}</strong>
                <small>{{ t('cart.shippingProtection.text') }}</small>
              </span>
              <b>{{ formatMoney(shippingProtectionPrice) }}</b>
            </button>
          </section>

          <section class="mello-checkout-card" aria-labelledby="mello-checkout-note">
            <div class="mello-checkout-card__head">
              <span>4</span>
              <h2 id="mello-checkout-note">{{ t('checkout.note.title') }}</h2>
            </div>
            <label class="mello-checkout-field">
              <span>{{ t('checkout.note.label') }}</span>
              <textarea v-model="customerNote" rows="3" :placeholder="t('checkout.note.placeholder')"></textarea>
            </label>
          </section>
        </div>

        <aside class="mello-checkout-summary" :aria-label="t('checkout.summary.title')">
          <div class="mello-checkout-summary__inner">
            <h2>{{ t('checkout.summary.title') }}</h2>
            <article class="mello-checkout-item">
              <img :src="item.image" :alt="item.title" width="92" height="92" loading="eager">
              <div>
                <h3>{{ item.title }}</h3>
                <p>{{ item.bundleLabel }}</p>
                <div class="mello-checkout-quantity" :aria-label="t('cart.quantity')">
                  <button type="button" :aria-label="t('cart.decrease')" @click="emit('update-quantity', Math.max(1, quantity - 1))">−</button>
                  <span>{{ quantity }}</span>
                  <button type="button" :aria-label="t('cart.increase')" @click="emit('update-quantity', quantity + 1)">+</button>
                </div>
              </div>
              <strong>{{ formatMoney(subtotal) }}</strong>
            </article>

            <button class="mello-checkout-remove" type="button" @click="emit('remove')">{{ t('cart.remove') }}</button>

            <dl class="mello-checkout-totals">
              <div>
                <dt>{{ t('cart.subtotal') }}</dt>
                <dd>{{ formatMoney(subtotal) }}</dd>
              </div>
              <div v-if="discountTotal">
                <dt>{{ t('cart.discount.label') }}</dt>
                <dd>-{{ formatMoney(discountTotal) }}</dd>
              </div>
              <div>
                <dt>{{ t('cart.shippingProtection.title') }}</dt>
                <dd>{{ shippingProtectionTotal ? formatMoney(shippingProtectionTotal) : formatMoney(0) }}</dd>
              </div>
              <div class="is-total">
                <dt>{{ t('checkout.summary.total') }}</dt>
                <dd>{{ formatMoney(total) }}</dd>
              </div>
            </dl>

            <button class="mello-checkout-submit" type="submit" :disabled="!canSubmit">
              {{ isCheckoutLoading ? t('checkout.summary.loading') : t('checkout.summary.pay') }}
            </button>
            <p class="mello-checkout-summary__foot">{{ t('checkout.summary.foot') }}</p>
          </div>
        </aside>
      </form>
    </div>
  </section>
</template>

<style>
.mello-checkout {
  --checkout-ink: #071415;
  --checkout-teal: #5f9690;
  --checkout-blue: #77cdfa;
  --checkout-cream: #fff7e8;
  --checkout-line: rgba(7, 20, 21, 0.12);
  background: linear-gradient(180deg, #fffdf7 0%, #f7fbfb 48%, #fff7e8 100%);
  color: var(--checkout-ink);
  font-family: var(--font-body-family);
  min-height: 82vh;
  padding: 34px 0 74px;
}

.mello-checkout * {
  box-sizing: border-box;
  letter-spacing: 0;
}

.mello-checkout__shell {
  margin: 0 auto;
  width: min(1180px, calc(100% - 38px));
}

.mello-checkout__header {
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin-bottom: 24px;
}

.mello-checkout__header p,
.mello-checkout__back {
  color: rgba(7, 20, 21, 0.68);
  font-size: 14px;
  font-weight: 800;
  margin: 0;
}

.mello-checkout__back {
  align-items: center;
  display: inline-flex;
  gap: 6px;
  text-decoration: none;
}

.mello-checkout__back svg {
  fill: none;
  height: 19px;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 2.1;
  width: 19px;
}

.mello-checkout__grid {
  display: grid;
  gap: 28px;
  grid-template-columns: minmax(0, 1fr) 410px;
  align-items: start;
}

.mello-checkout__eyebrow {
  color: #0c6f9f;
  font-size: 13px;
  font-weight: 950;
  margin-bottom: 10px;
  text-transform: uppercase;
}

.mello-checkout h1 {
  font-size: clamp(42px, 6vw, 72px);
  font-weight: 950;
  line-height: 0.94;
  margin: 0;
  max-width: 760px;
}

.mello-checkout__intro {
  color: #4d6465;
  font-size: 18px;
  font-weight: 650;
  line-height: 1.48;
  margin: 18px 0 26px;
  max-width: 680px;
}

.mello-checkout-card {
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid var(--checkout-line);
  border-radius: 16px;
  box-shadow: 0 18px 44px rgba(23, 49, 50, 0.07);
  display: grid;
  gap: 16px;
  margin-bottom: 16px;
  padding: 22px;
}

.mello-checkout-card__head {
  align-items: center;
  display: flex;
  gap: 12px;
}

.mello-checkout-card__head span {
  align-items: center;
  background: #173132;
  border-radius: 50%;
  color: #ffffff;
  display: inline-flex;
  flex: 0 0 auto;
  font-size: 13px;
  font-weight: 950;
  height: 31px;
  justify-content: center;
  width: 31px;
}

.mello-checkout-card h2 {
  font-size: 22px;
  font-weight: 950;
  line-height: 1.1;
  margin: 0;
}

.mello-checkout-field {
  display: grid;
  gap: 8px;
}

.mello-checkout-field span {
  color: #2b4546;
  font-size: 13px;
  font-weight: 900;
}

.mello-checkout-field input,
.mello-checkout-field textarea {
  appearance: none;
  background: #fffaf2;
  border: 1px solid rgba(23, 49, 50, 0.18);
  border-radius: 12px;
  color: #071415;
  font: inherit;
  font-size: 16px;
  font-weight: 700;
  outline: 0;
  padding: 0 15px;
  width: 100%;
}

.mello-checkout-field input {
  min-height: 54px;
}

.mello-checkout-field textarea {
  line-height: 1.4;
  min-height: 98px;
  padding-top: 13px;
  resize: vertical;
}

.mello-checkout-field input:focus,
.mello-checkout-field textarea:focus {
  border-color: var(--checkout-teal);
  box-shadow: 0 0 0 3px rgba(119, 205, 250, 0.24);
}

.mello-checkout-help {
  color: #5b7071;
  font-size: 13px;
  font-weight: 650;
  line-height: 1.42;
  margin: -4px 0 0;
}

.mello-checkout-coupon,
.mello-checkout-option,
.mello-checkout-protection {
  border-radius: 14px;
  display: grid;
}

.mello-checkout-coupon {
  align-items: center;
  background: #effaf6;
  border: 1px solid rgba(47, 141, 92, 0.18);
  color: #12312a;
  gap: 8px;
  grid-template-columns: auto 1fr;
  padding: 13px 14px;
}

.mello-checkout-coupon strong {
  color: #006f12;
  font-size: 15px;
  font-weight: 950;
}

.mello-checkout-coupon span {
  font-size: 13px;
  font-weight: 800;
}

.mello-checkout-option {
  align-items: center;
  background: #f7fbfb;
  border: 1px solid var(--checkout-line);
  gap: 14px;
  grid-template-columns: minmax(0, 1fr) auto;
  padding: 16px;
}

.mello-checkout-option strong {
  display: block;
  font-size: 16px;
  font-weight: 950;
}

.mello-checkout-option p {
  color: #5b7071;
  font-size: 13px;
  font-weight: 650;
  line-height: 1.32;
  margin: 4px 0 0;
}

.mello-checkout-option b {
  color: #173132;
  font-size: 13px;
  font-weight: 950;
  white-space: nowrap;
}

.mello-checkout-protection {
  align-items: center;
  appearance: none;
  background: #ffffff;
  border: 1px solid rgba(23, 49, 50, 0.12);
  color: #173132;
  cursor: pointer;
  gap: 14px;
  grid-template-columns: 54px minmax(0, 1fr) auto;
  padding: 12px;
  text-align: left;
}

.mello-checkout-protection.is-active {
  border-color: rgba(12, 111, 159, 0.38);
  box-shadow: 0 0 0 3px rgba(119, 205, 250, 0.16);
}

.mello-checkout-protection img {
  height: 54px;
  object-fit: contain;
  width: 54px;
}

.mello-checkout-protection strong,
.mello-checkout-protection small {
  display: block;
}

.mello-checkout-protection strong {
  font-size: 16px;
  font-weight: 950;
}

.mello-checkout-protection small {
  color: #5b7071;
  font-size: 12px;
  font-weight: 650;
  line-height: 1.3;
  margin-top: 3px;
}

.mello-checkout-protection b {
  font-size: 15px;
  font-weight: 950;
}

.mello-checkout-summary {
  position: sticky;
  top: 98px;
}

.mello-checkout-summary__inner {
  background: #173132;
  border-radius: 22px;
  box-shadow: 0 28px 76px rgba(23, 49, 50, 0.22);
  color: #ffffff;
  padding: 24px;
}

.mello-checkout-summary h2 {
  font-size: 25px;
  font-weight: 950;
  margin: 0 0 18px;
}

.mello-checkout-item {
  display: grid;
  gap: 13px;
  grid-template-columns: 92px minmax(0, 1fr);
  position: relative;
}

.mello-checkout-item img {
  background: #fffaf2;
  border-radius: 14px;
  height: 92px;
  object-fit: cover;
  width: 92px;
}

.mello-checkout-item h3 {
  color: #ffffff;
  font-size: 16px;
  font-weight: 950;
  line-height: 1.12;
  margin: 0 0 6px;
  padding-right: 78px;
}

.mello-checkout-item p {
  color: rgba(255, 255, 255, 0.68);
  font-size: 12px;
  font-weight: 750;
  margin: 0 0 10px;
}

.mello-checkout-item > strong {
  color: #ffffff;
  font-size: 16px;
  font-weight: 950;
  position: absolute;
  right: 0;
  top: 0;
}

.mello-checkout-quantity {
  align-items: center;
  border: 1px solid rgba(255, 255, 255, 0.28);
  border-radius: 999px;
  display: inline-grid;
  grid-template-columns: 32px 34px 32px;
  height: 34px;
  overflow: hidden;
}

.mello-checkout-quantity button {
  appearance: none;
  background: transparent;
  border: 0;
  color: #ffffff;
  cursor: pointer;
  font: inherit;
  font-size: 18px;
  height: 100%;
  padding: 0;
}

.mello-checkout-quantity span {
  color: #ffffff;
  font-size: 13px;
  font-weight: 950;
  text-align: center;
}

.mello-checkout-remove {
  appearance: none;
  background: transparent;
  border: 0;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  font: inherit;
  font-size: 13px;
  font-weight: 850;
  margin: 14px 0 0;
  padding: 0;
  text-decoration: underline;
  text-underline-offset: 4px;
}

.mello-checkout-totals {
  border-top: 1px solid rgba(255, 255, 255, 0.16);
  display: grid;
  gap: 12px;
  margin: 22px 0 18px;
  padding-top: 18px;
}

.mello-checkout-totals div {
  align-items: center;
  display: flex;
  gap: 18px;
  justify-content: space-between;
}

.mello-checkout-totals dt,
.mello-checkout-totals dd {
  margin: 0;
}

.mello-checkout-totals dt {
  color: rgba(255, 255, 255, 0.72);
  font-size: 14px;
  font-weight: 760;
}

.mello-checkout-totals dd {
  color: #ffffff;
  font-size: 15px;
  font-weight: 950;
}

.mello-checkout-totals .is-total {
  border-top: 1px solid rgba(255, 255, 255, 0.16);
  padding-top: 14px;
}

.mello-checkout-totals .is-total dt,
.mello-checkout-totals .is-total dd {
  color: #ffffff;
  font-size: 22px;
  font-weight: 950;
}

.mello-checkout-submit,
.mello-checkout-empty a {
  align-items: center;
  appearance: none;
  background: var(--checkout-blue);
  border: 0;
  border-radius: 999px;
  color: #102829;
  cursor: pointer;
  display: inline-flex;
  font: inherit;
  font-size: 16px;
  font-weight: 950;
  justify-content: center;
  min-height: 54px;
  padding: 0 22px;
  text-decoration: none;
  width: 100%;
}

.mello-checkout-submit:disabled {
  cursor: not-allowed;
  opacity: 0.58;
}

.mello-checkout-summary__foot {
  color: rgba(255, 255, 255, 0.68);
  font-size: 12px;
  font-weight: 650;
  line-height: 1.36;
  margin: 13px 0 0;
  text-align: center;
}

.mello-checkout-empty {
  align-items: center;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid var(--checkout-line);
  border-radius: 22px;
  box-shadow: 0 20px 54px rgba(23, 49, 50, 0.08);
  display: flex;
  flex-direction: column;
  margin: 22px auto 0;
  max-width: 520px;
  padding: 38px;
  text-align: center;
}

.mello-checkout-empty img {
  height: 160px;
  object-fit: contain;
  width: 160px;
}

.mello-checkout-empty h1 {
  font-size: 38px;
  margin-top: 14px;
}

.mello-checkout-empty p {
  color: #4d6465;
  font-size: 16px;
  font-weight: 650;
  line-height: 1.45;
  margin: 14px 0 22px;
}

@media (max-width: 900px) {
  .mello-checkout {
    padding: 24px 0 56px;
  }

  .mello-checkout__grid {
    grid-template-columns: 1fr;
  }

  .mello-checkout-summary {
    position: static;
  }
}

@media (max-width: 640px) {
  .mello-checkout {
    padding: 18px 0 34px;
  }

  .mello-checkout__shell {
    width: min(100% - 24px, 1180px);
  }

  .mello-checkout__header {
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 18px;
  }

  .mello-checkout__header p {
    max-width: 17ch;
    text-align: right;
  }

  .mello-checkout h1 {
    font-size: 38px;
    max-width: 10ch;
  }

  .mello-checkout__intro {
    font-size: 15px;
    margin-bottom: 18px;
  }

  .mello-checkout-card {
    border-radius: 14px;
    gap: 14px;
    padding: 17px;
  }

  .mello-checkout-card h2 {
    font-size: 19px;
  }

  .mello-checkout-option,
  .mello-checkout-protection,
  .mello-checkout-coupon {
    border-radius: 12px;
  }

  .mello-checkout-protection {
    grid-template-columns: 48px minmax(0, 1fr);
  }

  .mello-checkout-protection b {
    grid-column: 2;
  }

  .mello-checkout-summary__inner {
    border-radius: 18px;
    padding: 18px;
  }

  .mello-checkout-item {
    grid-template-columns: 78px minmax(0, 1fr);
  }

  .mello-checkout-item img {
    height: 78px;
    width: 78px;
  }

  .mello-checkout-item h3 {
    font-size: 14px;
  }

  .mello-checkout-empty {
    padding: 26px 20px;
  }
}
</style>
