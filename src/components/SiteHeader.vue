<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { setLocale, supportedLocales } from '../i18n'

const props = defineProps({
  currentRoute: {
    type: String,
    default: '/'
  }
})

const { t, locale } = useI18n({ useScope: 'global' })
const navRef = ref(null)
const isMobileMenuOpen = ref(false)
const navIndicator = ref({
  width: '0px',
  transform: 'translate3d(5px, 0, 0)',
  opacity: 0
})
let navIndicatorTimer = 0

const links = [
  { key: 'nav.home', href: '/', matcher: (route) => route === '/' },
  { key: 'nav.products', href: '/collections/all', matcher: (route) => route.startsWith('/collections') || route === '/products' || route.startsWith('/products/') },
  { key: 'nav.contact', href: '/pages/contact-us', matcher: (route) => route === '/pages/contact-us' || route === '/pages/contact' },
  { key: 'nav.faq', href: '/pages/faq', matcher: (route) => route === '/pages/faq' || route === '/pages/faqs' }
]

const localeOptions = computed(() => supportedLocales.map((value) => ({
  value,
  label: t(`language.${value}`)
})))

function changeLocale(value) {
  setLocale(value)
}

function closeMobileMenu() {
  isMobileMenuOpen.value = false
}

function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

function moveIndicatorToLink(linkElement) {
  const navElement = navRef.value
  if (!navElement || !linkElement) return

  const navRect = navElement.getBoundingClientRect()
  const linkRect = linkElement.getBoundingClientRect()
  navIndicator.value = {
    width: `${Math.round(linkRect.width)}px`,
    transform: `translate3d(${Math.round(linkRect.left - navRect.left)}px, 0, 0)`,
    opacity: 1
  }
}

async function updateNavIndicator() {
  await nextTick()
  const activeLink = navRef.value?.querySelector('a.is-active')
  moveIndicatorToLink(activeLink)

  if (navIndicatorTimer) {
    window.clearTimeout(navIndicatorTimer)
  }

  navIndicatorTimer = window.setTimeout(() => {
    moveIndicatorToLink(navRef.value?.querySelector('a.is-active'))
  }, 210)
}

function previewNavSelection(event) {
  moveIndicatorToLink(event.currentTarget)
}

onMounted(() => {
  updateNavIndicator()
  window.addEventListener('resize', updateNavIndicator, { passive: true })
  window.addEventListener('keydown', handleEscape)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateNavIndicator)
  window.removeEventListener('keydown', handleEscape)
  document.documentElement.classList.remove('mello-mobile-menu-lock')

  if (navIndicatorTimer) {
    window.clearTimeout(navIndicatorTimer)
  }
})

function handleEscape(event) {
  if (event.key === 'Escape') {
    closeMobileMenu()
  }
}

watch(() => props.currentRoute, updateNavIndicator, { flush: 'post' })
watch(locale, updateNavIndicator, { flush: 'post' })
watch(() => props.currentRoute, closeMobileMenu)
watch(isMobileMenuOpen, (isOpen) => {
  document.documentElement.classList.toggle('mello-mobile-menu-lock', isOpen)
})
</script>

