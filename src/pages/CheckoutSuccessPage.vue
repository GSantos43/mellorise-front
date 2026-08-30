<script setup>
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

const emit = defineEmits(['clear-cart'])
const { t } = useI18n({ useScope: 'global' })

const params = computed(() => new URLSearchParams(window.location.search))
const orderId = computed(() => params.value.get('order_id') || '')
const sessionId = computed(() => params.value.get('session_id') || '')

onMounted(() => {
  if (sessionId.value) {
    emit('clear-cart')
  }
})
</script>

<template>
  <section class="mello-checkout-success" aria-labelledby="mello-checkout-success-title">
    <div class="mello-checkout-success__card">
      <a class="mello-checkout-success__logo" href="/" aria-label="MelloRise">
        <img src="/assets/logo-oficial.png" alt="MelloRise" width="1268" height="500" loading="eager">
      </a>
      <span class="mello-checkout-success__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24">
          <path d="M20 6 9 17l-5-5"/>
        </svg>
      </span>
      <h1 id="mello-checkout-success-title">{{ t('checkoutSuccess.title') }}</h1>
      <p>{{ t('checkoutSuccess.text') }}</p>
      <dl v-if="orderId" class="mello-checkout-success__order">
        <div>
          <dt>{{ t('checkoutSuccess.orderLabel') }}</dt>
          <dd>#{{ orderId }}</dd>
        </div>
      </dl>
      <p class="mello-checkout-success__note">{{ t('checkoutSuccess.note') }}</p>
      <a class="mello-checkout-success__button" href="/products/wondernest-heightener-gummies-2026">
        {{ t('checkoutSuccess.action') }}
      </a>
    </div>
  </section>
</template>

<style>
.mello-checkout-success {
  align-items: center;
  background:
    radial-gradient(circle at 18% 15%, rgba(119, 205, 250, 0.18), transparent 28%),
    radial-gradient(circle at 84% 8%, rgba(49, 214, 176, 0.14), transparent 30%),
    #f5f5f5;
  color: #102829;
  display: flex;
  font-family: var(--font-body-family);
  justify-content: center;
  min-height: 100vh;
  padding: max(30px, env(safe-area-inset-top)) 18px max(30px, env(safe-area-inset-bottom));
}

.mello-checkout-success * {
  box-sizing: border-box;
  letter-spacing: 0;
}

.mello-checkout-success__card {
  background: #ffffff;
  box-shadow: 0 24px 70px rgba(23, 49, 50, 0.12);
  max-width: 520px;
  padding: 38px 34px 34px;
  text-align: center;
  width: min(100%, 520px);
}

.mello-checkout-success__logo {
  display: inline-flex;
  margin-bottom: 28px;
}

.mello-checkout-success__logo img {
  display: block;
  height: 34px;
  object-fit: contain;
  width: auto;
}

.mello-checkout-success__icon {
  align-items: center;
  background: #31d6b0;
  border-radius: 50%;
  box-shadow: 0 18px 34px rgba(49, 214, 176, 0.28);
  color: #062626;
  display: inline-flex;
  height: 64px;
  justify-content: center;
  margin-bottom: 20px;
  width: 64px;
}

.mello-checkout-success__icon svg {
  fill: none;
  height: 34px;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 2.4;
  width: 34px;
}

.mello-checkout-success h1 {
  color: #102829;
  font-size: clamp(34px, 7vw, 52px);
  font-weight: 950;
  letter-spacing: -0.03em;
  line-height: 0.98;
  margin: 0;
  text-wrap: balance;
}

.mello-checkout-success p {
  color: #536468;
  font-size: 16px;
  font-weight: 650;
  line-height: 1.5;
  margin: 16px auto 0;
  max-width: 38ch;
}

.mello-checkout-success__order {
  background: #f5fbff;
  border: 1px solid rgba(119, 205, 250, 0.52);
  margin: 22px auto 0;
  padding: 16px;
  width: min(100%, 300px);
}

.mello-checkout-success__order div {
  align-items: center;
  display: flex;
  justify-content: space-between;
}

.mello-checkout-success__order dt {
  color: #536468;
  font-size: 13px;
  font-weight: 800;
}

.mello-checkout-success__order dd {
  color: #102829;
  font-size: 18px;
  font-weight: 950;
  margin: 0;
}

.mello-checkout-success__note {
  font-size: 14px;
}

.mello-checkout-success__button {
  align-items: center;
  background: #77cdfa;
  box-shadow: 0 18px 38px rgba(119, 205, 250, 0.28);
  color: #102829;
  display: inline-flex;
  font-size: 16px;
  font-weight: 900;
  justify-content: center;
  margin-top: 26px;
  min-height: 54px;
  padding: 0 24px;
  text-decoration: none;
  transition: background 180ms ease, box-shadow 180ms ease, transform 180ms ease;
}

.mello-checkout-success__button:hover,
.mello-checkout-success__button:focus-visible {
  background: #66c6f8;
  box-shadow: 0 22px 44px rgba(119, 205, 250, 0.36);
  outline: 0;
  transform: translateY(-1px);
}

@media (max-width: 640px) {
  .mello-checkout-success {
    align-items: stretch;
    padding-inline: 0;
  }

  .mello-checkout-success__card {
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: 100vh;
    padding: 34px 22px;
  }
}
</style>
