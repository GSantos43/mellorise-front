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
  color: #102829;
  display: flex;
  font-family: var(--font-body-family);
  min-height: 56vh;
  padding: 54px 20px;
}

.mello-account-unavailable div {
  margin: 0 auto;
  max-width: 760px;
  width: min(100%, 760px);
}

.mello-account-unavailable p {
  color: #2093d7;
  font-size: 12px;
  font-weight: 900;
  margin: 0 0 8px;
  text-transform: uppercase;
}

.mello-account-unavailable h1 {
  font-size: clamp(40px, 6vw, 68px);
  font-weight: 950;
  letter-spacing: -0.03em;
  line-height: 0.98;
  margin: 0;
}

.mello-account-unavailable span {
  color: #5f7073;
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
  border-radius: 999px;
  color: #ffffff;
  display: inline-flex;
  font-size: 15px;
  font-weight: 900;
  justify-content: center;
  margin-top: 24px;
  min-height: 48px;
  padding: 0 20px;
  text-decoration: none;
}
</style>
