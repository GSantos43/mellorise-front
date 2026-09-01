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
    colorPrimary: '#186bff',
    colorText: '#173132',
    colorTextSecondary: '#5f7073',
    colorBackground: '#ffffff',
    borderRadius: '12px',
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
        <a class="mello-auth-page__brand" href="/" aria-label="MelloRise home">
          MelloRise
        </a>
        <h1>{{ t(isSignUp ? 'authPage.signUpTitle' : 'authPage.signInTitle') }}</h1>
        <p>{{ t(isSignUp ? 'authPage.signUpText' : 'authPage.signInText') }}</p>
        <div class="mello-auth-page__trust" aria-label="Account benefits">
          <article>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 3 5.5 5.8v5.4c0 4.4 2.7 8.1 6.5 9.5 3.8-1.4 6.5-5.1 6.5-9.5V5.8L12 3Z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
            <div>
              <strong>{{ t('authPage.ordersTitle') }}</strong>
              <small>{{ t('authPage.ordersText') }}</small>
            </div>
          </article>
          <article>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M7 8.5h10" />
              <path d="M7 12h10" />
              <path d="M10 15.5h4" />
              <path d="M5.5 4.5h13A1.5 1.5 0 0 1 20 6v12a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 18V6a1.5 1.5 0 0 1 1.5-1.5Z" />
            </svg>
            <div>
              <strong>{{ t('authPage.securityTitle') }}</strong>
              <small>{{ t('authPage.securityText') }}</small>
            </div>
          </article>
        </div>
        <nav class="mello-auth-page__switch" aria-label="Authentication links">
          <a v-if="isSignUp" href="/sign-in">{{ t('auth.signIn') }}</a>
          <a v-else href="/sign-up">{{ t('auth.signUp') }}</a>
          <a href="/track-order">{{ t('auth.track') }}</a>
        </nav>
      </aside>

      <main class="mello-auth-page__panel">
        <section class="mello-auth-page__card" aria-label="MelloRise account authentication">
          <div class="mello-auth-page__panel-head">
            <span>{{ t(isSignUp ? 'authPage.signUpBadge' : 'authPage.signInBadge') }}</span>
            <strong>{{ isSignUp ? t('auth.signUp') : t('auth.signIn') }}</strong>
          </div>

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
        </section>
      </main>
    </div>
  </section>
</template>

<style>
.mello-auth-page {
  background:
    linear-gradient(115deg, rgba(229, 248, 255, 0.92) 0%, rgba(247, 253, 252, 0.96) 34%, rgba(255, 251, 242, 0.88) 100%);
  color: #102829;
  font-family: var(--font-body-family);
  min-height: calc(100vh - 82px);
  overflow: hidden;
  padding: clamp(36px, 6vw, 86px) 20px clamp(42px, 6vw, 78px);
  position: relative;
}

.mello-auth-page::before {
  background:
    linear-gradient(135deg, rgba(24, 107, 255, 0.08), rgba(63, 209, 185, 0.1)),
    rgba(255, 255, 255, 0.48);
  content: "";
  inset: 0 auto 0 0;
  position: absolute;
  width: min(45vw, 560px);
}

.mello-auth-page * {
  box-sizing: border-box;
  letter-spacing: 0;
}

.mello-auth-page__shell {
  align-items: center;
  display: grid;
  gap: clamp(34px, 6vw, 88px);
  grid-template-columns: minmax(0, 0.92fr) minmax(380px, 0.72fr);
  margin: 0 auto;
  max-width: 1080px;
  position: relative;
  z-index: 1;
}

.mello-auth-page__brand {
  color: #173132;
  display: inline-flex;
  font-size: 15px;
  font-weight: 850;
  margin-bottom: clamp(28px, 5vw, 52px);
  text-decoration: none;
}

.mello-auth-page__copy h1 {
  color: #102829;
  font-size: clamp(42px, 5.4vw, 68px);
  font-weight: 860;
  letter-spacing: -0.032em;
  line-height: 0.98;
  margin: 0;
  max-width: 11.5ch;
  text-wrap: balance;
}

.mello-auth-page__copy p {
  color: #53686b;
  font-size: clamp(16px, 1.35vw, 19px);
  font-weight: 560;
  line-height: 1.55;
  margin: 20px 0 0;
  max-width: 43ch;
}

