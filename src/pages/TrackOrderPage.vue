<script setup>
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { lookupOrderTracking } from '../services/tracking'

const { t } = useI18n({ useScope: 'global' })
const email = ref('')
const identifier = ref('')
const result = ref(null)
const errorMessage = ref('')
const isLoading = ref(false)

const steps = computed(() => {
  const status = result.value?.status || ''
  const hasTracking = Boolean(result.value?.tracking?.code)
  const isDelivered = ['completed', 'delivered'].includes(status) || result.value?.tracking?.status === 'delivered'

  return [
    {
      key: 'confirmed',
      label: t('tracking.steps.confirmed'),
      text: t('tracking.steps.confirmedText'),
      active: Boolean(result.value)
    },
    {
      key: 'preparing',
      label: t('tracking.steps.preparing'),
      text: t('tracking.steps.preparingText'),
      active: Boolean(result.value) && !['pending', 'failed', 'cancelled'].includes(status)
    },
    {
      key: 'shipped',
      label: t('tracking.steps.shipped'),
      text: t('tracking.steps.shippedText'),
      active: hasTracking
    },
    {
      key: 'delivered',
      label: t('tracking.steps.delivered'),
      text: t('tracking.steps.deliveredText'),
      active: isDelivered
    }
  ]
})

async function submitTrackingLookup() {
  if (isLoading.value) return

  errorMessage.value = ''
  result.value = null
  isLoading.value = true

  try {
    result.value = await lookupOrderTracking({
      email: email.value.trim(),
      identifier: identifier.value.trim()
    })
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : t('tracking.form.error')
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  const order = new URLSearchParams(window.location.search).get('order')
  if (order) {
    identifier.value = order
  }
})
</script>

<template>
  <section class="mello-track">
    <div class="mello-track__shell">
      <div class="mello-track__intro">
        <p>{{ t('tracking.intro') }}</p>
        <h1>{{ t('tracking.title') }}</h1>
        <span>{{ t('tracking.subtitle') }}</span>
      </div>

      <div class="mello-track__grid">
        <section class="mello-track__lookup" :aria-label="t('tracking.form.title')">
          <div>
            <h2>{{ t('tracking.form.title') }}</h2>
            <p>{{ t('tracking.form.text') }}</p>
          </div>

          <form class="mello-track__form" @submit.prevent="submitTrackingLookup">
            <label>
              <span>{{ t('tracking.form.email') }}</span>
              <input v-model="email" type="email" autocomplete="email" :placeholder="t('tracking.form.emailPlaceholder')" required>
            </label>

            <label>
              <span>{{ t('tracking.form.identifier') }}</span>
              <input v-model="identifier" type="text" autocomplete="off" :placeholder="t('tracking.form.identifierPlaceholder')" required>
            </label>

            <button type="submit" :disabled="isLoading">
              <span v-if="isLoading" class="mello-track__spinner" aria-hidden="true"></span>
              {{ isLoading ? t('tracking.form.loading') : t('tracking.form.submit') }}
            </button>

            <p v-if="errorMessage" class="mello-track__error" role="alert">{{ t('tracking.form.error') }}</p>
          </form>
        </section>

        <section class="mello-track__result" aria-live="polite">
          <div v-if="result" class="mello-track__result-card">
            <div class="mello-track__result-head">
              <span>{{ t('tracking.result.order') }} {{ result.orderNumber }}</span>
              <strong>{{ result.statusLabel }}</strong>
            </div>

            <div class="mello-track__timeline">
              <div
                v-for="step in steps"
                :key="step.key"
                class="mello-track__step"
                :class="{ 'is-active': step.active }"
              >
                <span aria-hidden="true"></span>
                <div>
                  <strong>{{ step.label }}</strong>
                  <p>{{ step.text }}</p>
                </div>
              </div>
            </div>

            <div v-if="result.tracking" class="mello-track__code">
              <span>{{ t('tracking.result.trackingCode') }}</span>
              <strong>{{ result.tracking.code }}</strong>
              <p v-if="result.tracking.carrier">{{ result.tracking.carrier }}</p>
              <a v-if="result.tracking.url" :href="result.tracking.url" target="_blank" rel="noopener">{{ t('tracking.result.openCarrier') }}</a>
            </div>

            <div v-else class="mello-track__pending">
              <strong>{{ t('tracking.result.pendingTitle') }}</strong>
              <p>{{ t('tracking.result.pendingText') }}</p>
            </div>
          </div>

          <div v-else class="mello-track__empty">
            <img src="/assets/frasco.png" alt="" loading="lazy">
            <div>
              <h2>{{ t('tracking.empty.title') }}</h2>
              <p>{{ t('tracking.empty.text') }}</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  </section>
