<script setup>
import { computed, onUnmounted, watch } from 'vue'
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
const isClerkLoading = computed(() => !isLoaded.value)
const authFallbackRedirectUrl = computed(() => getSafeRedirectPath() || '/collections/all')
const authSignInUrl = computed(() => getAuthPath('/sign-in'))
const authSignUpUrl = computed(() => getAuthPath('/sign-up'))
const displayName = computed(() => (
  user.value?.firstName ||
  user.value?.fullName ||
  user.value?.primaryEmailAddress?.emailAddress?.split('@')[0] ||
  t('auth.account')
))

function getSafeRedirectPath() {
  const redirectUrl = new URLSearchParams(window.location.search).get('redirect_url')
  if (!redirectUrl || !redirectUrl.startsWith('/') || redirectUrl.startsWith('//')) return ''

  return redirectUrl
}

function getAuthPath(path) {
  const redirectPath = getSafeRedirectPath()
  return redirectPath ? `${path}?redirect_url=${encodeURIComponent(redirectPath)}` : path
}

function goBack() {
  if (window.history.length > 1) {
    window.history.back()
    return
  }

  window.location.href = '/collections/all'
}

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

watch(isClerkLoading, (active) => {
  document.documentElement.classList.toggle('mello-auth-loading-lock', active)
}, { immediate: true })

onUnmounted(() => {
  document.documentElement.classList.remove('mello-auth-loading-lock')
})
</script>

