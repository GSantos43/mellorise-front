<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n({ useScope: 'global' })
</script>

<template>
  <section class="mello-account-unavailable">
    <div>
      <p>{{ t('account.eyebrow') }}</p>
      <h1>{{ t('account.authUnavailableTitle') }}</h1>
      <span>{{ t('account.authUnavailableText') }}</span>
      <a href="/products/wondernest-heightener-gummies-2026#comprar">{{ t('account.emptyAction') }}</a>
    </div>
  </section>
</template>

<style>
.mello-account-unavailable {
  align-items: center;
  background: linear-gradient(180deg, #ffffff 0%, #f6fbfb 58%, #fff8eb 100%);
  color: var(--mello-ink);
  display: flex;
  font-family: var(--font-body-family);
  min-height: 58vh;
  padding: 48px 20px;
}

.mello-account-unavailable div {
  margin: 0 auto;
  max-width: 760px;
  width: min(100%, 760px);
}

.mello-account-unavailable p {
  color: #2093d7;
  font-size: 12px;
  font-weight: 700;
  margin: 0 0 8px;
  text-transform: uppercase;
}

.mello-account-unavailable h1 {
  font-family: var(--font-heading-family);
  font-size: clamp(34px, 5vw, 54px);
  font-weight: 740;
  letter-spacing: -0.016em;
  line-height: 1.06;
  margin: 0;
}

.mello-account-unavailable span {
  color: var(--mello-muted);
  display: block;
  font-size: 18px;
  font-weight: 560;
  line-height: 1.5;
  margin-top: 14px;
  max-width: 54ch;
}

.mello-account-unavailable a {
  align-items: center;
  background: #173132;
  border-radius: 12px;
  color: #ffffff;
  display: inline-flex;
  font-size: 15px;
  font-weight: 720;
  justify-content: center;
  margin-top: 24px;
  min-height: 48px;
  padding: 0 20px;
  text-decoration: none;
}
</style>
