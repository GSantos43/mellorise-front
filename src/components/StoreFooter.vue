<script setup>
import { useI18n } from 'vue-i18n'

const year = new Date().getFullYear()
const { t } = useI18n({ useScope: 'global' })
</script>

<template>
  <footer class="footer mellow-footer section-footer-padding">
    <div class="mellow-footer__wrap page-width">
      <div class="mellow-footer__card">
        <div class="mellow-footer__brand">
          <a class="mellow-footer__logo" href="/" :aria-label="t('footer.logoLabel')">
            <img src="/assets/logo-oficial.png" alt="MelloRise" width="180" height="90" loading="lazy">
          </a>
          <h2>{{ t('footer.headline') }}</h2>
          <p>{{ t('footer.intro') }}</p>

          <form id="ContactFooter" class="mellow-footer__form" @submit.prevent>
            <input type="hidden" name="contact[tags]" value="newsletter">
            <div class="mellow-footer__field">
              <label class="visually-hidden" for="NewsletterForm--footer">{{ t('footer.emailLabel') }}</label>
              <input id="NewsletterForm--footer" type="email" name="contact[email]" autocomplete="email" :placeholder="t('footer.emailPlaceholder')" required>
              <button type="submit" name="commit" :aria-label="t('footer.subscribe')">{{ t('footer.subscribe') }}</button>
            </div>
          </form>

          <p class="mellow-footer__consent">{{ t('footer.consent') }}</p>
        </div>

        <nav class="mellow-footer__links" aria-label="Enlaces del pie de pagina">
          <div>
            <h3>{{ t('footer.explore') }}</h3>
            <a href="/">{{ t('footer.home') }}</a>
            <a href="/products/wondernest-heightener-gummies-2026#beneficios">{{ t('footer.benefits') }}</a>
            <a href="/products/wondernest-heightener-gummies-2026#rutina">{{ t('footer.routine') }}</a>
            <a href="/products/wondernest-heightener-gummies-2026#diferencia">{{ t('footer.reviews') }}</a>
            <a href="/products/wondernest-heightener-gummies-2026#comprar">{{ t('footer.buy') }}</a>
          </div>
          <div>
            <h3>{{ t('footer.support') }}</h3>
            <a href="/pages/contact-us">{{ t('footer.contact') }}</a>
            <a href="/pages/faq">{{ t('footer.faq') }}</a>
            <a href="/policies/shipping-policy">{{ t('footer.shipping') }}</a>
            <a href="/track-order">{{ t('footer.tracking') }}</a>
            <a href="/policies/privacy-policy">{{ t('footer.privacy') }}</a>
          </div>
        </nav>

        <div class="mellow-footer__divider"></div>

        <div class="mellow-footer__payments" :aria-label="t('footer.payments')">
          <ul class="list list-payment" role="list">
            <li class="list-payment__item">Visa</li>
            <li class="list-payment__item">Mastercard</li>
            <li class="list-payment__item">Amex</li>
            <li class="list-payment__item">PayPal</li>
          </ul>
        </div>
      </div>

      <div class="mellow-footer__bottom">
        <p>&copy; {{ year }} MelloRise. {{ t('footer.rights') }}</p>
        <div>
          <a href="/policies/privacy-policy">{{ t('footer.privacyPolicy') }}</a>
          <a href="/policies/terms-of-service">{{ t('footer.terms') }}</a>
          <a href="/policies/refund-policy">{{ t('footer.refunds') }}</a>
        </div>
      </div>
    </div>
  </footer>
</template>
