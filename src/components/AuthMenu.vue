<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useAuth, useClerk, useUser } from '@clerk/vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n({ useScope: 'global' })
const clerk = useClerk()
const { isLoaded, isSignedIn } = useAuth()
const { user } = useUser()
const isOpen = ref(false)
const menuRef = ref(null)

const displayName = computed(() => (
  user.value?.firstName ||
  user.value?.fullName ||
  user.value?.primaryEmailAddress?.emailAddress?.split('@')[0] ||
  t('auth.account')
))
const avatarUrl = computed(() => user.value?.imageUrl || '')
const initial = computed(() => displayName.value.trim().charAt(0).toUpperCase() || 'M')

function openProfile() {
  isOpen.value = false
  clerk.value?.openUserProfile()
}

async function signOut() {
  isOpen.value = false
  await clerk.value?.signOut()
}

function toggleMenu() {
  isOpen.value = !isOpen.value
}

function closeMenu() {
  isOpen.value = false
}

function handleDocumentPointerDown(event) {
  if (!menuRef.value?.contains(event.target)) {
    closeMenu()
  }
}

function handleEscape(event) {
  if (event.key === 'Escape') {
    closeMenu()
  }
}

onMounted(() => {
  document.addEventListener('pointerdown', handleDocumentPointerDown)
  window.addEventListener('keydown', handleEscape)
})

onUnmounted(() => {
  document.removeEventListener('pointerdown', handleDocumentPointerDown)
  window.removeEventListener('keydown', handleEscape)
})
</script>

<template>
  <div ref="menuRef" class="mello-auth-menu">
    <button
      v-if="!isLoaded"
      class="mello-auth-menu__trigger is-loading"
      type="button"
      disabled
      :aria-label="t('auth.loading')"
    >
      <span></span>
    </button>

    <div
      v-else-if="!isSignedIn"
      class="mello-auth-menu__guest"
    >
      <a class="mello-auth-menu__signin" href="/sign-in">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
          <path d="m10 17 5-5-5-5" />
          <path d="M15 12H3" />
        </svg>
        <span>{{ t('auth.signIn') }}</span>
      </a>
      <a class="mello-auth-menu__signup" href="/sign-up">
        <span>{{ t('auth.signUp') }}</span>
      </a>
    </div>

    <template v-else>
      <button
        class="mello-auth-menu__trigger"
        type="button"
        :aria-label="t('auth.menu')"
        :aria-expanded="isOpen"
        @click="toggleMenu"
      >
        <span class="mello-auth-menu__avatar">
          <img v-if="avatarUrl" :src="avatarUrl" alt="" loading="lazy">
          <span v-else>{{ initial }}</span>
        </span>
        <strong>{{ displayName }}</strong>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      <Transition name="mello-auth-menu">
        <div v-if="isOpen" class="mello-auth-menu__panel">
          <a href="/account/orders" @click="closeMenu">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3Z" />
              <path d="M9 8h6" />
              <path d="M9 12h6" />
            </svg>
            {{ t('auth.orders') }}
          </a>
          <button type="button" @click="openProfile">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M20 21a8 8 0 0 0-16 0" />
              <path d="M12 13a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z" />
            </svg>
            {{ t('auth.profile') }}
          </button>
          <a href="/track-order" @click="closeMenu">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
              <path d="M3.27 6.96 12 12.01l8.73-5.05" />
              <path d="M12 22.08V12" />
            </svg>
            {{ t('auth.track') }}
          </a>
          <a href="/pages/contact-us" @click="closeMenu">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z" />
            </svg>
            {{ t('auth.support') }}
          </a>
          <button type="button" @click="signOut">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <path d="m16 17 5-5-5-5" />
              <path d="M21 12H9" />
            </svg>
            {{ t('auth.signOut') }}
          </button>
        </div>
      </Transition>
    </template>
  </div>
</template>

<style>
.mello-auth-menu {
  flex: 0 0 auto;
  position: relative;
}

.mello-auth-menu__guest {
  align-items: center;
  display: inline-flex;
  gap: 8px;
}

.mello-auth-menu__signin,
.mello-auth-menu__signup,
.mello-auth-menu__trigger {
  align-items: center;
  appearance: none;
  background: rgba(239, 249, 255, 0.95);
  border: 0;
  border-radius: 999px;
  color: #173132;
  cursor: pointer;
  display: inline-flex;
  font-family: var(--font-body-family);
  font-size: 13px;
  font-weight: 850;
  gap: 8px;
  min-height: 42px;
  padding: 4px 12px 4px 5px;
  white-space: nowrap;
}

.mello-auth-menu__signin {
  gap: 7px;
  padding: 0 14px;
  text-decoration: none;
}

.mello-auth-menu__signup {
  background: #173132;
  color: #ffffff;
  min-height: 42px;
  padding: 0 16px;
  text-decoration: none;
}