</template>

<style>
.mello-track {
  background:
    radial-gradient(circle at 12% 18%, rgba(119, 205, 250, 0.18), transparent 30%),
    radial-gradient(circle at 86% 12%, rgba(49, 214, 176, 0.12), transparent 28%),
    linear-gradient(180deg, #ffffff 0%, #f6fbfb 48%, #fff8eb 100%);
  color: #102829;
  font-family: var(--font-body-family);
  min-height: calc(100vh - 78px);
  padding: clamp(28px, 4.2vw, 58px) 20px clamp(44px, 6vw, 82px);
}

.mello-track * {
  box-sizing: border-box;
  letter-spacing: 0;
}

.mello-track__shell {
  margin: 0 auto;
  max-width: 1180px;
}

.mello-track__intro {
  max-width: 860px;
}

.mello-track__intro p {
  color: #2093d7;
  font-size: 12px;
  font-weight: 900;
  line-height: 1.2;
  margin: 0 0 8px;
  text-transform: uppercase;
}

.mello-track__intro h1 {
  color: #102829;
  font-size: clamp(42px, 5.2vw, 68px);
  font-weight: 950;
  letter-spacing: -0.03em;
  line-height: 0.98;
  margin: 0;
  max-width: 13ch;
  text-wrap: balance;
}

.mello-track__intro span {
  color: #5f7073;
  display: block;
  font-size: clamp(16px, 1.45vw, 20px);
  font-weight: 560;
  line-height: 1.45;
  margin-top: 12px;
  max-width: 56ch;
}

.mello-track__grid {
  align-items: start;
  display: grid;
  gap: 24px;
  grid-template-columns: minmax(0, 0.92fr) minmax(360px, 1.08fr);
  margin-top: clamp(22px, 3.2vw, 36px);
}

.mello-track__lookup,
.mello-track__result-card,
.mello-track__empty {
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(23, 49, 50, 0.1);
  border-radius: 16px;
  box-shadow: 0 24px 70px rgba(23, 49, 50, 0.08);
}

.mello-track__lookup {
  display: grid;
  gap: 20px;
  padding: clamp(20px, 2.4vw, 30px);
}

.mello-track__lookup h2,
.mello-track__empty h2 {
  font-size: 28px;
  font-weight: 900;
  letter-spacing: -0.02em;
  line-height: 1.08;
  margin: 0;
}

.mello-track__lookup p,
.mello-track__empty p {
  color: #5f7073;
  font-size: 15px;
  font-weight: 560;
  line-height: 1.5;
  margin: 8px 0 0;
}

.mello-track__form {
  display: grid;
  gap: 14px;
}

.mello-track__form label {
  display: grid;
  gap: 8px;
}

.mello-track__form label span {
  color: #102829;
  font-size: 13px;
  font-weight: 850;
}

.mello-track__form input {
  appearance: none;
  background: #ffffff;
  border: 1px solid rgba(23, 49, 50, 0.18);
  border-radius: 10px;
  color: #102829;
  font: 650 16px/1 var(--font-body-family);
  min-height: 52px;
  padding: 0 14px;
  transition: border-color 160ms ease, box-shadow 160ms ease;
  width: 100%;
}

.mello-track__form input:focus {
  border-color: #77cdfa;
  box-shadow: 0 0 0 4px rgba(119, 205, 250, 0.24);
  outline: 0;
}

.mello-track__form button {
  align-items: center;
  appearance: none;
  background: #173132;
  border: 0;
  border-radius: 10px;
  color: #ffffff;
  cursor: pointer;
  display: inline-flex;
  font: 900 16px/1 var(--font-body-family);
  gap: 10px;
  justify-content: center;
  margin-top: 4px;
  min-height: 56px;
  padding: 0 18px;
  transition: background 180ms ease, box-shadow 180ms ease, transform 180ms ease;
}

.mello-track__form button:hover,
.mello-track__form button:focus-visible {
  background: #102829;
  box-shadow: 0 18px 34px rgba(23, 49, 50, 0.18);
  outline: 0;
  transform: translateY(-1px);
}

.mello-track__form button:disabled {
  cursor: wait;
  opacity: 0.78;
  transform: none;
}

.mello-track__spinner {
  animation: mello-track-spin 850ms linear infinite;
  border: 2px solid rgba(255, 255, 255, 0.35);
  border-top-color: #ffffff;
  border-radius: 50%;
  height: 18px;
  width: 18px;
}

.mello-track__error {
  color: #be1e4d;
  font-size: 14px;
  font-weight: 800;
  margin: 0;
}

.mello-track__result-card {
  overflow: hidden;
  padding: clamp(20px, 3vw, 32px);
}

.mello-track__result-head {
  align-items: center;
  border-bottom: 1px solid rgba(23, 49, 50, 0.1);
  display: flex;
  gap: 18px;
  justify-content: space-between;
  padding-bottom: 20px;
}

.mello-track__result-head span {
  color: #5f7073;
  font-size: 14px;
  font-weight: 750;
}

.mello-track__result-head strong {
  color: #102829;
  font-size: 22px;
  font-weight: 920;
}

.mello-track__timeline {
  display: grid;
  gap: 0;
  padding: 22px 0;
}

.mello-track__step {
  display: grid;
  gap: 14px;
  grid-template-columns: 28px 1fr;
  min-height: 72px;
  position: relative;
}

.mello-track__step::before {
  background: rgba(23, 49, 50, 0.12);
  bottom: 0;
  content: "";
  left: 11px;
  position: absolute;
  top: 28px;
  width: 2px;
}

.mello-track__step:last-child::before {
  display: none;
}

.mello-track__step > span {
  background: #ffffff;
  border: 2px solid rgba(23, 49, 50, 0.18);
  border-radius: 50%;
  box-shadow: 0 0 0 5px #ffffff;
  height: 24px;
  margin-top: 2px;
  position: relative;
  width: 24px;
  z-index: 1;
}

.mello-track__step.is-active > span {
  background: #31d6b0;
  border-color: #31d6b0;
  box-shadow: 0 0 0 5px #e6fbf6;
}

.mello-track__step strong {
  display: block;
  font-size: 16px;
  font-weight: 900;
  line-height: 1.2;
}

.mello-track__step p {
  color: #5f7073;
  font-size: 14px;
  font-weight: 560;
  line-height: 1.4;
  margin: 5px 0 0;
}

.mello-track__code,
.mello-track__pending {
  background: #f3fbff;
  border-radius: 14px;
  padding: 18px;
}

.mello-track__code span {
  color: #5f7073;
  display: block;
  font-size: 12px;
  font-weight: 900;
  text-transform: uppercase;
}

.mello-track__code strong {
  color: #102829;
  display: block;
  font-size: clamp(24px, 4vw, 34px);
  font-weight: 950;
  letter-spacing: -0.01em;
  margin-top: 5px;
}

.mello-track__code p,
.mello-track__pending p {
  color: #5f7073;
  font-size: 14px;
  font-weight: 600;
  margin: 8px 0 0;
}

.mello-track__code a {
  align-items: center;
  background: #77cdfa;
  border-radius: 999px;
  color: #102829;
  display: inline-flex;
  font-size: 14px;
  font-weight: 900;
  justify-content: center;
  margin-top: 14px;
  min-height: 40px;
  padding: 0 16px;
  text-decoration: none;
}

.mello-track__pending {
  background: #fff8eb;
}

.mello-track__pending strong {
  color: #102829;
  font-size: 18px;
  font-weight: 900;
}

.mello-track__empty {
  align-items: center;
  display: grid;
  gap: 20px;
  grid-template-columns: 120px 1fr;
  min-height: 300px;
  padding: clamp(22px, 3vw, 34px);
}

.mello-track__empty img {
  display: block;
  filter: drop-shadow(0 20px 34px rgba(23, 49, 50, 0.16));
  height: auto;
  max-width: 120px;
  width: 100%;
}

@keyframes mello-track-spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 820px) {
  .mello-track {
    min-height: calc(100vh - 74px);
    padding: 22px 14px 64px;
  }

  .mello-track__intro h1 {
    font-size: clamp(38px, 11vw, 50px);
    max-width: 12ch;
  }

  .mello-track__intro span {
    font-size: 16px;
    margin-top: 10px;
  }

  .mello-track__grid {
    gap: 16px;
    margin-top: 20px;
  }

  .mello-track__grid,
  .mello-track__empty {
    grid-template-columns: 1fr;
  }

  .mello-track__empty {
    min-height: 0;
    text-align: center;
  }

  .mello-track__empty img {
    justify-self: center;
    max-width: 96px;
  }

  .mello-track__result-head {
    align-items: flex-start;
    flex-direction: column;
    gap: 6px;
  }
}
</style>
