<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  route: {
    type: String,
    default: '/'
  }
})

const { tm, rt } = useI18n({ useScope: 'global' })

const pageKey = computed(() => {
  const routeMap = {
    '/policies/shipping-policy': 'shipping',
    '/apps/track123': 'tracking',
    '/policies/privacy-policy': 'privacy',
    '/policies/terms-of-service': 'terms',
    '/policies/refund-policy': 'refunds'
  }

  return routeMap[props.route] || 'default'
})

const page = computed(() => tm(`institutional.${pageKey.value}`))
</script>

<template>
  <section class="mello-institutional">
    <div class="mello-institutional__inner">
      <h1>{{ rt(page.title) }}</h1>
      <p class="mello-institutional__intro">{{ rt(page.intro) }}</p>

      <div class="mello-institutional__list">
        <article v-for="section in page.sections" :key="rt(section[0])" class="mello-institutional__item">
          <h2>{{ rt(section[0]) }}</h2>
          <p>{{ rt(section[1]) }}</p>
        </article>
      </div>

      <a class="mello-institutional__cta" href="/pages/contact-us">{{ $t('footer.contact') }}</a>
    </div>
  </section>
</template>

<style>
.mello-institutional {
  background: #ffffff;
  color: #173132;
  font-family: var(--font-body-family);
  padding: clamp(70px, 8vw, 118px) 20px clamp(74px, 8vw, 124px);
}

.mello-institutional * {
  box-sizing: border-box;
  letter-spacing: 0;
}

.mello-institutional__inner {
  margin: 0 auto;
  max-width: 760px;
}

.mello-institutional h1 {
  color: #101819;
  font-family: var(--font-heading-family);
  font-size: clamp(38px, 5vw, 58px);
  font-weight: 950;
  line-height: 1.04;
  margin: 0 0 18px;
  text-align: center;
}

.mello-institutional__intro {
  color: #53696a;
  font-size: 18px;
  line-height: 1.62;
  margin: 0 auto 34px;
  max-width: 680px;
  text-align: center;
}

.mello-institutional__list {
  display: grid;
  gap: 14px;
}

.mello-institutional__item {
  background: #fffaf0;
  border-radius: 16px;
  padding: 24px 26px;
}

.mello-institutional__item h2 {
  color: #173132;
  font-family: var(--font-heading-family);
  font-size: 20px;
  font-weight: 900;
  line-height: 1.2;
  margin: 0 0 8px;
}

.mello-institutional__item p {
  color: #53696a;
  font-size: 16px;
  line-height: 1.58;
  margin: 0;
}

.mello-institutional__cta {
  align-items: center;
  background: #77cdfa;
  border-radius: 999px;
  color: #102829;
  display: inline-flex;
  font-size: 16px;
  font-weight: 950;
  justify-content: center;
  margin-top: 28px;
  min-height: 48px;
  padding: 0 28px;
  text-decoration: none;
}

@media (max-width: 640px) {
  .mello-institutional {
    padding-left: 16px;
    padding-right: 16px;
  }

  .mello-institutional__item {
    padding: 20px;
  }
}
</style>