.mello-auth-menu__signin:hover,
.mello-auth-menu__signin:focus-visible,
.mello-auth-menu__signup:hover,
.mello-auth-menu__signup:focus-visible,
.mello-auth-menu__trigger:hover,
.mello-auth-menu__trigger:focus-visible {
  box-shadow: 0 12px 26px rgba(23, 49, 50, 0.1);
  outline: 0;
  transform: translateY(-1px);
}

.mello-auth-menu__signin svg,
.mello-auth-menu__trigger > svg,
.mello-auth-menu__panel svg {
  fill: none;
  flex: 0 0 auto;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 2;
}

.mello-auth-menu__signin svg {
  height: 17px;
  width: 17px;
}

.mello-auth-menu__trigger > svg {
  height: 15px;
  opacity: 0.66;
  width: 15px;
}

.mello-auth-menu__avatar {
  align-items: center;
  background: #ffffff;
  border-radius: 50%;
  box-shadow: 0 0 0 1px rgba(23, 49, 50, 0.1);
  display: inline-flex;
  height: 32px;
  justify-content: center;
  overflow: hidden;
  width: 32px;
}

.mello-auth-menu__avatar img {
  display: block;
  height: 100%;
  object-fit: cover;
  width: 100%;
}

.mello-auth-menu__avatar span {
  color: #173132;
  font-size: 13px;
  font-weight: 950;
}

.mello-auth-menu__trigger strong {
  display: inline-block;
  max-width: 92px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.mello-auth-menu__trigger.is-loading {
  cursor: wait;
  min-width: 82px;
  padding: 0 14px;
}

.mello-auth-menu__trigger.is-loading span {
  animation: mello-auth-pulse 900ms ease-in-out infinite alternate;
  background: rgba(23, 49, 50, 0.16);
  border-radius: 999px;
  height: 12px;
  width: 52px;
}

.mello-auth-menu__panel {
  background: #ffffff;
  border: 1px solid rgba(23, 49, 50, 0.1);
  border-radius: 14px;
  box-shadow: 0 22px 54px rgba(23, 49, 50, 0.16);
  display: grid;
  gap: 4px;
  min-width: 210px;
  padding: 8px;
  position: absolute;
  right: 0;
  top: calc(100% + 10px);
  z-index: 90;
}

.mello-auth-menu__panel a,
.mello-auth-menu__panel button {
  align-items: center;
  appearance: none;
  background: transparent;
  border: 0;
  border-radius: 10px;
  color: #173132;
  cursor: pointer;
  display: flex;
  font-family: var(--font-body-family);
  font-size: 14px;
  font-weight: 820;
  gap: 10px;
  min-height: 42px;
  padding: 0 10px;
  text-align: left;
  text-decoration: none;
  width: 100%;
}

.mello-auth-menu__panel a:hover,
.mello-auth-menu__panel button:hover,
.mello-auth-menu__panel a:focus-visible,
.mello-auth-menu__panel button:focus-visible {
  background: #eef9ff;
  outline: 0;
}

.mello-auth-menu__panel svg {
  color: #5a9091;
  height: 18px;
  width: 18px;
}

.mello-auth-menu-enter-active,
.mello-auth-menu-leave-active {
  transition: opacity 160ms ease, transform 160ms ease;
}

.mello-auth-menu-enter-from,
.mello-auth-menu-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

@keyframes mello-auth-pulse {
  to {
    opacity: 0.48;
  }
}

@media (max-width: 1120px) {
  .mello-auth-menu__trigger strong,
  .mello-auth-menu__signin span,
  .mello-auth-menu__signup {
    display: none;
  }

  .mello-auth-menu__signin,
  .mello-auth-menu__trigger {
    height: 42px;
    justify-content: center;
    padding: 0;
    width: 42px;
  }

  .mello-auth-menu__avatar {
    height: 34px;
    width: 34px;
  }
}

@media (max-width: 900px) {
  .mello-auth-menu__panel {
    right: -52px;
  }

  .mello-mobile-menu__auth-menu {
    min-width: 0;
    width: 100%;
  }

  .mello-mobile-menu__auth-menu .mello-auth-menu__guest {
    display: grid;
    gap: 10px;
    min-width: 0;
    width: 100%;
  }

  .mello-mobile-menu__auth-menu .mello-auth-menu__signin,
  .mello-mobile-menu__auth-menu .mello-auth-menu__signup {
    border-radius: 14px;
    display: flex;
    font-size: 15px;
    justify-content: center;
    min-height: 48px;
    min-width: 0;
    max-width: 100%;
    padding: 0 16px;
    text-align: center;
    white-space: normal;
    width: 100%;
  }

  .mello-mobile-menu__auth-menu .mello-auth-menu__signin {
    background: #eff9ff;
    color: #173132;
  }

  .mello-mobile-menu__auth-menu .mello-auth-menu__signup {
    background: #173132;
    color: #ffffff;
  }

  .mello-mobile-menu__auth-menu .mello-auth-menu__signin span,
  .mello-mobile-menu__auth-menu .mello-auth-menu__signup span {
    display: inline-block;
    min-width: 0;
    overflow-wrap: anywhere;
  }

}
</style>
