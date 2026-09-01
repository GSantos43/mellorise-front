<script setup>
import { computed } from 'vue'
import { SignIn, SignUp } from '@clerk/vue'
import { useAuth, useUser } from '@clerk/vue'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  mode: {
    type: String,
    default: 'sign-in',
    validator: (value) => ['sign-in', 'sign-up'].includes(value)
  }
})

const { t } = useI18n({ useScope: 'global' })
const { isLoaded, isSignedIn } = useAuth()
const { user } = useUser()

const isSignUp = computed(() => props.mode === 'sign-up')
const displayName = computed(() => (
  user.value?.firstName ||
  user.value?.fullName ||
  user.value?.primaryEmailAddress?.emailAddress?.split('@')[0] ||
  t('auth.account')
))

const clerkAppearance = {
  variables: {
    colorPrimary: '#173132',
    colorText: '#173132',
    colorTextSecondary: '#5f7073',
    colorBackground: '#ffffff',
    borderRadius: '14px',
    fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  },
  elements: {
    rootBox: 'mello-auth-page__clerk-root',
    cardBox: 'mello-auth-page__clerk-card',
    headerTitle: 'mello-auth-page__clerk-title',
    headerSubtitle: 'mello-auth-page__clerk-subtitle',
    formButtonPrimary: 'mello-auth-page__clerk-primary',
    socialButtonsBlockButton: 'mello-auth-page__clerk-social',
    footerActionLink: 'mello-auth-page__clerk-link'
  }
}
</script>

<template>
  <section class="mello-auth-page">
    <div class="mello-auth-page__shell">
      <aside class="mello-auth-page__copy">
        <span>{{ t(isSignUp ? 'authPage.signUpBadge' : 'authPage.signInBadge') }}</span>
        <h1>{{ t(isSignUp ? 'authPage.signUpTitle' : 'authPage.signInTitle') }}</h1>
        <p>{{ t(isSignUp ? 'authPage.signUpText' : 'authPage.signInText') }}</p>
        <div class="mello-auth-page__trust">
          <div>
            <strong>{{ t('authPage.ordersTitle') }}</strong>
            <small>{{ t('authPage.ordersText') }}</small>
          </div>
          <div>
            <strong>{{ t('authPage.securityTitle') }}</strong>
            <small>{{ t('authPage.securityText') }}</small>
          </div>
        </div>
      </aside>

      <main class="mello-auth-page__panel">
        <section v-if="isLoaded && isSignedIn" class="mello-auth-page__signed-in">
          <span class="mello-auth-page__avatar">
            <img v-if="user?.imageUrl" :src="user.imageUrl" alt="" loading="lazy">
            <b v-else>{{ displayName.charAt(0).toUpperCase() }}</b>
          </span>
          <h2>{{ t('authPage.alreadySignedInTitle', { name: displayName }) }}</h2>
          <p>{{ t('authPage.alreadySignedInText') }}</p>
          <a href="/account/orders">{{ t('auth.orders') }}</a>
        </section>

        <SignUp
          v-else-if="isSignUp"
          path="/sign-up"
          routing="path"
          sign-in-url="/sign-in"
          fallback-redirect-url="/account/orders"
          sign-in-fallback-redirect-url="/account/orders"
          :appearance="clerkAppearance"
        />

        <SignIn
          v-else
          path="/sign-in"
          routing="path"
          sign-up-url="/sign-up"
          fallback-redirect-url="/account/orders"
          sign-up-fallback-redirect-url="/account/orders"
          :appearance="clerkAppearance"
        />
      </main>
    </div>
  </section>
</template>

