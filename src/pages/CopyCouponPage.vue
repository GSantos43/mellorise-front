<script setup>
import { computed, onMounted, ref } from 'vue'

const couponCode = computed(() => (
  new URLSearchParams(window.location.search).get('code') || ''
).trim().toUpperCase())
const copyState = ref('idle')

onMounted(() => {
  copyCoupon()
})

async function copyCoupon() {
  if (!couponCode.value) {
    copyState.value = 'missing'
    return
  }

  if (!navigator.clipboard?.writeText) {
    copyState.value = 'manual'
    return
  }

  try {
    await navigator.clipboard.writeText(couponCode.value)
    copyState.value = 'copied'
  } catch {
    copyState.value = 'manual'
  }
}
</script>

<template>
  <section class="mello-copy-coupon">
    <article class="mello-copy-coupon__card">
      <a class="mello-copy-coupon__logo" href="/">
        <img src="/assets/logo-oficial.png" alt="MelloRise">
      </a>
      <span class="mello-copy-coupon__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24">
          <rect x="8" y="8" width="10" height="12" rx="2"/>
          <path d="M6 16H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
        </svg>
      </span>
      <p>Welcome discount</p>
      <h1>
        {{ copyState === 'copied' ? 'Coupon copied' : 'Copy your coupon' }}
      </h1>
      <div class="mello-copy-coupon__code">{{ couponCode || 'No code found' }}</div>
      <p v-if="copyState === 'copied'" class="mello-copy-coupon__hint">
        Paste it into the coupon field at checkout to apply your first-purchase discount.
      </p>
      <p v-else-if="copyState === 'missing'" class="mello-copy-coupon__hint">
        We could not find a coupon code in this link.
      </p>
      <p v-else class="mello-copy-coupon__hint">
        Tap the button below to copy it. Some browsers ask for a manual tap before copying.
      </p>
      <div class="mello-copy-coupon__actions">
        <button v-if="copyState !== 'copied' && couponCode" type="button" @click="copyCoupon">
          Copy coupon
        </button>
        <a href="/checkout">Go to checkout</a>
      </div>
    </article>
  </section>
</template>

<style>
.mello-copy-coupon {
  align-items: center;
  background:
    radial-gradient(circle at 16% 12%, rgba(119, 205, 250, 0.26), transparent 28%),
    radial-gradient(circle at 84% 6%, rgba(49, 214, 176, 0.18), transparent 26%),
    linear-gradient(180deg, #f5fbff 0%, #fffaf2 100%);
  color: #102829;
  display: flex;
  font-family: var(--font-body-family);
  justify-content: center;
  min-height: 100vh;
  padding: max(28px, env(safe-area-inset-top)) 18px max(28px, env(safe-area-inset-bottom));
}

.mello-copy-coupon * {
  box-sizing: border-box;
  letter-spacing: 0;
}

.mello-copy-coupon__card {
  background: rgba(255, 255, 255, 0.94);
  border: 1px solid rgba(16, 40, 41, 0.08);
  border-radius: 8px;
  box-shadow: 0 26px 72px rgba(16, 40, 41, 0.12);
  display: grid;
  justify-items: center;
  max-width: 460px;
  padding: 32px 26px;
  text-align: center;
  width: 100%;
}

.mello-copy-coupon__logo img {
  display: block;
  height: 34px;
  object-fit: contain;
  width: auto;
}

.mello-copy-coupon__icon {
  align-items: center;
  background: #dff7f1;
  border-radius: 50%;
  color: #08775e;
  display: inline-flex;
  height: 58px;
  justify-content: center;
  margin-top: 28px;
  width: 58px;
}

.mello-copy-coupon__icon svg {
  fill: none;
  height: 28px;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 2;
  width: 28px;
}

.mello-copy-coupon p {
  color: #5b7071;
  font-size: 0.82rem;
  font-weight: 760;
  margin: 18px 0 0;
  text-transform: uppercase;
}

.mello-copy-coupon h1 {
  color: #102829;
  font-size: clamp(2.25rem, 9vw, 4.2rem);
  font-weight: 850;
  line-height: 0.96;
  margin: 8px 0 0;
}

.mello-copy-coupon__code {
  background: #f4fbff;
  border: 1px dashed rgba(100, 198, 244, 0.65);
  border-radius: 8px;
  color: #102829;
  font-size: clamp(1.35rem, 6vw, 2rem);
  font-weight: 850;
  margin-top: 22px;
  overflow-wrap: anywhere;
  padding: 16px;
  width: 100%;
}

.mello-copy-coupon .mello-copy-coupon__hint {
  color: #4f6364;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.45;
  max-width: 34ch;
  text-transform: none;
}

.mello-copy-coupon__actions {
  display: grid;
  gap: 10px;
  margin-top: 24px;
  width: 100%;
}

.mello-copy-coupon__actions button,
.mello-copy-coupon__actions a {
  align-items: center;
  border-radius: 8px;
  display: inline-flex;
  font: inherit;
  font-weight: 850;
  justify-content: center;
  min-height: 50px;
  padding: 0 18px;
  text-decoration: none;
}

.mello-copy-coupon__actions button {
  appearance: none;
  background: #133130;
  border: 0;
  color: #ffffff;
  cursor: pointer;
}

.mello-copy-coupon__actions a {
  background: #77cdfa;
  color: #102829;
}

.mello-copy-coupon__actions button:focus-visible,
.mello-copy-coupon__actions a:focus-visible {
  outline: 3px solid rgba(119, 205, 250, 0.44);
  outline-offset: 2px;
}
</style>