<template>
  <section class="mello-auth-page">
    <Teleport to="body">
      <Transition name="mello-auth-loading" appear>
        <div
          v-if="isClerkLoading"
          class="mello-auth-loading"
          role="status"
          aria-live="polite"
          aria-busy="true"
          :aria-label="t('auth.loading')"
        >
          <span class="mello-auth-loading__spinner" aria-hidden="true"></span>
          <strong>{{ t('auth.loading') }}</strong>
        </div>
      </Transition>
    </Teleport>
    <div class="mello-auth-page__mobile-pattern" aria-hidden="true">
      <span class="mello-auth-page__pattern-item mello-auth-page__pattern-item--leaf">
        <svg viewBox="0 0 24 24"><path d="M4 20c7.8-.9 14.2-7 16-16C11.6 5.5 5.7 11.4 4 20Z" /><path d="M4 20c4.8-5.6 9.2-9.2 14-11" /></svg>
      </span>
      <span class="mello-auth-page__pattern-item mello-auth-page__pattern-item--star">
        <svg viewBox="0 0 24 24"><path d="m12 3 2.2 6.2L21 12l-6.8 2.8L12 21l-2.2-6.2L3 12l6.8-2.8L12 3Z" /></svg>
      </span>
      <span class="mello-auth-page__pattern-item mello-auth-page__pattern-item--heart">
        <svg viewBox="0 0 24 24"><path d="M20.2 5.8c-1.9-1.9-5-1.7-6.8.3L12 7.6l-1.4-1.5c-1.8-2-4.9-2.2-6.8-.3-2.1 2.1-2 5.5.2 7.6l8 7.1 8-7.1c2.2-2.1 2.3-5.5.2-7.6Z" /></svg>
      </span>
      <span class="mello-auth-page__pattern-item mello-auth-page__pattern-item--ruler">
        <svg viewBox="0 0 24 24"><path d="M7 3h10v18H7V3Z" /><path d="M17 7h-4" /><path d="M17 11h-6" /><path d="M17 15h-4" /></svg>
      </span>
      <span class="mello-auth-page__pattern-item mello-auth-page__pattern-item--sun">
        <svg viewBox="0 0 24 24"><path d="M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8Z" /><path d="M12 2v3" /><path d="M12 19v3" /><path d="m4.9 4.9 2.1 2.1" /><path d="m17 17 2.1 2.1" /><path d="M2 12h3" /><path d="M19 12h3" /></svg>
      </span>
      <span class="mello-auth-page__pattern-item mello-auth-page__pattern-item--gummy">
        <svg viewBox="0 0 24 24"><path d="M8.3 7.3c1.9-2.1 5.4-2.1 7.4 0l2 2.1c2 2.1 2 5.3 0 7.4-2 2-5.4 2-7.4 0l-2-2.1c-2-2.1-2-5.3 0-7.4Z" /><path d="M10 9.2h.1" /><path d="M14 13h.1" /><path d="M11 15h.1" /></svg>
      </span>
    </div>
    <button class="mello-auth-page__back" type="button" :aria-label="t('auth.back')" @click="goBack">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m15 18-6-6 6-6" />
        <path d="M9 12h10" />
      </svg>
      <span>{{ t('auth.back') }}</span>
    </button>
    <div class="mello-auth-page__shell">
      <aside class="mello-auth-page__copy">
        <a class="mello-auth-page__brand" href="/" aria-label="MelloRise home">
          MelloRise
        </a>
        <h1>{{ t(isSignUp ? 'authPage.signUpTitle' : 'authPage.signInTitle') }}</h1>
        <p>{{ t(isSignUp ? 'authPage.signUpText' : 'authPage.signInText') }}</p>
      </aside>

      <main class="mello-auth-page__panel">
        <section class="mello-auth-page__card" aria-label="MelloRise account authentication">
          <section v-if="isClerkLoading" class="mello-auth-page__clerk-loading" aria-hidden="true">
            <span class="mello-auth-page__clerk-loading-spinner"></span>
            <span></span>
            <span></span>
            <span></span>
          </section>

          <section v-else-if="isSignedIn" class="mello-auth-page__signed-in">
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
            oauth-flow="redirect"
            :sign-in-url="authSignInUrl"
            :fallback-redirect-url="authFallbackRedirectUrl"
            :force-redirect-url="authFallbackRedirectUrl"
            :sign-in-fallback-redirect-url="authFallbackRedirectUrl"
            :sign-in-force-redirect-url="authFallbackRedirectUrl"
            :appearance="clerkAppearance"
          />

          <SignIn
            v-else
            path="/sign-in"
            routing="path"
            oauth-flow="redirect"
            :sign-up-url="authSignUpUrl"
            :fallback-redirect-url="authFallbackRedirectUrl"
            :force-redirect-url="authFallbackRedirectUrl"
            :sign-up-fallback-redirect-url="authFallbackRedirectUrl"
            :sign-up-force-redirect-url="authFallbackRedirectUrl"
            :appearance="clerkAppearance"
          />
        </section>
      </main>

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
        <a v-if="isSignUp" :href="authSignInUrl">{{ t('auth.signIn') }}</a>
        <a v-else :href="authSignUpUrl">{{ t('auth.signUp') }}</a>
        <a href="/track-order">{{ t('auth.track') }}</a>
      </nav>
    </div>
  </section>
</template>

<style>
.mello-auth-loading {
  align-items: center;
  background:
    radial-gradient(circle at 50% 44%, rgba(119, 205, 250, 0.18), transparent 25%),
    rgba(3, 12, 13, 0.82);
  backdrop-filter: blur(10px);
  color: #ffffff;
  display: flex;
  flex-direction: column;
  font-family: var(--font-body-family);
  gap: 16px;
  inset: 0;
  justify-content: center;
  padding: max(24px, env(safe-area-inset-top)) 20px max(24px, env(safe-area-inset-bottom));
  position: fixed;
  text-align: center;
  z-index: 30000;
}

.mello-auth-loading__spinner {
  animation: mello-auth-spin 820ms linear infinite;
  border: 4px solid rgba(255, 255, 255, 0.2);
  border-left-color: #77cdfa;
  border-radius: 50%;
  border-top-color: #ffffff;
  box-shadow: 0 0 0 1px rgba(119, 205, 250, 0.08), 0 18px 38px rgba(0, 0, 0, 0.24);
  display: block;
  height: 58px;
  width: 58px;
}

.mello-auth-loading strong {
  color: #ffffff;
  font-size: 16px;
  font-weight: 900;
  line-height: 1.2;
}