.mello-auth-page__trust {
  display: grid;
  gap: 0;
  margin-top: 34px;
  max-width: 500px;
}

.mello-auth-page__trust article {
  align-items: flex-start;
  border-top: 1px solid rgba(23, 49, 50, 0.12);
  display: grid;
  gap: 14px;
  grid-template-columns: 28px 1fr;
  padding: 18px 0;
}

.mello-auth-page__trust article:last-child {
  border-bottom: 1px solid rgba(23, 49, 50, 0.12);
}

.mello-auth-page__trust svg {
  color: #186bff;
  fill: none;
  height: 24px;
  margin-top: 1px;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.8;
  width: 24px;
}

.mello-auth-page__trust strong {
  display: block;
  font-size: 15px;
  font-weight: 780;
}

.mello-auth-page__trust small {
  color: #53686b;
  display: block;
  font-size: 14px;
  font-weight: 560;
  line-height: 1.45;
  margin-top: 4px;
}

.mello-auth-page__switch {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 28px;
}

.mello-auth-page__switch a {
  align-items: center;
  background: rgba(255, 255, 255, 0.76);
  border: 1px solid rgba(23, 49, 50, 0.12);
  border-radius: 999px;
  color: #173132;
  display: inline-flex;
  font-size: 13px;
  font-weight: 780;
  min-height: 40px;
  padding: 0 16px;
  text-decoration: none;
  transition: background 180ms ease, border-color 180ms ease, transform 180ms ease;
}

.mello-auth-page__switch a:hover {
  background: #ffffff;
  border-color: rgba(24, 107, 255, 0.28);
  transform: translateY(-1px);
}

.mello-auth-page__switch a:focus-visible,
.mello-auth-page__signed-in a:focus-visible {
  outline: 3px solid rgba(24, 107, 255, 0.28);
  outline-offset: 3px;
}

.mello-auth-page__panel {
  align-items: center;
  display: flex;
  justify-content: center;
  min-height: 560px;
}

.mello-auth-page__card {
  background: rgba(255, 255, 255, 0.92);
  border-radius: 24px;
  box-shadow: 0 32px 90px rgba(23, 49, 50, 0.14);
  display: grid;
  gap: 18px;
  overflow: hidden;
  padding: 18px;
  width: min(100%, 452px);
}

.mello-auth-page__panel-head {
  align-items: center;
  background: linear-gradient(135deg, #f5fbff 0%, #f8fffc 100%);
  border-radius: 16px;
  display: flex;
  justify-content: space-between;
  min-height: 58px;
  padding: 0 16px;
}

.mello-auth-page__panel-head span {
  color: #186bff;
  font-size: 12px;
  font-weight: 820;
  text-transform: uppercase;
}

.mello-auth-page__panel-head strong {
  color: #173132;
  font-size: 14px;
  font-weight: 820;
}

.mello-auth-page__clerk-root {
  width: 100%;
}

.mello-auth-page__clerk-card {
  border: 0;
  box-shadow: none;
  width: 100%;
}

.mello-auth-page__clerk-title {
  font-weight: 820;
  letter-spacing: -0.025em;
}

.mello-auth-page__clerk-subtitle {
  color: #5f7073;
}

.mello-auth-page__clerk-primary {
  background: #173132;
  font-weight: 820;
  min-height: 44px;
}

.mello-auth-page__clerk-social,
.mello-auth-page__clerk-link {
  font-weight: 720;
}

.mello-auth-page__signed-in {
  background: transparent;
  display: grid;
  justify-items: start;
  padding: 18px 8px 10px;
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
    min-height: auto;
    padding: 24px 14px 56px;
  }

  .mello-auth-page::before {
    height: 42%;
    inset: 0 0 auto;
    width: 100%;
  }

  .mello-auth-page__shell {
    gap: 28px;
    grid-template-columns: 1fr;
  }

  .mello-auth-page__brand {
    margin-bottom: 28px;
  }

  .mello-auth-page__copy h1 {
    font-size: clamp(38px, 10vw, 52px);
    max-width: 11.5ch;
  }

  .mello-auth-page__panel {
    min-height: 0;
  }

  .mello-auth-page__card {
    border-radius: 20px;
    padding: 12px;
  }

  .mello-auth-page__panel-head {
    border-radius: 14px;
  }
}
</style>