<style>
.mello-auth-page {
  background:
    radial-gradient(circle at 12% 18%, rgba(119, 205, 250, 0.2), transparent 28%),
    radial-gradient(circle at 90% 10%, rgba(49, 214, 176, 0.12), transparent 26%),
    linear-gradient(180deg, #ffffff 0%, #f6fbfb 58%, #fff8eb 100%);
  color: #102829;
  font-family: var(--font-body-family);
  padding: clamp(34px, 5vw, 74px) 20px clamp(54px, 7vw, 96px);
}

.mello-auth-page * {
  box-sizing: border-box;
  letter-spacing: 0;
}

.mello-auth-page__shell {
  align-items: center;
  display: grid;
  gap: clamp(28px, 5vw, 72px);
  grid-template-columns: minmax(0, 0.9fr) minmax(360px, 0.72fr);
  margin: 0 auto;
  max-width: 1120px;
}

.mello-auth-page__copy > span {
  color: #2093d7;
  display: inline-flex;
  font-size: 12px;
  font-weight: 920;
  line-height: 1.2;
  margin-bottom: 10px;
  text-transform: uppercase;
}

.mello-auth-page__copy h1 {
  color: #102829;
  font-size: clamp(44px, 6vw, 76px);
  font-weight: 950;
  letter-spacing: -0.035em;
  line-height: 0.94;
  margin: 0;
  max-width: 10ch;
}

.mello-auth-page__copy p {
  color: #5f7073;
  font-size: clamp(17px, 1.6vw, 21px);
  font-weight: 560;
  line-height: 1.48;
  margin: 18px 0 0;
  max-width: 48ch;
}

.mello-auth-page__trust {
  display: grid;
  gap: 12px;
  margin-top: 28px;
  max-width: 520px;
}

.mello-auth-page__trust div {
  background: rgba(255, 255, 255, 0.76);
  border: 1px solid rgba(23, 49, 50, 0.1);
  border-radius: 14px;
  padding: 16px 18px;
}

.mello-auth-page__trust strong {
  display: block;
  font-size: 15px;
  font-weight: 920;
}

.mello-auth-page__trust small {
  color: #5f7073;
  display: block;
  font-size: 14px;
  font-weight: 620;
  line-height: 1.4;
  margin-top: 4px;
}

.mello-auth-page__panel {
  align-items: center;
  display: flex;
  justify-content: center;
  min-height: 520px;
}

.mello-auth-page__clerk-root {
  width: min(100%, 430px);
}

.mello-auth-page__clerk-card {
  border: 1px solid rgba(23, 49, 50, 0.1);
  box-shadow: 0 28px 82px rgba(23, 49, 50, 0.12);
}

.mello-auth-page__clerk-title {
  font-weight: 900;
  letter-spacing: -0.02em;
}

.mello-auth-page__clerk-subtitle {
  color: #5f7073;
}

.mello-auth-page__clerk-primary {
  font-weight: 850;
}

.mello-auth-page__clerk-social,
.mello-auth-page__clerk-link {
  font-weight: 760;
}

.mello-auth-page__signed-in {
  background: rgba(255, 255, 255, 0.94);
  border: 1px solid rgba(23, 49, 50, 0.1);
  border-radius: 18px;
  box-shadow: 0 28px 82px rgba(23, 49, 50, 0.12);
  display: grid;
  justify-items: start;
  max-width: 430px;
  padding: 28px;
}

.mello-auth-page__avatar {
  align-items: center;
  background: #eff9ff;
  border-radius: 50%;
  display: inline-flex;
  height: 58px;
  justify-content: center;
  overflow: hidden;
  width: 58px;
}

.mello-auth-page__avatar img {
  height: 100%;
  object-fit: cover;
  width: 100%;
}

.mello-auth-page__avatar b {
  font-size: 22px;
  font-weight: 950;
}

.mello-auth-page__signed-in h2 {
  font-size: 28px;
  font-weight: 930;
  letter-spacing: -0.02em;
  line-height: 1.08;
  margin: 18px 0 0;
}

.mello-auth-page__signed-in p {
  color: #5f7073;
  font-size: 15px;
  font-weight: 620;
  line-height: 1.45;
  margin: 10px 0 0;
}

.mello-auth-page__signed-in a {
  align-items: center;
  background: #173132;
  border-radius: 999px;
  color: #ffffff;
  display: inline-flex;
  font-size: 14px;
  font-weight: 900;
  justify-content: center;
  margin-top: 20px;
  min-height: 44px;
  padding: 0 18px;
  text-decoration: none;
}

@media (max-width: 820px) {
  .mello-auth-page {
    padding: 26px 14px 64px;
  }

  .mello-auth-page__shell {
    grid-template-columns: 1fr;
  }

  .mello-auth-page__copy h1 {
    font-size: clamp(40px, 11vw, 54px);
    max-width: 12ch;
  }

  .mello-auth-page__panel {
    min-height: 0;
  }
}
</style>