.mello-auth-loading-enter-active {
  transition: opacity 240ms cubic-bezier(0.16, 1, 0.3, 1), backdrop-filter 280ms cubic-bezier(0.16, 1, 0.3, 1);
}

.mello-auth-loading-leave-active {
  transition: opacity 340ms cubic-bezier(0.16, 1, 0.3, 1), backdrop-filter 360ms cubic-bezier(0.16, 1, 0.3, 1);
}

.mello-auth-loading-enter-from,
.mello-auth-loading-leave-to {
  backdrop-filter: blur(0);
  opacity: 0;
}

.mello-auth-loading-lock,
.mello-auth-loading-lock body {
  overflow: hidden;
}

@keyframes mello-auth-spin {
  to {
    transform: rotate(360deg);
  }
}

.mello-auth-page {
  background:
    radial-gradient(circle at 20% 15%, rgba(119, 205, 250, 0.22), transparent 30%),
    linear-gradient(115deg, rgba(240, 251, 255, 0.94) 0%, rgba(250, 254, 253, 0.98) 46%, rgba(255, 252, 246, 0.92) 100%);
  box-sizing: border-box;
  color: #102829;
  display: flex;
  font-family: var(--font-body-family);
  min-height: calc(100vh - 82px);
  min-height: calc(100svh - 82px);
  overflow: clip;
  padding: clamp(22px, 4vh, 44px) 20px;
  position: relative;
}

.mello-auth-page::before {
  background:
    linear-gradient(135deg, rgba(24, 107, 255, 0.055), rgba(63, 209, 185, 0.075)),
    rgba(255, 255, 255, 0.34);
  content: "";
  inset: 0 auto 0 -8vw;
  position: absolute;
  transform: skewX(-7deg);
  transform-origin: top;
  width: min(46vw, 620px);
}

.mello-auth-page::after {
  background-image: url("/assets/mellorise-background.png");
  background-position: center;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  content: "";
  inset: 0;
  opacity: 0.14;
  pointer-events: none;
  position: absolute;
}

.mello-auth-page * {
  box-sizing: border-box;
  letter-spacing: 0;
}

.mello-auth-page__mobile-pattern,
.mello-auth-page__back {
  display: none;
}

.mello-auth-page__shell {
  align-items: center;
  display: grid;
  gap: clamp(34px, 5vw, 76px);
  grid-template-areas:
    "copy panel"
    "trust panel"
    "switch panel";
  grid-template-columns: minmax(0, 0.9fr) minmax(360px, 0.68fr);
  grid-template-rows: auto auto auto;
  margin: 0 auto;
  max-width: 1070px;
  position: relative;
  z-index: 1;
}

.mello-auth-page__copy {
  grid-area: copy;
}

.mello-auth-page__brand {
  color: #173132;
  display: inline-flex;
  font-size: 15px;
  font-weight: 850;
  margin-bottom: clamp(26px, 3.6vh, 42px);
  text-decoration: none;
}

.mello-auth-page__copy h1 {
  color: #102829;
  font-size: clamp(42px, 5vw, 64px);
  font-weight: 860;
  letter-spacing: -0.03em;
  line-height: 0.99;
  margin: 0;
  max-width: 11.5ch;
  text-wrap: balance;
}

.mello-auth-page__copy p {
  color: #53686b;
  font-size: clamp(16px, 1.24vw, 18px);
  font-weight: 560;
  line-height: 1.48;
  margin: 18px 0 0;
  max-width: 43ch;
}

.mello-auth-page__trust {
  display: grid;
  gap: 0;
  grid-area: trust;
  margin-top: clamp(18px, 3vh, 26px);
  max-width: 492px;
}

.mello-auth-page__trust article {
  align-items: flex-start;
  border-top: 1px solid rgba(23, 49, 50, 0.12);
  display: grid;
  gap: 14px;
  grid-template-columns: 28px 1fr;
  padding: 15px 0;
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
  grid-area: switch;
  margin-top: clamp(20px, 3vh, 26px);
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
  grid-area: panel;
  justify-content: center;
  min-height: 0;
}