<template>
  <header class="mello-page-header mello-site-header">
    <div class="mello-page-header__inner">
      <a class="mello-page-header__logo" href="/" aria-label="MelloRise">
        <img src="/assets/logo-oficial.png" alt="MelloRise" width="1268" height="500" loading="eager">
      </a>

      <nav ref="navRef" class="mello-page-header__links" :aria-label="t('nav.main')">
        <span class="mello-page-header__nav-indicator" :style="navIndicator" aria-hidden="true"></span>
        <a
          v-for="link in links"
          :key="link.href"
          :href="link.href"
          :class="{ 'is-active': link.matcher(currentRoute) }"
          @click="previewNavSelection"
        >
          {{ t(link.key) }}
        </a>
      </nav>

      <div class="mello-page-header__actions">
        <a class="mello-page-header__cta" href="/products/wondernest-heightener-gummies-2026#comprar">{{ t('nav.cta') }}</a>
        <a class="mello-page-header__cart" href="/cart" :aria-label="t('nav.cart')">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 8h12l1 12H5L6 8Zm3 0a3 3 0 0 1 6 0"/></svg>
        </a>
        <div class="mello-page-header__locale" :aria-label="t('language.label')" role="group">
          <span class="mello-page-header__locale-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z"/><path d="M3.6 9h16.8"/><path d="M3.6 15h16.8"/><path d="M12 3c2.2 2.5 3.3 5.5 3.3 9s-1.1 6.5-3.3 9c-2.2-2.5-3.3-5.5-3.3-9S9.8 5.5 12 3Z"/></svg>
          </span>
          <button
            v-for="option in localeOptions"
            :key="option.value"
            class="mello-page-header__locale-option"
            :class="{ 'is-active': locale === option.value }"
            type="button"
            :aria-pressed="locale === option.value"
            @click="changeLocale(option.value)"
          >
            {{ option.label }}
          </button>
        </div>
        <button
          class="mello-page-header__menu-button"
          type="button"
          :aria-label="t('nav.menu')"
          :aria-expanded="isMobileMenuOpen"
          aria-controls="mello-mobile-menu"
          @click="toggleMobileMenu"
        >
          <span></span>
          <span></span>
        </button>
      </div>
    </div>
  </header>

  <div class="mello-mobile-menu" :class="{ 'is-open': isMobileMenuOpen }" :aria-hidden="!isMobileMenuOpen">
    <button class="mello-mobile-menu__overlay" type="button" :aria-label="t('nav.closeMenu')" @click="closeMobileMenu"></button>
    <aside id="mello-mobile-menu" class="mello-mobile-menu__panel" :aria-label="t('nav.main')">
      <div class="mello-mobile-menu__top">
        <img src="/assets/logo-oficial.png" alt="MelloRise" width="1268" height="500" loading="eager">
        <button class="mello-mobile-menu__close" type="button" :aria-label="t('nav.closeMenu')" @click="closeMobileMenu">
          <span></span>
        </button>
      </div>

      <nav class="mello-mobile-menu__links" :aria-label="t('nav.main')">
        <a
          v-for="link in links"
          :key="link.href"
          :href="link.href"
          :class="{ 'is-active': link.matcher(currentRoute) }"
          @click="closeMobileMenu"
        >
          {{ t(link.key) }}
        </a>
      </nav>

      <div class="mello-mobile-menu__actions">
        <a class="mello-mobile-menu__cta" href="/products/wondernest-heightener-gummies-2026#comprar" @click="closeMobileMenu">{{ t('nav.cta') }}</a>
        <a class="mello-mobile-menu__cart" href="/cart" @click="closeMobileMenu">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 8h12l1 12H5L6 8Zm3 0a3 3 0 0 1 6 0"/></svg>
          {{ t('nav.cart') }}
        </a>
      </div>
    </aside>
  </div>
</template>

<style>
.mello-page-header {
  --mph-ink: #173132;
  --mph-blue: #77cdfa;
  --mph-line: rgba(23, 49, 50, 0.12);
  --mph-muted: rgba(23, 49, 50, 0.68);
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: saturate(1.16) blur(18px);
  box-shadow: 0 1px 0 rgba(23, 49, 50, 0.08), 0 18px 36px rgba(23, 49, 50, 0.04);
  color: var(--mph-ink);
  font-family: var(--font-body-family);
  position: sticky;
  top: 0;
  z-index: 40;
}

.mello-page-header * {
  box-sizing: border-box;
  letter-spacing: 0;
}

.mello-page-header__inner {
  align-items: center;
  display: grid;
  gap: 24px;
  grid-template-columns: 1fr auto 1fr;
  margin: 0 auto;
  min-height: 78px;
  width: min(1210px, calc(100% - 40px));
}

.mello-page-header__logo {
  align-items: center;
  color: inherit;
  display: inline-flex;
  justify-self: start;
  text-decoration: none;
}

.mello-page-header__logo img {
  display: block;
  height: auto;
  max-height: 56px;
  object-fit: contain;
  transform: translateY(-1px);
  width: 98px;
}

.mello-page-header__links {
  align-items: center;
  background: rgba(232, 247, 255, 0.5);
  border-radius: 999px;
  display: flex;
  font-size: 14px;
  font-weight: 520;
  gap: 4px;
  justify-content: center;
  padding: 5px;
  position: relative;
}

.mello-page-header__nav-indicator {
  background: #ffffff;
  border-radius: 999px;
  box-shadow: 0 8px 22px rgba(23, 49, 50, 0.08);
  height: calc(100% - 10px);
  left: 0;
  opacity: 0;
  pointer-events: none;
  position: absolute;
  top: 5px;
  transition: transform 260ms cubic-bezier(0.22, 1, 0.36, 1), opacity 160ms ease;
  z-index: 0;
}