.mello-auth-page__card {
  background: rgba(255, 255, 255, 0.92);
  border-radius: 22px;
  box-shadow: 0 26px 72px rgba(23, 49, 50, 0.13);
  display: grid;
  gap: 14px;
  overflow: hidden;
  padding: 14px;
  width: min(100%, 434px);
}

.mello-auth-page__clerk-root {
  min-width: 0;
  width: 100%;
}

.mello-auth-page__clerk-card {
  border: 0;
  box-shadow: none;
  max-width: 100%;
  min-width: 0;
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
  min-width: 0;
}

.mello-auth-page__clerk-loading {
  display: grid;
  gap: 14px;
  min-height: 430px;
  padding: 28px 24px;
  place-items: center;
}

.mello-auth-page__clerk-loading span:not(.mello-auth-page__clerk-loading-spinner) {
  background: rgba(23, 49, 50, 0.08);
  border-radius: 999px;
  display: block;
  height: 14px;
  overflow: hidden;
  position: relative;
  width: min(100%, 260px);
}

.mello-auth-page__clerk-loading span:not(.mello-auth-page__clerk-loading-spinner)::after {
  animation: mello-auth-shimmer 980ms cubic-bezier(0.16, 1, 0.3, 1) infinite;
  background: linear-gradient(90deg, transparent, rgba(119, 205, 250, 0.3), transparent);
  content: "";
  inset: 0;
  position: absolute;
  transform: translateX(-100%);
}

.mello-auth-page__clerk-loading-spinner {
  animation: mello-auth-spin 820ms linear infinite;
  border: 3px solid rgba(23, 49, 50, 0.1);
  border-radius: 50%;
  border-top-color: #173132;
  display: block;
  height: 44px;
  margin-bottom: 8px;
  width: 44px;
}

@keyframes mello-auth-shimmer {
  to {
    transform: translateX(100%);
  }
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

@media (max-width: 900px) {
  .mello-auth-page {
    background:
      radial-gradient(circle at 0 20%, rgba(119, 205, 250, 0.17), transparent 34%),
      radial-gradient(circle at 102% 80%, rgba(255, 215, 106, 0.15), transparent 30%),
      linear-gradient(180deg, #ffffff 0%, #f7fdff 48%, #fffaf0 100%);
    min-height: 100svh;
    overflow: hidden;
    padding: max(74px, calc(env(safe-area-inset-top) + 58px)) 14px max(30px, env(safe-area-inset-bottom));
  }

  .mello-auth-page::before {
    background:
      radial-gradient(circle at 18% 28%, rgba(223, 248, 239, 0.68), transparent 24%),
      radial-gradient(circle at 78% 70%, rgba(255, 250, 240, 0.86), transparent 30%),
      rgba(255, 255, 255, 0.22);
    height: 100%;
    inset: 0;
    opacity: 0.74;
    transform: none;
    width: 100%;
  }

  .mello-auth-page::after {
    content: none;
  }

  .mello-auth-page__mobile-pattern {
    display: block;
    inset: 0;
    overflow: hidden;
    pointer-events: none;
    position: absolute;
    z-index: 0;
  }

  .mello-auth-page__mobile-pattern::before,
  .mello-auth-page__mobile-pattern::after {
    background: rgba(119, 205, 250, 0.1);
    border-radius: 50%;
    content: "";
    filter: blur(2px);
    height: 220px;
    position: absolute;
    width: 220px;
  }

  .mello-auth-page__mobile-pattern::before {
    left: -116px;
    top: 20%;
  }

  .mello-auth-page__mobile-pattern::after {
    background: rgba(255, 215, 106, 0.14);
    bottom: 7%;
    right: -124px;
  }

  .mello-auth-page__pattern-item {
    color: var(--tone, #77cdfa);
    height: var(--size, 42px);
    opacity: var(--alpha, 0.24);
    position: absolute;
    transform: translate(-50%, -50%) rotate(var(--rotate, 0deg));
    width: var(--size, 42px);
  }

  .mello-auth-page__pattern-item svg {
    display: block;
    fill: none;
    height: 100%;
    stroke: currentColor;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: 1.8;
    width: 100%;
  }

  .mello-auth-page__pattern-item--leaf {
    --alpha: 0.18;
    --rotate: -19deg;
    --size: 78px;
    --tone: #62b98f;
    left: 8%;
    top: 20%;
  }

  .mello-auth-page__pattern-item--star {
    --alpha: 0.32;
    --rotate: 14deg;
    --size: 42px;
    --tone: #77cdfa;
    left: 19%;
    top: 80%;
  }

  .mello-auth-page__pattern-item--heart {
    --alpha: 0.16;
    --rotate: -11deg;
    --size: 48px;
    --tone: #ff7d93;
    left: 4%;
    top: 56%;
  }

  .mello-auth-page__pattern-item--ruler {
    --alpha: 0.16;
    --rotate: 8deg;
    --size: 62px;
    --tone: #5a9091;
    right: 3%;
    top: 18%;
    transform: translate(50%, -50%) rotate(var(--rotate));
  }

  .mello-auth-page__pattern-item--sun {
    --alpha: 0.35;
    --rotate: -9deg;
    --size: 50px;
    --tone: #ffd76a;
    right: 12%;
    top: 75%;
    transform: translate(50%, -50%) rotate(var(--rotate));
  }

  .mello-auth-page__pattern-item--gummy {
    --alpha: 0.18;
    --rotate: 19deg;
    --size: 54px;
    --tone: #ff6f61;
    right: 1%;
    top: 52%;
    transform: translate(50%, -50%) rotate(var(--rotate));
  }

  .mello-auth-page__back {
    align-items: center;
    background: rgba(255, 255, 255, 0.9);
    border: 1px solid rgba(23, 49, 50, 0.12);
    border-radius: 999px;
    box-shadow: 0 12px 28px rgba(23, 49, 50, 0.08);
    color: #173132;
    display: inline-flex;
    font: inherit;
    font-size: 14px;
    font-weight: 820;
    gap: 7px;
    left: max(14px, env(safe-area-inset-left));
    min-height: 44px;
    padding: 0 16px 0 12px;
    position: absolute;
    top: max(14px, env(safe-area-inset-top));
    z-index: 2;
  }

  .mello-auth-page__back svg {
    fill: none;
    height: 20px;
    stroke: currentColor;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: 2;
    width: 20px;
  }

  .mello-auth-page__shell {
    align-items: center;
    gap: 0;
    grid-template-areas:
      "panel";
    grid-template-columns: 1fr;
    grid-template-rows: 1fr;
    min-height: calc(100svh - 104px);
    place-items: center;
    width: 100%;
  }

  .mello-auth-page__copy,
  .mello-auth-page__trust,
  .mello-auth-page__switch {
    display: none;
  }

  .mello-auth-page__panel {
    min-height: auto;
    width: 100%;
  }

  .mello-auth-page__card {
    border-radius: 20px;
    padding: 10px;
    width: min(100%, 390px);
  }

  .mello-auth-page__clerk-loading {
    min-height: 390px;
    padding: 24px 18px;
  }

  .mello-auth-page__clerk-card {
    border-radius: 16px;
  }
}

@media (max-width: 380px) {
  .mello-auth-page {
    padding-inline: 10px;
  }

  .mello-auth-page__card {
    border-radius: 18px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .mello-auth-loading,
  .mello-auth-page__clerk-loading span:not(.mello-auth-page__clerk-loading-spinner)::after {
    transition: opacity 160ms ease;
  }

  .mello-auth-loading__spinner,
  .mello-auth-page__clerk-loading-spinner,
  .mello-auth-page__clerk-loading span:not(.mello-auth-page__clerk-loading-spinner)::after {
    animation: none;
  }
}
</style>