.mello-page-header__links a {
  align-items: center;
  border-radius: 999px;
  color: var(--mph-muted);
  display: inline-flex;
  min-height: 34px;
  padding: 0 14px;
  position: relative;
  text-decoration: none;
  transition: color 180ms ease, font-weight 180ms ease, transform 180ms ease;
  white-space: nowrap;
  z-index: 1;
}

.mello-page-header__links a::after {
  background: #77cdfa;
  border-radius: 999px;
  bottom: 5px;
  content: "";
  height: 2px;
  left: 50%;
  opacity: 0;
  position: absolute;
  transform: translateX(-50%) scaleX(0.55);
  transition: opacity 160ms ease, transform 160ms ease;
  width: 16px;
}

.mello-page-header__links a.is-active {
  color: #102829;
  font-weight: 850;
}

.mello-page-header__links a.is-active::after,
.mello-page-header__links a:hover::after {
  opacity: 1;
  transform: translateX(-50%) scaleX(1);
}

.mello-page-header__links a:hover {
  color: #102829;
}

.mello-page-header__actions {
  align-items: center;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  justify-self: end;
  min-width: 380px;
}

.mello-page-header__cta {
  align-items: center;
  background: var(--mph-blue);
  border-radius: 999px;
  color: #102829;
  display: inline-flex;
  font-size: 15px;
  font-weight: 820;
  justify-content: center;
  min-width: 172px;
  min-height: 48px;
  padding: 0 26px;
  box-shadow: 0 12px 24px rgba(119, 205, 250, 0.24);
  text-decoration: none;
  transition: box-shadow 180ms ease, transform 180ms ease;
}

.mello-page-header__cta:hover {
  box-shadow: 0 16px 30px rgba(119, 205, 250, 0.32);
  transform: translateY(-1px);
}

.mello-page-header__locale {
  align-items: center;
  background: rgba(239, 249, 255, 0.95);
  border-radius: 999px;
  color: #173132;
  display: inline-flex;
  flex: 0 0 auto;
  gap: 3px;
  min-height: 42px;
  padding: 4px;
}

.mello-page-header__locale-icon {
  align-items: center;
  color: #5a9091;
  display: inline-flex;
  height: 28px;
  justify-content: center;
  margin-left: 4px;
  width: 28px;
}

.mello-page-header__locale-icon svg {
  fill: none;
  height: 18px;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.8;
  width: 18px;
}

.mello-page-header__locale-option {
  appearance: none;
  background: transparent;
  border: 0;
  border-radius: 999px;
  color: rgba(23, 49, 50, 0.62);
  cursor: pointer;
  font-family: var(--font-body-family);
  font-size: 12px;
  font-weight: 650;
  height: 32px;
  line-height: 1;
  min-width: 40px;
  padding: 0 10px;
  transition: background 160ms ease, box-shadow 160ms ease, color 160ms ease;
}

.mello-page-header__locale-option.is-active {
  background: #ffffff;
  box-shadow: 0 8px 20px rgba(23, 49, 50, 0.1);
  color: #102829;
  font-weight: 850;
}

.mello-page-header__cart {
  align-items: center;
  background: #ffffff;
  box-shadow: inset 0 0 0 1px rgba(90, 144, 145, 0.36);
  border-radius: 50%;
  color: #5a9091;
  display: inline-flex;
  height: 42px;
  justify-content: center;
  text-decoration: none;
  transition: box-shadow 180ms ease, transform 180ms ease, color 180ms ease;
  width: 42px;
}

.mello-page-header__cart:hover {
  box-shadow: inset 0 0 0 1px rgba(90, 144, 145, 0.54), 0 10px 20px rgba(23, 49, 50, 0.08);
  color: #173132;
  transform: translateY(-1px);
}

.mello-page-header__cart svg {
  fill: none;
  height: 21px;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.9;
  width: 21px;
}

.mello-page-header__menu-button {
  align-items: center;
  appearance: none;
  background: #173132;
  border: 0;
  border-radius: 50%;
  color: #ffffff;
  cursor: pointer;
  display: none;
  flex-direction: column;
  gap: 5px;
  height: 42px;
  justify-content: center;
  padding: 0;
  width: 42px;
}

.mello-page-header__menu-button span {
  background: currentColor;
  border-radius: 999px;
  display: block;
  height: 2px;
  width: 18px;
}

.mello-mobile-menu {
  display: none;
}

.mello-mobile-menu-lock,
.mello-mobile-menu-lock body {
  overflow: hidden;
}

@media (max-width: 820px) {
  .mello-page-header__inner {
    gap: 12px;
    grid-template-columns: 1fr auto;
    min-height: 74px;
    padding: 10px 0;
    width: min(100% - 28px, 1210px);
  }

  .mello-page-header__actions {
    gap: 8px;
    min-width: 0;
  }

  .mello-page-header__logo img {
    width: 86px;
  }

  .mello-page-header__links {
    display: none;
  }

  .mello-page-header__cta {
    display: none;
  }

  .mello-page-header__locale {
    min-height: 38px;
  }

  .mello-page-header__locale-icon {
    display: none;
  }

  .mello-page-header__locale-option {
    height: 30px;
    min-width: 38px;
  }

  .mello-page-header__menu-button {
    display: inline-flex;
  }

  .mello-mobile-menu {
    display: block;
    inset: 0;
    opacity: 0;
    pointer-events: none;
    position: fixed;
    transition: opacity 180ms ease;
    z-index: 80;
  }

  .mello-mobile-menu.is-open {
    opacity: 1;
    pointer-events: auto;
  }

  .mello-mobile-menu__overlay {
    appearance: none;
    background: rgba(7, 20, 21, 0.36);
    backdrop-filter: blur(4px);
    border: 0;
    cursor: pointer;
    inset: 0;
    margin: 0;
    padding: 0;
    position: absolute;
  }

  .mello-mobile-menu__panel {
    background: #ffffff;
    border-radius: 0 0 22px 22px;
    box-shadow: 0 24px 60px rgba(23, 49, 50, 0.18);
    color: #173132;
    left: 0;
    padding: 16px 18px 22px;
    position: absolute;
    right: 0;
    top: 0;
    transform: translateY(-105%);
    transition: transform 260ms cubic-bezier(0.22, 1, 0.36, 1);
  }

  .mello-mobile-menu.is-open .mello-mobile-menu__panel {
    transform: translateY(0);
  }

  .mello-mobile-menu__top {
    align-items: center;
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
  }

  .mello-mobile-menu__top img {
    display: block;
    height: auto;
    width: 90px;
  }

  .mello-mobile-menu__close {
    align-items: center;
    appearance: none;
    background: rgba(232, 247, 255, 0.9);
    border: 0;
    border-radius: 50%;
    color: #173132;
    cursor: pointer;
    display: inline-flex;
    height: 42px;
    justify-content: center;
    padding: 0;
    width: 42px;
  }

  .mello-mobile-menu__close span,
  .mello-mobile-menu__close span::after {
    background: currentColor;
    border-radius: 999px;
    content: "";
    display: block;
    height: 2px;
    width: 20px;
  }

  .mello-mobile-menu__close span {
    transform: rotate(45deg);
  }

  .mello-mobile-menu__close span::after {
    transform: rotate(90deg);
  }

  .mello-mobile-menu__links {
    display: grid;
    gap: 8px;
  }

  .mello-mobile-menu__links a {
    align-items: center;
    background: #ffffff;
    border-radius: 14px;
    box-shadow: inset 0 0 0 1px rgba(23, 49, 50, 0.1);
    color: rgba(23, 49, 50, 0.74);
    display: flex;
    font-size: 18px;
    font-weight: 620;
    justify-content: space-between;
    min-height: 52px;
    padding: 0 16px;
    text-decoration: none;
  }

  .mello-mobile-menu__links a.is-active {
    background: #e8f7ff;
    box-shadow: inset 0 0 0 1px rgba(119, 205, 250, 0.48);
    color: #102829;
    font-weight: 850;
  }

  .mello-mobile-menu__links a::after {
    background: currentColor;
    border-radius: 50%;
    content: "";
    height: 7px;
    opacity: 0.24;
    width: 7px;
  }

  .mello-mobile-menu__links a.is-active::after {
    background: #77cdfa;
    opacity: 1;
  }

  .mello-mobile-menu__actions {
    display: grid;
    gap: 10px;
    grid-template-columns: 1fr auto;
    margin-top: 18px;
  }

  .mello-mobile-menu__cta,
  .mello-mobile-menu__cart {
    align-items: center;
    border-radius: 999px;
    display: inline-flex;
    font-size: 15px;
    font-weight: 820;
    justify-content: center;
    min-height: 48px;
    padding: 0 18px;
    text-decoration: none;
  }

  .mello-mobile-menu__cta {
    background: #77cdfa;
    color: #102829;
  }

  .mello-mobile-menu__cart {
    background: #173132;
    color: #ffffff;
    gap: 8px;
    min-width: 112px;
  }

  .mello-mobile-menu__cart svg {
    fill: none;
    height: 18px;
    stroke: currentColor;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: 1.9;
    width: 18px;
  }
}
</style>
